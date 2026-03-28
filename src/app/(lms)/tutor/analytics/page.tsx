'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Users, TrendingUp, AlertTriangle } from 'lucide-react';
import StatCard from '@/components/ui/StatCard';
import { getResults } from '@/lib/api';
import type { DatabaseFeed } from '@/types/database';

function avgColor(score: number) {
  if (score >= 75) return { badge: 'bg-green-100 text-green-700', label: 'Good' };
  if (score >= 50) return { badge: 'bg-orange-100 text-orange-700', label: 'Average' };
  return { badge: 'bg-red-100 text-red-700', label: 'Needs Work' };
}

export default function TutorAnalyticsPage() {
  const [feed, setFeed] = useState<DatabaseFeed | null>(null);

  useEffect(() => {
    getResults().then(setFeed).catch(() => null);
  }, []);

  const totalClasses = feed?.all_classes.length ?? 0;
  const totalStudents = feed?.all_classes.reduce(
    (sum, c) => sum + c.class_summary.total_students, 0
  ) ?? 0;
  const totalNeedAttention = feed?.all_classes.reduce(
    (sum, c) => sum + c.class_summary.students_needing_attention, 0
  ) ?? 0;

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
          value={totalClasses}
          subtitle="Active classes"
          icon={<TrendingUp size={20} />}
        />
        <StatCard
          title="Total Students"
          value={totalStudents}
          subtitle="Across all classes"
          icon={<Users size={20} />}
        />
        <StatCard
          title="Students Need Attention"
          value={totalNeedAttention}
          subtitle="Below 75% confidence"
          icon={<AlertTriangle size={20} />}
        />
      </div>

      {/* Your Classes */}
      <h2 className="text-base font-bold text-gray-900 mb-4">Your Classes</h2>

      {!feed ? (
        <p className="text-sm text-gray-400">Loading class data…</p>
      ) : feed.all_classes.length === 0 ? (
        <p className="text-sm text-gray-400">No graded classes yet. Upload worksheets in the Auto Grader to get started.</p>
      ) : (
        <div className="flex flex-col gap-4">
          {feed.all_classes.map((cls) => {
            const { class_id, class_average_percentage, students_needing_attention, total_students } =
              cls.class_summary;
            const { badge, label } = avgColor(class_average_percentage);
            return (
              <div key={class_id} className="bg-white rounded-xl border border-gray-100 p-6 shadow-sm">
                <div className="flex items-center justify-between">
                  {/* Left */}
                  <div className="flex flex-col gap-3">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-bold text-gray-900">{class_id}</span>
                    </div>
                    <div className="flex items-center gap-6 text-sm">
                      <div className="flex items-center gap-1.5 text-gray-600">
                        <Users size={14} className="text-gray-400" />
                        <span>{total_students} Students</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <TrendingUp size={14} className="text-gray-400" />
                        <span className="font-bold text-gray-900">{class_average_percentage}%</span>
                        <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${badge}`}>
                          {label}
                        </span>
                        <span className="text-gray-400 text-xs">Class Average</span>
                      </div>
                      <div className="flex items-center gap-1.5 text-gray-600">
                        <AlertTriangle
                          size={14}
                          className={students_needing_attention > 0 ? 'text-orange-500' : 'text-gray-300'}
                        />
                        <span
                          className={
                            students_needing_attention > 0
                              ? 'text-orange-600 font-semibold'
                              : 'text-gray-400'
                          }
                        >
                          {students_needing_attention} Need Attention
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* View Details */}
                  <Link
                    href={`/tutor/analytics/${encodeURIComponent(class_id)}`}
                    className="flex items-center gap-1.5 bg-[#FFC107] hover:bg-yellow-500 text-black font-semibold text-sm px-5 py-2.5 rounded-lg transition-colors flex-shrink-0"
                  >
                    View Details &rsaquo;
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </>
  );
}
