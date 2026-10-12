
export default async function handler(req, res) {
  res.setHeader("Cache-Control", "s-maxage=60, stale-while-revalidate=300");

  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed." });
  }

  const query = String(req.query.q || "").trim();

  if (query.length < 2 || query.length > 100) {
    return res.status(400).json({
      error: "Search must be between 2 and 100 characters.",
    });
  }

  if (!process.env.SERPAPI_KEY) {
    return res.status(500).json({
      error: "Product search is not configured on the server.",
    });
  }

  try {
    const params = new URLSearchParams({
      engine: "google_shopping",
      q: query,
      api_key: process.env.SERPAPI_KEY,
      gl: "us",
      hl: "en",
    });

    const response = await fetch(
      `https://serpapi.com/search.json?${params.toString()}`
    );

    const data = await response.json();

    if (!response.ok || data.error) {
      console.error("Shopping provider request failed:", data.error);

      return res.status(502).json({
        error: "Product search is temporarily unavailable.",
      });
    }

    const products = (data.shopping_results || []).map((item) => ({
      id: item.product_id || item.position?.toString(),
      name: item.title || "Unnamed product",
      brand: item.brand || "",
      price: typeof item.extracted_price === "number"
        ? item.extracted_price
        : null,
      currency: "USD",
      retailer: item.source || "",
      imageUrl: item.thumbnail || "",
      productUrl: item.product_link || item.link || "",
      description: item.snippet || "",
      category: item.category || "",
      source: "google_shopping",
    }));

    return res.status(200).json({ products });
  } catch (error) {
    console.error("Product search failed:", error);

    return res.status(500).json({
      error: "Something went wrong while searching for products.",
    });
  }
}
