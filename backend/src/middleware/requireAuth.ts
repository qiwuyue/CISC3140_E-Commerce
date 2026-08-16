import type {
  Request,
  Response,
  NextFunction,
} from "express";

import { supabase } from "../lib/supabase.js";

export async function requireAuth(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const authHeader = req.headers.authorization;

  if (!authHeader?.startsWith("Bearer ")) {
    return res.status(401).json({
      error: "Unauthorized",
    });
  }

  const token = authHeader.split(" ")[1];

  const { data, error } =
    await supabase.auth.getClaims(token);

  if (error || !data?.claims?.sub) {
    return res.status(401).json({
      error: "Invalid or expired token",
    });
  }

  req.userId = data.claims.sub;

  next();
}