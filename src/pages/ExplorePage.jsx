
import { useState } from "react";
import { Search, SlidersHorizontal } from "lucide-react";
import { products } from "../data/products";
import ProductCard from "../components/products/ProductCard";

export default function ExplorePage() {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("All");
  const [selected, setSelected] = useState([]);

  const categories = ["All", ...new Set(products.map((p) => p.category))];

  const filtered = products.filter((p) => {
    const matchesQuery = `${p.name} ${p.brand} ${p.retailer}`
      .toLowerCase()
      .includes(query.toLowerCase());
    const matchesCategory = category === "All" || p.category === category;
    return matchesQuery && matchesCategory;
  });

  function toggleCompare(product) {
    setSelected((current) =>
      current.includes(product.id)
        ? current.filter((id) => id !== product.id)
        : current.length < 4
          ? [...current, product.id]
          : current
    );
  }

  return (
    <div className="content-page">
      <div className="page-intro">
        <span className="eyebrow">THE DISCOVERY SPACE</span>
        <h2>Find something worth it.</h2>
        <p>
          Explore your options before you commit. A better choice
          might be just around the corner.
        </p>
      </div>

      <div className="explore-toolbar">
        <label className="search-field">
          <Search size={18} />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search products, brands, or stores..."
          />
        </label>
        <div className="category-filters">
          <SlidersHorizontal size={17} />
          {categories.map((item) => (
            <button
              key={item}
              className={`filter-chip ${category === item ? "filter-chip-active" : ""}`}
              onClick={() => setCategory(item)}
            >
              {item}
            </button>
          ))}
        </div>
      </div>

      <div className="section-heading compact-heading">
        <div>
          <h2>Products to explore</h2>
          <p>{filtered.length} sample products</p>
        </div>
        <span className="demo-label">DEMO DATA</span>
      </div>

      {filtered.length ? (
        <div className="product-grid">
          {filtered.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              selected={selected.includes(product.id)}
              onCompare={toggleCompare}
            />
          ))}
        </div>
      ) : (
        <div className="empty-state">
          <Search size={28} />
          <h3>No products found</h3>
          <p>Try a different search or category.</p>
        </div>
      )}

      {selected.length > 0 && (
        <div className="compare-bar">
          <span>{selected.length} product(s) selected</span>
          <button
            className="button button-primary"
            onClick={() =>
              window.dispatchEvent(
                new CustomEvent("buyorbye:compare", { detail: selected })
              )
            }
          >
            Compare selected
          </button>
        </div>
      )}
    </div>
  );
}
