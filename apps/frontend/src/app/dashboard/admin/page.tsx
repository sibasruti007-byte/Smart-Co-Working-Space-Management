'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
  ShieldAlert,
  Download,
  Users,
  Building2,
  TrendingUp,
  Target,
  CheckCircle2,
  Star,
  Activity,
  Server,
  Database,
  Radio,
  Clock,
  ArrowUpRight,
  ExternalLink,
  Cpu,
} from 'lucide-react';

interface AuditLog {
  id: string;
  action: string;
  entityType: string;
  entityId: string;
  details: string;
  timestamp: string;
}

const INITIAL_LOGS: AuditLog[] = [
  {
    id: 'audit-1',
    action: 'SPACE_VERIFIED',
    entityType: 'Workspace',
    entityId: 'space-1',
    details: 'Admin verified and published Apex Executive Suite (Flatiron, NYC)',
    timestamp: '12 mins ago',
  },
  {
    id: 'audit-2',
    action: 'BOOKING_CONFIRMED',
    entityType: 'Booking',
    entityId: 'bk-9481',
    details: 'User confirmed reservation #bk-9481 with idempotency guard',
    timestamp: '28 mins ago',
  },
  {
    id: 'audit-3',
    action: 'IOT_SENSOR_SYNC',
    entityType: 'Telemetry',
    entityId: 'turnstile-04',
    details: 'Biometric turnstile calibrated: 18 check-ins recorded, 0 dropped packets',
    timestamp: '42 mins ago',
  },
  {
    id: 'audit-4',
    action: 'BULLMQ_SWEEP',
    entityType: 'QueueWorker',
    entityId: 'job-auto-expire',
    details: 'Auto-expired 0 stale unapproved requests (all requests handled within SLA)',
    timestamp: '1 hour ago',
  },
  {
    id: 'audit-5',
    action: 'USER_REGISTERED',
    entityType: 'User',
    entityId: 'usr-8812',
    details: 'Registered new space owner account: "Foundry Partners LLC"',
    timestamp: '2 hours ago',
  },
];

