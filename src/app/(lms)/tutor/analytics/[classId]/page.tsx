'use client';

import { use } from 'react';
import Link from 'next/link';
import { ChevronLeft, Users, TrendingUp, AlertCircle } from 'lucide-react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from 'recharts';
import { classes, classStudents, classAnalytics } from '@/lib/mockData';

function ConfidenceBadge({ score }: { score: number }) {
  if (score >= 76) return <span className="px-2 py-0.5 bg-green-100 text-green-700 text-xs font-semibold rounded-full">{score}%</span>;
  if (score >= 51) return <span className="px-2 py-0.5 bg-yellow-100 text-yellow-700 text-xs font-semibold rounded-full">{score}%</span>;
  return <span className="px-2 py-0.5 bg-red-100 text-red-700 text-xs font-semibold rounded-full">{score}%</span>;
}

function MiniBar({ value }: { value: number }) {
  const color = value >= 76 ? 'bg-green-400' : value >= 51 ? 'bg-yellow-400' : 'bg-red-400';
  return (
    <div className="flex items-center gap-1">
      <div className="w-12 bg-gray-100 rounded-full h-1.5">
        <div className={`${color} h-1.5 rounded-full`} style={{ width: `${value}%` }} />
      </div>
      <span className="text-xs text-gray-500">{value}%</span>
    </div>
  );
}

export default function ClassAnalyticsPage({ params }: { params: Promise<{ classId: string }> }) {
  const { classId } = use(params);
  const cls = classes.find((c) => c.id === classId);
  const students = classStudents[classId as keyof typeof classStudents] || [];
  const analytics = classAnalytics[classId as keyof typeof classAnalytics];

  if (!cls) return <div className="p-8 text-gray-600">Class not found.</div>;

  return (
    <div className="p-8">
      <Link href="/tutor/analytics" className="flex items-center gap-1 text-gray-500 hover:text-gray-900 text-sm mb-6">
        <ChevronLeft size={16} />
        Back to All Classes
      </Link>

      {/* Header */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 mb-6">
        <div className="flex items-start justify-between">
          <div>
            <div className="flex items-center gap-3 mb-1">
              <h1 className="text-2xl font-bold text-gray-900">{cls.name}</h1>
              <span className="bg-gray-100 text-gray-600 text-xs px-2 py-1 rounded-full font-medium">{cls.level}</span>
            </div>
            <p className="text-gray-500 text-sm">{cls.subject} • AI-driven insights</p>
          </div>
          <span className="px-4 py-2 bg-yellow-100 text-yellow-700 font-bold text-sm rounded-full">
            {cls.classAverage}% Class Average
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
          <p className="text-2xl font-bold text-gray-900">{cls.studentCount}</p>
        </div>
        <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
          <div className="flex items-center gap-2 mb-1">
            <TrendingUp size={16} className="text-green-500" />
            <p className="text-xs text-gray-500">Class Average</p>
          </div>
          <p className="text-2xl font-bold text-gray-900">{cls.classAverage}%</p>
          <p className="text-xs text-green-600 mt-0.5">+4% from last month</p>
        </div>
        <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
          <div className="flex items-center gap-2 mb-1">
            <AlertCircle size={16} className="text-orange-500" />
            <p className="text-xs text-gray-500">Need Attention</p>
          </div>
          <p className="text-2xl font-bold text-gray-900">{cls.needAttention}</p>
          <p className="text-xs text-gray-400 mt-0.5">Below 75%</p>
        </div>
      </div>

      {/* Bar Chart */}
      {analytics && (
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 mb-6">
          <h2 className="font-bold text-gray-900 mb-4">Class Performance by Topic</h2>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={analytics.topicPerformance}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="topic" tick={{ fontSize: 11, fill: '#6b7280' }} />
              <YAxis domain={[0, 100]} tick={{ fontSize: 11, fill: '#6b7280' }} />
              <Tooltip
                contentStyle={{ borderRadius: '8px', border: '1px solid #e5e7eb', fontSize: '12px' }}
                formatter={(v) => [`${v}%`, 'Average']}
              />
              <Bar dataKey="average" fill="#EAB308" radius={[4, 4, 0, 0]} />
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
                <th className="px-4 py-3 text-left">Algebra</th>
                <th className="px-4 py-3 text-left">Geometry</th>
                <th className="px-4 py-3 text-left">Fractions</th>
                <th className="px-4 py-3 text-left">Worksheets</th>
                <th className="px-4 py-3 text-left">Avg Time</th>
                <th className="px-4 py-3 text-left">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {students.map((student) => (
                <tr key={student.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
                        <span className="text-xs font-bold text-gray-600">{student.initials}</span>
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-gray-900">{student.name}</p>
                        <p className="text-xs text-gray-400">{cls.name}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <ConfidenceBadge score={student.overallConfidence} />
                  </td>
                  <td className="px-4 py-3"><MiniBar value={student.algebra} /></td>
                  <td className="px-4 py-3"><MiniBar value={student.geometry} /></td>
                  <td className="px-4 py-3"><MiniBar value={student.fractions} /></td>
                  <td className="px-4 py-3">
                    <span className="text-sm text-gray-700">{student.worksheetsCompleted}</span>
                  </td>
                  <td className="px-4 py-3">
                    <span className="text-sm text-gray-700">{student.avgTime} min</span>
                  </td>
                  <td className="px-4 py-3">
                    <Link
                      href={`/tutor/analytics/${classId}/students/${student.id}`}
                      className="text-xs text-yellow-700 font-semibold bg-yellow-100 hover:bg-yellow-200 px-3 py-1.5 rounded-lg transition-colors"
                    >
                      Details
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
