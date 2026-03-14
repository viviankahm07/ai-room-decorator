"use client";

import { useState } from "react";
import type { SavedBoard } from "@/types";

interface ShareBoardModalProps {
  board: SavedBoard;
  onClose: () => void;
}

export default function ShareBoardModal({ board, onClose }: ShareBoardModalProps) {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const handleShare = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/boards/share", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ boardId: board.id, sharedWithEmail: email }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Failed to share");
      setSuccess(true);
      setEmail("");
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl shadow-2xl w-full max-w-sm p-6"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-1">
          <h2 className="font-display text-xl font-semibold text-warm-charcoal">
            Share Board
          </h2>
          <button
            onClick={onClose}
            className="text-warm-charcoal/50 hover:text-warm-charcoal text-lg"
          >
            ✕
          </button>
        </div>
        <p className="text-sm text-warm-charcoal/60 mb-5">
          Invite your roommate to view &quot;{board.name}&quot;
        </p>

        {success ? (
          <div className="text-center py-4">
            <p className="text-2xl mb-2">🎉</p>
            <p className="font-medium text-warm-charcoal">Shared!</p>
            <p className="text-sm text-warm-charcoal/60 mt-1">
              Your roommate will see this board when they log in.
            </p>
            <div className="flex gap-2 mt-4">
              <button
                onClick={() => setSuccess(false)}
                className="flex-1 py-2 rounded-lg border border-warm-sand text-sm text-warm-charcoal hover:bg-warm-cream/50"
              >
                Share with another
              </button>
              <button
                onClick={onClose}
                className="flex-1 py-2 rounded-lg bg-warm-terracotta text-white text-sm hover:bg-warm-terracotta/90"
              >
                Done
              </button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleShare} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-warm-charcoal mb-1">
                Roommate&apos;s email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="roommate@college.edu"
                className="w-full border border-warm-sand rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-warm-terracotta/40"
              />
            </div>

            {error && (
              <p className="text-sm text-red-600 bg-red-50 rounded-lg px-3 py-2">
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 rounded-lg bg-warm-terracotta text-white text-sm font-medium hover:bg-warm-terracotta/90 disabled:opacity-60 transition-colors"
            >
              {loading ? "Sharing..." : "Share Board"}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
