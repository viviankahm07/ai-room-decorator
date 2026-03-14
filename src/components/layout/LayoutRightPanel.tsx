"use client";

import Image from "next/image";
import type { LayoutItem } from "@/types";
import FurnitureShape from "./FurnitureShape";

interface LayoutRightPanelProps {
  item: LayoutItem | null;
  onRotate: (id: string) => void;
  onDelete: (id: string) => void;
  onDeselect: () => void;
}

export default function LayoutRightPanel({
  item,
  onRotate,
  onDelete,
  onDeselect,
}: LayoutRightPanelProps) {
  if (!item) {
    return (
      <aside className="w-52 flex-shrink-0 flex flex-col border-l border-warm-sand/40 bg-white p-4">
        <h3 className="text-xs font-semibold text-warm-charcoal uppercase tracking-widest mb-4">
          Item Details
        </h3>
        <div className="flex-1 flex flex-col items-center justify-center text-center gap-2">
          <div className="w-16 h-16 rounded-xl bg-warm-cream/60 flex items-center justify-center">
            <span className="text-2xl opacity-30">📐</span>
          </div>
          <p className="text-xs text-warm-charcoal/40 leading-relaxed max-w-[130px]">
            Click an item on the canvas to select and edit it
          </p>
        </div>
      </aside>
    );
  }

  const rot = item.rotation % 180;
  const displayW = rot === 0 ? item.width : item.depth;
  const displayD = rot === 0 ? item.depth : item.width;

  return (
    <aside className="w-52 flex-shrink-0 flex flex-col border-l border-warm-sand/40 bg-white overflow-y-auto">
      <div className="p-4 border-b border-warm-sand/40 flex items-center justify-between">
        <h3 className="text-xs font-semibold text-warm-charcoal uppercase tracking-widest">
          Selected
        </h3>
        <button
          onClick={onDeselect}
          className="text-warm-charcoal/40 hover:text-warm-charcoal text-base leading-none"
        >
          ✕
        </button>
      </div>

      {/* Shape preview */}
      <div className="p-4 flex justify-center">
        <div className="w-24 h-24 rounded-xl bg-warm-cream/60 flex items-center justify-center p-3 border border-warm-sand/40">
          <FurnitureShape type={item.shapeType} selected />
        </div>
      </div>

      {/* Name & price */}
      <div className="px-4 pb-3 border-b border-warm-sand/40">
        <p className="text-sm font-medium text-warm-charcoal leading-snug">{item.name}</p>
        <p className="text-xs text-warm-charcoal/50 mt-0.5">{item.category}</p>
        {item.price > 0 && (
          <p className="text-sm font-semibold text-warm-terracotta mt-1">
            ${item.price.toFixed(2)}
          </p>
        )}
      </div>

      {/* Dimensions */}
      <div className="px-4 py-3 border-b border-warm-sand/40">
        <p className="text-xs text-warm-charcoal/50 mb-2 uppercase tracking-wide">Dimensions</p>
        <div className="grid grid-cols-2 gap-2 text-xs">
          <div className="bg-warm-cream/60 rounded-lg p-2 text-center">
            <p className="text-warm-charcoal/40">Width</p>
            <p className="font-semibold text-warm-charcoal">{displayW.toFixed(1)} ft</p>
          </div>
          <div className="bg-warm-cream/60 rounded-lg p-2 text-center">
            <p className="text-warm-charcoal/40">Depth</p>
            <p className="font-semibold text-warm-charcoal">{displayD.toFixed(1)} ft</p>
          </div>
        </div>
        <p className="text-[10px] text-warm-charcoal/30 mt-1.5 text-center">
          Position: ({item.x.toFixed(1)}, {item.y.toFixed(1)}) ft
        </p>
      </div>

      {/* Controls */}
      <div className="p-4 space-y-2">
        <button
          onClick={() => onRotate(item.id)}
          className="w-full flex items-center justify-center gap-2 py-2 rounded-lg border border-warm-sand/60 text-sm text-warm-charcoal hover:bg-warm-cream/80 transition-colors"
        >
          <span>↻</span>
          <span>Rotate 90°</span>
        </button>
        <button
          onClick={() => onDelete(item.id)}
          className="w-full flex items-center justify-center gap-2 py-2 rounded-lg border border-red-200 text-sm text-red-600 hover:bg-red-50 transition-colors"
        >
          <span>🗑</span>
          <span>Remove</span>
        </button>
      </div>

      {/* Product image + Etsy link */}
      {item.imageUrl && (
        <div className="px-4 pb-4">
          <div className="flex items-center justify-between mb-1.5">
            <p className="text-xs text-warm-charcoal/40 uppercase tracking-wide">Product</p>
            {item.productUrl && (
              <a
                href={item.productUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs font-medium text-warm-terracotta hover:underline flex items-center gap-1"
              >
                Etsy ↗
              </a>
            )}
          </div>
          <a
            href={item.productUrl ?? "#"}
            target={item.productUrl ? "_blank" : undefined}
            rel="noopener noreferrer"
            className={item.productUrl ? "block group" : "block pointer-events-none"}
          >
            <div className="relative aspect-square w-full rounded-lg overflow-hidden border border-warm-sand/40">
              <Image
                src={item.imageUrl}
                alt={item.name}
                fill
                className={`object-cover ${item.productUrl ? "group-hover:scale-105 transition-transform duration-300" : ""}`}
                sizes="180px"
                unoptimized
              />
            </div>
          </a>
        </div>
      )}
    </aside>
  );
}
