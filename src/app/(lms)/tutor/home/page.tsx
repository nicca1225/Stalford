'use client';

import Link from 'next/link';
import { Users, BookOpen, Clock, AlertCircle, CheckCircle2 } from 'lucide-react';
import { recentSubmissions } from '@/lib/mockData';

function StatusBadge({ status }: { status: string }) {
  if (status === 'pending-review') return <span className="px-2 py-1 bg-yellow-100 text-yellow-700 text-xs font-semibold rounded-full">Pending Review</span>;
  if (status === 'processing') return <span className="px-2 py-1 bg-blue-100 text-blue-700 text-xs font-semibold rounded-full">Processing</span>;
  if (status === 'approved') return <span className="px-2 py-1 bg-green-100 text-green-700 text-xs font-semibold rounded-full">Approved</span>;
  return <span className="px-2 py-1 bg-red-100 text-red-700 text-xs font-semibold rounded-full">Not Submitted</span>;
}

export default function TutorHomePage() {
  return (
    <div className="p-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Welcome Back Gojo Satoru!</h1>
          <p className="text-gray-500 text-sm mt-1">Here is your teaching overview</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="text-right">
            <p className="text-sm font-semibold text-gray-900">Gojo Satoru</p>
            <p className="text-xs text-gray-500">Tutor</p>
          </div>
          <div className="w-10 h-10 bg-yellow-400 rounded-full flex items-center justify-center">
            <span className="font-bold text-gray-900 text-sm">GS</span>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm text-gray-500">Total Students</p>
            <div className="w-9 h-9 bg-blue-100 rounded-lg flex items-center justify-center">
              <Users size={18} className="text-blue-600" />
            </div>
          </div>
          <p className="text-3xl font-bold text-gray-900">20</p>
          <p className="text-xs text-gray-400 mt-1">across 2 classes</p>
        </div>

        <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm text-gray-500">Materials</p>
            <div className="w-9 h-9 bg-green-100 rounded-lg flex items-center justify-center">
              <BookOpen size={18} className="text-green-600" />
            </div>
          </div>
          <p className="text-3xl font-bold text-gray-900">7</p>
          <p className="text-xs text-gray-400 mt-1">available resources</p>
        </div>

        <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm text-gray-500">Pending Grading</p>
            <div className="w-9 h-9 bg-yellow-100 rounded-lg flex items-center justify-center">
              <Clock size={18} className="text-yellow-600" />
            </div>
          </div>
          <p className="text-3xl font-bold text-gray-900">2</p>
          <p className="text-xs text-gray-400 mt-1">worksheets to review</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Students Needing Attention */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center gap-2 mb-4">
            <AlertCircle size={18} className="text-orange-500" />
            <h2 className="font-bold text-gray-900">Students Needing Attention</h2>
          </div>
          <div className="flex items-center justify-between bg-orange-50 rounded-lg p-4">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 bg-orange-200 rounded-full flex items-center justify-center">
                <span className="font-bold text-orange-800 text-sm">RL</span>
              </div>
              <div>
                <p className="font-semibold text-gray-900">Ryan Lee</p>
                <p className="text-xs text-gray-500">P5-Math-A • Confidence: 62%</p>
              </div>
            </div>
            <Link
              href="/tutor/analytics/p5-math-a"
              className="text-xs font-semibold text-yellow-700 bg-yellow-100 hover:bg-yellow-200 px-3 py-1.5 rounded-lg transition-colors"
            >
              View Details
            </Link>
          </div>
        </div>

        {/* Recent Submissions */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <CheckCircle2 size={18} className="text-green-500" />
              <h2 className="font-bold text-gray-900">Recent Submissions</h2>
            </div>
            <Link href="/tutor/auto-grader" className="text-xs text-yellow-600 font-semibold hover:underline">
              View All
            </Link>
          </div>
          <div className="space-y-3">
            {recentSubmissions.map((sub, idx) => (
              <div key={idx} className="flex items-center justify-between py-2 border-b border-gray-50 last:border-0">
                <div>
                  <p className="text-sm font-semibold text-gray-900">{sub.studentName}</p>
                  <p className="text-xs text-gray-500">{sub.worksheet} • {sub.class}</p>
                </div>
                <StatusBadge status={sub.status} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
