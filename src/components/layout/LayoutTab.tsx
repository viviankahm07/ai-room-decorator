"use client";

import { useState, useCallback, useEffect } from "react";
import type { LayoutItem, RoomDimensions } from "@/types";
import type { EtsyProduct } from "@/app/api/etsy-products/route";
import RoomCanvas from "./RoomCanvas";
import LayoutLeftSidebar from "./LayoutLeftSidebar";
import LayoutRightPanel from "./LayoutRightPanel";

interface LayoutTabProps {
  availableProducts: EtsyProduct[];
  persistKey: string; // used for localStorage — ties to board/session
}

const DEFAULT_ROOM: RoomDimensions = { width: 11, length: 14 };

function loadFromStorage(key: string): { items: LayoutItem[]; room: RoomDimensions } | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

function saveToStorage(key: string, items: LayoutItem[], room: RoomDimensions) {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(key, JSON.stringify({ items, room }));
  } catch {}
}

export default function LayoutTab({ availableProducts, persistKey }: LayoutTabProps) {
  const [room, setRoom] = useState<RoomDimensions>(DEFAULT_ROOM);
  const [items, setItems] = useState<LayoutItem[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [hydrated, setHydrated] = useState(false);

  // Load from localStorage on mount / persistKey change
  useEffect(() => {
    const saved = loadFromStorage(persistKey);
    if (saved) {
      setItems(saved.items ?? []);
      setRoom(saved.room ?? DEFAULT_ROOM);
    } else {
      setItems([]);
      setRoom(DEFAULT_ROOM);
    }
    setSelectedId(null);
    setHydrated(true);
  }, [persistKey]);

  // Auto-save to localStorage whenever state changes
  useEffect(() => {
    if (!hydrated) return;
    saveToStorage(persistKey, items, room);
  }, [items, room, persistKey, hydrated]);

  const handleAddItem = useCallback((item: LayoutItem) => {
    setItems((prev) => [...prev, item]);
    setSelectedId(item.id);
  }, []);

  const handleUpdateItem = useCallback((id: string, patch: Partial<LayoutItem>) => {
    setItems((prev) => prev.map((i) => (i.id === id ? { ...i, ...patch } : i)));
  }, []);

  const handleRotate = useCallback((id: string) => {
    setItems((prev) =>
      prev.map((i) => {
        if (i.id !== id) return i;
        const nextRot = ((i.rotation + 90) % 360) as 0 | 90 | 180 | 270;
        return { ...i, rotation: nextRot };
      })
    );
  }, []);

  const handleDelete = useCallback(
    (id: string) => {
      setItems((prev) => prev.filter((i) => i.id !== id));
      if (selectedId === id) setSelectedId(null);
    },
    [selectedId]
  );

  const handleRoomChange = useCallback((newRoom: RoomDimensions) => {
    setRoom(newRoom);
    // Clamp items that are now outside the new bounds
    setItems((prev) =>
      prev.map((item) => {
        const rot = item.rotation % 180;
        const effectiveW = rot === 0 ? item.width : item.depth;
        const effectiveD = rot === 0 ? item.depth : item.width;
        return {
          ...item,
          x: Math.max(0, Math.min(newRoom.width - effectiveW, item.x)),
          y: Math.max(0, Math.min(newRoom.length - effectiveD, item.y)),
        };
      })
    );
  }, []);

  const selectedItem = items.find((i) => i.id === selectedId) ?? null;
  const totalPlacedCost = items.reduce((s, i) => s + i.price, 0);

  return (
    <div className="flex flex-1 min-h-0 overflow-hidden">
      <LayoutLeftSidebar
        room={room}
        onRoomChange={handleRoomChange}
        availableProducts={availableProducts}
        placedItems={items}
        onAddItem={handleAddItem}
      />

      {/* Central canvas area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Canvas toolbar */}
        <div className="flex items-center justify-between px-4 py-2 border-b border-warm-sand/40 bg-white flex-shrink-0">
          <div className="flex items-center gap-3">
            <span className="text-xs text-warm-charcoal/50">
              {items.length} item{items.length !== 1 ? "s" : ""} placed
            </span>
            {totalPlacedCost > 0 && (
              <span className="text-xs font-medium text-warm-charcoal/70">
                · ${totalPlacedCost.toFixed(0)} total
              </span>
            )}
          </div>
          {items.length > 0 && (
            <button
              onClick={() => {
                if (confirm("Clear all items from the layout?")) {
                  setItems([]);
                  setSelectedId(null);
                }
              }}
              className="text-xs text-warm-charcoal/40 hover:text-red-500 transition-colors"
            >
              Clear all
            </button>
          )}
        </div>

        <RoomCanvas
          room={room}
          items={items}
          selectedId={selectedId}
          onSelect={setSelectedId}
          onUpdateItem={handleUpdateItem}
        />
      </div>

      <LayoutRightPanel
        item={selectedItem}
        onRotate={handleRotate}
        onDelete={handleDelete}
        onDeselect={() => setSelectedId(null)}
      />
    </div>
  );
}
