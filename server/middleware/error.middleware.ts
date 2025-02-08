import { NextFunction, Request, Response } from "express";
import { NotFoundError } from "../utils/errors";

// Global error handler
export const errorHandler = (
  err: Error,
  _req: Request,
  res: Response,
  _next: NextFunction
) => {
  const statusCode = (err as any).statusCode || 500;
  const status = statusCode >= 500 ? "error" : "fail";

  // Log error in development
  if (process.env.NODE_ENV === "development") {
    console.error("ERROR:", err);
  }

  res.json({
    status,
    statusCode,
    message: err.message,
    ...(process.env.NODE_ENV === "development" && { stack: err.stack }),
  });
};

// Handle 404 errors
export const notFoundMiddleware = (
  _req: Request,
  _res: Response,
  next: NextFunction
) => {
  next(new NotFoundError("Route not found"));
};
