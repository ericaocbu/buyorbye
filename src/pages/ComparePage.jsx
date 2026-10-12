import { useMemo } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { ArrowLeft, ArrowRight, Check, X } from "lucide-react";
import { products } from "../data/products";

export default function ComparePage() {
  const location = useLocation();
  const navigate = useNavigate();

  const selectedIds = location.state?.selectedIds ?? [];

  const selectedProducts = useMemo(
    () =>
      selectedIds
        .map((id) => products.find((product) => product.id === id))
        .filter(Boolean),
    [selectedIds]
  );

  function removeProduct(productId) {
    const remainingIds = selectedProducts
      .filter((product) => product.id !== productId)
      .map((product) => product.id);

    navigate("/app/compare", {
      state: { selectedIds: remainingIds },
      replace: true,
    });
  }

  return (
    <div className="content-page">
      <div className="page-intro">
        <span className="eyebrow">COMPARE YOUR OPTIONS</span>
        <h2>Find the better fit.</h2>
        <p>
          Look at your options side by side and decide which one
          makes the most sense for you.
        </p>
      </div>

      {selectedProducts.length < 2 ? (
        <div className="empty-state">
          <div className="empty-state-icon">
            <ArrowLeft size={26} />
          </div>
          <h3>Choose products to compare</h3>
          <p>
            Head to Explore and select at least two products to see
            how they stack up.
          </p>
          <Link
            to="/app/explore"
            className="button button-primary"
          >
            Explore products <ArrowRight size={16} />
          </Link>
        </div>
      ) : (
        <>
          <div className="section-heading compact-heading">
            <div>
              <h2>Your comparison</h2>
              <p>
                {selectedProducts.length} products selected
              </p>
            </div>
            <Link
              to="/app/explore"
              className="button button-secondary"
            >
              Add more products
            </Link>
          </div>

          <div className="comparison-grid">
            {selectedProducts.map((product) => (
              <article
                className="comparison-card"
                key={product.id}
              >
                <div className="comparison-card-header">
                  <span className="eyebrow">
                    {product.category}
                  </span>
                  <button
                    type="button"
                    className="icon-button"
                    onClick={() => removeProduct(product.id)}
                    aria-label={`Remove ${product.name} from comparison`}
                    title="Remove product"
                  >
                    <X size={17} />
                  </button>
                </div>

                <h3>{product.name}</h3>
                <p className="comparison-brand">{product.brand}</p>

                <div className="comparison-price">
                  ${Number(product.price).toFixed(2)}
                </div>
                <p className="comparison-retailer">
                  Listed at {product.retailer}
                </p>

                <div className="comparison-divider" />

                <div className="comparison-detail">
                  <span>Brand</span>
                  <strong>{product.brand || "Not specified"}</strong>
                </div>

                <div className="comparison-detail">
                  <span>Category</span>
                  <strong>{product.category || "Not specified"}</strong>
                </div>

                <div className="comparison-description">
                  <h4>About this product</h4>
                  <p>
                    {product.description ||
                      "No product description is available yet."}
                  </p>
                </div>

                <div className="comparison-verdict">
                  <Check size={16} />
                  <span>
                    {product.price != null
                      ? "Price available for comparison"
                      : "Price not available"}
                  </span>
                </div>
              </article>
            ))}
          </div>

          <p className="comparison-disclaimer">
            Demo data only. Prices and retailer listings are
            examples, not verified live offers. The lowest price
            isn't always the best fit—consider the features and
            what matters most to you.
          </p>
        </>
      )}
    </div>
  );
}