export default function ProductDetailLoading() {
  return (
    <main
      aria-label="Loading product details"
      className="mx-auto w-full max-w-7xl animate-pulse px-5 py-10 sm:py-14"
    >

      <div className="mb-8 h-5 w-32 rounded bg-slate-200" />

      <section className="grid gap-10 lg:grid-cols-2 lg:gap-16">
        {/* image */}
        <div className="aspect-square rounded-2xl border border-slate-200 bg-slate-100" />

        {/* details */}
        <div className="flex flex-col justify-center">
          <div className="h-4 w-28 rounded bg-blue-100" />

          <div className="mt-4 h-10 w-4/5 rounded bg-slate-200" />

          <div className="mt-6 h-4 w-full rounded bg-slate-200" />
          <div className="mt-3 h-4 w-5/6 rounded bg-slate-200" />
          <div className="mt-3 h-4 w-2/3 rounded bg-slate-200" />

          <div className="mt-8 h-9 w-32 rounded bg-slate-200" />

          <div className="mt-8 border-y border-slate-200">
            <div className="flex justify-between py-4">
              <div className="h-4 w-16 rounded bg-slate-200" />
              <div className="h-4 w-24 rounded bg-slate-200" />
            </div>

            <div className="flex justify-between border-t border-slate-200 py-4">
              <div className="h-4 w-20 rounded bg-slate-200" />
              <div className="h-4 w-28 rounded bg-slate-200" />
            </div>

            <div className="flex justify-between border-t border-slate-200 py-4">
              <div className="h-4 w-12 rounded bg-slate-200" />
              <div className="h-4 w-36 rounded bg-slate-200" />
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}