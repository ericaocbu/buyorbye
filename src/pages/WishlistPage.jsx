
import ProductCard from "../components/products/ProductCard";
import { products } from "../data/products";

export default function WishlistPage() {
  return (
    <div className="content-page">
      <div className="page-intro">
        <span className="eyebrow">YOUR COLLECTION</span>
        <h2>My list</h2>
        <p>Everything you're considering, all in one place.</p>
      </div>

      <div className="product-grid">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
}
