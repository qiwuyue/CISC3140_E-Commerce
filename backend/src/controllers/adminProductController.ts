import type { Request, Response, NextFunction } from "express";
import { prisma } from "../lib/prisma.js";
import { createProductSchema,updateProductSchema } from "@ecommerce/shared";
export async function getAdminProducts(
    req: Request,
    res: Response,
    next: NextFunction
) {
    try {
        const products = await prisma.product.findMany({
            orderBy: {
                CreateAt: "desc",
            },
        });

        return res.status(200).json({
            data: products,
        });
    } catch (error) {
        next(error);
    }
}
export async function createProduct(
    req: Request,
    res: Response,
    next: NextFunction
) {
    try {
        const validation =
            createProductSchema.safeParse(req.body);

        if (!validation.success) {
            return res.status(400).json({
                error: "Invalid product data",
                issues: validation.error.issues,
            });
        }

        const data = validation.data;

        const existingProduct =
            await prisma.product.findUnique({
                where: {
                    sku: data.sku,
                },
            });

        if (existingProduct) {
            return res.status(409).json({
                error: "SKU already exists",
            });
        }
        //auto generate slug based on product name
        function createSlug(name: string) {
            return name
                .toLowerCase()
                .trim()
                .replace(/[^a-z0-9]+/g, "-")
                .replace(/^-|-$/g, "");
        }
        //avoid same product name with dupilicated slug
        async function createUniqueSlug(name: string) {
        const baseSlug = createSlug(name);

        let slug = baseSlug;
        let count = 2;

        while (
            await prisma.product.findUnique({
            where: { slug },
            })
        ) {
            slug = `${baseSlug}-${count}`;
            count++;
        }

        return slug;
        }
        const slug = await createUniqueSlug(data.name);
        const product = await prisma.product.create({
            data: {
                name: data.name,
                slug: slug,
                description: data.description,
                category: { connect: { id: data.categoryId, } },

                brand: {
                    connect: {
                        id: data.brandId,
                    },
                },

                sku: data.sku,
                price: data.price,
                quantity: data.quantity,
                isActive: data.isActive,
            },
        });

        return res.status(201).json({
            data: product,
        });
    } catch (error) {
        next(error);
    }
}
export async function getProductOptions(
    req: Request,
    res: Response,
    next: NextFunction
) {
    try {
        const [categories, brands] = await Promise.all([
            prisma.category.findMany({
                select: {
                    id: true,
                    name: true,
                },
                orderBy: {
                    name: "asc",
                },
            }),

            prisma.brand.findMany({
                select: {
                    id: true,
                    name: true,
                },
                orderBy: {
                    name: "asc",
                },
            }),
        ]);

        return res.status(200).json({
            data: {
                categories,
                brands,
            },
        });
    } catch (error) {
        next(error);
    }
}
export async function getAdminProduct(
  req: Request<{ id: string }>,
  res: Response,
  next: NextFunction
) {
  try {
    const product = await prisma.product.findUnique({
      where: {
        id: req.params.id,
      },

      include: {
        category: true,
        brand: true,
      },
    });

    if (!product) {
      return res.status(404).json({
        error: "Product not found",
      });
    }

    return res.status(200).json({
      data: product,
    });
  } catch (error) {
    next(error);
  }
}
export async function updateProduct(
  req: Request<{ id: string }>,
  res: Response,
  next: NextFunction
) {
  try {
    const validation =
      updateProductSchema.safeParse(req.body);

    if (!validation.success) {
      return res.status(400).json({
        error: "Invalid product data",
        issues: validation.error.issues,
      });
    }

    const data = validation.data;

    const existingProduct =
      await prisma.product.findUnique({
        where: {
          id: req.params.id,
        },
      });

    if (!existingProduct) {
      return res.status(404).json({
        error: "Product not found",
      });
    }

    const product = await prisma.product.update({
      where: {
        id: req.params.id,
      },

      data: {
        ...(data.name !== undefined && {
          name: data.name,
        }),

        ...(data.description !== undefined && {
          description: data.description,
        }),

        ...(data.sku !== undefined && {
          sku: data.sku,
        }),

        ...(data.price !== undefined && {
          price: data.price,
        }),

        ...(data.quantity !== undefined && {
          quantity: data.quantity,
        }),

        ...(data.isActive !== undefined && {
          isActive: data.isActive,
        }),

        ...(data.categoryId !== undefined && {
          category: {
            connect: {
              id: data.categoryId,
            },
          },
        }),

        ...(data.brandId !== undefined && {
          brand: {
            connect: {
              id: data.brandId,
            },
          },
        }),
      },
    });

    return res.status(200).json({
      data: product,
    });
  } catch (error) {
    next(error);
  }
}