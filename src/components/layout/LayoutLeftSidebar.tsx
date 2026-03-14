"use client";

import Image from "next/image";
import type { RoomDimensions, LayoutItem } from "@/types";
import type { EtsyProduct } from "@/app/api/etsy-products/route";
import { detectShapeType, SHAPE_DEFAULTS } from "./FurnitureShape";
import FurnitureShape from "./FurnitureShape";

interface LayoutLeftSidebarProps {
  room: RoomDimensions;
  onRoomChange: (room: RoomDimensions) => void;
  availableProducts: EtsyProduct[];
  placedItems: LayoutItem[];
  onAddItem: (item: LayoutItem) => void;
}

export default function LayoutLeftSidebar({
  room,
  onRoomChange,
  availableProducts,
  placedItems,
  onAddItem,
}: LayoutLeftSidebarProps) {
  const handleAddProduct = (product: EtsyProduct) => {
    const shape = detectShapeType(product.category, product.title);
    const dims = SHAPE_DEFAULTS[shape];
    // Place near top-left, slightly offset per item count
    const offset = (placedItems.length % 5) * 0.5;
    const newItem: LayoutItem = {
      id: `item-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
      productId: product.id,
      name: product.title,
      category: product.category,
      shapeType: shape,
      x: 0.5 + offset,
      y: 0.5 + offset,
      width: dims.width,
      depth: dims.depth,
      rotation: 0,
      price: product.price,
      imageUrl: product.image_url,
      productUrl: product.product_url,
    };
    onAddItem(newItem);
  };

  return (
    <aside className="w-60 flex-shrink-0 flex flex-col border-r border-warm-sand/40 bg-white overflow-y-auto">
      {/* Room Settings */}
      <div className="p-4 border-b border-warm-sand/40">
        <h3 className="text-xs font-semibold text-warm-charcoal uppercase tracking-widest mb-3">
          Room Size
        </h3>
        <div className="space-y-2">
          <label className="block">
            <span className="text-xs text-warm-charcoal/60">Width (ft)</span>
            <input
              type="number"
              min={6}
              max={40}
              step={0.5}
              value={room.width}
              onChange={(e) =>
                onRoomChange({ ...room, width: Math.max(6, Math.min(40, Number(e.target.value))) })
              }
              className="mt-1 w-full border border-warm-sand rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-warm-charcoal/20"
            />
          </label>
          <label className="block">
            <span className="text-xs text-warm-charcoal/60">Length (ft)</span>
            <input
              type="number"
              min={6}
              max={40}
              step={0.5}
              value={room.length}
              onChange={(e) =>
                onRoomChange({ ...room, length: Math.max(6, Math.min(40, Number(e.target.value))) })
              }
              className="mt-1 w-full border border-warm-sand rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-warm-charcoal/20"
            />
          </label>
        </div>
        <div className="mt-3 flex gap-1.5 flex-wrap">
          {(
            [
              { label: "Dorm", w: 11, l: 14 },
              { label: "Bedroom", w: 14, l: 16 },
              { label: "Studio", w: 18, l: 20 },
            ] as { label: string; w: number; l: number }[]
          ).map((preset) => (
            <button
              key={preset.label}
              onClick={() => onRoomChange({ width: preset.w, length: preset.l })}
              className="text-xs px-2 py-1 rounded-md border border-warm-sand/60 text-warm-charcoal/70 hover:bg-warm-cream/80 transition-colors"
            >
              {preset.label}
            </button>
          ))}
        </div>
      </div>

      {/* Available items from moodboard */}
      <div className="flex-1 p-4 overflow-y-auto">
        <h3 className="text-xs font-semibold text-warm-charcoal uppercase tracking-widest mb-3">
          From Moodboard
        </h3>

        {availableProducts.length === 0 ? (
          <div className="text-center py-8 px-2">
            <p className="text-2xl mb-2">🛋️</p>
            <p className="text-xs text-warm-charcoal/50 leading-relaxed">
              Items from your moodboard will appear here. Switch to the Moodboard tab to load products.
            </p>
          </div>
        ) : (
          <div className="space-y-2">
            {availableProducts.map((product) => {
              const shape = detectShapeType(product.category, product.title);
              const alreadyPlaced = placedItems.some((i) => i.productId === product.id);
              return (
                <button
                  key={product.id}
                  onClick={() => handleAddProduct(product)}
                  className={`w-full flex items-center gap-2.5 p-2 rounded-lg border transition-all text-left group ${
                    alreadyPlaced
                      ? "border-warm-charcoal/20 bg-warm-cream/30 opacity-60"
                      : "border-warm-sand/60 hover:border-warm-charcoal/40 hover:bg-warm-cream/60"
                  }`}
                  title={alreadyPlaced ? "Already placed" : "Click to add to room"}
                >
                  {/* Shape preview */}
                  <div className="w-9 h-9 flex-shrink-0 rounded-md overflow-hidden bg-warm-cream/60 flex items-center justify-center p-1">
                    <FurnitureShape type={shape} />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-xs font-medium text-warm-charcoal truncate leading-tight">
                      {product.title.length > 28 ? product.title.slice(0, 26) + "…" : product.title}
                    </p>
                    <p className="text-xs text-warm-charcoal/50 mt-0.5">
                      ${product.price.toFixed(0)} · {product.category}
                    </p>
                  </div>
                  {alreadyPlaced ? (
                    <span className="text-[9px] text-warm-charcoal/40 flex-shrink-0">placed</span>
                  ) : (
                    <span className="text-warm-charcoal/30 group-hover:text-warm-charcoal/70 text-lg flex-shrink-0 leading-none">+</span>
                  )}
                </button>
              );
            })}
          </div>
        )}
      </div>
    </aside>
  );
}
