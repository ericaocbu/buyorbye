
import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Search, SlidersHorizontal, X } from "lucide-react";
import { products } from "../data/products";
import ProductCard from "../components/products/ProductCard";

export default function ExplorePage() {
  const navigate = useNavigate();

  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("All");
  const [selected, setSelected] = useState([]);

  const categories = [
    "All",
    ...new Set(products.map((product) => product.category)),
  ];

  const filtered = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();

    return products.filter((product) => {
      const searchableText = [
        product.name,
        product.brand,
        product.retailer,
        product.category,
        product.description,
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();

      const matchesQuery = searchableText.includes(normalizedQuery);
      const matchesCategory =
        category === "All" || product.category === category;

      return matchesQuery && matchesCategory;
    });
  }, [query, category]);

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

  function openComparison() {
    if (selected.length < 2) {
      return;
    }

    navigate("/app/compare", {
      state: { selectedIds: selected },
    });
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
          <Search size={18} aria-hidden="true" />
          <input
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search products, brands, or stores..."
            aria-label="Search products"
          />
          {query && (
            <button
              type="button"
              className="icon-button"
              onClick={() => setQuery("")}
              aria-label="Clear search"
            >
              <X size={16} />
            </button>
          )}
        </label>

        <div className="category-filters" aria-label="Filter by category">
          <SlidersHorizontal size={17} aria-hidden="true" />

          {categories.map((item) => (
            <button
              key={item}
              type="button"
              className={`filter-chip ${
                category === item ? "filter-chip-active" : ""
              }`}
              aria-pressed={category === item}
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
          <p>
            {filtered.length} {filtered.length === 1 ? "product" : "products"}{" "}
            found
          </p>
        </div>

        <span className="demo-label">DEMO DATA</span>
      </div>

      {filtered.length > 0 ? (
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
          <Search size={28} aria-hidden="true" />
          <h3>No products found</h3>
          <p>Try a different search term or choose another category.</p>

          <button
            type="button"
            className="button button-secondary"
            onClick={() => {
              setQuery("");
              setCategory("All");
            }}
          >
            Clear filters
          </button>
        </div>
      )}

      {selected.length > 0 && (
        <div className="compare-bar">
          <div>
            <strong>
              {selected.length} of 3 products selected
            </strong>
            <p>
              {selected.length < 2
                ? "Select at least one more product to compare."
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
              disabled={selected.length < 2}
              onClick={openComparison}
            >
              Compare selected
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
