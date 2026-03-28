'use client';

import Link from 'next/link';
import { Users, BookOpen, ClipboardCheck, AlertTriangle, Clock } from 'lucide-react';
import StatCard from '@/components/ui/StatCard';
import StatusBadge from '@/components/ui/StatusBadge';
import OutlineButton from '@/components/ui/OutlineButton';

const recentSubmissions = [
  {
    name: 'Sophie Wong',
    worksheet: 'Decimals Worksheet 1',
    class: 'P5-Math-A',
    date: '2026-03-17 09:30',
    status: 'pending-review' as const,
  },
  {
    name: 'Ryan Lee',
    worksheet: 'Decimals Worksheet 1',
    class: 'P5-Math-A',
    date: '2026-03-17 10:15',
    status: 'processing' as const,
  },
  {
    name: 'Daniel Ng',
    worksheet: 'Algebra Basics',
    class: 'P5-Math-B',
    date: '2026-03-17 11:00',
    status: 'not-submitted' as const,
  },
];

export default function TutorHomePage() {
  return (
    <>
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Welcome Back Gojo Saturo!</h1>
        <p className="text-gray-500 text-sm mt-1">Here's an overview of your classes.</p>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <StatCard
          title="Total Students"
          value={20}
          subtitle="Across 2 classes"
          icon={<Users size={20} />}
        />
        <StatCard
          title="Materials"
          value={7}
          subtitle="Available resources"
          icon={<BookOpen size={20} />}
        />
        <StatCard
          title="Pending Grading"
          value={2}
          subtitle="Worksheets to review"
          icon={<ClipboardCheck size={20} />}
        />
      </div>

      {/* Two panels */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

        {/* Students Needing Attention */}
        <div className="bg-white rounded-xl border border-gray-100 p-6 shadow-sm">
          <div className="flex items-center justify-between mb-5">
            <div className="flex items-center gap-2">
              <AlertTriangle size={16} className="text-orange-500" />
              <span className="font-semibold text-gray-900 text-sm">Students Needing Attention</span>
            </div>
            <Link href="/tutor/analytics" className="text-sm text-yellow-500 hover:text-yellow-600 font-medium transition-colors">
              View All
            </Link>
          </div>

          {/* Student row */}
          <div className="flex items-center justify-between py-3">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-gray-200 flex items-center justify-center flex-shrink-0">
                <span className="text-xs font-bold text-gray-600">RL</span>
              </div>
              <div>
                <p className="font-semibold text-gray-900 text-sm">Ryan Lee</p>
                <p className="text-xs text-gray-400">P5-Math-A</p>
              </div>
            </div>
            <OutlineButton className="text-xs px-3 py-1.5">View Details</OutlineButton>
          </div>
        </div>

        {/* Recent Submissions */}
        <div className="bg-white rounded-xl border border-gray-100 p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Clock size={16} className="text-orange-500" />
              <span className="font-semibold text-gray-900 text-sm">Recent Submissions</span>
            </div>
            <Link href="/tutor/auto-grader" className="text-sm text-yellow-500 hover:text-yellow-600 font-medium transition-colors">
              View All
            </Link>
          </div>

          <div className="divide-y divide-gray-100">
            {recentSubmissions.map((s, i) => (
              <div key={i} className="py-3 flex items-center justify-between">
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-gray-900 text-sm">{s.name}</p>
                  <p className="text-xs text-gray-400 truncate">
                    {s.worksheet} ({s.class})
                  </p>
                  <p className="text-xs text-gray-400">{s.date}</p>
                </div>
                <div className="ml-3 flex-shrink-0">
                  <StatusBadge status={s.status} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
