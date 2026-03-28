'use client';

import { use } from 'react';
import Link from 'next/link';
import { ChevronLeft, TrendingDown, AlertCircle, CheckCircle } from 'lucide-react';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis,
} from 'recharts';
import { classStudents, classes } from '@/lib/mockData';

const weeklyTrend = [
  { week: 'Week 1', confidence: 55 },
  { week: 'Week 2', confidence: 58 },
  { week: 'Week 3', confidence: 60 },
  { week: 'Week 4', confidence: 62 },
];

const commonMistakes = [
  'Struggles with multi-step word problems',
  'Inconsistent performance in fraction operations',
  'Needs more practice with decimal placement',
];

const recommendations = [
  'Schedule additional 1-on-1 session for word problems',
  'Assign targeted practice worksheets for fractions',
  'Review decimal concepts with visual aids',
];

export default function StudentAnalyticsPage({
  params,
}: {
  params: Promise<{ classId: string; studentId: string }>;
}) {
  const { classId, studentId } = use(params);
  const students = classStudents[classId as keyof typeof classStudents] || [];
  const student = students.find((s) => s.id === studentId);
  const cls = classes.find((c) => c.id === classId);

  if (!student || !cls) return <div className="p-8 text-gray-600">Student not found.</div>;

  const radarData = [
    { topic: 'Algebra', score: student.algebra, fullMark: 100 },
    { topic: 'Geometry', score: student.geometry, fullMark: 100 },
    { topic: 'Fractions', score: student.fractions, fullMark: 100 },
    { topic: 'Decimals', score: student.decimals, fullMark: 100 },
    { topic: 'Word Problems', score: student.wordProblems, fullMark: 100 },
  ];

  const topicBreakdown = [
    { topic: 'Algebra', score: student.algebra },
    { topic: 'Geometry', score: student.geometry },
    { topic: 'Fractions', score: student.fractions },
    { topic: 'Decimals', score: student.decimals },
    { topic: 'Word Problems', score: student.wordProblems },
  ];

  return (
    <div className="p-8">
      <Link href={`/tutor/analytics/${classId}`} className="flex items-center gap-1 text-gray-500 hover:text-gray-900 text-sm mb-6">
        <ChevronLeft size={16} />
        Back to {cls.name}
      </Link>

      {/* Header */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 mb-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 bg-yellow-100 rounded-full flex items-center justify-center">
              <span className="font-bold text-yellow-700 text-lg">{student.initials}</span>
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">{student.name}</h1>
              <p className="text-gray-500 text-sm">{cls.name} • {cls.subject}</p>
              <p className="text-xs text-gray-400 mt-0.5">Tutor View</p>
            </div>
          </div>
          <span className={`px-4 py-2 font-bold text-sm rounded-full ${
            student.overallConfidence >= 76
              ? 'bg-green-100 text-green-700'
              : student.overallConfidence >= 51
              ? 'bg-yellow-100 text-yellow-700'
              : 'bg-red-100 text-red-700'
          }`}>
            Overall: {student.overallConfidence}%
          </span>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
          <p className="text-xs text-gray-500">Worksheets Done</p>
          <p className="text-2xl font-bold text-gray-900 mt-1">{student.worksheetsCompleted}</p>
        </div>
        <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
          <p className="text-xs text-gray-500">Avg Time / Question</p>
          <p className="text-2xl font-bold text-gray-900 mt-1">{student.avgTime} min</p>
        </div>
        <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
          <p className="text-xs text-gray-500">Strongest Topic</p>
          <p className="text-lg font-bold text-gray-900 mt-1">{student.geometry}%</p>
          <p className="text-xs text-gray-500">Geometry</p>
        </div>
        <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
          <p className="text-xs text-gray-500">Needs Focus</p>
          <p className="text-lg font-bold text-gray-900 mt-1">{student.wordProblems}%</p>
          <p className="text-xs text-gray-500">Word Problems</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Line Chart */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <h2 className="font-bold text-gray-900 mb-4">Confidence Trend</h2>
          <ResponsiveContainer width="100%" height={220}>
            <LineChart data={weeklyTrend}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="week" tick={{ fontSize: 12, fill: '#6b7280' }} />
              <YAxis domain={[0, 100]} tick={{ fontSize: 12, fill: '#6b7280' }} />
              <Tooltip contentStyle={{ borderRadius: '8px', border: '1px solid #e5e7eb', fontSize: '12px' }} />
              <Line type="monotone" dataKey="confidence" stroke="#EAB308" strokeWidth={2} dot={{ fill: '#EAB308', r: 5 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Radar Chart */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <h2 className="font-bold text-gray-900 mb-4">Topic Performance Radar</h2>
          <ResponsiveContainer width="100%" height={220}>
            <RadarChart data={radarData}>
              <PolarGrid />
              <PolarAngleAxis dataKey="topic" tick={{ fontSize: 11, fill: '#6b7280' }} />
              <PolarRadiusAxis angle={90} domain={[0, 100]} tick={{ fontSize: 10 }} />
              <Radar name="Score" dataKey="score" stroke="#EAB308" fill="#EAB308" fillOpacity={0.3} />
              <Tooltip contentStyle={{ borderRadius: '8px', fontSize: '12px' }} />
            </RadarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Topic Breakdown */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 mb-6">
        <h2 className="font-bold text-gray-900 mb-4">Topic Confidence Breakdown</h2>
        <div className="space-y-4">
          {topicBreakdown.map((t) => {
            let barColor = 'bg-red-400';
            let badge = 'bg-red-100 text-red-700';
            let label = 'Needs Work';
            if (t.score >= 76) { barColor = 'bg-green-500'; badge = 'bg-green-100 text-green-700'; label = 'Excellent'; }
            else if (t.score >= 51) { barColor = 'bg-yellow-400'; badge = 'bg-yellow-100 text-yellow-700'; label = 'Good'; }
            return (
              <div key={t.topic}>
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-sm font-semibold text-gray-700">{t.topic}</span>
                  <div className="flex items-center gap-2">
                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${badge}`}>{label}</span>
                    <span className="text-sm font-bold text-gray-900">{t.score}%</span>
                  </div>
                </div>
                <div className="w-full bg-gray-100 rounded-full h-3">
                  <div className={`${barColor} h-3 rounded-full`} style={{ width: `${t.score}%` }} />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center gap-2 mb-4">
            <AlertCircle size={18} className="text-orange-500" />
            <h2 className="font-bold text-gray-900">Common Mistakes</h2>
          </div>
          <ul className="space-y-2">
            {commonMistakes.map((m, i) => (
              <li key={i} className="flex items-start gap-2 text-sm text-gray-600">
                <span className="text-orange-400 mt-0.5">•</span>{m}
              </li>
            ))}
          </ul>
        </div>
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center gap-2 mb-4">
            <CheckCircle size={18} className="text-green-500" />
            <h2 className="font-bold text-gray-900">Tutor Recommendations</h2>
          </div>
          <ul className="space-y-2">
            {recommendations.map((r, i) => (
              <li key={i} className="flex items-start gap-2 text-sm text-gray-600">
                <CheckCircle size={14} className="text-green-500 flex-shrink-0 mt-0.5" />{r}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
