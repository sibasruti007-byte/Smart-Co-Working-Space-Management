'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
  Building2,
  DollarSign,
  Users,
  CheckCircle2,
  XCircle,
  Clock,
  Activity,
  PlusCircle,
  Calendar,
  AlertCircle,
  TrendingUp,
  MapPin,
  ExternalLink,
  ChevronRight,
  ShieldCheck,
} from 'lucide-react';

interface PendingBooking {
  id: string;
  guestName: string;
  workspaceName: string;
  date: string;
  timeSlot: string;
  seats: number;
  totalPrice: number;
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
}

const INITIAL_REQUESTS: PendingBooking[] = [
  {
    id: 'req-1',
    guestName: 'Alex Rivera (SaaS Labs)',
    workspaceName: 'Apex Executive Suite',
    date: 'Nov 16, 2026',
    timeSlot: '09:00 - 18:00',
    seats: 8,
    totalPrice: 480,
    status: 'PENDING',
  },
  {
    id: 'req-2',
    guestName: 'Elena Rostova (Fintech AI)',
    workspaceName: 'SoHo Creative Loft',
    date: 'Nov 17, 2026',
    timeSlot: '13:00 - 17:00',
    seats: 4,
    totalPrice: 220,
    status: 'PENDING',
  },
  {
    id: 'req-3',
    guestName: 'Marcus Vance (Solo Founder)',
    workspaceName: 'Battery Park Hot-Desks',
    date: 'Nov 18, 2026',
    timeSlot: 'Full Day (08:00 - 20:00)',
    seats: 1,
    totalPrice: 45,
    status: 'PENDING',
  },
];

