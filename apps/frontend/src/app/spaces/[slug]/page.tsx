import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowLeft, Star, Users, MapPin, Check, ShieldCheck, Activity, Clock, Shield } from 'lucide-react';

interface Props {
  params: Promise<{ slug: string }>;
}

export default async function SpaceDetailPage({ params }: Props) {
  const { slug } = await params;

  // Render high-fidelity space preview
  return (
    <div className="min-h-screen bg-[#060e20] text-slate-100 pb-20">
      {/* Top Header */}
      <header className="border-b border-white/10 glass-panel sticky top-0 z-40 px-6 py-4">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <Link
            href="/spaces"
            className="inline-flex items-center space-x-2 text-sm text-slate-400 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Explorer</span>
          </Link>

          <div className="flex items-center space-x-3">
            <Link
              href={`/spaces/${slug}/live`}
              className="px-3.5 py-1.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-semibold hover:bg-emerald-500/20 transition-all flex items-center space-x-2"
            >
              <Activity className="w-3.5 h-3.5 animate-pulse" />
              <span>NexusSpace Telemetry</span>
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-6 pt-8 space-y-8">
        {/* Title Bar */}
        <div className="space-y-2">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-xs font-medium">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Admin Verified Workspace • Active Real-Time Sensors</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            Apex Innovation Suite • Flatiron Tech Hub
          </h1>
          <div className="flex flex-wrap items-center gap-4 text-sm text-slate-400">
            <div className="flex items-center space-x-1 text-amber-400">
              <Star className="w-4 h-4 fill-amber-400" />
              <span className="font-semibold text-white">4.9</span>
              <span>(48 reviews)</span>
            </div>
            <div className="flex items-center space-x-1">
              <MapPin className="w-4 h-4 text-slate-500" />
              <span>Flatiron District, New York, NY 10010</span>
            </div>
            <div className="flex items-center space-x-1">
              <Users className="w-4 h-4 text-slate-500" />
              <span>Up to 12 team members</span>
            </div>
          </div>
        </div>

        {/* Image Gallery */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 rounded-3xl overflow-hidden max-h-[460px]">
          <div className="md:col-span-2 relative h-80 md:h-full">
            <img
              src="https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=1200&q=80"
              alt="Workspace main floor"
              className="w-full h-full object-cover"
            />
            <div className="absolute top-4 left-4 px-3 py-1.5 rounded-xl bg-slate-950/80 backdrop-blur-md border border-white/10 text-xs text-emerald-400 font-semibold flex items-center space-x-1.5">
              <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>Live Occupancy: 4 / 12 Seats (33%)</span>
            </div>
          </div>
          <div className="hidden md:flex flex-col gap-4 h-full">
            <div className="h-1/2 relative rounded-2xl overflow-hidden">
              <img
                src="https://images.unsplash.com/photo-1524758631624-e2822e304c36?auto=format&fit=crop&w=800&q=80"
                alt="Acoustic meeting room"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="h-1/2 relative rounded-2xl overflow-hidden">
              <img
                src="https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=800&q=80"
                alt="Espresso bar & pantry"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>

        {/* Content & Sticky Booking Panel */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Details */}
          <div className="lg:col-span-2 space-y-8">
            {/* Highlights */}
            <div className="glass-panel p-6 rounded-2xl space-y-4">
              <h2 className="text-xl font-bold text-white">About this Workspace</h2>
              <p className="text-slate-300 leading-relaxed text-sm">
                Designed for high-output software engineering, product strategy, and creative agencies. Equipped with motorized standing desks, Herman Miller Embody ergonomic chairs, 4K displays, biometric turnstiles, and enterprise gigabit fiber with redundant power backup.
              </p>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 pt-2">
                <div className="p-3.5 rounded-xl bg-[#0b1326] border border-white/5 space-y-1">
                  <span className="text-xs text-slate-500 uppercase">Space Type</span>
                  <p className="text-sm font-semibold text-white">Private Team Suite</p>
                </div>
                <div className="p-3.5 rounded-xl bg-[#0b1326] border border-white/5 space-y-1">
                  <span className="text-xs text-slate-500 uppercase">Floor Area</span>
                  <p className="text-sm font-semibold text-white">850 sq ft (71 sq ft/person)</p>
                </div>
                <div className="p-3.5 rounded-xl bg-[#0b1326] border border-white/5 space-y-1">
                  <span className="text-xs text-slate-500 uppercase">Operating Hours</span>
                  <p className="text-sm font-semibold text-white">Mon-Sun 24/7 Access</p>
                </div>
              </div>
            </div>

            {/* Amenities Grid */}
            <div className="glass-panel p-6 rounded-2xl space-y-4">
              <h2 className="text-xl font-bold text-white">Amenities & Hardware</h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {[
                  'Gigabit Wi-Fi 6 (1 Gbps)',
                  '100% Power Generator Backup',
                  'Dual 4K UltraSharp Displays',
                  'Acoustic Phone Booths',
                  'Artisan Espresso Bar',
                  '24/7 Biometric Turnstiles',
                  'Motorized Standing Desks',
                  'Smart Turnstile Access',
                  'Air Quality Monitoring (IAQ)',
                ].map((item, idx) => (
                  <div key={idx} className="flex items-center space-x-2.5 text-sm text-slate-300">
                    <Check className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Environmental & IoT Telemetry Summary */}
            <div className="glass-panel p-6 rounded-2xl space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-white">Facility Telemetry</h2>
                <Link
                  href={`/spaces/${slug}/live`}
                  className="text-xs text-emerald-400 font-semibold hover:underline"
                >
                  View Floorplan →
                </Link>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
                <div className="p-3 rounded-xl bg-[#0b1326] border border-white/5">
                  <span className="text-xs text-slate-500">Air Quality</span>
                  <p className="text-lg font-bold text-emerald-400 font-mono">94 IAQ</p>
                  <span className="text-[10px] text-slate-500">CO₂: 480 ppm</span>
                </div>
                <div className="p-3 rounded-xl bg-[#0b1326] border border-white/5">
                  <span className="text-xs text-slate-500">Noise Level</span>
                  <p className="text-lg font-bold text-cyan-400 font-mono">38 dB</p>
                  <span className="text-[10px] text-slate-500">Ultra Quiet</span>
                </div>
                <div className="p-3 rounded-xl bg-[#0b1326] border border-white/5">
                  <span className="text-xs text-slate-500">Temperature</span>
                  <p className="text-lg font-bold text-white font-mono">22.0°C</p>
                  <span className="text-[10px] text-slate-500">Target 22°C</span>
                </div>
                <div className="p-3 rounded-xl bg-[#0b1326] border border-white/5">
                  <span className="text-xs text-slate-500">Natural Light</span>
                  <p className="text-lg font-bold text-amber-400 font-mono">520 Lux</p>
                  <span className="text-[10px] text-slate-500">North Façade</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Sticky Booking Panel */}
          <div className="space-y-6">
            <div className="glass-panel-accent p-6 rounded-3xl sticky top-24 space-y-6 shadow-2xl">
              <div className="flex items-baseline justify-between border-b border-white/10 pb-4">
                <div>
                  <span className="text-3xl font-extrabold text-white font-mono">$48</span>
                  <span className="text-sm text-slate-400"> / hour</span>
                </div>
                <span className="text-xs px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-400 font-semibold border border-emerald-500/30">
                  Instant Confirmation
                </span>
              </div>

              {/* Slot Selection */}
              <div className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-300 uppercase">Reservation Date</label>
                  <input
                    type="date"
                    defaultValue="2026-11-15"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#0b1326] border border-white/10 text-white text-sm focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-slate-300 uppercase">Start Time</label>
                    <input
                      type="time"
                      defaultValue="09:00"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-[#0b1326] border border-white/10 text-white text-sm focus:outline-none focus:border-emerald-500"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-slate-300 uppercase">End Time</label>
                    <input
                      type="time"
                      defaultValue="17:00"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-[#0b1326] border border-white/10 text-white text-sm focus:outline-none focus:border-emerald-500"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-300 uppercase">Attendees (Max 12)</label>
                  <input
                    type="number"
                    min={1}
                    max={12}
                    defaultValue={6}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#0b1326] border border-white/10 text-white text-sm focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

              {/* Fee Calculation Breakdown */}
              <div className="space-y-2 pt-2 border-t border-white/10 text-xs text-slate-400">
                <div className="flex justify-between">
                  <span>8 hours × $48.00/hr</span>
                  <span className="font-mono text-white">$384.00</span>
                </div>
                <div className="flex justify-between">
                  <span>Facilities & Maintenance</span>
                  <span className="font-mono text-white">$25.00</span>
                </div>
                <div className="flex justify-between">
                  <span>Platform Service Fee</span>
                  <span className="font-mono text-white">$15.00</span>
                </div>
                <div className="flex justify-between font-bold text-sm text-white pt-2 border-t border-white/10">
                  <span>Total Amount</span>
                  <span className="font-mono text-emerald-400">$424.00</span>
                </div>
              </div>

              <button
                type="button"
                className="w-full py-3.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-sm transition-all shadow-glow flex items-center justify-center space-x-2"
              >
                <Shield className="w-4 h-4" />
                <span>Reserve Workspace</span>
              </button>

              <div className="text-center text-[11px] text-slate-500 flex items-center justify-center space-x-1.5">
                <Clock className="w-3.5 h-3.5" />
                <span>Free cancellation up to 24 hours prior to booking</span>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

