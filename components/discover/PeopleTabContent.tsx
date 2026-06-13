import { IUser, IRoom } from "@/types";
import { getSuggestedPeople } from "@/server/actions/getSuggestedPeople";
import RoommateCard from "@/components/people/RoommateCard";
import Link from "next/link";
import { Search } from "lucide-react";
import PeopleFilterSidebar from "./PeopleFilterSidebar";

interface PeopleTabContentProps {
  searchParams: { [key: string]: string | string[] | undefined };
}

export default async function PeopleTabContent({ searchParams }: PeopleTabContentProps) {
  // Extract filters from URL
  const filters: Record<string, any> = {};
  if (searchParams.roleType) filters.roleType = searchParams.roleType;
  if (searchParams.gender) filters.gender = searchParams.gender;
  if (searchParams.smoker === "true") filters.smoker = true;
  if (searchParams.smoker === "false") filters.smoker = false;
  if (searchParams.drinker === "true") filters.drinker = true;
  if (searchParams.drinker === "false") filters.drinker = false;
  if (searchParams.sleepType) filters.sleepType = searchParams.sleepType;
  if (searchParams.cleanliness) filters.cleanlinessLevel = searchParams.cleanliness;
  if (searchParams.city) filters.locationText = searchParams.city;

  const { success, people, error } = await getSuggestedPeople(filters);

  return (
    <div className="flex flex-col md:flex-row gap-8 items-start">
      <PeopleFilterSidebar />
      
      <div className="flex-1 w-full">
        {error ? (
          <div className="text-center py-20 border border-red-900/30 bg-red-950/10 rounded-3xl">
            <p className="text-red-400">{error}</p>
          </div>
        ) : !people || people.length === 0 ? (
          <div className="text-center py-20 border border-dashed border-slate-200 rounded-3xl bg-slate-50">
            <div className="w-16 h-16 bg-white rounded-full shadow-sm flex items-center justify-center mx-auto mb-4 border border-slate-100">
              <Search className="w-8 h-8 text-slate-400" />
            </div>
            <h2 className="text-xl font-bold text-slate-800 mb-2">No active seekers found</h2>
            <p className="text-slate-500 max-w-md mx-auto mb-6">
              We couldn't find anyone matching your current filters.
            </p>
            <Link 
              href="/discover?tab=people" 
              className="px-6 py-2 rounded-full bg-slate-200 text-slate-700 hover:bg-slate-300 transition-colors font-medium inline-block"
            >
              Clear Filters
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
            {people.map((person: any) => (
              <RoommateCard key={person.user._id} person={person} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
