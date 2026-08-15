export default function ProductsLoading() {
  return (
    <main
      className="min-h-screen bg-slate-50 px-5 py-12"
      aria-busy="true"
      aria-label="Loading products"
    >
      <div className="mx-auto max-w-7xl">
        <div className="mb-8">
          <div className="h-9 w-40 animate-pulse rounded bg-slate-200" />
          <div className="mt-3 h-5 w-72 animate-pulse rounded bg-slate-200" />
        </div>

        <section className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, index) => (
            <article
              key={index}
              className="h-64 animate-pulse rounded-xl border border-slate-200 bg-white p-5 shadow-sm"
            >
              <div className="h-5 w-24 rounded bg-slate-200" />
              <div className="mt-5 h-6 w-3/4 rounded bg-slate-200" />
              <div className="mt-4 h-4 w-full rounded bg-slate-200" />
              <div className="mt-2 h-4 w-2/3 rounded bg-slate-200" />
              <div className="mt-12 h-7 w-24 rounded bg-slate-200" />
            </article>
          ))}
        </section>
      </div>
    </main>
  );
}