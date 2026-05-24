"use client";

import { useCallback, useState, useEffect } from "react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { Filter, X } from "lucide-react";
import LocationSelect from "@/components/shared/LocationSelect";

export default function RoomsFilterSidebar() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isOpen, setIsOpen] = useState(false);

  // We don't use React state for text inputs to avoid cursor jumping
  // Instead we debounce the router push directly
  
  const [gender, setGender] = useState(searchParams.get("gender") || "");
  const [cleanliness, setCleanliness] = useState(searchParams.get("cleanliness") || "");
  const [smokerAllowed, setSmokerAllowed] = useState(searchParams.get("smokerAllowed") || "");
  const [drinkerAllowed, setDrinkerAllowed] = useState(searchParams.get("drinkerAllowed") || "");
  const [guestPolicy, setGuestPolicy] = useState(searchParams.get("guestPolicy") || "");

  const createQueryString = useCallback(
    (name: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString());
      if (value) {
        params.set(name, value);
      } else {
        params.delete(name);
      }
      return params.toString();
    },
    [searchParams]
  );

  const updateFilter = useCallback((name: string, value: string) => {
    const newQuery = createQueryString(name, value);
    // Don't push if the URL already matches (prevents infinite loops)
    if (searchParams.toString() !== newQuery) {
      router.push(`${pathname}?${newQuery}`, { scroll: false });
    }
  }, [createQueryString, pathname, router, searchParams]);

  // Debounced input handlers
  const handleCityChange = useCallback(
    (val: string) => {
      updateFilter("city", val);
    },
    [updateFilter]
  );

  const handlePriceChange = useCallback(
    (val: string) => {
      updateFilter("maxPrice", val);
    },
    [updateFilter]
  );

  // Direct update for selects
  const handleSelectChange = (name: string, value: string, setter: (val: string) => void) => {
    setter(value);
    updateFilter(name, value);
  };

  const handleClear = () => {
    // We can't clear uncontrolled inputs easily without a ref, but resetting URL clears them if we add keys, 
    // or we can just force a full page refresh
    router.push(`${pathname}?tab=rooms`);
  };

  const sidebarContent = (
    <div className="space-y-5 max-h-[80vh] overflow-y-auto pr-2 pb-6 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
      <div className="flex items-center justify-between sticky top-0 bg-white/95 py-2 z-10 backdrop-blur-sm">
        <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
          <Filter className="w-4 h-4 text-[rgb(34,142,222)]" /> Filters
        </h3>
        <button 
          onClick={handleClear}
          className="text-xs font-semibold text-[rgb(34,142,222)] hover:text-[rgb(29,93,185)] transition-colors"
        >
          Clear All
        </button>
      </div>

      <div className="space-y-4">
        {/* City Filter */}
        <div>
          <label className="block text-sm font-semibold text-slate-600 mb-1.5">City / Location</label>
          <LocationSelect
            value={searchParams.get("city") || ""}
            onChange={handleCityChange}
            multiple={false}
            placeholder="Select location..."
            theme="light"
          />
        </div>

        {/* Max Price Filter */}
        <div>
          <label className="block text-sm font-semibold text-slate-600 mb-1.5">Max Budget (Rs.)</label>
          <input
            type="number"
            placeholder="No limit"
            defaultValue={searchParams.get("maxPrice") || ""}
            onChange={(e) => {
              const val = e.target.value;
              setTimeout(() => handlePriceChange(val), 600);
            }}
            className="roomy-input"
          />
        </div>

        {/* Gender Preference */}
        <div>
          <label className="block text-sm font-semibold text-slate-600 mb-1.5">Gender Rules</label>
          <select
            value={gender}
            onChange={(e) => handleSelectChange("gender", e.target.value, setGender)}
            className="roomy-input appearance-none"
          >
            <option value="">Any</option>
            <option value="male">Male Only</option>
            <option value="female">Female Only</option>
          </select>
        </div>

        {/* Cleanliness */}
        <div>
          <label className="block text-sm font-semibold text-slate-600 mb-1.5">Cleanliness</label>
          <select
            value={cleanliness}
            onChange={(e) => handleSelectChange("cleanliness", e.target.value, setCleanliness)}
            className="roomy-input appearance-none"
          >
            <option value="">Any</option>
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </select>
        </div>

        {/* Smoker Allowed */}
        <div>
          <label className="block text-sm font-semibold text-slate-600 mb-1.5">Smoker Allowed</label>
          <select
            value={smokerAllowed}
            onChange={(e) => handleSelectChange("smokerAllowed", e.target.value, setSmokerAllowed)}
            className="roomy-input appearance-none"
          >
            <option value="">Any</option>
            <option value="true">Yes</option>
            <option value="false">No</option>
          </select>
        </div>

        {/* Drinker Allowed */}
        <div>
          <label className="block text-sm font-semibold text-slate-600 mb-1.5">Drinker Allowed</label>
          <select
            value={drinkerAllowed}
            onChange={(e) => handleSelectChange("drinkerAllowed", e.target.value, setDrinkerAllowed)}
            className="roomy-input appearance-none"
          >
            <option value="">Any</option>
            <option value="true">Yes</option>
            <option value="false">No</option>
          </select>
        </div>

        {/* Guest Policy */}
        <div>
          <label className="block text-sm font-semibold text-slate-600 mb-1.5">Guest Policy</label>
          <select
            value={guestPolicy}
            onChange={(e) => handleSelectChange("guestPolicy", e.target.value, setGuestPolicy)}
            className="roomy-input appearance-none"
          >
            <option value="">Any</option>
            <option value="no">No Guests</option>
            <option value="often">Sometimes</option>
            <option value="regular">Frequently</option>
          </select>
        </div>
      </div>
    </div>
  );

  return (
    <>
      <button 
        onClick={() => setIsOpen(true)}
        className="md:hidden w-full flex items-center justify-center gap-2 bg-white border border-slate-200 text-slate-800 py-3 rounded-xl mb-6 font-semibold shadow-sm hover:border-[rgb(34,142,222)]/40 transition-all"
      >
        <Filter className="w-4 h-4 text-[rgb(34,142,222)]" /> Filter Rooms
      </button>

      <div className="hidden md:block sticky top-24 bg-white border border-slate-100 p-6 rounded-3xl w-72 shrink-0 h-fit shadow-sm">
        {sidebarContent}
      </div>

      {isOpen && (
        <div className="fixed inset-0 z-50 flex justify-end md:hidden">
          <div className="absolute inset-0 bg-black/30 backdrop-blur-sm" onClick={() => setIsOpen(false)} />
          <div className="relative w-4/5 max-w-sm h-full bg-white border-l border-slate-100 p-6 shadow-2xl animate-in slide-in-from-right duration-300">
            <button onClick={() => setIsOpen(false)} className="absolute top-6 right-6 text-slate-400 hover:text-slate-800 z-20">
              <X className="w-6 h-6" />
            </button>
            {sidebarContent}
          </div>
        </div>
      )}
    </>
  );
}
