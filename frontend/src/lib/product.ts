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

export async function getProducts(): Promise<Product[]> {
    const response = await fetch(`${process.env.BACKEND_API_URL}/api/products`,{
        cache: 'no-store',
    });
    if (!response.ok) {
        throw new Error('Failed to fetch products:${response.status}');
    }
    const result: ProductsResponse = await response.json();
    return result.data;
}