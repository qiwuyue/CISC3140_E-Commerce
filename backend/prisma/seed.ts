import "dotenv/config";

import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../src/generated/prisma/client.js";

const connectionString = process.env.DIRECT_URL;

if (!connectionString) {
  throw new Error("DIRECT_URL is not configured");
}

const adapter = new PrismaPg({
  connectionString,
});

const prisma = new PrismaClient({
  adapter,
});

async function main() {
  const processors = await prisma.category.upsert({
    where: { slug: "processors" },
    update: { name: "Processors" },
    create: {
      name: "Processors",
      slug: "processors",
    },
  });

  const graphicsCards = await prisma.category.upsert({
    where: { slug: "graphics-cards" },
    update: { name: "Graphics Cards" },
    create: {
      name: "Graphics Cards",
      slug: "graphics-cards",
    },
  });

  const memory = await prisma.category.upsert({
    where: { slug: "memory" },
    update: { name: "Memory" },
    create: {
      name: "Memory",
      slug: "memory",
    },
  });

  const storage = await prisma.category.upsert({
    where: { slug: "storage" },
    update: { name: "Storage" },
    create: {
      name: "Storage",
      slug: "storage",
    },
  });

  const amd = await prisma.brand.upsert({
    where: { slug: "amd" },
    update: { name: "AMD" },
    create: {
      name: "AMD",
      slug: "amd",
    },
  });

  const intel = await prisma.brand.upsert({
    where: { slug: "intel" },
    update: { name: "Intel" },
    create: {
      name: "Intel",
      slug: "intel",
    },
  });

  const nvidia = await prisma.brand.upsert({
    where: { slug: "nvidia" },
    update: { name: "NVIDIA" },
    create: {
      name: "NVIDIA",
      slug: "nvidia",
    },
  });

  const corsair = await prisma.brand.upsert({
    where: { slug: "corsair" },
    update: { name: "Corsair" },
    create: {
      name: "Corsair",
      slug: "corsair",
    },
  });

  const samsung = await prisma.brand.upsert({
    where: { slug: "samsung" },
    update: { name: "Samsung" },
    create: {
      name: "Samsung",
      slug: "samsung",
    },
  });

  const products = [
    {
      sku: "AMD-9800X3D",
      name: "AMD Ryzen 7 9800X3D",
      slug: "amd-ryzen-7-9800x3d",
      description: "Eight-core gaming desktop processor.",
      price: "479.99",
      quantity: 12,
      categoryId: processors.id,
      brandId: amd.id,
    },
    {
      sku: "INTEL-265K",
      name: "Intel Core Ultra 7 265K",
      slug: "intel-core-ultra-7-265k",
      description: "Desktop processor for gaming and productivity.",
      price: "399.99",
      quantity: 8,
      categoryId: processors.id,
      brandId: intel.id,
    },
    {
      sku: "NVIDIA-RTX5070",
      name: "NVIDIA GeForce RTX 5070",
      slug: "nvidia-geforce-rtx-5070",
      description: "Graphics card for high-resolution gaming.",
      price: "549.99",
      quantity: 6,
      categoryId: graphicsCards.id,
      brandId: nvidia.id,
    },
    {
      sku: "AMD-RX9070XT",
      name: "AMD Radeon RX 9070 XT",
      slug: "amd-radeon-rx-9070-xt",
      description: "High-performance Radeon graphics card.",
      price: "649.99",
      quantity: 5,
      categoryId: graphicsCards.id,
      brandId: amd.id,
    },
    {
      sku: "CORSAIR-DDR5-32GB",
      name: "Corsair Vengeance 32GB DDR5-6000",
      slug: "corsair-vengeance-32gb-ddr5-6000",
      description: "32GB dual-channel DDR5 memory kit.",
      price: "109.99",
      quantity: 20,
      categoryId: memory.id,
      brandId: corsair.id,
    },
    {
      sku: "SAMSUNG-990PRO-2TB",
      name: "Samsung 990 PRO 2TB",
      slug: "samsung-990-pro-2tb",
      description: "High-performance 2TB NVMe solid-state drive.",
      price: "179.99",
      quantity: 15,
      categoryId: storage.id,
      brandId: samsung.id,
    },
  ];

  for (const product of products) {
    const { categoryId, brandId, ...data } = product;

    await prisma.product.upsert({
      where: {
        sku: data.sku,
      },
      update: {
        ...data,
        category: {
          connect: { id: categoryId },
        },
        brand: {
          connect: { id: brandId },
        },
      },
      create: {
        ...data,
        category: {
          connect: { id: categoryId },
        },
        brand: {
          connect: { id: brandId },
        },
      },
    })
  }

  console.log(`Seeded ${products.length} products.`);
}

main()
  .catch((error) => {
    console.error("Seeding failed:", error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });