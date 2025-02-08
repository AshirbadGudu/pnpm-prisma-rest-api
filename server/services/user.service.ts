
  import { NotFoundError } from "../utils/errors";

const getAll = async ({ page = 1, limit = 10 } = {}) => {
  // Mock pagination logic
  const offset = (page - 1) * limit;
  const mockCount = 100;
  // Mock data array
  const users = Array.from({ length: limit }).map((_, index) => ({
    id: offset + index + 1,
    // Add other mock fields as needed
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    deleted_at: null,
  }));

  return {
    data: users,
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
  const user = {
    id: parseInt(String(id)),
    // Add other mock fields as needed
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    deleted_at: null,
  };

  if (!user) {
    throw new NotFoundError("User not found");
  }

  return user;
};

const create = async (data: Record<string, any>) => {
  const newUser = {
    id: Math.floor(Math.random() * 1000), // Mock ID generation
    ...data,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    deleted_at: null,
  };

  return newUser;
};

const update = async (id: number, data: Record<string, any>) => {
  const updatedUser = {
    id: parseInt(String(id)),
    ...data,
    updated_at: new Date().toISOString(),
  };

  if (!updatedUser) {
    throw new NotFoundError("User not found");
  }

  return updatedUser;
};

const softDelete = async (id: number) => {
  const deletedUser = {
    id: parseInt(String(id)),
    deleted_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };

  if (!deletedUser) {
    throw new NotFoundError("User not found");
  }

  return deletedUser;
};

const hardDelete = async (id: number) => {
  const deletedUser = {
    id: parseInt(String(id)),
  };

  if (!deletedUser) {
    throw new NotFoundError("User not found");
  }

  return deletedUser;
};

const recover = async (id: number) => {
  const recoveredUser = {
    id: parseInt(String(id)),
    deleted_at: null,
    updated_at: new Date().toISOString(),
  };

  if (!recoveredUser) {
    throw new NotFoundError("User not found or not deleted");
  }

  return recoveredUser;
};

const getDeleted = async ({ page = 1, limit = 10 } = {}) => {
  // Mock pagination logic for deleted items
  const offset = (page - 1) * limit;
  const mockCount = 50; // Less deleted items than active ones

  // Mock deleted data array
  const users = Array(limit)
    .fill(null)
    .map((_, index) => ({
      id: offset + index + 1,
      // Add other mock fields as needed
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      deleted_at: new Date().toISOString(), // These are deleted items
    }));

  return {
    data: users,
    pagination: {
      total: mockCount,
      page,
      limit,
      pages: Math.ceil(mockCount / limit),
    },
  };
};

export const userService = {
  getAll,
  getById,
  create,
  update,
  softDelete,
  hardDelete,
  recover,
  getDeleted,
};
