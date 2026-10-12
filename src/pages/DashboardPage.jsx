import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowDownRight,
  ArrowRight,
  ArrowUpRight,
  Heart,
  Search,
  Sparkles,
  Wallet,
} from "lucide-react";
import { useWishlist } from "../context/WishlistContext";
import ProductCard from "../components/products/ProductCard";

export default function DashboardPage() {
  const navigate = useNavigate();
  const { wishlist, toggleWishlist, isSaved } = useWishlist();
  const [selected, setSelected] = useState([]);

  const waitCount = 0;
  const savedProducts = wishlist.slice(0, 3);

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

  const selectedProducts = savedProducts.filter((product) =>
    selected.includes(product.id)
  );

  function openComparison() {
    if (selectedProducts.length < 2) return;

    navigate("/app/compare", {
      state: { selectedProducts },
    });
  }

  return (
    <div className="dashboard-page">
      <section className="welcome-row">
        <div>
          <div className="eyebrow">
            <Sparkles size={14} />
            A FRESH PERSPECTIVE
          </div>
          <h2>
            Good things are worth <em>thinking about.</em>
          </h2>
          <p>
            Keep track of what catches your eye, compare your options,
            and decide what is truly worth it.
          </p>
        </div>

        <button
          className="button button-primary welcome-cta"
          onClick={() => navigate("/app/explore")}
        >
          Explore products <ArrowRight size={17} />
        </button>
      </section>

      <section className="stats-grid">
        <article className="stat-card">
          <div className="stat-top">
            <span>Saved items</span>
            <Heart size={18} />
          </div>
          <div className="stat-value">{wishlist.length}</div>
          <div className="stat-caption">Products on your radar</div>
        </article>

        <article className="stat-card">
          <div className="stat-top">
            <span>To reconsider</span>
            <ArrowDownRight size={18} />
          </div>
          <div className="stat-value">{waitCount}</div>
          <div className="stat-caption">
            Items you've decided to wait on
          </div>
        </article>

        <article className="stat-card stat-card-accent">
          <div className="stat-top">
            <span>Price comparisons</span>
            <Wallet size={18} />
          </div>
          <div className="stat-value">Explore</div>
          <div className="stat-caption">
            Look for a better fit or price
          </div>
          <button
            className="text-link"
            onClick={() => navigate("/app/compare")}
          >
            Compare products <ArrowUpRight size={15} />
          </button>
        </article>
      </section>

      <section className="section-block">
        <div className="section-heading">
          <div>
            <span className="eyebrow">YOUR SHORTLIST</span>
            <h2>Things on your mind</h2>
            <p>A little collection of things you're considering.</p>
          </div>

          <button
            className="button button-secondary"
            onClick={() => navigate("/app/list")}
          >
            View my list <ArrowRight size={16} />
          </button>
        </div>

        {savedProducts.length > 0 ? (
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
        ) : (
          <div className="empty-state">
            <Heart size={28} aria-hidden="true" />
            <h3>Your shortlist starts here</h3>
            <p>
              Save products that catch your eye, and they'll show up here
              so you can revisit them before deciding.
            </p>
            <button
              className="button button-primary"
              onClick={() => navigate("/app/explore")}
            >
              Explore products <ArrowRight size={16} />
            </button>
          </div>
        )}

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
      </section>

      <section className="discover-banner">
        <div className="discover-icon">
          <Search size={22} />
        </div>
        <div className="discover-copy">
          <h3>Before you buy, look around.</h3>
          <p>
            Find alternatives, compare prices, and see which option
            makes the most sense for you.
          </p>
        </div>
        <button
          className="button button-dark"
          onClick={() => navigate("/app/explore")}
        >
          Find alternatives <ArrowRight size={16} />
        </button>
      </section>
    </div>
  );
}