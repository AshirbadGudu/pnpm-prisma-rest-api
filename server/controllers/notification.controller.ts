import { Request, Response, RequestHandler } from "express";
import { notificationService } from "../services/notification.service";
import { JwtPayload } from "../utils/jwt";

// Extend Request type to include user property
interface AuthenticatedRequest extends Request {
  user?: JwtPayload;
}

// Custom type for authenticated request handlers
type AuthenticatedRequestHandler = (
  req: AuthenticatedRequest,
  res: Response,
  next: () => void
) => Promise<void> | void;

const getAll: AuthenticatedRequestHandler = async (req, res) => {
  const { page, limit } = req.query as { page?: string; limit?: string };
  const userId = req.user?.id;

  if (!userId) {
    res.status(401).json({ message: "Unauthorized" });
    return;
  }

  const notifications = await notificationService.getAll(userId, {
    page: page ? parseInt(page) : undefined,
    limit: limit ? parseInt(limit) : undefined,
  });

  res.status(200).json({
    status: "success",
    ...notifications,
  });
};

const getById: AuthenticatedRequestHandler = async (req, res) => {
  const notification = await notificationService.getById(req.params.id);

  // Check if the notification belongs to the requesting user
  if (notification.userId !== req.user?.id) {
    res.status(403).json({ message: "Forbidden" });
    return;
  }

  res.status(200).json({
    status: "success",
    data: notification,
  });
};

const create: AuthenticatedRequestHandler = async (req, res) => {
  try {
    const notification = await notificationService.create({
      ...req.body,
      userId: req.body.userId || req.user?.id,
    });

    res.status(201).json({
      status: "success",
      data: notification,
    });
  } catch (error) {
    if (error instanceof Error) {
      res.status(400).json({ error: error.message });
    } else {
      res.status(500).json({ error: "Internal server error" });
    }
  }
};

const markAsRead: AuthenticatedRequestHandler = async (req, res) => {
  const notification = await notificationService.getById(req.params.id);

  // Check if the notification belongs to the requesting user
  if (notification.userId !== req.user?.id) {
    res.status(403).json({ message: "Forbidden" });
    return;
  }

  const updatedNotification = await notificationService.markAsRead(
    req.params.id
  );

  res.status(200).json({
    status: "success",
    data: updatedNotification,
  });
};

const markAllAsRead: AuthenticatedRequestHandler = async (req, res) => {
  const userId = req.user?.id;

  if (!userId) {
    res.status(401).json({ message: "Unauthorized" });
    return;
  }

  await notificationService.markAllAsRead(userId);

  res.status(200).json({
    status: "success",
    message: "All notifications marked as read",
  });
};

const softDelete: AuthenticatedRequestHandler = async (req, res) => {
  const notification = await notificationService.getById(req.params.id);

  // Check if the notification belongs to the requesting user
  if (notification.userId !== req.user?.id) {
    res.status(403).json({ message: "Forbidden" });
    return;
  }

  await notificationService.softDelete(req.params.id);

  res.status(200).json({
    status: "success",
    message: "Notification deleted",
  });
};

const getUnreadCount: AuthenticatedRequestHandler = async (req, res) => {
  const userId = req.user?.id;

  if (!userId) {
    res.status(401).json({ message: "Unauthorized" });
    return;
  }

  const count = await notificationService.getUnreadCount(userId);

  res.status(200).json({
    status: "success",
    data: { count },
  });
};

export const notificationController = {
  getAll,
  getById,
  create,
  markAsRead,
  markAllAsRead,
  softDelete,
  getUnreadCount,
};
