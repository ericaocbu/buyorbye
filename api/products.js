function cleanText(value) {
  return typeof value === "string" ? value.trim() : "";
}

function inferBrand(title) {
  const text = cleanText(title);

  if (!text) return "";

  // Remove common condition labels at the beginning of a listing.
  const cleaned = text
    .replace(
      /^(new|used|pre-owned|refurbished|renewed|open box)\s*[-:|]?\s*/i,
      ""
    )
    .trim();

  const firstWord = cleaned.split(/\s+/)[0] || "";

  const genericWords = new Set([
    "wireless",
    "bluetooth",
    "noise",
    "cancelling",
    "cancellation",
    "over-ear",
    "on-ear",
    "in-ear",
    "headphones",
    "earbuds",
    "headset",
    "laptop",
    "computer",
    "desktop",
    "monitor",
    "tablet",
    "phone",
    "smartphone",
    "television",
    "tv",
    "gaming",
    "compatible",
    "replacement",
    "accessory",
    "accessories",
    "for",
    "with",
    "the",
    "a",
    "an",
  ]);

  if (!firstWord || genericWords.has(firstWord.toLowerCase())) {
    return "";
  }

  return firstWord.replace(
    /^[^a-z0-9]+|[^a-z0-9.&'-]+$/gi,
    ""
  );
}

function inferCategory(text) {
  const value = cleanText(text).toLowerCase();

  const categoryRules = [
    [/\b(headphones?|earbuds?|headsets?)\b/, "Headphones"],
    [/\b(laptops?|notebooks?|desktops?|computers?|pcs?)\b/, "Computers"],
    [/\b(phones?|smartphones?|iphones?)\b/, "Phones"],
    [/\b(tablets?|ipads?)\b/, "Tablets"],
    [/\b(televisions?|tvs?)\b/, "Televisions"],
    [/\b(game consoles?|gaming|controllers?)\b/, "Gaming"],
    [
      /\b(vacuums?|blenders?|air fryers?|coffee makers?)\b/,
      "Home appliances",
    ],
    [
      /\b(shoes?|sneakers?|shirts?|jackets?|clothing|dresses?)\b/,
      "Clothing",
    ],
  ];

  for (const [pattern, category] of categoryRules) {
    if (pattern.test(value)) return category;
  }

  return "";
}

function getPrice(value) {
  if (value === null || value === undefined || value === "") {
    return null;
  }

  const number = Number(value);
  return Number.isFinite(number) ? number : null;
}

function getReviewCount(item) {
  for (const value of [
    item.reviews_count,
    item.review_count,
    item.reviews,
  ]) {
    const number = getPrice(value);

    if (number !== null && number >= 0) {
      return number;
    }
  }

  return null;
}

export default async function handler(req, res) {
  res.setHeader(
    "Cache-Control",
    "s-maxage=300, stale-while-revalidate=600"
  );

  if (req.method !== "GET") {
    res.setHeader("Allow", "GET");
    return res.status(405).json({
      error: "Method not allowed.",
    });
  }

  const query = cleanText(req.query?.q);

  if (query.length < 2 || query.length > 100) {
    return res.status(400).json({
      error: "Search query must be between 2 and 100 characters.",
    });
  }

  const apiKey = process.env.SERPAPI_KEY;

  if (!apiKey) {
    return res.status(500).json({
      error: "Product search is not configured on the server.",
    });
  }

  try {
    const params = new URLSearchParams({
      engine: "google_shopping",
      q: query,
      api_key: apiKey,
      hl: "en",
      gl: "us",
    });

    const response = await fetch(
      `https://serpapi.com/search.json?${params.toString()}`
    );

    if (!response.ok) {
      console.error("SerpApi request failed:", response.status);

      return res.status(502).json({
        error: "Product search is temporarily unavailable. Please try again.",
      });
    }

    const data = await response.json();

    if (data.error) {
      console.error("SerpApi error:", data.error);

      return res.status(502).json({
        error: "The product provider could not complete this search.",
      });
    }

    const shoppingResults = Array.isArray(data.shopping_results)
      ? data.shopping_results
      : [];

    const products = shoppingResults.map((item) => {
      const name = cleanText(item.title) || "Unnamed product";

      const providerBrand = cleanText(item.brand);
      const providerCategory = cleanText(item.category);

      const inferredBrand = providerBrand
        ? ""
        : inferBrand(name);

      const inferredCategory = providerCategory
        ? ""
        : inferCategory(`${query} ${name}`);

      const brand = providerBrand || inferredBrand;
      const category = providerCategory || inferredCategory;

      const productUrl = cleanText(
        item.product_link || item.link
      );

      const retailer = cleanText(item.source);

      const id =
        item.product_id ||
        productUrl ||
        `${name}|${retailer}`;

      return {
        id: String(id),
        name,
        brand,
        brandInferred: !providerBrand && Boolean(inferredBrand),
        price: getPrice(item.extracted_price),
        originalPrice: getPrice(item.extracted_old_price),
        currency: "USD",
        retailer,
        imageUrl: cleanText(item.thumbnail),
        productUrl,
        description: cleanText(item.snippet),
        category,
        categoryInferred:
          !providerCategory && Boolean(inferredCategory),
        rating: getPrice(item.rating),
        reviewCount: getReviewCount(item),
        delivery: cleanText(item.delivery),
        condition: cleanText(item.second_hand_condition),
        source: "google_shopping",
      };
    });

    return res.status(200).json({ products });
  } catch (error) {
    console.error("Product search error:", error);

    return res.status(500).json({
      error: "Something went wrong while searching for products.",
    });
  }
}