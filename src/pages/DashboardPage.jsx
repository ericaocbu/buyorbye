
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
import { products } from "../data/products";
import ProductCard from "../components/products/ProductCard";

export default function DashboardPage() {
  const navigate = useNavigate();
  const savedProducts = products.slice(0, 3);
  const waitCount = products.filter((p) => p.status === "wait").length;

  return (
    <div className="dashboard-page">
      <section className="welcome-row">
        <div>
          <div className="eyebrow">
            <Sparkles size={14} />
            A FRESH PERSPECTIVE
          </div>
          <h2>Good things are worth <em>thinking about.</em></h2>
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
          <div className="stat-value">{products.length}</div>
          <div className="stat-caption">Products on your radar</div>
        </article>

        <article className="stat-card">
          <div className="stat-top">
            <span>To reconsider</span>
            <ArrowDownRight size={18} />
          </div>
          <div className="stat-value">{waitCount}</div>
          <div className="stat-caption">Items you've decided to wait on</div>
        </article>

        <article className="stat-card stat-card-accent">
          <div className="stat-top">
            <span>Price comparisons</span>
            <Wallet size={18} />
          </div>
          <div className="stat-value">Explore</div>
          <div className="stat-caption">Look for a better fit or price</div>
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

        <div className="product-grid">
          {savedProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
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
