import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";

const WishlistContext = createContext(null);
const STORAGE_KEY = "buyorbye-wishlist";

function readWishlist() {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
}

export function WishlistProvider({ children }) {
  const [wishlist, setWishlist] = useState(readWishlist);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(wishlist));
  }, [wishlist]);

  const toggleWishlist = useCallback((product) => {
    setWishlist((current) => {
      const exists = current.some((item) => item.id === product.id);

      return exists
        ? current.filter((item) => item.id !== product.id)
        : [...current, product];
    });
  }, []);

  const isSaved = useCallback(
    (productId) => wishlist.some((item) => item.id === productId),
    [wishlist]
  );

  const removeFromWishlist = useCallback((productId) => {
    setWishlist((current) =>
      current.filter((item) => item.id !== productId)
    );
  }, []);

  return (
    <WishlistContext.Provider
      value={{ wishlist, toggleWishlist, isSaved, removeFromWishlist }}
    >
      {children}
    </WishlistContext.Provider>
  );
}

export function useWishlist() {
  const context = useContext(WishlistContext);

  if (!context) {
    throw new Error("useWishlist must be used within WishlistProvider");
  }

  return context;
}