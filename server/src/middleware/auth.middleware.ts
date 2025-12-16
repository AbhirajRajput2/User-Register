import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import User from "../models/User";

interface JwtPayload {
  id: string;
}

export interface AuthRequest extends Request {
  user?: any;
  cookies: {
    token?: string;
  };
}

const protect = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  const token = req.cookies?.token;

  if (!token) {
    return res.status(401).json({ message: "Not authorized" });
  }

  try {
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET as string
    ) as JwtPayload;

    req.user = await User.findById(decoded.id);
    next();
  } catch {
    return res.status(401).json({ message: "Invalid token" });
  }
};

export default protect; // 🔥 THIS LINE MUST EXIST
