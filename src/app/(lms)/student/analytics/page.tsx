'use client';

import Link from 'next/link';
import { BarChart2, TrendingUp, AlertCircle } from 'lucide-react';
import { analyticsData, subjects } from '@/lib/mockData';

function ConfidenceBadge({ score }: { score: number }) {
  if (score >= 76) return <span className="px-3 py-1 bg-green-100 text-green-700 text-sm font-bold rounded-full">{score}%</span>;
  if (score >= 51) return <span className="px-3 py-1 bg-yellow-100 text-yellow-700 text-sm font-bold rounded-full">{score}%</span>;
  if (score > 0) return <span className="px-3 py-1 bg-orange-100 text-orange-700 text-sm font-bold rounded-full">{score}%</span>;
  return <span className="px-3 py-1 bg-red-100 text-red-700 text-sm font-bold rounded-full">{score}%</span>;
}

export default function AnalyticsPage() {
  const analyticsEntries = Object.values(analyticsData);

  return (
    <div className="p-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">My Performance Analysis</h1>
        <p className="text-gray-500 text-sm mt-1">Track your progress across all subjects</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {analyticsEntries.map((data) => {
          const subject = subjects.find((s) => s.id === data.subjectId);
          return (
            <div key={data.subjectId} className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 flex flex-col">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-2xl">{subject?.icon}</span>
                    <h3 className="font-bold text-gray-900">{data.subjectName}</h3>
                  </div>
                  <p className="text-xs text-gray-500">{data.class}</p>
                </div>
                <ConfidenceBadge score={data.overallConfidence} />
              </div>

              <div className="flex-1 space-y-3 mb-4">
                <div className="bg-gray-50 rounded-lg p-3">
                  <p className="text-xs text-gray-500 mb-1">Overall Confidence</p>
                  <div className="flex items-center gap-2">
                    <BarChart2 size={16} className="text-yellow-500" />
                    <span className="font-bold text-gray-900 text-lg">{data.overallConfidence}</span>
                    <span className="text-gray-400 text-sm">/ 100</span>
                  </div>
                  <div className="mt-2 bg-gray-200 rounded-full h-2">
                    <div
                      className={`h-2 rounded-full ${data.overallConfidence >= 76 ? 'bg-green-500' : data.overallConfidence >= 51 ? 'bg-yellow-400' : data.overallConfidence > 0 ? 'bg-orange-400' : 'bg-red-400'}`}
                      style={{ width: `${data.overallConfidence}%` }}
                    />
                  </div>
                </div>

                <div className="flex items-center justify-between bg-green-50 rounded-lg p-3">
                  <div>
                    <p className="text-xs text-gray-500">Strongest Topic</p>
                    <p className="text-sm font-semibold text-gray-900">{data.strongestTopic.name}</p>
                  </div>
                  <div className="flex items-center gap-1">
                    <TrendingUp size={14} className="text-green-500" />
                    <span className="text-sm font-bold text-green-600">{data.strongestTopic.score}%</span>
                  </div>
                </div>

                <div className="flex items-center justify-between bg-red-50 rounded-lg p-3">
                  <div>
                    <p className="text-xs text-gray-500">Needs Focus</p>
                    <p className="text-sm font-semibold text-gray-900">{data.needsFocus.name}</p>
                  </div>
                  <div className="flex items-center gap-1">
                    <AlertCircle size={14} className="text-red-500" />
                    <span className="text-sm font-bold text-red-600">{data.needsFocus.score}%</span>
                  </div>
                </div>
              </div>

              <Link
                href={`/student/analytics/${data.subjectId}`}
                className="w-full bg-yellow-400 hover:bg-yellow-500 text-gray-900 font-semibold py-2.5 rounded-lg text-sm transition-colors text-center block"
              >
                View Detailed Analytics
              </Link>
            </div>
          );
        })}
      </div>
    </div>
  );
}
