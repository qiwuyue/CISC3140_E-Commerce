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

export default function AdminOrdersPage() {
    const supabase = createClient();

    const [orders, setOrders] = useState<Order[]>([]);

    const [searchInput, setSearchInput] = useState("");
    const [search, setSearch] = useState("");

    const [status, setStatus] = useState("all");

    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);


    useEffect(() => {
        async function fetchOrders() {
            setLoading(true);
            setError(null);

            try {
                const {
                    data: { session },
                } = await supabase.auth.getSession();

                if (!session) {
                    setLoading(false);
                    return;
                }

                const params = new URLSearchParams({
                    page: String(page),
                    limit: "10",
                    status,
                });

                if (search) {
                    params.set("search", search);
                }

                const response = await fetch(
                    `${process.env.NEXT_PUBLIC_BACKEND_API_URL}/api/admin/orders?${params.toString()}`,
                    {
                        headers: {
                            Authorization: `Bearer ${session.access_token}`,
                        },
                    }
                );

                const result = await response.json();

                if (!response.ok) {
                    throw new Error(
                        result.error || "Failed to load orders."
                    );
                }

                setOrders(result.data);

                setTotalPages(
                    result.pagination.totalPages || 1
                );
            } catch (error) {
                console.error("Load orders error:", error);

                setError(
                    error instanceof Error
                        ? error.message
                        : "Failed to load orders."
                );
            } finally {
                setLoading(false);
            }
        }

        fetchOrders();
    }, [page, status, search]);


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
            <div className="mb-6 flex flex-wrap items-center gap-3">
                <form
                    onSubmit={(e) => {
                        e.preventDefault();

                        setPage(1);
                        setSearch(searchInput.trim());
                    }}
                    className="flex w-full max-w-md"
                >
                    <input
                        type="search"
                        placeholder="Search order, customer, or phone..."
                        value={searchInput}
                        onChange={(e) =>
                            setSearchInput(e.target.value)
                        }
                        className="w-full rounded-l-lg border px-4 py-2 outline-none focus:border-gray-500"
                    />

                    <button
                        type="submit"
                        className="rounded-r-lg bg-black px-5 py-2 text-white hover:bg-gray-800"
                    >
                        Search
                    </button>
                </form>

                <select
                    value={status}
                    onChange={(e) => {
                        setStatus(e.target.value);
                        setPage(1);
                    }}
                    className="rounded-lg border bg-white px-4 py-2"
                >
                    <option value="all">All Status</option>
                    <option value="PENDING">Pending</option>
                    <option value="PROCESSING">Processing</option>
                    <option value="SHIPPED">Shipped</option>
                    <option value="DELIVERED">Delivered</option>
                    <option value="CANCELLED">Cancelled</option>
                </select>
            </div>
            <div className="overflow-hidden rounded-xl border">
                <div className="overflow-x-auto">
                    <table className="w-full min-w-[1000px]">
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
                                    <td className="px-6 py-5 align-top">
                                        <span
                                            className={`inline-block rounded-full px-3 py-1 text-xs font-medium ${getStatusStyle(
                                                order.status
                                            )}`}
                                        >
                                            {order.status}
                                        </span>
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
                <div className="mt-6 flex items-center justify-between">
                    <button
                        type="button"
                        disabled={page <= 1}
                        onClick={() =>
                            setPage((prev) => prev - 1)
                        }
                        className="rounded-lg border px-4 py-2 text-sm disabled:cursor-not-allowed disabled:opacity-40"
                    >
                        Previous
                    </button>

                    <span className="text-sm text-gray-500">
                        Page {page} of {totalPages}
                    </span>

                    <button
                        type="button"
                        disabled={page >= totalPages}
                        onClick={() =>
                            setPage((prev) => prev + 1)
                        }
                        className="rounded-lg border px-4 py-2 text-sm disabled:cursor-not-allowed disabled:opacity-40"
                    >
                        Next
                    </button>
                </div>
            </div>
        </main>
    );
}