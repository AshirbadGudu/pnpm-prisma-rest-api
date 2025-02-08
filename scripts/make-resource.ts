import { generateFile } from "./generators";
import fs from "fs/promises";
import { singular, plural } from "./generators";
import dotenv from "dotenv";

// Load environment variables
dotenv.config();

const resourceName = process.argv[2];
const PORT = process.env.PORT || 3000;

if (!resourceName) {
  console.error("Please provide a resource name");
  process.exit(1);
}

const generateRestFile = async (name: string, pluralName: string) => {
  const restTemplate = `### Get all ${pluralName} (default pagination)
GET http://localhost:${PORT}/api/v1/${pluralName}

### Get all ${pluralName} with pagination
GET http://localhost:${PORT}/api/v1/${pluralName}?page=1&limit=5

### Get deleted ${pluralName}
GET http://localhost:${PORT}/api/v1/${pluralName}/deleted

### Get deleted ${pluralName} with pagination
GET http://localhost:${PORT}/api/v1/${pluralName}/deleted?page=1&limit=5

### Get ${name} by ID
GET http://localhost:${PORT}/api/v1/${pluralName}/1

### Create new ${name}
POST http://localhost:${PORT}/api/v1/${pluralName}
Content-Type: application/json

{
  // Add your ${name} data here
}

### Update ${name}
PUT http://localhost:${PORT}/api/v1/${pluralName}/1
Content-Type: application/json

{
  // Add your ${name} data here
}

### Partial update ${name}
PATCH http://localhost:${PORT}/api/v1/${pluralName}/1
Content-Type: application/json

{
  // Add partial ${name} data here
}

### Soft delete ${name}
DELETE http://localhost:${PORT}/api/v1/${pluralName}/1

### Hard delete ${name} (permanent)
DELETE http://localhost:${PORT}/api/v1/${pluralName}/1/permanent

### Recover deleted ${name}
POST http://localhost:${PORT}/api/v1/${pluralName}/1/recover`;

  try {
    await fs.mkdir("test", { recursive: true });
    await fs.writeFile(`test/${pluralName}.rest`, restTemplate);
    return true;
  } catch (error) {
    console.error("Error creating REST file:", error);
    return false;
  }
};

const generateResource = async (name: string) => {
  try {
    const singularName = singular(name);
    const pluralName = plural(name);

    // Generate all components
    await generateFile("service", name);
    await generateFile("controller", name);
    await generateFile("schema", name);
    await generateFile("route", name);
    await generateRestFile(singularName, pluralName);

    console.log(`
✨ Resource ${name} created successfully!
Files created:
- server/services/${singularName}.service.js
- server/controllers/${singularName}.controller.js
- server/schema/${singularName}.schema.js
- server/routes/${pluralName}.routes.js
- test/${pluralName}.rest
    `);
  } catch (error) {
    console.error("Error creating resource:", error);
    process.exit(1);
  }
};

generateResource(resourceName);
