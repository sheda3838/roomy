import { getRooms } from "@/server/actions/getRooms";
import { auth } from "@/lib/auth";
import RoomCard from "@/components/ui/RoomCard";
import Link from "next/link";
import { Search } from "lucide-react";
import RoomsFilterSidebar from "./RoomsFilterSidebar";

interface RoomsTabContentProps {
  searchParams: { [key: string]: string | string[] | undefined };
}

export default async function RoomsTabContent({ searchParams }: RoomsTabContentProps) {
  const session = await auth();

  // Convert searchParams to filters
  const filters: any = {};
  if (searchParams.city) filters.locationText = searchParams.city;
  if (searchParams.maxPrice) filters.rentMax = Number(searchParams.maxPrice);
  if (searchParams.gender) filters.genderPreference = searchParams.gender;
  if (searchParams.cleanliness) filters.cleanlinessExpectation = searchParams.cleanliness;
  if (searchParams.smokerAllowed === "true") filters.smokerAllowed = true;
  if (searchParams.smokerAllowed === "false") filters.smokerAllowed = false;
  if (searchParams.drinkerAllowed === "true") filters.drinkerAllowed = true;
  if (searchParams.drinkerAllowed === "false") filters.drinkerAllowed = false;
  if (searchParams.guestPolicy) filters.guestPolicy = searchParams.guestPolicy;
  
  const result = await getRooms({ 
    page: 1, 
    limit: 20, 
    filters,
    excludeOwnerId: session?.user?.id 
  });
  const rooms = result.success ? result.rooms : [];

  return (
    <div className="flex flex-col md:flex-row gap-8 items-start">
      <RoomsFilterSidebar />
      
      <div className="flex-1 w-full">
        {rooms.length === 0 ? (
          <div className="text-center py-20 border border-dashed border-slate-200 rounded-3xl bg-slate-50">
            <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4 shadow-sm">
              <Search className="w-8 h-8 text-slate-400" />
            </div>
            <h2 className="text-xl font-bold text-slate-900 mb-2">No rooms found</h2>
            <p className="text-slate-500 max-w-sm mx-auto mb-6">
              We couldn't find any rooms matching your current filters.
            </p>
            <Link 
              href="/discover?tab=rooms" 
              className="px-6 py-2 rounded-full bg-[rgb(34,142,222)] text-white hover:bg-[rgb(29,93,185)] transition-colors inline-block font-semibold shadow-sm"
            >
              Clear Filters
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
            {rooms.map((room: any) => (
              <RoomCard key={room._id} room={room} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
