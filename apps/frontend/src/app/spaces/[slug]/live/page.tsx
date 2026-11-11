'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Building2,
  ChevronDown,
  Sparkles,
  Users,
  Wind,
  Volume2,
  Thermometer,
  Zap,
  Lock,
  Check,
  Shield,
  Coffee,
  DoorOpen,
  MapPin,
  Compass,
  Laptop,
  Monitor,
  Activity,
  Layers,
  Fingerprint,
  User,
  Bell,
  Sun,
  Fan,
} from 'lucide-react';

interface DeskNodeData {
  id: string;
  code: string;
  state: 'AVAILABLE' | 'OCCUPIED' | 'RESERVED_BY_USER' | 'SELECTED';
  minutesRemaining?: number;
  hasPower: boolean;
  isStandingDesk: boolean;
  monitors: string;
  hardware: string[];
  tempC: number;
  soundDb: number;
  lux: number;
  priceHourly: number;
}

const INITIAL_DESKS: DeskNodeData[] = [
  {
    id: 'b-11',
    code: 'B-11',
    state: 'AVAILABLE',
    hasPower: true,
    isStandingDesk: true,
    monitors: 'Single 4K 32"',
    hardware: ['Standing Motor', '65W USB-C', 'Aeron Chair'],
    tempC: 22.1,
    soundDb: 40,
    lux: 540,
    priceHourly: 8,
  },
  {
    id: 'b-12',
    code: 'B-12',
    state: 'OCCUPIED',
    minutesRemaining: 35,
    hasPower: true,
    isStandingDesk: false,
    monitors: 'Dual 27" QHD',
    hardware: ['Steelcase Gesture', 'Thunderbolt 4'],
    tempC: 22.4,
    soundDb: 44,
    lux: 490,
    priceHourly: 8,
  },
  {
    id: 'b-13',
    code: 'B-13',
    state: 'AVAILABLE',
    hasPower: true,
    isStandingDesk: true,
    monitors: 'Dual 27" 4K',
    hardware: ['Herman Miller Embody', '100W PD'],
    tempC: 21.9,
    soundDb: 39,
    lux: 510,
    priceHourly: 8,
  },
  {
    id: 'b-14',
    code: 'B-14',
    state: 'SELECTED',
    hasPower: true,
    isStandingDesk: true,
    monitors: 'Dual Dell UltraSharp 4K',
    hardware: ['Motorized Height Desk', 'USB-C 100W PD Hub', 'Herman Miller Embody', 'Bose Sound Masking'],
    tempC: 22.0,
    soundDb: 38,
    lux: 520,
    priceHourly: 8,
  },
  {
    id: 'b-21',
    code: 'B-21',
    state: 'OCCUPIED',
    minutesRemaining: 80,
    hasPower: true,
    isStandingDesk: false,
    monitors: 'Single 34" Curved',
    hardware: ['Ergonomic Task Chair'],
    tempC: 22.6,
    soundDb: 43,
    lux: 460,
    priceHourly: 8,
  },
  {
    id: 'b-22',
    code: 'B-22',
    state: 'RESERVED_BY_USER',
    minutesRemaining: 120,
    hasPower: true,
    isStandingDesk: true,
    monitors: 'Dual 4K HDR',
    hardware: ['My Reserved Pass', 'Private Turnstile Code'],
    tempC: 22.2,
    soundDb: 39,
    lux: 505,
    priceHourly: 8,
  },
  {
    id: 'b-23',
    code: 'B-23',
    state: 'AVAILABLE',
    hasPower: true,
    isStandingDesk: true,
    monitors: 'Single 4K 27"',
    hardware: ['Aeron Chair', 'MagSafe Charger'],
    tempC: 22.0,
    soundDb: 41,
    lux: 480,
    priceHourly: 8,
  },
  {
    id: 'b-24',
    code: 'B-24',
    state: 'AVAILABLE',
    hasPower: true,
    isStandingDesk: false,
    monitors: 'Single 27"',
    hardware: ['Focus Light Lamp', 'USB-C'],
    tempC: 22.3,
    soundDb: 42,
    lux: 470,
    priceHourly: 8,
  },
];

