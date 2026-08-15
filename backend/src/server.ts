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

app.get("/api/products", async (_request, response) => {
  try{

    const products = await prisma.product.findMany({
      where:{isActive:true},
      include: {
        category: true,
        brand: true,
      },
      orderBy: {
        CreateAt: "desc",
      },

    });
    response.status(200).json({ data: products });
  } catch (error) {
    console.error("Error fetching products:", error);
    response.status(500).json({ error: "Internal server error" });
  }
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});