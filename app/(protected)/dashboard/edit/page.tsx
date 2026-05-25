import { auth } from "@/lib/auth";
import dbConnect from "@/lib/db";
import User, { IUser } from "@/models/User";
import { redirect } from "next/navigation";
import type { Metadata } from "next";
import EditProfileForm from "./EditProfileForm";

export const metadata: Metadata = {
  title: "Edit Profile | Roomy",
};

export default async function EditProfilePage() {
  const session = await auth();

  if (!session?.user?.id) redirect("/login");

  await dbConnect();
  const userDoc = await User.findById(session.user.id).lean() as IUser | null;

  if (!userDoc) redirect("/login");

  const initialData = {
    fullName: userDoc.fullName || "",
    gender: userDoc.gender || undefined,
    roleType: userDoc.roleType || undefined,
    cleanlinessLevel: userDoc.cleanlinessLevel || undefined,
    sleepType: userDoc.sleepType || undefined,
    smoker: userDoc.smoker !== undefined ? userDoc.smoker : undefined,
    drinker: userDoc.drinker !== undefined ? userDoc.drinker : undefined,
    guestPolicy: userDoc.guestPolicy || undefined,
    isActiveSeeker: userDoc.isActiveSeeker,
    budgetMin: userDoc.budgetMin,
    budgetMax: userDoc.budgetMax,
    preferredLocations: userDoc.preferredLocations || [],
    profilePicture: userDoc.profilePicture || "",
  };

  return (
    <div className="min-h-screen w-full bg-[#f7f9ff] text-slate-900 flex flex-col">
      {/* Background glows */}
      <div className="fixed top-0 left-0 w-full h-full pointer-events-none overflow-hidden">
        <div className="absolute top-0 -left-32 w-[500px] h-[500px] bg-[rgb(46,219,244)] rounded-full opacity-[0.06] blur-[100px]" />
        <div className="absolute bottom-0 -right-32 w-[500px] h-[500px] bg-[rgb(248,150,60)] rounded-full opacity-[0.06] blur-[100px]" />
      </div>

      <main className="flex-1 max-w-3xl w-full mx-auto px-4 pt-28 pb-10 relative z-10 space-y-8">
        <EditProfileForm initialData={initialData as any} />
      </main>
    </div>
  );
}
