'use client';

import Link from 'next/link';
import {
  Calendar,
  Heart,
  MessageSquare,
  Sparkles,
  ArrowRight,
  Building2,
  Clock,
  CheckCircle2,
  Activity,
  QrCode,
  MapPin,
} from 'lucide-react';

export default function UserDashboardPage() {
  return (
    <div className="min-h-screen bg-[#060e20] text-slate-100 p-6 sm:p-10 space-y-8">
      {/* Top Header */}
      <div className="max-w-6xl mx-auto flex items-center justify-between border-b border-white/10 pb-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white">Attendee Dashboard</h1>
          <p className="text-xs text-slate-400">Manage your active reservations, digital access passes, and inquiries.</p>
        </div>
        <Link
          href="/spaces"
          className="px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs transition-all shadow-glow flex items-center space-x-1.5"
        >
          <span>Find New Space</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>

      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Active Bookings & Digital Pass */}
        <div className="lg:col-span-2 space-y-6">
          <div className="space-y-3">
            <h2 className="text-sm font-bold text-slate-300 uppercase tracking-wider flex items-center space-x-2">
              <Calendar className="w-4 h-4 text-emerald-400" />
              <span>Active Reservations & Passes</span>
            </h2>

            {/* Active Booking Card */}
            <div className="glass-panel-accent p-6 rounded-3xl space-y-4 border border-emerald-500/30">
              <div className="flex items-start justify-between">
                <div>
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 font-semibold border border-emerald-500/30">
                    Confirmed • Today
                  </span>
                  <h3 className="text-lg font-bold text-white pt-1">Apex Executive Suite • Flatiron NYC</h3>
                  <div className="flex items-center space-x-2 text-xs text-slate-400 pt-0.5">
                    <MapPin className="w-3.5 h-3.5 text-slate-500" />
                    <span>Flatiron District, New York, NY</span>
                  </div>
                </div>

                <div className="h-12 w-12 rounded-2xl bg-[#0b1326] border border-white/10 flex items-center justify-center text-emerald-400 shadow-glow">
                  <QrCode className="w-7 h-7" />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3 p-3 rounded-2xl bg-[#0b1326] border border-white/5 text-xs">
                <div>
                  <span className="text-slate-500 text-[10px] block">Date</span>
                  <span className="font-semibold text-white">Today, Nov 15</span>
                </div>
                <div>
                  <span className="text-slate-500 text-[10px] block">Time Slot</span>
                  <span className="font-semibold text-white">09:00 - 17:00</span>
                </div>
                <div>
                  <span className="text-slate-500 text-[10px] block">Attendees</span>
                  <span className="font-semibold text-white">6 Members</span>
                </div>
              </div>

              <div className="flex items-center justify-between pt-1">
                <Link
                  href="/spaces/apex-executive-suite/live"
                  className="text-xs text-emerald-400 font-semibold hover:underline flex items-center space-x-1"
                >
                  <Activity className="w-3.5 h-3.5" />
                  <span>Open NexusSpace Telemetry Floorplan</span>
                </Link>
                <button
                  type="button"
                  className="text-xs text-rose-400 hover:text-rose-300 transition-colors"
                >
                  Cancel Reservation
                </button>
              </div>
            </div>
          </div>

          {/* Saved Spaces */}
          <div className="space-y-3">
            <h2 className="text-sm font-bold text-slate-300 uppercase tracking-wider flex items-center space-x-2">
              <Heart className="w-4 h-4 text-rose-400" />
              <span>Saved Workspaces</span>
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="glass-panel p-4 rounded-2xl space-y-2">
                <h4 className="font-bold text-sm text-white">Quantum Loft Studios • Berlin</h4>
                <p className="text-xs text-slate-400">Mitte District • $35/hr</p>
                <Link
                  href="/spaces"
                  className="text-xs text-emerald-400 font-semibold inline-block pt-1 hover:underline"
                >
                  Book Slot →
                </Link>
              </div>

              <div className="glass-panel p-4 rounded-2xl space-y-2">
                <h4 className="font-bold text-sm text-white">Silicon Foundry Pod • SoMa</h4>
                <p className="text-xs text-slate-400">San Francisco, CA • $42/hr</p>
                <Link
                  href="/spaces"
                  className="text-xs text-emerald-400 font-semibold inline-block pt-1 hover:underline"
                >
                  Book Slot →
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Inquiries & Recommendations */}
        <div className="space-y-6">
          {/* Active Inquiries */}
          <div className="glass-panel p-5 rounded-2xl space-y-4">
            <h2 className="text-sm font-bold text-white uppercase tracking-wider flex items-center space-x-2">
              <MessageSquare className="w-4 h-4 text-cyan-400" />
              <span>Inquiry Conversations</span>
            </h2>
            <div className="space-y-3 text-xs">
              <div className="p-3 rounded-xl bg-[#0b1326] border border-white/5 space-y-1">
                <div className="flex justify-between font-bold text-white">
                  <span>Apex Suite Operator</span>
                  <span className="text-[10px] text-slate-500 font-normal">2h ago</span>
                </div>
                <p className="text-slate-400 truncate">&ldquo;Redundant fiber and 100W PD hubs are ready...&rdquo;</p>
              </div>
            </div>
          </div>

          {/* Similar Teams Recommendations */}
          <div className="glass-panel p-5 rounded-2xl space-y-3">
            <h2 className="text-sm font-bold text-white uppercase tracking-wider flex items-center space-x-2">
              <Sparkles className="w-4 h-4 text-emerald-400" />
              <span>Similar Teams In Your City</span>
            </h2>
            <p className="text-xs text-slate-400 leading-relaxed">
              Based on your collaborative workstyle and 6-person team size, these verified teams are seeking co-working space sharing:
            </p>
            <div className="space-y-2 text-xs">
              <div className="p-3 rounded-xl bg-[#0b1326] border border-white/5 flex items-center justify-between">
                <div>
                  <span className="font-bold text-white block">AI Research Collective</span>
                  <span className="text-[10px] text-slate-500">8 Members • New York, NY</span>
                </div>
                <span className="px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 font-mono text-[10px] border border-emerald-500/20 font-bold">
                  98% Fit
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
