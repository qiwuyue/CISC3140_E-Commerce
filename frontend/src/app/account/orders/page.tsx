"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import { createClient } from "@/lib/supabase/client";

type OrderItem = {
  id: string;
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

  createdAt: string;

  items: OrderItem[];
};

export default function OrdersPage() {
  const router = useRouter();
  const supabase = createClient();

  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadOrders() {
      try {
        const {
          data: { session },
        } = await supabase.auth.getSession();

        if (!session) {
          router.push("/login?redirect=/account/orders");
          return;
        }

        const response = await fetch(
          `${process.env.NEXT_PUBLIC_BACKEND_API_URL}/api/orders`,
          {
            headers: {
              Authorization: `Bearer ${session.access_token}`,
            },
          }
        );

        const result = await response.json();

        if (!response.ok) {
          throw new Error(
            result.error || "Failed to load orders"
          );
        }

        setOrders(result.data);
      } catch (error) {
        toast.error(
          error instanceof Error
            ? error.message
            : "Failed to load orders"
        );
      } finally {
        setLoading(false);
      }
    }

    loadOrders();
  }, [router]);

  if (loading) {
    return (
      <main className="mx-auto max-w-5xl px-6 py-12">
        <p className="text-gray-500">
          Loading orders...
        </p>
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-5xl px-6 py-12">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">
          Order History
        </h1>

        <p className="mt-2 text-gray-500">
          View your previous orders and their status.
        </p>
      </div>

      {orders.length === 0 ? (
        <div className="rounded-xl border bg-white p-10 text-center">
          <h2 className="text-lg font-semibold">
            No orders yet
          </h2>

          <p className="mt-2 text-gray-500">
            Your completed orders will appear here.
          </p>

          <Link
            href="/products"
            className="mt-6 inline-block rounded-lg bg-black px-5 py-3 text-white"
          >
            Continue Shopping
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <Link
              key={order.id}
              href={`/account/orders/${order.id}`}
              className="block rounded-xl border bg-white p-6 shadow-sm transition hover:border-gray-400"
            >
              <div className="flex flex-col justify-between gap-4 sm:flex-row">
                <div>
                  <p className="text-sm text-gray-500">
                    Order
                  </p>

                  <p className="font-medium">
                    #{order.id}
                  </p>
                </div>

                <div>
                  <p className="text-sm text-gray-500">
                    Date
                  </p>

                  <p className="font-medium">
                    {new Date(
                      order.createdAt
                    ).toLocaleDateString()}
                  </p>
                </div>

                <div>
                  <p className="text-sm text-gray-500">
                    Status
                  </p>

                  <p className="font-medium">
                    {order.status}
                  </p>
                </div>

                <div>
                  <p className="text-sm text-gray-500">
                    Total
                  </p>

                  <p className="font-semibold">
                    ${Number(order.total).toFixed(2)}
                  </p>
                </div>
              </div>

              <div className="mt-5 border-t pt-4">
                <p className="text-sm text-gray-500">
                  {order.items.reduce(
                    (total, item) =>
                      total + item.quantity,
                    0
                  )}{" "}
                  item(s)
                </p>
              </div>
            </Link>
          ))}
        </div>
      )}
    </main>
  );
}