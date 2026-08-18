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
    //sorting product    
    const sort =
      typeof req.query.sort === "string"
        ? req.query.sort
        : "newest";
    //pagination
    const page = Math.max(
      Number(req.query.page) || 1,
      1
    );

    const limit = 12;

    const skip = (page - 1) * limit;
    let orderBy;

    switch (sort) {
      case "price_asc":
        orderBy = {
          price: "asc" as const,
        };
        break;

      case "price_desc":
        orderBy = {
          price: "desc" as const,
        };
        break;

      case "name_asc":
        orderBy = {
          name: "asc" as const,
        };
        break;

      case "newest":
      default:
        orderBy = {
          CreateAt: "desc" as const,
        };
    }

    const where = {
      isActive: true,

      ...(query
        ? {
          OR: [
            {
              name: {
                contains: query,
                mode: "insensitive" as const,
              },
            },
            {
              description: {
                contains: query,
                mode: "insensitive" as const,
              },
            },
            {
              sku: {
                contains: query,
                mode: "insensitive" as const,
              },
            },
            {
              category: {
                name: {
                  contains: query,
                  mode: "insensitive" as const,
                },
              },
            },
            {
              brand: {
                name: {
                  contains: query,
                  mode: "insensitive" as const,
                },
              },
            },
          ],
        }
        : {}),
    };

    const [products, total] = await Promise.all([
      prisma.product.findMany({
        where,

        include: {
          category: true,
          brand: true,
        },

        orderBy,
        skip,
        take: limit,
      }),

      prisma.product.count({
        where,
      }),
    ]);

    const totalPages = Math.ceil(total / limit);
    
    res.status(200).json({
      data: products,

      pagination: {
        page,
        limit,
        total,
        totalPages,
      },
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
) {

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

