"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { toast } from "sonner";

import { createClient } from "@/lib/supabase/client";

type OrderItem = {
  id: string;
  productId: string;
  productName: string;
  sku: string;
  price: string;
  quantity: number;
};

type Order = {
  id: string;

  status:
    | "PENDING"
    | "PROCESSING"
    | "SHIPPED"
    | "DELIVERED"
    | "CANCELLED";

  paymentStatus:
    | "PENDING"
    | "PAID"
    | "FAILED"
    | "REFUNDED";

  subtotal: string;
  shipping: string;
  tax: string;
  total: string;

  shippingName: string;
  shippingAddress1: string;
  shippingAddress2: string | null;
  shippingCity: string;
  shippingState: string;
  shippingPostalCode: string;
  shippingCountry: string;
  shippingPhone: string | null;

  createdAt: string;

  items: OrderItem[];
};

export default function OrderDetailsPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const supabase = createClient();

  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadOrder() {
      try {
        const {
          data: { session },
        } = await supabase.auth.getSession();

        if (!session) {
          router.push(
            `/login?redirect=/account/orders/${params.id}`
          );
          return;
        }

        const response = await fetch(
          `${process.env.NEXT_PUBLIC_BACKEND_API_URL}/api/orders/${params.id}`,
          {
            headers: {
              Authorization: `Bearer ${session.access_token}`,
            },
          }
        );

        const result = await response.json();

        if (!response.ok) {
          throw new Error(
            result.error || "Failed to load order"
          );
        }

        setOrder(result.data);
      } catch (error) {
        toast.error(
          error instanceof Error
            ? error.message
            : "Failed to load order"
        );
      } finally {
        setLoading(false);
      }
    }

    loadOrder();
  }, [params.id, router]);

  if (loading) {
    return (
      <main className="mx-auto max-w-5xl px-6 py-12">
        <p className="text-gray-500">
          Loading order...
        </p>
      </main>
    );
  }

  if (!order) {
    return (
      <main className="mx-auto max-w-5xl px-6 py-12">
        <p>Order not found.</p>

        <Link
          href="/account/orders"
          className="mt-4 inline-block underline"
        >
          Back to Orders
        </Link>
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-5xl px-6 py-12">
      <Link
        href="/account/orders"
        className="text-sm text-gray-500 hover:text-black"
      >
        ← Back to Orders
      </Link>

      <div className="mt-6 flex flex-col justify-between gap-4 sm:flex-row">
        <div>
          <h1 className="text-3xl font-bold">
            Order Details
          </h1>

          <p className="mt-2 text-gray-500">
            #{order.id}
          </p>
        </div>

        <div className="text-left sm:text-right">
          <p className="font-medium">
            {order.status}
          </p>

          <p className="text-sm text-gray-500">
            {new Date(order.createdAt).toLocaleString()}
          </p>
        </div>
      </div>

      <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_320px]">
        {/* LEFT */}
        <div className="space-y-6">

          {/* Items */}
          <section className="rounded-xl border bg-white p-6 shadow-sm">
            <h2 className="mb-5 text-xl font-semibold">
              Items
            </h2>

            <div className="space-y-5">
              {order.items.map((item) => (
                <div
                  key={item.id}
                  className="flex justify-between gap-4 border-b pb-5 last:border-b-0 last:pb-0"
                >
                  <div>
                    <p className="font-medium">
                      {item.productName}
                    </p>

                    <p className="mt-1 text-sm text-gray-500">
                      SKU: {item.sku}
                    </p>

                    <p className="mt-1 text-sm text-gray-500">
                      ${Number(item.price).toFixed(2)}
                      {" × "}
                      {item.quantity}
                    </p>
                  </div>

                  <p className="font-semibold">
                    $
                    {(
                      Number(item.price) *
                      item.quantity
                    ).toFixed(2)}
                  </p>
                </div>
              ))}
            </div>
          </section>

          {/* Shipping */}
          <section className="rounded-xl border bg-white p-6 shadow-sm">
            <h2 className="mb-4 text-xl font-semibold">
              Shipping Address
            </h2>

            <div className="space-y-1 text-gray-700">
              <p className="font-medium">
                {order.shippingName}
              </p>

              <p>{order.shippingAddress1}</p>

              {order.shippingAddress2 && (
                <p>{order.shippingAddress2}</p>
              )}

              <p>
                {order.shippingCity},{" "}
                {order.shippingState}{" "}
                {order.shippingPostalCode}
              </p>

              <p>{order.shippingCountry}</p>

              {order.shippingPhone && (
                <p className="pt-2">
                  {order.shippingPhone}
                </p>
              )}
            </div>
          </section>
        </div>

        {/* RIGHT */}
        <aside className="h-fit rounded-xl border bg-white p-6 shadow-sm">
          <h2 className="mb-5 text-xl font-semibold">
            Order Summary
          </h2>

          <div className="space-y-3">
            <SummaryRow
              label="Subtotal"
              value={order.subtotal}
            />

            <SummaryRow
              label="Shipping"
              value={order.shipping}
            />

            <SummaryRow
              label="Tax"
              value={order.tax}
            />

            <div className="border-t pt-4">
              <SummaryRow
                label="Total"
                value={order.total}
                strong
              />
            </div>
          </div>

          <div className="mt-6 border-t pt-5">
            <p className="text-sm text-gray-500">
              Payment Status
            </p>

            <p className="mt-1 font-medium">
              {order.paymentStatus}
            </p>
          </div>
        </aside>
      </div>
    </main>
  );
}

type SummaryRowProps = {
  label: string;
  value: string;
  strong?: boolean;
};

function SummaryRow({
  label,
  value,
  strong = false,
}: SummaryRowProps) {
  return (
    <div
      className={`flex justify-between ${
        strong ? "text-lg font-semibold" : "text-sm"
      }`}
    >
      <span>{label}</span>

      <span>
        ${Number(value).toFixed(2)}
      </span>
    </div>
  );
}