import cors from "cors";
import helmet from "helmet";
import express, { Express } from "express";

export const setupMiddleware = (app: Express) => {
  app.use(cors());
  app.use(helmet());
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
};
