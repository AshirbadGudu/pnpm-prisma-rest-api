import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "your_jwt_secret";

export interface JwtPayload {
  id: string;
  email: string;
  role: string;
}

export function signToken(
  payload: JwtPayload,
  expiresIn: string | number = "1h"
): string {
  const options: jwt.SignOptions = { expiresIn: expiresIn as any };
  return jwt.sign(payload, JWT_SECRET, options);
}

export function verifyToken(token: string): JwtPayload {
  return jwt.verify(token, JWT_SECRET) as JwtPayload;
}
