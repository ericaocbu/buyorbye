import { Heart } from "lucide-react";
import { useNavigate } from "react-router-dom";
import ProductCard from "../components/products/ProductCard";
import { useWishlist } from "../context/WishlistContext";

export default function WishlistPage() {
  const navigate = useNavigate();
  const { wishlist, toggleWishlist, isSaved } = useWishlist();

  return (
    <div className="content-page">
      <div className="page-intro">
        <span className="eyebrow">YOUR COLLECTION</span>
        <h2>My list</h2>
        <p>Everything you're considering, all in one place.</p>
      </div>

      {wishlist.length > 0 ? (
        <>
          <div className="section-heading compact-heading">
            <div>
              <h2>Your saved products</h2>
              <p>
                {wishlist.length}{" "}
                {wishlist.length === 1 ? "product" : "products"} saved
              </p>
            </div>
          </div>

          <div className="product-grid">
            {wishlist.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                saved={isSaved(product.id)}
                onSave={toggleWishlist}
              />
            ))}
          </div>
        </>
      ) : (
        <div className="empty-state">
          <Heart size={28} aria-hidden="true" />
          <h3>Your list is waiting</h3>
          <p>
            When you find something worth considering, save it here
            to revisit it before making a decision.
          </p>
          <button
            type="button"
            className="button button-primary"
            onClick={() => navigate("/app/explore")}
          >
            Explore products
          </button>
        </div>
      )}
    </div>
  );
}