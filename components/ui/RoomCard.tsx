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

function getAvailabilityColor(occupantsCount: number, capacity: number) {
  const ratio = occupantsCount / capacity;
  if (ratio >= 1) return { pill: "bg-red-100 text-red-700", text: "Full" };
  if (ratio >= 0.75) return { pill: "bg-orange-100 text-orange-700", text: "Almost Full" };
  return { pill: "bg-green-100 text-green-700", text: "Available" };
}

export default function RoomCard({ room }: RoomCardProps) {
  const availability = getAvailabilityColor(room.occupantsCount, room.capacity);
  const spotsLeft = room.capacity - room.occupantsCount;

  return (
    <Link
      href={`/rooms/${room.slug}`}
      className="group flex flex-col bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
    >
      {/* Room Image */}
      <div className="relative h-48 bg-gradient-to-br from-indigo-100 to-purple-100 overflow-hidden">
        {room.images && room.images.length > 0 ? (
          <img
            src={room.images[0]}
            alt={room.title}
            className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center">
            <Bed className="h-14 w-14 text-indigo-300" />
          </div>
        )}
        {/* Availability Badge */}
        <div className="absolute top-3 right-3">
          <span className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold ${availability.pill}`}>
            {availability.text}
          </span>
        </div>
        {/* Gender Preference Badge */}
        {room.genderPreference && room.genderPreference !== "any" && (
          <div className="absolute top-3 left-3">
            <span className="inline-flex items-center rounded-full bg-white/90 backdrop-blur px-2.5 py-1 text-xs font-semibold text-gray-700 capitalize">
              {room.genderPreference} Only
            </span>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="flex flex-col flex-1 p-5 gap-3">
        <h3 className="font-semibold text-gray-900 line-clamp-1 group-hover:text-indigo-600 transition-colors">
          {room.title}
        </h3>

        <div className="flex items-center gap-1.5 text-sm text-gray-500">
          <MapPin className="h-4 w-4 shrink-0 text-gray-400" />
          <span className="line-clamp-1">{room.locationText}</span>
        </div>

        <div className="flex items-center justify-between mt-auto pt-3 border-t border-gray-50">
          <div className="flex items-center gap-1.5">
            <Wallet className="h-4 w-4 text-indigo-500" />
            <span className="font-bold text-gray-900">
              Rs. {room.rentAmount.toLocaleString()}
            </span>
            <span className="text-xs text-gray-500">/mo</span>
          </div>
          <div className="flex items-center gap-1.5 text-sm text-gray-500">
            <Users className="h-4 w-4 text-gray-400" />
            <span>{spotsLeft} spot{spotsLeft !== 1 ? "s" : ""} left</span>
          </div>
        </div>
      </div>
    </Link>
  );
}
