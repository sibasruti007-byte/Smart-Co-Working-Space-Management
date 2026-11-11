'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import {
  Search,
  Filter,
  SlidersHorizontal,
  MapPin,
  Users,
  Star,
  Check,
  Building2,
  Sparkles,
  ArrowRight,
  Activity,
  Layers,
  Map as MapIcon,
  List,
  Info,
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
          <div className="flex items-center space-x-2 bg-[#0b1326] p-1 rounded-xl border border-white/10">
            <button
              onClick={() => setViewMode('list')}
              className={`p-1.5 rounded-lg text-xs font-semibold flex items-center space-x-1.5 ${
                viewMode === 'list' ? 'bg-emerald-500 text-slate-950' : 'text-slate-400 hover:text-white'
              }`}
            >
              <List className="w-4 h-4" />
              <span>List</span>
            </button>
            <button
              onClick={() => setViewMode('map')}
              className={`p-1.5 rounded-lg text-xs font-semibold flex items-center space-x-1.5 ${
                viewMode === 'map' ? 'bg-emerald-500 text-slate-950' : 'text-slate-400 hover:text-white'
              }`}
            >
              <MapIcon className="w-4 h-4" />
              <span>Map</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Body */}
      <div className="max-w-7xl mx-auto px-6 py-8 flex-1 w-full grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Filter Sidebar */}
        <aside className="space-y-6">
          <div className="glass-panel p-6 rounded-2xl space-y-6 sticky top-24">
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
                className="text-[11px] text-slate-500 hover:text-emerald-400 transition-colors"
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
                    className={`w-full text-left px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                      selectedType === t
                        ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
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
                (Ranked by Matching Engine)
              </span>
            </h2>

            {/* Sort Dropdown */}
            <div className="flex items-center space-x-2 text-xs">
              <span className="text-slate-500">Sort by:</span>
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

          {/* Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {filteredSpaces.map((space) => (
              <div
                key={space.id}
                className="glass-panel rounded-2xl overflow-hidden hover:border-emerald-500/40 transition-all flex flex-col group relative"
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
        </section>
      </div>
    </div>
  );
}

