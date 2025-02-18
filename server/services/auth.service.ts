import { PrismaClient } from "@prisma/client";
import type { User } from "@prisma/client";
import bcryptjs from "bcryptjs";
import { signToken } from "../utils/jwt";

const prisma = new PrismaClient();

interface LoginResponse {
  token: string;
  user: Omit<User, "password">;
}

export async function getUserByEmail(email: string): Promise<User | null> {
  console.log("Searching for user with email:", email);
  const user = await prisma.user.findUnique({
    where: {
      email,
      deletedAt: null, // Only get active users
    },
  });
  console.log("Found user:", user ? "Yes" : "No");
  return user;
}

export async function verifyPassword(
  plainPassword: string,
  hashedPassword: string
): Promise<boolean> {
  console.log("Verifying password");
  const isValid = await bcryptjs.compare(plainPassword, hashedPassword);
  console.log("Password valid:", isValid);
  return isValid;
}

export async function login(
  email: string,
  password: string
): Promise<LoginResponse> {
  console.log("Login attempt for email:", email);
  const user = await getUserByEmail(email);
  if (!user) {
    throw new Error("Invalid credentials");
  }

  const isPasswordValid = await verifyPassword(password, user.password);
  if (!isPasswordValid) {
    throw new Error("Invalid credentials");
  }

  // Create JWT token using our utility
  const token = signToken({
    id: user.id,
    email: user.email,
    role: user.role,
  });

  // Remove password from user object
  const { password: _, ...userWithoutPassword } = user;

  return {
    token,
    user: userWithoutPassword,
  };
}
