import { getRooms } from "@/server/actions/getRooms";
import RoomCard from "@/components/ui/RoomCard";
import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Find Rooms | Roomy",
  description:
    "Browse available rooms across Sri Lanka. Filter by location, budget, and lifestyle preferences.",
};

// ISR: Revalidate rooms list every 60 seconds
export const revalidate = 60;

export default async function RoomsPage() {
  const result = await getRooms({ page: 1, limit: 20 });

  const rooms = result.success ? result.rooms : [];
  const totalRooms = result.success ? result.pagination.totalRooms : 0;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Page Header */}
      <div className="bg-white border-b border-gray-100 py-10">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold tracking-tight text-gray-900">Find a Room</h1>
          <p className="mt-2 text-gray-600">
            {totalRooms > 0
              ? `${totalRooms} room${totalRooms !== 1 ? "s" : ""} available across Sri Lanka`
              : "Rooms are being added — check back soon!"}
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10">
        {rooms.length === 0 ? (
          <EmptyRooms />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {rooms.map((room: any) => (
              <RoomCard key={room._id} room={room} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function EmptyRooms() {
  return (
    <div className="flex flex-col items-center justify-center py-24 text-center">
      <div className="h-20 w-20 rounded-full bg-indigo-50 flex items-center justify-center mb-6">
        <svg
          className="h-10 w-10 text-indigo-400"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          aria-hidden="true"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M2.25 12l8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25"
          />
        </svg>
      </div>
      <h3 className="text-xl font-semibold text-gray-900 mb-2">No rooms yet</h3>
      <p className="text-gray-500 max-w-sm mb-8">
        Be the first to post a room on Roomy. It only takes a few minutes.
      </p>
      <Link
        href="/login"
        className="rounded-full bg-gray-900 px-6 py-3 text-sm font-semibold text-white hover:bg-gray-800 transition-all"
      >
        Post a Room
      </Link>
    </div>
  );
}
