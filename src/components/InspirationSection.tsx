"use client";

import { useState, useCallback } from "react";
import Image from "next/image";
import type { InspirationPin } from "@/types";

interface InspirationSectionProps {
  query: string;
}

export default function InspirationSection({ query }: InspirationSectionProps) {
  const [pins, setPins] = useState<InspirationPin[]>([]);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);
  const [noKey, setNoKey] = useState(false);
  const [fetched, setFetched] = useState(false);

  const loadMore = useCallback(async (nextPage: number) => {
    setLoading(true);
    try {
      const res = await fetch(
        `/api/inspiration?query=${encodeURIComponent(query + " room decor aesthetic")}&page=${nextPage}`
      );
      const data = await res.json();
      if (data.error === "no_key") {
        setNoKey(true);
        return;
      }
      setPins((prev) => (nextPage === 1 ? data.photos : [...prev, ...data.photos]));
      setTotalPages(data.total_pages ?? 1);
      setPage(nextPage);
      setFetched(true);
    } finally {
      setLoading(false);
    }
  }, [query]);

  if (noKey) {
    return (
      <div className="px-4 pb-8 pt-2">
        <div className="rounded-xl border border-dashed border-warm-sand/80 p-6 text-center text-sm text-warm-charcoal/60">
          <p className="font-medium text-warm-charcoal/80 mb-1">Add an Unsplash key for Pinterest-style inspiration</p>
          <p>Add <code className="bg-warm-sand/50 px-1 rounded">UNSPLASH_ACCESS_KEY</code> to your <code className="bg-warm-sand/50 px-1 rounded">.env.local</code></p>
          <p className="mt-1">Get a free key at <span className="text-warm-terracotta">unsplash.com/developers</span></p>
        </div>
      </div>
    );
  }

  if (!fetched) {
    return (
      <div className="px-4 pb-8 pt-2">
        <div className="flex items-center gap-3 mb-4">
          <div className="flex-1 border-t border-warm-sand/60" />
          <span className="text-xs font-medium text-warm-charcoal/50 uppercase tracking-widest">Inspiration</span>
          <div className="flex-1 border-t border-warm-sand/60" />
        </div>
        <div className="flex justify-center">
          <button
            onClick={() => loadMore(1)}
            disabled={loading}
            className="px-5 py-2 rounded-xl bg-warm-terracotta/10 text-warm-terracotta font-medium text-sm hover:bg-warm-terracotta/20 transition-colors disabled:opacity-50"
          >
            {loading ? "Loading…" : `Browse ${query} inspiration ↓`}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="px-4 pb-8 pt-2">
      <div className="flex items-center gap-3 mb-4">
        <div className="flex-1 border-t border-warm-sand/60" />
        <span className="text-xs font-medium text-warm-charcoal/50 uppercase tracking-widest">Inspiration</span>
        <div className="flex-1 border-t border-warm-sand/60" />
      </div>

      <div className="columns-2 sm:columns-3 lg:columns-4 gap-3 space-y-3">
        {pins.map((pin) => (
          <a
            key={pin.id}
            href={pin.unsplash_link}
            target="_blank"
            rel="noopener noreferrer"
            className="block break-inside-avoid rounded-xl overflow-hidden relative group"
          >
            <Image
              src={pin.url}
              alt={pin.alt}
              width={400}
              height={400}
              className="w-full h-auto object-cover group-hover:brightness-90 transition-all duration-300"
              unoptimized
            />
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-300 flex items-end">
              <p className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 text-white text-xs px-2 py-1.5 truncate w-full bg-gradient-to-t from-black/60 to-transparent">
                {pin.alt}
              </p>
            </div>
          </a>
        ))}
      </div>

      {loading && (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 mt-3">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="rounded-xl bg-warm-sand/30 animate-pulse aspect-square" />
          ))}
        </div>
      )}

      {page < totalPages && !loading && (
        <div className="flex justify-center mt-5">
          <button
            onClick={() => loadMore(page + 1)}
            className="px-5 py-2 rounded-xl bg-warm-terracotta/10 text-warm-terracotta font-medium text-sm hover:bg-warm-terracotta/20 transition-colors"
          >
            Load more
          </button>
        </div>
      )}

      <p className="text-center text-xs text-warm-charcoal/40 mt-4">
        Photos from{" "}
        <a href="https://unsplash.com" target="_blank" rel="noopener noreferrer" className="underline">
          Unsplash
        </a>
      </p>
    </div>
  );
}
