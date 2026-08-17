"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
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

    status: string;
    paymentStatus: string;

    subtotal: string;
    shipping: string;
    tax: string;
    total: string;

    shippingName: string;
    shippingPhone: string | null;
    shippingAddress1: string;
    shippingAddress2: string | null;
    shippingCity: string;
    shippingState: string;
    shippingPostalCode: string;
    shippingCountry: string;

    createdAt: string;

    items: OrderItem[];
};

export default function AdminOrderDetailPage() {
    const params = useParams<{ id: string }>();
    const supabase = createClient();

    const [order, setOrder] = useState<Order | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function loadOrder() {
            const {
                data: { session },
            } = await supabase.auth.getSession();

            if (!session) {
                setLoading(false);
                return;
            }

            const response = await fetch(
                `${process.env.NEXT_PUBLIC_BACKEND_API_URL}/api/admin/orders/${params.id}`,
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

            setOrder(result.data);
            setLoading(false);
        }

        loadOrder();
    }, [params.id]);

    if (loading) {
        return <p>Loading order...</p>;
    }

    if (!order) {
        return <p>Order not found.</p>;
    }
    async function handleStatusChange(
        status: string
    ) {
        const {
            data: { session },
        } = await supabase.auth.getSession();

        if (!session) return;

        const response = await fetch(
            `${process.env.NEXT_PUBLIC_BACKEND_API_URL}/api/admin/orders/${order!.id}/status`,
            {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${session.access_token}`,
                },
                body: JSON.stringify({
                    status,
                }),
            }
        );

        if (!response.ok) {
            return;
        }

        const result = await response.json();

        setOrder((current) =>
            current
                ? {
                    ...current,
                    status: result.data.status,
                }
                : current
        );
    }
    return (
        <main className="mx-auto max-w-5xl px-6 py-10">
            <div className="mb-8">
                <h1 className="text-3xl font-bold">
                    Order #{order.id}
                </h1>

                <p className="mt-2 text-gray-500">
                    {new Date(order.createdAt).toLocaleString()}
                </p>
            </div>

            {/* Shipping */}
            <section className="rounded-xl border p-6">
                <h2 className="text-xl font-semibold">
                    Shipping Information
                </h2>

                <div className="mt-4 space-y-1">
                    <p>{order.shippingName}</p>

                    <p>
                        {order.shippingPhone || "No phone provided"}
                    </p>

                    <p>{order.shippingAddress1}</p>

                    {order.shippingAddress2 && (
                        <p>{order.shippingAddress2}</p>
                    )}

                    <p>
                        {order.shippingCity}, {order.shippingState}{" "}
                        {order.shippingPostalCode}
                    </p>

                    <p>{order.shippingCountry}</p>
                </div>
            </section>

            {/* Items */}
            <section className="mt-6 rounded-xl border p-6">
                <h2 className="text-xl font-semibold">
                    Order Items
                </h2>

                <div className="mt-4 divide-y">
                    {order.items.map((item) => (
                        <div
                            key={item.id}
                            className="flex justify-between py-4"
                        >
                            <div>
                                <p className="font-medium">
                                    {item.productName}
                                </p>

                                <p className="text-sm text-gray-500">
                                    SKU: {item.sku}
                                </p>

                                <p className="text-sm text-gray-500">
                                    ${Number(item.price).toFixed(2)} ×{" "}
                                    {item.quantity}
                                </p>
                            </div>

                            <p className="font-medium">
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

            {/* Order summary */}
            <section className="mt-6 rounded-xl border p-6">
                <h2 className="text-xl font-semibold">
                    Order Summary
                </h2>

                <div className="mt-4 space-y-2">
                    <div className="flex justify-between">
                        <span>Subtotal</span>
                        <span>
                            ${Number(order.subtotal).toFixed(2)}
                        </span>
                    </div>

                    <div className="flex justify-between">
                        <span>Shipping</span>
                        <span>
                            ${Number(order.shipping).toFixed(2)}
                        </span>
                    </div>

                    <div className="flex justify-between">
                        <span>Tax</span>
                        <span>
                            ${Number(order.tax).toFixed(2)}
                        </span>
                    </div>

                    <div className="flex justify-between border-t pt-2 font-bold">
                        <span>Total</span>
                        <span>
                            ${Number(order.total).toFixed(2)}
                        </span>
                    </div>
                </div>

                <div className="mt-6">
                    <p>
                        Payment:{" "}
                        <strong>{order.paymentStatus}</strong>
                    </p>

                    <div className="flex items-center gap-3">
                        <span>Order Status:</span>

                        <select
                            value={order.status}
                            onChange={(event) =>
                                handleStatusChange(event.target.value)
                            }
                            className="rounded border px-3 py-2"
                        >
                            <option value="PROCESSING">
                                Processing
                            </option>

                            <option value="SHIPPED">
                                Shipped
                            </option>

                            <option value="DELIVERED">
                                Delivered
                            </option>

                            <option value="CANCELLED">
                                Cancelled
                            </option>
                        </select>
                    </div>
                </div>
            </section>
        </main>
    );
}