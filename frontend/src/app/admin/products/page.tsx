"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import Link from "next/link";
type Product = {
    id: string;
    name: string;
    sku: string;
    price: string;
    quantity: number;
    isActive: boolean;
};

export default function AdminProductsPage() {
    const supabase = createClient();

    const [products, setProducts] = useState<Product[]>([]);
    const [searchInput, setSearchInput] = useState("");
    const [search, setSearch] = useState("");
    const [status, setStatus] = useState("all");
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        async function fetchProducts() {
            setLoading(true);

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
                status: status,
            });

            if (search) {
                params.set("search", search);
            }

            const response = await fetch(
                `${process.env.NEXT_PUBLIC_BACKEND_API_URL}/api/admin/products?${params.toString()}`,
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

            setProducts(result.data);

            setTotalPages(
                result.pagination.totalPages
            );

            setLoading(false);
        }

        fetchProducts();
    }, [page, status, search]);

    if (loading) {
        return <p>Loading products...</p>;
    }

    return (
        <main className="mx-auto max-w-7xl px-6 py-10">
            <div className="relative mb-8">
                <div>
                    <h1 className="text-3xl font-bold">
                        Products
                    </h1>

                    <p className="mt-2 text-gray-500">
                        Manage products and inventory.
                    </p>
                </div>

                <Link
                    href="/admin/products/new"
                    className="absolute right-0 top-0 rounded-lg bg-black px-5 py-2.5 font-medium text-white hover:bg-gray-800"
                >
                    Add Product
                </Link>
            </div>
            <div className="mb-6 flex items-center gap-3">
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
                        placeholder="Search by name or SKU..."
                        value={searchInput}
                        onChange={(e) =>
                            setSearchInput(e.target.value)
                        }
                        className="w-full rounded-l-lg border px-4 py-2"
                    />

                    <button
                        type="submit"
                        className="rounded-r-lg bg-black px-5 py-2 text-white"
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
                    <option value="all">
                        All Status
                    </option>

                    <option value="active">
                        Active
                    </option>

                    <option value="inactive">
                        Inactive
                    </option>
                </select>
            </div>
            <div className="overflow-hidden rounded-xl border">
                <table className="w-full text-left">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-4 py-3">Product</th>
                            <th className="px-4 py-3">SKU</th>
                            <th className="px-4 py-3">Price</th>
                            <th className="px-4 py-3">Inventory</th>
                            <th className="px-4 py-3">Status</th>
                            <th className="px-4 py-3">Actions</th>
                        </tr>
                    </thead>

                    <tbody>
                        {products.map((product) => (
                            <tr
                                key={product.id}
                                className="border-t"
                            >
                                <td className="px-4 py-4 font-medium">
                                    {product.name}
                                </td>

                                <td className="px-4 py-4">
                                    {product.sku}
                                </td>

                                <td className="px-4 py-4">
                                    ${Number(product.price).toFixed(2)}
                                </td>

                                <td className="px-4 py-4">
                                    {product.quantity}
                                </td>

                                <td className="px-4 py-4">
                                    {product.isActive ? "Active" : "Inactive"}
                                </td>

                                <td className="px-4 py-4">
                                    <Link
                                        href={`/admin/products/${product.id}/edit`}
                                        className="text-sm font-medium"
                                    >
                                        Edit
                                    </Link>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                <div className="mt-6 flex items-center justify-between">
                    <button
                        type="button"
                        disabled={page <= 1}
                        onClick={() =>
                            setPage((prev) => prev - 1)
                        }
                        className="rounded-lg border px-4 py-2 disabled:opacity-40"
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
                        className="rounded-lg border px-4 py-2 disabled:opacity-40"
                    >
                        Next
                    </button>
                </div>
            </div>
        </main>
    );
}