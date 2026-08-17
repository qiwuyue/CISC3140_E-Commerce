"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import Link from "next/link";
type OrderItem = {
    id: string;
    quantity: number;
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
    shippingCountry: string;

    total: string;
    status: string;
    paymentStatus: string;
    createdAt: string;

    items: OrderItem[];
};

export default function AdminOrdersPage() {
    const supabase = createClient();

    const [orders, setOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function loadOrders() {
            const {
                data: { session },
            } = await supabase.auth.getSession();

            if (!session) return;

            const response = await fetch(
                `${process.env.NEXT_PUBLIC_BACKEND_API_URL}/api/admin/orders`,
                {
                    headers: {
                        Authorization: `Bearer ${session.access_token}`,
                    },
                }
            );

            if (!response.ok) {
                setLoading(false);
                return;
            }

            const result = await response.json();

            setOrders(result.data);
            setLoading(false);
        }

        loadOrders();
    }, []);

    if (loading) {
        return <p>Loading orders...</p>;
    }

    return (
        <main className="mx-auto max-w-7xl px-6 py-10">
            <div className="mb-8">
                <h1 className="text-3xl font-bold">
                    Customer Orders
                </h1>

                <p className="mt-2 text-gray-500">
                    View and manage paid customer orders.
                </p>
            </div>

            <div className="overflow-hidden rounded-xl border">
                <table className="w-full text-left">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-4 py-3">Order</th>
                            <th className="px-4 py-3">Customer</th>
                            <th className="px-4 py-3">Date</th>
                            <th className="px-4 py-3">Items</th>
                            <th className="px-4 py-3">Total</th>
                            <th className="px-4 py-3">Ship To</th>
                            <th className="px-4 py-3">Phone</th>
                            <th className="px-4 py-3">Status</th>
                            <th className="px-4 py-3">Actions</th>
                        </tr>
                    </thead>

                    <tbody>
                        {orders.map((order) => (
                            <tr
                                key={order.id}
                                className="border-t"
                            >
                                <td className="px-4 py-4">
                                    #{order.id.slice(0, 12)}...
                                </td>

                                <td className="px-4 py-4">
                                    {order.shippingName}
                                </td>

                                <td className="px-4 py-4">
                                    {new Date(
                                        order.createdAt
                                    ).toLocaleDateString()}
                                </td>

                                <td className="px-4 py-4">
                                    {order.items.reduce(
                                        (total, item) =>
                                            total + item.quantity,
                                        0
                                    )}
                                </td>

                                <td className="px-4 py-4 font-medium">
                                    ${Number(order.total).toFixed(2)}
                                </td>
                                <td className="px-4 py-4">
                                    <p>{order.shippingAddress1}</p>

                                    {order.shippingAddress2 && (
                                        <p>{order.shippingAddress2}</p>
                                    )}

                                    <p className="text-sm text-gray-500">
                                        {order.shippingCity}, {order.shippingState}{" "}
                                        {order.shippingPostalCode}
                                    </p>
                                </td>
                                <td className="px-4 py-4">
                                    {order.shippingPhone || "—"}
                                </td>
                                <td className="px-4 py-4">
                                    {order.status}
                                </td>
                                <td className="px-4 py-4">
                                    <Link
                                        href={`/admin/orders/${order.id}`}
                                        className="font-medium"
                                    >
                                        View
                                    </Link>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </main>
    );
}