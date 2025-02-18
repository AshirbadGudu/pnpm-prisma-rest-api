import { PrismaClient, Role } from "@prisma/client";
import { NotFoundError } from "../utils/errors";
import type { Prisma, User } from "@prisma/client";
import bcryptjs from "bcryptjs";

const prisma = new PrismaClient();
const SALT_ROUNDS = 10;

const getAll = async ({ page = 1, limit = 10 } = {}) => {
  const skip = (page - 1) * limit;

  const [users, total] = await Promise.all([
    prisma.user.findMany({
      where: { deletedAt: null },
      skip,
      take: limit,
      orderBy: { createdAt: "desc" },
    }),
    prisma.user.count({
      where: { deletedAt: null },
    }),
  ]);

  return {
    data: users,
    pagination: {
      total,
      page,
      limit,
      pages: Math.ceil(total / limit),
    },
  };
};

const getById = async (id: string) => {
  const user = await prisma.user.findUnique({
    where: {
      id,
      deletedAt: null,
    },
  });

  if (!user) {
    throw new NotFoundError("User not found");
  }

  return user;
};

const create = async (data: Prisma.UserCreateInput) => {
  if (!data.email || !data.password) {
    throw new Error("Email and password are required");
  }

  // Validate email format
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(data.email)) {
    throw new Error("Invalid email format");
  }

  // Check if email already exists
  const existingUser = await prisma.user.findUnique({
    where: { email: data.email },
  });
  if (existingUser) {
    throw new Error("Email already exists");
  }

  // Validate password strength (minimum 8 characters, at least one number and special char)
  const passwordRegex =
    /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/;
  if (!passwordRegex.test(data.password)) {
    throw new Error(
      "Password must be at least 8 characters long and contain at least one number and special character"
    );
  }

  // Hash password
  const hashedPassword = await bcryptjs.hash(data.password, SALT_ROUNDS);

  // Validate and set role (default to VIEWER if not provided or invalid)
  const role = data.role
    ? Object.values(Role).includes(data.role as Role)
      ? data.role
      : Role.VIEWER
    : Role.VIEWER;

  return prisma.user.create({
    data: {
      email: data.email,
      password: hashedPassword,
      role,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  });
};

const update = async (id: string, data: Record<string, any>) => {
  try {
    if (data.password) {
      data.password = await bcryptjs.hash(data.password, SALT_ROUNDS);
    }

    return await prisma.user.update({
      where: {
        id,
        deletedAt: null,
      },
      data: {
        ...data,
        updatedAt: new Date(),
      },
    });
  } catch (error) {
    throw new NotFoundError("User not found");
  }
};

const softDelete = async (id: string) => {
  try {
    return await prisma.user.update({
      where: {
        id,
        deletedAt: null,
      },
      data: {
        deletedAt: new Date(),
        updatedAt: new Date(),
      },
    });
  } catch (error) {
    throw new NotFoundError("User not found");
  }
};

const hardDelete = async (id: string) => {
  try {
    return await prisma.user.delete({
      where: { id },
    });
  } catch (error) {
    throw new NotFoundError("User not found");
  }
};

const recover = async (id: string) => {
  try {
    return await prisma.user.update({
      where: {
        id,
        NOT: { deletedAt: null },
      },
      data: {
        deletedAt: null,
        updatedAt: new Date(),
      },
    });
  } catch (error) {
    throw new NotFoundError("User not found or not deleted");
  }
};

const getDeleted = async ({ page = 1, limit = 10 } = {}) => {
  const skip = (page - 1) * limit;

  const [users, total] = await Promise.all([
    prisma.user.findMany({
      where: {
        NOT: { deletedAt: null },
      },
      skip,
      take: limit,
      orderBy: { deletedAt: "desc" },
    }),
    prisma.user.count({
      where: {
        NOT: { deletedAt: null },
      },
    }),
  ]);

  return {
    data: users,
    pagination: {
      total,
      page,
      limit,
      pages: Math.ceil(total / limit),
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
