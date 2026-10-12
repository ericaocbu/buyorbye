import {
  Heart,
  ArrowUpRight,
  GitCompareArrows,
  ImageOff,
} from "lucide-react";

export default function ProductCard({
  product,
  saved = false,
  selected = false,
  onSave,
  onCompare,
  onView,
}) {
  const imageUrl = product.imageUrl || product.image;
  const price = Number(product.price);
  const hasPrice =
    product.price !== null &&
    product.price !== undefined &&
    product.price !== "" &&
    Number.isFinite(price);

  const currency = product.currency || "USD";

  const formattedPrice = hasPrice
    ? new Intl.NumberFormat("en-US", {
        style: "currency",
        currency,
      }).format(price)
    : null;

  const originalPrice = Number(product.originalPrice);
  const hasOriginalPrice =
    product.originalPrice !== null &&
    product.originalPrice !== undefined &&
    product.originalPrice !== "" &&
    Number.isFinite(originalPrice) &&
    hasPrice &&
    originalPrice > price;

  function handleView() {
    if (onView) {
      onView(product);
      return;
    }

    const productUrl = product.productUrl || product.url;

    if (productUrl) {
      window.open(productUrl, "_blank", "noopener,noreferrer");
    }
  }

  return (
    <article className="product-card">
      <div className="product-image-wrap">
        {imageUrl ? (
          <img
            className="product-image"
            src={imageUrl}
            alt={product.name || "Product"}
            loading="lazy"
            onError={(event) => {
              event.currentTarget.style.display = "none";
            }}
          />
        ) : (
          <div
            className="product-image-placeholder"
            aria-label="No product image available"
          >
            <ImageOff size={28} />
            <span>No image available</span>
          </div>
        )}

        <button
          type="button"
          className={`product-save-button ${
            saved ? "is-saved" : ""
          }`}
          onClick={() => onSave?.(product)}
          aria-label={
            saved ? "Remove from wishlist" : "Save to wishlist"
          }
          aria-pressed={saved}
        >
          <Heart
            size={18}
            fill={saved ? "currentColor" : "none"}
          />
        </button>
      </div>

      <div className="product-card-body">
        <div className="product-meta">
          <span>{product.brand || "Brand not listed"}</span>
          <span>{product.retailer || "Retailer not listed"}</span>
        </div>

        <h3>{product.name || "Unnamed product"}</h3>

        <div className="product-price-row">
          <span className="product-price">
            {formattedPrice || "Price unavailable"}
          </span>

          {hasOriginalPrice && (
            <span className="product-old-price">
              {new Intl.NumberFormat("en-US", {
                style: "currency",
                currency,
              }).format(originalPrice)}
            </span>
          )}
        </div>

        {product.description && (
          <p className="product-description">
            {product.description}
          </p>
        )}

        <div className="product-card-actions">
          <button
            type="button"
            className={`button button-compare ${
              selected ? "button-selected" : ""
            }`}
            onClick={() => onCompare?.(product)}
            aria-pressed={selected}
          >
            <GitCompareArrows size={16} />
            {selected ? "Selected" : "Compare"}
          </button>

          <button
            type="button"
            className="icon-button product-open-button"
            aria-label={`View ${product.name || "product"}`}
            onClick={handleView}
            disabled={!onView && !(product.productUrl || product.url)}
            title="View product"
          >
            <ArrowUpRight size={18} />
          </button>
        </div>
      </div>
    </article>
  );
}