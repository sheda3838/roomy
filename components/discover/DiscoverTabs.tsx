"use client";

import Link from "next/link";
import { useSearchParams, usePathname } from "next/navigation";
import { Home, Users } from "lucide-react";

export default function DiscoverTabs() {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  
  const currentTab = searchParams.get("tab") || "rooms";

  const createTabUrl = (tab: "rooms" | "people") => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("tab", tab);
    return `${pathname}?${params.toString()}`;
  };

  return (
    <div className="flex p-1 bg-white border border-slate-200 rounded-full w-full max-w-xs mx-auto mb-8 relative shadow-sm">
      <Link
        href={createTabUrl("rooms")}
        className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-full text-sm font-semibold transition-all relative z-10 ${
          currentTab === "rooms"
            ? "text-white"
            : "text-slate-500 hover:text-slate-800"
        }`}
        shallow
      >
        <Home className="w-4 h-4" /> Rooms
      </Link>
      <Link
        href={createTabUrl("people")}
        className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-full text-sm font-semibold transition-all relative z-10 ${
          currentTab === "people"
            ? "text-white"
            : "text-slate-500 hover:text-slate-800"
        }`}
        shallow
      >
        <Users className="w-4 h-4" /> People
      </Link>
      
      {/* Animated brand gradient pill */}
      <div 
        className="absolute top-1 bottom-1 w-[calc(50%-4px)] rounded-full transition-transform duration-300 ease-in-out shadow-md"
        style={{
          background: "linear-gradient(135deg, rgb(46,219,244), rgb(34,142,222), rgb(29,93,185))",
          transform: currentTab === "people" ? "translateX(calc(100% + 4px))" : "translateX(0)",
        }}
      />
    </div>
  );
}
