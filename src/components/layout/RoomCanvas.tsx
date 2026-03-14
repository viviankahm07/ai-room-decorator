"use client";

import { useRef, useState, useEffect, useCallback } from "react";
import type { LayoutItem, RoomDimensions } from "@/types";
import FurnitureShape from "./FurnitureShape";

interface RoomCanvasProps {
  room: RoomDimensions;
  items: LayoutItem[];
  selectedId: string | null;
  onSelect: (id: string | null) => void;
  onUpdateItem: (id: string, patch: Partial<LayoutItem>) => void;
}

const PADDING = 48; // px around the room inside the canvas container

export default function RoomCanvas({
  room,
  items,
  selectedId,
  onSelect,
  onUpdateItem,
}: RoomCanvasProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [containerSize, setContainerSize] = useState({ width: 700, height: 500 });

  // Observe container resize
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const obs = new ResizeObserver((entries) => {
      const { width, height } = entries[0].contentRect;
      setContainerSize({ width, height });
    });
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  const scaleX = (containerSize.width - PADDING * 2) / room.width;
  const scaleY = (containerSize.height - PADDING * 2) / room.length;
  const scale = Math.min(scaleX, scaleY);

  const roomPxW = room.width * scale;
  const roomPxH = room.length * scale;
  const roomLeft = (containerSize.width - roomPxW) / 2;
  const roomTop = (containerSize.height - roomPxH) / 2;

  // Grid cell = 1 ft
  const gridSize = scale;

  // ── Drag state ─────────────────────────────────────────────────────────────
  const dragging = useRef<{
    itemId: string;
    startMouseX: number;
    startMouseY: number;
    startItemX: number;
    startItemY: number;
  } | null>(null);

  const handleItemPointerDown = useCallback(
    (e: React.PointerEvent<HTMLDivElement>, item: LayoutItem) => {
      e.preventDefault();
      e.stopPropagation();
      onSelect(item.id);
      (e.currentTarget as HTMLDivElement).setPointerCapture(e.pointerId);
      dragging.current = {
        itemId: item.id,
        startMouseX: e.clientX,
        startMouseY: e.clientY,
        startItemX: item.x,
        startItemY: item.y,
      };
    },
    [onSelect]
  );

  const handlePointerMove = useCallback(
    (e: React.PointerEvent<HTMLDivElement>) => {
      if (!dragging.current) return;
      const d = dragging.current;
      const dx = (e.clientX - d.startMouseX) / scale;
      const dy = (e.clientY - d.startMouseY) / scale;

      const item = items.find((i) => i.id === d.itemId);
      if (!item) return;

      // Account for rotation: swap w/d when rotated 90° or 270°
      const rot = item.rotation % 180;
      const effectiveW = rot === 0 ? item.width : item.depth;
      const effectiveD = rot === 0 ? item.depth : item.width;

      const newX = Math.max(0, Math.min(room.width - effectiveW, d.startItemX + dx));
      const newY = Math.max(0, Math.min(room.length - effectiveD, d.startItemY + dy));

      onUpdateItem(d.itemId, { x: newX, y: newY });
    },
    [scale, items, room, onUpdateItem]
  );

  const handlePointerUp = useCallback(() => {
    dragging.current = null;
  }, []);

  return (
    <div
      ref={containerRef}
      className="flex-1 relative overflow-hidden bg-[#f4f1eb] select-none"
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerLeave={handlePointerUp}
      onClick={() => onSelect(null)}
    >
      {/* Outer canvas label */}
      <div className="absolute top-3 left-1/2 -translate-x-1/2 text-xs text-warm-charcoal/40 font-medium tracking-widest uppercase pointer-events-none">
        {room.width} ft × {room.length} ft
      </div>

      {/* Room rectangle */}
      <div
        className="absolute shadow-lg"
        style={{
          left: roomLeft,
          top: roomTop,
          width: roomPxW,
          height: roomPxH,
          backgroundColor: "#faf8f5",
          border: "3px solid #2E676B",
          borderRadius: 2,
          backgroundImage: `
            linear-gradient(to right, rgba(46,103,107,0.07) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(46,103,107,0.07) 1px, transparent 1px)
          `,
          backgroundSize: `${gridSize}px ${gridSize}px`,
        }}
        onClick={(e) => {
          e.stopPropagation();
          onSelect(null);
        }}
      >
        {/* Wall tick labels — top edge (width) */}
        {Array.from({ length: Math.floor(room.width) + 1 }).map((_, i) => (
          <span
            key={`wx-${i}`}
            className="absolute text-[9px] text-warm-charcoal/30 pointer-events-none"
            style={{ left: i * scale - 5, top: -16 }}
          >
            {i}
          </span>
        ))}
        {/* Left edge (length) */}
        {Array.from({ length: Math.floor(room.length) + 1 }).map((_, i) => (
          <span
            key={`wy-${i}`}
            className="absolute text-[9px] text-warm-charcoal/30 pointer-events-none"
            style={{ top: i * scale - 7, left: -18 }}
          >
            {i}
          </span>
        ))}

        {/* Furniture items */}
        {items.map((item) => {
          const rot = item.rotation % 180;
          const effectiveW = rot === 0 ? item.width : item.depth;
          const effectiveD = rot === 0 ? item.depth : item.width;
          const pxW = effectiveW * scale;
          const pxH = effectiveD * scale;
          const isSelected = item.id === selectedId;

          return (
            <div
              key={item.id}
              className={`absolute cursor-grab active:cursor-grabbing transition-shadow ${
                isSelected ? "ring-2 ring-warm-terracotta ring-offset-1 shadow-lg z-20" : "hover:shadow-md z-10"
              }`}
              style={{
                left: item.x * scale,
                top: item.y * scale,
                width: pxW,
                height: pxH,
                transform: `rotate(${item.rotation}deg)`,
                transformOrigin: `${pxW / 2}px ${pxH / 2}px`,
                borderRadius: 3,
                overflow: "hidden",
              }}
              onPointerDown={(e) => handleItemPointerDown(e, item)}
              onClick={(e) => e.stopPropagation()}
            >
              <FurnitureShape type={item.shapeType} selected={isSelected} />

              {/* Label — only visible when large enough */}
              {pxW > 48 && pxH > 28 && (
                <div
                  className="absolute bottom-0 left-0 right-0 px-1 py-0.5 text-center pointer-events-none"
                  style={{ background: "rgba(255,255,255,0.65)" }}
                >
                  <span className="text-[8px] font-medium text-warm-charcoal/70 truncate block leading-tight">
                    {item.name.length > 22 ? item.name.slice(0, 20) + "…" : item.name}
                  </span>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Compass / legend */}
      <div className="absolute bottom-4 right-4 text-xs text-warm-charcoal/30 font-medium">
        1 sq = 1 ft
      </div>
    </div>
  );
}
