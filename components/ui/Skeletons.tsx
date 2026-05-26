import React from "react";

export function RoomCardSkeleton() {
  return (
    <div className="flex flex-col bg-white rounded-2xl overflow-hidden border border-slate-100 shadow-sm h-full animate-pulse">
      <div className="h-48 bg-slate-200"></div>
      <div className="flex flex-col flex-1 p-5 gap-3">
        <div className="h-5 bg-slate-200 rounded-md w-3/4 mb-2"></div>
        <div className="flex items-center gap-2">
          <div className="h-4 w-4 rounded-full bg-slate-200"></div>
          <div className="h-4 bg-slate-200 rounded-md w-1/2"></div>
        </div>
        <div className="flex items-center justify-between mt-auto pt-3 border-t border-slate-50">
          <div className="h-5 bg-slate-200 rounded-md w-1/3"></div>
          <div className="h-4 bg-slate-200 rounded-md w-1/4"></div>
        </div>
      </div>
    </div>
  );
}

export function RoomsGridSkeleton({ count = 6 }: { count?: number }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
      {Array.from({ length: count }).map((_, i) => (
        <RoomCardSkeleton key={i} />
      ))}
    </div>
  );
}

export function UserCardSkeleton() {
  return (
    <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm animate-pulse flex flex-col items-center">
      <div className="w-24 h-24 rounded-full bg-slate-200 mb-4"></div>
      <div className="h-5 bg-slate-200 rounded-md w-1/2 mb-2"></div>
      <div className="h-4 bg-slate-200 rounded-md w-1/3 mb-6"></div>
      <div className="w-full flex justify-center gap-2 mb-6">
        <div className="h-6 w-16 bg-slate-200 rounded-full"></div>
        <div className="h-6 w-16 bg-slate-200 rounded-full"></div>
      </div>
      <div className="w-full h-10 bg-slate-200 rounded-xl mt-auto"></div>
    </div>
  );
}

export function UsersGridSkeleton({ count = 6 }: { count?: number }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {Array.from({ length: count }).map((_, i) => (
        <UserCardSkeleton key={i} />
      ))}
    </div>
  );
}

export function ProfileSkeleton() {
  return (
    <div className="min-h-screen bg-[#f7f9ff] py-20 px-4">
      <div className="max-w-4xl mx-auto space-y-6 animate-pulse">
        <div className="bg-white rounded-3xl p-8 border border-slate-100 flex items-center gap-6">
          <div className="w-32 h-32 rounded-full bg-slate-200 shrink-0"></div>
          <div className="flex-1">
            <div className="h-8 bg-slate-200 rounded-md w-1/3 mb-4"></div>
            <div className="h-4 bg-slate-200 rounded-md w-1/4 mb-4"></div>
            <div className="flex gap-2">
              <div className="h-8 w-20 bg-slate-200 rounded-full"></div>
              <div className="h-8 w-20 bg-slate-200 rounded-full"></div>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-3xl p-8 border border-slate-100">
          <div className="h-6 bg-slate-200 rounded-md w-1/4 mb-6"></div>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="h-16 bg-slate-200 rounded-xl"></div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export function MessageSkeleton({ align = "left" }: { align?: "left" | "right" }) {
  return (
    <div className={`flex w-full mb-4 ${align === "right" ? "justify-end" : "justify-start"}`}>
      <div className="flex max-w-[70%] gap-3 items-end">
        {align === "left" && <div className="w-8 h-8 rounded-full bg-slate-200 shrink-0"></div>}
        <div className={`p-4 rounded-2xl ${align === "right" ? "bg-[rgb(34,142,222)]/20 rounded-br-none" : "bg-white border border-slate-100 rounded-bl-none"} animate-pulse`}>
          <div className="h-4 bg-slate-200 rounded-md w-32 mb-2"></div>
          <div className="h-4 bg-slate-200 rounded-md w-24"></div>
        </div>
      </div>
    </div>
  );
}

export function ChatMessagesSkeleton() {
  return (
    <div className="p-4 space-y-6">
      <MessageSkeleton align="left" />
      <MessageSkeleton align="right" />
      <MessageSkeleton align="left" />
      <MessageSkeleton align="right" />
    </div>
  );
}
