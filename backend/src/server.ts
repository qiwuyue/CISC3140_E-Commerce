import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import {prisma} from "./lib/prisma.js";
import process from "node:process";
dotenv.config();




const app = express();
const port = Number(process.env.PORT) || 4000;

app.use(
  cors({
    origin: process.env.FRONTEND_URL || "http://localhost:3000",
    credentials: true,
  }),
);

app.use(express.json());

app.get("/api/health", (_request, response) => {
  response.status(200).json({
    status: "ok",
    message: "MarcoCenter API is running",
  });
});
// API endpoint to fetch products with optional search query
app.get("/api/products", async (request, response) => {
  try {
    const query =
      typeof request.query.q === "string"
        ? request.query.q.trim()
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

    response.status(200).json({
      data: products,
    });
  } catch (error) {
    console.error("Error fetching products:", error);

    response.status(500).json({
      error: "Internal server error",
    });
  }
});
app.get("/api/products/:slug", async (request, response) => {
  try {
    const { slug } = request.params;

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
      response.status(404).json({
        error: "Product not found",
      });

      return;
    }

    response.status(200).json({
      data: product,
    });
  } catch (error) {
    console.error("Error fetching product:", error);

    response.status(500).json({
      error: "Internal server error",
    });
  }
});
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});