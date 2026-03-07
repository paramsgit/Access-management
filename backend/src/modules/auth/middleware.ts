import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import prisma from "../../db/prisma";
import TokenExtractor from "./getToken";

type JwtPayload = {
  userId: string;
  role: "ADMIN" | "USER";
};

export const authMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const token = TokenExtractor.getToken(req);
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as JwtPayload;

    const profile = await prisma.user.findFirst({
      where: { id: decoded.userId },
    });

    req.user = {
      ...profile,
      id: decoded.userId,
      role: decoded.role,
    };

    next();
  } catch (error) {
    return res.status(401).json({ message: "Invalid or expired token" });
  }
};
