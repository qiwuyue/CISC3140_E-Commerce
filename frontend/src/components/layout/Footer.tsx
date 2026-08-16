import Link from "next/link";

export default function Footer() {
  return (
    <footer className="border-t border-slate-200 bg-slate-50">
      <div className="mx-auto flex max-w-7xl flex-col gap-3 px-5 py-8 text-sm text-slate-500 sm:flex-row sm:items-center sm:justify-between">
        <p>© 2026 MarcoCenter. All rights reserved.</p>

        <nav className="flex gap-5" aria-label="Footer navigation">
          <Link href="/products" className="hover:text-blue-600">
            Products
          </Link>

          <Link href="/login" className="hover:text-blue-600">
            Account
          </Link>

          <Link href="/cart" className="hover:text-blue-600">
            Cart
          </Link>
        </nav>
      </div>
    </footer>
  );
}