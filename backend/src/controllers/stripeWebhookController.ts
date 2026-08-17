import type { Request, Response } from "express";
import Stripe from "stripe";

import { stripe } from "../lib/stripe.js";
import { prisma } from "../lib/prisma.js";





export async function stripeWebhook(
    req: Request,
    res: Response
) {
    const signature = req.headers["stripe-signature"];
    const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
    if (!webhookSecret) {
        throw new Error("STRIPE_WEBHOOK_SECRET is not defined");
    }


    if (!signature) {
        return res.status(400).send("Missing Stripe signature");
    }

    let event: Stripe.Event;

    try {
        event = stripe.webhooks.constructEvent(
            req.body,
            signature,
            webhookSecret
        );
    } catch (error) {
        return res.status(400).send("Invalid webhook signature");
    }

    switch (event.type) {
        case "payment_intent.succeeded": {
            const paymentIntent =
                event.data.object as Stripe.PaymentIntent;

            await handlePaymentSucceeded(paymentIntent);

            break;
        }

        case "payment_intent.payment_failed": {
            const paymentIntent =
                event.data.object as Stripe.PaymentIntent;

            await handlePaymentFailed(paymentIntent);

            break;
        }
    }

    return res.status(200).json({
        received: true,
    });
}

async function handlePaymentSucceeded(
    paymentIntent: Stripe.PaymentIntent
) {
    await prisma.$transaction(async (tx) => {
        const order = await tx.order.findUnique({
            where: {
                paymentIntentId: paymentIntent.id,
            },

            include: {
                items: true,
            },
        });

        if (!order) {
            throw new Error("Order not found");
        }

        if (order.paymentStatus === "PAID") {
            return;
        }


        for (const item of order.items) {
            const result = await tx.product.updateMany({
                where: {
                    id: item.productId,

                    quantity: {
                        gte: item.quantity,
                    },

                    isActive: true,
                },

                data: {
                    quantity: {
                        decrement: item.quantity,
                    },
                },
            });

            if (result.count !== 1) {
                throw new Error("OUT_OF_STOCK");
            }
        }


        await tx.order.update({
            where: {
                id: order.id,
            },

            data: {
                paymentStatus: "PAID",
                status: "PROCESSING",
            },
        });


        const cart = await tx.cart.findUnique({
            where: {
                userId: order.userId,
            },
        });

        if (cart) {
            await tx.cartItem.deleteMany({
                where: {
                    cartId: cart.id,
                },
            });
        }
    });
}

async function handlePaymentFailed(
    paymentIntent: Stripe.PaymentIntent
) {
    await prisma.order.updateMany({
        where: {
            paymentIntentId: paymentIntent.id,
            paymentStatus: {
                not: "PAID",
            },
        },

        data: {
            paymentStatus: "FAILED",
        },
    });
}