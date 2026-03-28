'use client';

import Link from 'next/link';
import { Users, AlertCircle, BarChart2 } from 'lucide-react';
import { classes } from '@/lib/mockData';

function AvgBadge({ avg }: { avg: number }) {
  if (avg >= 90) return <span className="px-2 py-1 bg-green-100 text-green-700 text-xs font-semibold rounded-full">Excellent</span>;
  if (avg >= 80) return <span className="px-2 py-1 bg-yellow-100 text-yellow-700 text-xs font-semibold rounded-full">Good</span>;
  if (avg >= 70) return <span className="px-2 py-1 bg-orange-100 text-orange-700 text-xs font-semibold rounded-full">Fair</span>;
  return <span className="px-2 py-1 bg-red-100 text-red-700 text-xs font-semibold rounded-full">Poor</span>;
}

export default function TutorAnalyticsPage() {
  return (
    <div className="p-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Student Performance Analytics</h1>
        <p className="text-gray-500 text-sm mt-1">Monitor class performance and identify students needing support</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm text-gray-500">Total Classes</p>
            <div className="w-9 h-9 bg-blue-100 rounded-lg flex items-center justify-center">
              <BarChart2 size={18} className="text-blue-600" />
            </div>
          </div>
          <p className="text-3xl font-bold text-gray-900">2</p>
          <p className="text-xs text-gray-400 mt-1">Active classes</p>
        </div>
        <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm text-gray-500">Total Students</p>
            <div className="w-9 h-9 bg-green-100 rounded-lg flex items-center justify-center">
              <Users size={18} className="text-green-600" />
            </div>
          </div>
          <p className="text-3xl font-bold text-gray-900">20</p>
          <p className="text-xs text-gray-400 mt-1">enrolled students</p>
        </div>
        <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm text-gray-500">Need Attention</p>
            <div className="w-9 h-9 bg-orange-100 rounded-lg flex items-center justify-center">
              <AlertCircle size={18} className="text-orange-600" />
            </div>
          </div>
          <p className="text-3xl font-bold text-gray-900">1</p>
          <p className="text-xs text-gray-400 mt-1">Below 75% confidence</p>
        </div>
      </div>

      {/* Classes */}
      <div>
        <h2 className="text-lg font-bold text-gray-900 mb-4">Your Classes</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {classes.map((cls) => (
            <div key={cls.id} className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-bold text-gray-900">{cls.name}</h3>
                    <span className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full font-medium">{cls.level}</span>
                  </div>
                  <p className="text-sm text-gray-500">{cls.subject}</p>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3 mb-4">
                <div className="text-center bg-gray-50 rounded-lg p-3">
                  <p className="text-xs text-gray-500">Students</p>
                  <p className="font-bold text-gray-900 text-lg">{cls.studentCount}</p>
                </div>
                <div className="text-center bg-gray-50 rounded-lg p-3">
                  <p className="text-xs text-gray-500">Class Avg</p>
                  <div className="flex flex-col items-center gap-1">
                    <p className="font-bold text-gray-900 text-lg">{cls.classAverage}%</p>
                    <AvgBadge avg={cls.classAverage} />
                  </div>
                </div>
                <div className="text-center bg-gray-50 rounded-lg p-3">
                  <p className="text-xs text-gray-500">Need Attention</p>
                  <p className={`font-bold text-lg ${cls.needAttention > 0 ? 'text-orange-600' : 'text-green-600'}`}>
                    {cls.needAttention}
                  </p>
                </div>
              </div>

              <div className="mb-3">
                <div className="flex justify-between text-xs text-gray-500 mb-1">
                  <span>Class Performance</span>
                  <span>{cls.classAverage}%</span>
                </div>
                <div className="w-full bg-gray-100 rounded-full h-2">
                  <div
                    className={`h-2 rounded-full ${cls.classAverage >= 90 ? 'bg-green-500' : cls.classAverage >= 80 ? 'bg-yellow-400' : 'bg-orange-400'}`}
                    style={{ width: `${cls.classAverage}%` }}
                  />
                </div>
              </div>

              <Link
                href={`/tutor/analytics/${cls.id}`}
                className="w-full bg-yellow-400 hover:bg-yellow-500 text-gray-900 font-semibold py-2.5 rounded-lg text-sm transition-colors text-center block"
              >
                View Details
              </Link>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
