"use client";

import { useState, useEffect } from "react";
import ChatbotPanel from "@/components/ChatbotPanel";
import InspirationSection from "@/components/InspirationSection";
import EtsyProductsSection from "@/components/EtsyProductsSection";
import SavedBoardsSidebar, {
  getLocalBoards,
  setLocalBoards,
} from "@/components/SavedBoardsSidebar";
import type { RoomInfo, SavedBoard } from "@/types";

// Client-side keyword extraction — no OpenAI needed, runs instantly
const THEME_KEYWORDS: Record<string, string[]> = {
  vsco:       ["vsco", "aesthetic", "pinterest"],
  pastel:     ["pastel", "soft colors", "light pink", "blush"],
  minimalist: ["minimalist", "minimal", "clean", "simple", "scandinavian"],
  boho:       ["boho", "bohemian", "rattan", "macrame", "eclectic"],
  cozy:       ["cozy", "cosy", "warm", "hygge", "cottagecore"],
  vintage:    ["vintage", "retro", "antique", "classic"],
  modern:     ["modern", "contemporary", "sleek", "industrial"],
  nature:     ["nature", "organic", "botanical", "green", "earthy"],
  gaming:     ["gaming", "gamer", "streamer", "rgb", "setup"],
  girly:      ["girly", "feminine", "pink", "cute", "kawaii"],
};

const ROOM_KEYWORDS: Record<string, string[]> = {
  bedroom:      ["bedroom", "bed room"],
  "living room":["living room", "lounge", "sitting room"],
  office:       ["office", "workspace", "work from home", "wfh"],
  dorm:         ["dorm", "dormitory", "college room", "dorm room"],
  bathroom:     ["bathroom", "bath room", "ensuite"],
};

function extractFromText(text: string): Partial<RoomInfo> {
  const lower = text.toLowerCase();
  const result: Partial<RoomInfo> = {};

  for (const [theme, keywords] of Object.entries(THEME_KEYWORDS)) {
    if (keywords.some((kw) => lower.includes(kw))) { result.theme = theme; break; }
  }
  for (const [room, keywords] of Object.entries(ROOM_KEYWORDS)) {
    if (keywords.some((kw) => lower.includes(kw))) { result.roomType = room; break; }
  }
  const budgetMatch = lower.match(/\$\s?(\d[\d,]*)/);
  if (budgetMatch) result.maxBudget = parseInt(budgetMatch[1].replace(/,/g, ""), 10);

  return result;
}

