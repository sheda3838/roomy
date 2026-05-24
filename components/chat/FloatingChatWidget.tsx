"use client";

import React, { useEffect, Suspense } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import { useSession } from "next-auth/react";
import { MessageSquare, X } from "lucide-react";
import { useFloatingChat } from "./FloatingChatProvider";
import ChatPanel from "./ChatPanel";

function FloatingChatInnerWidget() {
  const { data: session } = useSession();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const {
    isOpen,
    setIsOpen,
    unreadTotal,
    openChat,
    setActiveConnectionId,
  } = useFloatingChat();

  // Hide the floating widget on authentication pages
  const isAuthPage =
    pathname?.startsWith("/login") ||
    pathname?.startsWith("/register") ||
    pathname?.startsWith("/verify-email");

  // Read URL query parameters to handle redirects from standalone pages
  useEffect(() => {
    if (!session?.user?.id) return;
    
    const openChatId = searchParams.get("openChat");
    if (openChatId) {
      if (openChatId === "all") {
        setIsOpen(true);
        setActiveConnectionId(null);
      } else {
        openChat(openChatId);
      }
      
      // Silently clean up the query parameter from URL address bar
      const cleanUrl = window.location.pathname + window.location.hash;
      window.history.replaceState(null, "", cleanUrl);
    }
  }, [searchParams, session, openChat, setActiveConnectionId, setIsOpen]);

  // Don't render anything if unauthenticated or on an auth page
  if (!session?.user?.id || isAuthPage) {
    return null;
  }

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-4 pointer-events-none">
      {/* Messaging Panel */}
      {isOpen && (
        <div
          className="w-[92vw] sm:w-[380px] h-[78vh] sm:h-[520px] max-h-[80vh] pointer-events-auto transition-all duration-300 ease-out transform translate-y-0 opacity-100 origin-bottom-right shadow-2xl hover:shadow-[rgb(34,142,222)]/10"
        >
          <ChatPanel onClosePanel={() => setIsOpen(false)} />
        </div>
      )}

      {/* Floating Chat Bubble Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="pointer-events-auto w-14 h-14 rounded-full flex items-center justify-center text-white shadow-xl shadow-indigo-100 hover:scale-105 active:scale-95 transition-all duration-300 relative cursor-pointer roomy-gradient group"
      >
        {/* Soft Orange Glow Behind Button */}
        <div className="absolute inset-0 bg-[rgb(248,150,60)]/25 blur-md rounded-full -z-10 opacity-70 group-hover:scale-125 transition-transform duration-300" />

        {isOpen ? (
          <X className="w-6 h-6 transition-transform duration-300 rotate-90" />
        ) : (
          <MessageSquare className="w-6 h-6 transition-transform duration-300 hover:rotate-6" />
        )}

        {/* Unread Message Badge */}
        {unreadTotal > 0 && (
          <span className="absolute -top-1.5 -right-1.5 flex h-5.5 min-w-5.5 items-center justify-center rounded-full bg-[rgb(239,62,43)] px-1.5 text-[9px] font-bold text-white shadow-md border-2 border-white animate-bounce">
            {unreadTotal}
          </span>
        )}
      </button>
    </div>
  );
}

export default function FloatingChatWidget() {
  return (
    <Suspense fallback={null}>
      <FloatingChatInnerWidget />
    </Suspense>
  );
}
