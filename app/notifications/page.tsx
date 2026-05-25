"use client";

import { useState, useEffect, useCallback } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import {
  Bell, MessageCircle, Home, Check, X, Heart, CheckCheck, Filter
} from "lucide-react";
import { getNotifications } from "@/server/actions/getNotifications";
import { markAsRead, markAllAsRead } from "@/server/actions/markAsRead";
import { timeAgo } from "@/lib/timeAgo";

import { getPusherClient } from "@/lib/pusher";

type FilterTab = "all" | "unread" | "request_received" | "request_accepted" | "request_rejected" | "message_received";

interface Notification {
  _id: string;
  type: string;
  title: string;
  message: string;
  link?: string;
  isRead: boolean;
  createdAt: string;
}

const TABS: { key: FilterTab; label: string }[] = [
  { key: "all", label: "All" },
  { key: "unread", label: "Unread" },
  { key: "request_received", label: "Requests" },
  { key: "message_received", label: "Messages" },
];

function NotifIcon({ type }: { type: string }) {
  if (type === "message_received") return <MessageCircle className="w-5 h-5 text-[rgb(34,142,222)]" />;
  if (type === "request_received") return <Home className="w-5 h-5 text-[rgb(246,137,83)]" />;
  if (type === "request_accepted") return <Check className="w-5 h-5 text-emerald-500" />;
  if (type === "request_rejected") return <X className="w-5 h-5 text-red-400" />;
  if (type === "match_found") return <Heart className="w-5 h-5 text-[rgb(29,93,185)]" />;
  return <Bell className="w-5 h-5 text-slate-400" />;
}

function NotifIconBg({ type }: { type: string }) {
  if (type === "message_received") return "bg-[rgb(34,142,222)]/10";
  if (type === "request_received") return "bg-[rgb(246,137,83)]/10";
  if (type === "request_accepted") return "bg-emerald-50";
  if (type === "request_rejected") return "bg-red-50";
  if (type === "match_found") return "bg-[rgb(46,219,244)]/10";
  return "bg-slate-100";
}

