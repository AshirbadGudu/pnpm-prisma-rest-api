import express from "express";
import { healthController } from "../controllers/health.controller";
import { validate } from "../middleware/validate.middleware";
import { healthSchema } from "../schemas/health.schema";

const router = express.Router();

router.get(
  "/",
  validate({ query: healthSchema.query }),
  healthController.getAll
);

router.get(
  "/deleted",
  validate({ query: healthSchema.query }),
  healthController.getDeleted
);

router.get(
  "/:id",
  validate({ params: healthSchema.params }),
  healthController.getById
);

router.post(
  "/",
  validate({ body: healthSchema.create }),
  healthController.create
);

router.put(
  "/:id",
  validate({ params: healthSchema.params, body: healthSchema.update }),
  healthController.update
);

router.patch(
  "/:id",
  validate({ params: healthSchema.params, body: healthSchema.update }),
  healthController.partialUpdate
);

router.delete(
  "/:id",
  validate({ params: healthSchema.params }),
  healthController.remove
);

router.delete(
  "/:id/permanent",
  validate({ params: healthSchema.params }),
  healthController.permanentlyDelete
);

router.post(
  "/:id/recover",
  validate({ params: healthSchema.params }),
  healthController.recover
);

export default router;