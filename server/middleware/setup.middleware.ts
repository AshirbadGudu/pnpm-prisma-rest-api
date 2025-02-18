import cors from "cors";
import helmet from "helmet";
import express, { Express } from "express";

export const setupMiddleware = (app: Express) => {
  // Basic middleware first
  app.use(cors());
  app.use(helmet());
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  // Add request body logging after body parsing middleware
  app.use((req, res, next) => {
    console.log("Raw body:", req.body);
    next();
  });
};
