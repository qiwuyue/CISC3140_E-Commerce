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

const categoryNames = [
  "Processors",
  "Graphics Cards",
  "Motherboards",
  "Memory",
  "Storage",
  "Power Supplies",
  "Cases",
  "Cooling",
] as const;

const brandNames = [
  "AMD",
  "Intel",
  "NVIDIA",
  "ASUS",
  "MSI",
  "Corsair",
  "Kingston",
  "Samsung",
  "Western Digital",
  "Seasonic",
  "NZXT",
  "Noctua",
] as const;

type SeedProduct = {
  sku: string;
  name: string;
  description: string;
  price: string;
  isActive: boolean;
  categoryName: (typeof categoryNames)[number];
  brandName: (typeof brandNames)[number];
};

const products: SeedProduct[] = [
  {
    sku: "CPU-AMD-7800X3D",
    name: "AMD Ryzen 7 7800X3D",
    description:
      "8-core gaming processor featuring AMD 3D V-Cache technology.",
    price: "369.99",
    isActive: true,
    categoryName: "Processors",
    brandName: "AMD",
  },
  {
    sku: "CPU-INTEL-265K",
    name: "Intel Core Ultra 7 265K",
    description:
      "High-performance desktop processor for gaming and productivity.",
    price: "379.99",
    isActive: true,
    categoryName: "Processors",
    brandName: "Intel",
  },
  {
    sku: "GPU-NVIDIA-RTX5070",
    name: "NVIDIA GeForce RTX 5070",
    description:
      "Graphics card designed for high-resolution gaming and creative work.",
    price: "549.99",
    isActive: true,
    categoryName: "Graphics Cards",
    brandName: "NVIDIA",
  },
  {
    sku: "GPU-AMD-RX9070XT",
    name: "AMD Radeon RX 9070 XT",
    description:
      "High-performance Radeon graphics card for modern gaming systems.",
    price: "649.99",
    isActive: true,
    categoryName: "Graphics Cards",
    brandName: "AMD",
  },
  {
    sku: "MB-ASUS-B650-PLUS",
    name: "ASUS TUF Gaming B650-PLUS WiFi",
    description:
      "AM5 motherboard with DDR5 memory support and integrated Wi-Fi.",
    price: "199.99",
    isActive: true,
    categoryName: "Motherboards",
    brandName: "ASUS",
  },
  {
    sku: "MB-MSI-Z890-TOMAHAWK",
    name: "MSI MAG Z890 Tomahawk WiFi",
    description:
      "Intel desktop motherboard with DDR5 support and integrated Wi-Fi.",
    price: "289.99",
    isActive: true,
    categoryName: "Motherboards",
    brandName: "MSI",
  },
  {
    sku: "RAM-CORSAIR-32-6000",
    name: "Corsair Vengeance 32GB DDR5-6000",
    description:
      "32GB dual-channel DDR5 memory kit for gaming and productivity.",
    price: "109.99",
    isActive: true,
    categoryName: "Memory",
    brandName: "Corsair",
  },
  {
    sku: "RAM-KINGSTON-32-6000",
    name: "Kingston FURY Beast 32GB DDR5-6000",
    description:
      "High-speed 32GB DDR5 memory kit for modern desktop computers.",
    price: "104.99",
    isActive: true,
    categoryName: "Memory",
    brandName: "Kingston",
  },
  {
    sku: "SSD-SAMSUNG-990PRO-2TB",
    name: "Samsung 990 PRO 2TB",
    description: "High-performance 2TB PCIe 4.0 NVMe solid-state drive.",
    price: "179.99",
    isActive: true,
    categoryName: "Storage",
    brandName: "Samsung",
  },
  {
    sku: "SSD-WD-SN850X-2TB",
    name: "WD_BLACK SN850X 2TB",
    description: "Fast 2TB NVMe solid-state drive designed for gaming systems.",
    price: "159.99",
    isActive: true,
    categoryName: "Storage",
    brandName: "Western Digital",
  },
  {
    sku: "PSU-CORSAIR-RM850E",
    name: "Corsair RM850e 850W",
    description:
      "Fully modular 850-watt power supply for high-performance computers.",
    price: "129.99",
    isActive: true,
    categoryName: "Power Supplies",
    brandName: "Corsair",
  },
  {
    sku: "PSU-SEASONIC-GX750",
    name: "Seasonic FOCUS GX-750",
    description:
      "Fully modular 750-watt power supply with high energy efficiency.",
    price: "119.99",
    isActive: true,
    categoryName: "Power Supplies",
    brandName: "Seasonic",
  },
  {
    sku: "CASE-NZXT-H7-FLOW",
    name: "NZXT H7 Flow",
    description:
      "Mid-tower computer case designed for airflow and easy cable management.",
    price: "129.99",
    isActive: true,
    categoryName: "Cases",
    brandName: "NZXT",
  },
  {
    sku: "CASE-CORSAIR-4000D",
    name: "Corsair 4000D Airflow",
    description:
      "Mid-tower case with a ventilated front panel and clean interior layout.",
    price: "104.99",
    isActive: true,
    categoryName: "Cases",
    brandName: "Corsair",
  },
  {
    sku: "COOLER-NOCTUA-NHD15",
    name: "Noctua NH-D15",
    description:
      "Dual-tower air cooler designed for quiet and efficient CPU cooling.",
    price: "109.99",
    isActive: true,
    categoryName: "Cooling",
    brandName: "Noctua",
  },
  {
    sku: "COOLER-CORSAIR-H100I",
    name: "Corsair iCUE H100i RGB Elite",
    description:
      "240mm all-in-one liquid CPU cooler with customizable RGB lighting.",
    price: "139.99",
    isActive: true,
    categoryName: "Cooling",
    brandName: "Corsair",
  },
];

function createSlug(value: string): string {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

async function main() {




  const categories = await Promise.all(
    categoryNames.map((name) => {
      const slug = createSlug(name);

      return prisma.category.upsert({
        where: { name },
        update: { slug },
        create: { name, slug },
      });
    }),
  );

  const brands = await Promise.all(
    brandNames.map((name) =>
      prisma.brand.upsert({
        where: { name },
        update: { slug: createSlug(name) },
        create: { name, slug: createSlug(name) },
      }),
    ),
  );

  const categoryIdByName = new Map(
    categories.map((category) => [category.name, category.id]),
  );

  const brandIdByName = new Map(
    brands.map((brand) => [brand.name, brand.id]),
  );

  for (const product of products) {
    const { categoryName, brandName, ...data } = product;
    const categoryId = categoryIdByName.get(categoryName);
    const brandId = brandIdByName.get(brandName);

    if (!categoryId) {
      throw new Error(`Category not found: ${categoryName}`);
    }

    if (!brandId) {
      throw new Error(`Brand not found: ${brandName}`);
    }

    const slug = createSlug(data.name);

    await prisma.product.upsert({
      where: { sku: data.sku },
      update: {
        ...data,
        slug,
        category: {
          connect: { id: categoryId },
        },
        brand: {
          connect: { id: brandId },
        },
      },
      create: {
        ...data,
        slug,
        category: {
          connect: { id: categoryId },
        },
        brand: {
          connect: { id: brandId },
        },
      },
    });

    console.log(`Upserted product: ${data.sku}`);
  }

  const [categoryCount, brandCount, productCount] = await Promise.all([
    prisma.category.count(),
    prisma.brand.count(),
    prisma.product.count(),
  ]);

  console.log("Seed completed successfully", {
    categories: categoryCount,
    brands: brandCount,
    products: productCount,
  });
}

main()
  .catch((error: unknown) => {
    console.error("Seed failed:", error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });