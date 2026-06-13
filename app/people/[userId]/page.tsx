import { Metadata } from "next";
import { notFound, redirect } from "next/navigation";
import Link from "next/link";
import { auth } from "@/lib/auth";
import dbConnect from "@/lib/db";
import User from "@/models/User";
import Connection from "@/models/Connection";
import RoommateRequest from "@/models/RoommateRequest";
import {
  ArrowLeft,
  User as UserIcon,
  Briefcase,
  GraduationCap,
  MapPin,
  Brush,
  Moon,
  Sun,
  Cigarette,
  Wine,
  Users,
  DollarSign,
  Heart,
  ShieldCheck,
  CheckCircle2,
  Clock,
  Sparkles
} from "lucide-react";
import UserAvatar from "@/components/shared/UserAvatar";
import { FACILITIES_LIST } from "@/constants/facilities";
import BackButton from "@/components/shared/BackButton";

// Dynamic metadata based on user
export async function generateMetadata({ params }: { params: Promise<{ userId: string }> }): Promise<Metadata> {
  const p = await params;
  await dbConnect();
  const user = await User.findById(p.userId).lean();
  
  if (!user) {
    return { title: "User Details | Roomy" };
  }

  return {
    title: `${user.fullName} | Roomy Profiles`,
    description: `Read about ${user.fullName}'s lifestyle preferences and compatibility on Roomy.`,
  };
}

