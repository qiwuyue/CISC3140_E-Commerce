"use client";
import type { SubmitEvent } from "react";
import Link from "next/link";
import type { ReactNode } from "react";
import {
  Search,
  ShoppingCart,
  UserRound,
  RotateCcwClock


} from "lucide-react";

type HeaderProps = {
  authControls: ReactNode;
};

function handleSubmit(event: SubmitEvent<HTMLFormElement>) {
  const formData = new FormData(event.currentTarget);
  const query = String(formData.get("q") ?? "").trim();

  if (!query) {
    event.preventDefault();

    const input = event.currentTarget.elements.namedItem("q");

    if (input instanceof HTMLInputElement) {
      input.focus();
    }
  }
}
const categories = [
  "Processors",
  "Graphics Cards",
  "Memory",
  "Storage",
  "Motherboards",
  "Power Supplies",
  "Cooling",
  "Cases",
];

export default function Header({
  authControls,}:HeaderProps) {
  return (
    <header className="sticky top-0 z-50 border-b border-slate-200 bg-white/95 backdrop-blur">

      <div className="mx-auto flex max-w-7xl flex-wrap items-center gap-x-6 gap-y-3 px-5 py-4">
        
        <Link
          href="/"
          aria-label="Marco Center"
          className="shrink-0 text-xl font-semibold tracking-tight text-slate-900"
        >
          Marco Center
        </Link>

        <form
          action="/products"
          method="get"
          role="search"
          noValidate
          onSubmit={handleSubmit}
          className="order-3 w-full md:order-none md:flex-1"
        >
          <label
            htmlFor="header-search"
            className="sr-only"
          >
            Search products
          </label>

            <div className="mx-auto flex max-w-2xl items-center rounded-full border border-slate-200 bg-slate-50 transition focus-within:border-blue-500 focus-within:bg-white focus-within:ring-4 focus-within:ring-blue-100">
                    <input
                        id="header-search"
                        name="q"
                        type="search"
                        title="Enter at least one non-space character"
                        placeholder="Search products..."
                        className="min-w-0 flex-1 bg-transparent py-2.5 pl-4 pr-2 text-sm text-slate-900 outline-none placeholder:text-slate-400"
                    />

                    <button
                        type="submit"
                        aria-label="Search products"
                        className="mr-1.5 flex size-9 shrink-0 items-center justify-center rounded-full text-slate-500 transition hover:bg-blue-50 hover:text-blue-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
                    >
                        <Search
                        aria-hidden="true"
                        className="size-4"
                        />
                    </button>
            </div>
        </form>

        <nav
          aria-label="Account and cart"
          className="ml-auto flex shrink-0 items-center gap-5"
        >
          {authControls}

          <Link
            href="/cart"
            className="flex items-center gap-2 text-sm font-medium text-slate-600 transition hover:text-blue-600"
          >
            <ShoppingCart
              aria-hidden="true"
              className="size-5"
            />

            <span>Cart</span>
          </Link>

        <Link
            href="/orders"
            className="flex items-center gap-2 text-sm font-medium text-slate-600 transition hover:text-blue-600"
          >
            <RotateCcwClock 
              aria-hidden="true"
              className="size-5"
            />

            <span>Orders</span>
          </Link>
        </nav>
      </div>

        <nav
        aria-label="Product categories"
        className="border-t border-slate-100 bg-white"
        >
        <div className="mx-auto flex max-w-7xl items-center gap-1 overflow-x-auto px-5 py-2">
        <Link
            href="/products"
            className="shrink-0 rounded-full px-4 py-2 text-sm font-medium text-slate-600 transition hover:bg-blue-50 hover:text-blue-600"
        >
            All Products
        </Link>

        {categories.map((category) => (
            <Link
            key={category}
            href={{
                pathname: "/products",
                query: { q: category },
            }}
            className="shrink-0 rounded-full px-4 py-2 text-sm font-medium text-slate-600 transition hover:bg-blue-50 hover:text-blue-600"
            >
            {category}
            </Link>
        ))}
        </div>
    </nav>
        



    </header>
  );
}