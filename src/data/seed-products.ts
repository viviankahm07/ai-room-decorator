import type { EtsyProduct } from "@/app/api/etsy-products/route";
import productsData from "@/data/products.json";

interface JsonProduct {
  id: string;
  name: string;
  category: string;
  price: number;
  image_url: string;
  style_tags: string[];
  source: string;
  product_url: string;
}

const products = productsData as JsonProduct[];

function toEtsy(p: JsonProduct): EtsyProduct {
  return {
    id: p.id,
    title: p.name,
    price: p.price,
    currency: "USD",
    image_url: p.image_url,
    product_url:
      p.product_url === "#"
        ? `https://www.etsy.com/search?q=${encodeURIComponent(p.name)}`
        : p.product_url,
    shop_name: p.source,
    category: p.category,
  };
}

export function getSeedProducts(theme: string): EtsyProduct[] {
  const lowerTheme = theme.toLowerCase().trim();

  const filtered = products.filter((p) =>
    p.style_tags.some((tag) => tag.toLowerCase() === lowerTheme)
  );

  return (filtered.length >= 3 ? filtered : products).map(toEtsy);
}
