"use client";

import { useState } from "react";
import { Minus, Plus } from "lucide-react";
import AddToCartButton from "./addToCartButton";

type Props = {
  productId: string;
  stock: number;
};

export default function ProductPurchaseControls({
  productId,
  stock,
}: Props) {
  const [quantity, setQuantity] = useState(1);

  const outOfStock = stock <= 0;

  return (
    <div className="mt-6 flex flex-col items-end gap-4">
      <p
        className={
          outOfStock
            ? "font-medium text-red-600"
            : "font-medium text-green-600"
        }
      >
        {outOfStock
          ? "Out of stock"
          : `${stock} in stock`}
      </p>

      {!outOfStock && (
        <div className="flex items-center gap-3">
          <span className="text-sm font-medium">
            Quantity
          </span>

          <div className="flex items-center rounded-lg border">
            <button
              onClick={() =>
                setQuantity((q) => Math.max(1, q - 1))
              }
              disabled={quantity <= 1}
              className="p-2 disabled:opacity-30"
            >
              <Minus size={18} />
            </button>

            <span className="min-w-10 text-center">
              {quantity}
            </span>

            <button
              onClick={() =>
                setQuantity((q) =>
                  Math.min(stock, q + 1)
                )
              }
              disabled={quantity >= stock}
              className="p-2 disabled:opacity-30"
            >
              <Plus size={18} />
            </button>
          </div>
        </div>
      )}

      <AddToCartButton
        productId={productId}
        quantity={quantity}
        disabled={outOfStock}
        stock={stock}
      />
    </div>
  );
}