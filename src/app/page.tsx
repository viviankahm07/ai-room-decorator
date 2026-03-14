"use client";

import { useState, useEffect } from "react";
import ChatbotPanel from "@/components/ChatbotPanel";
import InspirationSection from "@/components/InspirationSection";
import EtsyProductsSection from "@/components/EtsyProductsSection";
import SavedBoardsSidebar, {
  getLocalBoards,
  setLocalBoards,
} from "@/components/SavedBoardsSidebar";
import AuthModal from "@/components/AuthModal";
import ShareBoardModal from "@/components/ShareBoardModal";
import LayoutTab from "@/components/layout/LayoutTab";
import { createSupabaseBrowserClient } from "@/lib/supabase";
import type { RoomInfo, SavedBoard, AuthUser } from "@/types";
import type { EtsyProduct } from "@/app/api/etsy-products/route";

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

const supabaseEnabled = !!process.env.NEXT_PUBLIC_SUPABASE_URL;

export default function Home() {
  const [roomInfo, setRoomInfo]   = useState<RoomInfo>({});
  const [lastMessage, setLastMessage] = useState("");
  const [chatMessages, setChatMessages] = useState<{ role: string; content: string }[]>([]);
  const [showBoards, setShowBoards]     = useState(false);
  const [currentBoard, setCurrentBoard] = useState<SavedBoard | null>(null);
  const [boardKey, setBoardKey]         = useState(0);

  // Tab
  const [activeTab, setActiveTab] = useState<"moodboard" | "layout">("moodboard");

  // Products lifted from EtsyProductsSection → feed into Layout tab
  const [moodboardProducts, setMoodboardProducts] = useState<EtsyProduct[]>([]);

  // Auth state
  const [user, setUser] = useState<AuthUser | null>(null);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);

  // Listen for auth state changes
  useEffect(() => {
    if (!supabaseEnabled) return;
    const supabase = createSupabaseBrowserClient();

    supabase.auth.getUser().then(({ data }) => {
      if (data.user) setUser({ id: data.user.id, email: data.user.email ?? "" });
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        setUser({ id: session.user.id, email: session.user.email ?? "" });
      } else {
        setUser(null);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleSignOut = async () => {
    const supabase = createSupabaseBrowserClient();
    await supabase.auth.signOut();
    setUser(null);
  };

  // Extract room info from chat messages
  useEffect(() => {
    if (!lastMessage) return;

    const allText = chatMessages.map((m) => m.content).join(" ") || lastMessage;
    const detected = extractFromText(allText);
    if (Object.keys(detected).length > 0) {
      setRoomInfo((prev) => ({ ...prev, ...detected }));
    }

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
    setMoodboardProducts([]);
    setActiveTab("moodboard");
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

    if (supabaseEnabled) {
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

  const sectionKey = `${roomInfo.theme ?? ""}-${roomInfo.roomType ?? ""}`;
  // Layout persist key is scoped to the board (or session fallback)
  const layoutPersistKey = `cdd-layout-${currentBoard?.id ?? "default"}`;

  return (
    <div className="h-screen flex flex-col bg-warm-cream">
      {/* ── Top header ── */}
      <header className="flex-shrink-0 flex items-center justify-between px-4 py-3 border-b border-warm-sand/60 bg-white/80 backdrop-blur">
        <h1 className="font-display text-[25px] font-semibold text-warm-charcoal">
          College Dorm Decorator
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
          {currentBoard && user && !currentBoard.id.startsWith("local-") && (
            <button
              onClick={() => setShowShareModal(true)}
              className="px-3 py-2 rounded-lg text-sm font-medium text-warm-charcoal border border-warm-sand/60 hover:bg-warm-cream/80 transition-colors"
            >
              Share
            </button>
          )}
          <button
            onClick={() => setShowBoards(true)}
            className="px-3 py-2 rounded-lg text-sm font-medium text-warm-charcoal hover:bg-warm-cream/80 transition-colors"
          >
            My Boards
          </button>

          {supabaseEnabled && (
            user ? (
              <div className="flex items-center gap-2 pl-2 border-l border-warm-sand/60">
                <span className="text-xs text-warm-charcoal/60 hidden sm:inline max-w-[120px] truncate">
                  {user.email}
                </span>
                <button
                  onClick={handleSignOut}
                  className="px-3 py-2 rounded-lg text-sm font-medium text-warm-charcoal/70 hover:bg-warm-cream/80 transition-colors"
                >
                  Sign out
                </button>
              </div>
            ) : (
              <button
                onClick={() => setShowAuthModal(true)}
                className="px-3 py-2 rounded-lg text-sm font-medium text-warm-terracotta border border-warm-terracotta/40 hover:bg-warm-terracotta/5 transition-colors"
              >
                Sign in
              </button>
            )
          )}
        </div>
      </header>

      {/* ── Tab bar ── */}
      <div className="flex-shrink-0 flex items-center gap-1 px-4 py-2 border-b border-warm-sand/40 bg-white">
        {(["moodboard", "layout"] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all ${
              activeTab === tab
                ? "bg-warm-charcoal text-warm-cream shadow-sm"
                : "text-warm-charcoal/60 hover:text-warm-charcoal hover:bg-warm-cream/80"
            }`}
          >
            {tab === "moodboard" ? "🎨 Moodboard" : "📐 Layout"}
          </button>
        ))}
        {activeTab === "layout" && moodboardProducts.length === 0 && lastMessage && (
          <span className="ml-2 text-xs text-warm-charcoal/40">
            Switch to Moodboard to load products, then come back to place them
          </span>
        )}
      </div>

      {/* ── Tab content ── */}
      <div className="flex-1 flex min-h-0 overflow-hidden">

        {/* ════ MOODBOARD TAB ════ */}
        {activeTab === "moodboard" && (
          <>
            <main className="flex-1 flex flex-col min-w-0 min-h-[50vh] md:min-h-0">
              <div className="flex-1 overflow-auto">
                {!lastMessage ? (
                  <div className="flex flex-col items-center justify-center min-h-[400px] text-warm-charcoal/50 px-6 text-center">
                    <p className="text-4xl mb-4">🛋️</p>
                    <p className="text-lg font-display font-medium text-warm-charcoal/70">
                      Describe your dorm to get started
                    </p>
                    <p className="text-sm mt-2 max-w-sm">
                      Tell the assistant your room type, vibe, and budget — the moodboard will fill with real products from Etsy.
                    </p>
                  </div>
                ) : (
                  <>
                    <EtsyProductsSection
                      key={`moodboard-${sectionKey}`}
                      roomInfo={roomInfo}
                      label="Moodboard"
                      onProductsChange={setMoodboardProducts}
                    />
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
          </>
        )}

        {/* ════ LAYOUT TAB ════ */}
        {activeTab === "layout" && (
          <LayoutTab
            availableProducts={moodboardProducts}
            persistKey={layoutPersistKey}
          />
        )}
      </div>

      <SavedBoardsSidebar
        isOpen={showBoards}
        onClose={() => setShowBoards(false)}
        onSelectBoard={handleSelectBoard}
        currentBoard={currentBoard}
        user={user}
      />

      {showAuthModal && (
        <AuthModal
          onClose={() => setShowAuthModal(false)}
          onSuccess={() => setShowAuthModal(false)}
        />
      )}

      {showShareModal && currentBoard && (
        <ShareBoardModal
          board={currentBoard}
          onClose={() => setShowShareModal(false)}
        />
      )}
    </div>
  );
}
