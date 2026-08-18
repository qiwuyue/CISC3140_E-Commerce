import ProductCard from "@/components/products/ProductCard";
import { getProducts } from "@/lib/product";
import SortSelect from "@/components/products/sortSelect";
import Link from "next/link";
import { redirect } from "next/navigation";
type ProductsPageProps = {
  searchParams: Promise<{
    q?: string | string[];
    sort?: string | string[];
    page?: string | string[];
  }>;
};



export default async function ProductsPage({
  searchParams,
}: ProductsPageProps) {


  const parameters = await searchParams;

  const query = Array.isArray(parameters.q)
    ? parameters.q[0] ?? ""
    : parameters.q ?? "";


  const sort = Array.isArray(parameters.sort)
    ? parameters.sort[0] ?? "newest"
    : parameters.sort ?? "newest";

  const pageParam = Array.isArray(parameters.page)
    ? parameters.page[0]
    : parameters.page;

  const page = Math.max(
    Number(pageParam) || 1,
    1
  );
  const result = await getProducts(
    query,
    sort,
    page
  );

  const products = result.data;
  const pagination = result.pagination;

  function getPageUrl(targetPage: number) {
    const params = new URLSearchParams();

    if (query.trim()) {
      params.set("q", query.trim());
    }

    params.set("sort", sort);
    params.set("page", String(targetPage));

    return `/products?${params.toString()}`;
  }

  return (
    <main className="min-h-screen bg-slate-50 px-5 py-12">
      <div className="mx-auto max-w-7xl">
        <header className="mb-8">
          <h1 className="text-3xl font-bold text-slate-950">
            {query
              ? `Search results for "${query}"`
              : "Products"}
          </h1>

          <p className="mt-2 text-slate-600">
            {query
              ? `${products.length} product(s) found`
              : "Browse our latest computer hardware."}
          </p>
        </header>
        <div className="mb-6 flex justify-end">
          <SortSelect />
        </div>
        {products.length === 0 ? (
          <p className="rounded-xl border border-dashed border-slate-300 bg-white p-10 text-center text-slate-500">
            {query
              ? `No products found for "${query}".`
              : "No products are currently available."}
          </p>
        ) : (
          <section className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {products.map((product) => (
              <ProductCard
                key={product.id}
                product={product}

              />
            ))}
          </section>

        )}

        {pagination.totalPages > 1 && (
          <div className="mt-8 flex items-center justify-center gap-2">
            {pagination.page > 1 && (
              <Link
                href={getPageUrl(pagination.page - 1)}
                className="rounded border px-4 py-2"
              >
                Previous
              </Link>
            )}

            {Array.from(
              { length: pagination.totalPages },
              (_, index) => index + 1
            ).map((pageNumber) => (
              <Link
                key={pageNumber}
                href={getPageUrl(pageNumber)}
                className={
                  pageNumber === pagination.page
                    ? "rounded bg-black px-4 py-2 text-white"
                    : "rounded border px-4 py-2"
                }
              >
                {pageNumber}
              </Link>
            ))}

            {pagination.page < pagination.totalPages && (
              <Link
                href={getPageUrl(pagination.page + 1)}
                className="rounded border px-4 py-2"
              >
                Next
              </Link>
            )}
          </div>
        )}
      </div>
    </main>
  );
}