export default async function UserDetailsPage({ params }: { params: Promise<{ userId: string }> }) {
  const session = await auth();
  if (!session?.user) {
    redirect("/login");
  }

  const p = await params;
  const currentUserId = session.user.id;
  const targetUserId = p.userId;

  // Don't show details page to self (or redirect to dashboard)
  if (currentUserId === targetUserId) {
    redirect("/dashboard");
  }

  await dbConnect();

  // Fetch target user details
  const targetUser = await User.findById(targetUserId).lean();
  if (!targetUser) {
    notFound();
  }

  // Check if they are already connected
  const connection = await Connection.findOne({
    users: { $all: [currentUserId, targetUserId] },
    isActive: true
  }).lean();
  const isConnected = !!connection;

  // Check if there is an active pending request from current user to target
  const pendingRequest = await RoommateRequest.findOne({
    requesterId: currentUserId,
    receiverId: targetUserId,
    status: "pending"
  }).lean();
  const hasPendingRequest = !!pendingRequest;

  // Synthesize custom personal bio/about introduction since schema has no bio field
  const locationStr = targetUser.preferredLocations && targetUser.preferredLocations.length > 0
    ? targetUser.preferredLocations.join(", ")
    : "flexible neighborhoods";

  const cleanlinessWord = targetUser.cleanlinessLevel === "high" ? "high (spotless)" 
    : targetUser.cleanlinessLevel === "medium" ? "moderate" 
    : targetUser.cleanlinessLevel === "low" ? "casual" : "moderate";

  const synthesizedBio = `Hi, I'm ${targetUser.fullName}! I'm looking to connect with potential roommates who share similar values and co-living routines. Currently, I'm focused on finding a place in ${locationStr}. I prefer a ${cleanlinessWord} cleanliness standard and a co-living environment that fits a ${targetUser.sleepType === 'night_owl' ? 'night-owl' : 'early-bird'} rhythm. Let's check our compatibility to see if we'd make a great fit!`;

  return (
    <div className="min-h-screen bg-[rgb(243,244,237)] text-slate-900 pb-28 relative overflow-hidden font-sans">
      {/* Visual background ambient glows */}
      <div className="absolute top-0 left-0 w-full h-[500px] bg-gradient-to-b from-white to-transparent pointer-events-none" />
      <div className="absolute top-1/4 right-[-10%] w-[500px] h-[500px] bg-[rgb(46,219,244)]/6 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-10 left-[-10%] w-[500px] h-[500px] bg-[rgb(250,192,140)]/6 rounded-full blur-[120px] pointer-events-none" />

      <div className="relative max-w-5xl mx-auto px-6 pt-24 pb-10">
        
        {/* Navigation back */}
        <BackButton label="Go Back" fallbackUrl="/discover?tab=people" />

        {/* ── SPLIT LAYOUT ── */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
          
          {/* =========================================
              LEFT COLUMN: HERO PROFILE & ABOUT INFO
          ========================================= */}
          <div className="lg:col-span-7 space-y-6">
            
            {/* Profile Hero Card */}
            <div className="bg-white rounded-[32px] border border-slate-100 shadow-sm p-8 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl from-[rgb(34,142,222)]/5 to-transparent rounded-full" />
              
              <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 text-center sm:text-left">
                {/* Large Avatar container */}
                <div className="w-28 h-28 rounded-full p-[3px] bg-slate-100 border border-slate-200 shadow-sm overflow-hidden shrink-0">
                  <div className="w-full h-full rounded-full overflow-hidden bg-white relative">
                    <UserAvatar
                      src={targetUser.profilePicture}
                      alt={targetUser.fullName}
                      className="w-full h-full"
                    />
                  </div>
                </div>

                {/* Main Details */}
                <div className="space-y-3">
                  <h1 className="font-serif text-3xl md:text-4xl tracking-tight text-slate-900">
                    {targetUser.fullName}
                  </h1>

                  <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
                    <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-slate-50 border border-slate-100 text-xs font-bold text-slate-500 capitalize">
                      {targetUser.roleType === "student" ? (
                        <GraduationCap className="w-3.5 h-3.5 text-[rgb(34,142,222)]" />
                      ) : (
                        <Briefcase className="w-3.5 h-3.5 text-[rgb(248,150,60)]" />
                      )}
                      {targetUser.roleType || "Member"}
                    </span>

                    {targetUser.gender && (
                      <span className="inline-flex items-center px-3 py-1 rounded-full bg-slate-50 border border-slate-100 text-xs font-bold text-slate-500 capitalize">
                        {targetUser.gender}
                      </span>
                    )}

                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-700 text-xs font-bold">
                      <CheckCircle2 className="w-3 h-3 text-emerald-500" /> Active Seeker
                    </span>
                  </div>

                  <p className="text-slate-500 font-semibold flex items-center justify-center sm:justify-start gap-1 text-xs">
                    <MapPin className="w-4 h-4 text-slate-400 shrink-0" />
                    Preferred: {locationStr}
                  </p>
                </div>
              </div>
            </div>

            {/* About / Summary Section */}
            <div className="bg-white rounded-[32px] border border-slate-100 shadow-sm p-8 space-y-5">
              <h2 className="font-serif text-2xl tracking-tight text-slate-900 border-b border-slate-100 pb-3">
                About Me
              </h2>
              <div className="prose prose-slate max-w-none text-slate-600 leading-relaxed text-[15px] font-medium space-y-4">
                <p>{synthesizedBio}</p>
                <p>
                  As a flatmate, I value clear communication, shared respect for privacy, and maintaining a clean and comfortable living space. Let's connect if you have a room or want to explore flat-hunting together!
                </p>
              </div>
            </div>

          </div>

          {/* =========================================
              RIGHT COLUMN: LIFESTYLE PREFERENCES
          ========================================= */}
          <div className="lg:col-span-5 space-y-6">
            
            <div className="bg-white rounded-[32px] border border-slate-100 shadow-sm p-6 md:p-8 space-y-6">
              <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
                <div className="w-8 h-8 rounded-lg bg-[rgb(34,142,222)]/10 flex items-center justify-center">
                  <Heart className="w-4 h-4 text-[rgb(29,93,185)]" />
                </div>
                <h2 className="font-serif text-2xl tracking-tight text-slate-900">
                  Lifestyle Routine
                </h2>
              </div>

              <div className="grid grid-cols-1 gap-3.5">
                {/* Sleep Schedule */}
                <div className="bg-slate-50/60 border border-slate-100 rounded-2xl p-4 flex gap-4 items-center hover:shadow-md transition-shadow">
                  <div className="w-9 h-9 rounded-xl bg-amber-500/10 flex items-center justify-center shrink-0">
                    {targetUser.sleepType === "night_owl" ? (
                      <Moon className="w-4 h-4 text-indigo-500" />
                    ) : (
                      <Sun className="w-4 h-4 text-amber-500" />
                    )}
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Sleep Clock</span>
                    <span className="text-sm font-bold text-slate-800 capitalize block">
                      {targetUser.sleepType === "night_owl" ? "Night Owl" : "Early Bird"}
                    </span>
                  </div>
                </div>

                {/* Cleanliness */}
                <div className="bg-slate-50/60 border border-slate-100 rounded-2xl p-4 flex gap-4 items-center hover:shadow-md transition-shadow">
                  <div className="w-9 h-9 rounded-xl bg-[rgb(46,219,244)]/10 flex items-center justify-center shrink-0">
                    <Brush className="w-4 h-4 text-[rgb(29,93,185)]" />
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Cleanliness</span>
                    <span className="text-sm font-bold text-slate-800 capitalize block">
                      {targetUser.cleanlinessLevel || "Moderate"}
                    </span>
                  </div>
                </div>

                {/* Guest Policy */}
                <div className="bg-slate-50/60 border border-slate-100 rounded-2xl p-4 flex gap-4 items-center hover:shadow-md transition-shadow">
                  <div className="w-9 h-9 rounded-xl bg-indigo-500/10 flex items-center justify-center shrink-0">
                    <Users className="w-4 h-4 text-indigo-600" />
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Guest Policy</span>
                    <span className="text-sm font-bold text-slate-800 capitalize block">
                      {targetUser.guestPolicy || "Regular"}
                    </span>
                  </div>
                </div>

                {/* Smoking Preference */}
                <div className="bg-slate-50/60 border border-slate-100 rounded-2xl p-4 flex gap-4 items-center hover:shadow-md transition-shadow">
                  <div className="w-9 h-9 rounded-xl bg-slate-500/10 flex items-center justify-center shrink-0">
                    <Cigarette className="w-4 h-4 text-slate-600" />
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Smoking</span>
                    <span className={`text-sm font-bold capitalize block ${targetUser.smoker ? "text-red-600" : "text-emerald-700"}`}>
                      {targetUser.smoker ? "Smoker" : "Non-smoker"}
                    </span>
                  </div>
                </div>

                {/* Drinking Preference */}
                <div className="bg-slate-50/60 border border-slate-100 rounded-2xl p-4 flex gap-4 items-center hover:shadow-md transition-shadow">
                  <div className="w-9 h-9 rounded-xl bg-purple-500/10 flex items-center justify-center shrink-0">
                    <Wine className="w-4 h-4 text-purple-600" />
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Drinking</span>
                    <span className={`text-sm font-bold capitalize block ${targetUser.drinker ? "text-purple-600" : "text-emerald-700"}`}>
                      {targetUser.drinker ? "Drinker" : "Non-drinker"}
                    </span>
                  </div>
                </div>

                {/* Budget Max */}
                <div className="bg-slate-50/60 border border-slate-100 rounded-2xl p-4 flex gap-4 items-center hover:shadow-md transition-shadow">
                  <div className="w-9 h-9 rounded-xl bg-[rgb(250,192,140)]/20 flex items-center justify-center shrink-0">
                    <DollarSign className="w-4 h-4 text-[rgb(246,137,83)]" />
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Budget Range</span>
                    <span className="text-sm font-bold text-slate-800 block">
                      Rs. {targetUser.budgetMax ? `${targetUser.budgetMin?.toLocaleString()} - ${targetUser.budgetMax?.toLocaleString()}` : "Flexible"}
                    </span>
                  </div>
                </div>
              </div>
            </div>

          </div>

        </div>

        {/* Preferred Facilities Section */}
        {targetUser.preferredFacilities && targetUser.preferredFacilities.length > 0 && (
          <div className="mt-8 bg-white rounded-[32px] border border-slate-100 shadow-sm p-6 md:p-8 space-y-6">
            <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
              <div className="w-8 h-8 rounded-lg bg-[rgb(46,219,244)]/10 flex items-center justify-center">
                <Sparkles className="w-4 h-4 text-[rgb(34,142,222)]" />
              </div>
              <h2 className="font-serif text-2xl tracking-tight text-slate-900">
                Preferred Facilities
              </h2>
            </div>
            
            <div className="flex flex-wrap gap-2.5">
              {targetUser.preferredFacilities.map((facilityId: string) => {
                const item = FACILITIES_LIST.find((f) => f.id === facilityId);
                if (!item) return null;
                const Icon = item.icon;
                return (
                  <div
                    key={facilityId}
                    className="flex items-center gap-2 px-3.5 py-2 bg-slate-50 border border-slate-100 rounded-xl text-sm font-bold text-slate-700 shadow-sm hover:border-[rgb(34,142,222)]/25 transition-all"
                  >
                    <div className="w-5 h-5 rounded-md bg-white border border-slate-100 flex items-center justify-center shrink-0">
                      <Icon className="w-3 h-3 text-[rgb(29,93,185)]" />
                    </div>
                    {item.label}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ── BOTTOM ACTION SECTION ── */}
        <div className="mt-16 text-center">
          <div className="roomy-glass rounded-3xl border border-white max-w-xl mx-auto p-8 shadow-md">
            <h3 className="font-serif text-xl tracking-tight text-slate-900 mb-2">
              Curious about your routine compatibility?
            </h3>
            <p className="text-sm font-semibold text-slate-400 mb-6 max-w-md mx-auto">
              Our compatibility scanner calculates co-living alignment across cleanliness routines, sleep clock, guest policy, and budgets.
            </p>
            
            <Link
              href={`/people/${targetUser._id}/match`}
              className="inline-flex items-center gap-2 px-10 py-4 rounded-full bg-gradient-to-r from-[rgb(34,142,222)] to-[rgb(29,93,185)] hover:from-[rgb(29,93,185)] hover:to-[rgb(29,93,185)] text-[15px] font-bold text-white shadow-lg shadow-[rgb(29,93,185)]/20 transition-all hover:scale-[1.03] active:scale-[0.98]"
            >
              <Heart className="w-5 h-5" /> Check Compatibility
            </Link>

            <div className="flex items-center justify-center gap-1.5 text-xs text-slate-400 font-bold mt-5">
              <ShieldCheck className="w-4 h-4 text-slate-400" /> Private calculation based on onboarding filters
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
