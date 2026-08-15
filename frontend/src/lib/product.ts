export type Product = {
  id: string;
  sku: string;
  name: string;
  description: string;
  price: string;
  isActive: boolean;
  category: {
    id: string;
    name: string;
  };
  brand: {
    id: string;
    name: string;
  };
}
type ProductsResponse = {
  data: Product[];
};

export async function getProducts(
    query = "",
  ): Promise<Product[]> {
    const parameters = new URLSearchParams();

    if (query.trim()) {
      parameters.set("q", query.trim());
    }

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

    return result.data;
}