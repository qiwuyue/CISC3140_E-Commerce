import {getProducts} from "@/lib/product";
import ProductCard from "@/components/products/ProductCard";

export default async function ProductsPage() {
    const products = await getProducts();
    return (<main>
        <h1>Products</h1>
        <div>
            {products.map((product) => (
                <ProductCard key={product.id} product={product} />
            ))}
        </div>

    </main>)
}