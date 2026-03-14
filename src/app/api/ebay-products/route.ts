import { NextRequest, NextResponse } from "next/server";
import type { EtsyProduct } from "@/app/api/etsy-products/route";

// ── OAuth token cache (server-side in-memory, resets on cold start) ──────────
let cachedToken: { value: string; expiresAt: number } | null = null;

async function getEbayToken(appId: string, certId: string): Promise<string> {
  if (cachedToken && Date.now() < cachedToken.expiresAt - 60_000) {
    return cachedToken.value;
  }

  const credentials = Buffer.from(`${appId}:${certId}`).toString("base64");
  const res = await fetch("https://api.ebay.com/identity/v1/oauth2/token", {
    method: "POST",
    headers: {
      Authorization: `Basic ${credentials}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: "grant_type=client_credentials&scope=https%3A%2F%2Fapi.ebay.com%2Foauth%2Fapi_scope",
  });

  if (!res.ok) {
    const body = await res.text().catch(() => "");
    throw new Error(`eBay token fetch failed (${res.status}): ${body.slice(0, 200)}`);
  }

  const data = await res.json();
  cachedToken = {
    value: data.access_token,
    expiresAt: Date.now() + data.expires_in * 1000,
  };
  return cachedToken.value;
}

// ── Query builder ─────────────────────────────────────────────────────────────
function buildQuery(theme: string, roomType: string): string {
  const room = (roomType || "dorm room").trim();
  const style = theme.trim();
  // Specific enough to get real decor items, not appliances
  return `${style} ${room} decor`;
}

// ── eBay Browse API item shape (partial) ─────────────────────────────────────
interface EbayItemSummary {
  itemId: string;
  title: string;
  price?: { value: string; currency: string };
  image?: { imageUrl: string };
  itemWebUrl: string;
  seller?: { username: string };
  categories?: { categoryId: string; categoryName: string }[];
  thumbnailImages?: { imageUrl: string }[];
}

// ── Normalize eBay item → EtsyProduct (shared UI shape) ──────────────────────
function normalize(item: EbayItemSummary): EtsyProduct | null {
  const imageUrl =
    item.image?.imageUrl ||
    item.thumbnailImages?.[0]?.imageUrl;

  // Skip items with no image or no price
  if (!imageUrl || !item.price) return null;

  return {
    id: item.itemId,
    title: item.title,
    price: parseFloat(item.price.value),
    currency: item.price.currency ?? "USD",
    image_url: imageUrl,
    product_url: item.itemWebUrl,
    shop_name: item.seller?.username ?? "eBay Seller",
    category: item.categories?.[0]?.categoryName ?? "Home Decor",
  };
}

// ── Route handler ─────────────────────────────────────────────────────────────
export async function GET(req: NextRequest) {
  const appId  = process.env.EBAY_APP_ID;
  const certId = process.env.EBAY_CERT_ID;

  if (!appId || !certId) {
    return NextResponse.json(
      { products: [], has_more: false, error: "no_key" },
      { status: 200 }
    );
  }

  const { searchParams } = new URL(req.url);
  const theme    = searchParams.get("theme")    ?? "room decor";
  const roomType = searchParams.get("roomType") ?? "";
  const maxPrice = searchParams.get("max_price");
  const page     = parseInt(searchParams.get("page") ?? "0", 10);
  const limit    = 20;
  const offset   = page * limit;

  try {
    const token = await getEbayToken(appId, certId);
    const query = buildQuery(theme, roomType);

    const params = new URLSearchParams({
      q: query,
      limit: String(limit),
      offset: String(offset),
      sort: "BEST_MATCH",
    });

    // Price filter: eBay filter syntax
    if (maxPrice) {
      params.set("filter", `price:[0..${maxPrice}],priceCurrency:USD,buyingOptions:{FIXED_PRICE}`);
    } else {
      params.set("filter", "buyingOptions:{FIXED_PRICE}");
    }

    const res = await fetch(
      `https://api.ebay.com/buy/browse/v1/item_summary/search?${params}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "X-EBAY-C-MARKETPLACE-ID": "EBAY_US",
          "Content-Type": "application/json",
        },
        next: { revalidate: 300 },
      }
    );

    if (!res.ok) {
      const body = await res.text().catch(() => "");
      console.error(`eBay Browse API ${res.status}: ${body.slice(0, 300)}`);
      return NextResponse.json(
        { products: [], has_more: false, error: "api_error" },
        { status: 200 }
      );
    }

    const data = await res.json();
    const items: EbayItemSummary[] = data.itemSummaries ?? [];
    const total: number = data.total ?? 0;

    const products = items
      .map(normalize)
      .filter((p): p is EtsyProduct => p !== null);

    console.log(`eBay: ${products.length} products for query="${query}" (total=${total})`);

    return NextResponse.json({
      products,
      has_more: offset + limit < total,
    });
  } catch (err) {
    console.error("eBay products error:", err);
    return NextResponse.json(
      { products: [], has_more: false, error: "fetch_error" },
      { status: 200 } // always 200 so client can handle gracefully
    );
  }
}
