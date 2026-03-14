"use client";

import Image from "next/image";
import type { Product } from "@/types";

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  return (
    <a
      href={product.product_url}
      target="_blank"
      rel="noopener noreferrer"
      className="group block rounded-xl overflow-hidden bg-white border border-warm-sand/60 shadow-sm hover:shadow-lg hover:border-warm-terracotta/40 transition-all duration-300"
    >
      <div className="relative aspect-square bg-warm-cream overflow-hidden">
        <Image
          src={product.image_url}
          alt={product.name}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-300"
          sizes="(max-width: 768px) 50vw, 25vw"
          unoptimized
        />
      </div>
      <div className="p-3">
        <h3 className="font-sans font-medium text-warm-charcoal text-sm truncate">
          {product.name}
        </h3>
        <p className="text-warm-terracotta font-semibold text-base mt-0.5">
          ${product.price}
        </p>
        <div className="flex flex-wrap gap-1 mt-2">
          <span className="text-xs px-2 py-0.5 rounded-full bg-warm-sand/80 text-warm-charcoal/80">
            {product.category}
          </span>
          {product.style_tags.slice(0, 2).map((tag) => (
            <span
              key={tag}
              className="text-xs px-2 py-0.5 rounded-full bg-warm-terracotta/20 text-warm-charcoal"
            >
              {tag}
            </span>
          ))}
        </div>
      </div>
    </a>
  );
}