export default function AdminDashboardPage() {
  const [logs] = useState<AuditLog[]>(INITIAL_LOGS);
  const [isExporting, setIsExporting] = useState(false);

  const handleExportCSV = async () => {
    setIsExporting(true);
    try {
      // Direct mock CSV generation for browser download
      const rows = [
        ['Metric', 'Value', 'Unit / Benchmark'],
        ['Total Registered Users', '1280', 'Accounts'],
        ['Total Workspaces Listed', '200', 'Workspaces across 5 cities'],
        ['Active Current Bookings', '64', 'Confirmed slots'],
        ['Search-to-Booking Conversion Rate', '19.4%', 'Target > 15%'],
        ['Average Match Accuracy KPI', '95.8%', 'Target > 90%'],
        ['Booking Completion Rate', '97.2%', 'Target > 95%'],
        ['Customer Satisfaction Score (CSAT)', '4.89 / 5.0', 'Based on post-stay reviews'],
        ['Average Real-Time Occupancy', '73.5%', 'Global tech hub average'],
        ['Monthly Revenue Run-Rate', '$184,500', 'USD MTD'],
      ];
      const csvContent =
        'data:text/csv;charset=utf-8,' +
        rows.map((e) => e.map((cell) => `"${cell}"`).join(',')).join('\n');
      const encodedUri = encodeURI(csvContent);
      const link = document.createElement('a');
      link.setAttribute('href', encodedUri);
      link.setAttribute('download', 'smartspace_platform_kpis.csv');
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#060e20] text-slate-100 p-6 sm:p-10 space-y-8">
      {/* Top Header */}
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-6">
        <div>
          <div className="flex items-center space-x-2">
            <h1 className="text-2xl font-bold tracking-tight text-white">Platform Administration & Analytics</h1>
            <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-400 border border-cyan-500/30">
              Admin Node
            </span>
          </div>
          <p className="text-xs text-slate-400 pt-1">
            Real-time platform KPIs, AI match accuracy, verification queue, and security audit logs.
          </p>
        </div>

        <div className="flex items-center space-x-3">
          <Link
            href="/admin/spaces"
            className="px-4 py-2 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/30 text-xs font-semibold transition-colors flex items-center space-x-1.5"
          >
            <ShieldAlert className="w-3.5 h-3.5" />
            <span>Verification Queue (3 pending)</span>
          </Link>
          <button
            type="button"
            onClick={handleExportCSV}
            disabled={isExporting}
            className="px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs transition-all shadow-glow flex items-center space-x-1.5 disabled:opacity-50"
          >
            <Download className="w-3.5 h-3.5" />
            <span>{isExporting ? 'Exporting...' : 'Export KPI Report (CSV)'}</span>
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto space-y-8">
        {/* Key Platform KPIs Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {/* KPI 1 */}
          <div className="glass-panel p-5 rounded-2xl border border-white/5 space-y-2">
            <div className="flex items-center justify-between text-slate-400">
              <span className="text-xs font-semibold uppercase tracking-wider">Registered Users</span>
              <Users className="w-4 h-4 text-emerald-400" />
            </div>
            <div className="text-2xl font-bold text-white tracking-tight font-mono">1,280+</div>
            <div className="text-[11px] text-emerald-400 flex items-center space-x-1">
              <TrendingUp className="w-3 h-3" />
              <span>+14.2% MoM growth</span>
            </div>
          </div>

          {/* KPI 2 */}
          <div className="glass-panel p-5 rounded-2xl border border-white/5 space-y-2">
            <div className="flex items-center justify-between text-slate-400">
              <span className="text-xs font-semibold uppercase tracking-wider">Workspaces Listed</span>
              <Building2 className="w-4 h-4 text-cyan-400" />
            </div>
            <div className="text-2xl font-bold text-white tracking-tight font-mono">200</div>
            <div className="text-[11px] text-slate-400">5 Tier-1 Global Cities</div>
          </div>

          {/* KPI 3 */}
          <div className="glass-panel p-5 rounded-2xl border border-white/5 space-y-2">
            <div className="flex items-center justify-between text-slate-400">
              <span className="text-xs font-semibold uppercase tracking-wider">Search-to-Booking</span>
              <Target className="w-4 h-4 text-emerald-400" />
            </div>
            <div className="text-2xl font-bold text-emerald-400 tracking-tight font-mono">19.4%</div>
            <div className="text-[11px] text-slate-400">Target benchmark &gt; 15%</div>
          </div>

          {/* KPI 4 */}
          <div className="glass-panel p-5 rounded-2xl border border-white/5 space-y-2">
            <div className="flex items-center justify-between text-slate-400">
              <span className="text-xs font-semibold uppercase tracking-wider">Match Accuracy Score</span>
              <Target className="w-4 h-4 text-purple-400" />
            </div>
            <div className="text-2xl font-bold text-purple-400 tracking-tight font-mono">95.8%</div>
            <div className="text-[11px] text-slate-400">Weighted 7-dimension engine</div>
          </div>

          {/* KPI 5 */}
          <div className="glass-panel p-5 rounded-2xl border border-white/5 space-y-2">
            <div className="flex items-center justify-between text-slate-400">
              <span className="text-xs font-semibold uppercase tracking-wider">Booking Completion</span>
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            </div>
            <div className="text-2xl font-bold text-white tracking-tight font-mono">97.2%</div>
            <div className="text-[11px] text-slate-400">Double-booking rate: 0.0%</div>
          </div>

          {/* KPI 6 */}
          <div className="glass-panel p-5 rounded-2xl border border-white/5 space-y-2">
            <div className="flex items-center justify-between text-slate-400">
              <span className="text-xs font-semibold uppercase tracking-wider">Avg CSAT Rating</span>
              <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
            </div>
            <div className="text-2xl font-bold text-amber-400 tracking-tight font-mono">4.89 / 5.0</div>
            <div className="text-[11px] text-slate-400">Over 1,420 guest reviews</div>
          </div>

          {/* KPI 7 */}
          <div className="glass-panel p-5 rounded-2xl border border-white/5 space-y-2">
            <div className="flex items-center justify-between text-slate-400">
              <span className="text-xs font-semibold uppercase tracking-wider">Avg Real-Time Occupancy</span>
              <Activity className="w-4 h-4 text-cyan-400" />
            </div>
            <div className="text-2xl font-bold text-cyan-400 tracking-tight font-mono">73.5%</div>
            <div className="text-[11px] text-slate-400">IoT turnstile aggregated</div>
          </div>

          {/* KPI 8 */}
          <div className="glass-panel p-5 rounded-2xl border border-white/5 space-y-2">
            <div className="flex items-center justify-between text-slate-400">
              <span className="text-xs font-semibold uppercase tracking-wider">Monthly Run-Rate</span>
              <TrendingUp className="w-4 h-4 text-emerald-400" />
            </div>
            <div className="text-2xl font-bold text-white tracking-tight font-mono">$184,500</div>
            <div className="text-[11px] text-emerald-400">+22.8% QoQ platform GMV</div>
          </div>
        </div>

        {/* System Health & Global City Distribution */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Infrastructure Health Status */}
          <div className="glass-panel p-6 rounded-3xl border border-white/5 space-y-4">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center space-x-2">
              <Cpu className="w-4 h-4 text-emerald-400" />
              <span>Infrastructure Health</span>
            </h3>

            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 rounded-2xl bg-[#0b1326] border border-white/5 text-xs">
                <div className="flex items-center space-x-2.5">
                  <Database className="w-4 h-4 text-emerald-400" />
                  <div>
                    <span className="font-semibold text-white block">PostgreSQL 16 Engine</span>
                    <span className="text-slate-500 text-[10px]">Pool: 20 active connections</span>
                  </div>
                </div>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 font-semibold border border-emerald-500/30">
                  HEALTHY
                </span>
              </div>

              <div className="flex items-center justify-between p-3 rounded-2xl bg-[#0b1326] border border-white/5 text-xs">
                <div className="flex items-center space-x-2.5">
                  <Server className="w-4 h-4 text-emerald-400" />
                  <div>
                    <span className="font-semibold text-white block">Redis 7 & BullMQ</span>
                    <span className="text-slate-500 text-[10px]">0 delayed, 0 failed sweeps</span>
                  </div>
                </div>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 font-semibold border border-emerald-500/30">
                  ACTIVE
                </span>
              </div>

              <div className="flex items-center justify-between p-3 rounded-2xl bg-[#0b1326] border border-white/5 text-xs">
                <div className="flex items-center space-x-2.5">
                  <Radio className="w-4 h-4 text-cyan-400" />
                  <div>
                    <span className="font-semibold text-white block">Socket.IO Gateway</span>
                    <span className="text-slate-500 text-[10px]">Real-time telemetry broadcast</span>
                  </div>
                </div>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-400 font-semibold border border-cyan-500/30">
                  OPERATIONAL
                </span>
              </div>
            </div>
          </div>

          {/* Regional Distribution */}
          <div className="glass-panel p-6 rounded-3xl border border-white/5 space-y-4 lg:col-span-2">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center space-x-2">
              <Building2 className="w-4 h-4 text-cyan-400" />
              <span>Workspace Distribution By City</span>
            </h3>

            <div className="space-y-3 pt-1">
              <div>
                <div className="flex justify-between text-xs pb-1">
                  <span className="font-semibold text-white">New York, NY (70 spaces)</span>
                  <span className="font-mono text-emerald-400">35%</span>
                </div>
                <div className="h-2 rounded-full bg-slate-800 overflow-hidden">
                  <div className="h-full bg-emerald-400 rounded-full" style={{ width: '35%' }} />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs pb-1">
                  <span className="font-semibold text-white">San Francisco, CA (56 spaces)</span>
                  <span className="font-mono text-cyan-400">28%</span>
                </div>
                <div className="h-2 rounded-full bg-slate-800 overflow-hidden">
                  <div className="h-full bg-cyan-400 rounded-full" style={{ width: '28%' }} />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs pb-1">
                  <span className="font-semibold text-white">London, UK (36 spaces)</span>
                  <span className="font-mono text-sky-400">18%</span>
                </div>
                <div className="h-2 rounded-full bg-slate-800 overflow-hidden">
                  <div className="h-full bg-sky-400 rounded-full" style={{ width: '18%' }} />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs pb-1">
                  <span className="font-semibold text-white">Berlin, DE (22 spaces)</span>
                  <span className="font-mono text-indigo-400">11%</span>
                </div>
                <div className="h-2 rounded-full bg-slate-800 overflow-hidden">
                  <div className="h-full bg-indigo-400 rounded-full" style={{ width: '11%' }} />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs pb-1">
                  <span className="font-semibold text-white">Singapore, SG (16 spaces)</span>
                  <span className="font-mono text-purple-400">8%</span>
                </div>
                <div className="h-2 rounded-full bg-slate-800 overflow-hidden">
                  <div className="h-full bg-purple-400 rounded-full" style={{ width: '8%' }} />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Security & Audit Log Stream */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-white flex items-center space-x-2">
              <Clock className="w-4 h-4 text-emerald-400" />
              <span>Immutable System Audit Stream</span>
            </h2>
            <span className="text-xs text-slate-400">
              OWASP compliance & security event tracking
            </span>
          </div>

          <div className="glass-panel rounded-3xl border border-white/5 overflow-hidden">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#0b1326] text-slate-400 uppercase tracking-wider text-[10px] border-b border-white/5">
                <tr>
                  <th className="p-4">Action</th>
                  <th className="p-4">Entity Type</th>
                  <th className="p-4">Details</th>
                  <th className="p-4 text-right">Time</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {logs.map((log) => (
                  <tr key={log.id} className="hover:bg-white/[0.02] transition-colors">
                    <td className="p-4">
                      <span className="font-mono font-bold text-emerald-400 text-[11px] px-2 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/20">
                        {log.action}
                      </span>
                    </td>
                    <td className="p-4 font-semibold text-slate-300">{log.entityType}</td>
                    <td className="p-4 text-slate-400 max-w-md truncate">{log.details}</td>
                    <td className="p-4 text-right text-slate-500 font-mono text-[11px] whitespace-nowrap">
                      {log.timestamp}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

