'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ShieldCheck, CheckCircle2, XCircle, ArrowLeft, Clock, Building2, Eye } from 'lucide-react';

interface MockPendingSpace {
  id: string;
  title: string;
  ownerName: string;
  city: string;
  capacity: number;
  hourlyPrice: number;
  type: string;
  submittedAt: string;
  status: 'PENDING_VERIFICATION' | 'APPROVED' | 'REJECTED';
}

const INITIAL_QUEUE: MockPendingSpace[] = [
  {
    id: 'space-pending-1',
    title: 'CyberFoundry AI Hub • SoHo Loft',
    ownerName: 'Marcus Sterling',
    city: 'New York',
    capacity: 16,
    hourlyPrice: 65,
    type: 'PRIVATE_CABIN',
    submittedAt: '12 minutes ago',
    status: 'PENDING_VERIFICATION',
  },
  {
    id: 'space-pending-2',
    title: 'Quantum Bay Collaborative Lab',
    ownerName: 'Elena Rostova',
    city: 'San Francisco',
    capacity: 24,
    hourlyPrice: 50,
    type: 'SHARED_DESK',
    submittedAt: '45 minutes ago',
    status: 'PENDING_VERIFICATION',
  },
  {
    id: 'space-pending-3',
    title: 'Vanguard Central Executive Suite',
    ownerName: 'Victoria Cavendish',
    city: 'London',
    capacity: 8,
    hourlyPrice: 42,
    type: 'MEETING_ROOM',
    submittedAt: '2 hours ago',
    status: 'PENDING_VERIFICATION',
  },
];

export default function AdminVerificationQueuePage() {
  const [queue, setQueue] = useState<MockPendingSpace[]>(INITIAL_QUEUE);
  const [rejectingId, setRejectingId] = useState<string | null>(null);
  const [rejectionReason, setRejectionReason] = useState<string>('');

  const handleApprove = (id: string) => {
    setQueue((prev) =>
      prev.map((item) => (item.id === id ? { ...item, status: 'APPROVED' } : item))
    );
  };

  const handleConfirmReject = () => {
    if (!rejectingId) return;
    setQueue((prev) =>
      prev.map((item) => (item.id === rejectingId ? { ...item, status: 'REJECTED' } : item))
    );
    setRejectingId(null);
    setRejectionReason('');
  };

  return (
    <div className="min-h-screen bg-[#060e20] text-slate-100 p-6 sm:p-10 space-y-8">
      {/* Header */}
      <div className="max-w-6xl mx-auto flex items-center justify-between border-b border-white/10 pb-6">
        <div className="space-y-1">
          <div className="flex items-center space-x-3">
            <Link
              href="/"
              className="text-slate-400 hover:text-white transition-colors flex items-center space-x-1 text-sm mr-2"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Home</span>
            </Link>
            <div className="h-8 w-8 rounded-lg bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <h1 className="text-2xl font-bold tracking-tight text-white">Administrator Moderation Queue</h1>
          </div>
          <p className="text-sm text-slate-400">
            Review and verify new co-working space submissions before they appear in public search results.
          </p>
        </div>

        <div className="flex items-center space-x-2 text-xs text-slate-400 px-3 py-1.5 rounded-xl glass-panel">
          <Clock className="w-3.5 h-3.5 text-cyan-400" />
          <span>{queue.filter((q) => q.status === 'PENDING_VERIFICATION').length} Listings Awaiting Review</span>
        </div>
      </div>

      {/* Queue List */}
      <div className="max-w-6xl mx-auto space-y-4">
        {queue.map((space) => (
          <div
            key={space.id}
            className="glass-panel p-6 rounded-2xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6 hover:border-white/20 transition-all"
          >
            <div className="space-y-2">
              <div className="flex items-center space-x-3">
                <Building2 className="w-5 h-5 text-emerald-400" />
                <h3 className="text-lg font-bold text-white">{space.title}</h3>
                <span
                  className={`text-[11px] font-semibold uppercase px-2.5 py-0.5 rounded-full border ${
                    space.status === 'PENDING_VERIFICATION'
                      ? 'bg-amber-500/10 border-amber-500/30 text-amber-400'
                      : space.status === 'APPROVED'
                      ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'
                      : 'bg-rose-500/10 border-rose-500/30 text-rose-400'
                  }`}
                >
                  {space.status.replace('_', ' ')}
                </span>
              </div>

              <div className="flex flex-wrap items-center gap-4 text-xs text-slate-400">
                <span>Owner: <strong className="text-slate-200">{space.ownerName}</strong></span>
                <span>City: <strong className="text-slate-200">{space.city}</strong></span>
                <span>Type: <strong className="text-slate-200">{space.type}</strong></span>
                <span>Capacity: <strong className="text-slate-200">{space.capacity} seats</strong></span>
                <span>Price: <strong className="text-emerald-400 font-mono">${space.hourlyPrice}/hr</strong></span>
                <span>Submitted: {space.submittedAt}</span>
              </div>
            </div>

            {/* Action Buttons */}
            {space.status === 'PENDING_VERIFICATION' && (
              <div className="flex items-center space-x-3 w-full md:w-auto">
                <button
                  type="button"
                  onClick={() => handleApprove(space.id)}
                  className="px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs transition-all flex items-center space-x-1.5 shadow-glow"
                >
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Approve Listing</span>
                </button>
                <button
                  type="button"
                  onClick={() => setRejectingId(space.id)}
                  className="px-4 py-2 rounded-xl bg-rose-500/10 border border-rose-500/30 hover:bg-rose-500/20 text-rose-400 font-semibold text-xs transition-all flex items-center space-x-1.5"
                >
                  <XCircle className="w-3.5 h-3.5" />
                  <span>Reject with Feedback</span>
                </button>
              </div>
            )}

            {space.status === 'APPROVED' && (
              <div className="text-xs text-emerald-400 font-semibold flex items-center space-x-1.5">
                <CheckCircle2 className="w-4 h-4" />
                <span>Published to Search Engine</span>
              </div>
            )}

            {space.status === 'REJECTED' && (
              <div className="text-xs text-rose-400 font-semibold flex items-center space-x-1.5">
                <XCircle className="w-4 h-4" />
                <span>Returned to Owner for Revisions</span>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Reject Modal */}
      {rejectingId && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="glass-panel-accent max-w-md w-full p-6 rounded-3xl space-y-4">
            <h3 className="text-lg font-bold text-white">Rejection Feedback</h3>
            <p className="text-xs text-slate-400">
              Please specify the corrections required before this listing can be approved (e.g. higher resolution photos, clearer pricing details).
            </p>
            <textarea
              value={rejectionReason}
              onChange={(e) => setRejectionReason(e.target.value)}
              placeholder="e.g. Please provide high-resolution photos of the acoustic pods and specify the guest turnstile policy."
              rows={4}
              className="w-full p-3 rounded-xl bg-[#0b1326] border border-white/10 text-white text-xs placeholder-slate-500 focus:outline-none focus:border-rose-500"
            />
            <div className="flex items-center justify-end space-x-3 pt-2">
              <button
                type="button"
                onClick={() => setRejectingId(null)}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-400 hover:text-white"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={!rejectionReason.trim()}
                onClick={handleConfirmReject}
                className="px-4 py-2 rounded-xl bg-rose-500 hover:bg-rose-400 text-white font-bold text-xs disabled:opacity-50"
              >
                Confirm Rejection
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

