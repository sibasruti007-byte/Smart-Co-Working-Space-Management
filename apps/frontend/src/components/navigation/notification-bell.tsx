'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { Bell, CheckCheck, Sparkles, MessageSquare, CheckCircle2, Trash2, PlusCircle } from 'lucide-react';

interface NotificationItem {
  id: string;
  type: 'BOOKING' | 'MESSAGE' | 'TELEMETRY';
  title: string;
  message: string;
  time: string;
  read: boolean;
  link?: string;
}

const INITIAL_NOTIFICATIONS: NotificationItem[] = [
  {
    id: 'notif-1',
    type: 'BOOKING',
    title: 'Booking Confirmed',
    message: 'Your reservation for Apex Executive Suite today at 09:00 is active. Digital NFC pass ready.',
    time: '10m ago',
    read: false,
    link: '/dashboard/user',
  },
  {
    id: 'notif-2',
    type: 'MESSAGE',
    title: 'New Space Tour Scheduled',
    message: 'Foundry Partners confirmed your tour request for tomorrow at 14:00.',
    time: '1h ago',
    read: false,
    link: '/dashboard/user',
  },
  {
    id: 'notif-3',
    type: 'TELEMETRY',
    title: 'Peak Occupancy Forecast',
    message: 'Quiet Focus Pods on Floor 5 now at 85% availability. Reserve before 14:00 peak.',
    time: '2h ago',
    read: true,
    link: '/spaces/apex-executive-suite/live',
  },
];

export function NotificationBell() {
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState<NotificationItem[]>(INITIAL_NOTIFICATIONS);
  const menuRef = useRef<HTMLDivElement>(null);

  const unreadCount = notifications.filter((n) => !n.read).length;

  const markAllRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const clearAll = () => {
    setNotifications([]);
  };

  const addSimulatedAlert = () => {
    const alerts: NotificationItem[] = [
      {
        id: `notif-${Date.now()}`,
        type: 'TELEMETRY',
        title: 'IAQ Clean Air Optimal',
        message: 'Floor 4 CO₂ levels purged to 420 ppm. Filtration cycle complete.',
        time: 'Just now',
        read: false,
        link: '/spaces/apex-executive-suite/live',
      },
      {
        id: `notif-${Date.now()}`,
        type: 'BOOKING',
        title: 'Turnstile Access Granted',
        message: 'Gate 04 NFC credentials synchronized with your pass.',
        time: 'Just now',
        read: false,
        link: '/spaces/apex-executive-suite/live',
      },
    ];
    const randomAlert = alerts[Math.floor(Math.random() * alerts.length)];
    setNotifications((prev) => [randomAlert, ...prev]);
  };

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={menuRef}>
      <button
        type="button"
        aria-label="View notifications"
        aria-expanded={isOpen}
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 rounded-xl bg-[#131b2e] hover:bg-slate-800 border border-white/10 hover:border-emerald-500/40 text-slate-300 hover:text-white transition-all cursor-pointer focus:outline-none focus:ring-2 focus:ring-emerald-500"
      >
        <Bell className="w-4 h-4" />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-emerald-500 text-slate-950 font-mono font-bold text-[9px] flex items-center justify-center shadow-glow animate-pulse">
            {unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 sm:w-96 rounded-3xl bg-[#0b1326] border border-white/10 shadow-2xl p-4 z-50 space-y-3 backdrop-blur-xl">
          <div className="flex items-center justify-between border-b border-white/10 pb-3">
            <div className="flex items-center space-x-2">
              <span className="text-xs font-bold uppercase tracking-wider text-white">Notifications</span>
              {unreadCount > 0 && (
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 font-semibold border border-emerald-500/30">
                  {unreadCount} new
                </span>
              )}
            </div>
            <div className="flex items-center space-x-2">
              {unreadCount > 0 && (
                <button
                  type="button"
                  onClick={markAllRead}
                  className="text-[11px] text-slate-400 hover:text-emerald-400 flex items-center space-x-1 transition-colors cursor-pointer"
                >
                  <CheckCheck className="w-3.5 h-3.5" />
                  <span>Mark read</span>
                </button>
              )}
              {notifications.length > 0 && (
                <button
                  type="button"
                  onClick={clearAll}
                  className="text-[11px] text-slate-500 hover:text-rose-400 flex items-center space-x-1 transition-colors cursor-pointer"
                  title="Clear all notifications"
                >
                  <Trash2 className="w-3 h-3" />
                </button>
              )}
            </div>
          </div>

          <div className="max-h-80 overflow-y-auto space-y-2 pr-1">
            {notifications.length === 0 ? (
              <div className="text-center py-6 space-y-2">
                <p className="text-xs text-slate-500">No active notifications</p>
                <button
                  type="button"
                  onClick={addSimulatedAlert}
                  className="inline-flex items-center space-x-1 text-[11px] text-emerald-400 hover:underline cursor-pointer"
                >
                  <PlusCircle className="w-3 h-3" />
                  <span>Simulate Inbound Push</span>
                </button>
              </div>
            ) : (
              notifications.map((n) => (
                <Link
                  key={n.id}
                  href={n.link || '#'}
                  onClick={() => {
                    setNotifications((prev) =>
                      prev.map((item) => (item.id === n.id ? { ...item, read: true } : item))
                    );
                    setIsOpen(false);
                  }}
                  className={`block p-3 rounded-2xl border transition-all ${
                    n.read
                      ? 'bg-transparent border-white/5 opacity-75 hover:bg-white/[0.02]'
                      : 'bg-[#131b2e] border-emerald-500/30 hover:border-emerald-500/50'
                  }`}
                >
                  <div className="flex items-start space-x-2.5">
                    <div className="mt-0.5">
                      {n.type === 'BOOKING' && <CheckCircle2 className="w-4 h-4 text-emerald-400" />}
                      {n.type === 'MESSAGE' && <MessageSquare className="w-4 h-4 text-cyan-400" />}
                      {n.type === 'TELEMETRY' && <Sparkles className="w-4 h-4 text-purple-400" />}
                    </div>
                    <div className="flex-1 space-y-0.5">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-white">{n.title}</span>
                        <span className="text-[10px] text-slate-500 font-mono">{n.time}</span>
                      </div>
                      <p className="text-[11px] text-slate-400 leading-relaxed line-clamp-2">
                        {n.message}
                      </p>
                    </div>
                  </div>
                </Link>
              ))
            )}
          </div>

          <div className="border-t border-white/10 pt-2 flex items-center justify-between text-[11px]">
            <button
              type="button"
              onClick={addSimulatedAlert}
              className="text-slate-400 hover:text-cyan-400 flex items-center space-x-1 cursor-pointer"
            >
              <PlusCircle className="w-3 h-3" />
              <span>Simulate Alert</span>
            </button>
            <Link
              href="/dashboard/user"
              onClick={() => setIsOpen(false)}
              className="text-emerald-400 hover:underline font-semibold"
            >
              Attendee Dashboard →
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
