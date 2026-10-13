
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  ArrowRight,
  Check,
  Star,
  Truck,
  Tag,
  X,
} from "lucide-react";
import { useSettings } from "../context/SettingsContext";

export default function ComparePage() {
  const location = useLocation();
  const navigate = useNavigate();

  const {
    settings,
    formatPrice,
    ratesLoading,
    ratesAvailable,
  } = useSettings();

  const selectedProducts = location.state?.selectedProducts ?? [];

  function removeProduct(productId) {
    const remainingProducts = selectedProducts.filter(
      (product) => product.id !== productId,
    );

    navigate("/app/compare", {
      state: { selectedProducts: remainingProducts },
      replace: true,
    });
  }

  function hasValue(value) {
    return (
      value !== null &&
      value !== undefined &&
      value !== "" &&
      Number.isFinite(Number(value))
    );
  }

  function getDisplayPrice(value, sourceCurrency = "USD") {
    if (!hasValue(value)) {
      return {
        text: null,
        convertedValue: null,
      };
    }

    const convertedValue =
      sourceCurrency === settings.currency
        ? Number(value)
        : null;

    const text = formatPrice(value, sourceCurrency);

    return {
      text,
      convertedValue:
        convertedValue !== null || text !== null
          ? sourceCurrency === settings.currency
            ? Number(value)
            : null
          : null,
    };
  }

  function getPriceLabel(value, sourceCurrency = "USD") {
    if (!hasValue(value)) {
      return "Price unavailable";
    }

    const formatted = formatPrice(value, sourceCurrency);

    if (formatted) {
      return formatted;
    }

    if (sourceCurrency !== settings.currency) {
      return ratesLoading
        ? "Converting price…"
        : ratesAvailable
          ? "Price unavailable"
          : "Exchange rate unavailable";
    }

    return "Price unavailable";
  }

  return (
    <div className="content-page">
      <div className="page-intro">
        <span className="eyebrow">COMPARE YOUR OPTIONS</span>
        <h2>Find the better fit.</h2>
        <p>
          Look at your options side by side and decide which one makes the most
          sense for you.
        </p>
      </div>

      {selectedProducts.length < 2 ? (
        <div className="empty-state">
          <div className="empty-state-icon">
            <Tag size={26} />
          </div>

          <h3>Choose products to compare</h3>
          <p>
            Head to Explore and select at least two products to see how they
            stack up.
          </p>

          <Link to="/app/explore" className="button button-primary">
            Explore products <ArrowRight size={16} />
          </Link>
        </div>
      ) : (
        <>
          <div className="section-heading compact-heading">
            <div>
              <h2>Your comparison</h2>
              <p>
                {selectedProducts.length} products selected · Prices shown in{" "}
                {settings.currency}
              </p>
            </div>

            <Link to="/app/explore" className="button button-secondary">
              Add more products
            </Link>
          </div>

          <div className="comparison-grid">
            {selectedProducts.map((product) => {
              const sourceCurrency = product.currency || "USD";
              const price = getDisplayPrice(
                product.price,
                sourceCurrency,
              );
              const originalPrice = getDisplayPrice(
                product.originalPrice,
                sourceCurrency,
              );

              const priceLabel = getPriceLabel(
                product.price,
                sourceCurrency,
              );
              const originalPriceLabel = getPriceLabel(
                product.originalPrice,
                sourceCurrency,
              );

              const canShowDiscount =
                hasValue(product.price) &&
                hasValue(product.originalPrice) &&
                Number(product.originalPrice) > Number(product.price) &&
                Boolean(price.text) &&
                Boolean(originalPrice.text);

              const brand = product.brand?.trim() || "";
              const category = product.category?.trim() || "";

              const brandIsEstimated =
                Boolean(product.brandInferred) ||
                (!brand && Boolean(product.name));

              const categoryIsEstimated =
                Boolean(product.categoryInferred) ||
                (!category && Boolean(product.name));

              return (
                <article className="comparison-card" key={product.id}>
                  <div className="comparison-card-header">
                    <span className="eyebrow">
                      {category || "Category unavailable"}
                      {category && categoryIsEstimated ? " · Estimated" : ""}
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

                  {product.imageUrl && (
                    <img
                      src={product.imageUrl}
                      alt={product.name || "Product"}
                      className="comparison-product-image"
                      loading="lazy"
                      onError={(event) => {
                        event.currentTarget.style.display = "none";
                      }}
                    />
                  )}

                  <h3>{product.name || "Unnamed product"}</h3>

                  <p className="comparison-brand">
                    {brand || "Brand not listed"}
                    {brand && brandIsEstimated ? " · Estimated" : ""}
                  </p>

                  <div className="comparison-price">{priceLabel}</div>

                  {canShowDiscount && (
                    <p className="comparison-old-price">
                      <span>Listed original price: </span>
                      <s>{originalPriceLabel}</s>
                    </p>
                  )}

                  <p className="comparison-retailer">
                    {product.retailer
                      ? `Listed at ${product.retailer}`
                      : "Retailer not listed"}
                  </p>

                  {hasValue(product.rating) && (
                    <div className="comparison-detail">
                      <span>
                        <Star size={15} /> Rating
                      </span>
                      <strong>{Number(product.rating).toFixed(1)} / 5</strong>
                    </div>
                  )}

                  {hasValue(product.reviewCount) && (
                    <div className="comparison-detail">
                      <span>Review count</span>
                      <strong>
                        {Number(product.reviewCount).toLocaleString("en-US")}
                      </strong>
                    </div>
                  )}

                  <div className="comparison-divider" />

                  <div className="comparison-detail">
                    <span>Brand</span>
                    <strong>
                      {brand || "Not available"}
                      {brand && brandIsEstimated ? " (estimated)" : ""}
                    </strong>
                  </div>

                  <div className="comparison-detail">
                    <span>Category</span>
                    <strong>
                      {category || "Not available"}
                      {category && categoryIsEstimated ? " (estimated)" : ""}
                    </strong>
                  </div>

                  {product.condition && (
                    <div className="comparison-detail">
                      <span>Condition</span>
                      <strong>{product.condition}</strong>
                    </div>
                  )}

                  {product.delivery && (
                    <div className="comparison-detail">
                      <span>
                        <Truck size={15} /> Delivery
                      </span>
                      <strong>{product.delivery}</strong>
                    </div>
                  )}

                  {product.description?.trim() ? (
                    <p className="compare-description">{product.description}</p>
                  ) : (
                    <p className="compare-description-fallback">
                      No description was provided by the retailer.
                    </p>
                  )}

                  <div className="comparison-verdict">
                    {price.text ? <Check size={16} /> : <Tag size={16} />}
                    <span>
                      {price.text
                        ? "Price available for comparison"
                        : "Check the retailer for pricing"}
                    </span>
                  </div>

                  {(product.productUrl || product.url) && (
                    <a
                      href={product.productUrl || product.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="button button-secondary"
                    >
                      View listing <ArrowRight size={16} />
                    </a>
                  )}
                </article>
              );
            })}
          </div>

          <p className="comparison-disclaimer">
            Prices are displayed in your selected currency using available
            exchange rates; converted prices are estimates, not retailer
            checkout prices. Shopping listings and prices can change. Ratings,
            delivery details, and other information are displayed only when
            supplied by the provider. Brand and category labels marked
            estimated are inferred from listing information and may not be
            verified. Check the retailer's listing before purchasing.
          </p>
        </>
      )}
    </div>
  );
}