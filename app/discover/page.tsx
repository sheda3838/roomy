import { Metadata } from "next";
import DiscoverTabs from "@/components/discover/DiscoverTabs";
import RoomsTabContent from "@/components/discover/RoomsTabContent";
import PeopleTabContent from "@/components/discover/PeopleTabContent";
import { Sparkles } from "lucide-react";

export const metadata: Metadata = {
  title: "Discover | Roomy",
  description: "Find your perfect room or roommate.",
};

export const revalidate = 60;

export default async function DiscoverPage(props: { searchParams?: Promise<{ [key: string]: string | string[] | undefined }> }) {
  const searchParams = await props.searchParams;
  const currentTab = searchParams?.tab === "people" ? "people" : "rooms";

  return (
    <div className="min-h-screen bg-[#f7f9ff] text-slate-900">
      
      {/* Hero Section */}
      <div className="relative pt-20 pb-12 px-4 overflow-hidden border-b border-slate-100 bg-white">
        {/* Soft brand glows */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[200px] bg-gradient-to-b from-[rgb(46,219,244)]/12 to-transparent blur-[60px] pointer-events-none rounded-full" />
        
        <div className="max-w-6xl mx-auto relative z-10 text-center">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[rgb(34,142,222)]/10 border border-[rgb(34,142,222)]/20 text-[rgb(29,93,185)] text-sm font-bold mb-6">
            <Sparkles className="w-4 h-4" /> Smart Discovery
          </div>
          <h1 className="text-4xl md:text-5xl font-serif font-normal tracking-tight text-slate-900 mb-4">
            Find your{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[rgb(34,142,222)] to-[rgb(29,93,185)]">
              perfect match
            </span>
            .
          </h1>
          <p className="text-lg text-slate-500 max-w-2xl mx-auto leading-relaxed mb-10">
            Browse compatible rooms or connect with roommates based on lifestyle alignment.
          </p>

          <DiscoverTabs />
        </div>
      </div>

      {/* Main Content Area */}
      <div className="max-w-[1400px] mx-auto px-4 py-8">
        {currentTab === "rooms" ? (
          <RoomsTabContent searchParams={searchParams || {}} />
        ) : (
          <PeopleTabContent searchParams={searchParams || {}} />
        )}
      </div>
      
    </div>
  );
}

