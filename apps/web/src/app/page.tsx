import Link from 'next/link';
import { ArrowRight, Activity, ShieldCheck, Sparkles, Building2, MapPin, Zap } from 'lucide-react';

export default function HomePage() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-between p-6 sm:p-12 relative overflow-hidden">
      {/* Background radial gradient glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-emerald-500/10 rounded-full blur-[140px] pointer-events-none -z-10" />
      <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-cyan-500/10 rounded-full blur-[120px] pointer-events-none -z-10" />

      {/* Navigation Header */}
      <header className="w-full max-w-6xl flex items-center justify-between py-4 border-b border-white/10 glass-panel px-6 rounded-2xl">
        <div className="flex items-center space-x-3">
          <div className="h-10 w-10 rounded-xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400 font-bold">
            <Building2 className="w-5 h-5 text-emerald-400" />
          </div>
          <span className="text-xl font-bold tracking-tight text-white">SmartSpace</span>
        </div>
        <nav className="flex items-center space-x-4">
          <Link
            href="/spaces"
            className="text-sm font-medium text-slate-300 hover:text-white transition-colors"
          >
            Explore Spaces
          </Link>
          <Link
            href="/spaces/metrohub-4th-floor/live"
            className="text-sm font-medium text-emerald-400 hover:text-emerald-300 flex items-center space-x-1 transition-colors"
          >
            <Activity className="w-4 h-4 inline" />
            <span>NexusSpace Live</span>
          </Link>
          <Link
            href="/login"
            className="text-sm px-4 py-2 rounded-lg bg-emerald-500 text-slate-950 font-semibold hover:bg-emerald-400 transition-colors shadow-glow"
          >
            Sign In
          </Link>
        </nav>
      </header>

      {/* Hero Section */}
      <section className="w-full max-w-4xl text-center my-16 space-y-6">
        <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-semibold uppercase tracking-wider">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Real-Time Telemetry & Matching Platform</span>
        </div>

        <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-white leading-tight">
          Next-Generation Workspaces with <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-cyan-400 to-sky-300">
            Intelligent Telemetry
          </span>
        </h1>

        <p className="text-lg sm:text-xl text-slate-400 max-w-2xl mx-auto leading-relaxed">
          Discover, compare, and instantly reserve verified co-working spaces. Backed by mathematical double-booking prevention, real-time IoT floorplans, and smart capacity matching.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
          <Link
            href="/spaces"
            className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-emerald-500 text-slate-950 font-bold hover:bg-emerald-400 transition-all flex items-center justify-center space-x-2 shadow-glow"
          >
            <span>Explore 200+ Workspaces</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
          <Link
            href="/spaces/metrohub-4th-floor/live"
            className="w-full sm:w-auto px-8 py-3.5 rounded-xl glass-panel-accent text-emerald-300 border border-emerald-500/30 hover:border-emerald-500/60 transition-all flex items-center justify-center space-x-2"
          >
            <Activity className="w-4 h-4" />
            <span>Launch NexusSpace Telemetry</span>
          </Link>
        </div>
      </section>

      {/* 3 Value Pillars */}
      <section className="w-full max-w-5xl grid grid-cols-1 md:grid-cols-3 gap-6 my-8">
        <div className="glass-panel p-6 rounded-2xl space-y-3">
          <div className="h-10 w-10 rounded-lg bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
            <Zap className="w-5 h-5" />
          </div>
          <h3 className="text-lg font-semibold text-white">Smart Matching Engine</h3>
          <p className="text-sm text-slate-400">
            Multi-factor weighted compatibility scoring (0-100) based on team size, budget, amenity coverage, and proximity.
          </p>
        </div>

        <div className="glass-panel p-6 rounded-2xl space-y-3">
          <div className="h-10 w-10 rounded-lg bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
            <Activity className="w-5 h-5" />
          </div>
          <h3 className="text-lg font-semibold text-white">Live IoT Telemetry</h3>
          <p className="text-sm text-slate-400">
            Monitor ambient noise dB, indoor air quality (CO₂/VOC), temperature, and live desk-by-desk availability on interactive floorplans.
          </p>
        </div>

        <div className="glass-panel p-6 rounded-2xl space-y-3">
          <div className="h-10 w-10 rounded-lg bg-sky-500/10 border border-sky-500/30 flex items-center justify-center text-sky-400">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <h3 className="text-lg font-semibold text-white">Zero Double-Booking Guarantee</h3>
          <p className="text-sm text-slate-400">
            Postgres temporal exclusion constraints (`tstzrange`) and serializable transactions guarantee concurrency safety.
          </p>
        </div>
      </section>

      {/* Global Locations Indicator */}
      <footer className="w-full max-w-6xl py-6 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 space-y-2 sm:space-y-0">
        <div className="flex items-center space-x-2">
          <MapPin className="w-4 h-4 text-emerald-400" />
          <span>Active Hubs: New York • San Francisco • London • Berlin • Singapore</span>
        </div>
        <p>© 2026 SmartSpace Platform Inc. All rights reserved.</p>
      </footer>
    </main>
  );
}