export default function NotificationsPage() {
  const { status } = useSession();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<FilterTab>("all");
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(false);

  const fetch = useCallback(async (tab: FilterTab, pageNum: number) => {
    setLoading(true);
    const filter = tab === "all" ? undefined : tab;
    const result = await getNotifications({ page: pageNum, filter });
    if (result.success) {
      if (pageNum === 1) {
        setNotifications(result.notifications);
      } else {
        setNotifications((prev) => [...prev, ...result.notifications]);
      }
      setUnreadCount(result.unreadCount ?? 0);
      setHasMore(result.hasMore ?? false);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    if (status === "unauthenticated") router.push("/login");
    if (status === "authenticated") {
      setPage(1);
      fetch(activeTab, 1);
    }
  }, [status, activeTab, fetch, router]);

  // Real-time: add new notifications at top
  useEffect(() => {
    if (status !== "authenticated") return;
    try {
      const pusher = getPusherClient();
      const channel = pusher.subscribe("notifications");
      channel.bind("notification:new", (data: Notification) => {
        if (activeTab === "all" || activeTab === "unread" || activeTab === data.type) {
          setNotifications((prev) => [data, ...prev]);
          setUnreadCount((c) => c + 1);
        }
      });
      return () => { channel.unbind_all(); };
    } catch { return; }
  }, [status, activeTab]);

  const handleClick = async (notif: Notification) => {
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

  const loadMore = () => {
    const next = page + 1;
    setPage(next);
    fetch(activeTab, next);
  };

  return (
    <div className="min-h-screen bg-[#f7f9ff]">
      {/* Background glows */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-0 -left-32 w-80 h-80 bg-[rgb(46,219,244)] rounded-full opacity-[0.05] blur-[80px]" />
        <div className="absolute bottom-0 -right-32 w-80 h-80 bg-[rgb(248,150,60)] rounded-full opacity-[0.05] blur-[80px]" />
      </div>

      <div className="relative z-10 max-w-2xl mx-auto px-4 pt-28 pb-10">
        
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold font-serif text-slate-900">Notifications</h1>
            {unreadCount > 0 && (
              <p className="text-sm text-slate-400 mt-0.5">{unreadCount} unread</p>
            )}
          </div>
          {unreadCount > 0 && (
            <button
              onClick={handleMarkAll}
              className="flex items-center gap-1.5 text-sm font-semibold text-[rgb(34,142,222)] hover:text-[rgb(29,93,185)] transition-colors bg-[rgb(34,142,222)]/8 px-3 py-1.5 rounded-full"
            >
              <CheckCheck className="w-4 h-4" /> Mark all read
            </button>
          )}
        </div>

        {/* Filter Tabs */}
        <div className="flex gap-2 mb-6 overflow-x-auto pb-1">
          {TABS.map((tab) => (
            <button
              key={tab.key}
              onClick={() => { setActiveTab(tab.key); setPage(1); }}
              className={`shrink-0 px-4 py-1.5 rounded-full text-sm font-semibold transition-all ${
                activeTab === tab.key
                  ? "text-white shadow-md"
                  : "bg-white text-slate-500 border border-slate-200 hover:border-[rgb(34,142,222)]/40"
              }`}
              style={activeTab === tab.key ? {
                background: "linear-gradient(135deg, rgb(46,219,244), rgb(34,142,222), rgb(29,93,185))"
              } : {}}
            >
              {tab.label}
              {tab.key === "unread" && unreadCount > 0 && (
                <span className="ml-1.5 inline-flex items-center justify-center w-4 h-4 rounded-full bg-white/25 text-[10px] font-bold">
                  {unreadCount}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* Notifications List */}
        <div className="space-y-2">
          {loading && notifications.length === 0 ? (
            <div className="flex items-center justify-center py-20">
              <div className="w-6 h-6 border-2 border-[rgb(34,142,222)] border-t-transparent rounded-full animate-spin" />
            </div>
          ) : notifications.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <div className="w-16 h-16 rounded-2xl bg-slate-100 flex items-center justify-center mb-4">
                <Bell className="w-8 h-8 text-slate-300" />
              </div>
              <p className="text-base font-semibold text-slate-500">No notifications here</p>
              <p className="text-sm text-slate-400 mt-1">You&apos;re all caught up!</p>
            </div>
          ) : (
            notifications.map((notif) => (
              <button
                key={notif._id}
                onClick={() => handleClick(notif)}
                className={`w-full flex items-start gap-4 p-4 rounded-2xl text-left transition-all border hover:shadow-md ${
                  !notif.isRead
                    ? "bg-white border-[rgb(34,142,222)]/20 shadow-sm"
                    : "bg-white border-slate-100"
                }`}
              >
                <div className={`shrink-0 w-10 h-10 rounded-xl flex items-center justify-center ${NotifIconBg({ type: notif.type })}`}>
                  <NotifIcon type={notif.type} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className={`text-sm font-semibold leading-snug ${!notif.isRead ? "text-slate-900" : "text-slate-600"}`}>
                    {notif.title}
                  </p>
                  <p className="text-sm text-slate-400 mt-0.5 line-clamp-2">{notif.message}</p>
                  <p className="text-xs text-slate-300 mt-1.5">
                    {timeAgo(notif.createdAt)}
                  </p>
                </div>
                {!notif.isRead && (
                  <div className="shrink-0 mt-2 w-2.5 h-2.5 rounded-full bg-[rgb(34,142,222)]" />
                )}
              </button>
            ))
          )}
        </div>

        {/* Load more */}
        {hasMore && !loading && (
          <div className="flex justify-center mt-6">
            <button
              onClick={loadMore}
              className="px-6 py-2.5 rounded-full border border-slate-200 text-sm font-semibold text-slate-600 hover:border-[rgb(34,142,222)]/40 hover:text-[rgb(34,142,222)] transition-all bg-white"
            >
              Load more
            </button>
          </div>
        )}
        {loading && notifications.length > 0 && (
          <div className="flex justify-center mt-6">
            <div className="w-5 h-5 border-2 border-[rgb(34,142,222)] border-t-transparent rounded-full animate-spin" />
          </div>
        )}
      </div>
    </div>
  );
}
