"use client";

import { useRouter, useSearchParams } from "next/navigation";

export default function SortSelect() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const sort = searchParams.get("sort") ?? "newest";

  function handleChange(
    event: React.ChangeEvent<HTMLSelectElement>
  ) {
    const parameters = new URLSearchParams(
      searchParams.toString()
    );

    parameters.set("sort", event.target.value);

    router.push(
      `/products?${parameters.toString()}`
    );
  }

  return (
    <select
      value={sort}
      onChange={handleChange}
      className="rounded-lg border px-3 py-2"
    >
      <option value="newest">
        Newest
      </option>

      <option value="price_asc">
        Price: Low to High
      </option>

      <option value="price_desc">
        Price: High to Low
      </option>

      <option value="name_asc">
        Name: A-Z
      </option>
    </select>
  );
}