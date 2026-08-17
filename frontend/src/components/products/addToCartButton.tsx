"use client";

import { ShoppingCart } from "lucide-react";
import { toast } from "sonner";
import { createClient } from "@/lib/supabase/client";

type Props = {
    productId: string;
    quantity?: number;
    disabled?: boolean;
    stock: number;
};

export default function AddToCartButton({
    productId,
    quantity = 1,
    disabled = false,
    stock,
}: Props) {
    const supabase = createClient();
    const outOfStock = stock <= 0;
    async function addToCart() {
    if (outOfStock) {
      toast.error("This product is out of stock");
      return;
    }

    if (quantity > stock) {
      toast.error("Not enough stock");
      return;
    }
        const {
            data: { session },
        } = await supabase.auth.getSession();

        if (!session) {
            toast.error("Please sign in first");
            return;
        }

        try {
            const response = await fetch(
                `${process.env.NEXT_PUBLIC_BACKEND_API_URL}/api/cart/items`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${session.access_token}`,
                    },
                    body: JSON.stringify({
                        productId,
                        quantity,
                    }),
                }
            );

            if (!response.ok) {
                toast.error("Failed to add item to cart");
                return;
            }

            toast.success("Added to cart");
        } catch (error) {
            console.error(error);
            toast.error("Something went wrong");
        }
    }

    return (
        <button
            onClick={addToCart}
            disabled={outOfStock}
            
            className="
    flex items-center justify-center gap-2
    rounded-lg bg-slate-900 px-5 py-3
    font-medium text-white
    transition hover:bg-slate-700
    disabled:cursor-not-allowed disabled:opacity-50
  "
        >
            {outOfStock ? "Out of Stock" : "Add to Cart"}

        </button>
    );
}