import { NextRequest, NextResponse } from "next/server";
import { getSeedProducts } from "@/data/seed-products";

export interface EtsyProduct {
  id: string;
  title: string;
  price: number;
  currency: string;
  image_url: string;
  product_url: string;
  shop_name: string;
  category: string;
}

// Build focused, short queries that work well with Etsy's keyword search
function buildQueries(theme: string, roomType: string): string[] {
  const b = theme.trim();
  const room = (roomType ?? "").toLowerCase() || "bedroom";

  return [
    `${b} wall art`,
    `${b} throw pillow`,
    `${b} ${room} decor`,
    `${b} rug`,
    `${b} lamp`,
    `${b} mirror`,
  ];
}

async function fetchEtsy(
  key: string,
  query: string,
  limit: number,
  maxPrice?: string,
  offset = 0
): Promise<EtsyProduct[]> {
  const params = new URLSearchParams({
    keywords: query,
    limit: String(limit),
    offset: String(offset),
    sort_on: "score",
    includes: "Images",
  });
  if (maxPrice) params.set("max_price", maxPrice);

  const url = `https://openapi.etsy.com/v3/application/listings/active?${params}`;
  try {
    const res = await fetch(url, {
      headers: { "x-api-key": key },
      next: { revalidate: 300 },
    });
    if (!res.ok) {
      const body = await res.text().catch(() => "(unreadable)");
      console.error(`Etsy ${res.status} for query="${query}": ${body.slice(0, 200)}`);
      if (res.status === 401 || res.status === 403 || body.includes("API key not found")) {
        throw new Error("invalid_key");
      }
      return [];
    }
    const data = await res.json();
    const results = data.results ?? [];
    if (results.length === 0) {
      console.warn(`Etsy 0 results for query="${query}"`);
    }
    return results
      .filter((l: { images?: { url_570xN?: string }[] }) => l.images?.[0]?.url_570xN)
      .map((l: {
        listing_id: number;
        title: string;
        price: { amount: number; divisor: number; currency_code: string };
        url: string;
        images: { url_570xN: string }[];
        shop_name?: string;
        taxonomy_path?: string[];
      }) => ({
        id: String(l.listing_id),
        title: l.title,
        price: Math.round((l.price.amount / l.price.divisor) * 100) / 100,
        currency: l.price.currency_code,
        image_url: l.images[0].url_570xN,
        product_url: l.url,
        shop_name: l.shop_name ?? "Etsy Shop",
        category: l.taxonomy_path?.[l.taxonomy_path.length - 1] ?? "Decor",
      }));
  } catch (err) {
    if (err instanceof Error && err.message === "invalid_key") throw err;
    console.error(`Etsy fetch error for query="${query}":`, err);
    return [];
  }
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const theme    = searchParams.get("theme") ?? searchParams.get("query") ?? "room decor";
  const roomType = searchParams.get("roomType") ?? "";
  const maxPrice = searchParams.get("max_price") ?? undefined;
  const loadMore = searchParams.get("load_more") === "true";
  const page     = parseInt(searchParams.get("page") ?? "0", 10);

  const key = process.env.ETSY_API_KEY;
  if (!key) {
    return NextResponse.json({ products: [], has_more: false, error: "no_key" });
  }

  try {
    const queries = buildQueries(theme, roomType);
    const perQuery = loadMore ? 6 : 4;
    const offsetVal = loadMore ? page * perQuery : 0;

    // Run queries in parallel (2 at a time to avoid rate limiting)
    const results = await Promise.all(
      queries.map((q) => fetchEtsy(key, q, perQuery, maxPrice, offsetVal))
    );

    const merged = dedup(results.flat());
    console.log(`Etsy: ${merged.length} products for theme="${theme}" room="${roomType}"`);
    return NextResponse.json({ products: merged, has_more: page < 4 });
  } catch (error) {
    if (error instanceof Error && error.message === "invalid_key") {
      console.warn("Etsy API key pending — serving seed products.");
      const seed = getSeedProducts(theme);
      const FIRST = 15, MORE = 8;
      const paged = loadMore
        ? seed.slice(FIRST + (page - 1) * MORE, FIRST + page * MORE)
        : seed.slice(0, FIRST);
      const has_more = seed.length > (loadMore ? FIRST + page * MORE : FIRST);
      return NextResponse.json({ products: paged, has_more });
    }
    console.error("Etsy multi-search error:", error);
    const seed = getSeedProducts(theme);
    return NextResponse.json({ products: seed, has_more: false });
  }
}

function dedup(products: EtsyProduct[]): EtsyProduct[] {
  const seen = new Set<string>();
  return products.filter((p) => {
    if (seen.has(p.id)) return false;
    seen.add(p.id);
    return true;
  });
}
