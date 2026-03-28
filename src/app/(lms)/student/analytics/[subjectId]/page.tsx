'use client';

import { use } from 'react';
import Link from 'next/link';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Legend,
} from 'recharts';
import { ChevronLeft, CheckCircle, AlertCircle } from 'lucide-react';
import SubjectIcon from '@/components/ui/SubjectIcon';
import ProgressBar from '@/components/ui/ProgressBar';
import ClassBadge from '@/components/ui/ClassBadge';
import ConfidenceBadge from '@/components/ui/ConfidenceBadge';

type SubjectKey = 'mathematics' | 'science' | 'english';

interface SubjectData {
  subject: SubjectKey;
  name: string;
  classCode: string;
  overallConfidence: number;
  trendNote: string;
  stats: { label: string; value: string; sub: string; subColor?: string }[];
  trend: { week: string; score: number }[];
  radar: { topic: string; score: number }[];
  topics: { name: string; pct: number; badge: string; color: string }[];
  mistakes: string[];
  recommendations: { type: 'good' | 'warn'; text: string }[];
}

const allData: Record<SubjectKey, SubjectData> = {
  mathematics: {
    subject: 'mathematics',
    name: 'Mathematics',
    classCode: 'P5-Math-C',
    overallConfidence: 35,
    trendNote: '+8% improvement over 4 weeks',
    stats: [
      { label: 'Worksheets Completed', value: '1',       sub: 'This month' },
      { label: 'Avg Time/Question',    value: '7.4 min', sub: '↑ 1.2min from last week', subColor: 'text-orange-500' },
      { label: 'Strongest Topic',      value: '41%',     sub: 'Algebra' },
      { label: 'Needs Focus',          value: '18%',     sub: 'Geometry' },
    ],
    trend: [
      { week: 'Week 1', score: 20 },
      { week: 'Week 2', score: 25 },
      { week: 'Week 3', score: 30 },
      { week: 'Week 4', score: 35 },
    ],
    radar: [
      { topic: 'Algebra',        score: 41 },
      { topic: 'Geometry',       score: 18 },
      { topic: 'Fractions',      score: 35 },
      { topic: 'Word Problems',  score: 40 },
      { topic: 'Decimals',       score: 30 },
    ],
    topics: [
      { name: 'Algebra',       pct: 41, badge: 'Needs Work',  color: 'bg-orange-100 text-orange-700' },
      { name: 'Geometry',      pct: 18, badge: 'At Risk',     color: 'bg-red-100 text-red-700' },
      { name: 'Fractions',     pct: 35, badge: 'Needs Work',  color: 'bg-orange-100 text-orange-700' },
      { name: 'Word Problems', pct: 40, badge: 'Needs Work',  color: 'bg-orange-100 text-orange-700' },
      { name: 'Decimals',      pct: 30, badge: 'At Risk',     color: 'bg-red-100 text-red-700' },
    ],
    mistakes: [
      'Confusing order of operations (BODMAS) in multi-step problems',
      'Errors in converting between fractions and decimals',
      'Incorrectly setting up equations for word problems',
    ],
    recommendations: [
      { type: 'warn', text: 'Geometry (18%) needs urgent attention — focus on properties of shapes and angles before the next worksheet.' },
      { type: 'warn', text: 'Decimals (30%) requires more practice. Try the supplementary decimal exercises in your materials.' },
      { type: 'good', text: 'Algebra (41%) is your strongest topic — keep it up and aim to push past 60% this week.' },
    ],
  },

  science: {
    subject: 'science',
    name: 'Science',
    classCode: 'P5-Science-B',
    overallConfidence: 93,
    trendNote: '+10% improvement over 4 weeks',
    stats: [
      { label: 'Worksheets Completed', value: '5',       sub: 'This month' },
      { label: 'Avg Time/Question',    value: '5.2 min', sub: '↓ 0.5min from last week', subColor: 'text-green-500' },
      { label: 'Strongest Topic',      value: '95%',     sub: 'Cell Biology' },
      { label: 'Needs Focus',          value: '91%',     sub: 'Forces and Motion' },
    ],
    trend: [
      { week: 'Week 1', score: 75 },
      { week: 'Week 2', score: 78 },
      { week: 'Week 3', score: 80 },
      { week: 'Week 4', score: 83 },
    ],
    radar: [
      { topic: 'Cell Biology',              score: 95 },
      { topic: 'Forces and Motion',         score: 91 },
      { topic: 'Human System',              score: 94 },
      { topic: 'Forms and Uses of Energy',  score: 92 },
      { topic: 'Water and Changes of States', score: 93 },
    ],
    topics: [
      { name: 'Cell Biology',               pct: 95, badge: 'Excellent', color: 'bg-green-100 text-green-700' },
      { name: 'Forces and Motion',          pct: 91, badge: 'Excellent', color: 'bg-green-100 text-green-700' },
      { name: 'Human System',               pct: 94, badge: 'Excellent', color: 'bg-green-100 text-green-700' },
      { name: 'Forms and Uses of Energy',   pct: 92, badge: 'Excellent', color: 'bg-green-100 text-green-700' },
      { name: 'Water and Changes of States', pct: 93, badge: 'Excellent', color: 'bg-green-100 text-green-700' },
    ],
    mistakes: [
      'Incorrectly labeling force diagrams',
      'Confusing mitosis and meiosis processes',
    ],
    recommendations: [
      { type: 'good', text: 'Outstanding performance across all topics! Cell Biology (95%) and Human System (94%) show excellent mastery.' },
      { type: 'good', text: 'Forces and Motion (91%) demonstrates strong understanding of physics concepts.' },
      { type: 'warn', text: 'Maintain momentum by exploring advanced topics and PSLE challenge questions.' },
    ],
  },

  english: {
    subject: 'english',
    name: 'English',
    classCode: 'P5-English-A',
    overallConfidence: 52,
    trendNote: '+12% improvement over 4 weeks',
    stats: [
      { label: 'Worksheets Completed', value: '2',       sub: 'This month' },
      { label: 'Avg Time/Question',    value: '6.1 min', sub: '↓ 0.8min from last week', subColor: 'text-green-500' },
      { label: 'Strongest Topic',      value: '68%',     sub: 'Grammar Essentials' },
      { label: 'Needs Focus',          value: '34%',     sub: 'Composition' },
    ],
    trend: [
      { week: 'Week 1', score: 38 },
      { week: 'Week 2', score: 44 },
      { week: 'Week 3', score: 49 },
      { week: 'Week 4', score: 52 },
    ],
    radar: [
      { topic: 'Grammar',            score: 68 },
      { topic: 'Vocabulary',         score: 55 },
      { topic: 'Comprehension',      score: 58 },
      { topic: 'Composition',        score: 34 },
      { topic: 'Oral Communication', score: 47 },
    ],
    topics: [
      { name: 'Grammar Essentials', pct: 68, badge: 'Good',       color: 'bg-green-100 text-green-700' },
      { name: 'Vocabulary',         pct: 55, badge: 'Average',    color: 'bg-yellow-100 text-yellow-700' },
      { name: 'Comprehension',      pct: 58, badge: 'Average',    color: 'bg-yellow-100 text-yellow-700' },
      { name: 'Composition',        pct: 34, badge: 'Needs Work', color: 'bg-orange-100 text-orange-700' },
      { name: 'Oral Communication', pct: 47, badge: 'Needs Work', color: 'bg-orange-100 text-orange-700' },
    ],
    mistakes: [
      'Run-on sentences and missing punctuation in compositions',
      'Confusing similar vocabulary words (e.g. "affect" vs "effect")',
      'Weak paragraph structure — missing topic sentences',
    ],
    recommendations: [
      { type: 'good', text: 'Grammar Essentials (68%) is your strongest area — keep practising tenses and sentence structure.' },
      { type: 'warn', text: 'Composition (34%) needs the most attention. Focus on paragraph planning before writing.' },
      { type: 'warn', text: 'Build vocabulary daily using the Vocabulary Builder materials — aim for 10 new words per week.' },
    ],
  },
};

