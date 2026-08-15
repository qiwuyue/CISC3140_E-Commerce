"use client";

import { useEffect } from "react";

type ProductsErrorProps = {
  error: Error & {
    digest?: string;
  };
  reset: () => void;
};

export default function ProductsError({
  error,
  reset,
}: ProductsErrorProps) {
  useEffect(() => {
    console.error("Failed to load products:", error);
  }, [error]);

  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-50 px-5">
      <section className="max-w-md rounded-xl border border-red-200 bg-white p-8 text-center shadow-sm">
        <h1 className="text-2xl font-bold text-slate-900">
          Unable to load products
        </h1>

        <p className="mt-3 text-slate-600">
          Something went wrong while loading the product catalog.
        </p>

        <button
          type="button"
          onClick={reset}
          className="mt-6 rounded-lg bg-blue-600 px-5 py-2.5 font-medium text-white transition hover:bg-blue-700"
        >
          Try again
        </button>
      </section>
    </main>
  );
}