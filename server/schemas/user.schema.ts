import { z } from "zod";

// Base schema for common fields
const userBaseSchema = z.object({
  // Add your schema fields here
});

// Schema for creating a new user
export const createusersSchema = userBaseSchema;

// Schema for updating a user (all fields optional)
export const updateusersSchema = userBaseSchema.partial();

// Schema for query parameters
export const userQuerySchema = z.object({
  page: z.coerce.number().positive().optional(),
  limit: z.coerce.number().positive().optional(),
});

// Schema for ID parameter
export const idParamSchema = z.object({
  id: z.coerce.number().positive("Invalid ID"),
});

export const userSchema = {
  params: idParamSchema,
  query: userQuerySchema,
  create: createusersSchema,
  update: updateusersSchema,
};