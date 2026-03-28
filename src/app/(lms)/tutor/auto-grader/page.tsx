'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Info, RefreshCw, CheckCircle, XCircle, Eye } from 'lucide-react';
import StatCard from '@/components/ui/StatCard';
import StatusBadge from '@/components/ui/StatusBadge';
import OutlineButton from '@/components/ui/OutlineButton';

type Tab = 'review' | 'processing' | 'approved' | 'not-yet';

const reviewCards = [
  { name: 'Sophie Wong', topic: 'Decimals Worksheet 1', date: '2026-03-17 11:45', score: 96, status: 'pending-review' as const },
  { name: 'Chloe Lim',   topic: 'Decimals Worksheet 1', date: '2026-03-17 14:20', score: 87, status: 'pending-review' as const },
];

export default function AutoGraderPage() {
  const [tab, setTab] = useState<Tab>('review');

  const tabs: { key: Tab; label: string }[] = [
    { key: 'review',     label: 'Review (2)' },
    { key: 'processing', label: 'Processing (1)' },
    { key: 'approved',   label: 'Approved (1)' },
    { key: 'not-yet',    label: 'Not Yet (1)' },
  ];

  return (
    <>
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">AI Auto Grader</h1>
        <p className="text-gray-500 text-sm mt-1">Automated worksheet marking and evaluation.</p>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <StatCard title="Pending Review"  value={2} subtitle="Needs tutor verification"  icon={<Info size={18} />} />
        <StatCard title="AI Processing"   value={1} subtitle="In progress"               icon={<RefreshCw size={18} />} />
        <StatCard title="Approved"        value={1} subtitle="Completed & verified"       icon={<CheckCircle size={18} />} />
        <StatCard title="Not Submitted"   value={1} subtitle="Awaiting upload"            icon={<XCircle size={18} />} />
      </div>

      {/* Tabs */}
      <h2 className="text-base font-bold text-gray-900 mb-4">Recent Submissions</h2>
      <div className="flex border-b border-gray-200 mb-6">
        {tabs.map(({ key, label }) => (
          <button
            key={key}
            onClick={() => setTab(key)}
            className={`px-5 py-3 text-sm font-semibold transition-colors
              ${tab === key
                ? 'border-b-2 border-[#FFC107] text-gray-900 -mb-px'
                : 'text-gray-500 hover:text-gray-700'}`}
          >
            {label}
          </button>
        ))}
      </div>

      {/* ── Review tab ── */}
      {tab === 'review' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {reviewCards.map((c) => (
            <div key={c.name} className="bg-white rounded-xl border border-gray-100 p-5 shadow-sm flex flex-col gap-3">
              <div className="flex items-center justify-between">
                <span className="font-semibold text-gray-900">{c.name}</span>
                <StatusBadge status={c.status} />
              </div>
              <div className="text-sm text-gray-700">
                <span className="text-gray-400">Topic: </span>{c.topic}
              </div>
              <p className="text-xs text-gray-400">Date submitted: {c.date}</p>
              <span className="inline-block bg-[#FFC107] text-black text-xs font-bold px-3 py-1.5 rounded-lg w-fit">
                Score: {c.score}%
              </span>
              <Link href="/tutor/auto-grader/review">
                <OutlineButton fullWidth className="flex items-center justify-center gap-2 text-sm mt-1">
                  <Eye size={14} />
                  Review &amp; Verify
                </OutlineButton>
              </Link>
            </div>
          ))}
        </div>
      )}

      {/* ── Processing tab ── */}
      {tab === 'processing' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-white rounded-xl border border-gray-100 p-5 shadow-sm flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <span className="font-semibold text-gray-900">Ryan Lee</span>
              <StatusBadge status="processing" />
            </div>
            <div className="text-sm text-gray-700">
              <span className="text-gray-400">Topic: </span>Decimals Worksheet 1
            </div>
            <p className="text-xs text-gray-400">Date submitted: 2026-03-17 11:45</p>
            <OutlineButton className="flex items-center justify-center gap-2 text-sm w-full mt-1" disabled>
              <Eye size={14} />
              Review &amp; Verify
            </OutlineButton>
          </div>
        </div>
      )}

      {/* ── Approved tab ── */}
      {tab === 'approved' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-white rounded-xl border border-gray-100 p-5 shadow-sm flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <span className="font-semibold text-gray-900">Jonathan Lim</span>
              <StatusBadge status="approved" />
            </div>
            <div className="text-sm text-gray-700">
              <span className="text-gray-400">Topic: </span>Algebra Basics
            </div>
            <p className="text-xs text-gray-400">Date submitted: 2026-03-17 14:20</p>
            <span className="inline-block bg-[#FFC107] text-black text-xs font-bold px-3 py-1.5 rounded-lg w-fit">
              Score: 96%
            </span>
            <OutlineButton className="flex items-center justify-center gap-2 text-sm w-full mt-1">
              <Eye size={14} />
              Review
            </OutlineButton>
          </div>
        </div>
      )}

      {/* ── Not yet tab ── */}
      {tab === 'not-yet' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-white rounded-xl border border-gray-100 p-5 shadow-sm flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <span className="font-semibold text-gray-900">Damian Koh</span>
              <StatusBadge status="not-submitted" />
            </div>
            <div className="text-sm text-gray-700">
              <span className="text-gray-400">Topic: </span>Algebra Basics
            </div>
            <p className="text-xs text-gray-400">Date submitted: —</p>
          </div>
        </div>
      )}
    </>
  );
}
