
import { Heart, ArrowUpRight, GitCompareArrows, ImageOff } from "lucide-react";
import { useSettings } from "../../context/SettingsContext";

export default function ProductCard({
  product,
  saved = false,
  selected = false,
  onSave,
  onCompare,
  onView,
}) {
  const { settings, formatPrice, ratesLoading, ratesAvailable } = useSettings();

  const imageUrl = product.imageUrl || product.image || "";
  const sourceCurrency = product.currency || "USD";
  const price = Number(product.price);

  const hasPrice =
    product.price !== null &&
    product.price !== undefined &&
    product.price !== "" &&
    Number.isFinite(price);

  const formattedPrice = hasPrice
    ? formatPrice(price, sourceCurrency)
    : null;

  const originalPrice = Number(product.originalPrice);

  const hasOriginalPrice =
    product.originalPrice !== null &&
    product.originalPrice !== undefined &&
    product.originalPrice !== "" &&
    Number.isFinite(originalPrice) &&
    hasPrice &&
    originalPrice > price;

  const formattedOriginalPrice = hasOriginalPrice
    ? formatPrice(originalPrice, sourceCurrency)
    : null;

  const needsConversion = sourceCurrency !== settings.currency;

  let priceLabel = formattedPrice || "Price unavailable";

  if (hasPrice && !formattedPrice && needsConversion) {
    priceLabel = ratesLoading
      ? "Converting price…"
      : ratesAvailable
        ? "Price unavailable"
        : "Exchange rate unavailable";
  }

  const brand = product.brand?.trim() || "";
  const retailer = product.retailer?.trim() || "";
  const productUrl = product.productUrl || product.url || "";

  function handleView() {
    if (onView) {
      onView(product);
      return;
    }

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

              const placeholder = event.currentTarget.nextElementSibling;

              if (placeholder) {
                placeholder.style.display = "flex";
              }
            }}
          />
        ) : null}

        {!imageUrl && (
          <div className="product-image-placeholder">
            <ImageOff size={28} />
            <span>No image available</span>
          </div>
        )}

        {imageUrl && (
          <div
            className="product-image-placeholder"
            style={{ display: "none" }}
          >
            <ImageOff size={28} />
            <span>No image available</span>
          </div>
        )}

        <button
          type="button"
          className={`product-save-button ${saved ? "is-saved" : ""}`}
          onClick={() => onSave?.(product)}
          aria-label={saved ? "Remove from wishlist" : "Save to wishlist"}
          aria-pressed={saved}
        >
          <Heart size={18} fill={saved ? "currentColor" : "none"} />
        </button>
      </div>

      <div className="product-card-body">
        <div className="product-meta">
          <span>
            {brand || "Brand not listed"}
            {brand && product.brandInferred ? " · Estimated" : ""}
          </span>

          <span>{retailer || "Retailer not listed"}</span>
        </div>

        <h3>{product.name || "Unnamed product"}</h3>

        <div className="product-price-row">
          <span className="product-price">{priceLabel}</span>

          {hasOriginalPrice && formattedOriginalPrice && (
            <span className="product-old-price">
              {formattedOriginalPrice}
            </span>
          )}
        </div>

        {product.category && (
          <p className="product-category">
            {product.category}
            {product.categoryInferred ? " · Estimated" : ""}
          </p>
        )}

        {product.description && (
          <p className="product-description">{product.description}</p>
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
            disabled={!onView && !productUrl}
            title="View product"
          >
            <ArrowUpRight size={18} />
          </button>
        </div>
      </div>
    </article>
  );
}