export default function SubjectAnalyticsPage({ params }: { params: Promise<{ subjectId: string }> }) {
  const { subjectId } = use(params);
  const d = allData[subjectId as SubjectKey] ?? allData.science;

  return (
    <>
      {/* Back nav */}
      <Link href="/student/analytics" className="inline-flex items-center gap-1 text-sm text-zinc-400 hover:text-zinc-800 mb-6 transition-apple font-medium">
        <ChevronLeft size={15} />
        Back to Analytics
      </Link>

      {/* Header row */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <SubjectIcon subject={d.subject} />
          <div>
            <h1 className="font-display text-xl font-bold text-zinc-900" style={{ letterSpacing: '-0.02em' }}>{d.name}</h1>
            <div className="flex items-center gap-2 mt-1">
              <span className="text-sm text-zinc-400">Primary 5</span>
              <ClassBadge subject={d.subject} label={d.classCode} size="md" />
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-sm text-zinc-400 font-medium">Overall Confidence</span>
          <ConfidenceBadge score={d.overallConfidence} />
        </div>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        {d.stats.map((s) => (
          <div key={s.label} className="bg-white rounded-2xl border border-zinc-100 p-4 shadow-sm">
            <p className="text-xs text-zinc-400 font-medium mb-1">{s.label}</p>
            <p className="text-xl font-bold text-zinc-900">{s.value}</p>
            <p className={`text-xs mt-0.5 font-medium ${s.subColor ?? 'text-zinc-400'}`}>{s.sub}</p>
          </div>
        ))}
      </div>

      {/* Charts row */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">

        {/* Line chart */}
        <div className="bg-white rounded-2xl border border-zinc-100 p-6 shadow-sm">
          <h2 className="text-sm font-bold text-zinc-900 mb-4">Overall Confidence Trend</h2>
          <ResponsiveContainer width="100%" height={220}>
            <LineChart data={d.trend} margin={{ top: 5, right: 10, left: -20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f4f4f5" />
              <XAxis dataKey="week" tick={{ fontSize: 11, fill: '#A1A1AA' }} axisLine={false} tickLine={false} />
              <YAxis domain={[0, 100]} tick={{ fontSize: 11, fill: '#A1A1AA' }} axisLine={false} tickLine={false} />
              <Tooltip
                contentStyle={{ borderRadius: 12, border: '1px solid #e4e4e7', fontSize: 12 }}
                formatter={(v) => [`${v}%`, 'Confidence']}
              />
              <Line
                type="monotone"
                dataKey="score"
                stroke="#FFC107"
                strokeWidth={2.5}
                dot={{ fill: '#FFC107', r: 5, strokeWidth: 0 }}
                activeDot={{ r: 6 }}
              />
            </LineChart>
          </ResponsiveContainer>
          <p className="text-xs text-green-500 font-semibold mt-2 text-center">{d.trendNote}</p>
        </div>

        {/* Radar chart */}
        <div className="bg-white rounded-2xl border border-zinc-100 p-6 shadow-sm">
          <h2 className="text-sm font-bold text-zinc-900 mb-4">Performance Across Topics</h2>
          <ResponsiveContainer width="100%" height={220}>
            <RadarChart data={d.radar} margin={{ top: 10, right: 20, bottom: 10, left: 20 }}>
              <PolarGrid stroke="#e4e4e7" />
              <PolarAngleAxis dataKey="topic" tick={{ fontSize: 10, fill: '#71717A' }} />
              <PolarRadiusAxis domain={[0, 100]} tick={false} axisLine={false} />
              <Radar
                name="Student Performance (%)"
                dataKey="score"
                stroke="#FFC107"
                fill="#FFC107"
                fillOpacity={0.55}
              />
              <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize: 11, color: '#71717A' }} />
            </RadarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Topic Confidence Breakdown */}
      <div className="bg-white rounded-2xl border border-zinc-100 p-6 shadow-sm mb-6">
        <h2 className="text-sm font-bold text-zinc-900 mb-5">Topic Confidence Breakdown</h2>
        <div className="flex flex-col gap-4">
          {d.topics.map((t) => (
            <div key={t.name} className="flex items-center gap-4">
              <div className="w-52 flex-shrink-0 flex items-center gap-2">
                <span className="text-sm text-zinc-700">{t.name}</span>
                <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${t.color}`}>
                  {t.badge}
                </span>
              </div>
              <div className="flex-1">
                <ProgressBar value={t.pct} />
              </div>
              <span className="text-sm font-bold text-zinc-900 w-10 text-right">{t.pct}%</span>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom row */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

        {/* Common Mistakes */}
        <div className="bg-white rounded-2xl border border-zinc-100 p-6 shadow-sm">
          <div className="flex items-center gap-2 mb-4">
            <AlertCircle size={16} className="text-orange-500" />
            <h2 className="text-sm font-bold text-zinc-900">Common Mistakes</h2>
          </div>
          <ul className="flex flex-col gap-2.5">
            {d.mistakes.map((m) => (
              <li key={m} className="flex items-start gap-2.5 text-sm text-zinc-600">
                <span className="w-2 h-2 rounded-full bg-orange-400 mt-1.5 flex-shrink-0" />
                {m}
              </li>
            ))}
          </ul>
        </div>

        {/* AI Recommendations */}
        <div className="bg-amber-50 rounded-2xl border border-amber-100 p-6 shadow-sm">
          <div className="flex items-center gap-2 mb-4">
            <AlertCircle size={16} className="text-amber-500" />
            <h2 className="text-sm font-bold text-zinc-900">AI Recommendations</h2>
          </div>
          <ul className="flex flex-col gap-3">
            {d.recommendations.map((r, i) => (
              <li key={i} className="flex items-start gap-2.5 text-sm">
                {r.type === 'good'
                  ? <CheckCircle size={15} className="text-green-500 mt-0.5 flex-shrink-0" />
                  : <span className="w-3.5 h-3.5 rounded-full bg-orange-400 mt-0.5 flex-shrink-0" />
                }
                <span className="text-zinc-700">{r.text}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </>
  );
}
