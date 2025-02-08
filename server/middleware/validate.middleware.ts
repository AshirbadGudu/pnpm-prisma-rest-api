import { ZodError } from "zod";
import { ValidationError } from "../utils/errors";
import { NextFunction, Request, Response } from "express";
export const validate = (schema: any) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      if (schema.params) {
        req.params = await schema.params.parseAsync(req.params);
      }
      if (schema.query) {
        req.query = await schema.query.parseAsync(req.query);
      }
      if (schema.body) {
        req.body = await schema.body.parseAsync(req.body);
      }
      next();
    } catch (error) {
      if (error instanceof ZodError && error.errors) {
        const formattedErrors = error.errors.map((err) => ({
          field: err.path.join("."),
          message: err.message,
        }));
        const formattedErrorMessage = formattedErrors
          .map((err) => `${err.field}: ${err.message}`)
          .join(", ");

        next(new ValidationError(formattedErrorMessage));
      } else {
        next(error);
      }
    }
  };
};
