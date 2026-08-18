export type Product = {
  id: string;
  sku: string;
  name: string;
  description: string;
  price: string;
  isActive: boolean;
  slug: string;
  imageUrl: string | null;
  category: {
    id: string;
    name: string;
  };
  brand: {
    id: string;
    name: string;
  };
  quantity: number;
}
type ProductsResponse = {
  data: Product[];

  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
};
type ProductResponse = {
  data: Product;
};


export async function getProducts(
    query = "",
    sort= "newest",
    page = 1,
  ): Promise<ProductsResponse> {    
    const parameters = new URLSearchParams();

    if (query.trim()) {
      parameters.set("q", query.trim());
    }
    parameters.set("sort", sort);
    parameters.set("page", String(page));
    const queryString = parameters.toString();

    const url =
      `${process.env.BACKEND_API_URL}/api/products` +
      (queryString ? `?${queryString}` : "");

    const response = await fetch(url, {
      cache: "no-store",
    });

    if (!response.ok) {
      throw new Error(
        `Failed to fetch products: ${response.status}`,
      );
    }

    const result: ProductsResponse =
      await response.json();

    return result;
}

export async function getProduct(
  slug: string,
): Promise<Product | null> {
  const response = await fetch(
    `${process.env.BACKEND_API_URL}/api/products/${encodeURIComponent(slug)}`,
    {
      cache: "no-store",
    },
  );

  if (response.status === 404) {
    return null;
  }

  if (!response.ok) {
    throw new Error(
      `Failed to fetch product: ${response.status}`,
    );
  }

  const result: ProductResponse = await response.json();

  return result.data;
}