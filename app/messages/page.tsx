import { Metadata } from "next";
import { redirect } from "next/navigation";
import Link from "next/link";
import { MessageSquare, ArrowRight, User as UserIcon, Home } from "lucide-react";
import { auth } from "@/lib/auth";
import { getConnections } from "@/server/actions/getConnections";

export const metadata: Metadata = {
  title: "Messages | Roomy",
  description: "View your active roommate connections and messages.",
};

export const revalidate = 0;

export default async function MessagesPage() {
  const session = await auth();
  if (!session?.user) {
    redirect("/login");
  }

  const { connections, error } = await getConnections();

  if (error) {
    return (
      <div className="min-h-screen bg-zinc-950 text-white flex items-center justify-center p-4">
        <div className="text-center bg-red-950/20 border border-red-900/50 p-6 rounded-2xl max-w-md w-full">
          <p className="text-red-400 font-medium">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 py-10 px-4">
      <div className="max-w-4xl mx-auto">
        <header className="mb-10">
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">Messages & Connections</h1>
          <p className="text-zinc-400">Manage your active roommate connections and chats.</p>
        </header>

        {(!connections || connections.length === 0) ? (
          <div className="text-center py-24 border border-dashed border-zinc-800 rounded-3xl bg-zinc-900/30">
            <div className="w-20 h-20 bg-zinc-900 rounded-full flex items-center justify-center mx-auto mb-6">
              <MessageSquare className="w-10 h-10 text-zinc-600" />
            </div>
            <h2 className="text-xl font-bold text-white mb-2">No connections yet</h2>
            <p className="text-zinc-500 max-w-md mx-auto mb-8 leading-relaxed">
              When a room owner accepts your request to join, or when you accept someone's request to join your room, they will appear here.
            </p>
            <Link 
              href="/rooms"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-indigo-600 hover:bg-indigo-500 text-white font-bold transition-all"
            >
              Explore Rooms <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {connections.map((conn: any) => (
              <div 
                key={conn._id}
                className="group relative flex flex-col p-5 rounded-2xl bg-zinc-900 border border-zinc-800 hover:border-indigo-500/50 hover:shadow-lg hover:shadow-indigo-900/10 transition-all overflow-hidden"
              >
                {/* Background Room Hint (Optional styling) */}
                {conn.room?.image && (
                  <div className="absolute top-0 right-0 w-32 h-32 opacity-10 pointer-events-none">
                    <img src={conn.room.image} alt="" className="w-full h-full object-cover rounded-bl-full" />
                  </div>
                )}

                <div className="flex items-center gap-4 mb-4 relative z-10">
                  <div className="w-14 h-14 rounded-full bg-zinc-800 border border-zinc-700 overflow-hidden flex items-center justify-center shrink-0">
                    {conn.partner?.profilePicture ? (
                      <img src={conn.partner.profilePicture} alt={conn.partner.fullName} className="w-full h-full object-cover" />
                    ) : (
                      <UserIcon className="w-6 h-6 text-zinc-500" />
                    )}
                  </div>
                  <div>
                    <h3 className="font-bold text-lg text-white group-hover:text-indigo-400 transition-colors">
                      {conn.partner?.fullName || "Roommate"}
                    </h3>
                    {conn.partner?.roleType && (
                      <p className="text-sm text-zinc-500 capitalize">{conn.partner.roleType}</p>
                    )}
                  </div>
                </div>

                <div className="mt-auto space-y-4 relative z-10">
                  <div className="flex items-center gap-2 text-sm text-zinc-400 bg-zinc-950/50 w-fit px-3 py-1.5 rounded-lg border border-zinc-800/50">
                    <Home className="w-4 h-4 text-indigo-400" />
                    <span className="truncate max-w-[200px]">{conn.room?.title || "Unknown Room"}</span>
                  </div>

                  <Link
                    href={`/chat/${conn._id}`}
                    className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-indigo-600/10 text-indigo-400 font-bold border border-indigo-600/20 group-hover:bg-indigo-600 group-hover:text-white transition-all"
                  >
                    Open Chat <MessageSquare className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
