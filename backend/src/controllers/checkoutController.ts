import type {
  Request,
  Response,
  NextFunction,
} from "express";

import { prisma } from "../lib/prisma.js";
import { stripe } from "../lib/stripe.js";
import { checkoutSchema } from "@ecommerce/shared";

export async function checkout(
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
    const userId = req.userId;
    const validation = checkoutSchema.safeParse(req.body);

    if (!validation.success) {
      return res.status(400).json({
        error: "Invalid checkout data",
        issues: validation.error.issues,
      });
    }

    const shipping = validation.data;

    const cart = await prisma.cart.findUnique({
      where: {
        userId,
      },
      include: {
        items: {
          include: {
            product: true,
          },
        },
      },
    });

    if (!cart || cart.items.length === 0) {
      throw new Error("CART_EMPTY");
    }

    for (const item of cart.items) {
      if (!item.product.isActive) {
        throw new Error("PRODUCT_UNAVAILABLE");
      }

      if (item.quantity > item.product.quantity) {
        throw new Error("OUT_OF_STOCK");
      }
    }

    for (const item of cart.items) {
      if (!item.product.isActive) {
        return res.status(409).json({
          error: "A product in your cart is no longer available",
        });
      }

      if (item.quantity > item.product.quantity) {
        return res.status(409).json({
          error: "A product does not have enough stock",
        });
      }
    }
    const subtotalCents = cart.items.reduce(
      (total, item) => {
        const priceCents = Math.round(
          Number(item.product.price) * 100
        );

        return total + priceCents * item.quantity;
      },
      0
    );

    //free shipping, no tax yet
    const shippingCents = 0;
    const taxCents = 0;

    const totalCents =
      subtotalCents + shippingCents + taxCents;

    const paymentIntent =
      await stripe.paymentIntents.create({
        amount: totalCents,
        currency: "usd",

        automatic_payment_methods: {
          enabled: true,
        },
      });

    const order = await prisma.$transaction(async (tx) => {

      const freshCart = await tx.cart.findUnique({
        where: {
          userId,
        },
        include: {
          items: {
            include: {
              product: true,
            },
          },
        },
      });

      if (!freshCart || freshCart.items.length === 0) {
        throw new Error("CART_EMPTY");
      }

      const freshSubtotalCents =
        freshCart.items.reduce((total, item) => {
          const priceCents = Math.round(
            Number(item.product.price) * 100
          );

          return total + priceCents * item.quantity;
        }, 0);

      if (freshSubtotalCents !== subtotalCents) {
        throw new Error("CART_CHANGED");
      }

      


      const newOrder = await tx.order.create({
        data: {
          userId,

          paymentIntentId: paymentIntent.id,

          subtotal: (subtotalCents / 100).toFixed(2),
          shipping: (shippingCents / 100).toFixed(2),
          tax: (taxCents / 100).toFixed(2),
          total: (totalCents / 100).toFixed(2),

          shippingName: shipping.shippingName,
          shippingAddress1: shipping.shippingAddress1,

          shippingAddress2:
            shipping.shippingAddress2 || null,

          shippingCity: shipping.shippingCity,
          shippingState: shipping.shippingState,
          shippingPostalCode:
            shipping.shippingPostalCode,

          shippingCountry:
            shipping.shippingCountry,

          shippingPhone:
            shipping.shippingPhone || null,

          items: {
            create: cart.items.map((item) => ({
              productName: item.product.name,
              sku: item.product.sku,

              // order snapshot
              price: item.product.price,

              quantity: item.quantity,

              product: {
                connect: {
                  id: item.productId,
                },
              },
            })),
          },
        },

        include: {
          items: true,
        },
      });

      
      return newOrder;
    });

    if (!paymentIntent.client_secret) {
      return res.status(500).json({
        error: "Failed to initialize payment",
      });
    }

    return res.status(201).json({
      data: {
        orderId: order.id,
        clientSecret: paymentIntent.client_secret,
      }
    });
  } catch (error) {
    if (error instanceof Error) {
      if (error.message === "CART_EMPTY") {
        return res.status(400).json({
          error: "Your cart is empty",
        });
      }

      if (error.message === "PRODUCT_UNAVAILABLE") {
        return res.status(409).json({
          error: "A product in your cart is no longer available",
        });
      }

      if (error.message === "OUT_OF_STOCK") {
        return res.status(409).json({
          error: "A product does not have enough stock",
        });
      }
    }

    next(error);
  }
}