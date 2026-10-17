import { useState } from "react";
import { Heart } from "lucide-react";
import { useNavigate } from "react-router-dom";
import ProductCard from "../components/products/ProductCard";
import { useWishlist } from "../context/WishlistContext";

export default function WishlistPage() {
  const navigate = useNavigate();
  const { wishlist, toggleWishlist, isSaved } = useWishlist();
  const [selected, setSelected] = useState([]);

  function handleSave(product) {
    toggleWishlist(product);
    setSelected((current) =>
      current.filter((id) => id !== product.id)
    );
  }

  function toggleCompare(product) {
    setSelected((current) => {
      if (current.includes(product.id)) {
        return current.filter((id) => id !== product.id);
      }

      if (current.length >= 3) return current;

      return [...current, product.id];
    });
  }

  const selectedProducts = wishlist.filter((product) =>
    selected.includes(product.id)
  );

  function openComparison() {
    if (selectedProducts.length < 2) return;

    navigate("/compare", {
      state: { selectedProducts },
    });
  }

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
                onSave={handleSave}
                selected={selected.includes(product.id)}
                onCompare={toggleCompare}
              />
            ))}
          </div>

          {selected.length > 0 && (
            <div className="compare-bar">
              <div>
                <strong>
                  {selectedProducts.length} of 3 products selected
                </strong>
                <p>
                  {selectedProducts.length < 2
                    ? "Select one more product to compare."
                    : "Your comparison is ready."}
                </p>
              </div>

              <div className="topbar-actions">
                <button
                  type="button"
                  className="button button-secondary"
                  onClick={() => setSelected([])}
                >
                  Clear
                </button>

                <button
                  type="button"
                  className="button button-primary"
                  disabled={selectedProducts.length < 2}
                  onClick={openComparison}
                >
                  Compare selected
                </button>
              </div>
            </div>
          )}
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
            onClick={() => navigate("/explore")}
          >
            Explore products
          </button>
        </div>
      )}
    </div>
  );
}