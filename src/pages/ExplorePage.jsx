import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Search, SlidersHorizontal, X } from "lucide-react";
import ProductCard from "../components/products/ProductCard";
import { useWishlist } from "../context/WishlistContext";

export default function ExplorePage() {
  const navigate = useNavigate();

  const { wishlist, toggleWishlist, isSaved } = useWishlist();

  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("All");
  const [products, setProducts] = useState([]);
  const [selected, setSelected] = useState([]);
  const [searchRequest, setSearchRequest] = useState({
    query: "",
    id: 0,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!searchRequest.id) return;

    const controller = new AbortController();

    async function fetchProducts() {
      setLoading(true);
      setError("");
      setProducts([]);
      setCategory("All");

      try {
        const response = await fetch(
          `/api/products?q=${encodeURIComponent(searchRequest.query)}`,
          { signal: controller.signal },
        );

        const data = await response.json();

        if (!response.ok) {
          throw new Error(
            data.error || "Unable to search for products right now.",
          );
        }

        const fetchedProducts = Array.isArray(data.products)
          ? data.products
          : [];

        setProducts(
          fetchedProducts.map((product) => ({
            ...product,
            brand: product.brand?.trim() || "",
            category: product.category?.trim() || "",
          })),
        );
      } catch (err) {
        if (err.name !== "AbortError") {
          setError(err.message || "Something went wrong. Please try again.");
        }
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    }

    fetchProducts();

    return () => controller.abort();
  }, [searchRequest]);

  const categories = useMemo(() => {
    const availableCategories = [
      ...new Set(
        products.map((product) => product.category?.trim()).filter(Boolean),
      ),
    ];

    return ["All", ...availableCategories];
  }, [products]);

  const filtered = useMemo(() => {
    if (category === "All") return products;

    return products.filter((product) => product.category?.trim() === category);
  }, [products, category]);

  function handleSearch(event) {
    event.preventDefault();

    const trimmedQuery = query.trim();

    if (trimmedQuery.length < 2) {
      setError("Enter at least 2 characters to search.");
      return;
    }

    setSelected([]);
    setError("");
    setProducts([]);

    setSearchRequest((current) => ({
      query: trimmedQuery,
      id: current.id + 1,
    }));
  }

  function retrySearch() {
    setSearchRequest((current) => ({
      ...current,
      id: current.id + 1,
    }));
  }

  function clearSearch() {
    setQuery("");
    setCategory("All");
    setProducts([]);
    setSelected([]);
    setError("");
    setSearchRequest({ query: "", id: 0 });
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

  function openComparison() {
    if (selected.length < 2) return;

    const selectedProducts = products.filter((product) =>
      selected.includes(product.id),
    );

    navigate("/compare", {
      state: { selectedProducts },
    });
  }

  const hasSearched = searchRequest.id > 0;

  return (
    <div className="content-page">
      <div className="page-intro">
        <span className="eyebrow">THE DISCOVERY SPACE</span>
        <h2>Find something worth it.</h2>
        <p>
          Explore your options before you commit. A better choice might be just
          around the corner.
        </p>
      </div>

      <div className="explore-toolbar">
        <form className="search-field" onSubmit={handleSearch}>
          <Search size={18} aria-hidden="true" />

          <input
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search products, brands, or stores..."
            aria-label="Search products"
            minLength={2}
          />

          {query && (
            <button
              type="button"
              className="icon-button"
              onClick={() => setQuery("")}
              aria-label="Clear search input"
            >
              <X size={16} />
            </button>
          )}

          <button
            type="submit"
            className="button button-primary"
            disabled={loading || query.trim().length < 2}
          >
            Search
          </button>
        </form>

        {categories.length > 1 && (
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
        )}
      </div>

      <div className="section-heading compact-heading">
        <div>
          <h2>
            {hasSearched
              ? `Results for "${searchRequest.query}"`
              : "Products to explore"}
          </h2>
          <p>
            {loading
              ? "Searching shopping listings..."
              : `${filtered.length} ${
                  filtered.length === 1 ? "product" : "products"
                } found`}
          </p>
        </div>
      </div>

      {loading ? (
        <div className="empty-state" role="status" aria-live="polite">
          <Search size={28} aria-hidden="true" />
          <h3>Finding your options...</h3>
          <p>We're searching shopping listings for you.</p>
        </div>
      ) : error ? (
        <div className="empty-state" role="alert">
          <h3>We couldn't complete your search</h3>
          <p>{error}</p>

          {hasSearched && (
            <button
              type="button"
              className="button button-secondary"
              onClick={retrySearch}
            >
              Try again
            </button>
          )}
        </div>
      ) : filtered.length > 0 ? (
        <div className="product-grid">
          {filtered.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              saved={isSaved(product.id)}
              onSave={toggleWishlist}
              selected={selected.includes(product.id)}
              onCompare={toggleCompare}
            />
          ))}
        </div>
      ) : (
        <div className="empty-state">
          <Search size={28} aria-hidden="true" />
          <h3>
            {hasSearched ? "No products found" : "What are you looking for?"}
          </h3>
          <p>
            {hasSearched
              ? "Try another search term to explore more options."
              : "Search for an item, brand, or store to see real shopping results."}
          </p>

          {hasSearched && (
            <button
              type="button"
              className="button button-secondary"
              onClick={clearSearch}
            >
              Start a new search
            </button>
          )}
        </div>
      )}

      {selected.length > 0 && (
        <div className="compare-bar">
          <div>
            <strong>{selected.length} of 3 products selected</strong>
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