import { z } from "zod";

// Base schema for common fields
const healthBaseSchema = z.object({
  // Add your schema fields here
});

// Schema for creating a new health
export const createhealthsSchema = healthBaseSchema;

// Schema for updating a health (all fields optional)
export const updatehealthsSchema = healthBaseSchema.partial();

// Schema for query parameters
export const healthQuerySchema = z.object({
  page: z.coerce.number().positive().optional(),
  limit: z.coerce.number().positive().optional(),
});

// Schema for ID parameter
export const idParamSchema = z.object({
  id: z.coerce.number().positive("Invalid ID"),
});

export const healthSchema = {
  params: idParamSchema,
  query: healthQuerySchema,
  create: createhealthsSchema,
  update: updatehealthsSchema,
};