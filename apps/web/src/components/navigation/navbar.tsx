'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Compass,
  Activity,
  LayoutDashboard,
  ShieldCheck,
  Building2,
  User,
  Menu,
  X,
  Radio,
  ChevronDown,
} from 'lucide-react';
import { NotificationBell } from './notification-bell';

export function Navbar() {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [dashboardDropdownOpen, setDashboardDropdownOpen] = useState(false);

  // Skip global navbar on standalone full-screen mobile app route if desired, or render clean banner
  const isNexusMobile = pathname.endsWith('/live');

  return (
    <>
      {/* WCAG 2.1 AA Skip-To-Content Link */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 z-50 px-4 py-2 bg-emerald-500 text-slate-950 font-bold rounded-xl shadow-glow focus:outline-none"
      >
        Skip to main content
      </a>

      <header className="sticky top-0 z-40 w-full border-b border-white/10 bg-[#060e20]/80 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          {/* Brand Logo */}
          <div className="flex items-center space-x-6">
            <Link href="/" className="flex items-center space-x-2.5 group">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-emerald-500 to-cyan-400 p-0.5 shadow-glow">
                <div className="w-full h-full bg-[#060e20] rounded-[10px] flex items-center justify-center">
                  <Activity className="w-4 h-4 text-emerald-400 group-hover:scale-110 transition-transform" />
                </div>
              </div>
              <div className="flex items-center space-x-1.5">
                <span className="font-bold text-base tracking-tight text-white">SmartSpace</span>
                <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                  NEXUS
                </span>
              </div>
            </Link>

            {/* Desktop Navigation Links */}
            <nav className="hidden md:flex items-center space-x-1" aria-label="Main Navigation">
              <Link
                href="/spaces"
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-colors flex items-center space-x-1.5 ${
                  pathname === '/spaces'
                    ? 'bg-[#131b2e] text-white border border-white/10'
                    : 'text-slate-400 hover:text-white hover:bg-white/5'
                }`}
              >
                <Compass className="w-3.5 h-3.5 text-emerald-400" />
                <span>Explore Spaces</span>
              </Link>

              <Link
                href="/spaces/apex-executive-suite/live"
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-colors flex items-center space-x-1.5 ${
                  pathname.endsWith('/live')
                    ? 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/30'
                    : 'text-slate-400 hover:text-cyan-400 hover:bg-white/5'
                }`}
              >
                <Activity className="w-3.5 h-3.5 text-cyan-400" />
                <span>NexusSpace Live</span>
              </Link>

              {/* Dashboards Dropdown */}
              <div className="relative">
                <button
                  type="button"
                  aria-expanded={dashboardDropdownOpen}
                  aria-haspopup="true"
                  onClick={() => setDashboardDropdownOpen(!dashboardDropdownOpen)}
                  className="px-3 py-1.5 rounded-xl text-xs font-semibold text-slate-400 hover:text-white hover:bg-white/5 transition-colors flex items-center space-x-1.5"
                >
                  <LayoutDashboard className="w-3.5 h-3.5 text-purple-400" />
                  <span>Role Portals</span>
                  <ChevronDown className="w-3 h-3 text-slate-500" />
                </button>

                {dashboardDropdownOpen && (
                  <div
                    onMouseLeave={() => setDashboardDropdownOpen(false)}
                    className="absolute left-0 mt-2 w-56 rounded-2xl bg-[#0b1326] border border-white/10 shadow-2xl p-2 z-50 space-y-1 backdrop-blur-xl"
                  >
                    <Link
                      href="/dashboard/user"
                      onClick={() => setDashboardDropdownOpen(false)}
                      className="flex items-center space-x-2.5 p-2 rounded-xl text-xs text-slate-300 hover:bg-white/5 hover:text-white transition-colors"
                    >
                      <User className="w-4 h-4 text-emerald-400" />
                      <div>
                        <div className="font-semibold">Attendee Dashboard</div>
                        <div className="text-[10px] text-slate-500">Reservations & passes</div>
                      </div>
                    </Link>

                    <Link
                      href="/dashboard/owner"
                      onClick={() => setDashboardDropdownOpen(false)}
                      className="flex items-center space-x-2.5 p-2 rounded-xl text-xs text-slate-300 hover:bg-white/5 hover:text-white transition-colors"
                    >
                      <Building2 className="w-4 h-4 text-cyan-400" />
                      <div>
                        <div className="font-semibold">Space Owner Portal</div>
                        <div className="text-[10px] text-slate-500">Manage listings & requests</div>
                      </div>
                    </Link>

                    <Link
                      href="/dashboard/admin"
                      onClick={() => setDashboardDropdownOpen(false)}
                      className="flex items-center space-x-2.5 p-2 rounded-xl text-xs text-slate-300 hover:bg-white/5 hover:text-white transition-colors"
                    >
                      <ShieldCheck className="w-4 h-4 text-purple-400" />
                      <div>
                        <div className="font-semibold">Platform Admin & KPIs</div>
                        <div className="text-[10px] text-slate-500">Analytics, audits, queue</div>
                      </div>
                    </Link>
                  </div>
                )}
              </div>
            </nav>
          </div>

          {/* Right Action Icons & Controls */}
          <div className="flex items-center space-x-3">
            {/* Real-time Socket Indicator */}
            <div className="hidden sm:flex items-center space-x-1.5 px-2.5 py-1 rounded-full bg-[#131b2e] border border-white/5 text-[10px] font-mono text-slate-400">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>SOCKET SYNC</span>
            </div>

            {/* In-App Notifications Bell */}
            <NotificationBell />

            {/* Auth / Account Link */}
            <Link
              href="/login"
              className="px-3.5 py-1.5 rounded-xl bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-xs font-semibold transition-colors flex items-center space-x-1.5"
            >
              <User className="w-3.5 h-3.5" />
              <span>Sign In</span>
            </Link>

            {/* Mobile Hamburger Button */}
            <button
              type="button"
              aria-label="Toggle navigation menu"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-xl bg-[#131b2e] text-slate-400 hover:text-white border border-white/10"
            >
              {mobileMenuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {/* Mobile Dropdown Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-white/10 bg-[#060e20] p-4 space-y-3">
            <Link
              href="/spaces"
              onClick={() => setMobileMenuOpen(false)}
              className="block p-2 rounded-xl text-xs font-semibold text-slate-300 hover:bg-white/5"
            >
              Explore Spaces
            </Link>
            <Link
              href="/spaces/apex-executive-suite/live"
              onClick={() => setMobileMenuOpen(false)}
              className="block p-2 rounded-xl text-xs font-semibold text-cyan-400 hover:bg-white/5"
            >
              NexusSpace Live Floorplan
            </Link>
            <Link
              href="/dashboard/user"
              onClick={() => setMobileMenuOpen(false)}
              className="block p-2 rounded-xl text-xs font-semibold text-slate-300 hover:bg-white/5"
            >
              Attendee Dashboard
            </Link>
            <Link
              href="/dashboard/owner"
              onClick={() => setMobileMenuOpen(false)}
              className="block p-2 rounded-xl text-xs font-semibold text-slate-300 hover:bg-white/5"
            >
              Space Owner Portal
            </Link>
            <Link
              href="/dashboard/admin"
              onClick={() => setMobileMenuOpen(false)}
              className="block p-2 rounded-xl text-xs font-semibold text-slate-300 hover:bg-white/5"
            >
              Platform Admin & KPIs
            </Link>
          </div>
        )}
      </header>
    </>
  );
}
