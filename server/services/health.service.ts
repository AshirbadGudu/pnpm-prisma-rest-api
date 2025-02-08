import { NotFoundError } from "../utils/errors";

const getAll = async ({ page = 1, limit = 10 } = {}) => {
  // Mock pagination logic
  const offset = (page - 1) * limit;
  const mockCount = 100;
  // Mock data array
  const healths = Array.from({ length: limit }).map((_, index) => ({
    id: offset + index + 1,
    // Add other mock fields as needed
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    deleted_at: null,
  }));

  return {
    data: healths,
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
  const health = {
    id: parseInt(String(id)),
    // Add other mock fields as needed
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    deleted_at: null,
  };

  if (!health) {
    throw new NotFoundError("Health not found");
  }

  return health;
};

const create = async (data: Record<string, any>) => {
  const newHealth = {
    id: Math.floor(Math.random() * 1000), // Mock ID generation
    ...data,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    deleted_at: null,
  };

  return newHealth;
};

const update = async (id: number, data: Record<string, any>) => {
  const updatedHealth = {
    id: parseInt(String(id)),
    ...data,
    updated_at: new Date().toISOString(),
  };

  if (!updatedHealth) {
    throw new NotFoundError("Health not found");
  }

  return updatedHealth;
};

const softDelete = async (id: number) => {
  const deletedHealth = {
    id: parseInt(String(id)),
    deleted_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };

  if (!deletedHealth) {
    throw new NotFoundError("Health not found");
  }

  return deletedHealth;
};

const hardDelete = async (id: number) => {
  const deletedHealth = {
    id: parseInt(String(id)),
  };

  if (!deletedHealth) {
    throw new NotFoundError("Health not found");
  }

  return deletedHealth;
};

const recover = async (id: number) => {
  const recoveredHealth = {
    id: parseInt(String(id)),
    deleted_at: null,
    updated_at: new Date().toISOString(),
  };

  if (!recoveredHealth) {
    throw new NotFoundError("Health not found or not deleted");
  }

  return recoveredHealth;
};

const getDeleted = async ({ page = 1, limit = 10 } = {}) => {
  // Mock pagination logic for deleted items
  const offset = (page - 1) * limit;
  const mockCount = 50; // Less deleted items than active ones

  // Mock deleted data array
  const healths = Array(limit)
    .fill(null)
    .map((_, index) => ({
      id: offset + index + 1,
      // Add other mock fields as needed
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      deleted_at: new Date().toISOString(), // These are deleted items
    }));

  return {
    data: healths,
    pagination: {
      total: mockCount,
      page,
      limit,
      pages: Math.ceil(mockCount / limit),
    },
  };
};

export const healthService = {
  getAll,
  getById,
  create,
  update,
  softDelete,
  hardDelete,
  recover,
  getDeleted,
};
