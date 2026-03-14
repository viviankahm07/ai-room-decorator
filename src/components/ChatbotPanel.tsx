"use client";

import { useState, useRef, useEffect } from "react";
import type { ChatMessage, RoomInfo } from "@/types";

const INITIAL_MESSAGE: ChatMessage = {
  id: "0",
  role: "assistant",
  content:
    "Hi! I'm your AI room decorator. To get started, tell me about your space—room type, dimensions, theme, colors, and budget. What room are we decorating?",
  timestamp: new Date(),
};

interface ChatbotPanelProps {
  onRefine: (prompt: string, messages: { role: string; content: string }[]) => void;
  onRoomInfoUpdate: (roomInfo: RoomInfo) => void;
  roomInfo: RoomInfo;
  isRefining?: boolean;
}

export default function ChatbotPanel({
  onRefine,
  onRoomInfoUpdate,
  roomInfo,
  isRefining,
}: ChatbotPanelProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([INITIAL_MESSAGE]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = async () => {
    const text = input.trim();
    if (!text || isLoading) return;

    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      role: "user",
      content: text,
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setIsLoading(true);

    // Trigger recommendations immediately—don't wait for chat response
    const allMessages = [...messages, userMsg].map((m) => ({
      role: m.role,
      content: m.content,
    }));
    onRefine(text, allMessages);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: [...messages, userMsg].map((m) => ({
            role: m.role,
            content: m.content,
          })),
        }),
      });
      const data = await res.json();
      if (data.content) {
        setMessages((prev) => [
          ...prev,
          {
            id: (Date.now() + 1).toString(),
            role: "assistant",
            content: data.content,
            timestamp: new Date(),
          },
        ]);
      }
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          role: "assistant",
          content: "Something went wrong. Please try again.",
          timestamp: new Date(),
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-full bg-white border-l border-warm-sand/60">
      <div className="px-4 py-3 border-b border-warm-sand/60 bg-warm-cream/30">
        <h2 className="font-display font-semibold text-warm-charcoal">
          AI Decor Assistant
        </h2>
        <p className="text-xs text-warm-charcoal/60 mt-0.5">
          Share your preferences • Refine with follow-ups
        </p>
      </div>
      <div className="flex-1 overflow-y-auto p-4 space-y-4 min-h-0">
        {messages.map((m) => (
          <div
            key={m.id}
            className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}
          >
            <div
              className={`max-w-[85%] rounded-2xl px-4 py-2.5 ${
                m.role === "user"
                  ? "bg-warm-terracotta text-white"
                  : "bg-warm-sand/50 text-warm-charcoal"
              }`}
            >
              <p className="text-sm whitespace-pre-wrap">{m.content}</p>
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-warm-sand/50 rounded-2xl px-4 py-2.5">
              <span className="text-sm text-warm-charcoal/60">Thinking...</span>
            </div>
          </div>
        )}
        <div ref={scrollRef} />
      </div>
      <div className="p-4 border-t border-warm-sand/60">
        <div className="flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && sendMessage()}
            placeholder="Describe your room or refine the moodboard..."
            className="flex-1 rounded-xl border border-warm-sand/80 bg-warm-cream/50 px-4 py-2.5 text-sm text-warm-charcoal placeholder:text-warm-charcoal/50 focus:outline-none focus:ring-2 focus:ring-warm-terracotta/50"
            disabled={isLoading || isRefining}
          />
          <button
            onClick={sendMessage}
            disabled={isLoading || isRefining || !input.trim()}
            className="rounded-xl bg-warm-terracotta px-4 py-2.5 text-white font-medium text-sm hover:bg-warm-terracotta/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
}
