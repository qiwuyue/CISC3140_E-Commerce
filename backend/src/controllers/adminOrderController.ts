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

        const search =
            typeof req.query.search === "string"
                ? req.query.search.trim()
                : "";

        const status =
            typeof req.query.status === "string"
                ? req.query.status
                : "all";

        const page = Math.max(
            Number(req.query.page) || 1,
            1
        );

        const limit = Math.min(
            Math.max(Number(req.query.limit) || 10, 1),
            50
        );

        const skip = (page - 1) * limit;

        const where = {
            paymentStatus: "PAID" as const,
            ...(search && {
                OR: [
                    {
                        id: {
                            contains: search,
                            mode: "insensitive" as const,
                        },
                    },
                    {
                        shippingName: {
                            contains: search,
                            mode: "insensitive" as const,
                        },
                    },
                    {
                        shippingPhone: {
                            contains: search,
                        },
                    },
                ],
            }),

            ...(status === "PENDING" && {
                status: "PENDING" as const,
            }),

            ...(status === "PROCESSING" && {
                status: "PROCESSING" as const,
            }),

            ...(status === "SHIPPED" && {
                status: "SHIPPED" as const,
            }),

            ...(status === "DELIVERED" && {
                status: "DELIVERED" as const,
            }),

            ...(status === "CANCELLED" && {
                status: "CANCELLED" as const,
            }),
        };

        const [orders, total] = await Promise.all([
            prisma.order.findMany({
                where,
                include: {
                    items: true,
                    user: true,
                },

                orderBy: {
                    createdAt: "desc",
                },
                skip,
                take: limit,
            }),
            prisma.order.count({
                where,
            })]
        );

        return res.status(200).json({
            data: orders,
            pagination: {
                page,
                limit,
                total,
                totalPages: Math.ceil(total / limit),
            }
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