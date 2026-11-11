'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
  Activity,
  ArrowLeft,
  Users,
  TrendingUp,
  Cpu,
  Zap,
  ArrowDownRight,
  ArrowUpRight,
  Clock,
  CheckCircle2,
} from 'lucide-react';

interface Props {
  params: Promise<{ slug: string }>;
}

export default function OwnerTelemetryPage() {
  const [occupancy, setOccupancy] = useState<number>(7);
  const capacity = 10;
  const occupancyPercent = Math.round((occupancy / capacity) * 100);

  const simulateCheckIn = () => setOccupancy((prev) => Math.min(capacity, prev + 1));
  const simulateCheckOut = () => setOccupancy((prev) => Math.max(0, prev - 1));

  const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  const hours = ['08:00', '10:00', '12:00', '14:00', '16:00', '18:00', '20:00'];

  const heatmapMatrix = [
    [20, 70, 80, 90, 85, 40, 10], // Mon
    [30, 85, 90, 100, 95, 50, 10], // Tue
    [30, 90, 95, 100, 90, 45, 15], // Wed
    [25, 80, 85, 90, 80, 35, 10], // Thu
    [15, 50, 60, 60, 40, 20, 5], // Fri
    [10, 25, 30, 35, 25, 15, 5], // Sat
    [5, 15, 20, 20, 15, 10, 0], // Sun
  ];

  return (
    <div className="min-h-screen bg-[#060e20] text-slate-100 p-6 sm:p-10 space-y-8">
      {/* Header */}
      <div className="max-w-6xl mx-auto flex items-center justify-between border-b border-white/10 pb-6">
        <div className="space-y-1">
          <div className="flex items-center space-x-3">
            <Link
              href="/spaces"
              className="text-slate-400 hover:text-white transition-colors flex items-center space-x-1 text-sm mr-2"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Spaces</span>
            </Link>
            <div className="h-8 w-8 rounded-lg bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400">
              <Activity className="w-4 h-4" />
            </div>
            <h1 className="text-2xl font-bold tracking-tight text-white">Owner Real-Time Telemetry & Heatmap</h1>
          </div>
          <p className="text-sm text-slate-400">
            Live turnstile check-ins, sensor diagnostics, and weekly utilization analytics for your space.
          </p>
        </div>

        {/* Sensor Simulation Action Bar */}
        <div className="flex items-center space-x-2">
          <button
            type="button"
            onClick={simulateCheckIn}
            className="px-3.5 py-1.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs transition-all shadow-glow flex items-center space-x-1.5"
          >
            <ArrowUpRight className="w-3.5 h-3.5" />
            <span>Simulate Check-In</span>
          </button>
          <button
            type="button"
            onClick={simulateCheckOut}
            className="px-3.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-semibold text-xs border border-white/10 transition-all flex items-center space-x-1.5"
          >
            <ArrowDownRight className="w-3.5 h-3.5" />
            <span>Simulate Check-Out</span>
          </button>
        </div>
      </div>

      {/* 4 Metric Cards */}
      <div className="max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="glass-panel p-5 rounded-2xl space-y-2">
          <span className="text-xs font-semibold text-slate-400 uppercase">Live Occupancy</span>
          <div className="flex items-baseline space-x-2">
            <span className="text-3xl font-extrabold text-white font-mono">{occupancy} / {capacity}</span>
            <span className="text-xs text-emerald-400 font-bold font-mono">({occupancyPercent}%)</span>
          </div>
          <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-500 ${
                occupancyPercent > 85 ? 'bg-amber-400' : 'bg-emerald-400'
              }`}
              style={{ width: `${occupancyPercent}%` }}
            />
          </div>
        </div>

        <div className="glass-panel p-5 rounded-2xl space-y-2">
          <span className="text-xs font-semibold text-slate-400 uppercase">Today&apos;s Traffic</span>
          <div className="flex items-baseline space-x-2">
            <span className="text-3xl font-extrabold text-white font-mono">48</span>
            <span className="text-xs text-slate-400">Check-ins</span>
          </div>
          <p className="text-xs text-slate-400">Peak at 2:00 PM (90% capacity)</p>
        </div>

        <div className="glass-panel p-5 rounded-2xl space-y-2">
          <span className="text-xs font-semibold text-slate-400 uppercase">Revenue This Month</span>
          <div className="flex items-baseline space-x-2">
            <span className="text-3xl font-extrabold text-emerald-400 font-mono">$14,820</span>
            <span className="text-xs text-emerald-400 font-semibold">(+18%)</span>
          </div>
          <p className="text-xs text-slate-400">38 confirmed reservations</p>
        </div>

        <div className="glass-panel p-5 rounded-2xl space-y-2">
          <span className="text-xs font-semibold text-slate-400 uppercase">IoT Sensor Gateway</span>
          <div className="flex items-center space-x-2">
            <span className="h-2.5 w-2.5 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-sm font-bold text-white">Online (Battery 98%)</span>
          </div>
          <p className="text-xs text-slate-400">Turnstile Controller #01 • 0 dropouts</p>
        </div>
      </div>

      {/* Weekly Hourly Utilization Heatmap */}
      <div className="max-w-6xl mx-auto glass-panel p-6 rounded-3xl space-y-6">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <h2 className="text-lg font-bold text-white flex items-center space-x-2">
              <TrendingUp className="w-5 h-5 text-emerald-400" />
              <span>Weekly Hourly Utilization Heatmap</span>
            </h2>
            <p className="text-xs text-slate-400">Percentage of seats occupied by day of week and operating hour.</p>
          </div>
          <div className="flex items-center space-x-2 text-[11px] text-slate-400">
            <span>Low (0%)</span>
            <div className="flex space-x-1">
              <span className="w-3 h-3 rounded bg-emerald-950" />
              <span className="w-3 h-3 rounded bg-emerald-900" />
              <span className="w-3 h-3 rounded bg-emerald-700" />
              <span className="w-3 h-3 rounded bg-emerald-500" />
            </div>
            <span>High (100%)</span>
          </div>
        </div>

        {/* Heatmap Grid Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-center text-xs">
            <thead>
              <tr className="border-b border-white/10 text-slate-400 font-semibold">
                <th className="py-2.5 px-4 text-left">Day</th>
                {hours.map((h) => (
                  <th key={h} className="py-2.5 px-3 font-mono">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {days.map((day, dIdx) => (
                <tr key={day} className="hover:bg-white/5 transition-colors">
                  <td className="py-3 px-4 text-left font-bold text-slate-300">{day}</td>
                  {heatmapMatrix[dIdx].map((rate, hIdx) => {
                    let bg = 'bg-emerald-950/40 text-slate-500';
                    if (rate >= 80) bg = 'bg-emerald-500 text-slate-950 font-bold shadow-glow';
                    else if (rate >= 60) bg = 'bg-emerald-600 text-white font-semibold';
                    else if (rate >= 40) bg = 'bg-emerald-800 text-emerald-200';
                    else if (rate >= 20) bg = 'bg-emerald-900/60 text-emerald-300';

                    return (
                      <td key={hIdx} className="py-3 px-2">
                        <span className={`inline-block w-12 py-1 rounded-lg font-mono text-xs ${bg}`}>
                          {rate}%
                        </span>
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

