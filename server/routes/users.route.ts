import express from "express";
import { userController } from "../controllers/user.controller";
import { validate } from "../middleware/validate.middleware";
import { userSchema } from "../schemas/user.schema";
import { authenticate, authorize } from "../middleware/auth.middleware";

const router = express.Router();

router.get(
  "/",
  authenticate,
  authorize(["admin"]),
  validate({ query: userSchema.query }),
  userController.getAll
);

router.get(
  "/deleted",
  validate({ query: userSchema.query }),
  userController.getDeleted
);

router.get(
  "/:id",
  validate({ params: userSchema.params }),
  userController.getById
);

router.post("/", validate({ body: userSchema.create }), userController.create);

router.put(
  "/:id",
  validate({ params: userSchema.params, body: userSchema.update }),
  userController.update
);

router.patch(
  "/:id",
  validate({ params: userSchema.params, body: userSchema.update }),
  userController.partialUpdate
);

router.delete(
  "/:id",
  validate({ params: userSchema.params }),
  userController.remove
);

router.delete(
  "/:id/permanent",
  validate({ params: userSchema.params }),
  userController.permanentlyDelete
);

router.post(
  "/:id/recover",
  validate({ params: userSchema.params }),
  userController.recover
);

export default router;
