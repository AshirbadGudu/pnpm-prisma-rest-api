import { Request, Response, RequestHandler } from "express";
import { login } from "../services/auth.service";

const loginHandler: RequestHandler = async (req, res) => {
  const { email, password } = req.body;
  try {
    const result = await login(email, password);
    res.json(result);
  } catch (error) {
    if (error instanceof Error) {
      res.status(401).json({ message: error.message });
    } else {
      res.status(500).json({ message: "Server error" });
    }
  }
};

export const authController = { login: loginHandler };
