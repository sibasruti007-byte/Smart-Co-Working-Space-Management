import Link from 'next/link';
import { ArrowRight, Activity, ShieldCheck, Sparkles, Building2, MapPin, Zap, User, Users, CheckCircle2 } from 'lucide-react';

export default function HomePage() {
  return (
    <div className="flex flex-col items-center justify-between p-6 sm:p-12 relative overflow-hidden">
      {/* Background radial gradient glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-emerald-500/10 rounded-full blur-[140px] pointer-events-none -z-10" />
      <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-cyan-500/10 rounded-full blur-[120px] pointer-events-none -z-10" />

      {/* Hero Section */}
      <section className="w-full max-w-4xl text-center my-12 space-y-6">
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
            href="/spaces/apex-executive-suite/live"
            className="w-full sm:w-auto px-8 py-3.5 rounded-xl glass-panel-accent text-emerald-300 border border-emerald-500/30 hover:border-emerald-500/60 transition-all flex items-center justify-center space-x-2"
          >
            <Activity className="w-4 h-4 text-cyan-400" />
            <span>Launch NexusSpace Telemetry</span>
          </Link>
        </div>
      </section>

      {/* 3 Value Pillars */}
      <section className="w-full max-w-5xl grid grid-cols-1 md:grid-cols-3 gap-6 my-8">
        <div className="glass-panel p-6 rounded-3xl space-y-3 border border-white/5">
          <div className="h-10 w-10 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
            <Zap className="w-5 h-5" />
          </div>
          <h3 className="text-lg font-semibold text-white">Smart Matching Engine</h3>
          <p className="text-sm text-slate-400 leading-relaxed">
            Multi-factor weighted compatibility scoring (0-100) based on team size, budget, amenity coverage, and proximity.
          </p>
        </div>

        <div className="glass-panel p-6 rounded-3xl space-y-3 border border-white/5">
          <div className="h-10 w-10 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
            <Activity className="w-5 h-5" />
          </div>
          <h3 className="text-lg font-semibold text-white">Live IoT Telemetry</h3>
          <p className="text-sm text-slate-400 leading-relaxed">
            Monitor ambient noise dB, indoor air quality (CO₂/VOC), temperature, and live desk-by-desk availability on interactive floorplans.
          </p>
        </div>

        <div className="glass-panel p-6 rounded-3xl space-y-3 border border-white/5">
          <div className="h-10 w-10 rounded-xl bg-sky-500/10 border border-sky-500/30 flex items-center justify-center text-sky-400">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <h3 className="text-lg font-semibold text-white">Zero Double-Booking Guarantee</h3>
          <p className="text-sm text-slate-400 leading-relaxed">
            Postgres temporal exclusion constraints (`tstzrange`) and serializable transactions guarantee concurrency safety.
          </p>
        </div>
      </section>

      {/* Role Navigation Tiles */}
      <section className="w-full max-w-5xl my-8 space-y-4">
        <div className="text-center space-y-1">
          <h2 className="text-sm font-bold uppercase tracking-wider text-slate-400">Role-Tailored Workflows</h2>
          <p className="text-xs text-slate-500">Select a portal to explore specialized capabilities</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Link
            href="/dashboard/user"
            className="glass-panel p-5 rounded-2xl border border-white/5 hover:border-emerald-500/30 transition-all space-y-2 group"
          >
            <div className="flex items-center justify-between text-slate-400">
              <span className="text-xs font-semibold text-emerald-400">Attendee Portal</span>
              <User className="w-4 h-4 text-emerald-400 group-hover:scale-110 transition-transform" />
            </div>
            <div className="text-base font-bold text-white">Passes & Recommendations</div>
            <div className="text-xs text-slate-400">Active bookings, digital QR pass, saved spaces, and similar teams.</div>
          </Link>

          <Link
            href="/dashboard/owner"
            className="glass-panel p-5 rounded-2xl border border-white/5 hover:border-cyan-500/30 transition-all space-y-2 group"
          >
            <div className="flex items-center justify-between text-slate-400">
              <span className="text-xs font-semibold text-cyan-400">Space Owner Command</span>
              <Building2 className="w-4 h-4 text-cyan-400 group-hover:scale-110 transition-transform" />
            </div>
            <div className="text-base font-bold text-white">Listings & Occupancy</div>
            <div className="text-xs text-slate-400">Review requests, set pricing, view foot traffic and sensor heatmaps.</div>
          </Link>

          <Link
            href="/dashboard/admin"
            className="glass-panel p-5 rounded-2xl border border-white/5 hover:border-purple-500/30 transition-all space-y-2 group"
          >
            <div className="flex items-center justify-between text-slate-400">
              <span className="text-xs font-semibold text-purple-400">Platform Admin</span>
              <ShieldCheck className="w-4 h-4 text-purple-400 group-hover:scale-110 transition-transform" />
            </div>
            <div className="text-base font-bold text-white">Moderation & Platform KPIs</div>
            <div className="text-xs text-slate-400">Verification queue, match accuracy KPIs, CSV report export, and audit logs.</div>
          </Link>
        </div>
      </section>
    </div>
  );
}
