import Link from "next/link";
import { notFound } from "next/navigation";

import { getProduct } from "@/lib/product";
import ProductPurchaseControls from "@/components/products/ProductPurchaseControls";

type ProductDetailPageProps = {
  params: Promise<{
    slug: string;
    quantity: number;
  }>;
};

export default async function ProductDetailPage({
  params,
}: ProductDetailPageProps) {
  const { slug } = await params;
  const product = await getProduct(slug);

  if (!product) {
    notFound();
  }

  return (
    <main className="mx-auto w-full max-w-7xl px-5 py-10 sm:py-14">
      <Link
        href="/products"
        className="mb-8 inline-flex text-sm font-medium text-slate-500 transition hover:text-blue-600"
      >
        ← Back to products
      </Link>

      <section className="grid gap-10 lg:grid-cols-2 lg:gap-16">

        {/* Image Area */}
        <div className="aspect-square overflow-hidden rounded-2xl border border-slate-200 bg-slate-50">
          {product.imageUrl ? (
            <img
              src={product.imageUrl}
              alt={product.name}
              className="h-full w-full object-contain"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center">
              <p className="text-sm text-slate-400">
                No product image
              </p>
            </div>
          )}
        </div>
        {/* Product Details Area */}
        <article className="flex flex-col justify-center">
          <p className="mb-3 text-sm font-semibold uppercase tracking-wider text-blue-600">
            {product.category.name}
          </p>

          <h1 className="text-3xl font-semibold tracking-tight text-slate-900 sm:text-4xl">
            {product.name}
          </h1>

          <p className="mt-4 text-base leading-7 text-slate-600">
            {product.description ?? "No description available."}
          </p>

          <p className="mt-8 text-3xl font-semibold text-slate-900">
            ${Number(product.price).toFixed(2)}
          </p>

          <dl className="mt-8 divide-y divide-slate-200 border-y border-slate-200">
            <div className="flex justify-between gap-4 py-4">
              <dt className="text-sm text-slate-500">Brand</dt>
              <dd className="text-sm font-medium text-slate-900">
                {product.brand.name}
              </dd>
            </div>

            <div className="flex justify-between gap-4 py-4">
              <dt className="text-sm text-slate-500">Category</dt>
              <dd className="text-sm font-medium text-slate-900">
                {product.category.name}
              </dd>
            </div>

            <div className="flex justify-between gap-4 py-4">
              <dt className="text-sm text-slate-500">SKU</dt>
              <dd className="text-sm font-medium text-slate-900">
                {product.sku}
              </dd>
            </div>

          </dl>
          <ProductPurchaseControls
            productId={product.id}
            stock={product.quantity}

          />
        </article>

      </section>
    </main>
  );
}