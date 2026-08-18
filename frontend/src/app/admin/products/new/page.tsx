"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { createProductSchema } from "@ecommerce/shared";
import ImageUpload from "@/components/image/imageUpload";

type Option = {
  id: string;
  name: string;
};

export default function CreateProductPage() {
  const router = useRouter();
  const supabase = createClient();

  const [categories, setCategories] = useState<Option[]>([]);
  const [brands, setBrands] = useState<Option[]>([]);
  const [image, setImage] = useState<File | null>(null);
  const [form, setForm] = useState({
    name: "",
    description: "",
    sku: "",
    price: "",
    quantity: "",
    categoryId: "",
    brandId: "",
    isActive: true,
  });

  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchOptions() {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!session) return;

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_API_URL}/api/admin/product-options`,
        {
          headers: {
            Authorization: `Bearer ${session.access_token}`,
          },
        }
      );

      if (!response.ok) return;

      const result = await response.json();

      setCategories(result.data.categories);
      setBrands(result.data.brands);
    }

    fetchOptions();
  }, []);

  function handleChange(
    event: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) {
    const { name, value } = event.target;

    setForm((current) => ({
      ...current,
      [name]: value,
    }));
  }
  function handleActiveChange(
    event: React.ChangeEvent<HTMLInputElement>
  ) {
    setForm((current) => ({
      ...current,
      isActive: event.target.checked,
    }));
  }

  async function handleSubmit(
    event: React.SyntheticEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    setError(null);

    const validation = createProductSchema.safeParse(form);

    if (!validation.success) {
      console.log(validation.error.issues)
      setError("Please check the product information.");
      return;
    }

    const {
      data: { session },
    } = await supabase.auth.getSession();

    if (!session) return;

    const response = await fetch(
      `${process.env.NEXT_PUBLIC_BACKEND_API_URL}/api/admin/products`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session.access_token}`,
        },
        body: JSON.stringify(validation.data),
      }
    );

    const result = await response.json();

    if (!response.ok) {
      setError(result.error || "Failed to create product");
      return;
    }
    let imageUploadFailed = false;

    if (image) {
      try {
        const formData = new FormData();
        formData.append("image", image);

        const imageResponse = await fetch(
          `${process.env.NEXT_PUBLIC_BACKEND_API_URL}/api/admin/products/${result.data.id}/image`,
          {
            method: "POST",
            headers: {
              Authorization: `Bearer ${session.access_token}`,
            },
            body: formData,
          }
        );

        if (!imageResponse.ok) {
          imageUploadFailed = true;
        }
      } catch (error) {
        console.error("Image upload exception:", error);
        imageUploadFailed = true;
      }
    }

    if (imageUploadFailed) {
      setError(
        "Product was created, but the image failed to upload. You can upload it later."
      );

      setTimeout(() => {
        router.push("/admin/products");
      }, 2000);

      return;
    }

    router.push("/admin/products");
  }

  return (
    <main className="mx-auto max-w-3xl px-6 py-10">
      <h1 className="text-3xl font-bold">
        Create Product
      </h1>

      <form
        onSubmit={handleSubmit}
        className="mt-8 space-y-5"
      >
        <div>
          <label>Product Name</label>

          <input
            name="name"
            value={form.name}
            onChange={handleChange}
            className="mt-1 w-full rounded border px-3 py-2"
          />
        </div>



        <div>
          <label>Description</label>

          <textarea
            name="description"
            value={form.description}
            onChange={handleChange}
            className="mt-1 w-full rounded border px-3 py-2"
          />
        </div>

        <div>
          <label>SKU</label>

          <input
            name="sku"
            value={form.sku}
            onChange={handleChange}
            className="mt-1 w-full rounded border px-3 py-2"
          />
        </div>

        <div>
          <label>Price</label>

          <input
            name="price"
            type="number"
            step="0.01"
            value={form.price}
            onChange={handleChange}
            className="mt-1 w-full rounded border px-3 py-2"
          />
        </div>

        <div>
          <label>Quantity</label>

          <input
            name="quantity"
            type="number"
            value={form.quantity}
            onChange={handleChange}
            className="mt-1 w-full rounded border px-3 py-2"
          />
        </div>
        <div>
          <ImageUpload
            value={image}
            onChange={setImage}
          />
        </div>

        <div>
          <label>Category</label>

          <select
            name="categoryId"
            value={form.categoryId}
            onChange={handleChange}
            className="mt-1 w-full rounded border px-3 py-2"
          >
            <option value="">
              Select category
            </option>

            {categories.map((category) => (
              <option
                key={category.id}
                value={category.id}
              >
                {category.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label>Brand</label>

          <select
            name="brandId"
            value={form.brandId}
            onChange={handleChange}
            className="mt-1 w-full rounded border px-3 py-2"
          >
            <option value="">
              Select brand
            </option>

            {brands.map((brand) => (
              <option
                key={brand.id}
                value={brand.id}
              >
                {brand.name}
              </option>
            ))}
          </select>
        </div>
        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={form.isActive}
            onChange={handleActiveChange}
          />
          Active
        </label>



        {error && (
          <p className="text-sm text-red-600">
            {error}
          </p>
        )}

        <button
          type="submit"
          className="rounded bg-black px-5 py-2 text-white"
        >
          Create Product
        </button>
      </form>
    </main>
  );
}