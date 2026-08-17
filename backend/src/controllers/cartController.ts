import type { Request, Response } from "express";
import { prisma } from "../lib/prisma.js";

export async function getCart(
  req: Request,
  res: Response
) {
  try {
    const userId = req.userId;

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

    res.status(200).json({
      data: cart,
    });
  } catch (error) {
    console.error("Error fetching cart:", error);

    res.status(500).json({
      error: "Internal server error",
    });
  }
}

export async function addCartItem(
  req: Request,
  res: Response
) {
  try {
    const userId = req.userId;

    if (!userId) {
      return res.status(401).json({
        error: "User not logged in",
      });
    }

    const { productId, quantity = 1 } = req.body;

    if (!productId) {
      return res.status(400).json({
        error: "productId is required",
      });
    }

    if (quantity < 1) {
      return res.status(400).json({
        error: "Quantity must be at least 1",
      });
    }

    const product = await prisma.product.findUnique({
      where: {
        id: productId,
      },
    });

    if (!product || !product.isActive) {
      return res.status(404).json({
        error: "Product not found",
      });
    }

    const cart = await prisma.cart.upsert({
      where: {
        userId,
      },
      update: {},
      create: {
        userId,
      },
    });

    const existingItem = await prisma.cartItem.findUnique({
      where: {
        cartId_productId: {
          cartId: cart.id,
          productId,
        },
      },
    });

    const currentQuantity = existingItem?.quantity ?? 0;
    const newQuantity = currentQuantity + quantity;

    if (newQuantity > product.quantity) {
      return res.status(400).json({
        error: "Not enough stock",
      });
    }

    const cartItem = existingItem
      ? await prisma.cartItem.update({
        where: {
          id: existingItem.id,
        },
        data: {
          quantity: existingItem.quantity + quantity,
        },
      })
      : await prisma.cartItem.create({
        data: {
          cartId: cart.id,
          productId,
          quantity,
        },
      });

    res.status(200).json({
      data: cartItem,
    });
  } catch (error) {
    console.error("Error adding cart item:", error);

    res.status(500).json({
      error: "Internal server error",
    });
  }
}

export async function updateCartItem(
  req: Request<{ id: string }>,
  res: Response
) {
  try {
    const userId = req.userId;
    const { id } = req.params;
    const { quantity } = req.body;

    if (!Number.isInteger(quantity) || quantity < 1) {
      return res.status(400).json({
        error: "Quantity must be at least 1",
      });
    }

    const existingItem = await prisma.cartItem.findFirst({
      where: {
        id,
        cart: {
          userId,
        },

      },
      include: {
        product: true,
      },
    });



    if (!existingItem) {
      return res.status(404).json({
        error: "Cart item not found",
      });
    }
    if (quantity > existingItem.product.quantity) {
      return res.status(400).json({
        error: "Not enough stock",
      });
    }

    const updatedItem = await prisma.cartItem.update({
      where: {
        id,
      },
      data: {
        quantity,
      },
    });

    res.status(200).json({
      data: updatedItem,
    });
  } catch (error) {
    console.error("Error updating cart item:", error);

    res.status(500).json({
      error: "Internal server error",
    });
  }
}

export async function deleteCartItem(
  req: Request<{ id: string }>,
  res: Response
) {
  try {
    const userId = req.userId;
    const { id } = req.params;

    const existingItem = await prisma.cartItem.findFirst({
      where: {
        id,
        cart: {
          userId,
        },
      },
    });

    if (!existingItem) {
      return res.status(404).json({
        error: "Cart item not found",
      });
    }

    await prisma.cartItem.delete({
      where: {
        id,
      },
    });

    res.status(200).json({
      message: "Cart item removed",
    });
  } catch (error) {
    console.error("Error deleting cart item:", error);

    res.status(500).json({
      error: "Internal server error",
    });
  }
}