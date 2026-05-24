"use client";

import React, { useState, useEffect, useRef, useMemo } from "react";
import { MapPin, ChevronDown, Check, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { SRI_LANKA_PROVINCES } from "@/constants/sriLankaLocations";
import { cn } from "@/lib/utils";

interface LocationSelectProps {
  value: string | string[];
  onChange: (value: any) => void;
  multiple?: boolean;
  placeholder?: string;
  theme?: "light" | "dark";
  error?: string;
  disabled?: boolean;
}

export default function LocationSelect({
  value,
  onChange,
  multiple = false,
  placeholder = "Select location...",
  theme = "light",
  error,
  disabled = false,
}: LocationSelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Parse current values
  const selectedValues = useMemo(() => {
    if (multiple) {
      return Array.isArray(value) ? value : [];
    }
    return typeof value === "string" && value ? [value] : [];
  }, [value, multiple]);

  // Sync search input with single select value when not open
  useEffect(() => {
    if (!multiple && !isOpen) {
      setSearch(selectedValues[0] || "");
    }
  }, [selectedValues, multiple, isOpen]);

  // Filter and flatten locations by search query for rendering and keyboard navigation
  const filteredList = useMemo(() => {
    const list: { name: string; province: string }[] = [];
    const normalizedSearch = search.toLowerCase().trim();

    SRI_LANKA_PROVINCES.forEach((group) => {
      group.locations.forEach((loc) => {
        // If searching, check if location matches search query
        if (
          !normalizedSearch ||
          loc.toLowerCase().includes(normalizedSearch) ||
          group.province.toLowerCase().includes(normalizedSearch)
        ) {
          // In multi-select, hide already selected items from list
          if (multiple && selectedValues.includes(loc)) {
            return;
          }
          list.push({ name: loc, province: group.province });
        }
      });
    });

    return list;
  }, [search, multiple, selectedValues]);

  // Reset highlighted index when list changes
  useEffect(() => {
    setHighlightedIndex((prev) => {
      if (filteredList.length === 0) return -1;
      if (prev >= filteredList.length) return filteredList.length - 1;
      if (prev < 0 && filteredList.length > 0) return 0;
      return prev;
    });
  }, [filteredList]);

  // Handle outside clicks
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
        // Reset single-select search text to match current selected value
        if (!multiple) {
          setSearch(selectedValues[0] || "");
        }
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [multiple, selectedValues]);

  // Select a location
  const handleSelect = (location: string) => {
    if (multiple) {
      const updated = selectedValues.includes(location)
        ? selectedValues.filter((v) => v !== location)
        : [...selectedValues, location];
      onChange(updated);
      setSearch(""); // Reset search query on select
      inputRef.current?.focus();
    } else {
      onChange(location);
      setSearch(location);
      setIsOpen(false);
    }
  };

  // Remove a location (multi-select chips)
  const handleRemove = (location: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (multiple) {
      onChange(selectedValues.filter((v) => v !== location));
    }
  };

  // Keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (disabled) return;

    if (!isOpen) {
      if (e.key === "ArrowDown" || e.key === "ArrowUp" || e.key === "Enter") {
        e.preventDefault();
        setIsOpen(true);
      }
      return;
    }

    switch (e.key) {
      case "ArrowDown":
        e.preventDefault();
        setHighlightedIndex((prev) => (prev + 1) % filteredList.length);
        break;
      case "ArrowUp":
        e.preventDefault();
        setHighlightedIndex((prev) => (prev - 1 + filteredList.length) % filteredList.length);
        break;
      case "Enter":
        e.preventDefault();
        if (highlightedIndex >= 0 && highlightedIndex < filteredList.length) {
          handleSelect(filteredList[highlightedIndex].name);
        }
        break;
      case "Escape":
        e.preventDefault();
        setIsOpen(false);
        if (!multiple) {
          setSearch(selectedValues[0] || "");
        }
        break;
      case "Tab":
        setIsOpen(false);
        if (!multiple) {
          setSearch(selectedValues[0] || "");
        }
        break;
    }
  };

  // Grouped render helper
  const groupedLocations = useMemo(() => {
    const groups: { [key: string]: { name: string; globalIndex: number }[] } = {};
    let globalIndex = 0;

    SRI_LANKA_PROVINCES.forEach((prov) => {
      const matchedLocs: { name: string; globalIndex: number }[] = [];
      prov.locations.forEach((loc) => {
        const itemInFiltered = filteredList.find((item) => item.name === loc);
        if (itemInFiltered) {
          matchedLocs.push({
            name: loc,
            globalIndex: filteredList.indexOf(itemInFiltered),
          });
        }
      });
      if (matchedLocs.length > 0) {
        groups[prov.province] = matchedLocs;
      }
    });

    return groups;
  }, [filteredList]);

  // Color theme logic
  const isDark = theme === "dark";

  return (
    <div ref={containerRef} className="relative w-full text-left">
      {/* Search Input Box */}
      <div className="relative flex items-center">
        <MapPin
          className={cn(
            "absolute left-3.5 h-4 w-4 pointer-events-none transition-colors duration-200",
            isOpen
              ? isDark ? "text-indigo-400" : "text-[rgb(34,142,222)]"
              : isDark ? "text-zinc-500" : "text-slate-400"
          )}
        />
        <input
          ref={inputRef}
          type="text"
          placeholder={placeholder}
          value={search}
          disabled={disabled}
          onChange={(e) => {
            setSearch(e.target.value);
            if (!isOpen) setIsOpen(true);
          }}
          onFocus={() => {
            if (!multiple) {
              setSearch(""); // Clear on focus to show all suggestions instantly
            }
            setIsOpen(true);
          }}
          onKeyDown={handleKeyDown}
          className={cn(
            "w-full pl-10 pr-10 py-3 text-sm font-medium rounded-2xl border transition-all duration-200 focus:outline-none focus:ring-4 outline-none disabled:opacity-50 disabled:cursor-not-allowed",
            isDark
              ? "bg-zinc-900/60 border-zinc-800 text-zinc-100 placeholder-zinc-500 focus:border-indigo-500/80 focus:ring-indigo-600/15"
              : "bg-white border-slate-200/90 text-slate-900 placeholder-slate-400 focus:border-[rgb(34,142,222)] focus:ring-[rgb(34,142,222)]/10"
          )}
        />
        <ChevronDown
          onClick={() => !disabled && setIsOpen(!isOpen)}
          className={cn(
            "absolute right-3.5 h-4 w-4 text-zinc-500 hover:text-zinc-300 transition-transform duration-200 cursor-pointer",
            isOpen && "rotate-180"
          )}
        />
      </div>

      {error && <p className="text-red-400 text-xs mt-1.5 ml-1">{error}</p>}

      {/* Floating Suggestions List */}
      <AnimatePresence>
        {isOpen && !disabled && (
          <motion.div
            initial={{ opacity: 0, y: -8, scale: 0.98 }}
            animate={{ opacity: 1, y: 4, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.98 }}
            transition={{ duration: 0.15, ease: "easeOut" }}
            className={cn(
              "absolute left-0 right-0 z-50 max-h-72 overflow-y-auto shadow-2xl rounded-2xl border p-2 backdrop-blur-xl",
              isDark
                ? "bg-zinc-950/90 border-zinc-800/80 shadow-[0_12px_40px_-12px_rgba(0,0,0,0.8)]"
                : "bg-white/95 border-slate-200/60 shadow-[0_12px_40px_-12px_rgba(29,93,185,0.15)]"
            )}
          >
            {filteredList.length === 0 ? (
              <div className={cn(
                "p-4 text-center text-xs italic",
                isDark ? "text-zinc-500" : "text-slate-400"
              )}>
                No locations match your search
              </div>
            ) : (
              Object.entries(groupedLocations).map(([province, items]) => (
                <div key={province} className="mb-2 last:mb-0">
                  {/* Province Label */}
                  <div className={cn(
                    "px-3 py-1.5 text-[10px] font-bold tracking-wider uppercase",
                    isDark ? "text-zinc-500" : "text-slate-400"
                  )}>
                    {province}
                  </div>
                  
                  {/* Locations list */}
                  <div className="space-y-0.5">
                    {items.map(({ name, globalIndex }) => {
                      const isSelected = selectedValues.includes(name);
                      const isHighlighted = globalIndex === highlightedIndex;

                      return (
                        <div
                          key={name}
                          onClick={() => handleSelect(name)}
                          className={cn(
                            "flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold cursor-pointer select-none transition-all duration-150",
                            isHighlighted
                              ? isDark
                                ? "bg-indigo-600/25 text-white"
                                : "bg-[rgb(34,142,222)]/10 text-[rgb(29,93,185)]"
                              : isDark
                                ? "text-zinc-300 hover:bg-zinc-900/60 hover:text-zinc-100"
                                : "text-slate-700 hover:bg-slate-50 hover:text-slate-900",
                            isSelected && (isDark ? "text-indigo-300 font-bold" : "text-[rgb(29,93,185)] font-bold")
                          )}
                        >
                          <span className="flex-1">{name}</span>
                          {isSelected && (
                            <Check className={cn("w-3.5 h-3.5", isDark ? "text-indigo-400" : "text-[rgb(29,93,185)]")} />
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Multi-select chips container */}
      {multiple && selectedValues.length > 0 && (
        <div className="flex flex-wrap gap-1.5 mt-3 p-3 bg-zinc-900/10 dark:bg-zinc-900/30 border border-zinc-200/40 dark:border-zinc-800/50 rounded-2xl">
          {selectedValues.map((loc) => (
            <span
              key={loc}
              className={cn(
                "inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold transition-all border",
                isDark
                  ? "bg-indigo-950/30 border-indigo-800/40 text-indigo-300 shadow-[0_2px_8px_rgba(99,102,241,0.1)]"
                  : "bg-[rgb(34,142,222)]/8 border-[rgb(34,142,222)]/15 text-[rgb(29,93,185)] shadow-[0_2px_8px_rgba(34,142,222,0.06)]"
              )}
            >
              {loc}
              <button
                type="button"
                onClick={(e) => handleRemove(loc, e)}
                className={cn(
                  "rounded-full p-0.5 hover:bg-black/10 dark:hover:bg-white/10 transition-colors",
                  isDark ? "text-indigo-400 hover:text-indigo-200" : "text-[rgb(34,142,222)] hover:text-[rgb(29,93,185)]"
                )}
              >
                <X className="w-3 h-3" />
              </button>
            </span>
          ))}
        </div>
      )}
    </div>
  );
}
