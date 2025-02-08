import fs from "fs/promises";
import path from "path";

// Types
type ResourceType = "service" | "controller" | "route" | "schema";

interface PaginationParams {
  page?: number | string;
  limit?: number | string;
}

interface ResourceData {
  id: number;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
  [key: string]: any;
}

interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    pages: number;
  };
}

interface Templates {
  controller: (singularName: string, pluralName: string) => string;
  service: (
    singularName: string,
    pluralName: string,
    capitalizedName: string
  ) => string;
  route: (singularName: string) => string;
  schema: (singularName: string, capitalizedName: string) => string;
}

type DirectoryMap = Record<ResourceType, string>;
type FilenameMap = Record<ResourceType, string>;

// Helper functions
export const capitalize = (str: string): string =>
  str.charAt(0).toUpperCase() + str.slice(1);
export const singular = (str: string): string =>
  str.endsWith("s") ? str.slice(0, -1) : str;
export const plural = (str: string): string =>
  str.endsWith("s") ? str : str + "s";

// Templates
export const templates: Templates = {
  controller: (
    singularName: string,
    pluralName: string
  ) => `import { Request as ExpressRequest, Response } from "express";
import { ${singularName}Service } from "../services/${singularName}.service";

const getAll = async (req: ExpressRequest, res: Response) => {
  const { page, limit } = req.query as { page?: string; limit?: string };
  const ${pluralName} = await ${singularName}Service.getAll({
    page: page ? parseInt(page) : undefined,
    limit: limit ? parseInt(limit) : undefined,
  });

  res.status(200).json({
    status: "success",
    ...${pluralName},
  });
};

const getById = async (req: ExpressRequest, res: Response) => {
  const ${singularName} = await ${singularName}Service.getById(parseInt(req.params.id));

  res.status(200).json({
    status: "success",
    data: ${singularName},
  });
};

const create = async (req: ExpressRequest, res: Response) => {
  const ${singularName} = await ${singularName}Service.create(req.body);

  res.status(201).json({
    status: "success",
    data: ${singularName},
  });
};

const update = async (req: ExpressRequest, res: Response) => {
  const ${singularName} = await ${singularName}Service.update(parseInt(req.params.id), req.body);

  res.status(200).json({
    status: "success",
    data: ${singularName},
  });
};

const partialUpdate = async (req: ExpressRequest, res: Response) => {
  const ${singularName} = await ${singularName}Service.update(parseInt(req.params.id), req.body);

  res.status(200).json({
    status: "success",
    data: ${singularName},
  });
};

const remove = async (req: ExpressRequest, res: Response) => {
  await ${singularName}Service.softDelete(parseInt(req.params.id));

  res.status(204).send();
};

const permanentlyDelete = async (req: ExpressRequest, res: Response) => {
  await ${singularName}Service.hardDelete(parseInt(req.params.id));

  res.status(204).send();
};

const recover = async (req: ExpressRequest, res: Response) => {
  const ${singularName} = await ${singularName}Service.recover(parseInt(req.params.id));

  res.status(200).json({
    status: "success",
    data: ${singularName},
  });
};

const getDeleted = async (req: ExpressRequest, res: Response) => {
  const { page, limit } = req.query as { page?: string; limit?: string };
  const ${pluralName} = await ${singularName}Service.getDeleted({
    page: page ? parseInt(page) : undefined,
    limit: limit ? parseInt(limit) : undefined,
  });

  res.status(200).json({
    status: "success",
    ...${pluralName},
  });
};

export const ${singularName}Controller = {
  getAll,
  getById,
  create,
  update,
  partialUpdate,
  remove,
  permanentlyDelete,
  recover,
  getDeleted,
};
`,

  service: (
    singularName: string,
    pluralName: string,
    capitalizedName: string
  ) => `
  import { NotFoundError } from "../utils/errors";

const getAll = async ({ page = 1, limit = 10 } = {}) => {
  // Mock pagination logic
  const offset = (page - 1) * limit;
  const mockCount = 100;
  // Mock data array
  const ${pluralName} = Array.from({ length: limit }).map((_, index) => ({
    id: offset + index + 1,
    // Add other mock fields as needed
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    deleted_at: null,
  }));

  return {
    data: ${pluralName},
    pagination: {
      total: mockCount,
      page,
      limit,
      pages: Math.ceil(mockCount / limit),
    },
  };
};

const getById = async (id: number) => {
  // Mock single record
  const ${singularName} = {
    id: parseInt(String(id)),
    // Add other mock fields as needed
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    deleted_at: null,
  };

  if (!${singularName}) {
    throw new NotFoundError("${capitalizedName} not found");
  }

  return ${singularName};
};

const create = async (data: Record<string, any>) => {
  const new${capitalizedName} = {
    id: Math.floor(Math.random() * 1000), // Mock ID generation
    ...data,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    deleted_at: null,
  };

  return new${capitalizedName};
};

const update = async (id: number, data: Record<string, any>) => {
  const updated${capitalizedName} = {
    id: parseInt(String(id)),
    ...data,
    updated_at: new Date().toISOString(),
  };

  if (!updated${capitalizedName}) {
    throw new NotFoundError("${capitalizedName} not found");
  }

  return updated${capitalizedName};
};

const softDelete = async (id: number) => {
  const deleted${capitalizedName} = {
    id: parseInt(String(id)),
    deleted_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };

  if (!deleted${capitalizedName}) {
    throw new NotFoundError("${capitalizedName} not found");
  }

  return deleted${capitalizedName};
};

const hardDelete = async (id: number) => {
  const deleted${capitalizedName} = {
    id: parseInt(String(id)),
  };

  if (!deleted${capitalizedName}) {
    throw new NotFoundError("${capitalizedName} not found");
  }

  return deleted${capitalizedName};
};

const recover = async (id: number) => {
  const recovered${capitalizedName} = {
    id: parseInt(String(id)),
    deleted_at: null,
    updated_at: new Date().toISOString(),
  };

  if (!recovered${capitalizedName}) {
    throw new NotFoundError("${capitalizedName} not found or not deleted");
  }

  return recovered${capitalizedName};
};

const getDeleted = async ({ page = 1, limit = 10 } = {}) => {
  // Mock pagination logic for deleted items
  const offset = (page - 1) * limit;
  const mockCount = 50; // Less deleted items than active ones

  // Mock deleted data array
  const ${pluralName} = Array(limit)
    .fill(null)
    .map((_, index) => ({
      id: offset + index + 1,
      // Add other mock fields as needed
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      deleted_at: new Date().toISOString(), // These are deleted items
    }));

  return {
    data: ${pluralName},
    pagination: {
      total: mockCount,
      page,
      limit,
      pages: Math.ceil(mockCount / limit),
    },
  };
};

export const ${singularName}Service = {
  getAll,
  getById,
  create,
  update,
  softDelete,
  hardDelete,
  recover,
  getDeleted,
};
`,

  route: (singularName: string) => `import express from "express";
import { ${singularName}Controller } from "../controllers/${singularName}.controller";
import { validate } from "../middleware/validate.middleware";
import { ${singularName}Schema } from "../schemas/${singularName}.schema";

const router = express.Router();

router.get(
  "/",
  validate({ query: ${singularName}Schema.query }),
  ${singularName}Controller.getAll
);

router.get(
  "/deleted",
  validate({ query: ${singularName}Schema.query }),
  ${singularName}Controller.getDeleted
);

router.get(
  "/:id",
  validate({ params: ${singularName}Schema.params }),
  ${singularName}Controller.getById
);

router.post(
  "/",
  validate({ body: ${singularName}Schema.create }),
  ${singularName}Controller.create
);

router.put(
  "/:id",
  validate({ params: ${singularName}Schema.params, body: ${singularName}Schema.update }),
  ${singularName}Controller.update
);

router.patch(
  "/:id",
  validate({ params: ${singularName}Schema.params, body: ${singularName}Schema.update }),
  ${singularName}Controller.partialUpdate
);

router.delete(
  "/:id",
  validate({ params: ${singularName}Schema.params }),
  ${singularName}Controller.remove
);

router.delete(
  "/:id/permanent",
  validate({ params: ${singularName}Schema.params }),
  ${singularName}Controller.permanentlyDelete
);

router.post(
  "/:id/recover",
  validate({ params: ${singularName}Schema.params }),
  ${singularName}Controller.recover
);

export default router;`,

  schema: (
    singularName: string,
    capitalizedName: string
  ) => `import { z } from "zod";

// Base schema for common fields
const ${singularName}BaseSchema = z.object({
  // Add your schema fields here
});

// Schema for creating a new ${singularName}
export const create${capitalizedName}Schema = ${singularName}BaseSchema;

// Schema for updating a ${singularName} (all fields optional)
export const update${capitalizedName}Schema = ${singularName}BaseSchema.partial();

// Schema for query parameters
export const ${singularName}QuerySchema = z.object({
  page: z.coerce.number().positive().optional(),
  limit: z.coerce.number().positive().optional(),
});

// Schema for ID parameter
export const idParamSchema = z.object({
  id: z.coerce.number().positive("Invalid ID"),
});

export const ${singularName}Schema = {
  params: idParamSchema,
  query: ${singularName}QuerySchema,
  create: create${capitalizedName}Schema,
  update: update${capitalizedName}Schema,
};`,
};

export const generateFile = async (
  type: ResourceType,
  resourceName: string
): Promise<void> => {
  const singularName = singular(resourceName.toLowerCase());
  const pluralName = plural(resourceName.toLowerCase());
  const capitalizedName = capitalize(singularName);

  const template: string = templates[type](
    singularName,
    pluralName,
    capitalizedName
  );

  const dirMap: DirectoryMap = {
    service: "server/services",
    controller: "server/controllers",
    route: "server/routes",
    schema: "server/schemas",
  };

  const filenameMap: FilenameMap = {
    service: `${singularName}.service.ts`,
    controller: `${singularName}.controller.ts`,
    route: `${pluralName}.route.ts`,
    schema: `${singularName}.schema.ts`,
  };

  try {
    const dir = dirMap[type];
    const filename = filenameMap[type];
    await fs.mkdir(dir, { recursive: true });
    await fs.writeFile(path.join(dir, filename), template);
    console.log(`✅ ${capitalize(type)} created: ${filename}`);
  } catch (error) {
    console.error(`Error creating ${type}:`, error);
    process.exit(1);
  }
};
