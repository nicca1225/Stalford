'use client';

import { use, useEffect, useState } from 'react';
import Link from 'next/link';
import {
  RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis,
  ResponsiveContainer, Legend,
} from 'recharts';
import { ChevronLeft, CheckCircle, AlertCircle } from 'lucide-react';
import SubjectIcon from '@/components/ui/SubjectIcon';
import ProgressBar from '@/components/ui/ProgressBar';
import ClassBadge from '@/components/ui/ClassBadge';
import ConfidenceBadge from '@/components/ui/ConfidenceBadge';
import { getResults, findStudent } from '@/lib/api';
import type { StudentResult } from '@/types/database';

const STUDENT_NAME = 'Ke_Xin';

export default function SubjectAnalyticsPage({
  params,
}: {
  params: Promise<{ subjectId: string }>;
}) {
  const { subjectId } = use(params);
  const [student, setStudent] = useState<StudentResult | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getResults()
      .then((feed) => setStudent(findStudent(feed, STUDENT_NAME)))
      .catch(() => null)
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return <p className="p-8 text-sm text-zinc-400">Loading…</p>;
  }

  if (!student) {
    return (
      <>
        <Link
          href="/student/analytics"
          className="inline-flex items-center gap-1 text-sm text-zinc-400 hover:text-zinc-800 mb-6 font-medium"
        >
          <ChevronLeft size={15} /> Back to Analytics
        </Link>
        <p className="text-sm text-red-500">
          No grading data found for {STUDENT_NAME.replace(/_/g, ' ')}.
        </p>
      </>
    );
  }

  // Radar + topic bars data
  const radarData = Object.entries(student.topic_scores).map(([topic, score]) => ({
    topic,
    score: score ?? 0,
  }));

  const topicEntries = Object.entries(student.topic_scores) as [string, number | null][];

  // Common mistakes: incorrect questions' exam tips (up to 3)
  const mistakes = (student as StudentResult).detailed_grading
    .filter((q) => !q.is_fully_correct && q.error_type)
    .map((q) => q.student_exam_tip)
    .slice(0, 3);

  // AI recommendations: correct questions' exam tips (up to 3)
  const recommendations = (student as StudentResult).detailed_grading
    .filter((q) => q.is_fully_correct)
    .map((q) => q.student_exam_tip)
    .slice(0, 3);

  return (
    <>
      {/* Back nav */}
      <Link
        href="/student/analytics"
        className="inline-flex items-center gap-1 text-sm text-zinc-400 hover:text-zinc-800 mb-6 font-medium"
      >
        <ChevronLeft size={15} /> Back to Analytics
      </Link>

      {/* Header row */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <SubjectIcon subject="mathematics" />
          <div>
            <h1
              className="font-display text-xl font-bold text-zinc-900"
              style={{ letterSpacing: '-0.02em' }}
            >
              {decodeURIComponent(subjectId)}
            </h1>
            <div className="flex items-center gap-2 mt-1">
              <ClassBadge subject="mathematics" label={student.class_id} size="md" />
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-sm text-zinc-400 font-medium">Overall Confidence</span>
          <ConfidenceBadge score={student.overall_percentage} />
        </div>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white rounded-2xl border border-zinc-100 p-4 shadow-sm">
          <p className="text-xs text-zinc-400 font-medium mb-1">Total Questions</p>
          <p className="text-xl font-bold text-zinc-900">{student.detailed_grading.length}</p>
        </div>
        <div className="bg-white rounded-2xl border border-zinc-100 p-4 shadow-sm">
          <p className="text-xs text-zinc-400 font-medium mb-1">Marks Scored</p>
          <p className="text-xl font-bold text-zinc-900">
            {student.student_total_marks}/{student.paper_total_marks}
          </p>
        </div>
        <div className="bg-white rounded-2xl border border-zinc-100 p-4 shadow-sm">
          <p className="text-xs text-zinc-400 font-medium mb-1">Correct</p>
          <p className="text-xl font-bold text-green-600">
            {student.detailed_grading.filter((q) => q.is_fully_correct).length}
          </p>
        </div>
        <div className="bg-white rounded-2xl border border-zinc-100 p-4 shadow-sm">
          <p className="text-xs text-zinc-400 font-medium mb-1">Incorrect</p>
          <p className="text-xl font-bold text-red-500">
            {student.detailed_grading.filter((q) => !q.is_fully_correct).length}
          </p>
        </div>
      </div>

      {/* Radar chart */}
      {radarData.length > 0 && (
        <div className="bg-white rounded-2xl border border-zinc-100 p-6 shadow-sm mb-6">
          <h2 className="text-sm font-bold text-zinc-900 mb-4">Performance Across Topics</h2>
          <ResponsiveContainer width="100%" height={260}>
            <RadarChart data={radarData} margin={{ top: 10, right: 20, bottom: 10, left: 20 }}>
              <PolarGrid stroke="#e4e4e7" />
              <PolarAngleAxis dataKey="topic" tick={{ fontSize: 10, fill: '#71717A' }} />
              <PolarRadiusAxis domain={[0, 100]} tick={false} axisLine={false} />
              <Radar
                name="Score (%)"
                dataKey="score"
                stroke="#FFC107"
                fill="#FFC107"
                fillOpacity={0.6}
              />
              <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize: 11, color: '#71717A' }} />
            </RadarChart>
          </ResponsiveContainer>
        </div>
      )}

      {/* Topic Confidence Breakdown */}
      <div className="bg-white rounded-2xl border border-zinc-100 p-6 shadow-sm mb-6">
        <h2 className="text-sm font-bold text-zinc-900 mb-5">Topic Confidence Breakdown</h2>
        <div className="flex flex-col gap-4">
          {topicEntries.map(([topic, score]) => (
            <div key={topic} className="flex items-center gap-4">
              <div className="w-48 flex-shrink-0">
                <span className="text-sm text-zinc-700">{topic}</span>
              </div>
              <div className="flex-1">
                <ProgressBar value={score ?? 0} />
              </div>
              <span className="text-sm font-bold text-zinc-900 w-10 text-right">
                {score !== null ? `${score}%` : '—'}
              </span>
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
          {mistakes.length === 0 ? (
            <p className="text-sm text-zinc-400">No mistakes recorded.</p>
          ) : (
            <ul className="flex flex-col gap-2.5">
              {mistakes.map((m, i) => (
                <li key={i} className="flex items-start gap-2.5 text-sm text-zinc-600">
                  <span className="w-2 h-2 rounded-full bg-orange-400 mt-1.5 flex-shrink-0" />
                  {m}
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* AI Recommendations */}
        <div className="bg-amber-50 rounded-2xl border border-amber-100 p-6 shadow-sm">
          <div className="flex items-center gap-2 mb-4">
            <CheckCircle size={16} className="text-amber-500" />
            <h2 className="text-sm font-bold text-zinc-900">AI Recommendations</h2>
          </div>
          {recommendations.length === 0 ? (
            <p className="text-sm text-zinc-400">No recommendations yet.</p>
          ) : (
            <ul className="flex flex-col gap-3">
              {recommendations.map((r, i) => (
                <li key={i} className="flex items-start gap-2.5 text-sm">
                  <CheckCircle size={15} className="text-green-500 mt-0.5 flex-shrink-0" />
                  <span className="text-zinc-700">{r}</span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </>
  );
}