export default function SpaceOwnerDashboardPage() {
  const [requests, setRequests] = useState<PendingBooking[]>(INITIAL_REQUESTS);
  const [notification, setNotification] = useState<string | null>(null);

  const handleAction = (id: string, action: 'APPROVED' | 'REJECTED') => {
    setRequests((prev) =>
      prev.map((r) => (r.id === id ? { ...r, status: action } : r))
    );
    setNotification(
      `Booking request #${id.slice(-4)} has been ${action.toLowerCase()}.`
    );
    setTimeout(() => setNotification(null), 4000);
  };

  return (
    <div className="min-h-screen bg-[#060e20] text-slate-100 p-6 sm:p-10 space-y-8">
      {/* Toast Notification */}
      {notification && (
        <div className="fixed bottom-6 right-6 z-50 px-4 py-3 rounded-2xl bg-emerald-500/90 text-slate-950 font-bold text-xs shadow-glow flex items-center space-x-2 animate-bounce">
          <CheckCircle2 className="w-4 h-4" />
          <span>{notification}</span>
        </div>
      )}

      {/* Top Header */}
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-6">
        <div>
          <div className="flex items-center space-x-2">
            <h1 className="text-2xl font-bold tracking-tight text-white">Space Owner Command Center</h1>
            <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
              Verified Partner
            </span>
          </div>
          <p className="text-xs text-slate-400 pt-1">
            Real-time management for listings, booking approvals, and sensor telemetry.
          </p>
        </div>

        <div className="flex items-center space-x-3">
          <Link
            href="/spaces/apex-executive-suite/owner-telemetry"
            className="px-4 py-2 rounded-xl bg-[#131b2e] hover:bg-slate-800 border border-white/10 text-xs font-semibold text-slate-200 transition-colors flex items-center space-x-1.5"
          >
            <Activity className="w-3.5 h-3.5 text-cyan-400" />
            <span>Live Portfolio Telemetry</span>
          </Link>
          <button
            type="button"
            onClick={() => alert('New listing modal opens: configure capacity, amenities, and hourly pricing.')}
            className="px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs transition-all shadow-glow flex items-center space-x-1.5"
          >
            <PlusCircle className="w-3.5 h-3.5" />
            <span>Create New Listing</span>
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto space-y-8">
        {/* KPI Metrics Strip */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="glass-panel p-5 rounded-2xl border border-white/5 space-y-2">
            <div className="flex items-center justify-between text-slate-400">
              <span className="text-xs font-semibold uppercase tracking-wider">Active Spaces</span>
              <Building2 className="w-4 h-4 text-emerald-400" />
            </div>
            <div className="text-2xl font-bold text-white tracking-tight">3 Workspaces</div>
            <div className="text-[11px] text-emerald-400 flex items-center space-x-1">
              <ShieldCheck className="w-3 h-3" />
              <span>All 3 listings approved</span>
            </div>
          </div>

          <div className="glass-panel p-5 rounded-2xl border border-white/5 space-y-2">
            <div className="flex items-center justify-between text-slate-400">
              <span className="text-xs font-semibold uppercase tracking-wider">Live Occupancy</span>
              <Users className="w-4 h-4 text-cyan-400" />
            </div>
            <div className="text-2xl font-bold text-white tracking-tight font-mono">74.2%</div>
            <div className="text-[11px] text-slate-400">38 of 52 desks occupied</div>
          </div>

          <div className="glass-panel p-5 rounded-2xl border border-white/5 space-y-2">
            <div className="flex items-center justify-between text-slate-400">
              <span className="text-xs font-semibold uppercase tracking-wider">Monthly Revenue</span>
              <DollarSign className="w-4 h-4 text-emerald-400" />
            </div>
            <div className="text-2xl font-bold text-white tracking-tight font-mono">$28,450</div>
            <div className="text-[11px] text-emerald-400 flex items-center space-x-1">
              <TrendingUp className="w-3 h-3" />
              <span>+18.4% vs last month</span>
            </div>
          </div>

          <div className="glass-panel p-5 rounded-2xl border border-white/5 space-y-2">
            <div className="flex items-center justify-between text-slate-400">
              <span className="text-xs font-semibold uppercase tracking-wider">Pending Approvals</span>
              <AlertCircle className="w-4 h-4 text-amber-400" />
            </div>
            <div className="text-2xl font-bold text-amber-400 tracking-tight font-mono">
              {requests.filter((r) => r.status === 'PENDING').length} Requests
            </div>
            <div className="text-[11px] text-slate-400">Requires review within 24h</div>
          </div>
        </div>

        {/* Pending Booking Requests Section */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-white flex items-center space-x-2">
              <Clock className="w-4 h-4 text-amber-400" />
              <span>Incoming Booking Requests</span>
            </h2>
            <span className="text-xs text-slate-400">
              Auto-expire countdown enforced by BullMQ queue
            </span>
          </div>

          <div className="space-y-3">
            {requests.map((req) => (
              <div
                key={req.id}
                className="glass-panel p-5 rounded-2xl border border-white/5 flex flex-col md:flex-row md:items-center justify-between gap-4 transition-all hover:border-white/10"
              >
                <div className="space-y-1">
                  <div className="flex items-center space-x-3">
                    <span className="font-bold text-white text-sm">{req.guestName}</span>
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 border border-white/10">
                      {req.workspaceName}
                    </span>
                    {req.status === 'APPROVED' && (
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 font-semibold border border-emerald-500/30">
                        Approved
                      </span>
                    )}
                    {req.status === 'REJECTED' && (
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-rose-500/20 text-rose-400 font-semibold border border-rose-500/30">
                        Declined
                      </span>
                    )}
                  </div>
                  <div className="flex flex-wrap items-center gap-3 text-xs text-slate-400">
                    <span className="flex items-center space-x-1">
                      <Calendar className="w-3 h-3 text-slate-500" />
                      <span>{req.date}</span>
                    </span>
                    <span>•</span>
                    <span className="flex items-center space-x-1">
                      <Clock className="w-3 h-3 text-slate-500" />
                      <span>{req.timeSlot}</span>
                    </span>
                    <span>•</span>
                    <span>{req.seats} Attendees</span>
                    <span>•</span>
                    <span className="font-mono font-bold text-emerald-400">${req.totalPrice}</span>
                  </div>
                </div>

                <div className="flex items-center space-x-2 self-end md:self-center">
                  {req.status === 'PENDING' ? (
                    <>
                      <button
                        type="button"
                        onClick={() => handleAction(req.id, 'APPROVED')}
                        className="px-3.5 py-1.5 rounded-xl bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-400 border border-emerald-500/30 text-xs font-semibold transition-colors flex items-center space-x-1.5"
                      >
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>Accept Request</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => handleAction(req.id, 'REJECTED')}
                        className="px-3.5 py-1.5 rounded-xl bg-rose-500/20 hover:bg-rose-500/30 text-rose-400 border border-rose-500/30 text-xs font-semibold transition-colors flex items-center space-x-1.5"
                      >
                        <XCircle className="w-3.5 h-3.5" />
                        <span>Decline</span>
                      </button>
                    </>
                  ) : (
                    <span className="text-xs text-slate-500 italic">Action processed</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Managed Workspaces Portfolio Grid */}
        <div className="space-y-4">
          <h2 className="text-base font-bold text-white flex items-center space-x-2">
            <Building2 className="w-4 h-4 text-emerald-400" />
            <span>Your Listed Spaces</span>
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Space 1 */}
            <div className="glass-panel p-5 rounded-3xl border border-white/5 space-y-4 flex flex-col justify-between">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 font-semibold border border-emerald-500/30">
                    APPROVED & LIVE
                  </span>
                  <span className="text-xs font-mono text-slate-400">18 / 24 Desks</span>
                </div>
                <div>
                  <h3 className="font-bold text-white text-base">Apex Executive Suite</h3>
                  <p className="text-xs text-slate-400 flex items-center space-x-1 pt-0.5">
                    <MapPin className="w-3 h-3 text-slate-500" />
                    <span>Flatiron District, New York, NY</span>
                  </p>
                </div>
                <div className="p-3 rounded-2xl bg-[#0b1326] border border-white/5 grid grid-cols-2 gap-2 text-xs">
                  <div>
                    <span className="text-slate-500 text-[10px] block">Hourly Rate</span>
                    <span className="font-semibold text-white font-mono">$60 / hr</span>
                  </div>
                  <div>
                    <span className="text-slate-500 text-[10px] block">Daily Rate</span>
                    <span className="font-semibold text-white font-mono">$320 / day</span>
                  </div>
                </div>
              </div>

              <div className="space-y-2 pt-2 border-t border-white/5">
                <Link
                  href="/spaces/apex-executive-suite/live"
                  className="w-full py-2 rounded-xl bg-cyan-500/10 hover:bg-cyan-500/20 border border-cyan-500/30 text-cyan-400 text-xs font-semibold transition-colors flex items-center justify-center space-x-1.5"
                >
                  <Activity className="w-3.5 h-3.5" />
                  <span>NexusSpace Floorplan & Desks</span>
                </Link>
                <Link
                  href="/spaces/apex-executive-suite/owner-telemetry"
                  className="w-full py-2 rounded-xl bg-slate-800/80 hover:bg-slate-700 border border-white/5 text-slate-300 text-xs font-semibold transition-colors flex items-center justify-center space-x-1"
                >
                  <span>Sensor Heatmap & Analytics</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>

            {/* Space 2 */}
            <div className="glass-panel p-5 rounded-3xl border border-white/5 space-y-4 flex flex-col justify-between">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 font-semibold border border-emerald-500/30">
                    APPROVED & LIVE
                  </span>
                  <span className="text-xs font-mono text-slate-400">12 / 16 Desks</span>
                </div>
                <div>
                  <h3 className="font-bold text-white text-base">SoHo Creative Loft</h3>
                  <p className="text-xs text-slate-400 flex items-center space-x-1 pt-0.5">
                    <MapPin className="w-3 h-3 text-slate-500" />
                    <span>SoHo, New York, NY</span>
                  </p>
                </div>
                <div className="p-3 rounded-2xl bg-[#0b1326] border border-white/5 grid grid-cols-2 gap-2 text-xs">
                  <div>
                    <span className="text-slate-500 text-[10px] block">Hourly Rate</span>
                    <span className="font-semibold text-white font-mono">$45 / hr</span>
                  </div>
                  <div>
                    <span className="text-slate-500 text-[10px] block">Daily Rate</span>
                    <span className="font-semibold text-white font-mono">$240 / day</span>
                  </div>
                </div>
              </div>

              <div className="space-y-2 pt-2 border-t border-white/5">
                <Link
                  href="/spaces"
                  className="w-full py-2 rounded-xl bg-[#131b2e] hover:bg-slate-800 border border-white/10 text-slate-300 text-xs font-semibold transition-colors flex items-center justify-center space-x-1.5"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  <span>Public Listing Page</span>
                </Link>
                <button
                  type="button"
                  onClick={() => alert('Pricing updated successfully!')}
                  className="w-full py-2 rounded-xl bg-slate-800/80 hover:bg-slate-700 border border-white/5 text-slate-300 text-xs font-semibold transition-colors"
                >
                  Adjust Pricing Rules
                </button>
              </div>
            </div>

            {/* Space 3 */}
            <div className="glass-panel p-5 rounded-3xl border border-white/5 space-y-4 flex flex-col justify-between">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 font-semibold border border-emerald-500/30">
                    APPROVED & LIVE
                  </span>
                  <span className="text-xs font-mono text-slate-400">8 / 12 Desks</span>
                </div>
                <div>
                  <h3 className="font-bold text-white text-base">Battery Park Hot-Desks</h3>
                  <p className="text-xs text-slate-400 flex items-center space-x-1 pt-0.5">
                    <MapPin className="w-3 h-3 text-slate-500" />
                    <span>Battery Park, New York, NY</span>
                  </p>
                </div>
                <div className="p-3 rounded-2xl bg-[#0b1326] border border-white/5 grid grid-cols-2 gap-2 text-xs">
                  <div>
                    <span className="text-slate-500 text-[10px] block">Hourly Rate</span>
                    <span className="font-semibold text-white font-mono">$30 / hr</span>
                  </div>
                  <div>
                    <span className="text-slate-500 text-[10px] block">Daily Rate</span>
                    <span className="font-semibold text-white font-mono">$160 / day</span>
                  </div>
                </div>
              </div>

              <div className="space-y-2 pt-2 border-t border-white/5">
                <Link
                  href="/spaces"
                  className="w-full py-2 rounded-xl bg-[#131b2e] hover:bg-slate-800 border border-white/10 text-slate-300 text-xs font-semibold transition-colors flex items-center justify-center space-x-1.5"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  <span>Public Listing Page</span>
                </Link>
                <button
                  type="button"
                  onClick={() => alert('Space availability toggled to Active.')}
                  className="w-full py-2 rounded-xl bg-slate-800/80 hover:bg-slate-700 border border-white/5 text-slate-300 text-xs font-semibold transition-colors"
                >
                  Manage Availability Slots
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
