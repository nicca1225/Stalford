'use client';

import { useState } from 'react';
import { Eye, User, Loader2 } from 'lucide-react';
import SubjectIcon from '@/components/ui/SubjectIcon';
import PrimaryButton from '@/components/ui/PrimaryButton';

type Tab = 'completed' | 'pending';

export default function SubmissionsPage() {
  const [tab, setTab] = useState<Tab>('completed');

  return (
    <>
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">My Submissions</h1>
        <p className="text-gray-500 text-sm mt-1">View all your worksheet submissions and results.</p>
      </div>

      {/* Underline Tabs */}
      <div className="flex border-b border-gray-200 mb-6">
        {(['completed', 'pending'] as Tab[]).map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`px-5 py-3 text-sm font-semibold transition-colors
              ${tab === t
                ? 'border-b-2 border-[#FFC107] text-gray-900 -mb-px'
                : 'text-gray-500 hover:text-gray-700'
              }`}
          >
            {t === 'completed' ? 'Completed (1)' : 'Pending (1)'}
          </button>
        ))}
      </div>

      {/* ── Completed Tab ── */}
      {tab === 'completed' && (
        <div className="bg-white rounded-xl border border-gray-100 p-6 shadow-sm">
          {/* Top row */}
          <div className="flex items-start justify-between mb-5">
            <div className="flex items-center gap-3">
              <SubjectIcon subject="mathematics" />
              <div>
                <p className="font-bold text-gray-900">Algebraic Expressions</p>
                <p className="text-xs text-gray-400 mt-0.5">Mathematics &bull; Algebra</p>
              </div>
            </div>
            <span className="text-xs font-semibold bg-green-100 text-green-700 px-3 py-1 rounded-full">
              Re-grade
            </span>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-4 gap-4 mb-4">
            {[
              { label: 'Total Points',       value: '100' },
              { label: 'Questions',          value: '5' },
              { label: 'Total Time',         value: '10 mins' },
              { label: 'Avg Time/Question',  value: '2 mins' },
            ].map(({ label, value }) => (
              <div key={label}>
                <p className="text-xs text-gray-400 mb-1">{label}</p>
                <p className="text-base font-bold text-gray-900">{value}</p>
              </div>
            ))}
          </div>

          <p className="text-xs text-gray-400 mb-4">Submitted 3/22/2026 10:57:45 AM</p>

          {/* Reviewer box */}
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 flex items-center justify-between mb-5">
            <div className="flex items-center gap-2">
              <span className="text-xs text-gray-500">Reviewed By</span>
              <User size={14} className="text-gray-400" />
              <span className="text-sm font-semibold text-gray-900">Mr. Kumar Raj</span>
            </div>
            <span className="text-xs text-gray-400">Graded on 3/22/2026</span>
          </div>

          <PrimaryButton fullWidth className="flex items-center justify-center gap-2 py-3">
            <Eye size={16} />
            View Marked Worksheet with Corrections
          </PrimaryButton>
        </div>
      )}

      {/* ── Pending Tab ── */}
      {tab === 'pending' && (
        <div className="bg-white rounded-xl border border-gray-100 p-6 shadow-sm">
          {/* Top row */}
          <div className="flex items-start justify-between mb-5">
            <div className="flex items-center gap-3">
              <SubjectIcon subject="english" />
              <div>
                <p className="font-bold text-gray-900">Grammar Essentials</p>
                <p className="text-xs text-gray-400 mt-0.5">English &bull; Verbs and Nouns</p>
              </div>
            </div>
            <span className="flex items-center gap-1.5 text-xs font-semibold bg-blue-100 text-blue-700 px-3 py-1 rounded-full">
              <Loader2 size={12} className="animate-spin" />
              Grading...
            </span>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-4 mb-5">
            {[
              { label: 'Total Points', value: '100' },
              { label: 'Questions',   value: '4' },
              { label: 'Submitted',   value: '3/22/2026 2:50:09 AM' },
            ].map(({ label, value }) => (
              <div key={label}>
                <p className="text-xs text-gray-400 mb-1">{label}</p>
                <p className="text-base font-bold text-gray-900">{value}</p>
              </div>
            ))}
          </div>

          {/* Info box */}
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 flex items-start gap-3">
            <Loader2 size={16} className="text-yellow-600 animate-spin mt-0.5 flex-shrink-0" />
            <div>
              <p className="text-sm font-bold text-gray-900">
                AI Auto-Grader &amp; Tutor Review In Progress
              </p>
              <p className="text-sm text-gray-500 mt-0.5">
                Your worksheet is being analyzed and graded...
              </p>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
