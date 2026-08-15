import type {Product} from "@/lib/product";

type ProductCardProps = {
    product: Product;
};

export default function ProductCard({
  product,
}: ProductCardProps) {
  return (
    <article className="flex h-full flex-col rounded-xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-md">
      <div className="mb-3 flex items-center justify-between gap-3">
        <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-medium text-blue-700">
          {product.category.name}
        </span>

        <span className="text-sm text-slate-500">
          {product.brand.name}
        </span>
      </div>

      <h2 className="text-lg font-semibold text-slate-900">
        {product.name}
      </h2>

      <p className="mt-2 flex-1 text-sm leading-6 text-slate-600">
        {product.description ?? "No description available."}
      </p>

      <div className="mt-5 flex items-end justify-between border-t border-slate-100 pt-4">
        <p className="text-xl font-bold text-slate-900">
          ${product.price}
        </p>

        <p className="text-xs text-slate-400">
          {product.sku}
        </p>
      </div>
    </article>
  );
}