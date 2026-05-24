"use client";

import React, { useState } from "react";
import { Search, MessageSquare, Home, Users } from "lucide-react";
import { useFloatingChat, ConnectionType } from "./FloatingChatProvider";
import UserAvatar from "@/components/shared/UserAvatar";

export default function ConversationList() {
  const { connections, openChat, isLoadingConnections } = useFloatingChat();
  const [searchQuery, setSearchQuery] = useState("");

  const filteredConnections = connections.filter((conn) => {
    const partnerName = conn.partner?.fullName || "";
    return partnerName.toLowerCase().includes(searchQuery.toLowerCase());
  });

  const formatTimestamp = (dateStr: string) => {
    if (!dateStr) return "";
    const d = new Date(dateStr);
    const now = new Date();
    const diffDays = Math.floor((now.getTime() - d.getTime()) / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) {
      return d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
    } else if (diffDays === 1) {
      return "Yesterday";
    } else if (diffDays < 7) {
      return d.toLocaleDateString([], { weekday: "short" });
    } else {
      return d.toLocaleDateString([], { month: "short", day: "numeric" });
    }
  };

  return (
    <div className="flex flex-col h-full bg-white relative">
      {/* Search Header */}
      <div className="p-4 border-b border-slate-100 shrink-0">
        <div className="relative">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search connections..."
            className="w-full pl-10 pr-4 py-2 text-[12.5px] rounded-2xl bg-slate-50 border border-slate-100 text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-[rgb(34,142,222)]/50 focus:ring-1 focus:ring-[rgb(34,142,222)]/20 transition-all"
          />
        </div>
      </div>

      {/* Connection List */}
      <div className="flex-1 overflow-y-auto min-h-0 divide-y divide-slate-50">
        {isLoadingConnections && connections.length === 0 ? (
          <div className="p-8 text-center text-slate-400 text-xs">
            Loading conversations...
          </div>
        ) : filteredConnections.length === 0 ? (
          <div className="p-8 text-center text-slate-400 flex flex-col items-center justify-center space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-slate-50 border border-slate-100/80 flex items-center justify-center text-slate-300 shadow-sm">
              <MessageSquare className="w-5 h-5" />
            </div>
            <p className="text-[12px] font-bold text-slate-600">No conversations found</p>
            <p className="text-[10.5px] max-w-[200px] leading-normal">
              {searchQuery ? "No matches for your search query." : "When you accept requests or get accepted, they will show up here."}
            </p>
          </div>
        ) : (
          filteredConnections.map((conn: ConnectionType) => {
            const partner = conn.partner;
            const lastMsg = conn.lastMessage;
            const hasUnread = conn.unreadCount > 0;

            return (
              <button
                key={conn._id}
                onClick={() => openChat(conn._id)}
                className="w-full flex items-start gap-3.5 p-4 text-left hover:bg-slate-50/80 transition-all group relative overflow-hidden"
              >
                {/* Visual Unread Glow Line */}
                {hasUnread && (
                  <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-[rgb(46,219,244)] to-[rgb(29,93,185)]" />
                )}

                {/* Avatar */}
                <div className="relative shrink-0">
                  <UserAvatar
                    src={partner?.profilePicture}
                    alt={partner?.fullName}
                    className="w-11 h-11 rounded-full border border-slate-100 shadow-sm"
                  />
                  {/* Status Indicator */}
                  <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-500 rounded-full border-2 border-white" />
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-baseline justify-between mb-0.5">
                    <h4 className={`text-[13px] truncate transition-colors leading-tight ${hasUnread ? "font-bold text-slate-900" : "font-semibold text-slate-800 group-hover:text-[rgb(29,93,185)]"}`}>
                      {partner?.fullName || "Roommate"}
                    </h4>
                    <span className="text-[10px] text-slate-400 shrink-0 font-medium ml-2">
                      {lastMsg ? formatTimestamp(lastMsg.createdAt) : formatTimestamp(conn.lastActiveTime)}
                    </span>
                  </div>

                  <p className="text-[10.5px] text-[rgb(29,93,185)] font-semibold flex items-center gap-1 mb-1 truncate">
                    <Home className="w-3 h-3 shrink-0" />
                    <span>{conn.room?.title || "Unknown Room"}</span>
                  </p>

                  <p className={`text-[12px] truncate leading-normal ${hasUnread ? "font-semibold text-slate-800" : "text-slate-400"}`}>
                    {lastMsg ? (
                      <>
                        {lastMsg.senderId !== partner?._id && <span className="text-slate-400/80 mr-0.5">You: </span>}
                        {lastMsg.content}
                      </>
                    ) : (
                      "Connected! Start chatting..."
                    )}
                  </p>
                </div>

                {/* Unread Indicator Badge */}
                {hasUnread && (
                  <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-[rgb(239,62,43)] px-1.5 text-[9.5px] font-bold text-white shadow-sm shadow-red-100 shrink-0 mt-1">
                    {conn.unreadCount}
                  </span>
                )}
              </button>
            );
          })
        )}
      </div>
    </div>
  );
}
