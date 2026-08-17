"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import Link from "next/link";
import {
    ShoppingCart,
    Minus,
    Plus,
    Trash2,
    ArrowLeft,
} from "lucide-react";

type CartItem = {
    id: string;
    quantity: number;
    product: {
        id: string;
        name: string;
        price: string | number;
        slug: string;
        quantity: number;
    };
};

type Cart = {
    id: string;
    userId: string;
    items: CartItem[];
};

export default function CartPage() {
    const supabase = createClient();

    const [cart, setCart] = useState<Cart | null>(null);
    const [loading, setLoading] = useState(true);

    async function loadCart() {
        const {
            data: { session },
        } = await supabase.auth.getSession();

        if (!session) {
            setLoading(false);
            return;
        }

        const response = await fetch(
            `${process.env.NEXT_PUBLIC_BACKEND_API_URL}/api/cart`,
            {
                headers: {
                    Authorization: `Bearer ${session.access_token}`,
                },
            }
        );

        const result = await response.json();

        if (!response.ok) {
            console.error(result);
            setLoading(false);
            return;
        }

        setCart(result.data);
        setLoading(false);
    }


    async function updateQuantity(
        id: string,
        quantity: number
    ) {
        if (quantity < 1) return;

        const {
            data: { session },
        } = await supabase.auth.getSession();

        if (!session) return;

        const response = await fetch(
            `${process.env.NEXT_PUBLIC_BACKEND_API_URL}/api/cart/items/${id}`,
            {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${session.access_token}`,
                },
                body: JSON.stringify({
                    quantity,
                }),
            }
        );

        if (!response.ok) {
            console.error(await response.json());
            return;
        }

        await loadCart();
    }
    async function removeItem(id: string) {
        const {
            data: { session },
        } = await supabase.auth.getSession();

        if (!session) return;

        const response = await fetch(
            `${process.env.NEXT_PUBLIC_BACKEND_API_URL}/api/cart/items/${id}`,
            {
                method: "DELETE",
                headers: {
                    Authorization: `Bearer ${session.access_token}`,
                },
            }
        );

        if (!response.ok) {
            console.error(await response.json());
            return;
        }

        await loadCart();
    }

    useEffect(() => {


        loadCart();
    }, []);

    if (loading) {
        return (
            <main className="mx-auto max-w-6xl px-6 py-12">
                <p className="text-slate-500">Loading cart...</p>
            </main>
        );
    }

    if (!cart || cart.items.length === 0) {
        return (<main className="mx-auto flex min-h-[60vh] max-w-6xl flex-col items-center justify-center px-6">
            <ShoppingCart
                size={56}
                className="mb-5 text-slate-300"
            />

            <h1 className="text-2xl font-semibold text-slate-900">
                Your cart is empty
            </h1>

            <p className="mt-2 text-slate-500">
                Add some products to get started.
            </p>

            <Link
                href="/products"
                className="mt-6 rounded-lg bg-slate-900 px-5 py-3 font-medium text-white transition hover:bg-slate-700"
            >
                Continue Shopping
            </Link>
        </main>);
    }

    const subtotal = cart.items.reduce((total, item) => {
        return total + Number(item.product.price) * item.quantity;
    }, 0);



    return (
         <main className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
    {/* Header */}
    <div className="mb-8">
      <Link
        href="/products"
        className="mb-4 inline-flex items-center gap-2 text-sm text-slate-500 transition hover:text-slate-900"
      >
        <ArrowLeft size={16} />
        Continue shopping
      </Link>

      <div className="flex items-center gap-3">
        <ShoppingCart size={30} />

        <h1 className="text-3xl font-bold tracking-tight text-slate-900">
          Shopping Cart
        </h1>

        <span className="text-sm text-slate-500">
          ({cart.items.length} items)
        </span>
      </div>
    </div>

    {/* Main layout */}
    <div className="grid gap-8 lg:grid-cols-[1fr_360px]">
      {/* Cart Items */}
      <section className="overflow-hidden rounded-xl border border-slate-200 bg-white">
        {cart.items.map((item) => {
          const price = Number(item.product.price);
          const itemTotal = price * item.quantity;

          const maxStockReached =
            item.quantity >= item.product.quantity;

          return (
            <div
              key={item.id}
              className="border-b border-slate-200 p-6 last:border-b-0"
            >
              <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
                {/* Product information */}
                <div className="min-w-0 flex-1">
                  <h2 className="text-lg font-semibold text-slate-900">
                    {item.product.name}
                  </h2>

                  <p className="mt-1 text-sm text-slate-500">
                    ${price.toFixed(2)} each
                  </p>

                  {/* Quantity */}
                  <div className="mt-5 flex flex-wrap items-center gap-3">
                    <span className="text-sm font-medium text-slate-700">
                      Quantity
                    </span>

                    <div className="flex items-center overflow-hidden rounded-lg border border-slate-300">
                      <button
                        onClick={() =>
                          updateQuantity(
                            item.id,
                            item.quantity - 1
                          )
                        }
                        disabled={item.quantity <= 1}
                        className="flex h-9 w-9 items-center justify-center transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-30"
                        aria-label="Decrease quantity"
                      >
                        <Minus size={16} />
                      </button>

                      <span className="min-w-10 text-center text-sm font-medium">
                        {item.quantity}
                      </span>

                      <button
                        onClick={() =>
                          updateQuantity(
                            item.id,
                            item.quantity + 1
                          )
                        }
                        disabled={maxStockReached}
                        className="flex h-9 w-9 items-center justify-center transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-30"
                        aria-label="Increase quantity"
                      >
                        <Plus size={16} />
                      </button>
                    </div>

                    {maxStockReached && (
                      <span className="text-xs text-amber-600">
                        Max stock reached
                      </span>
                    )}
                  </div>
                </div>

                {/* Price + Delete */}
                <div className="flex items-center justify-between gap-6 sm:flex-col sm:items-end">
                  <button
                    onClick={() => removeItem(item.id)}
                    className="flex items-center gap-2 text-sm text-slate-400 transition hover:text-red-600"
                  >
                    <Trash2 size={17} />
                    Remove
                  </button>

                  <div className="text-right">
                    <p className="text-xs text-slate-400">
                      Item total
                    </p>

                    <p className="mt-1 text-lg font-semibold text-slate-900">
                      ${itemTotal.toFixed(2)}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </section>

      {/* Order Summary */}
      <aside className="h-fit rounded-xl border border-slate-200 bg-white p-6 lg:sticky lg:top-24">
        <h2 className="text-xl font-semibold text-slate-900">
          Order Summary
        </h2>

        <div className="mt-6 space-y-4">
          <div className="flex justify-between text-sm">
            <span className="text-slate-500">
              Subtotal
            </span>

            <span className="font-medium text-slate-900">
              ${subtotal.toFixed(2)}
            </span>
          </div>

          <div className="flex justify-between text-sm">
            <span className="text-slate-500">
              Shipping
            </span>

            <span className="font-medium text-green-600">
              Free
            </span>
          </div>
        </div>

        <div className="my-6 border-t border-slate-200" />

        <div className="flex items-center justify-between">
          <span className="font-semibold text-slate-900">
            Total
          </span>

          <span className="text-2xl font-bold text-slate-900">
            ${subtotal.toFixed(2)}
          </span>
        </div>

        <button
          className="mt-6 w-full rounded-lg bg-slate-900 px-5 py-3 font-semibold text-white transition hover:bg-slate-700"
        >
          Proceed to Checkout
        </button>

        <p className="mt-3 text-center text-xs text-slate-400">
          Taxes calculated at checkout
        </p>
      </aside>
    </div>
  </main>
    );
}