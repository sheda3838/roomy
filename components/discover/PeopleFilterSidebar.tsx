"use client";

import { useCallback, useState, useEffect } from "react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { Filter, X } from "lucide-react";
import LocationSelect from "@/components/shared/LocationSelect";

export default function PeopleFilterSidebar() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isOpen, setIsOpen] = useState(false);

  const [roleType, setRoleType] = useState(searchParams.get("roleType") || "");
  const [gender, setGender] = useState(searchParams.get("gender") || "");
  const [smoker, setSmoker] = useState(searchParams.get("smoker") || "");
  const [drinker, setDrinker] = useState(searchParams.get("drinker") || "");
  const [sleepType, setSleepType] = useState(searchParams.get("sleepType") || "");
  const [cleanliness, setCleanliness] = useState(searchParams.get("cleanliness") || "");
  const [city, setCity] = useState(searchParams.get("city") || "");

  useEffect(() => {
    setCity(searchParams.get("city") || "");
  }, [searchParams]);

  const handleCityChange = (val: string) => {
    setCity(val);
    updateFilter("city", val);
  };

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
    if (searchParams.toString() !== newQuery) {
      router.push(`${pathname}?${newQuery}`, { scroll: false });
    }
  }, [createQueryString, pathname, router, searchParams]);

  const handleSelectChange = (name: string, value: string, setter: (val: string) => void) => {
    setter(value);
    updateFilter(name, value);
  };

  const handleClear = () => {
    setRoleType("");
    setGender("");
    setSmoker("");
    setDrinker("");
    setSleepType("");
    setCleanliness("");
    setCity("");
    router.push(`${pathname}?tab=people`, { scroll: false });
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
        {/* Location Filter */}
        <div>
          <label className="block text-sm font-semibold text-slate-600 mb-1.5">Preferred Location</label>
          <LocationSelect
            value={city}
            onChange={handleCityChange}
            multiple={false}
            placeholder="Select location..."
            theme="light"
          />
        </div>

        {/* Role Filter */}
        <div>
          <label className="block text-sm font-semibold text-slate-600 mb-1.5">Status</label>
          <select
            value={roleType}
            onChange={(e) => handleSelectChange("roleType", e.target.value, setRoleType)}
            className="roomy-input appearance-none"
          >
            <option value="">Any</option>
            <option value="student">Student</option>
            <option value="worker">Working Professional</option>
          </select>
        </div>

        {/* Gender Filter */}
        <div>
          <label className="block text-sm font-semibold text-slate-600 mb-1.5">Gender</label>
          <select
            value={gender}
            onChange={(e) => handleSelectChange("gender", e.target.value, setGender)}
            className="roomy-input appearance-none"
          >
            <option value="">Any</option>
            <option value="male">Male</option>
            <option value="female">Female</option>
            <option value="other">Other</option>
          </select>
        </div>

        {/* Smoker Filter */}
        <div>
          <label className="block text-sm font-semibold text-slate-600 mb-1.5">Smoking Habits</label>
          <select
            value={smoker}
            onChange={(e) => handleSelectChange("smoker", e.target.value, setSmoker)}
            className="roomy-input appearance-none"
          >
            <option value="">Any</option>
            <option value="false">Non-smoker</option>
            <option value="true">Smoker</option>
          </select>
        </div>

        {/* Drinker Filter */}
        <div>
          <label className="block text-sm font-semibold text-slate-600 mb-1.5">Drinking Habits</label>
          <select
            value={drinker}
            onChange={(e) => handleSelectChange("drinker", e.target.value, setDrinker)}
            className="roomy-input appearance-none"
          >
            <option value="">Any</option>
            <option value="false">Non-drinker</option>
            <option value="true">Drinker</option>
          </select>
        </div>

        {/* Sleep Type */}
        <div>
          <label className="block text-sm font-semibold text-slate-600 mb-1.5">Sleep Schedule</label>
          <select
            value={sleepType}
            onChange={(e) => handleSelectChange("sleepType", e.target.value, setSleepType)}
            className="roomy-input appearance-none"
          >
            <option value="">Any</option>
            <option value="early">Early Bird</option>
            <option value="night_owl">Night Owl</option>
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

      </div>
    </div>
  );

  return (
    <>
      <button 
        onClick={() => setIsOpen(true)}
        className="md:hidden w-full flex items-center justify-center gap-2 bg-white border border-slate-200 text-slate-800 py-3 rounded-xl mb-6 font-semibold shadow-sm hover:border-[rgb(34,142,222)]/40 transition-all"
      >
        <Filter className="w-4 h-4 text-[rgb(34,142,222)]" /> Filter People
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
