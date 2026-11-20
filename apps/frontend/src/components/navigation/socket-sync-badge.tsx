'use client';

import { useState, useEffect, useRef } from 'react';
import { Radio, RefreshCw, CheckCircle2, Activity, Zap, Server, ShieldCheck, ChevronDown, Clock } from 'lucide-react';

interface ChannelStatus {
  id: string;
  name: string;
  metric: string;
  status: 'optimal' | 'warning';
  nodes: number;
}

const CHANNELS: ChannelStatus[] = [
  { id: 'iaq', name: 'IAQ & Environmental Array', metric: '480 ppm CO₂ • 22.5°C', status: 'optimal', nodes: 16 },
  { id: 'turnstile', name: 'Turnstile Gate 04 Access', metric: 'NFC Relay Online', status: 'optimal', nodes: 4 },
  { id: 'acoustic', name: 'Acoustic Soundwave Array', metric: '42 dB (Quiet Study)', status: 'optimal', nodes: 8 },
  { id: 'occupancy', name: 'Floorplan Desk Occupancy', metric: '142/180 Desks Active', status: 'optimal', nodes: 16 },
];

export function SocketSyncBadge() {
  const [isOpen, setIsOpen] = useState(false);
  const [isResyncing, setIsResyncing] = useState(false);
  const [latency, setLatency] = useState(24);
  const [lastSyncSec, setLastSyncSec] = useState(2);
  const [syncCount, setSyncCount] = useState(1);
  const menuRef = useRef<HTMLDivElement>(null);

  // Simulate realistic jitter
  useEffect(() => {
    const timer = setInterval(() => {
      setLatency(Math.floor(22 + Math.random() * 6));
      setLastSyncSec((prev) => (prev > 15 ? 1 : prev + 1));
    }, 2000);
    return () => clearInterval(timer);
  }, []);

  // Close on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleForceResync = () => {
    setIsResyncing(true);
    setTimeout(() => {
      setIsResyncing(false);
      setLatency(19);
      setLastSyncSec(0);
      setSyncCount((prev) => prev + 1);
    }, 700);
  };

  return (
    <div className="relative" ref={menuRef}>
      {/* Interactive Trigger Button */}
      <button
        type="button"
        aria-label="View WebSocket telemetry connection status"
        aria-expanded={isOpen}
        onClick={() => setIsOpen(!isOpen)}
        className="hidden sm:flex items-center space-x-2 px-3 py-1.5 rounded-full bg-[#131b2e] hover:bg-slate-800 border border-white/10 hover:border-emerald-500/40 text-[10px] font-mono text-slate-300 transition-all cursor-pointer focus:outline-none focus:ring-2 focus:ring-emerald-500"
      >
        <span className="relative flex h-2 w-2">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
          <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
        </span>
        <span className="font-semibold tracking-wider text-emerald-400">SOCKET SYNC</span>
        <span className="text-[9px] text-slate-400 border-l border-white/10 pl-1.5">
          {latency}ms
        </span>
        <ChevronDown className={`w-3 h-3 text-slate-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {/* Diagnostics Dropdown */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 sm:w-96 rounded-3xl bg-[#0b1326] border border-white/10 shadow-2xl p-5 z-50 space-y-4 backdrop-blur-xl">
          {/* Header */}
          <div className="flex items-center justify-between border-b border-white/10 pb-3">
            <div className="flex items-center space-x-2">
              <div className="p-1.5 rounded-xl bg-emerald-500/20 text-emerald-400">
                <Radio className="w-4 h-4 animate-pulse" />
              </div>
              <div>
                <div className="flex items-center space-x-2">
                  <span className="text-xs font-bold text-white tracking-wide">WebSocket Telemetry</span>
                  <span className="px-1.5 py-0.2 rounded-md bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-[9px] font-mono">
                    CONNECTED
                  </span>
                </div>
                <div className="text-[10px] text-slate-400 font-mono">wss://api.smartspace.io/v1/telemetry</div>
              </div>
            </div>
          </div>

          {/* Metric Stats Grid */}
          <div className="grid grid-cols-2 gap-2 text-xs">
            <div className="p-2.5 rounded-2xl bg-[#131b2e] border border-white/5 space-y-1">
              <div className="text-[10px] text-slate-400 flex items-center space-x-1">
                <Activity className="w-3 h-3 text-cyan-400" />
                <span>Round-Trip Ping</span>
              </div>
              <div className="font-mono text-sm font-bold text-white flex items-center space-x-1.5">
                <span className="text-emerald-400">{latency} ms</span>
                <span className="text-[10px] text-slate-400 font-normal">(Optimal)</span>
              </div>
            </div>

            <div className="p-2.5 rounded-2xl bg-[#131b2e] border border-white/5 space-y-1">
              <div className="text-[10px] text-slate-400 flex items-center space-x-1">
                <Clock className="w-3 h-3 text-purple-400" />
                <span>Last Telemetry Sync</span>
              </div>
              <div className="font-mono text-sm font-bold text-white">
                {lastSyncSec === 0 ? 'Just now' : `${lastSyncSec}s ago`}
              </div>
            </div>
          </div>

          {/* Active Channels */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
              <span>Active IoT Channels</span>
              <span className="text-emerald-400 font-mono">4 Streams Active</span>
            </div>
            <div className="space-y-1.5">
              {CHANNELS.map((ch) => (
                <div
                  key={ch.id}
                  className="p-2 rounded-xl bg-[#131b2e]/60 border border-white/5 flex items-center justify-between text-xs"
                >
                  <div className="flex items-center space-x-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                    <div>
                      <div className="font-semibold text-slate-200 text-[11px]">{ch.name}</div>
                      <div className="text-[10px] text-slate-400 font-mono">{ch.metric}</div>
                    </div>
                  </div>
                  <span className="text-[9px] font-mono px-2 py-0.5 rounded-full bg-white/5 text-slate-300">
                    {ch.nodes} nodes
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Action Footer */}
          <div className="pt-2 border-t border-white/10 flex items-center justify-between">
            <div className="text-[10px] text-slate-400 font-mono flex items-center space-x-1">
              <ShieldCheck className="w-3 h-3 text-emerald-400" />
              <span>TLS 1.3 • AES-256</span>
            </div>

            <button
              type="button"
              onClick={handleForceResync}
              disabled={isResyncing}
              className="px-3 py-1.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs transition-all flex items-center space-x-1.5 shadow-glow disabled:opacity-50 cursor-pointer"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isResyncing ? 'animate-spin' : ''}`} />
              <span>{isResyncing ? 'Syncing...' : 'Force Resync'}</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
