import Link from 'next/link';
import { Activity, ShieldCheck, CheckCircle2, Globe2 } from 'lucide-react';

export function Footer() {
  return (
    <footer className="border-t border-white/10 bg-[#060e20] text-slate-400 text-xs py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8">
        {/* Brand Column */}
        <div className="space-y-3 md:col-span-1">
          <div className="flex items-center space-x-2">
            <div className="w-6 h-6 rounded-lg bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center">
              <Activity className="w-3.5 h-3.5 text-emerald-400" />
            </div>
            <span className="font-bold text-white text-sm">SmartSpace</span>
          </div>
          <p className="text-[11px] leading-relaxed text-slate-500">
            Next-generation co-working management platform with real-time IoT telemetry, AI capacity matching, and interactive floorplan reservations.
          </p>
          <div className="flex items-center space-x-2 pt-1">
            <span className="flex items-center space-x-1.5 px-2.5 py-1 rounded-full bg-[#0b1326] border border-white/5 text-[10px] text-emerald-400 font-mono">
              <CheckCircle2 className="w-3 h-3 text-emerald-400" />
              <span>99.98% UPTIME SLA</span>
            </span>
          </div>
        </div>

        {/* Global Hubs */}
        <div className="space-y-2">
          <h4 className="text-xs font-bold text-slate-200 uppercase tracking-wider flex items-center space-x-1.5">
            <Globe2 className="w-3.5 h-3.5 text-cyan-400" />
            <span>Active City Hubs</span>
          </h4>
          <ul className="space-y-1.5 text-slate-400 text-[11px]">
            <li>New York, NY (70 Workspaces)</li>
            <li>San Francisco, CA (56 Workspaces)</li>
            <li>London, UK (36 Workspaces)</li>
            <li>Berlin, Germany (22 Workspaces)</li>
            <li>Singapore (16 Workspaces)</li>
          </ul>
        </div>

        {/* Role Portals */}
        <div className="space-y-2">
          <h4 className="text-xs font-bold text-slate-200 uppercase tracking-wider">
            Role Portals
          </h4>
          <ul className="space-y-1.5 text-[11px]">
            <li>
              <Link href="/spaces" className="hover:text-emerald-400 transition-colors">
                Explore Workspaces & Cabins
              </Link>
            </li>
            <li>
              <Link href="/spaces/apex-executive-suite/live" className="hover:text-cyan-400 transition-colors">
                NexusSpace Live Telemetry
              </Link>
            </li>
            <li>
              <Link href="/dashboard/user" className="hover:text-white transition-colors">
                Attendee Reservation Pass
              </Link>
            </li>
            <li>
              <Link href="/dashboard/owner" className="hover:text-white transition-colors">
                Space Owner Command Center
              </Link>
            </li>
            <li>
              <Link href="/dashboard/admin" className="hover:text-white transition-colors">
                Platform Admin Analytics & KPIs
              </Link>
            </li>
          </ul>
        </div>

        {/* Compliance & Standards */}
        <div className="space-y-2">
          <h4 className="text-xs font-bold text-slate-200 uppercase tracking-wider flex items-center space-x-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            <span>Standards & Security</span>
          </h4>
          <p className="text-[11px] text-slate-500 leading-relaxed">
            Engineered with WCAG 2.1 AA accessibility guidelines, OWASP Top 10 compliance, Argon2id encryption, and PostgreSQL serializable exclusion locks.
          </p>
          <div className="text-[10px] text-slate-600 pt-2">
            © 2026 SmartSpace Platform Inc. All rights reserved.
          </div>
        </div>
      </div>
    </footer>
  );
}
