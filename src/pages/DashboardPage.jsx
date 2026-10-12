
import { useNavigate } from "react-router-dom";
import {
  ArrowRight,
  CheckCircle2,
  Clock3,
  Heart,
  Search,
  Sparkles,
} from "lucide-react";
import { useWishlist } from "../context/WishlistContext";
import ProductCard from "../components/products/ProductCard";

export default function DashboardPage() {
  const navigate = useNavigate();
  const { wishlist, toggleWishlist, isSaved } = useWishlist();

  // Connect these counts to real evaluation data in the next step.
  const waitCount = 0;
  const decisionsCount = 0;

  const savedProducts = wishlist.slice(0, 3);

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
          <button
            type="button"
            className="text-link"
            onClick={() => navigate("/app/list")}
          >
            View my list <ArrowRight size={15} />
          </button>
        </article>

        <article className="stat-card">
          <div className="stat-top">
            <span>Waiting on</span>
            <Clock3 size={18} />
          </div>
          <div className="stat-value">{waitCount}</div>
          <div className="stat-caption">
            Products you're holding off on
          </div>
          <button
            type="button"
            className="text-link"
            onClick={() => navigate("/app/evaluations")}
          >
            Review decisions <ArrowRight size={15} />
          </button>
        </article>

        <article className="stat-card stat-card-accent">
          <div className="stat-top">
            <span>Decisions made</span>
            <CheckCircle2 size={18} />
          </div>
          <div className="stat-value">{decisionsCount}</div>
          <div className="stat-caption">
            Purchase decisions you've recorded
          </div>
          <button
            type="button"
            className="text-link"
            onClick={() => navigate("/app/history")}
          >
            View history <ArrowRight size={15} />
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
                onSave={toggleWishlist}
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