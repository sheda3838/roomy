import Link from "next/link";
import { MapPin, Users, Wallet, Bed } from "lucide-react";

interface RoomCardProps {
  room: {
    _id: string;
    title: string;
    slug: string;
    locationText: string;
    rentAmount: number;
    images?: string[];
    capacity: number;
    occupantsCount: number;
    cleanlinessExpectation?: string;
    genderPreference?: string;
    isActive: boolean;
    createdAt: string;
  };
}

function getAvailabilityStyle(occupantsCount: number, capacity: number) {
  const ratio = occupantsCount / capacity;
  if (ratio >= 1) return { pill: "bg-red-50 text-red-600 border border-red-100", text: "Full" };
  if (ratio >= 0.75) return { pill: "bg-[rgb(250,192,140)]/20 text-[rgb(239,62,43)] border border-[rgb(246,137,83)]/30", text: "Almost Full" };
  return { pill: "bg-[rgb(46,219,244)]/10 text-[rgb(29,93,185)] border border-[rgb(46,219,244)]/25", text: "Available" };
}

export default function RoomCard({ room }: RoomCardProps) {
  const availability = getAvailabilityStyle(room.occupantsCount, room.capacity);
  const spotsLeft = room.capacity - room.occupantsCount;

  return (
    <Link
      href={`/rooms/${room.slug}`}
      className="group flex flex-col bg-white rounded-2xl overflow-hidden border border-slate-100 shadow-sm hover:shadow-xl hover:shadow-[rgb(34,142,222)]/8 transition-all duration-300 hover:-translate-y-1"
    >
      {/* Room Image */}
      <div className="relative h-48 bg-gradient-to-br from-[rgb(46,219,244)]/10 to-[rgb(29,93,185)]/15 overflow-hidden">
        {room.images && room.images.length > 0 ? (
          <img
            src={room.images[0]}
            alt={room.title}
            className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center">
            <Bed className="h-14 w-14 text-[rgb(34,142,222)]/30" />
          </div>
        )}
        {/* Availability Badge */}
        <div className="absolute top-3 right-3">
          <span className={`inline-flex items-center rounded-full px-2.5 py-1 text-[11px] font-bold backdrop-blur-sm ${availability.pill}`}>
            {availability.text}
          </span>
        </div>
        {/* Gender Preference Badge */}
        {room.genderPreference && room.genderPreference !== "any" && (
          <div className="absolute top-3 left-3">
            <span className="inline-flex items-center rounded-full bg-white/90 backdrop-blur-sm px-2.5 py-1 text-[11px] font-semibold text-slate-700 capitalize shadow-sm">
              {room.genderPreference} Only
            </span>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="flex flex-col flex-1 p-5 gap-3">
        <h3 className="font-semibold text-slate-900 line-clamp-1 group-hover:text-[rgb(34,142,222)] transition-colors">
          {room.title}
        </h3>

        <div className="flex items-center gap-1.5 text-sm text-slate-500">
          <MapPin className="h-4 w-4 shrink-0 text-[rgb(34,142,222)]/60" />
          <span className="line-clamp-1">{room.locationText}</span>
        </div>

        <div className="flex items-center justify-between mt-auto pt-3 border-t border-slate-50">
          <div className="flex items-center gap-1.5">
            <Wallet className="h-4 w-4 text-[rgb(34,142,222)]" />
            <span className="font-bold text-slate-900">
              Rs. {room.rentAmount.toLocaleString()}
            </span>
            <span className="text-xs text-slate-400">/mo</span>
          </div>
          <div className="flex items-center gap-1.5 text-sm text-slate-500">
            <Users className="h-4 w-4 text-slate-400" />
            <span>{spotsLeft} spot{spotsLeft !== 1 ? "s" : ""} left</span>
          </div>
        </div>
      </div>
    </Link>
  );
}
