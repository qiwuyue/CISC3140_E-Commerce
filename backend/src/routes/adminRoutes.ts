import { Router } from "express";
import { requireAuth } from "../middleware/requireAuth.js";
import { requireAdmin } from "../middleware/requireAdmin.js";
import { getAdminProducts, createProduct, getProductOptions, updateProduct, getAdminProduct } from "../controllers/adminProductController.js";
import { getAdminOrders,getAdminOrder,updateOrderStatus } from "../controllers/adminOrderController.js";
const router = Router();

router.get(
  "/check",
  requireAuth,
  requireAdmin,
  (req, res) => {
    return res.status(200).json({
      message: "Admin access granted",
    });
  }
);

router.get(
  "/products",
  requireAuth,
  requireAdmin,
  getAdminProducts,
  getProductOptions
);
router.get(
  "/products/:id",
  requireAuth,
  requireAdmin,
  getAdminProduct,

);
router.post(
  "/products",
  requireAuth,
  requireAdmin,
  createProduct

);
router.get(
  "/product-options",
  requireAuth,
  requireAdmin,
  getProductOptions
);

router.patch(
  "/products/:id",
  requireAuth,
  requireAdmin,
  updateProduct
);

router.get(
  "/orders",
  requireAuth,
  requireAdmin,
  getAdminOrders
);
router.get(
  "/orders/:id",
  requireAuth,
  requireAdmin,
  getAdminOrder
);
router.patch(
  "/orders/:id/status",
  requireAuth,
  requireAdmin,
  updateOrderStatus
);

export default router;