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
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchProducts() {
            const {
                data: { session },
            } = await supabase.auth.getSession();

            if (!session) {
                return;
            }

            const response = await fetch(
                `${process.env.NEXT_PUBLIC_BACKEND_API_URL}/api/admin/products`,
                {
                    headers: {
                        Authorization: `Bearer ${session.access_token}`,
                    },
                }
            );

            if (!response.ok) {
                return;
            }

            const result = await response.json();

            setProducts(result.data);
            setLoading(false);
        }

        fetchProducts();
    }, []);

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
            </div>
        </main>
    );
}