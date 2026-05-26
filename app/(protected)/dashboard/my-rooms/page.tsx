import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { getRooms } from "@/server/actions/getRooms";
import RoomCard from "@/components/ui/RoomCard";
import Link from "next/link";
import { Building, Plus, ArrowLeft } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "My Rooms | Roomy",
};

export const dynamic = "force-dynamic";

export default async function MyRoomsPage() {
  const session = await auth();

  if (!session?.user?.id) {
    redirect("/login");
  }

  const result = await getRooms({
    page: 1,
    limit: 100, // Fetch up to 100 of their rooms
    ownerId: session.user.id,
  });

  const rooms = result.success ? result.rooms : [];

  return (
    <div className="min-h-screen bg-[#f7f9ff] text-slate-900 pb-20">
      {/* Background glow */}
      <div className="fixed top-0 left-0 w-full h-full pointer-events-none overflow-hidden">
        <div className="absolute top-0 -left-32 w-[500px] h-[500px] bg-emerald-400 rounded-full opacity-[0.04] blur-[100px]" />
      </div>

      <div className="max-w-6xl mx-auto px-4 pt-28 relative z-10">
        
        <div className="mb-8">
          <Link 
            href="/dashboard" 
            className="inline-flex items-center gap-1.5 text-sm font-medium text-slate-500 hover:text-emerald-600 transition-colors mb-4"
          >
            <ArrowLeft className="w-4 h-4" /> Back to Dashboard
          </Link>
          
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div>
              <h1 className="text-3xl md:text-4xl font-serif font-bold tracking-tight text-slate-900 flex items-center gap-3">
                <Building className="w-8 h-8 text-emerald-500" />
                My Rooms
              </h1>
              <p className="text-slate-500 mt-2">
                Manage the rooms you have posted on Roomy.
              </p>
            </div>
            
            <Link
              href="/create-room"
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-emerald-500 text-white font-bold rounded-xl shadow-md hover:bg-emerald-600 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-emerald-500/20 transition-all whitespace-nowrap"
            >
              <Plus className="w-5 h-5" /> Post New Room
            </Link>
          </div>
        </div>

        {rooms.length === 0 ? (
          <div className="bg-white border border-slate-100 rounded-3xl p-12 text-center shadow-sm max-w-2xl mx-auto mt-12">
            <div className="w-20 h-20 bg-emerald-50 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <Building className="w-10 h-10 text-emerald-400" />
            </div>
            <h2 className="text-2xl font-bold text-slate-900 mb-3">You haven't posted any rooms yet</h2>
            <p className="text-slate-500 mb-8 max-w-md mx-auto">
              Ready to find the perfect flatmate? Post your room and start matching with compatible people based on your lifestyle preferences.
            </p>
            <Link
              href="/create-room"
              className="inline-flex items-center gap-2 px-6 py-3 bg-emerald-500 text-white font-bold rounded-xl shadow-md hover:bg-emerald-600 hover:-translate-y-0.5 transition-all"
            >
              <Plus className="w-5 h-5" /> Post Your First Room
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {rooms.map((room: any) => (
              <div key={room._id} className="relative group">
                <RoomCard room={room} />
                
                {/* Optional Status Badge overlay since we bypass isActive:true */}
                {!room.isActive && (
                  <div className="absolute top-4 left-4 z-20 px-3 py-1 bg-red-500/90 backdrop-blur-md text-white text-xs font-bold rounded-full shadow-sm">
                    Inactive
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

      </div>
    </div>
  );
}
