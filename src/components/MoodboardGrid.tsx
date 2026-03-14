"use client";

import ProductCard from "./ProductCard";
import type { Product } from "@/types";

interface MoodboardGridProps {
  products: Product[];
  isLoading?: boolean;
}

export default function MoodboardGrid({ products, isLoading }: MoodboardGridProps) {
  if (isLoading) {
    return (
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 p-4">
        {Array.from({ length: 8 }).map((_, i) => (
          <div
            key={i}
            className="rounded-xl bg-warm-sand/30 animate-pulse aspect-square"
          />
        ))}
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[300px] text-warm-charcoal/60">
        <p className="text-lg font-display">No products yet</p>
        <p className="text-sm mt-2">Chat with the assistant to get decor recommendations</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 p-4 overflow-auto">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}
