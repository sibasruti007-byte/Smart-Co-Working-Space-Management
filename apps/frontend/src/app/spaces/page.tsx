'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import {
  Search,
  SlidersHorizontal,
  MapPin,
  Star,
  Building2,
  Sparkles,
  ArrowRight,
  Activity,
  Map as MapIcon,
  List,
  Info,
  ZoomIn,
  ZoomOut,
  Crosshair,
  Layers,
  X,
  Volume2,
  Wind,
  Shield,
  Check,
} from 'lucide-react';

interface MockSpace {
  id: string;
  slug: string;
  title: string;
  city: string;
  district: string;
  type: string;
  capacity: number;
  hourlyPrice: number;
  dailyPrice: number;
  rating: number;
  reviews: number;
  occupancy: number;
  matchScore: number;
  badges: string[];
  reasons: string[];
  image: string;
  coords: { x: number; y: number; region: string };
  iaq: number;
  noise: number;
}

const MOCK_SPACES: MockSpace[] = [
  {
    id: 'space-1',
    slug: 'apex-suite-flatiron-new-york-1',
    title: 'Apex Executive Suite • Flatiron',
    city: 'New York',
    district: 'Flatiron District',
    type: 'PRIVATE_CABIN',
    capacity: 10,
    hourlyPrice: 48,
    dailyPrice: 320,
    rating: 4.9,
    reviews: 48,
    occupancy: 4,
    matchScore: 97,
    badges: ['⭐ High Match', 'Perfect Team Fit', 'Budget Friendly'],
    reasons: [
      'Capacity: 10 seats matches your 8-person team perfectly (+20)',
      'Budget: $48/hr is within your $55/hr target (+20)',
      'Amenities: Gigabit Wi-Fi, 4K displays, power backup included (+20)',
      'Proximity: 1.2 miles from Midtown (+15)',
    ],
    image: 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=1200&q=80',
    coords: { x: 30, y: 38, region: 'North America • East' },
    iaq: 96,
    noise: 42,
  },
  {
    id: 'space-2',
    slug: 'silicon-hub-soma-san-francisco-2',
    title: 'Silicon Foundry Tech Pod • SoMa',
    city: 'San Francisco',
    district: 'SoMa Bay',
    type: 'SHARED_DESK',
    capacity: 14,
    hourlyPrice: 42,
    dailyPrice: 280,
    rating: 4.8,
    reviews: 62,
    occupancy: 9,
    matchScore: 92,
    badges: ['High Match', 'All Amenities'],
    reasons: [
      'Capacity: 14 seats comfortably accommodates 8-12 members (+18)',
      'Budget: $42/hr rate gives 15% budget surplus (+20)',
      'Hardware: Standing desks & Herman Miller chairs (+20)',
    ],
    image: 'https://images.unsplash.com/photo-1497215728101-856f4ea42174?auto=format&fit=crop&w=1200&q=80',
    coords: { x: 19, y: 44, region: 'North America • West' },
    iaq: 93,
    noise: 45,
  },
  {
    id: 'space-3',
    slug: 'shoreditch-commons-london-3',
    title: 'Vanguard Innovation Commons • Shoreditch',
    city: 'London',
    district: 'Shoreditch Tech City',
    type: 'MEETING_ROOM',
    capacity: 8,
    hourlyPrice: 38,
    dailyPrice: 260,
    rating: 4.7,
    reviews: 35,
    occupancy: 3,
    matchScore: 89,
    badges: ['Budget Friendly'],
    reasons: [
      'Capacity: Exactly 8 seats for targeted focus work (+20)',
      'Rate: $38/hr is 25% under maximum budget ceiling (+20)',
    ],
    image: 'https://images.unsplash.com/photo-1524758631624-e2822e304c36?auto=format&fit=crop&w=1200&q=80',
    coords: { x: 50, y: 28, region: 'Europe • UK' },
    iaq: 95,
    noise: 39,
  },
  {
    id: 'space-4',
    slug: 'quantum-mitte-berlin-4',
    title: 'Quantum Loft Studios • Mitte',
    city: 'Berlin',
    district: 'Mitte',
    type: 'PRIVATE_CABIN',
    capacity: 12,
    hourlyPrice: 35,
    dailyPrice: 240,
    rating: 4.9,
    reviews: 54,
    occupancy: 5,
    matchScore: 95,
    badges: ['⭐ High Match', 'All Amenities'],
    reasons: [
      'Capacity: 12 seats fits scaling team (+19)',
      'Budget: $35/hr competitive rate in Berlin Mitte (+20)',
    ],
    image: 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=1200&q=80',
    coords: { x: 56, y: 26, region: 'Europe • DACH' },
    iaq: 94,
    noise: 41,
  },
  {
    id: 'space-5',
    slug: 'marina-nexus-singapore-5',
    title: 'Marina Bay Financial Tower Suite',
    city: 'Singapore',
    district: 'Marina Bay Financial Centre',
    type: 'DEDICATED_DESK',
    capacity: 16,
    hourlyPrice: 52,
    dailyPrice: 360,
    rating: 5.0,
    reviews: 80,
    occupancy: 11,
    matchScore: 94,
    badges: ['⭐ Top Rated', 'Prime Location'],
    reasons: [
      'Rating: 5.0 verified score across 80 corporate stays (+20)',
      'Sensors: Real-time turnstiles and IAQ monitoring (+15)',
    ],
    image: 'https://images.unsplash.com/photo-1527192491265-7e15c55b1ed2?auto=format&fit=crop&w=1200&q=80',
    coords: { x: 79, y: 62, region: 'Asia-Pacific • ASEAN' },
    iaq: 98,
    noise: 38,
  },
];

