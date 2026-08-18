import Link from "next/link";

export default function AdminDashboardPage() {
  return (
    <main className="mx-auto max-w-7xl px-6 py-10">
      <div>
        <h1 className="text-3xl font-bold">
          Admin Dashboard
        </h1>

        <p className="mt-2 text-gray-500">
          Manage products, inventory, and customer orders.
        </p>
      </div>

      <div className="mt-8 grid gap-6 md:grid-cols-2">
        <Link
          href="/admin/products"
          className="rounded-xl border p-6"
        >
          <h2 className="text-xl font-semibold">
            Products
          </h2>

          <p className="mt-2 text-gray-500">
            Create, edit, deactivate products,
            and manage inventory.
          </p>
        </Link>
      
        <Link
          href="/admin/orders"
          className="rounded-xl border p-6"
        >
          <h2 className="text-xl font-semibold">
            Customer Orders
          </h2>

          <p className="mt-2 text-gray-500">
            View paid orders and manage
            fulfillment status.
          </p>
        </Link>
      </div>
    </main>
  );
}