'use client';

import { use } from 'react';
import Link from 'next/link';
import { ChevronLeft, TrendingUp, TrendingDown, AlertCircle, CheckCircle } from 'lucide-react';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis,
} from 'recharts';
import { analyticsData, subjects } from '@/lib/mockData';

export default function SubjectAnalyticsPage({ params }: { params: Promise<{ subjectId: string }> }) {
  const { subjectId } = use(params);
  const data = analyticsData[subjectId as keyof typeof analyticsData];
  const subject = subjects.find((s) => s.id === subjectId);

  if (!data) return <div className="p-8 text-gray-600">Analytics not found.</div>;

  const radarData = data.topicBreakdown.map((t) => ({
    topic: t.topic,
    score: Math.round((t.score / t.max) * 100),
    fullMark: 100,
  }));

  return (
    <div className="p-8">
      <Link href="/student/analytics" className="flex items-center gap-1 text-gray-500 hover:text-gray-900 text-sm mb-6">
        <ChevronLeft size={16} />
        Back to Analytics
      </Link>

      {/* Header */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 mb-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-yellow-100 rounded-xl flex items-center justify-center text-2xl">
              {subject?.icon}
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">{data.subjectName}</h1>
              <p className="text-gray-500 text-sm">{data.class}</p>
            </div>
          </div>
          <span className="px-4 py-2 bg-yellow-400 text-gray-900 font-bold rounded-full">
            Overall Confidence: {data.overallConfidence}%
          </span>
        </div>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
          <p className="text-xs text-gray-500">Worksheets Completed</p>
          <p className="text-2xl font-bold text-gray-900 mt-1">5</p>
          <p className="text-xs text-green-600 mt-0.5">this month</p>
        </div>
        <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
          <p className="text-xs text-gray-500">Avg Time / Question</p>
          <p className="text-2xl font-bold text-gray-900 mt-1">5.2 min</p>
          <p className="text-xs text-green-600 flex items-center gap-0.5 mt-0.5">
            <TrendingDown size={10} />
            -0.5 min from last week
          </p>
        </div>
        <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
          <p className="text-xs text-gray-500">Strongest Topic</p>
          <p className="text-lg font-bold text-gray-900 mt-1">{data.strongestTopic.score}%</p>
          <p className="text-xs text-gray-500 mt-0.5">{data.strongestTopic.name}</p>
        </div>
        <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
          <p className="text-xs text-gray-500">Needs Focus</p>
          <p className="text-lg font-bold text-gray-900 mt-1">{data.needsFocus.score}%</p>
          <p className="text-xs text-gray-500 mt-0.5">{data.needsFocus.name}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Line Chart */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <h2 className="font-bold text-gray-900 mb-4">Overall Confidence Trend</h2>
          <ResponsiveContainer width="100%" height={220}>
            <LineChart data={data.weeklyTrend}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="week" tick={{ fontSize: 12, fill: '#6b7280' }} />
              <YAxis domain={[0, 100]} tick={{ fontSize: 12, fill: '#6b7280' }} />
              <Tooltip
                contentStyle={{ borderRadius: '8px', border: '1px solid #e5e7eb', fontSize: '12px' }}
              />
              <Line
                type="monotone"
                dataKey="confidence"
                stroke="#EAB308"
                strokeWidth={2}
                dot={{ fill: '#EAB308', r: 5 }}
                activeDot={{ r: 7 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Radar Chart */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <h2 className="font-bold text-gray-900 mb-4">Student Performance Across Topics</h2>
          <ResponsiveContainer width="100%" height={220}>
            <RadarChart data={radarData}>
              <PolarGrid />
              <PolarAngleAxis dataKey="topic" tick={{ fontSize: 11, fill: '#6b7280' }} />
              <PolarRadiusAxis angle={90} domain={[0, 100]} tick={{ fontSize: 10 }} />
              <Radar
                name="Score"
                dataKey="score"
                stroke="#EAB308"
                fill="#EAB308"
                fillOpacity={0.3}
              />
              <Tooltip contentStyle={{ borderRadius: '8px', fontSize: '12px' }} />
            </RadarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Topic Confidence Breakdown */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 mb-6">
        <h2 className="font-bold text-gray-900 mb-4">Topic Confidence Breakdown</h2>
        <div className="space-y-4">
          {data.topicBreakdown.map((t) => {
            const pct = Math.round((t.score / t.max) * 100);
            let barColor = 'bg-red-400';
            let badge = 'bg-red-100 text-red-700';
            let label = 'Needs Work';
            if (pct >= 76) { barColor = 'bg-green-500'; badge = 'bg-green-100 text-green-700'; label = 'Excellent'; }
            else if (pct >= 51) { barColor = 'bg-yellow-400'; badge = 'bg-yellow-100 text-yellow-700'; label = 'Good'; }
            else if (pct > 0) { barColor = 'bg-orange-400'; badge = 'bg-orange-100 text-orange-700'; label = 'Fair'; }
            return (
              <div key={t.topic}>
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-sm font-semibold text-gray-700">{t.topic}</span>
                  <div className="flex items-center gap-2">
                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${badge}`}>{label}</span>
                    <span className="text-sm font-bold text-gray-900">{pct}%</span>
                  </div>
                </div>
                <div className="w-full bg-gray-100 rounded-full h-3">
                  <div className={`${barColor} h-3 rounded-full transition-all`} style={{ width: `${pct}%` }} />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Common Mistakes */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center gap-2 mb-4">
            <AlertCircle size={18} className="text-orange-500" />
            <h2 className="font-bold text-gray-900">Common Mistakes</h2>
          </div>
          <ul className="space-y-2">
            {data.commonMistakes.map((mistake, i) => (
              <li key={i} className="flex items-start gap-2 text-sm text-gray-600">
                <span className="text-orange-400 mt-0.5">•</span>
                {mistake}
              </li>
            ))}
          </ul>
        </div>

        {/* AI Recommendations */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center gap-2 mb-4">
            <CheckCircle size={18} className="text-green-500" />
            <h2 className="font-bold text-gray-900">AI Recommendations</h2>
          </div>
          <ul className="space-y-2">
            {data.aiRecommendations.map((rec, i) => (
              <li key={i} className="flex items-start gap-2 text-sm text-gray-600">
                <CheckCircle size={14} className="text-green-500 flex-shrink-0 mt-0.5" />
                {rec}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
