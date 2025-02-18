import {
  PrismaClient,
  Role,
  NotificationType,
  Notification,
} from "@prisma/client";
import bcryptjs from "bcryptjs";

const prisma = new PrismaClient();

const SALT_ROUNDS = 10;

// Mock data for users
const users = [
  // Admin users
  {
    email: "admin@example.com",
    password: "admin@123",
    role: Role.ADMIN,
  },
  {
    email: "superadmin@example.com",
    password: "admin@123",
    role: Role.ADMIN,
  },
  {
    email: "systemadmin@example.com",
    password: "admin@123",
    role: Role.ADMIN,
  },
  // Editor users
  {
    email: "editor@example.com",
    password: "editor@123",
    role: Role.EDITOR,
  },
  {
    email: "contenteditor@example.com",
    password: "editor@123",
    role: Role.EDITOR,
  },
  {
    email: "newseditor@example.com",
    password: "editor@123",
    role: Role.EDITOR,
  },
  {
    email: "techeditor@example.com",
    password: "editor@123",
    role: Role.EDITOR,
  },
  {
    email: "senioreditor@example.com",
    password: "editor@123",
    role: Role.EDITOR,
  },
  // Viewer users
  {
    email: "viewer@example.com",
    password: "viewer@123",
    role: Role.VIEWER,
  },
  {
    email: "user1@example.com",
    password: "viewer@123",
    role: Role.VIEWER,
  },
  {
    email: "user2@example.com",
    password: "viewer@123",
    role: Role.VIEWER,
  },
  {
    email: "reader@example.com",
    password: "viewer@123",
    role: Role.VIEWER,
  },
  {
    email: "subscriber@example.com",
    password: "viewer@123",
    role: Role.VIEWER,
  },
  {
    email: "guest@example.com",
    password: "viewer@123",
    role: Role.VIEWER,
  },
];

// Mock notification titles and messages
const notificationTemplates = [
  {
    title: "Welcome to the Platform",
    message:
      "Thank you for joining our platform. We hope you enjoy your experience!",
    type: NotificationType.INFO,
  },
  {
    title: "Profile Updated Successfully",
    message: "Your profile information has been updated successfully.",
    type: NotificationType.SUCCESS,
  },
  {
    title: "New Feature Available",
    message: "Check out our new messaging feature! Click here to try it out.",
    type: NotificationType.INFO,
  },
  {
    title: "Security Alert",
    message:
      "We noticed a login from a new device. Please verify if this was you.",
    type: NotificationType.WARNING,
  },
  {
    title: "Password Change Required",
    message:
      "For security reasons, please update your password within the next 7 days.",
    type: NotificationType.WARNING,
  },
  {
    title: "Account Verification Failed",
    message: "We could not verify your email address. Please try again.",
    type: NotificationType.ERROR,
  },
  {
    title: "Payment Processed",
    message: "Your recent payment has been processed successfully.",
    type: NotificationType.SUCCESS,
  },
  {
    title: "Document Shared",
    message: "A new document has been shared with you. Click to view.",
    type: NotificationType.INFO,
  },
  {
    title: "Task Assigned",
    message: "You have been assigned a new task. Check your dashboard.",
    type: NotificationType.INFO,
  },
  {
    title: "Maintenance Notice",
    message: "System maintenance scheduled for tonight at 2 AM UTC.",
    type: NotificationType.WARNING,
  },
];

// Function to generate random notifications
const generateNotifications = (
  userId: string,
  count: number
): Omit<Notification, "id">[] => {
  const notifications: Omit<Notification, "id">[] = [];
  const now = new Date();

  for (let i = 0; i < count; i++) {
    const template =
      notificationTemplates[
        Math.floor(Math.random() * notificationTemplates.length)
      ];
    const isRead = Math.random() > 0.5;
    const createdAt = new Date(
      now.getTime() - Math.random() * 30 * 24 * 60 * 60 * 1000
    ); // Random date within last 30 days

    notifications.push({
      userId,
      title: template.title,
      message: template.message,
      type: template.type,
      isRead,
      createdAt,
      updatedAt: createdAt,
      deletedAt: null,
    });
  }

  return notifications;
};

async function main() {
  console.log("Starting seeding...");

  // Clear existing data
  await prisma.notification.deleteMany();
  await prisma.user.deleteMany();

  console.log("Cleared existing data");

  // Create users
  const createdUsers = await Promise.all(
    users.map(async (user) => {
      const hashedPassword = await bcryptjs.hash(user.password, SALT_ROUNDS);
      return prisma.user.create({
        data: {
          email: user.email,
          password: hashedPassword,
          role: user.role,
        },
      });
    })
  );

  console.log("Created users by role:");
  const usersByRole = createdUsers.reduce((acc, user) => {
    acc[user.role] = (acc[user.role] || 0) + 1;
    return acc;
  }, {} as Record<Role, number>);

  Object.entries(usersByRole).forEach(([role, count]) => {
    console.log(`${role}: ${count} users`);
  });

  // Create notifications for each user
  for (const user of createdUsers) {
    // Generate more notifications for admins and editors
    const notificationCount =
      user.role === Role.ADMIN ? 15 : user.role === Role.EDITOR ? 12 : 8;

    const notifications = generateNotifications(user.id, notificationCount);
    await prisma.notification.createMany({
      data: notifications,
    });
    console.log(
      `Created ${notifications.length} notifications for ${user.role} user: ${user.email}`
    );
  }

  console.log("Seeding completed");
}

main()
  .catch((e) => {
    console.error("Error during seeding:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