export default function Home() {
  const [roomInfo, setRoomInfo]   = useState<RoomInfo>({});
  const [lastMessage, setLastMessage] = useState("");
  const [chatMessages, setChatMessages] = useState<{ role: string; content: string }[]>([]);
  const [showBoards, setShowBoards]     = useState(false);
  const [currentBoard, setCurrentBoard] = useState<SavedBoard | null>(null);
  const [boardKey, setBoardKey]         = useState(0);

  // Extract room info from chat messages, client-side first, then OpenAI if available
  useEffect(() => {
    if (!lastMessage) return;

    const allText = chatMessages.map((m) => m.content).join(" ") || lastMessage;
    const detected = extractFromText(allText);
    if (Object.keys(detected).length > 0) {
      setRoomInfo((prev) => ({ ...prev, ...detected }));
    }

    // Also fire OpenAI extraction for richer parsing (non-blocking)
    fetch("/api/extract-room-info", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        messages: chatMessages.length > 0 ? chatMessages : [{ role: "user", content: lastMessage }],
      }),
    })
      .then((r) => r.json())
      .then((d) => {
        if (d.roomInfo && Object.keys(d.roomInfo).length > 0) {
          setRoomInfo((prev) => ({ ...prev, ...d.roomInfo }));
        }
      })
      .catch(() => {});
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lastMessage]);

  const handleRefine = (prompt: string, messages?: { role: string; content: string }[]) => {
    setLastMessage(prompt);
    setChatMessages(messages ?? [{ role: "user", content: prompt }]);
  };

  const handleNewBoard = () => {
    setRoomInfo({});
    setCurrentBoard(null);
    setLastMessage("");
    setChatMessages([]);
    setBoardKey((k) => k + 1);
  };

  const handleSaveBoard = () => {
    const name =
      window.prompt("Board name:") ||
      `${roomInfo.theme ?? "My"} ${roomInfo.roomType ?? "Room"} — ${new Date().toLocaleDateString()}`;
    const board: SavedBoard = {
      id: `local-${Date.now()}`,
      name,
      roomInfo,
      products: [],
      totalCost: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    const boards = getLocalBoards();
    boards.unshift(board);
    setLocalBoards(boards);
    setCurrentBoard(board);

    if (process.env.NEXT_PUBLIC_SUPABASE_URL) {
      fetch("/api/boards", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: board.name, roomInfo: board.roomInfo, products: [], totalCost: 0 }),
      })
        .then((r) => r.json())
        .then((saved) => { if (saved.id) setCurrentBoard({ ...board, id: saved.id }); })
        .catch(() => {});
    }
  };

  const handleSelectBoard = (board: SavedBoard | null) => {
    if (!board) { setCurrentBoard(null); setRoomInfo({}); return; }
    setCurrentBoard(board);
    setRoomInfo(board.roomInfo ?? {});
  };

  // Key for Etsy/Inspiration sections — re-mounts when theme or roomType changes
  const sectionKey = `${roomInfo.theme ?? ""}-${roomInfo.roomType ?? ""}`;

  return (
    <div className="h-screen flex flex-col bg-warm-cream">
      <header className="flex-shrink-0 flex items-center justify-between px-4 py-3 border-b border-warm-sand/60 bg-white/80 backdrop-blur">
        <h1 className="font-display text-xl font-semibold text-warm-charcoal">
          AI Room Decorator
        </h1>
        <div className="flex items-center gap-2">
          {roomInfo.maxBudget && (
            <span className="text-xs text-warm-charcoal/60 hidden sm:inline">
              Budget: ${roomInfo.maxBudget.toLocaleString()}
            </span>
          )}
          <button
            onClick={handleNewBoard}
            className="px-3 py-2 rounded-lg text-sm font-medium text-warm-charcoal hover:bg-warm-cream/80 transition-colors"
          >
            New Board
          </button>
          <button
            onClick={handleSaveBoard}
            className="px-3 py-2 rounded-lg text-sm font-medium bg-warm-terracotta text-white hover:bg-warm-terracotta/90 transition-colors"
          >
            Save Board
          </button>
          <button
            onClick={() => setShowBoards(true)}
            className="px-3 py-2 rounded-lg text-sm font-medium text-warm-charcoal hover:bg-warm-cream/80 transition-colors"
          >
            My Boards
          </button>
        </div>
      </header>

      <div className="flex-1 flex min-h-0 flex-col md:flex-row">
        <main className="flex-1 flex flex-col min-w-0 min-h-[50vh] md:min-h-0">
          <div className="flex-1 overflow-auto">
            {!lastMessage ? (
              /* Empty state */
              <div className="flex flex-col items-center justify-center min-h-[400px] text-warm-charcoal/50 px-6 text-center">
                <p className="text-4xl mb-4">🛋️</p>
                <p className="text-lg font-display font-medium text-warm-charcoal/70">
                  Describe your room to get started
                </p>
                <p className="text-sm mt-2 max-w-sm">
                  Tell the assistant your room type, vibe, and budget — the moodboard will fill with real products from Etsy.
                </p>
              </div>
            ) : (
              <>
                {/* ── Moodboard: real Etsy products ── */}
                <EtsyProductsSection
                  key={`moodboard-${sectionKey}`}
                  roomInfo={roomInfo}
                  label="Moodboard"
                />

                {/* ── Inspiration photos ── */}
                <InspirationSection
                  key={`inspo-${sectionKey}`}
                  query={roomInfo.theme ?? lastMessage}
                />
              </>
            )}
          </div>
        </main>

        <aside className="w-full md:w-96 lg:w-[400px] flex-shrink-0 flex flex-col border-t md:border-t-0 md:border-l border-warm-sand/60 min-h-[40vh] md:min-h-0">
          <ChatbotPanel
            key={boardKey}
            onRefine={handleRefine}
            onRoomInfoUpdate={setRoomInfo}
            roomInfo={roomInfo}
            isRefining={false}
          />
        </aside>
      </div>

      <SavedBoardsSidebar
        isOpen={showBoards}
        onClose={() => setShowBoards(false)}
        onSelectBoard={handleSelectBoard}
        currentBoard={currentBoard}
      />
    </div>
  );
}
