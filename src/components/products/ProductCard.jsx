
import { Heart, ArrowUpRight, GitCompareArrows } from "lucide-react";

export default function ProductCard({
  product,
  saved = false,
  selected = false,
  onSave,
  onCompare,
}) {
  const statusLabels = {
    considering: "Considering",
    wait: "On hold",
    buy: "Ready to buy",
    bought: "Purchased",
    passed: "Passed",
  };

  return (
    <article className="product-card">
      <div className="product-image-wrap">
        <img
          className="product-image"
          src={product.image}
          alt={product.name}
          loading="lazy"
        />

        <span className={`status-badge status-${product.status}`}>
          <span className="status-dot" />
          {statusLabels[product.status] || "Considering"}
        </span>

        <button
          className={`product-save-button ${saved ? "is-saved" : ""}`}
          onClick={() => onSave?.(product)}
          aria-label={saved ? "Remove from saved items" : "Save product"}
        >
          <Heart size={18} fill={saved ? "currentColor" : "none"} />
        </button>
      </div>

      <div className="product-card-body">
        <div className="product-meta">
          <span>{product.brand}</span>
          <span>{product.retailer}</span>
        </div>

        <h3>{product.name}</h3>

        <div className="product-price-row">
          <span className="product-price">
            ${product.price.toFixed(2)}
          </span>
          {product.originalPrice && product.originalPrice > product.price && (
            <span className="product-old-price">
              ${product.originalPrice.toFixed(2)}
            </span>
          )}
        </div>

        <p className="product-description">{product.description}</p>

        <div className="product-card-actions">
          <button
            className={`button button-compare ${selected ? "button-selected" : ""}`}
            onClick={() => onCompare?.(product)}
          >
            <GitCompareArrows size={16} />
            {selected ? "Selected" : "Compare"}
          </button>

          <button
            className="icon-button product-open-button"
            aria-label={`View ${product.name}`}
            onClick={() =>
              window.dispatchEvent(
                new CustomEvent("buyorbye:view-product", {
                  detail: product,
                })
              )
            }
          >
            <ArrowUpRight size={18} />
          </button>
        </div>
      </div>
    </article>
  );
}
