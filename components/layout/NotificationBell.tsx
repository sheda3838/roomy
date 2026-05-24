"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Bell, BellRing, Check, CheckCheck, MessageCircle, Home, Sparkles, X } from "lucide-react";
import { getNotifications } from "@/server/actions/getNotifications";
import { markAsRead, markAllAsRead } from "@/server/actions/markAsRead";
import { getPusherClient } from "@/lib/pusher";
import { timeAgo } from "@/lib/timeAgo";



interface Notification {
  _id: string;
  type: string;
  title: string;
  message: string;
  link?: string;
  isRead: boolean;
  createdAt: string;
}

function NotifIcon({ type }: { type: string }) {
  const base = "w-4 h-4";
  if (type === "message_received") return <MessageCircle className={`${base} text-[rgb(34,142,222)]`} />;
  if (type === "request_received") return <Home className={`${base} text-[rgb(246,137,83)]`} />;
  if (type === "request_accepted") return <Check className={`${base} text-emerald-500`} />;
  if (type === "request_rejected") return <X className={`${base} text-red-400`} />;
  if (type === "match_found") return <Sparkles className={`${base} text-[rgb(46,219,244)]`} />;
  return <Bell className={`${base} text-slate-400`} />;
}

function NotifIconBg({ type }: { type: string }) {
  if (type === "message_received") return "bg-[rgb(34,142,222)]/10";
  if (type === "request_received") return "bg-[rgb(246,137,83)]/10";
  if (type === "request_accepted") return "bg-emerald-50";
  if (type === "request_rejected") return "bg-red-50";
  if (type === "match_found") return "bg-[rgb(46,219,244)]/10";
  return "bg-slate-100";
}

export default function NotificationBell() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);


  // ── Fetch notifications ─────────────────────────────────────────────────────
  const fetchNotifications = useCallback(async () => {
    if (status !== "authenticated") return;
    setLoading(true);
    const result = await getNotifications({ page: 1 });
    if (result.success) {
      setNotifications(result.notifications.slice(0, 5));
      setUnreadCount(result.unreadCount ?? 0);
    }
    setLoading(false);
  }, [status]);

  useEffect(() => {
    fetchNotifications();
  }, [fetchNotifications]);

  // ── Pusher real-time listener ────────────────────────────────────────────────
  useEffect(() => {
    const userId = session?.user?.id;
    if (status !== "authenticated" || !userId) return;

    let pusherChannel: ReturnType<ReturnType<typeof getPusherClient>["subscribe"]> | null = null;

    try {
      const pusher = getPusherClient();
      const channelName = `private-user-${userId}`;
      pusherChannel = pusher.subscribe(channelName);

      pusherChannel.bind("notification:new", (data: Notification) => {
        setNotifications((prev) => [data, ...prev].slice(0, 5));
        setUnreadCount((c) => c + 1);
      });

      // Log auth errors so they surface during development
      pusherChannel.bind("pusher:subscription_error", (err: unknown) => {
        console.error("[Pusher] Subscription error on", channelName, err);
      });
    } catch (e) {
      console.error("[Pusher] Failed to subscribe:", e);
    }

    return () => {
      if (pusherChannel) {
        pusherChannel.unbind_all();
        pusherChannel.unsubscribe();
      }
    };
  }, [status, session?.user?.id]);


  // ── Close on outside click ───────────────────────────────────────────────────
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  // ── Handle notification click ────────────────────────────────────────────────
  const handleClick = async (notif: Notification) => {
    setOpen(false);
    if (!notif.isRead) {
      await markAsRead(notif._id);
      setNotifications((prev) =>
        prev.map((n) => (n._id === notif._id ? { ...n, isRead: true } : n))
      );
      setUnreadCount((c) => Math.max(0, c - 1));
    }
    if (notif.link) router.push(notif.link);
  };

  const handleMarkAll = async () => {
    await markAllAsRead();
    setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
    setUnreadCount(0);
  };

  if (status !== "authenticated") return null;

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Bell button */}
      <button
        onClick={() => { setOpen((o) => !o); if (!open) fetchNotifications(); }}
        className="relative flex items-center justify-center w-9 h-9 rounded-full hover:bg-slate-100 transition-colors"
        aria-label="Notifications"
      >
        {unreadCount > 0 ? (
          <BellRing className="w-5 h-5 text-[rgb(34,142,222)]" />
        ) : (
          <Bell className="w-5 h-5 text-slate-500" />
        )}
        {unreadCount > 0 && (
          <span className="absolute -top-0.5 -right-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-gradient-to-br from-[rgb(246,137,83)] to-[rgb(239,62,43)] text-[10px] font-bold text-white shadow-sm">
            {unreadCount > 9 ? "9+" : unreadCount}
          </span>
        )}
      </button>

      {/* Dropdown */}
      {open && (
        <div className="absolute right-0 top-12 w-80 bg-white rounded-2xl shadow-2xl shadow-slate-200/80 border border-slate-100 z-50 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3 border-b border-slate-50">
            <span className="font-semibold text-sm text-slate-900">Notifications</span>
            {unreadCount > 0 && (
              <button
                onClick={handleMarkAll}
                className="flex items-center gap-1 text-xs font-semibold text-[rgb(34,142,222)] hover:text-[rgb(29,93,185)] transition-colors"
              >
                <CheckCheck className="w-3.5 h-3.5" /> Mark all read
              </button>
            )}
          </div>

          {/* List */}
          <div className="max-h-80 overflow-y-auto">
            {loading ? (
              <div className="flex items-center justify-center py-10">
                <div className="w-5 h-5 border-2 border-[rgb(34,142,222)] border-t-transparent rounded-full animate-spin" />
              </div>
            ) : notifications.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-10 px-4 text-center">
                <Bell className="w-8 h-8 text-slate-200 mb-2" />
                <p className="text-sm text-slate-400 font-medium">No notifications yet</p>
              </div>
            ) : (
              notifications.map((notif) => (
                <button
                  key={notif._id}
                  onClick={() => handleClick(notif)}
                  className={`w-full flex items-start gap-3 px-4 py-3 text-left hover:bg-slate-50 transition-colors border-b border-slate-50 last:border-b-0 ${
                    !notif.isRead ? "bg-[rgb(34,142,222)]/[0.03]" : ""
                  }`}
                >
                  <div className={`shrink-0 w-8 h-8 rounded-xl flex items-center justify-center mt-0.5 ${NotifIconBg({ type: notif.type })}`}>
                    <NotifIcon type={notif.type} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className={`text-sm font-semibold leading-snug truncate ${!notif.isRead ? "text-slate-900" : "text-slate-600"}`}>
                      {notif.title}
                    </p>
                    <p className="text-xs text-slate-400 mt-0.5 line-clamp-1">{notif.message}</p>
                    <p className="text-[10px] text-slate-300 mt-1">
                      {timeAgo(notif.createdAt)}
                    </p>
                  </div>
                  {!notif.isRead && (
                    <div className="shrink-0 mt-1.5 w-2 h-2 rounded-full bg-[rgb(34,142,222)]" />
                  )}
                </button>
              ))
            )}
          </div>

          {/* Footer */}
          <div className="border-t border-slate-50 px-4 py-2.5">
            <button
              onClick={() => { setOpen(false); router.push("/notifications"); }}
              className="w-full text-center text-xs font-semibold text-[rgb(34,142,222)] hover:text-[rgb(29,93,185)] transition-colors py-0.5"
            >
              View all notifications →
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
