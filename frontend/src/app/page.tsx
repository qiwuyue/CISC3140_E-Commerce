import Link from "next/link";
import ProductCard from "@/components/products/ProductCard";
import { getProducts } from "@/lib/product";

export default async function HomePage() {
  const products = await getProducts();
  const latestProducts = products.slice(0, 3);

  return (
    <section className="bg-white px-5 py-20">
  <div className="mx-auto max-w-7xl">
    <div className="mb-8 flex items-end justify-between gap-6">
      <div>
        <p className="text-sm font-semibold tracking-[0.1em] text-blue-600">
          LATEST PRODUCTS
        </p>

        <h2 className="mt-2 text-3xl font-semibold tracking-[-0.03em] text-slate-950">
          Explore our latest hardware
        </h2>
      </div>

      <Link
        href="/products"
        className="hidden text-sm font-medium text-slate-600 transition hover:text-blue-600 sm:block"
      >
        View all products →
      </Link>
    </div>

    {latestProducts.length === 0 ? (
      <p className="rounded-xl border border-dashed border-slate-300 p-10 text-center text-slate-500">
        No products are currently available.
      </p>
    ) : (
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {latestProducts.map((product) => (
          <ProductCard
            key={product.id}
            product={product}
          />
        ))}
      </div>
    )}

    <Link
      href="/products"
      className="mt-8 inline-block text-sm font-medium text-blue-600 sm:hidden"
    >
      View all products →
    </Link>
  </div>
</section>
  );
}