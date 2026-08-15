import ProductCard from "@/components/products/ProductCard";
import { getProducts } from "@/lib/product";

export default async function ProductsPage() {
  const products = await getProducts();

  return (
    <main className="min-h-screen bg-slate-50 px-5 py-12">
      <div className="mx-auto max-w-7xl">
        <header className="mb-8">
          <h1 className="text-3xl font-bold text-slate-950">
            Products
          </h1>

          <p className="mt-2 text-slate-600">
            Browse our latest computer hardware.
          </p>
        </header>

        {products.length === 0 ? (
          <p className="rounded-xl border border-dashed border-slate-300 bg-white p-10 text-center text-slate-500">
            No products are currently available.
          </p>
        ) : (
          <section className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {products.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
              />
            ))}
          </section>
        )}
      </div>
    </main>
  );
}