export default function NexusSpaceLivePage() {
  const [desks, setDesks] = useState<DeskNodeData[]>(INITIAL_DESKS);
  const [selectedDeskId, setSelectedDeskId] = useState<string>('b-14');
  const [selectedZone, setSelectedZone] = useState<string>('Zone B');
  const [activeTab, setActiveTab] = useState<'map' | 'desks' | 'insights' | 'pass' | 'profile'>('map');
  const [isReservedSuccess, setIsReservedSuccess] = useState<boolean>(false);

  // Live Telemetry Oscillations (simulating real-time sensor fluctuation)
  const [noiseDb, setNoiseDb] = useState<number>(42);
  const [co2Ppm, setCo2Ppm] = useState<number>(480);
  const [tempC, setTempC] = useState<number>(22.5);
  const [secondsAgo, setSecondsAgo] = useState<number>(3);

  useEffect(() => {
    const timer = setInterval(() => {
      // Oscillate values smoothly
      setNoiseDb((prev) => Math.round(41 + Math.sin(Date.now() / 1500) * 3));
      setCo2Ppm((prev) => Math.round(478 + Math.cos(Date.now() / 2000) * 6));
      setTempC((prev) => +(22.4 + Math.sin(Date.now() / 3000) * 0.2).toFixed(1));
      setSecondsAgo((prev) => (prev >= 6 ? 1 : prev + 1));
    }, 2000);

    return () => clearInterval(timer);
  }, []);

  const selectedDesk = desks.find((d) => d.id === selectedDeskId) || desks[3];

  const handleSelectDesk = (id: string) => {
    setSelectedDeskId(id);
    setDesks((prev) =>
      prev.map((d) => {
        if (d.id === id) return { ...d, state: 'SELECTED' };
        if (d.state === 'SELECTED') return { ...d, state: 'AVAILABLE' };
        return d;
      })
    );
  };

  const handleInstantReserve = () => {
    setDesks((prev) =>
      prev.map((d) => (d.id === selectedDeskId ? { ...d, state: 'RESERVED_BY_USER' } : d))
    );
    setIsReservedSuccess(true);
    setTimeout(() => setIsReservedSuccess(false), 4000);
  };

  return (
    <div className="min-h-screen bg-[#060e20] text-slate-100 font-sans selection:bg-emerald-500/30 selection:text-emerald-300">
      {/* Mobile-first Viewport Container */}
      <div className="max-w-md mx-auto min-h-screen pb-28 relative px-4 pt-4 space-y-4">
        {/* Top Header & Facility Picker */}
        <header className="flex items-center justify-between py-2 border-b border-white/10">
          <div className="flex items-center space-x-2">
            <div className="h-8 w-8 rounded-lg bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400">
              <Building2 className="w-4 h-4" />
            </div>
            <div>
              <button
                type="button"
                className="flex items-center space-x-1 text-sm font-bold text-white hover:text-emerald-400 transition-colors"
              >
                <span>MetroHub • 4th Floor</span>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
              </button>
              <div className="flex items-center space-x-1.5 text-[10px] text-emerald-400 font-mono">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
                <span>LIVE SYNC • {secondsAgo}S AGO</span>
              </div>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <Link
              href="/spaces"
              className="p-1.5 rounded-lg glass-panel text-slate-400 hover:text-white text-xs"
              title="Return to Directory"
            >
              Exit
            </Link>
            <div className="h-7 w-7 rounded-full bg-slate-800 border border-emerald-500/40 flex items-center justify-center text-[11px] font-bold text-emerald-400">
              JS
            </div>
          </div>
        </header>

        {/* Predictive AI Insights Banner */}
        <div className="p-3.5 rounded-2xl bg-gradient-to-r from-emerald-500/10 via-cyan-500/10 to-transparent border border-cyan-500/30 space-y-1.5 relative overflow-hidden">
          <div className="flex items-center space-x-1.5 text-xs font-bold text-cyan-300">
            <Sparkles className="w-3.5 h-3.5 text-cyan-400 fill-cyan-400" />
            <span>Predictive AI Telemetry Insight</span>
          </div>
          <p className="text-xs text-slate-300 leading-relaxed">
            Peak occupancy forecasted between <strong className="text-white">2:00 PM – 3:30 PM</strong>. Floor 5 Quiet Focus Pods currently have <strong className="text-emerald-400 font-mono">85% availability</strong>.
          </p>
        </div>

        {/* Environmental & Space Telemetry 2x2 Grid */}
        <div className="grid grid-cols-2 gap-3">
          {/* Capacity Metric */}
          <div className="glass-panel p-3.5 rounded-2xl space-y-2">
            <div className="flex items-center justify-between text-slate-400">
              <span className="text-[11px] font-semibold uppercase tracking-wider">Capacity</span>
              <Users className="w-3.5 h-3.5 text-slate-400" />
            </div>
            <div>
              <div className="flex items-baseline space-x-1">
                <span className="text-xl font-extrabold text-white font-mono">78%</span>
                <span className="text-[10px] text-amber-400 font-medium">High Load</span>
              </div>
              <p className="text-[10px] text-slate-500 font-mono">142 occupied / 180 total</p>
            </div>
            {/* Progress bar */}
            <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
              <div className="h-full bg-amber-400 rounded-full" style={{ width: '78%' }} />
            </div>
          </div>

          {/* Air Quality (IAQ) Metric */}
          <div className="glass-panel p-3.5 rounded-2xl space-y-2">
            <div className="flex items-center justify-between text-slate-400">
              <span className="text-[11px] font-semibold uppercase tracking-wider">Air Quality</span>
              <Wind className="w-3.5 h-3.5 text-emerald-400" />
            </div>
            <div>
              <div className="flex items-baseline space-x-1">
                <span className="text-xl font-extrabold text-emerald-400 font-mono">94</span>
                <span className="text-[10px] text-emerald-400 font-medium">Optimal</span>
              </div>
              <p className="text-[10px] text-slate-400 font-mono">CO₂: {co2Ppm} ppm • VOC: Low</p>
            </div>
            <div className="flex items-center space-x-1 text-[10px] text-emerald-400">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
              <span>Clean Medical Grade Filter</span>
            </div>
          </div>

          {/* Ambient Noise */}
          <div className="glass-panel p-3.5 rounded-2xl space-y-2">
            <div className="flex items-center justify-between text-slate-400">
              <span className="text-[11px] font-semibold uppercase tracking-wider">Ambient Noise</span>
              <Volume2 className="w-3.5 h-3.5 text-cyan-400" />
            </div>
            <div>
              <div className="flex items-baseline space-x-1">
                <span className="text-xl font-extrabold text-cyan-400 font-mono">{noiseDb} dB</span>
                <span className="text-[10px] text-cyan-300 font-medium">Quiet Study</span>
              </div>
              <p className="text-[10px] text-slate-500 font-mono">Threshold &lt; 50 dB</p>
            </div>
            {/* Dynamic Soundwave Bar */}
            <div className="flex items-end space-x-1 h-3 pt-1">
              {[4, 8, 12, 6, 10, 5, 9, 3].map((h, i) => (
                <div
                  key={i}
                  className="w-1 bg-cyan-400/80 rounded-full transition-all duration-300"
                  style={{ height: `${Math.max(2, (noiseDb - 35) * (h / 8))}px` }}
                />
              ))}
            </div>
          </div>

          {/* Climate / HVAC */}
          <div className="glass-panel p-3.5 rounded-2xl space-y-2">
            <div className="flex items-center justify-between text-slate-400">
              <span className="text-[11px] font-semibold uppercase tracking-wider">Climate / HVAC</span>
              <Fan className="w-3.5 h-3.5 text-sky-400 animate-spin" style={{ animationDuration: '6s' }} />
            </div>
            <div>
              <div className="flex items-baseline space-x-1">
                <span className="text-xl font-extrabold text-white font-mono">{tempC}°C</span>
                <span className="text-[10px] text-slate-400 font-medium">Target 22°</span>
              </div>
              <p className="text-[10px] text-slate-500 font-mono">Humidity: 48% • Fresh Air</p>
            </div>
            <div className="flex items-center space-x-1 text-[10px] text-sky-400">
              <Sun className="w-2.5 h-2.5" />
              <span>Smart HVAC Auto-Tuned</span>
            </div>
          </div>
        </div>

        {/* Zone Selector Tabs */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span className="font-bold text-white uppercase tracking-wider text-[11px]">Floorplan Zones</span>
            <span className="text-[10px] text-slate-500 font-mono">16 Workstations Available</span>
          </div>

          <div className="flex space-x-2 overflow-x-auto pb-1 scrollbar-none">
            {['All Zones', 'Silent Focus Pods', 'Zone B', 'Collaborative Bay'].map((z) => (
              <button
                key={z}
                type="button"
                onClick={() => setSelectedZone(z)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                  selectedZone === z
                    ? 'bg-emerald-500 text-slate-950 shadow-glow font-bold'
                    : 'glass-panel text-slate-400 hover:text-white'
                }`}
              >
                {z}
              </button>
            ))}
          </div>
        </div>

        {/* Zone B Interactive Floorplan Schematic */}
        <div className="glass-panel p-4 rounded-3xl space-y-3 relative border border-white/10">
          <div className="flex items-center justify-between text-xs pb-2 border-b border-white/5">
            <div className="flex items-center space-x-1.5 text-slate-300">
              <Compass className="w-3.5 h-3.5 text-emerald-400" />
              <span className="text-[11px] font-semibold">Zone B: North Bay Floorplan</span>
            </div>
            <span className="text-[10px] text-amber-400/90 font-mono flex items-center space-x-1">
              <Sun className="w-3 h-3 text-amber-400" />
              <span>Glass Façade Natural Daylight</span>
            </span>
          </div>

          {/* 4x2 Desk Grid Nodes */}
          <div className="grid grid-cols-4 gap-2.5 pt-1">
            {desks.map((d) => {
              const isSelected = d.id === selectedDeskId;
              let borderStyle = 'border-white/10 bg-[#0b1326] text-slate-400';
              let badge = `${d.code}`;
              let badgeIcon = <Zap className="w-2.5 h-2.5 text-emerald-400" />;

              if (d.state === 'SELECTED' || isSelected) {
                borderStyle = 'border-emerald-400 bg-emerald-500/20 text-white shadow-glow ring-2 ring-emerald-500/50';
                badgeIcon = <Check className="w-2.5 h-2.5 text-emerald-400" />;
              } else if (d.state === 'AVAILABLE') {
                borderStyle = 'border-emerald-500/30 hover:border-emerald-500/70 bg-[#0b1326] text-emerald-300';
                badgeIcon = <Zap className="w-2.5 h-2.5 text-emerald-400" />;
              } else if (d.state === 'RESERVED_BY_USER') {
                borderStyle = 'border-cyan-400 bg-cyan-500/20 text-cyan-300 ring-1 ring-cyan-400';
                badgeIcon = <Shield className="w-2.5 h-2.5 text-cyan-400" />;
              } else if (d.state === 'OCCUPIED') {
                borderStyle = 'border-white/5 bg-slate-900/60 text-slate-600 opacity-60';
                badgeIcon = <Lock className="w-2.5 h-2.5 text-slate-500" />;
              }

              return (
                <button
                  key={d.id}
                  type="button"
                  onClick={() => handleSelectDesk(d.id)}
                  disabled={d.state === 'OCCUPIED'}
                  className={`p-2.5 rounded-2xl border transition-all text-left flex flex-col justify-between h-20 ${borderStyle}`}
                >
                  <div className="flex items-center justify-between w-full">
                    <span className="font-mono text-xs font-bold">{d.code}</span>
                    {badgeIcon}
                  </div>

                  <div className="text-[10px] font-mono leading-tight">
                    {d.state === 'SELECTED' || isSelected ? (
                      <span className="text-emerald-400 font-bold">Selected</span>
                    ) : d.state === 'RESERVED_BY_USER' ? (
                      <span className="text-cyan-400">My Pass</span>
                    ) : d.state === 'OCCUPIED' ? (
                      <span className="text-slate-500">{d.minutesRemaining}m left</span>
                    ) : (
                      <span className="text-emerald-400/90 font-medium">⚡ Free</span>
                    )}
                  </div>
                </button>
              );
            })}
          </div>

          {/* Ambient Amenities Markers */}
          <div className="flex items-center justify-between pt-2 border-t border-white/5 text-[10px] text-slate-400">
            <div className="flex items-center space-x-1.5">
              <Coffee className="w-3 h-3 text-amber-400" />
              <span>Espresso Pantry (15m)</span>
            </div>
            <div className="flex items-center space-x-1.5">
              <DoorOpen className="w-3 h-3 text-cyan-400" />
              <span>Turnstile Gate 04</span>
            </div>
          </div>
        </div>

        {/* Spotlight Workstation Detail Card */}
        <div className="glass-panel-accent p-4 rounded-3xl space-y-4 border border-emerald-500/40 relative shadow-2xl">
          <div className="flex items-start justify-between">
            <div>
              <div className="flex items-center space-x-2">
                <span className="text-xs font-bold text-emerald-400 font-mono">Desk #{selectedDesk.code}</span>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-medium">
                  Standing Pod
                </span>
              </div>
              <h3 className="text-sm font-bold text-white pt-0.5">Ergo Standing Pod + {selectedDesk.monitors}</h3>
            </div>

            <div className="text-right">
              <span className="text-base font-extrabold text-white font-mono">${selectedDesk.priceHourly}</span>
              <span className="text-[10px] text-slate-400"> / hr flex</span>
            </div>
          </div>

          {/* Hardware Breakdown */}
          <div className="grid grid-cols-2 gap-2 text-[11px] text-slate-300">
            {selectedDesk.hardware.map((h, i) => (
              <div key={i} className="flex items-center space-x-1.5 bg-[#0b1326] p-2 rounded-xl border border-white/5">
                <Check className="w-3 h-3 text-emerald-400 flex-shrink-0" />
                <span className="truncate">{h}</span>
              </div>
            ))}
          </div>

          {/* Local Micro-Sensor Readings */}
          <div className="grid grid-cols-3 gap-2 text-center p-2 rounded-xl bg-[#0b1326] border border-white/5 text-[10px]">
            <div>
              <span className="text-slate-500 block">Micro Temp</span>
              <span className="font-mono font-bold text-white">{selectedDesk.tempC}°C</span>
            </div>
            <div>
              <span className="text-slate-500 block">Sound</span>
              <span className="font-mono font-bold text-cyan-400">{selectedDesk.soundDb} dB (Ultra)</span>
            </div>
            <div>
              <span className="text-slate-500 block">Lux</span>
              <span className="font-mono font-bold text-amber-400">{selectedDesk.lux} Lux Sun</span>
            </div>
          </div>

          {/* Reserve CTA Button */}
          <button
            type="button"
            onClick={handleInstantReserve}
            className="w-full py-3 rounded-2xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs transition-all shadow-glow flex items-center justify-center space-x-2 active:scale-95"
          >
            <Fingerprint className="w-4 h-4" />
            <span>Instant NFC / One-Tap Reserve Desk #{selectedDesk.code}</span>
          </button>

          {isReservedSuccess && (
            <div className="p-2.5 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs font-semibold text-center animate-bounce">
              ✓ Turnstile Access Granted • Bluetooth Pass Active
            </div>
          )}
        </div>

        {/* Facility Live Companion Feed */}
        <div className="glass-panel p-4 rounded-2xl space-y-2.5">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
            Facility Live Companion Feed
          </span>
          <div className="space-y-2 text-xs">
            <div className="flex items-start space-x-2.5 p-2 rounded-xl bg-[#0b1326]/60 border border-white/5">
              <span className="h-2 w-2 rounded-full bg-emerald-400 mt-1 flex-shrink-0" />
              <div>
                <p className="font-semibold text-white">Conference Room B Sanitization Complete</p>
                <span className="text-[10px] text-slate-500">10:14 AM • Turnstile Unlocked for reservations</span>
              </div>
            </div>
            <div className="flex items-start space-x-2.5 p-2 rounded-xl bg-[#0b1326]/60 border border-white/5">
              <span className="h-2 w-2 rounded-full bg-cyan-400 mt-1 flex-shrink-0" />
              <div>
                <p className="font-semibold text-white">Barista Espresso Bean Restocked</p>
                <span className="text-[10px] text-slate-500">10:02 AM • Ethiopian Single Origin now brewing</span>
              </div>
            </div>
          </div>
        </div>

        {/* Floating Glass Bottom Navigation */}
        <nav className="fixed bottom-3 left-1/2 -translate-x-1/2 w-[calc(100%-2rem)] max-w-sm glass-panel-accent p-2 rounded-2xl flex items-center justify-around border border-white/15 z-50 shadow-2xl">
          <button
            type="button"
            onClick={() => setActiveTab('map')}
            className={`flex flex-col items-center space-y-0.5 px-3 py-1 rounded-xl text-[10px] transition-colors ${
              activeTab === 'map' ? 'text-emerald-400 font-bold bg-emerald-500/10' : 'text-slate-400 hover:text-white'
            }`}
          >
            <Compass className="w-4 h-4" />
            <span>Live Map</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('desks')}
            className={`flex flex-col items-center space-y-0.5 px-3 py-1 rounded-xl text-[10px] transition-colors ${
              activeTab === 'desks' ? 'text-emerald-400 font-bold bg-emerald-500/10' : 'text-slate-400 hover:text-white'
            }`}
          >
            <Laptop className="w-4 h-4" />
            <span>Desks</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('insights')}
            className={`flex flex-col items-center space-y-0.5 px-3 py-1 rounded-xl text-[10px] transition-colors ${
              activeTab === 'insights' ? 'text-emerald-400 font-bold bg-emerald-500/10' : 'text-slate-400 hover:text-white'
            }`}
          >
            <Activity className="w-4 h-4" />
            <span>Insights</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('pass')}
            className={`flex flex-col items-center space-y-0.5 px-3 py-1 rounded-xl text-[10px] transition-colors ${
              activeTab === 'pass' ? 'text-emerald-400 font-bold bg-emerald-500/10' : 'text-slate-400 hover:text-white'
            }`}
          >
            <Fingerprint className="w-4 h-4" />
            <span>NFC Pass</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('profile')}
            className={`flex flex-col items-center space-y-0.5 px-3 py-1 rounded-xl text-[10px] transition-colors ${
              activeTab === 'profile' ? 'text-emerald-400 font-bold bg-emerald-500/10' : 'text-slate-400 hover:text-white'
            }`}
          >
            <User className="w-4 h-4" />
            <span>Profile</span>
          </button>
        </nav>
      </div>
    </div>
  );
}