export default function SpacesSearchPage() {
  const [selectedCity, setSelectedCity] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [teamSize, setTeamSize] = useState<number>(8);
  const [maxBudget, setMaxBudget] = useState<number>(60);
  const [selectedType, setSelectedType] = useState<string>('All');
  const [sortBy, setSortBy] = useState<string>('match');
  const [viewMode, setViewMode] = useState<'list' | 'map'>('list');
  const [hoveredReasonId, setHoveredReasonId] = useState<string | null>(null);

  // Map state
  const [selectedMapSpace, setSelectedMapSpace] = useState<MockSpace | null>(MOCK_SPACES[0]);
  const [zoomLevel, setZoomLevel] = useState<number>(1);
  const [showHeatmap, setShowHeatmap] = useState<boolean>(true);

  const filteredSpaces = useMemo(() => {
    let result = [...MOCK_SPACES];

    if (selectedCity !== 'All') {
      result = result.filter((s) => s.city.toLowerCase() === selectedCity.toLowerCase());
    }

    if (selectedType !== 'All') {
      result = result.filter((s) => s.type === selectedType);
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (s) =>
          s.title.toLowerCase().includes(q) ||
          s.district.toLowerCase().includes(q) ||
          s.city.toLowerCase().includes(q)
      );
    }

    if (maxBudget) {
      result = result.filter((s) => s.hourlyPrice <= maxBudget);
    }

    // Sort
    if (sortBy === 'match') {
      result.sort((a, b) => b.matchScore - a.matchScore);
    } else if (sortBy === 'price_asc') {
      result.sort((a, b) => a.hourlyPrice - b.hourlyPrice);
    } else if (sortBy === 'price_desc') {
      result.sort((a, b) => b.hourlyPrice - a.hourlyPrice);
    } else if (sortBy === 'rating') {
      result.sort((a, b) => b.rating - a.rating);
    }

    return result;
  }, [selectedCity, selectedType, searchQuery, maxBudget, sortBy]);

  // Keep selected map space synced with filtered results
  const activeSpotlight = useMemo(() => {
    if (selectedMapSpace && filteredSpaces.some((s) => s.id === selectedMapSpace.id)) {
      return selectedMapSpace;
    }
    return filteredSpaces[0] || null;
  }, [selectedMapSpace, filteredSpaces]);

  return (
    <div className="min-h-screen bg-[#060e20] text-slate-100 flex flex-col">
      {/* Top Bar */}
      <header className="border-b border-white/10 glass-panel sticky top-0 z-30 px-6 py-4">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center space-x-3">
            <Link href="/" className="flex items-center space-x-2">
              <div className="h-9 w-9 rounded-xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400">
                <Building2 className="w-5 h-5" />
              </div>
              <span className="font-bold text-lg text-white">SmartSpace</span>
            </Link>
            <span className="text-slate-600">/</span>
            <span className="text-xs text-slate-400 font-mono">200+ Global Tech Hubs</span>
          </div>

          {/* Quick Search Input */}
          <div className="relative w-full sm:w-96">
            <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by district, neighborhood or keyword..."
              className="w-full pl-10 pr-4 py-2 rounded-xl bg-[#0b1326] border border-white/10 text-white placeholder-slate-500 text-xs focus:outline-none focus:border-emerald-500"
            />
          </div>

          {/* View Toggle */}
          <div className="flex items-center space-x-1.5 bg-[#0b1326] p-1 rounded-xl border border-white/10">
            <button
              type="button"
              onClick={() => setViewMode('list')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center space-x-1.5 transition-all cursor-pointer ${
                viewMode === 'list'
                  ? 'bg-emerald-500 text-slate-950 shadow-glow font-bold'
                  : 'text-slate-400 hover:text-white hover:bg-white/5'
              }`}
            >
              <List className="w-3.5 h-3.5" />
              <span>List</span>
            </button>
            <button
              type="button"
              onClick={() => setViewMode('map')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center space-x-1.5 transition-all cursor-pointer ${
                viewMode === 'map'
                  ? 'bg-emerald-500 text-slate-950 shadow-glow font-bold'
                  : 'text-slate-400 hover:text-white hover:bg-white/5'
              }`}
            >
              <MapIcon className="w-3.5 h-3.5" />
              <span>Map</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Body */}
      <div className="max-w-7xl mx-auto px-6 py-8 flex-1 w-full grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Filter Sidebar */}
        <aside className="space-y-6">
          <div className="glass-panel p-6 rounded-2xl space-y-6 sticky top-24 border border-white/10">
            <div className="flex items-center justify-between pb-3 border-b border-white/10">
              <div className="flex items-center space-x-2 text-white font-bold text-sm">
                <SlidersHorizontal className="w-4 h-4 text-emerald-400" />
                <span>Smart Filters</span>
              </div>
              <button
                type="button"
                onClick={() => {
                  setSelectedCity('All');
                  setSelectedType('All');
                  setMaxBudget(60);
                  setTeamSize(8);
                  setSearchQuery('');
                }}
                className="text-[11px] text-slate-400 hover:text-emerald-400 transition-colors cursor-pointer"
              >
                Reset
              </button>
            </div>

            {/* City Selector */}
            <div className="space-y-2">
              <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider">City</label>
              <select
                value={selectedCity}
                onChange={(e) => setSelectedCity(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-[#0b1326] border border-white/10 text-white text-xs focus:outline-none focus:border-emerald-500"
              >
                <option value="All">All Tech Hubs</option>
                <option value="New York">New York, NY</option>
                <option value="San Francisco">San Francisco, CA</option>
                <option value="London">London, UK</option>
                <option value="Berlin">Berlin, Germany</option>
                <option value="Singapore">Singapore</option>
              </select>
            </div>

            {/* Team Size Slider */}
            <div className="space-y-2">
              <div className="flex justify-between text-xs">
                <span className="font-semibold text-slate-300 uppercase">Team Size</span>
                <span className="font-mono text-emerald-400 font-bold">{teamSize} seats</span>
              </div>
              <input
                type="range"
                min={1}
                max={30}
                value={teamSize}
                onChange={(e) => setTeamSize(+e.target.value)}
                className="w-full accent-emerald-500"
              />
            </div>

            {/* Budget Max */}
            <div className="space-y-2">
              <div className="flex justify-between text-xs">
                <span className="font-semibold text-slate-300 uppercase">Max Budget</span>
                <span className="font-mono text-emerald-400 font-bold">${maxBudget}/hr</span>
              </div>
              <input
                type="range"
                min={15}
                max={100}
                value={maxBudget}
                onChange={(e) => setMaxBudget(+e.target.value)}
                className="w-full accent-emerald-500"
              />
            </div>

            {/* Workspace Type */}
            <div className="space-y-2">
              <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider">Workspace Type</label>
              <div className="space-y-1.5">
                {['All', 'PRIVATE_CABIN', 'SHARED_DESK', 'MEETING_ROOM', 'DEDICATED_DESK'].map((t) => (
                  <button
                    key={t}
                    type="button"
                    onClick={() => setSelectedType(t)}
                    className={`w-full text-left px-3 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer ${
                      selectedType === t
                        ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 font-semibold'
                        : 'text-slate-400 hover:text-white hover:bg-white/5'
                    }`}
                  >
                    {t.replace('_', ' ')}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </aside>

        {/* Results Area */}
        <section className="lg:col-span-3 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <h2 className="text-xl font-bold text-white flex items-center space-x-2">
              <span>{filteredSpaces.length} Workspaces Found</span>
              <span className="text-xs font-normal text-slate-500 font-mono">
                {viewMode === 'map' ? '(Interactive IoT Geo Map)' : '(Ranked by Matching Engine)'}
              </span>
            </h2>

            {/* Sort Dropdown */}
            <div className="flex items-center space-x-2 text-xs">
              <span className="text-slate-400">Sort by:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-3 py-1.5 rounded-xl bg-[#0b1326] border border-white/10 text-white text-xs focus:outline-none focus:border-emerald-500"
              >
                <option value="match">Match Score (0-100)</option>
                <option value="price_asc">Price: Low to High</option>
                <option value="price_desc">Price: High to Low</option>
                <option value="rating">Rating & Trust</option>
              </select>
            </div>
          </div>

          {/* VIEW MODE: MAP VIEW */}
          {viewMode === 'map' ? (
            <div className="space-y-4">
              {/* Map Canvas Card */}
              <div className="relative rounded-3xl bg-[#070e1e] border border-white/10 overflow-hidden shadow-2xl h-[520px]">
                {/* Cybernetic Grid & Continent Vectors */}
                <div
                  className="absolute inset-0 opacity-25 pointer-events-none transition-transform duration-300"
                  style={{
                    backgroundImage: `linear-gradient(rgba(16, 185, 129, 0.08) 1px, transparent 1px), linear-gradient(90deg, rgba(16, 185, 129, 0.08) 1px, transparent 1px)`,
                    backgroundSize: '40px 40px',
                    transform: `scale(${zoomLevel})`,
                  }}
                />

                {/* Ambient Radial Vignette */}
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_20%,#060e20_90%)] pointer-events-none" />

                {/* Continental Coordinate Labels & Latitude Rings */}
                <div className="absolute inset-0 pointer-events-none select-none text-[9px] font-mono text-slate-600 p-4 flex flex-col justify-between">
                  <div className="flex justify-between">
                    <span>GLOBAL MESH // PROJECTION: WGS-84</span>
                    <span>NORTH BAY • ZONE 04</span>
                  </div>
                  <div className="flex justify-between text-slate-700">
                    <span>EQ LAT: 00° 00&apos; 00&quot;</span>
                    <span>ACTIVE IOT NODES: 200+</span>
                  </div>
                </div>

                {/* HUD Map Controls (Top Left) */}
                <div className="absolute top-4 left-4 z-20 flex flex-wrap items-center gap-1.5 max-w-[70%]">
                  {['All', 'New York', 'San Francisco', 'London', 'Berlin', 'Singapore'].map((city) => (
                    <button
                      key={city}
                      type="button"
                      onClick={() => setSelectedCity(city)}
                      className={`px-2.5 py-1 rounded-xl text-[10px] font-mono transition-all cursor-pointer ${
                        selectedCity === city
                          ? 'bg-emerald-500 text-slate-950 font-bold shadow-glow'
                          : 'bg-slate-950/80 backdrop-blur-md text-slate-300 border border-white/10 hover:border-emerald-500/40 hover:text-white'
                      }`}
                    >
                      {city}
                    </button>
                  ))}
                </div>

                {/* HUD Zoom / Layer Controls (Top Right) */}
                <div className="absolute top-4 right-4 z-20 flex flex-col space-y-1.5">
                  <button
                    type="button"
                    onClick={() => setZoomLevel((z) => Math.min(z + 0.2, 1.8))}
                    className="p-2 rounded-xl bg-slate-950/80 backdrop-blur-md border border-white/10 text-slate-300 hover:text-white hover:border-emerald-500/40 transition-colors cursor-pointer"
                    title="Zoom in"
                  >
                    <ZoomIn className="w-3.5 h-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => setZoomLevel((z) => Math.max(z - 0.2, 0.8))}
                    className="p-2 rounded-xl bg-slate-950/80 backdrop-blur-md border border-white/10 text-slate-300 hover:text-white hover:border-emerald-500/40 transition-colors cursor-pointer"
                    title="Zoom out"
                  >
                    <ZoomOut className="w-3.5 h-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setZoomLevel(1);
                      setSelectedCity('All');
                    }}
                    className="p-2 rounded-xl bg-slate-950/80 backdrop-blur-md border border-white/10 text-slate-300 hover:text-white hover:border-emerald-500/40 transition-colors cursor-pointer"
                    title="Recenter"
                  >
                    <Crosshair className="w-3.5 h-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowHeatmap(!showHeatmap)}
                    className={`p-2 rounded-xl border transition-colors cursor-pointer ${
                      showHeatmap
                        ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40'
                        : 'bg-slate-950/80 backdrop-blur-md border-white/10 text-slate-400'
                    }`}
                    title="Toggle Occupancy Heatmap"
                  >
                    <Layers className="w-3.5 h-3.5" />
                  </button>
                </div>

                {/* SVG Connecting Flight & Telemetry Arcs */}
                <svg className="absolute inset-0 w-full h-full pointer-events-none" xmlns="http://www.w3.org/2000/svg">
                  {/* Subtle telemetry lines between hubs */}
                  <path
                    d="M 30% 38% Q 40% 25% 50% 28%"
                    stroke="rgba(16, 185, 129, 0.25)"
                    strokeWidth="1.5"
                    strokeDasharray="4 4"
                    fill="none"
                  />
                  <path
                    d="M 50% 28% Q 65% 35% 79% 62%"
                    stroke="rgba(6, 182, 212, 0.25)"
                    strokeWidth="1.5"
                    strokeDasharray="4 4"
                    fill="none"
                  />
                  <path
                    d="M 19% 44% Q 25% 40% 30% 38%"
                    stroke="rgba(16, 185, 129, 0.25)"
                    strokeWidth="1.5"
                    strokeDasharray="4 4"
                    fill="none"
                  />
                </svg>

                {/* Interactive Map Pins */}
                {filteredSpaces.map((space) => {
                  const isSelected = activeSpotlight?.id === space.id;
                  return (
                    <div
                      key={space.id}
                      onClick={() => setSelectedMapSpace(space)}
                      style={{
                        left: `${space.coords.x}%`,
                        top: `${space.coords.y}%`,
                        transform: `translate(-50%, -50%) scale(${isSelected ? 1.15 : 1})`,
                      }}
                      className="absolute z-20 cursor-pointer group transition-transform duration-200"
                    >
                      {/* Thermal Heatmap Glow Ring */}
                      {showHeatmap && (
                        <div
                          className={`absolute -inset-4 rounded-full blur-md opacity-40 animate-pulse pointer-events-none ${
                            space.occupancy / space.capacity > 0.7
                              ? 'bg-amber-500'
                              : 'bg-emerald-500'
                          }`}
                        />
                      )}

                      {/* Radar Pulse Halo */}
                      <span className="absolute -inset-2 rounded-full border border-emerald-400/50 animate-ping pointer-events-none" />

                      {/* Pin Pill Marker */}
                      <div
                        className={`px-2.5 py-1 rounded-full text-xs font-mono font-bold flex items-center space-x-1.5 shadow-2xl transition-all ${
                          isSelected
                            ? 'bg-emerald-500 text-slate-950 ring-4 ring-emerald-500/40 shadow-glow'
                            : 'bg-slate-950/90 text-white border border-emerald-500/50 hover:border-emerald-400 hover:scale-105'
                        }`}
                      >
                        <span
                          className={`w-2 h-2 rounded-full ${
                            isSelected ? 'bg-slate-950' : 'bg-emerald-400 animate-pulse'
                          }`}
                        />
                        <span>${space.hourlyPrice}</span>
                        <span className="text-[10px] opacity-75 font-normal">/hr</span>
                      </div>

                      {/* Hover / Selected Label Badge */}
                      <div
                        className={`absolute left-1/2 -translate-x-1/2 mt-1.5 whitespace-nowrap px-2 py-0.5 rounded-md text-[10px] font-mono transition-opacity ${
                          isSelected
                            ? 'bg-slate-950/95 text-emerald-300 border border-emerald-500/40 opacity-100'
                            : 'bg-slate-950/80 text-slate-400 opacity-0 group-hover:opacity-100'
                        }`}
                      >
                        {space.city} • {space.matchScore}%
                      </div>
                    </div>
                  );
                })}

                {/* Floating Map Spotlight Card */}
                {activeSpotlight && (
                  <div className="absolute bottom-4 left-4 right-4 sm:left-auto sm:right-4 sm:w-80 z-30 p-4 rounded-2xl bg-slate-950/90 backdrop-blur-xl border border-emerald-500/40 shadow-2xl space-y-3 animate-in fade-in slide-in-from-bottom-2 duration-200">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center space-x-2">
                        <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 text-[10px] font-mono font-bold border border-emerald-500/30">
                          {activeSpotlight.matchScore}% Match
                        </span>
                        <span className="text-[10px] text-slate-400 font-mono">
                          {activeSpotlight.coords.region}
                        </span>
                      </div>
                      <button
                        type="button"
                        onClick={() => setSelectedMapSpace(null)}
                        className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 cursor-pointer"
                        title="Dismiss spotlight"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <div>
                      <h4 className="text-sm font-bold text-white leading-tight">
                        {activeSpotlight.title}
                      </h4>
                      <p className="text-[11px] text-slate-400 flex items-center space-x-1 mt-0.5">
                        <MapPin className="w-3 h-3 text-emerald-400" />
                        <span>{activeSpotlight.district}, {activeSpotlight.city}</span>
                      </p>
                    </div>

                    {/* Telemetry Micro Grid */}
                    <div className="grid grid-cols-3 gap-1.5 p-2 rounded-xl bg-[#0b1326] border border-white/5 text-[10px] font-mono">
                      <div>
                        <span className="text-slate-500 block">OCCUPANCY</span>
                        <span className="text-emerald-400 font-bold">
                          {activeSpotlight.occupancy}/{activeSpotlight.capacity}
                        </span>
                      </div>
                      <div>
                        <span className="text-slate-500 block">IAQ AIR</span>
                        <span className="text-cyan-400 font-bold">{activeSpotlight.iaq} Opt</span>
                      </div>
                      <div>
                        <span className="text-slate-500 block">NOISE</span>
                        <span className="text-purple-400 font-bold">{activeSpotlight.noise} dB</span>
                      </div>
                    </div>

                    {/* CTAs */}
                    <div className="flex items-center justify-between pt-1">
                      <div>
                        <span className="text-base font-extrabold text-white font-mono">
                          ${activeSpotlight.hourlyPrice}
                        </span>
                        <span className="text-[10px] text-slate-400">/hr</span>
                      </div>

                      <div className="flex items-center space-x-2">
                        <Link
                          href={`/spaces/${activeSpotlight.slug}/live`}
                          className="px-2.5 py-1.5 rounded-xl bg-cyan-500/20 text-cyan-400 hover:bg-cyan-500/30 border border-cyan-500/30 text-xs font-semibold flex items-center space-x-1 transition-colors"
                        >
                          <Activity className="w-3.5 h-3.5" />
                          <span>Nexus Live</span>
                        </Link>
                        <Link
                          href={`/spaces/${activeSpotlight.slug}`}
                          className="px-3 py-1.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs flex items-center space-x-1 shadow-glow transition-colors"
                        >
                          <span>Reserve</span>
                          <ArrowRight className="w-3 h-3" />
                        </Link>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Bottom Synchronized Space Ribbon */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs text-slate-400">
                  <span className="font-semibold uppercase tracking-wider">
                    Workspaces on Map ({filteredSpaces.length})
                  </span>
                  <span className="text-[11px] text-emerald-400 font-mono">
                    Click card to focus map node
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                  {filteredSpaces.map((space) => {
                    const isSelected = activeSpotlight?.id === space.id;
                    return (
                      <div
                        key={space.id}
                        onClick={() => setSelectedMapSpace(space)}
                        className={`p-3 rounded-2xl border transition-all cursor-pointer ${
                          isSelected
                            ? 'bg-[#131b2e] border-emerald-500/50 shadow-glow'
                            : 'bg-[#0b1326] border-white/5 hover:border-white/20'
                        }`}
                      >
                        <div className="flex items-start justify-between">
                          <div>
                            <div className="font-bold text-xs text-white truncate max-w-[170px]">
                              {space.title}
                            </div>
                            <div className="text-[10px] text-slate-400 flex items-center space-x-1">
                              <MapPin className="w-3 h-3 text-emerald-400" />
                              <span>{space.city}</span>
                            </div>
                          </div>
                          <span className="text-xs font-mono font-bold text-emerald-400">
                            ${space.hourlyPrice}/hr
                          </span>
                        </div>

                        <div className="mt-2 pt-2 border-t border-white/5 flex items-center justify-between text-[10px] font-mono text-slate-400">
                          <span>{space.occupancy}/{space.capacity} Occupied</span>
                          <span className="text-cyan-400">{space.matchScore}% Match</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          ) : (
            /* VIEW MODE: LIST CARDS GRID */
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {filteredSpaces.map((space) => (
                <div
                  key={space.id}
                  className="glass-panel rounded-2xl overflow-hidden hover:border-emerald-500/40 transition-all flex flex-col group relative border border-white/10"
                >
                  {/* Image & Badges */}
                  <div className="relative h-48 w-full overflow-hidden">
                    <img
                      src={space.image}
                      alt={space.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#060e20] via-transparent to-transparent opacity-90" />

                    {/* Top Floating Match Badge */}
                    <div className="absolute top-3 left-3 flex items-center space-x-2">
                      <div
                        onMouseEnter={() => setHoveredReasonId(space.id)}
                        onMouseLeave={() => setHoveredReasonId(null)}
                        className="cursor-pointer px-2.5 py-1 rounded-xl bg-slate-950/85 backdrop-blur-md border border-emerald-500/50 text-emerald-400 font-bold text-xs flex items-center space-x-1.5 shadow-glow"
                      >
                        <Sparkles className="w-3.5 h-3.5 fill-emerald-400 text-emerald-400" />
                        <span className="font-mono">{space.matchScore}% Match</span>
                        <Info className="w-3 h-3 text-slate-400" />
                      </div>

                      {/* Popover on hover */}
                      {hoveredReasonId === space.id && (
                        <div className="absolute top-8 left-0 z-50 w-72 p-3.5 rounded-2xl bg-slate-950/95 backdrop-blur-xl border border-emerald-500/40 text-xs text-slate-300 space-y-2 shadow-2xl">
                          <p className="font-bold text-emerald-400">Why this match?</p>
                          <ul className="space-y-1">
                            {space.reasons.map((r, idx) => (
                              <li key={idx} className="flex items-start space-x-1.5 text-[11px] leading-tight">
                                <span className="text-emerald-400">•</span>
                                <span>{r}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>

                    {/* Live Occupancy Dot */}
                    <div className="absolute top-3 right-3 px-2.5 py-1 rounded-xl bg-slate-950/85 backdrop-blur-md border border-white/10 text-xs text-slate-300 font-mono flex items-center space-x-1.5">
                      <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
                      <span>{space.occupancy}/{space.capacity} Occupied</span>
                    </div>

                    {/* Location Banner */}
                    <div className="absolute bottom-3 left-3 text-xs text-slate-300 flex items-center space-x-1">
                      <MapPin className="w-3.5 h-3.5 text-emerald-400" />
                      <span>{space.district}, {space.city}</span>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider">
                          {space.type.replace('_', ' ')}
                        </span>
                        <div className="flex items-center space-x-1 text-amber-400 text-xs font-bold">
                          <Star className="w-3.5 h-3.5 fill-amber-400" />
                          <span>{space.rating}</span>
                          <span className="text-slate-500 font-normal">({space.reviews})</span>
                        </div>
                      </div>

                      <h3 className="text-base font-bold text-white group-hover:text-emerald-400 transition-colors">
                        {space.title}
                      </h3>

                      {/* Highlighting tags */}
                      <div className="flex flex-wrap gap-1.5 pt-1">
                        {space.badges.map((b, idx) => (
                          <span
                            key={idx}
                            className="text-[10px] px-2 py-0.5 rounded-full bg-white/5 border border-white/10 text-slate-300"
                          >
                            {b}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Pricing & CTA */}
                    <div className="pt-3 border-t border-white/10 flex items-center justify-between">
                      <div>
                        <span className="text-xl font-extrabold text-white font-mono">${space.hourlyPrice}</span>
                        <span className="text-xs text-slate-400"> / hr</span>
                        <span className="text-[10px] text-slate-500 block">or ${space.dailyPrice}/day</span>
                      </div>

                      <div className="flex items-center space-x-2">
                        <Link
                          href={`/spaces/${space.slug}/live`}
                          className="p-2 rounded-xl glass-panel text-emerald-400 hover:text-emerald-300 transition-colors"
                          title="View NexusSpace Live Telemetry"
                        >
                          <Activity className="w-4 h-4" />
                        </Link>
                        <Link
                          href={`/spaces/${space.slug}`}
                          className="px-3.5 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs transition-all flex items-center space-x-1 shadow-glow"
                        >
                          <span>Reserve</span>
                          <ArrowRight className="w-3.5 h-3.5" />
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
