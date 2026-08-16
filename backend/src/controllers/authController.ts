import type { Request, Response } from "express";

export function getMe(req: Request, res: Response) {
  res.json({
    message: "You are authenticated",
    userId: req.userId,
  });
}