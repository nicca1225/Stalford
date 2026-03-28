'use client';

import { use, useEffect, useState } from 'react';
import Link from 'next/link';
import { ChevronLeft, Users, TrendingUp, AlertCircle } from 'lucide-react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from 'recharts';
import ConfidenceBadge from '@/components/ui/ConfidenceBadge';
import { getResults } from '@/lib/api';
import type { DatabaseFeed, StudentResult } from '@/types/database';

function MiniBar({ value }: { value: number | null }) {
  const v = value ?? 0;
  const color = v >= 75 ? 'bg-green-400' : v >= 50 ? 'bg-yellow-400' : 'bg-red-400';
  return (
    <div className="flex items-center gap-1">
      <div className="w-12 bg-gray-100 rounded-full h-1.5">
        <div className={`${color} h-1.5 rounded-full`} style={{ width: `${v}%` }} />
      </div>
      <span className="text-xs text-gray-500">{value !== null ? `${v}%` : '—'}</span>
    </div>
  );
}

function mostCommonError(student: StudentResult): string | null {
  const errors = student.detailed_grading
    .filter((q) => q.error_type !== null)
    .map((q) => q.error_type as string);
  if (errors.length === 0) return null;
  const freq: Record<string, number> = {};
  for (const e of errors) freq[e] = (freq[e] ?? 0) + 1;
  return Object.entries(freq).sort((a, b) => b[1] - a[1])[0][0];
}

export default function ClassAnalyticsPage({
  params,
}: {
  params: Promise<{ classId: string }>;
}) {
  const { classId } = use(params);
  const [feed, setFeed] = useState<DatabaseFeed | null>(null);

  useEffect(() => {
    getResults().then(setFeed).catch(() => null);
  }, []);

  const classData = feed?.all_classes.find(
    (c) => c.class_summary.class_id === decodeURIComponent(classId)
  );

  if (!feed) {
    return <p className="p-8 text-sm text-gray-400">Loading…</p>;
  }
  if (!classData) {
    return (
      <div className="p-8">
        <Link href="/tutor/analytics" className="flex items-center gap-1 text-gray-500 hover:text-gray-900 text-sm mb-4">
          <ChevronLeft size={16} /> Back to All Classes
        </Link>
        <p className="text-sm text-red-500">Class &quot;{classId}&quot; not found.</p>
      </div>
    );
  }

  const { class_summary, students } = classData;
  const { class_id, class_average_percentage, students_needing_attention, total_students, performance_by_topic } =
    class_summary;

  const chartData = Object.entries(performance_by_topic).map(([topic, score]) => ({
    topic,
    score: score ?? 0,
  }));

  const topics = Object.keys(performance_by_topic);

  return (
    <div className="p-8">
      <Link
        href="/tutor/analytics"
        className="flex items-center gap-1 text-gray-500 hover:text-gray-900 text-sm mb-6"
      >
        <ChevronLeft size={16} /> Back to All Classes
      </Link>

      {/* Header */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 mb-6">
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{class_id}</h1>
            <p className="text-gray-500 text-sm mt-1">AI-driven insights</p>
          </div>
          <span className="px-4 py-2 bg-yellow-100 text-yellow-700 font-bold text-sm rounded-full">
            {class_average_percentage}% Class Average
          </span>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
          <div className="flex items-center gap-2 mb-1">
            <Users size={16} className="text-blue-500" />
            <p className="text-xs text-gray-500">Students in Class</p>
          </div>
          <p className="text-2xl font-bold text-gray-900">{total_students}</p>
        </div>
        <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
          <div className="flex items-center gap-2 mb-1">
            <TrendingUp size={16} className="text-green-500" />
            <p className="text-xs text-gray-500">Class Average</p>
          </div>
          <p className="text-2xl font-bold text-gray-900">{class_average_percentage}%</p>
        </div>
        <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
          <div className="flex items-center gap-2 mb-1">
            <AlertCircle size={16} className="text-orange-500" />
            <p className="text-xs text-gray-500">Need Attention</p>
          </div>
          <p className="text-2xl font-bold text-gray-900">{students_needing_attention}</p>
          <p className="text-xs text-gray-400 mt-0.5">Below 75%</p>
        </div>
      </div>

      {/* Bar Chart */}
      {chartData.length > 0 && (
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 mb-6">
          <h2 className="font-bold text-gray-900 mb-4">Class Performance by Topic</h2>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="topic" tick={{ fontSize: 11, fill: '#6b7280' }} />
              <YAxis domain={[0, 100]} tick={{ fontSize: 11, fill: '#6b7280' }} />
              <Tooltip
                contentStyle={{ borderRadius: '8px', border: '1px solid #e5e7eb', fontSize: '12px' }}
                formatter={(v) => [`${v}%`, 'Average']}
              />
              <Bar dataKey="score" fill="#FFC107" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}

      {/* Student Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-5 border-b border-gray-100">
          <h2 className="font-bold text-gray-900">Individual Student Analysis</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50 text-xs text-gray-500 uppercase tracking-wide">
                <th className="px-4 py-3 text-left">Student</th>
                <th className="px-4 py-3 text-left">Confidence</th>
                {topics.map((t) => (
                  <th key={t} className="px-4 py-3 text-left">{t}</th>
                ))}
                <th className="px-4 py-3 text-left">Worksheets</th>
                <th className="px-4 py-3 text-left">Common Issue</th>
                <th className="px-4 py-3 text-left">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {students.map((student) => {
                const initials = student.student_name
                  .split('_')
                  .map((p) => p[0])
                  .join('')
                  .toUpperCase()
                  .slice(0, 2);
                const commonError = mostCommonError(student);
                return (
                  <tr key={student.student_name} className="hover:bg-gray-50 transition-colors">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center flex-shrink-0">
                          <span className="text-xs font-bold text-gray-600">{initials}</span>
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-gray-900">
                            {student.student_name.replace(/_/g, ' ')}
                          </p>
                          <p className="text-xs text-gray-400">{class_id}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <ConfidenceBadge score={student.overall_percentage} />
                    </td>
                    {topics.map((t) => (
                      <td key={t} className="px-4 py-3">
                        <MiniBar value={student.topic_scores[t] ?? null} />
                      </td>
                    ))}
                    <td className="px-4 py-3">
                      <span className="text-sm text-gray-700">{student.detailed_grading.length}</span>
                    </td>
                    <td className="px-4 py-3">
                      <span className="text-xs text-gray-500">{commonError ?? '—'}</span>
                    </td>
                    <td className="px-4 py-3">
                      <Link
                        href={`/tutor/analytics/${encodeURIComponent(class_id)}/${encodeURIComponent(student.student_name)}`}
                        className="text-xs text-yellow-700 font-semibold bg-yellow-100 hover:bg-yellow-200 px-3 py-1.5 rounded-lg transition-colors"
                      >
                        Details
                      </Link>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
