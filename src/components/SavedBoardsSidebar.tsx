"use client";

import { useState, useEffect } from "react";
import type { SavedBoard, AuthUser } from "@/types";

const STORAGE_KEY = "college-dorm-decorator-boards";

interface SavedBoardsSidebarProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectBoard: (board: SavedBoard | null) => void;
  currentBoard?: SavedBoard | null;
  user?: AuthUser | null;
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
  user,
}: SavedBoardsSidebarProps) {
  const [boards, setBoards] = useState<SavedBoard[]>([]);
  const useSupabase =
    typeof window !== "undefined" && !!process.env.NEXT_PUBLIC_SUPABASE_URL;

  useEffect(() => {
    if (!isOpen) return;

    if (useSupabase && user) {
      // Fetch boards (own + shared) from API when logged in
      fetch("/api/boards")
        .then((r) => r.json())
        .then((d) => {
          if (Array.isArray(d.boards)) {
            setBoards(d.boards);
          }
        })
        .catch(() => setBoards(getLocalBoards()));
    } else {
      setBoards(getLocalBoards());
    }
  }, [isOpen, user, useSupabase]);

  const deleteBoard = (id: string) => {
    if (useSupabase && user) {
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

  const ownBoards = boards.filter((b) => !b.sharedByEmail);
  const sharedBoards = boards.filter((b) => b.sharedByEmail);

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

        <div className="p-4 space-y-4">
          {/* Own boards */}
          <div className="space-y-2">
            {ownBoards.length === 0 && sharedBoards.length === 0 ? (
              <p className="text-sm text-warm-charcoal/60">No saved boards yet.</p>
            ) : (
              ownBoards.map((board) => (
                <BoardCard
                  key={board.id}
                  board={board}
                  isActive={currentBoard?.id === board.id}
                  onSelect={() => { onSelectBoard(board); onClose(); }}
                  onDelete={() => deleteBoard(board.id)}
                  canDelete={!board.sharedByEmail}
                />
              ))
            )}
          </div>

          {/* Shared boards section */}
          {sharedBoards.length > 0 && (
            <div>
              <p className="text-xs font-medium text-warm-charcoal/50 uppercase tracking-wide mb-2">
                Shared with you
              </p>
              <div className="space-y-2">
                {sharedBoards.map((board) => (
                  <BoardCard
                    key={board.id}
                    board={board}
                    isActive={currentBoard?.id === board.id}
                    onSelect={() => { onSelectBoard(board); onClose(); }}
                    onDelete={() => deleteBoard(board.id)}
                    canDelete={false}
                  />
                ))}
              </div>
            </div>
          )}
        </div>
      </aside>
    </>
  );
}

function BoardCard({
  board,
  isActive,
  onSelect,
  onDelete,
  canDelete,
}: {
  board: SavedBoard;
  isActive: boolean;
  onSelect: () => void;
  onDelete: () => void;
  canDelete: boolean;
}) {
  return (
    <div
      className={`p-3 rounded-lg border group ${
        isActive
          ? "border-warm-terracotta/60 bg-warm-terracotta/5"
          : "border-warm-sand/60 hover:bg-warm-cream/50"
      }`}
    >
      <button onClick={onSelect} className="text-left w-full">
        <p className="font-medium text-warm-charcoal truncate">{board.name}</p>
        <p className="text-xs text-warm-charcoal/60 mt-1">
          ${board.totalCost} • {board.products.length} items
        </p>
        {board.sharedByEmail && (
          <p className="text-xs text-warm-charcoal/40 mt-0.5 truncate">
            From {board.sharedByEmail}
          </p>
        )}
      </button>
      {canDelete && (
        <button
          onClick={onDelete}
          className="mt-2 text-xs text-red-600 opacity-0 group-hover:opacity-100 transition-opacity"
        >
          Delete
        </button>
      )}
    </div>
  );
}

export { getLocalBoards, setLocalBoards, STORAGE_KEY };
