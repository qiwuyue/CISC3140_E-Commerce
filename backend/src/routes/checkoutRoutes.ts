import { Router } from "express";
import { requireAuth } from "../middleware/requireAuth.js";
import { checkout } from "../controllers/checkoutController.js";

const router=Router();

router.post("/", requireAuth, checkout);

export default router;