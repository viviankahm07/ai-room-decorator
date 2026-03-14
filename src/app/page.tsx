"use client";

import { useState, useEffect } from "react";
import ChatbotPanel from "@/components/ChatbotPanel";
import MoodboardGrid from "@/components/MoodboardGrid";
import BudgetSummary from "@/components/BudgetSummary";
import InspirationSection from "@/components/InspirationSection";
import SavedBoardsSidebar, {
  getLocalBoards,
  setLocalBoards,
} from "@/components/SavedBoardsSidebar";
import type { Product, RoomInfo, SavedBoard } from "@/types";

export default function Home() {
  const [products, setProducts] = useState<Product[]>([]);
  const [roomInfo, setRoomInfo] = useState<RoomInfo>({});
  const [isRefining, setIsRefining] = useState(false);
  const [lastUserMessage, setLastUserMessage] = useState("");
  const [chatMessagesForExtract, setChatMessagesForExtract] = useState<
    { role: string; content: string }[]
  >([]);
  const [showBoards, setShowBoards] = useState(false);
  const [currentBoard, setCurrentBoard] = useState<SavedBoard | null>(null);
  const [boardKey, setBoardKey] = useState(0);

  useEffect(() => {
    if (!lastUserMessage) return;
    setIsRefining(true);
    let mergedRoomInfo = roomInfo;
    fetch("/api/extract-room-info", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages:
            chatMessagesForExtract.length > 0
              ? chatMessagesForExtract
              : [{ role: "user", content: lastUserMessage }],
        }),
    })
      .then((r) => r.json())
      .then((d) => {
        if (d.roomInfo && Object.keys(d.roomInfo).length > 0) {
          mergedRoomInfo = { ...roomInfo, ...d.roomInfo };
          setRoomInfo(mergedRoomInfo);
        }
      })
      .catch(() => {})
      .finally(() => {
        fetch("/api/recommend", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            roomInfo: mergedRoomInfo,
            refinementPrompt: lastUserMessage,
          }),
        })
          .then((r) => r.json())
          .then((data) => {
            if (data.products?.length) setProducts(data.products);
          })
          .catch(() => {})
          .finally(() => setIsRefining(false));
      });
  // eslint-disable-next-line react-hooks/exhaustive-deps -- only run on new messages
  }, [lastUserMessage]);

  const handleRefine = (prompt: string, messages?: { role: string; content: string }[]) => {
    setLastUserMessage(prompt);
    setChatMessagesForExtract(messages ?? [{ role: "user", content: prompt }]);
  };

  const handleNewBoard = () => {
    setProducts([]);
    setRoomInfo({});
    setCurrentBoard(null);
    setBoardKey((k) => k + 1);
  };

  const handleSaveBoard = () => {
    const name =
      prompt("Board name:") ||
      `Board ${new Date().toLocaleDateString()} ${products.length} items`;
    const board: SavedBoard = {
      id: `local-${Date.now()}`,
      name,
      roomInfo,
      products,
      totalCost: products.reduce((s, p) => s + p.price, 0),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    // Always save to localStorage immediately so My Boards reflects it right away
    const boards = getLocalBoards();
    boards.unshift(board);
    setLocalBoards(boards);
    setCurrentBoard(board);

    if (process.env.NEXT_PUBLIC_SUPABASE_URL) {
      fetch("/api/boards", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: board.name,
          roomInfo: board.roomInfo,
          products: board.products,
          totalCost: board.totalCost,
        }),
      })
        .then((r) => r.json())
        .then((saved) => {
          if (saved.id) {
            setCurrentBoard({ ...board, id: saved.id });
          }
        })
        .catch(() => {});
    }
  };

  const handleSelectBoard = (board: SavedBoard | null) => {
    if (!board) {
      setCurrentBoard(null);
      setProducts([]);
      setRoomInfo({});
      return;
    }
    setCurrentBoard(board);
    setProducts(board.products);
    setRoomInfo(board.roomInfo ?? {});
  };

  return (
    <div className="h-screen flex flex-col bg-warm-cream">
      <header className="flex-shrink-0 flex items-center justify-between px-4 py-3 border-b border-warm-sand/60 bg-white/80 backdrop-blur">
        <h1 className="font-display text-xl font-semibold text-warm-charcoal">
          AI Room Decorator
        </h1>
        <div className="flex items-center gap-2">
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
            <MoodboardGrid products={products} isLoading={isRefining} />
            {roomInfo.theme && (
              <InspirationSection key={roomInfo.theme} query={roomInfo.theme} />
            )}
          </div>
          <BudgetSummary
            products={products}
            maxBudget={roomInfo.maxBudget}
          />
        </main>
        <aside className="w-full md:w-96 lg:w-[400px] flex-shrink-0 flex flex-col border-t md:border-t-0 md:border-l border-warm-sand/60 min-h-[40vh] md:min-h-0">
          <ChatbotPanel
            key={boardKey}
            onRefine={handleRefine}
            onRoomInfoUpdate={setRoomInfo}
            roomInfo={roomInfo}
            isRefining={isRefining}
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
