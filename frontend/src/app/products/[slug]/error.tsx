"use client";

import { useEffect } from "react";
import Link from "next/link";

type ProductDetailErrorProps = {
  error: Error & {
    digest?: string;
  };
  reset: () => void;
};

export default function ProductDetailError({
  error,
  reset,
}: ProductDetailErrorProps) {
  useEffect(() => {
    console.error("Failed to load product details:", error);
  }, [error]);

  return (
    <main className="mx-auto flex min-h-[60vh] max-w-7xl items-center justify-center px-5 py-16">
      <section className="max-w-lg text-center">
        <p className="text-sm font-semibold uppercase tracking-wider text-red-600">
          Something went wrong
        </p>

        <h1 className="mt-3 text-3xl font-semibold tracking-tight text-slate-900">
          Unable to load this product
        </h1>

        <p className="mt-4 leading-7 text-slate-600">
          We could not load the product information. Please try again.
        </p>

        <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
          <button
            type="button"
            onClick={() => reset()}
            className="rounded-full bg-blue-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-blue-700 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-blue-200"
          >
            Try again
          </button>

          <Link
            href="/products"
            className="rounded-full border border-slate-300 px-6 py-3 text-sm font-semibold text-slate-700 transition hover:border-slate-400 hover:bg-slate-50"
          >
            Back to products
          </Link>
        </div>
      </section>
    </main>
  );
}