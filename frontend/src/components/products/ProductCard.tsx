'use client';

import type { Product } from "@/lib/product";
import AddToCartButton from "./addToCartButton";
import Link from "next/link";
type ProductCardProps = {
  product: Product;

};

export default function ProductCard({
  product,
}: ProductCardProps) {




  return (


    <article className="flex h-full flex-col rounded-xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-md">
      <Link
        href={`/products/${product.slug}`}
        aria-label={`View ${product.name}`}
        className="group block h-full rounded-xl focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-blue-100"
      >
        <div className="mb-3 flex items-center justify-between gap-3">
          <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-medium text-blue-700">
            {product.category.name}
          </span>

          <span className="text-sm text-slate-500">
            {product.brand.name}
          </span>
        </div>

        <h2 className="text-lg font-semibold text-slate-900">
          {product.name}
        </h2>

        <div className="aspect-square overflow-hidden rounded-xl bg-slate-50">
          {product.imageUrl ? (
            <img
              src={product.imageUrl}
              alt={product.name}
              className="h-full w-full object-contain p-3"
            />
          ) : (
            <div className="flex h-full items-center justify-center text-sm text-slate-400">
              No image
            </div>
          )}
        </div>
        <div className="relative">

          <p className="absolute bottom-0 right-0 text-xs text-slate-400">
            {product.sku}
          </p>
        </div>
      </Link>
      <div className="mt-5 flex items-end justify-between border-t border-slate-100 pt-4">
        <p className="text-xl font-bold text-slate-900">
          ${product.price}
        </p>
        <div className="mt-auto pt-5">
          <AddToCartButton productId={product.id}
            stock={product.quantity}
          />
        </div>



      </div>
    </article>

  );
}