"use client";

import { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import type { EtsyProduct } from "@/app/api/etsy-products/route";
import type { RoomInfo } from "@/types";

// Accepts the exact same props as EtsyProductsSection so they're interchangeable
interface EbayProductsSectionProps {
  roomInfo: RoomInfo;
  label?: string;
  onProductsChange?: (products: EtsyProduct[]) => void;
}

export default function EbayProductsSection({
  roomInfo,
  label = "Shop These Looks",
  onProductsChange,
}: EbayProductsSectionProps) {
  const [products, setProducts] = useState<EtsyProduct[]>([]);
  const [hasMore, setHasMore] = useState(false);
  const [loading, setLoading] = useState(false);
  const [loadMorePage, setLoadMorePage] = useState(1);
  const [error, setError] = useState<string | null>(null);

  const perItemMax = roomInfo.maxBudget ? Math.round(roomInfo.maxBudget / 3) : undefined;
  const theme    = roomInfo.theme ?? "room decor";
  const roomType = roomInfo.roomType ?? "";

  const fetchProducts = useCallback(
    async (page: number, replace: boolean) => {
      setLoading(true);
      setError(null);
      try {
        const params = new URLSearchParams({ theme, roomType, page: String(page) });
        if (perItemMax) params.set("max_price", String(perItemMax));

        const res = await fetch(`/api/ebay-products?${params}`);
        const data = await res.json();

        if (data.error === "no_key") {
          setError("no_key");
          return;
        }
        if (data.error) {
          setError("api_error");
          return;
        }

        const next = replace
          ? (data.products ?? [])
          : [...products, ...(data.products ?? [])];
        setProducts(next);
        setHasMore(data.has_more ?? false);
        onProductsChange?.(next);
      } catch {
        setError("api_error");
      } finally {
        setLoading(false);
      }
    },
    [theme, roomType, perItemMax] // eslint-disable-line react-hooks/exhaustive-deps
  );

  useEffect(() => {
    setProducts([]);
    setHasMore(false);
    setLoadMorePage(1);
    setError(null);
    fetchProducts(0, true);
  }, [fetchProducts]);

  // ── Error states ────────────────────────────────────────────────────────────
  if (error === "no_key") {
    return (
      <div className="px-4 pb-6">
        <SectionDivider label={label} source="ebay" />
        <div className="rounded-xl border border-warm-sand/60 bg-warm-cream/40 p-6 text-center">
          <p className="text-2xl mb-2">🔑</p>
          <p className="font-medium text-warm-charcoal text-sm">eBay API not configured</p>
          <p className="text-xs text-warm-charcoal/50 mt-1 max-w-xs mx-auto">
            Add <code className="bg-warm-sand/60 px-1 rounded">EBAY_APP_ID</code> and{" "}
            <code className="bg-warm-sand/60 px-1 rounded">EBAY_CERT_ID</code> to your{" "}
            <code className="bg-warm-sand/60 px-1 rounded">.env.local</code> to enable live eBay products.
          </p>
          <p className="text-xs text-warm-charcoal/40 mt-3">
            Switch to <strong>Moodboard 1</strong> to browse curated products in the meantime.
          </p>
        </div>
      </div>
    );
  }

  if (error === "api_error" && products.length === 0) {
    return (
      <div className="px-4 pb-6">
        <SectionDivider label={label} source="ebay" />
        <div className="rounded-xl border border-warm-sand/60 bg-warm-cream/40 p-6 text-center">
          <p className="text-2xl mb-2">📡</p>
          <p className="font-medium text-warm-charcoal text-sm">
            Live product search is temporarily unavailable.
          </p>
          <p className="text-xs text-warm-charcoal/50 mt-1">
            Please try <strong>Moodboard 1</strong> for curated product suggestions.
          </p>
        </div>
      </div>
    );
  }

  // ── Loading skeleton ────────────────────────────────────────────────────────
  if (loading && products.length === 0) {
    return (
      <div className="px-4 pb-6">
        <SectionDivider label={label} source="ebay" />
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {Array.from({ length: 12 }).map((_, i) => (
            <div key={i} className="rounded-xl bg-warm-sand/30 animate-pulse aspect-square" />
          ))}
        </div>
      </div>
    );
  }

  // ── Empty ───────────────────────────────────────────────────────────────────
  if (products.length === 0 && !loading) {
    return (
      <div className="px-4 pb-6">
        <SectionDivider label={label} source="ebay" />
        <div className="text-center text-sm text-warm-charcoal/50 py-8">
          <p>No products found — try refining your description in the chat.</p>
        </div>
      </div>
    );
  }

  // ── Product grid ────────────────────────────────────────────────────────────
  return (
    <div className="px-4 pb-8">
      <SectionDivider label={label} source="ebay" />
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
        {products.map((product) => (
          <a
            key={product.id}
            href={product.product_url}
            target="_blank"
            rel="noopener noreferrer"
            className="group block rounded-xl overflow-hidden bg-white border border-warm-sand/60 shadow-sm hover:shadow-lg hover:border-warm-charcoal/30 transition-all duration-300"
          >
            <div className="relative aspect-square bg-warm-cream overflow-hidden">
              <Image
                src={product.image_url}
                alt={product.title}
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-300"
                sizes="(max-width: 768px) 50vw, 25vw"
                unoptimized
              />
              {/* eBay source badge */}
              <span className="absolute top-2 right-2 text-[9px] font-bold px-1.5 py-0.5 rounded bg-[#e43137] text-white opacity-90">
                eBay
              </span>
            </div>
            <div className="p-3">
              <h3 className="font-sans font-medium text-warm-charcoal text-sm line-clamp-2 leading-snug">
                {product.title}
              </h3>
              <p className="text-warm-terracotta font-semibold text-base mt-1">
                {product.currency === "USD" ? "$" : product.currency}
                {product.price.toFixed(2)}
              </p>
              <p className="text-xs text-warm-charcoal/50 mt-0.5 truncate">{product.shop_name}</p>
              <span className="inline-block mt-2 text-xs px-2 py-0.5 rounded-full bg-warm-sand/80 text-warm-charcoal/80 truncate max-w-full">
                {product.category}
              </span>
            </div>
          </a>
        ))}
      </div>

      {loading && (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 mt-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="rounded-xl bg-warm-sand/30 animate-pulse aspect-square" />
          ))}
        </div>
      )}

      {hasMore && !loading && (
        <div className="flex justify-center mt-5">
          <button
            onClick={() => {
              fetchProducts(loadMorePage, false);
              setLoadMorePage((p) => p + 1);
            }}
            className="px-5 py-2 rounded-xl bg-warm-charcoal/10 text-warm-charcoal font-medium text-sm hover:bg-warm-charcoal/20 transition-colors"
          >
            Load more
          </button>
        </div>
      )}

      <p className="text-center text-xs text-warm-charcoal/40 mt-4">
        Live products from{" "}
        <a
          href="https://www.ebay.com"
          target="_blank"
          rel="noopener noreferrer"
          className="underline"
        >
          eBay
        </a>
      </p>
    </div>
  );
}

function SectionDivider({ label, source }: { label: string; source: "etsy" | "ebay" }) {
  return (
    <div className="flex items-center gap-3 mb-4">
      <div className="flex-1 border-t border-warm-sand/60" />
      <span className="text-xs font-medium text-warm-charcoal/50 uppercase tracking-widest whitespace-nowrap">
        {label}
      </span>
      {source === "ebay" && (
        <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-[#e43137] text-white">
          LIVE
        </span>
      )}
      <div className="flex-1 border-t border-warm-sand/60" />
    </div>
  );
}
