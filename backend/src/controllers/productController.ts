// controllers/productController.ts

import type { Request, Response } from "express";

import { prisma } from "../lib/prisma.js";

export async function getProducts(
  req: Request,
  res: Response
) {
   try {
    const query =
      typeof req.query.q === "string"
        ? req.query.q.trim()
        : "";

    const products = await prisma.product.findMany({
      where: {
        isActive: true,

        ...(query
          ? {
              OR: [
                {
                  name: {
                    contains: query,
                    mode: "insensitive",
                  },
                },
                {
                  description: {
                    contains: query,
                    mode: "insensitive",
                  },
                },
                {
                  sku: {
                    contains: query,
                    mode: "insensitive",
                  },
                },
                {
                  category: {
                    name: {
                      contains: query,
                      mode: "insensitive",
                    },
                  },
                },
                {
                  brand: {
                    name: {
                      contains: query,
                      mode: "insensitive",
                    },
                  },
                },
              ],
            }
          : {}),
      },

      include: {
        category: true,
        brand: true,
      },

      orderBy: {
        CreateAt: "desc",
      },
    });

    res.status(200).json({
      data: products,
    });
  } catch (error) {
    console.error("Error fetching products:", error);

    res.status(500).json({
      error: "Internal server error",
    });
  }
};

export async function getProductBySlug(
  req: Request<{ slug: string }>,
  res: Response
){

 try {
    const { slug } = req.params;

    const product = await prisma.product.findUnique({
      where: {
        slug,
      },
      include: {
        category: true,
        brand: true,
      },
    });

    if (!product || !product.isActive) {
      res.status(404).json({
        error: "Product not found",
      });

      return;
    }

    res.status(200).json({
      data: product,
    });
  } catch (error) {
    console.error("Error fetching product:", error);

    res.status(500).json({
      error: "Internal server error",
    });
  }
};

