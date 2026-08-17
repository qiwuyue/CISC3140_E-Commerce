import type {
  Request,
  Response,
  NextFunction,
} from "express";

import { prisma } from "../lib/prisma.js";

export async function requireAdmin(
  req: Request,
  res: Response,
  next: NextFunction
) {
  if (!req.userId) {
    return res.status(401).json({
      error: "Unauthorized",
    });
  }

  const profile = await prisma.profile.findUnique({
    where: {
      id: req.userId,
    },
    select: {
      role: true,
    },
  });

  if (!profile) {
    return res.status(401).json({
      error: "Unauthorized",
    });
  }

  if (profile.role !== "ADMIN") {
    return res.status(403).json({
      error: "Admin access required",
    });
  }

  next();
}