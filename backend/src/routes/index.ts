import { Router } from "express";

import authRoutes from "./authRoutes.js";
import productRoutes from "./productRoutes.js";
import cartRoutes from "./cartRoutes.js";
import profileRoutes from "./profileRoutes.js";
import checkoutRoutes from "./checkoutRoutes.js";
import orderRoutes from "./orderRoutes.js";
const router = Router();

router.use("/auth", authRoutes);
router.use("/products", productRoutes);
router.use("/cart", cartRoutes);
router.use("/profile", profileRoutes);
router.use("/checkout", checkoutRoutes);
router.use("/orders", orderRoutes);
export default router;