"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { createProductSchema } from "@ecommerce/shared";
import ImageUpload from "@/components/image/imageUpload";
import { toast } from "sonner";

type Option = {
  id: string;
  name: string;
};

export default function EditProductPage() {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const supabase = createClient();

  const [categories, setCategories] = useState<Option[]>([]);
  const [brands, setBrands] = useState<Option[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [image, setImage] = useState<File | null>(null);
  const [currentImageUrl, setCurrentImageUrl] =
    useState<string | null>(null);


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

  useEffect(() => {
    async function loadProduct() {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!session) return;

      const headers = {
        Authorization: `Bearer ${session.access_token}`,
      };

      const [productResponse, optionsResponse] =
        await Promise.all([
          fetch(
            `${process.env.NEXT_PUBLIC_BACKEND_API_URL}/api/admin/products/${params.id}`,
            { headers }
          ),

          fetch(
            `${process.env.NEXT_PUBLIC_BACKEND_API_URL}/api/admin/product-options`,
            { headers }
          ),
        ]);

      if (!productResponse.ok || !optionsResponse.ok) {
        setError("Failed to load product");
        setLoading(false);
        return;
      }

      const productResult =
        await productResponse.json();

      const optionsResult =
        await optionsResponse.json();

      const product = productResult.data;

      setForm({
        name: product.name,
        description: product.description,
        sku: product.sku,
        price: String(product.price),
        quantity: String(product.quantity),
        categoryId: product.categoryId,
        brandId: product.brandId,
        isActive: product.isActive,
      });
      setCurrentImageUrl(product.imageUrl ?? null);

      setCategories(
        optionsResult.data.categories
      );

      setBrands(
        optionsResult.data.brands
      );

      setLoading(false);
    }

    loadProduct();
  }, [params.id]);

  function handleChange(
    event: React.ChangeEvent<
      HTMLInputElement |
      HTMLTextAreaElement |
      HTMLSelectElement
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

    const validation =
      createProductSchema.safeParse(form);

    if (!validation.success) {
      setError("Please check the product information.");
      return;
    }

    const {
      data: { session },
    } = await supabase.auth.getSession();

    if (!session) return;
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_API_URL}/api/admin/products/${params.id}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${session.access_token}`,
          },
          body: JSON.stringify(validation.data),
        }
      );
      const result = await response.json();
      if (!response.ok) {

        setError(result.error || "Failed to update product");
        return;
      }
      //upload image
      if (image) {
        const formData = new FormData();

        formData.append("image", image);

        const imageResponse = await fetch(
          `${process.env.NEXT_PUBLIC_BACKEND_API_URL}/api/admin/products/${params.id}/image`,
          {
            method: "POST",
            headers: {
              Authorization: `Bearer ${session.access_token}`,
            },
            body: formData,
          }
        );

        const imageResult = await imageResponse.json();

        if (!imageResponse.ok) {
          setError(
            imageResult.error || "Product updated, but image upload failed."
          );
          return;
        }
      }
    } catch (error) {
      setError(
        "Unable to connect to the server. Please try again."
      );

    }
    router.push("/admin/products");
  }

  if (loading) {
    return <p>Loading product...</p>;
  }

  return (
    <main className="mx-auto max-w-3xl px-6 py-10">
      <h1 className="text-3xl font-bold">
        Edit Product
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
            currentImageUrl={currentImageUrl}
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
          Save Changes
        </button>
      </form>

    </main>
  );
} 