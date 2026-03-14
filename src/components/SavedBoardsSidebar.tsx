"use client";

import { useState, useEffect } from "react";
import type { SavedBoard } from "@/types";

const STORAGE_KEY = "ai-room-decorator-boards";

interface SavedBoardsSidebarProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectBoard: (board: SavedBoard | null) => void;
  currentBoard?: SavedBoard | null;
}

function getLocalBoards(): SavedBoard[] {
  if (typeof window === "undefined") return [];
  try {
    const s = localStorage.getItem(STORAGE_KEY);
    return s ? JSON.parse(s) : [];
  } catch {
    return [];
  }
}

function setLocalBoards(boards: SavedBoard[]) {
  if (typeof window === "undefined") return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(boards));
}

export default function SavedBoardsSidebar({
  isOpen,
  onClose,
  onSelectBoard,
  currentBoard,
}: SavedBoardsSidebarProps) {
  const [boards, setBoards] = useState<SavedBoard[]>([]);
  const useSupabase = typeof window !== "undefined" && !!process.env.NEXT_PUBLIC_SUPABASE_URL;

  useEffect(() => {
    const local = getLocalBoards();
    setBoards(local);
    if (useSupabase) {
      fetch("/api/boards")
        .then((r) => r.json())
        .then((d) => {
          if (Array.isArray(d.boards) && d.boards.length > 0) {
            setBoards(
              d.boards.map((b: { id: string; name: string; room_info: object; products: unknown[]; total_cost: number; created_at: string; updated_at: string }) => ({
                id: b.id,
                name: b.name,
                roomInfo: b.room_info ?? {},
                products: b.products ?? [],
                totalCost: b.total_cost ?? 0,
                createdAt: b.created_at,
                updatedAt: b.updated_at,
              }))
            );
          }
        })
        .catch(() => {});
    }
  }, [isOpen]);

  const deleteBoard = (id: string) => {
    if (useSupabase) {
      fetch(`/api/boards?id=${id}`, { method: "DELETE" }).then(() => {
        setBoards((prev) => prev.filter((b) => b.id !== id));
      });
    } else {
      const next = boards.filter((b) => b.id !== id);
      setBoards(next);
      setLocalBoards(next);
    }
    if (currentBoard?.id === id) onSelectBoard(null);
  };

  if (!isOpen) return null;

  return (
    <>
      <div
        className="fixed inset-0 bg-black/20 z-40 lg:hidden"
        onClick={onClose}
        aria-hidden="true"
      />
      <aside className="fixed top-0 right-0 w-72 h-full bg-white border-l border-warm-sand/60 shadow-xl z-50 overflow-y-auto">
        <div className="p-4 border-b border-warm-sand/60 flex items-center justify-between">
          <h3 className="font-display font-semibold text-warm-charcoal">
            Saved Boards
          </h3>
          <button
            onClick={onClose}
            className="text-warm-charcoal/60 hover:text-warm-charcoal"
            aria-label="Close"
          >
            ✕
          </button>
        </div>
        <div className="p-4 space-y-2">
          {boards.length === 0 ? (
            <p className="text-sm text-warm-charcoal/60">No saved boards yet.</p>
          ) : (
            boards.map((board) => (
              <div
                key={board.id}
                className="p-3 rounded-lg border border-warm-sand/60 hover:bg-warm-cream/50 group"
              >
                <button
                  onClick={() => {
                    onSelectBoard(board);
                    onClose();
                  }}
                  className="text-left w-full"
                >
                  <p className="font-medium text-warm-charcoal truncate">
                    {board.name}
                  </p>
                  <p className="text-xs text-warm-charcoal/60 mt-1">
                    ${board.totalCost} • {board.products.length} items
                  </p>
                </button>
                <button
                  onClick={() => deleteBoard(board.id)}
                  className="mt-2 text-xs text-red-600 opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  Delete
                </button>
              </div>
            ))
          )}
        </div>
      </aside>
    </>
  );
}

export { getLocalBoards, setLocalBoards, STORAGE_KEY };
