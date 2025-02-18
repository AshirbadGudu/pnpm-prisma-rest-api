import { PrismaClient, Prisma } from "@prisma/client";
import { NotFoundError } from "../utils/errors";

const prisma = new PrismaClient();

type NotificationType = "INFO" | "SUCCESS" | "WARNING" | "ERROR";

const getAll = async (userId: string, { page = 1, limit = 10 } = {}) => {
  const skip = (page - 1) * limit;

  const [notifications, total] = await Promise.all([
    prisma.notification.findMany({
      where: {
        userId,
        deletedAt: null,
      },
      skip,
      take: limit,
      orderBy: { createdAt: "desc" },
      include: {
        user: {
          select: {
            id: true,
            email: true,
            role: true,
          },
        },
      },
    }),
    prisma.notification.count({
      where: {
        userId,
        deletedAt: null,
      },
    }),
  ]);

  return {
    data: notifications,
    pagination: {
      total,
      page,
      limit,
      pages: Math.ceil(total / limit),
    },
  };
};

const getById = async (id: string) => {
  const notification = await prisma.notification.findUnique({
    where: {
      id,
      deletedAt: null,
    },
    include: {
      user: {
        select: {
          id: true,
          email: true,
          role: true,
        },
      },
    },
  });

  if (!notification) {
    throw new NotFoundError("Notification not found");
  }

  return notification;
};

const create = async (data: {
  title: string;
  message: string;
  type: NotificationType;
  userId: string;
}) => {
  // Validate user exists
  const user = await prisma.user.findUnique({
    where: { id: data.userId },
  });

  if (!user) {
    throw new Error("User not found");
  }

  return prisma.notification.create({
    data: {
      title: data.title,
      message: data.message,
      type: data.type,
      userId: data.userId,
    },
    include: {
      user: {
        select: {
          id: true,
          email: true,
          role: true,
        },
      },
    },
  });
};

const markAsRead = async (id: string) => {
  try {
    return await prisma.notification.update({
      where: {
        id,
        deletedAt: null,
      },
      data: {
        isRead: true,
        updatedAt: new Date(),
      },
      include: {
        user: {
          select: {
            id: true,
            email: true,
            role: true,
          },
        },
      },
    });
  } catch (error) {
    throw new NotFoundError("Notification not found");
  }
};

const markAllAsRead = async (userId: string) => {
  return prisma.notification.updateMany({
    where: {
      userId,
      isRead: false,
      deletedAt: null,
    },
    data: {
      isRead: true,
      updatedAt: new Date(),
    },
  });
};

const softDelete = async (id: string) => {
  try {
    return await prisma.notification.update({
      where: {
        id,
        deletedAt: null,
      },
      data: {
        deletedAt: new Date(),
        updatedAt: new Date(),
      },
    });
  } catch (error) {
    throw new NotFoundError("Notification not found");
  }
};

const getUnreadCount = async (userId: string) => {
  return prisma.notification.count({
    where: {
      userId,
      isRead: false,
      deletedAt: null,
    },
  });
};

export const notificationService = {
  getAll,
  getById,
  create,
  markAsRead,
  markAllAsRead,
  softDelete,
  getUnreadCount,
};
