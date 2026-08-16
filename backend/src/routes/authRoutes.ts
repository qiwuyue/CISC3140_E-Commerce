import { Router } from "express";

import { requireAuth } from "../middleware/requireAuth.js";
import { getMe } from "../controllers/authController.js";

const router = Router();

router.get("/me", requireAuth, getMe);

export default router;