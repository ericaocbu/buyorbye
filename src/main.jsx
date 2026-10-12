import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import { WishlistProvider } from "./context/WishlistContext";

import "./styles/global.css";
import "./styles/layout.css";
import "./styles/dashboard.css";
import "./styles/products.css";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <BrowserRouter>
      <WishlistProvider>
        <App />
      </WishlistProvider>
    </BrowserRouter>
  </StrictMode>
);