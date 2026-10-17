import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowDownRight,
  ArrowRight,
  CheckCircle2,
  Clock3,
  Heart,
  ShoppingBag,
  Sparkles,
  Scale,
} from "lucide-react";

import { useWishlist } from "../context/WishlistContext";
import { useEvaluations } from "../context/EvaluationContext";
import ProductCard from "../components/products/ProductCard";

export default function DashboardPage() {
  const navigate = useNavigate();

  const { wishlist, toggleWishlist, isSaved } = useWishlist();
  const { evaluations } = useEvaluations();

  const [selected, setSelected] = useState([]);

  const waitingCount = evaluations.filter(
    (evaluation) => evaluation.decision === "wait",
  ).length;

  const savedProducts = wishlist.slice(0, 3);

  // Select or deselect a product for comparison.
  // A maximum of three products can be selected.
  function toggleCompare(product) {
    setSelected((current) => {
      if (current.includes(product.id)) {
        return current.filter((id) => id !== product.id);
      }

      if (current.length >= 3) {
        return current;
      }

      return [...current, product.id];
    });
  }

  // Keep the selected products in the same order they were selected.
  const selectedProducts = selected
    .map((id) => wishlist.find((product) => product.id === id))
    .filter(Boolean);

  // Remove a product from the comparison selection if it is unsaved.
  function handleSave(product) {
    const wasSaved = isSaved(product.id);

    toggleWishlist(product);

    if (wasSaved) {
      setSelected((current) => current.filter((id) => id !== product.id));
    }
  }

  function openComparison() {
    if (selectedProducts.length < 2) {
      return;
    }

    navigate("/compare", {
      state: { selectedProducts },
    });
  }

  return (
    <div className="dashboard-page">
      {/* HERO */}
      <section className="dashboard-hero">
        <div className="dashboard-hero-copy">
          <span className="dashboard-kicker">
            <Sparkles size={13} />
            YOUR PERSONAL SHOPPING SPACE
          </span>

          <h2>
            A little less impulse.
            <br />A lot more <span>intention.</span>
          </h2>

          <p>
            Keep track of what catches your eye, compare your options, and
            decide what is actually worth your money.
          </p>

          <div className="dashboard-hero-actions">
            <button
              type="button"
              className="button button-primary"
              onClick={() => navigate("/explore")}
            >
              Explore products
              <ArrowRight size={16} />
            </button>

            <span className="dashboard-hero-note">
              Your money. Your priorities. Your decision.
            </span>
          </div>
        </div>

        <div className="dashboard-hero-art" aria-hidden="true">
          <div className="hero-art-orbit hero-art-orbit-one" />
          <div className="hero-art-orbit hero-art-orbit-two" />

          <div className="hero-art-card">
            <div className="hero-art-bag">
              <ShoppingBag size={21} />
            </div>

            <span className="hero-art-overline">THE ART OF DECIDING</span>

            <h3>Is it worth it?</h3>

            <p>A good deal is only good if it makes sense for you.</p>

            <div className="hero-art-divider" />

            <div className="hero-art-step">
              <span>01</span>
              <span>Explore your options</span>
              <CheckCircle2 size={15} />
            </div>

            <div className="hero-art-step">
              <span>02</span>
              <span>Compare what matters</span>
              <CheckCircle2 size={15} />
            </div>

            <div className="hero-art-step">
              <span>03</span>
              <span>Make your decision</span>
              <ArrowRight size={15} />
            </div>
          </div>

          <div className="hero-art-label">
            <span className="hero-art-dot" />
            SHOP THOUGHTFULLY
          </div>

          <div className="hero-art-stamp">Buy better, not more.</div>
        </div>
      </section>

      {/* OVERVIEW STATS */}
      <section className="dashboard-overview">
        <div className="dashboard-section-label">
          <span>YOUR OVERVIEW</span>

          <span className="dashboard-live-note">
            <span />
            YOUR SHOPPING ACTIVITY
          </span>
        </div>

        <div className="dashboard-stats">
          <div className="dashboard-stat">
            <div className="dashboard-stat-icon stat-icon-sage">
              <Heart size={20} />
            </div>

            <div className="dashboard-stat-info">
              <span className="dashboard-stat-label">Saved to wishlist</span>

              <strong>{wishlist.length}</strong>

              <button
                type="button"
                className="dashboard-stat-link"
                onClick={() => navigate("/list")}
              >
                View wishlist
                <ArrowRight size={12} />
              </button>
            </div>
          </div>

          <div className="dashboard-stat">
            <div className="dashboard-stat-icon stat-icon-sand">
              <Clock3 size={20} />
            </div>

            <div className="dashboard-stat-info">
              <span className="dashboard-stat-label">Considering later</span>

              <strong>{waitingCount}</strong>

              <button
                type="button"
                className="dashboard-stat-link"
                onClick={() => navigate("/evaluations")}
              >
                Review decisions
                <ArrowRight size={12} />
              </button>
            </div>
          </div>

          <div className="dashboard-stat">
            <div className="dashboard-stat-icon stat-icon-rose">
              <CheckCircle2 size={20} />
            </div>

            <div className="dashboard-stat-info">
              <span className="dashboard-stat-label">Purchase evaluations</span>

              <strong>{evaluations.length}</strong>

              <button
                type="button"
                className="dashboard-stat-link"
                onClick={() => navigate("/history")}
              >
                View history
                <ArrowRight size={12} />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* WISHLIST SHORTLIST */}
      <section className="dashboard-shortlist">
        <div className="dashboard-section-heading">
          <div>
            <span className="dashboard-overline">SAVED FOR LATER</span>

            <h2>
              Your <span>shortlist.</span>
            </h2>

            <p>Products on your mind, all in one place.</p>
          </div>

          {wishlist.length > 0 && (
            <button
              type="button"
              className="dashboard-secondary-action"
              onClick={() => navigate("/list")}
            >
              View all
              <ArrowRight size={15} />
            </button>
          )}
        </div>

        {savedProducts.length === 0 ? (
          <div className="dashboard-empty">
            <div className="dashboard-empty-icon">
              <Heart size={22} />
            </div>

            <div className="dashboard-empty-copy">
              <h3>Your shortlist starts here.</h3>

              <p>
                Save products you are interested in, then compare your options
                before deciding what is worth buying.
              </p>
            </div>

            <button
              type="button"
              className="button button-primary"
              onClick={() => navigate("/explore")}
            >
              Find something
              <ArrowRight size={15} />
            </button>
          </div>
        ) : (
          <>
            <div className="product-grid">
              {savedProducts.map((product) => (
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

            {/* COMPARISON SELECTION */}
            {selectedProducts.length > 0 && (
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
                    <Scale size={15} />
                  </button>
                </div>
              </div>
            )}

            {wishlist.length > 3 && (
              <button
                type="button"
                className="dashboard-view-more"
                onClick={() => navigate("/list")}
              >
                See all {wishlist.length} saved products
                <ArrowRight size={15} />
              </button>
            )}
          </>
        )}
      </section>
    </div>
  );
}