import React, { useState, useRef, useEffect, useId } from 'react';
import { Search, MapPin, Check, ChevronDown, X, Building2, Zap, Milestone, Compass } from 'lucide-react';
import { ROUTE_LOCATIONS, RouteLocation } from '../data/locations';

interface LocationSearchSelectProps {
  id: string;
  label: string;
  sublabel?: string;
  value: string;
  onChange: (locationId: string) => void;
  excludeId?: string;
  placeholder?: string;
  required?: boolean;
}

// Sub-component to safely highlight matching query characters
const HighlightMatch: React.FC<{ text: string; query: string; className?: string }> = ({
  text,
  query,
  className = '',
}) => {
  if (!query.trim()) {
    return <span className={className}>{text}</span>;
  }

  const escapedQuery = query.trim().replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const regex = new RegExp(`(${escapedQuery})`, 'gi');
  const parts = text.split(regex);

  return (
    <span className={className}>
      {parts.map((part, index) =>
        regex.test(part) ? (
          <mark
            key={index}
            className="bg-amber-200/90 text-slate-900 font-extrabold px-0.5 rounded-[3px] not-italic shadow-2xs"
          >
            {part}
          </mark>
        ) : (
          <span key={index}>{part}</span>
        )
      )}
    </span>
  );
};

