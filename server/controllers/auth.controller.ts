import { Request, Response, RequestHandler } from "express";
import { signToken } from "../utils/jwt";
import { getUserByEmail } from "../services/auth.service";

const login: RequestHandler = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await getUserByEmail(email);
    if (!user) {
      res.status(401).json({ message: "Invalid credentials" });
      return;
    }
    // For simplicity, using plain text password comparison. In production, use hashed passwords.
    if (user.password !== password) {
      res.status(401).json({ message: "Invalid credentials" });
      return;
    }
    const payload = { id: user.id, email: user.email, role: user.role };
    const token = signToken(payload);
    res.json({ token });
    return;
  } catch (error) {
    res.status(500).json({ message: "Server error" });
    return;
  }
};

export const authController = { login };
