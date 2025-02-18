import express, { Router, RequestHandler } from "express";
import { notificationController } from "../controllers/notification.controller";
import { authenticate } from "../middleware/auth.middleware";

const router: Router = express.Router();

// All notification routes require authentication
router.use(authenticate);

// Get all notifications for the authenticated user
router.get("/", notificationController.getAll as RequestHandler);

// Get unread notification count
router.get(
  "/unread/count",
  notificationController.getUnreadCount as RequestHandler
);

// Get a specific notification
router.get("/:id", notificationController.getById as RequestHandler);

// Create a new notification
router.post("/", notificationController.create as RequestHandler);

// Mark a notification as read
router.patch("/:id/read", notificationController.markAsRead as RequestHandler);

// Mark all notifications as read
router.patch(
  "/read/all",
  notificationController.markAllAsRead as RequestHandler
);

// Delete a notification (soft delete)
router.delete("/:id", notificationController.softDelete as RequestHandler);

export default router;