export const LocationSearchSelect: React.FC<LocationSearchSelectProps> = ({
  id,
  label,
  sublabel,
  value,
  onChange,
  excludeId,
  placeholder = 'Search village, town, taluka or PIN...',
  required = false,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTaluka, setSelectedTaluka] = useState<'all' | 'Jalna' | 'Partur' | 'Mantha'>('all');
  const [highlightedIndex, setHighlightedIndex] = useState(0);

  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const listboxRef = useRef<HTMLUListElement>(null);
  const triggerId = useId();

  const currentLocation = ROUTE_LOCATIONS.find((l) => l.id === value) || ROUTE_LOCATIONS[0];

  // Filter locations based on search query, taluka, and exclusion
  const filteredLocations = ROUTE_LOCATIONS.filter((loc) => {
    // Taluka filter
    if (selectedTaluka !== 'all' && loc.taluka.toLowerCase() !== selectedTaluka.toLowerCase()) {
      return false;
    }

    if (!searchQuery.trim()) return true;

    const q = searchQuery.toLowerCase().trim();
    const matchName = loc.name.toLowerCase().includes(q);
    const matchMarathi = loc.marathiName.toLowerCase().includes(q);
    const matchTaluka = loc.taluka.toLowerCase().includes(q);
    const matchPincode = loc.pincode.includes(q);
    const matchLandmarks = loc.popularLandmarks?.some((lm) => lm.toLowerCase().includes(q));

    return matchName || matchMarathi || matchTaluka || matchPincode || matchLandmarks;
  });

  // Close when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
        setSearchQuery('');
        setSelectedTaluka('all');
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Reset highlighted index when filtered list changes
  useEffect(() => {
    setHighlightedIndex(0);
  }, [searchQuery, selectedTaluka]);

  // Focus search input when dropdown opens
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => {
        inputRef.current?.focus();
      }, 50);
    } else {
      setSearchQuery('');
      setSelectedTaluka('all');
    }
  }, [isOpen]);

  // Ensure highlighted element is visible in the scrollable view
  useEffect(() => {
    if (isOpen && listboxRef.current) {
      const activeEl = listboxRef.current.children[highlightedIndex] as HTMLElement | undefined;
      if (activeEl) {
        activeEl.scrollIntoView({ block: 'nearest' });
      }
    }
  }, [highlightedIndex, isOpen]);

  const handleSelect = (locId: string) => {
    onChange(locId);
    setIsOpen(false);
    setSearchQuery('');
    setSelectedTaluka('all');
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!isOpen) {
      if (e.key === 'Enter' || e.key === ' ' || e.key === 'ArrowDown') {
        e.preventDefault();
        setIsOpen(true);
      }
      return;
    }

    if (e.key === 'Escape') {
      e.preventDefault();
      setIsOpen(false);
      setSearchQuery('');
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      setHighlightedIndex((prev) => (prev < filteredLocations.length - 1 ? prev + 1 : 0));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setHighlightedIndex((prev) => (prev > 0 ? prev - 1 : Math.max(0, filteredLocations.length - 1)));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      const target = filteredLocations[highlightedIndex];
      if (target && target.id !== excludeId) {
        handleSelect(target.id);
      }
    }
  };

  const talukas: Array<'all' | 'Jalna' | 'Partur' | 'Mantha'> = ['all', 'Jalna', 'Partur', 'Mantha'];

  return (
    <div className="relative flex-1" ref={containerRef}>
      {/* Label with details */}
      <div className="flex items-center justify-between mb-1.5">
        <label htmlFor={id} className="text-xs font-bold text-slate-800 flex items-center gap-1">
          <span>{label}</span>
          {required && <span className="text-red-500">*</span>}
        </label>
        {sublabel ? (
          <span className="text-[11px] text-slate-500 font-medium">{sublabel}</span>
        ) : (
          <span className="text-[10px] text-slate-400 font-medium">
            {currentLocation.taluka} • {currentLocation.distanceKm} km
          </span>
        )}
      </div>

      {/* Selected Location Display Button (Mobile-friendly, large target) */}
      <button
        type="button"
        id={id}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        onClick={() => setIsOpen(!isOpen)}
        onKeyDown={handleKeyDown}
        className={`w-full min-h-[52px] flex items-center justify-between text-left px-3.5 py-2.5 rounded-xl border bg-white dark:bg-slate-800 shadow-2xs transition-all active:scale-[0.99] touch-manipulation ${
          isOpen
            ? 'border-[#0038BD] dark:border-blue-500 ring-2 ring-[#0038BD]/20 bg-blue-50/20 dark:bg-blue-950/20 shadow-sm'
            : 'border-slate-300 dark:border-slate-700 hover:border-slate-400 dark:hover:border-slate-600 hover:bg-slate-50/70 dark:hover:bg-slate-750'
        }`}
      >
        <div className="flex items-center gap-3 min-w-0 pr-2">
          {/* Hub/Stop Icon Badge */}
          <div
            className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 transition-colors ${
              currentLocation.type === 'hub'
                ? 'bg-[#0038BD] text-white shadow-2xs'
                : currentLocation.type === 'junction'
                ? 'bg-amber-500 text-white shadow-2xs'
                : 'bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300'
            }`}
          >
            {currentLocation.type === 'hub' ? (
              <Building2 className="w-4 h-4" />
            ) : currentLocation.type === 'junction' ? (
              <Zap className="w-4 h-4" />
            ) : (
              <MapPin className="w-4 h-4" />
            )}
          </div>

          <div className="min-w-0 flex-1">
            <div className="flex items-baseline gap-1.5 leading-tight flex-wrap">
              <span className="font-bold text-slate-900 dark:text-slate-100 text-sm truncate">
                {currentLocation.name}
              </span>
              <span className="text-xs text-slate-600 dark:text-slate-400 font-semibold shrink-0">
                ({currentLocation.marathiName})
              </span>
              {currentLocation.type === 'hub' && (
                <span className="text-[9px] font-black uppercase tracking-wider bg-blue-100 dark:bg-blue-950/70 text-[#0038BD] dark:text-blue-300 px-1.5 py-0.2 rounded-md">
                  Hub
                </span>
              )}
            </div>

            <div className="text-[11px] text-slate-500 dark:text-slate-400 flex items-center gap-1.5 mt-0.5 font-medium truncate">
              <span>Taluka: <strong className="text-slate-700 dark:text-slate-300">{currentLocation.taluka}</strong></span>
              <span>•</span>
              <span className="font-mono">PIN {currentLocation.pincode}</span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-1.5 shrink-0 pl-1">
          <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 bg-slate-100 dark:bg-slate-700/60 px-1.5 py-0.5 rounded-md hidden sm:inline">
            15 stops
          </span>
          <ChevronDown
            className={`w-4 h-4 text-slate-400 shrink-0 transition-transform duration-200 ${
              isOpen ? 'rotate-180 text-[#0038BD] dark:text-blue-400' : ''
            }`}
          />
        </div>
      </button>

      {/* Search Dropdown Popover (Mobile-Optimized with Quick Filter Pills & Match Highlighting) */}
      {isOpen && (
        <div className="absolute z-50 left-0 right-0 top-full mt-1.5 bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-100">
          
          {/* Search Header & Taluka Filter Strip */}
          <div className="p-2.5 border-b border-slate-100 dark:border-slate-700 bg-slate-50/90 dark:bg-slate-900/90 space-y-2 sticky top-0 z-10 backdrop-blur-xs">
            {/* Input Bar */}
            <div className="relative flex items-center">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 pointer-events-none" />
              <input
                ref={inputRef}
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder={placeholder}
                className="w-full pl-10 pr-10 py-2.5 text-sm bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 focus:outline-none focus:border-[#0038BD] dark:focus:border-blue-400 focus:ring-2 focus:ring-[#0038BD]/20 text-slate-900 dark:text-slate-100 placeholder:text-slate-400 font-medium"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  className="absolute right-2.5 p-1.5 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
                  aria-label="Clear search"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* Quick Taluka Filter Pills (One-tap mobile filtering) */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-0.5 no-scrollbar touch-pan-x">
              {talukas.map((t) => {
                const count =
                  t === 'all'
                    ? ROUTE_LOCATIONS.length
                    : ROUTE_LOCATIONS.filter((l) => l.taluka.toLowerCase() === t.toLowerCase()).length;
                const isActive = selectedTaluka === t;

                return (
                  <button
                    key={t}
                    type="button"
                    onClick={() => {
                      setSelectedTaluka(t);
                      setHighlightedIndex(0);
                    }}
                    className={`text-[11px] font-bold px-2.5 py-1 rounded-lg whitespace-nowrap transition-all touch-manipulation min-h-[32px] flex items-center gap-1 ${
                      isActive
                        ? 'bg-[#0038BD] text-white shadow-2xs scale-[1.02]'
                        : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200/70 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700'
                    }`}
                  >
                    <span>{t === 'all' ? 'All Corridor' : `${t}`}</span>
                    <span
                      className={`text-[9px] px-1 py-0.2 rounded-md ${
                        isActive ? 'bg-blue-800 text-blue-100' : 'bg-slate-100 dark:bg-slate-700 text-slate-500 dark:text-slate-400'
                      }`}
                    >
                      {count}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Location List (Spacious mobile-first touch targets >= 52px) */}
          <ul
            ref={listboxRef}
            role="listbox"
            id={`listbox-${triggerId}`}
            className="max-h-72 sm:max-h-64 overflow-y-auto divide-y divide-slate-100 dark:divide-slate-700/60 p-1.5 overscroll-contain focus:outline-none"
          >
            {filteredLocations.length === 0 ? (
              <li className="py-8 px-4 text-center text-xs text-slate-500 dark:text-slate-400 space-y-1">
                <Compass className="w-6 h-6 text-slate-300 dark:text-slate-600 mx-auto mb-1" />
                <p className="font-bold text-slate-700 dark:text-slate-300 text-sm">No matching location</p>
                <p className="text-[11px] text-slate-400 dark:text-slate-500 max-w-xs mx-auto">
                  Try typing part of the name in Marathi (e.g. वाटूर) or English (e.g. Watur, Ramnagar), or reset the filter above.
                </p>
              </li>
            ) : (
              filteredLocations.map((loc, idx) => {
                const isSelected = loc.id === value;
                const isHighlighted = idx === highlightedIndex;
                const isExcluded = loc.id === excludeId;

                return (
                  <li
                    key={loc.id}
                    role="option"
                    aria-selected={isSelected}
                    aria-disabled={isExcluded}
                    onClick={() => {
                      if (!isExcluded) {
                        handleSelect(loc.id);
                      }
                    }}
                    onMouseEnter={() => setHighlightedIndex(idx)}
                    className={`min-h-[54px] px-3.5 py-2.5 rounded-xl cursor-pointer transition-all flex items-center justify-between gap-3 touch-manipulation active:bg-blue-50/80 select-none ${
                      isSelected
                        ? 'bg-[#0038BD]/10 dark:bg-blue-950/50 border border-[#0038BD]/25 dark:border-blue-500/40 text-[#0038BD] dark:text-blue-300'
                        : isHighlighted
                        ? 'bg-slate-100/90 dark:bg-slate-700/60 text-slate-900 dark:text-slate-100'
                        : 'hover:bg-slate-50/80 dark:hover:bg-slate-700/40 text-slate-800 dark:text-slate-200'
                    } ${isExcluded ? 'opacity-40 cursor-not-allowed bg-slate-50 dark:bg-slate-800' : ''}`}
                  >
                    {/* Left Icon + Names */}
                    <div className="flex items-center gap-3 min-w-0 flex-1">
                      {/* Type Badge / Icon */}
                      <div
                        className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 font-black text-[10px] ${
                          loc.type === 'hub'
                            ? 'bg-[#0038BD] text-white shadow-2xs'
                            : loc.type === 'junction'
                            ? 'bg-amber-500 text-white shadow-2xs'
                            : 'bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300'
                        }`}
                      >
                        {loc.type === 'hub' ? 'HUB' : loc.type === 'junction' ? 'JNC' : 'STP'}
                      </div>

                      <div className="min-w-0 flex-1">
                        {/* Name Line with Match Highlighting */}
                        <div className="flex items-baseline gap-1.5 flex-wrap">
                          <span className="font-bold text-sm text-slate-900 dark:text-slate-100 truncate">
                            <HighlightMatch text={loc.name} query={searchQuery} />
                          </span>
                          <span className="text-xs text-slate-600 dark:text-slate-400 font-semibold">
                            (<HighlightMatch text={loc.marathiName} query={searchQuery} />)
                          </span>
                          {isExcluded && (
                            <span className="text-[9px] font-bold bg-rose-100 dark:bg-rose-950/60 text-rose-700 dark:text-rose-300 px-1.5 py-0.2 rounded-md">
                              Opposite endpoint selected
                            </span>
                          )}
                        </div>

                        {/* Details Line (Taluka, PIN, Milestones) with Match Highlighting */}
                        <div className="text-[11px] text-slate-500 dark:text-slate-400 flex items-center gap-1.5 mt-0.5 truncate">
                          <span>
                            Taluka: <strong className="text-slate-700 dark:text-slate-300"><HighlightMatch text={loc.taluka} query={searchQuery} /></strong>
                          </span>
                          <span>•</span>
                          <span className="font-mono">
                            PIN <HighlightMatch text={loc.pincode} query={searchQuery} />
                          </span>
                          {loc.distanceKm > 0 && (
                            <>
                              <span>•</span>
                              <span className="text-slate-400 dark:text-slate-500 font-medium">~{loc.distanceKm} km</span>
                            </>
                          )}
                          {loc.popularLandmarks && loc.popularLandmarks.length > 0 && (
                            <>
                              <span className="hidden sm:inline">•</span>
                              <span className="text-slate-400 dark:text-slate-500 truncate hidden sm:inline">
                                <HighlightMatch text={loc.popularLandmarks[0]} query={searchQuery} />
                              </span>
                            </>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Right selection check or distance tag */}
                    <div className="flex items-center gap-2 shrink-0">
                      {isSelected ? (
                        <div className="w-6 h-6 rounded-full bg-[#0038BD] text-white flex items-center justify-center shadow-2xs">
                          <Check className="w-3.5 h-3.5 stroke-[3]" />
                        </div>
                      ) : (
                        <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 font-mono hidden sm:inline">
                          {loc.distanceKm} km
                        </span>
                      )}
                    </div>
                  </li>
                );
              })
            )}
          </ul>

          {/* Quick Info Bar */}
          <div className="bg-slate-50 dark:bg-slate-900/90 px-3.5 py-2 border-t border-slate-100 dark:border-slate-700 flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400 font-medium">
            <span className="flex items-center gap-1">
              <Milestone className="w-3.5 h-3.5 text-[#0038BD] dark:text-blue-400" />
              <span>{filteredLocations.length} locations available</span>
            </span>
            <span className="text-[10px] text-slate-400 dark:text-slate-500">
              Tap to select • Daily Doorstep
            </span>
          </div>
        </div>
      )}
    </div>
  );
};
