import { Router } from "express";
import {
  getOrders,
  getOrderById,
} from "../controllers/orderController.js";

import { requireAuth } from "../middleware/requireAuth.js";

const router = Router();

router.get("/", requireAuth, getOrders);

router.get("/:id", requireAuth, getOrderById);

export default router;