"use client";

import dynamic from "next/dynamic";
import { Loader2 } from "lucide-react";

const RoomLocationViewer = dynamic(
  () => import("./RoomLocationViewer"),
  { 
    ssr: false, 
    loading: () => (
      <div className="w-full h-[250px] md:h-[350px] bg-zinc-900 rounded-xl border border-zinc-800 flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-indigo-500 animate-spin" />
      </div>
    ) 
  }
);

interface RoomLocationViewerWrapperProps {
  coordinates: { lat: number; lng: number };
}

export default function RoomLocationViewerWrapper({ coordinates }: RoomLocationViewerWrapperProps) {
  return <RoomLocationViewer coordinates={coordinates} />;
}
