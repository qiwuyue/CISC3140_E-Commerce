import type {Product} from "@/lib/product";

type ProductCardProps = {
    product: Product;
};

export default function ProductCard({product}: ProductCardProps) {
    return (<article>
            <h2>{product.name}</h2>
            <p>{product.description}</p>
            <p>Price: {product.price}</p>
            <p>Category: {product.category.name}</p>
            <p>Brand: {product.brand.name}</p>
        </article>
    );
}