import type {
  Request,
  Response,
  NextFunction,
} from "express";

import { prisma } from "../lib/prisma.js";

export async function getOrders(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    if (!req.userId) {
      return res.status(401).json({
        error: "Unauthorized",
      });
    }

    const orders = await prisma.order.findMany({
      where: {
        userId: req.userId,
        paymentStatus: "PAID",
      },

      include: {
        items: true,
      },

      orderBy: {
        createdAt: "desc",
      },
    });

    return res.status(200).json({
      data: orders,
    });
  } catch (error) {
    next(error);
  }
}

export async function getOrderById(
  req: Request<{id: string}>,
  res: Response,
  next: NextFunction
) {
  try {
    if (!req.userId) {
      return res.status(401).json({
        error: "Unauthorized",
      });
    }

    const { id } = req.params;

    const order = await prisma.order.findFirst({
      where: {
        id,
        userId: req.userId,
      },

      include: {
        items: true,
      },
    });

    if (!order) {
      return res.status(404).json({
        error: "Order not found",
      });
    }

    return res.status(200).json({
      data: order,
    });
  } catch (error) {
    next(error);
  }
}