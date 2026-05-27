import { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getRoomBySlug } from "@/server/actions/getRoomBySlug";
import { auth } from "@/lib/auth";
import { MapPin, Users, User, Check, Brush, Map as MapIcon, Bath, Wifi, Droplets, Sun, Moon, Cigarette, Wine, Wind, Flame, Car, Dumbbell, Shirt, CheckCircle, BookOpen, ShieldAlert } from "lucide-react";
import RoomLocationViewerWrapper from "@/components/maps/RoomLocationViewerWrapper";
import { FACILITIES_LIST } from "@/constants/facilities";
import RoomImageGallery from "@/components/rooms/RoomImageGallery";
import RoomActionBottomBar from "@/components/rooms/RoomActionBottomBar";
import UserAvatar from "@/components/shared/UserAvatar";

// Metadata generation for SEO
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const p = await params;
  const data = await getRoomBySlug(p.slug);
  
  if (data.error || !data.room) {
    return { title: "Room Not Found | Roomy" };
  }

  const room = data.room;
  return {
    title: `${room.title} in ${room.locationText} | Roomy`,
    description: room.description.substring(0, 160),
  };
}


export const dynamic = "force-dynamic";

export default async function RoomDetailsPage({ params }: { params: Promise<{ slug: string }> }) {
  const p = await params;
  const data = await getRoomBySlug(p.slug);
  
  if (data.error || !data.room) {
    notFound();
  }

  const room = data.room;
  const session = await auth();
  let ownerIdStr = "";
  if (typeof room.ownerId === "string") ownerIdStr = room.ownerId;
  else if (room.ownerId?._id) ownerIdStr = room.ownerId._id.toString();
  else if (room.ownerId?.toString) ownerIdStr = room.ownerId.toString();

  const isOwner = ownerIdStr === session?.user?.id;

  return (
    <div className="min-h-screen bg-[rgb(243,244,237)] text-slate-900 pb-40">
      
      {/* Decorative gradient blur */}
      <div className="absolute top-0 left-0 w-full h-[500px] bg-gradient-to-b from-white to-transparent pointer-events-none" />

      <div className="relative max-w-[1200px] mx-auto px-6 lg:px-10 pt-28 pb-10 lg:pt-32 lg:pb-12">
        
        {/* Inactive Badge */}
        {!room.isActive && (
          <div className="bg-amber-100 border border-amber-200 px-4 py-3 rounded-2xl mb-8 flex items-center justify-center gap-2 text-amber-800 font-semibold text-sm">
            <ShieldAlert className="w-4 h-4" />
            This listing is currently deactivated and hidden from discovery.
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-start">
          
          {/* =========================================
              LEFT COLUMN: ROOM INFORMATION 
          ========================================= */}
          <div className="order-2 lg:order-1 space-y-10">
          
          {/* Header Section */}
          <div className="space-y-4">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[rgb(34,142,222)]/10 border border-[rgb(34,142,222)]/20 text-[rgb(29,93,185)] text-[11px] font-bold uppercase tracking-wider">
              <MapPin className="w-3 h-3" /> {room.locationText}
            </div>
            
            <h1 className="font-serif text-4xl md:text-5xl tracking-[-0.02em] leading-tight text-zinc-900">
              {room.title}
            </h1>
            
            <div className="flex flex-col gap-2">
              <div className="flex items-end gap-2.5">
                <span className="text-3xl font-bold tracking-tight text-[rgb(29,93,185)]">
                  Rs. {room.rentAmount.toLocaleString()}
                </span>
                <span className="text-slate-500 font-medium mb-1 text-sm">/ month</span>
              </div>
              
              <div className="flex items-center gap-4 mt-1">
                {room.deposit > 0 && (
                  <div className="flex items-center gap-1.5 text-sm font-medium text-slate-600 bg-slate-100/80 px-2.5 py-1 rounded-lg border border-slate-200/60">
                    <span className="text-slate-400 font-normal">Deposit</span> Rs. {room.deposit.toLocaleString()}
                  </div>
                )}
                <div className="flex items-center gap-1.5 text-sm font-semibold text-[rgb(29,93,185)] bg-[rgb(34,142,222)]/10 border border-[rgb(34,142,222)]/20 px-2.5 py-1 rounded-lg">
                  <CheckCircle className="w-3.5 h-3.5" /> Available Now
                </div>
              </div>
            </div>
          </div>

          {/* Lifestyle / Rules Chips */}
          <div className="flex flex-wrap gap-2.5">
            {/* Capacity */}
            <div className="group relative flex items-center gap-2 px-3.5 py-2 rounded-xl bg-white border border-slate-200 text-sm font-semibold text-slate-700 shadow-sm cursor-help">
              <Users className="w-3.5 h-3.5 text-[rgb(29,93,185)]" />
              {(room.currentOccupants || 0) + room.occupantsCount} / {room.capacity} Filled
              <div className="absolute -top-8 left-1/2 -translate-x-1/2 px-2.5 py-1 bg-slate-800 text-white text-[10px] rounded-md opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-10">
                Capacity
              </div>
            </div>

            {/* Gender Preference */}
            <div className="group relative flex items-center gap-2 px-3.5 py-2 rounded-xl bg-white border border-slate-200 text-sm font-semibold text-slate-700 capitalize shadow-sm cursor-help">
              <User className="w-3.5 h-3.5 text-[rgb(248,150,60)]" />
              {room.genderPreference}
              <div className="absolute -top-8 left-1/2 -translate-x-1/2 px-2.5 py-1 bg-slate-800 text-white text-[10px] rounded-md opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-10">
                Gender Preference
              </div>
            </div>

            {/* Occupation Preference */}
            <div className="group relative flex items-center gap-2 px-3.5 py-2 rounded-xl bg-white border border-slate-200 text-sm font-semibold text-slate-700 capitalize shadow-sm cursor-help">
              <BookOpen className="w-3.5 h-3.5 text-[rgb(34,142,222)]" />
              {room.occupationPreference || "Any Occupation"}
              <div className="absolute -top-8 left-1/2 -translate-x-1/2 px-2.5 py-1 bg-slate-800 text-white text-[10px] rounded-md opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-10">
                Occupation Rule
              </div>
            </div>

            {/* Cleanliness */}
            <div className="group relative flex items-center gap-2 px-3.5 py-2 rounded-xl bg-white border border-slate-200 text-sm font-semibold text-slate-700 capitalize shadow-sm cursor-help">
              <Brush className="w-3.5 h-3.5 text-[rgb(46,219,244)]" />
              {room.cleanlinessExpectation}
              <div className="absolute -top-8 left-1/2 -translate-x-1/2 px-2.5 py-1 bg-slate-800 text-white text-[10px] rounded-md opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-10">
                Cleanliness
              </div>
            </div>

            {/* Guest Policy */}
            <div className="group relative flex items-center gap-2 px-3.5 py-2 rounded-xl bg-white border border-slate-200 text-sm font-semibold text-slate-700 capitalize shadow-sm cursor-help">
              <Users className="w-3.5 h-3.5 text-indigo-500" />
              {room.guestPolicy === "no" ? "No Guests" : `${room.guestPolicy} Guests`}
              <div className="absolute -top-8 left-1/2 -translate-x-1/2 px-2.5 py-1 bg-slate-800 text-white text-[10px] rounded-md opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-10">
                Guest Policy
              </div>
            </div>

            {/* Smoking Policy */}
            <div className={`group relative flex items-center gap-2 px-3.5 py-2 rounded-xl border text-sm font-semibold shadow-sm cursor-help ${room.smokerAllowed ? 'bg-emerald-50 border-emerald-100 text-emerald-700' : 'bg-red-50 border-red-100 text-red-700'}`}>
              <Cigarette className="w-3.5 h-3.5" /> 
              {room.smokerAllowed ? "Allowed" : "Not Allowed"}
              <div className="absolute -top-8 left-1/2 -translate-x-1/2 px-2.5 py-1 bg-slate-800 text-white text-[10px] rounded-md opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-10">
                Smoking Policy
              </div>
            </div>

            {/* Drinking Policy */}
            <div className={`group relative flex items-center gap-2 px-3.5 py-2 rounded-xl border text-sm font-semibold shadow-sm cursor-help ${room.drinkerAllowed ? 'bg-emerald-50 border-emerald-100 text-emerald-700' : 'bg-red-50 border-red-100 text-red-700'}`}>
              <Wine className="w-3.5 h-3.5" /> 
              {room.drinkerAllowed ? "Allowed" : "Not Allowed"}
              <div className="absolute -top-8 left-1/2 -translate-x-1/2 px-2.5 py-1 bg-slate-800 text-white text-[10px] rounded-md opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-10">
                Drinking Policy
              </div>
            </div>
          </div>

          {/* Description Section */}
          <div className="prose prose-slate prose-base max-w-none prose-p:leading-relaxed prose-p:text-slate-600 prose-strong:text-slate-800">
            <p className="whitespace-pre-wrap">{room.description}</p>
          </div>

          {/* Owner Profile Card */}
          <Link href={`/people/${ownerIdStr}`} className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm flex items-center gap-4 hover:shadow-md transition-shadow group">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[rgb(46,219,244)] to-[rgb(29,93,185)] p-[2px] group-hover:scale-105 transition-transform duration-300">
              <div className="w-full h-full rounded-[14px] bg-white overflow-hidden flex items-center justify-center">
                <UserAvatar
                  src={room.ownerId?.profilePicture}
                  alt="Owner"
                  className="w-full h-full rounded-[14px]"
                />
              </div>
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-0.5">
                <h3 className="font-bold text-lg text-slate-900 group-hover:text-[rgb(29,93,185)] transition-colors">{room.ownerId?.fullName || "Verified Owner"}</h3>
                <Check className="w-3.5 h-3.5 text-emerald-500 bg-emerald-50 rounded-full p-0.5" />
              </div>
              <p className="text-xs font-medium text-slate-500 capitalize">{room.ownerId?.roleType || "Member"} • Joined recently</p>
            </div>
          </Link>

          {/* Facilities Section */}
          {room.providedFacilities && room.providedFacilities.length > 0 && (
            <div className="space-y-4">
              <h3 className="font-serif text-2xl tracking-tight text-slate-900">Facilities</h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                {room.providedFacilities.map((facilityId: string) => {
                  const item = FACILITIES_LIST.find(f => f.id === facilityId);
                  if (!item) return null;
                  const Icon = item.icon;
                  return (
                    <div
                      key={facilityId}
                      className="flex items-center gap-3 p-4 bg-white border border-slate-100 rounded-2xl shadow-sm hover:border-[rgb(34,142,222)]/25 transition-all duration-300"
                    >
                      <div className="w-9 h-9 rounded-xl bg-slate-50 flex items-center justify-center text-[rgb(29,93,185)] shrink-0">
                        <Icon className="w-5 h-5" />
                      </div>
                      <span className="text-sm font-semibold text-slate-700">{item.label}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Location Map Section */}
          {room.coordinates?.lat && room.coordinates?.lng && (
            <div className="space-y-4">
              <h3 className="font-serif text-2xl tracking-tight text-slate-900">Neighborhood</h3>
              <div className="rounded-2xl overflow-hidden border border-slate-200 shadow-sm h-[240px]">
                <RoomLocationViewerWrapper coordinates={room.coordinates} />
              </div>
            </div>
          )}

        </div>


        {/* =========================================
            RIGHT COLUMN: IMMERSIVE VISUALS
        ========================================= */}
        <div className="order-1 lg:order-2 lg:sticky lg:top-24">
          <RoomImageGallery images={room.images || []} title={room.title} />
          </div>
      </div>

      </div>

      {/* =========================================
          BOTTOM ACTION BAR
      ========================================= */}
      <RoomActionBottomBar roomSlug={room.slug} isOwner={isOwner} isActive={room.isActive} />

    </div>
  );
}
