import { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { getRoomBySlug } from "@/server/actions/getRoomBySlug";
import { auth } from "@/lib/auth";
import { MapPin, Users, User, Info, Check, Shield, ChevronRight, Zap } from "lucide-react";
import RoomLocationViewerWrapper from "@/components/maps/RoomLocationViewerWrapper";
import { Map as MapIcon } from "lucide-react";

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

export const revalidate = 60; // ISR 60 seconds

export default async function RoomDetailsPage({ params }: { params: Promise<{ slug: string }> }) {
  const p = await params;
  const data = await getRoomBySlug(p.slug);
  
  if (data.error || !data.room) {
    notFound();
  }

  const room = data.room;
  const session = await auth();
  const isLoggedIn = !!session?.user;
  let ownerIdStr = "";
  if (typeof room.ownerId === "string") ownerIdStr = room.ownerId;
  else if (room.ownerId?._id) ownerIdStr = room.ownerId._id.toString();
  else if (room.ownerId?.toString) ownerIdStr = room.ownerId.toString();

  const isOwner = ownerIdStr === session?.user?.id;

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100">
      {/* 1. Image Gallery */}
      <div className="w-full h-[40vh] md:h-[60vh] bg-zinc-900 relative overflow-hidden">
        {room.images && room.images.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-1 w-full h-full">
            <img 
              src={room.images[0]} 
              alt={room.title} 
              className="w-full h-full object-cover" 
            />
            <div className="hidden md:grid grid-cols-2 grid-rows-2 gap-1 h-full">
              {room.images.slice(1, 5).map((img: string, i: number) => (
                <img 
                  key={i} 
                  src={img} 
                  alt="Room angle" 
                  className="w-full h-full object-cover" 
                />
              ))}
              {/* Fallback empty slots for gallery grid layout */}
              {Array.from({ length: Math.max(0, 4 - (room.images.length - 1)) }).map((_, i) => (
                <div key={`empty-${i}`} className="w-full h-full bg-zinc-800/50" />
              ))}
            </div>
          </div>
        ) : (
          <div className="flex items-center justify-center w-full h-full bg-zinc-900 border-b border-zinc-800">
            <div className="text-center text-zinc-500">
              <MapPin className="w-12 h-12 mx-auto mb-2 opacity-50" />
              <p>No images provided</p>
            </div>
          </div>
        )}
      </div>

      <div className="max-w-7xl mx-auto px-4 py-10 md:py-16 grid grid-cols-1 lg:grid-cols-3 gap-10">
        
        {/* Left Column: Room Details */}
        <div className="lg:col-span-2 space-y-10">
          <div>
            <div className="flex items-center gap-2 text-indigo-400 font-semibold mb-3">
              <MapPin className="w-5 h-5" /> {room.locationText}
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-white mb-4">
              {room.title}
            </h1>
            <p className="text-zinc-300 whitespace-pre-wrap leading-relaxed text-lg">
              {room.description}
            </p>
          </div>

          <div className="h-px w-full bg-zinc-800" />

          {/* Room Specs & Rules */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="space-y-1">
              <span className="text-zinc-500 text-sm font-semibold uppercase tracking-wider">Capacity</span>
              <p className="text-white font-medium flex items-center gap-2">
                <Users className="w-4 h-4 text-zinc-400" /> {room.capacity} Person(s)
              </p>
            </div>
            <div className="space-y-1">
              <span className="text-zinc-500 text-sm font-semibold uppercase tracking-wider">Gender Pref</span>
              <p className="text-white font-medium flex items-center gap-2 capitalize">
                <User className="w-4 h-4 text-zinc-400" /> {room.genderPreference}
              </p>
            </div>
            <div className="space-y-1">
              <span className="text-zinc-500 text-sm font-semibold uppercase tracking-wider">Cleanliness</span>
              <p className="text-white font-medium capitalize">
                {room.cleanlinessExpectation}
              </p>
            </div>
            <div className="space-y-1">
              <span className="text-zinc-500 text-sm font-semibold uppercase tracking-wider">Guests</span>
              <p className="text-white font-medium capitalize">
                {room.guestPolicy}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 rounded-xl border border-zinc-800 bg-zinc-900/50 flex items-center gap-3">
              <Check className={`w-5 h-5 ${room.smokerAllowed ? "text-emerald-400" : "text-zinc-600"}`} />
              <span className={room.smokerAllowed ? "text-zinc-200" : "text-zinc-500 line-through"}>Smoking Allowed</span>
            </div>
            <div className="p-4 rounded-xl border border-zinc-800 bg-zinc-900/50 flex items-center gap-3">
              <Check className={`w-5 h-5 ${room.drinkerAllowed ? "text-emerald-400" : "text-zinc-600"}`} />
              <span className={room.drinkerAllowed ? "text-zinc-200" : "text-zinc-500 line-through"}>Drinking Allowed</span>
            </div>
          </div>

          <div className="h-px w-full bg-zinc-800" />

          {/* Location Map Section */}
          {room.coordinates?.lat && room.coordinates?.lng && (
            <div className="space-y-4">
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                <MapIcon className="w-5 h-5 text-indigo-400" /> Location map
              </h2>
              <RoomLocationViewerWrapper coordinates={room.coordinates} />
            </div>
          )}

          <div className="h-px w-full bg-zinc-800" />

          {/* Owner Profile Snippet */}
          <div>
            <h2 className="text-xl font-bold text-white mb-6">Listed by</h2>
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-full bg-indigo-900/50 border border-indigo-500/30 flex items-center justify-center overflow-hidden">
                {room.ownerId?.profilePicture ? (
                  <img src={room.ownerId.profilePicture} alt="Owner" className="w-full h-full object-cover" />
                ) : (
                  <User className="w-8 h-8 text-indigo-400" />
                )}
              </div>
              <div>
                <h3 className="font-bold text-lg text-white">{room.ownerId?.fullName || "Verified Owner"}</h3>
                <p className="text-zinc-400 capitalize">{room.ownerId?.roleType || "Member"} • ID Verified</p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Floating Action Card */}
        <div className="lg:col-span-1">
          <div className="sticky top-24 p-6 rounded-2xl bg-zinc-900 border border-zinc-800 shadow-2xl space-y-6">
            
            <div>
              <p className="text-zinc-400 font-medium">Monthly Rent</p>
              <div className="text-3xl font-bold text-white mt-1">Rs. {room.rentAmount.toLocaleString()}</div>
              {room.deposit > 0 && (
                <p className="text-sm text-zinc-500 mt-2">Deposit: Rs. {room.deposit.toLocaleString()}</p>
              )}
            </div>

            {isOwner && (
              <Link
                href={`/rooms/${room.slug}/requests`}
                className="w-full flex items-center justify-center gap-2 py-4 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold transition-all shadow-lg shadow-indigo-900/20"
              >
                <Users className="w-5 h-5" />
                View Join Requests
              </Link>
            )}

            {/* Signature Compatibility Feature CTA */}
            {!isOwner && (
              <Link
                href={`/rooms/${room.slug}/match`}
                className="group w-full p-4 rounded-xl bg-gradient-to-br from-indigo-600/20 to-purple-600/10 border border-indigo-500/30 hover:border-indigo-400 flex flex-col gap-3 transition-all"
              >
                <div className="flex items-center justify-between text-indigo-300 group-hover:text-indigo-200">
                  <span className="font-bold flex items-center gap-2"><Zap className="w-5 h-5 fill-indigo-400 text-indigo-400" /> Check Compatibility</span>
                  <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </div>
                <p className="text-sm text-zinc-400">
                  See how well your lifestyle and budget aligns with this room and owner. You can request to join after checking your compatibility match.
                </p>
              </Link>
            )}

            <div className="h-px w-full bg-zinc-800" />

            <p className="text-xs text-center text-zinc-500 flex items-center justify-center gap-1.5">
              <Shield className="w-4 h-4" /> Secure application process
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
