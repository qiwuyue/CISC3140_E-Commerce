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
  imageUrl: string | null;
};

type Order = {
  id: string;
  shippingName: string;
  shippingPhone: string | null;
  shippingAddress1: string;
  shippingAddress2: string | null;
  shippingCity: string;
  shippingState: string;
  shippingPostalCode: string;

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
function getStatusStyle(status: string) {
  switch (status) {
    case "PENDING":
      return "bg-yellow-100 text-yellow-700";

    case "PROCESSING":
      return "bg-blue-100 text-blue-700";

    case "SHIPPED":
      return "bg-purple-100 text-purple-700";

    case "DELIVERED":
      return "bg-green-100 text-green-700";

    case "CANCELLED":
      return "bg-red-100 text-red-700";

    default:
      return "bg-gray-100 text-gray-700";
  }
}

export default function OrdersPage() {
  const router = useRouter();
  const supabase = createClient();

  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchOrders() {
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

    fetchOrders();
  }, [router]);

  if (loading) {
    return (
      <main className="mx-auto min-h-[70vh] w-full max-w-7xl px-6 py-12">
        <p className="text-gray-500">
          Loading orders...
        </p>
      </main>
    );
  }

  return (
    <main className="mx-auto min-h-[70vh] w-full max-w-7xl px-6 py-12">
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
        <div className="overflow-x-auto rounded-xl border bg-white">
          <table className="w-full min-w-[950px] text-left">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-4 text-sm font-semibold">
                  Order
                </th>

                <th className="px-6 py-4 text-sm font-semibold">
                  Products
                </th>

                <th className="px-6 py-4 text-sm font-semibold">
                  Date
                </th>

                <th className="px-6 py-4 text-sm font-semibold">
                  Total
                </th>

                <th className="px-6 py-4 text-sm font-semibold">
                  Status
                </th>

                <th className="px-6 py-4" />
              </tr>
            </thead>

            <tbody>
              {orders.map((order) => (
                <tr
                  key={order.id}
                  className="border-t transition hover:bg-gray-50"
                >
  
                  <td className="px-6 py-5 align-top">
                    <Link
                      href={`/account/orders/${order.id}`}
                      className="font-medium hover:underline"
                    >
                      #{order.id.slice(0, 10)}...
                    </Link>
                  </td>


                  <td className="px-6 py-5">
                    <div className="space-y-3">
                      {order.items.slice(0, 3).map((item) => (
                        <div
                          key={item.id}
                          className="flex items-center gap-3"
                        >
     
                          <div className="flex h-14 w-14 shrink-0 items-center justify-center overflow-hidden rounded-lg border bg-gray-50">
                            {item.imageUrl ? (
                              <img
                                src={item.imageUrl}
                                alt={item.productName}
                                className="h-full w-full object-contain p-1"
                              />
                            ) : (
                              <span className="text-xs text-gray-400">
                                No image
                              </span>
                            )}
                          </div>


                          <div className="min-w-0">
                            <p className="max-w-[260px] truncate font-medium">
                              {item.productName}
                            </p>

                            <p className="mt-1 text-sm text-gray-500">
                              Qty: {item.quantity}
                            </p>
                          </div>
                        </div>
                      ))}

                      {/* More than 3 products */}
                      {order.items.length > 3 && (
                        <p className="text-sm text-gray-500">
                          +{order.items.length - 3} more{" "}
                          {order.items.length - 3 === 1
                            ? "item"
                            : "items"}
                        </p>
                      )}
                    </div>
                  </td>


                  <td className="px-6 py-5 align-top">
                    {new Date(order.createdAt).toLocaleDateString()}
                  </td>


                  <td className="px-6 py-5 align-top font-medium">
                    ${Number(order.total).toFixed(2)}
                  </td>


                  <td className="px-6 py-5 align-top">
                    <span
                      className={`inline-block rounded-full px-3 py-1 text-xs font-medium ${getStatusStyle(
                        order.status
                      )}`}
                    >
                      {order.status}
                    </span>
                  </td>

                  <td className="px-6 py-5 align-top text-right">
                    <Link
                      href={`/account/orders/${order.id}`}
                      className="whitespace-nowrap text-sm font-medium hover:underline"
                    >
                      View details →
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )
      }
    </main>
  );
}