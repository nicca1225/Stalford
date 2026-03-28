'use client';

import Link from 'next/link';
import { Users, TrendingUp, AlertTriangle } from 'lucide-react';
import StatCard from '@/components/ui/StatCard';

const classes = [
  {
    id: 'p5-math-a',
    name: 'P5-Math-A',
    subject: 'Mathematics',
    level: 'Primary 5',
    students: 10,
    avgScore: 84,
    quality: 'Good',
    qualityColor: 'bg-green-100 text-green-700',
    needAttention: 1,
  },
  {
    id: 'p5-math-b',
    name: 'P5-Math-B',
    subject: 'Mathematics',
    level: 'Primary 5',
    students: 10,
    avgScore: 91,
    quality: 'Good',
    qualityColor: 'bg-green-100 text-green-700',
    needAttention: 0,
  },
];

export default function TutorAnalyticsPage() {
  return (
    <>
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Student Performance Analytics</h1>
        <p className="text-gray-500 text-sm mt-1">Overview of all classes you&apos;re teaching.</p>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <StatCard
          title="Total Classes"
          value={2}
          subtitle="Active classes"
          icon={<TrendingUp size={20} />}
        />
        <StatCard
          title="Total Students"
          value={20}
          subtitle="Across all classes"
          icon={<Users size={20} />}
        />
        <StatCard
          title="Students Need Attention"
          value={1}
          subtitle="Below 75% confidence"
          icon={<AlertTriangle size={20} />}
        />
      </div>

      {/* Your Classes */}
      <h2 className="text-base font-bold text-gray-900 mb-4">Your Classes</h2>
      <div className="flex flex-col gap-4">
        {classes.map((c) => (
          <div key={c.id} className="bg-white rounded-xl border border-gray-100 p-6 shadow-sm">
            <div className="flex items-center justify-between">

              {/* Left: name + badges */}
              <div className="flex flex-col gap-3">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="font-bold text-gray-900">{c.name}</span>
                  <span className="text-xs px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200 font-semibold">
                    {c.subject}
                  </span>
                  <span className="text-xs px-2.5 py-0.5 rounded-full bg-zinc-100 text-zinc-500 font-medium">
                    {c.level}
                  </span>
                </div>

                {/* Stats inline */}
                <div className="flex items-center gap-6 text-sm">
                  <div className="flex items-center gap-1.5 text-gray-600">
                    <Users size={14} className="text-gray-400" />
                    <span>{c.students} Students</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <TrendingUp size={14} className="text-gray-400" />
                    <span className="font-bold text-gray-900">{c.avgScore}%</span>
                    <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${c.qualityColor}`}>
                      {c.quality}
                    </span>
                    <span className="text-gray-400 text-xs">Class Average</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-gray-600">
                    <AlertTriangle size={14} className={c.needAttention > 0 ? 'text-orange-500' : 'text-gray-300'} />
                    <span className={c.needAttention > 0 ? 'text-orange-600 font-semibold' : 'text-gray-400'}>
                      {c.needAttention} Need Attention
                    </span>
                  </div>
                </div>
              </div>

              {/* View Details button */}
              <Link
                href={`/tutor/analytics/${c.id}`}
                className="flex items-center gap-1.5 bg-[#FFC107] hover:bg-yellow-500 text-black font-semibold text-sm px-5 py-2.5 rounded-lg transition-colors flex-shrink-0"
              >
                View Details &rsaquo;
              </Link>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}
