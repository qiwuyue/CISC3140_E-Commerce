import { Router } from "express";
import { requireAuth } from "../middleware/requireAuth.js";
import { initProfile, getProfile,updateProfile } from "../controllers/profileController.js";
const router = Router();

router.post("/init", requireAuth, initProfile);
router.get("/", requireAuth, getProfile);
router.patch("/", requireAuth, updateProfile);
export default router;