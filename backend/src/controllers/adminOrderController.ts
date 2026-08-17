import type {
    Request,
    Response,
    NextFunction,
} from "express";

import { prisma } from "../lib/prisma.js";
const allowedStatuses = [
    "PROCESSING",
    "SHIPPED",
    "DELIVERED",
    "CANCELLED",
] as const;
export async function getAdminOrders(
    req: Request,
    res: Response,
    next: NextFunction
) {
    try {
        const orders = await prisma.order.findMany({
            where: {
                paymentStatus: "PAID",
            },

            include: {
                items: true,
                user: true,
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
export async function getAdminOrder(
    req: Request<{ id: string }>,
    res: Response,
    next: NextFunction
) {
    try {
        const order = await prisma.order.findUnique({
            where: {
                id: req.params.id,
            },

            include: {
                items: true,
                user: true,
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
export async function updateOrderStatus(
    req: Request<{ id: string }>,
    res: Response,
    next: NextFunction
) {
    try {
        const { status } = req.body;

        if (
            !allowedStatuses.includes(
                status as (typeof allowedStatuses)[number]
            )
        ) {
            return res.status(400).json({
                error: "Invalid order status",
            });
        }

        const order = await prisma.order.findFirst({
            where: {
                id: req.params.id,
                paymentStatus: "PAID",
            },
        });

        if (!order) {
            return res.status(404).json({
                error: "Order not found",
            });
        }

        const updatedOrder = await prisma.order.update({
            where: {
                id: order.id,
            },

            data: {
                status,
            },
        });

        return res.status(200).json({
            data: updatedOrder,
        });
    } catch (error) {
        next(error);
    }
}