import { Request, Response, NextFunction } from "express";
import { verifyToken, JwtPayload } from "../utils/jwt";

/**
 * Extends the Express Request interface to include a user property
 * that will store the decoded JWT payload after authentication
 */
interface AuthenticatedRequest extends Request {
  user?: JwtPayload;
}

/**
 * Middleware to authenticate incoming requests using JWT
 *
 * @param req - The incoming request object (with AuthenticatedRequest interface)
 * @param res - The response object
 * @param next - Function to pass control to next middleware
 *
 * This middleware:
 * 1. Checks for Authorization header
 * 2. Extracts the JWT token
 * 3. Verifies the token
 * 4. Attaches decoded user info to request object
 */
export function authenticate(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): void {
  // Get the Authorization header
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    res.status(401).json({ message: "No token provided" });
    return;
  }

  // Extract token from "Bearer <token>"
  const token = authHeader.split(" ")[1];
  try {
    // Verify token and decode payload
    const decoded = verifyToken(token);
    // Attach decoded user info to request
    req.user = decoded;
    next();
  } catch (error) {
    res.status(401).json({ message: "Invalid or expired token" });
    return;
  }
}

/**
 * Higher-order middleware function for role-based authorization
 *
 * @param roles - Array of role names that are allowed access
 * @returns Middleware function that checks user's role
 *
 * This middleware:
 * 1. Ensures request is authenticated (user exists)
 * 2. Checks if user's role is in allowed roles array
 * 3. Returns 403 if unauthorized, otherwise continues
 */
export function authorize(roles: string[]) {
  return (
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
  ): void => {
    // Verify user is authenticated
    if (!req.user) {
      res.status(401).json({ message: "Not authenticated" });
      return;
    }

    // Check if user's role is allowed
    if (!roles.includes(req.user.role)) {
      res.status(403).json({ message: "Forbidden: insufficient permissions" });
      return;
    }

    next();
  };
}
