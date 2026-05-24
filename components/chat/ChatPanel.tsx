"use client";

import React from "react";
import { X, MessageSquare, Minus } from "lucide-react";
import { useFloatingChat } from "./FloatingChatProvider";
import ConversationList from "./ConversationList";
import ConversationView from "./ConversationView";

interface ChatPanelProps {
  onClosePanel: () => void;
}

export default function ChatPanel({ onClosePanel }: ChatPanelProps) {
  const {
    activeConnectionId,
    unreadTotal,
  } = useFloatingChat();

  return (
    <div className="flex flex-col h-full w-full overflow-hidden bg-white/95 rounded-3xl border border-slate-100 shadow-2xl relative">
      {/* List Header (Only rendered when in connection list mode) */}
      {activeConnectionId === null && (
        <header className="flex items-center justify-between px-5 py-4 border-b border-slate-100 sticky top-0 bg-white/85 backdrop-blur-md z-10 shrink-0">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-[rgb(34,142,222)]/10 text-[rgb(29,93,185)]">
              <MessageSquare className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-bold text-slate-800 text-[14px]">Messages</span>
                {unreadTotal > 0 && (
                  <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-[rgb(239,62,43)] px-1.5 text-[9.5px] font-bold text-white shadow-sm">
                    {unreadTotal}
                  </span>
                )}
              </div>
              <p className="text-[10px] text-slate-400 font-semibold flex items-center gap-1 mt-0.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" /> Real-time System
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1">
            <button
              onClick={onClosePanel}
              className="p-1.5 rounded-xl hover:bg-slate-50 text-slate-400 hover:text-slate-600 transition-colors"
            >
              <Minus className="w-4 h-4" />
            </button>
            <button
              onClick={onClosePanel}
              className="p-1.5 rounded-xl hover:bg-slate-50 text-slate-400 hover:text-slate-600 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </header>
      )}

      {/* Main Content Area */}
      <div className="flex-1 min-h-0">
        {activeConnectionId === null ? (
          <ConversationList />
        ) : (
          <ConversationView connectionId={activeConnectionId} />
        )}
      </div>
    </div>
  );
}
