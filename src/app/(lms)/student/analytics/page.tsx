'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import SubjectIcon from '@/components/ui/SubjectIcon';
import ConfidenceBadge from '@/components/ui/ConfidenceBadge';
import PrimaryButton from '@/components/ui/PrimaryButton';
import ClassBadge from '@/components/ui/ClassBadge';
import { getResults, findStudent } from '@/lib/api';
import type { StudentResult } from '@/types/database';

const STUDENT_NAME = 'Ke_Xin';

function topicExtremes(student: StudentResult) {
  const entries = Object.entries(student.topic_scores).filter(
    ([, v]) => v !== null
  ) as [string, number][];
  if (entries.length === 0) return { strongest: null, weakest: null };
  entries.sort((a, b) => b[1] - a[1]);
  return { strongest: entries[0][0], weakest: entries[entries.length - 1][0] };
}

export default function AnalyticsPage() {
  const [student, setStudent] = useState<StudentResult | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getResults()
      .then((feed) => setStudent(findStudent(feed, STUDENT_NAME)))
      .catch(() => null)
      .finally(() => setLoading(false));
  }, []);

  const { strongest, weakest } = student ? topicExtremes(student) : { strongest: null, weakest: null };

  return (
    <>
      {/* Header */}
      <div className="mb-8">
        <h1
          className="font-display text-2xl font-bold text-zinc-900 tracking-tight"
          style={{ letterSpacing: '-0.02em' }}
        >
          My Performance Analysis
        </h1>
        <p className="text-zinc-400 text-sm mt-1 font-medium">Track your progress across all subjects.</p>
      </div>

      {loading ? (
        <p className="text-sm text-zinc-400">Loading your analytics…</p>
      ) : !student ? (
        <p className="text-sm text-zinc-400">
          No grading data found for {STUDENT_NAME.replace(/_/g, ' ')} yet.
        </p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-2xl border border-zinc-100 p-6 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all flex flex-col gap-4">
            {/* Top: icon + name + class pill */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <SubjectIcon subject="mathematics" />
                <span className="font-semibold text-zinc-900 text-sm">Mathematics</span>
              </div>
              <ClassBadge subject="mathematics" label={student.class_id} />
            </div>

            {/* Overall confidence */}
            <div className="flex items-center justify-between">
              <span className="text-xs text-zinc-400 font-medium">Overall Confidence</span>
              <ConfidenceBadge score={student.overall_percentage} />
            </div>

            {/* Strongest / Needs Focus */}
            <div className="flex flex-col gap-1.5">
              <div className="flex items-center gap-2">
                <span className="text-xs text-zinc-400">Strongest:</span>
                <span className="text-xs font-semibold text-green-600">{strongest ?? '—'}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs text-zinc-400">Needs Focus:</span>
                <span className="text-xs font-semibold text-red-500">{weakest ?? '—'}</span>
              </div>
            </div>

            {/* CTA */}
            <Link
              href={`/student/analytics/${encodeURIComponent(student.class_id)}`}
              className="mt-auto"
            >
              <PrimaryButton fullWidth className="text-sm py-2.5">
                View Detailed Analytics →
              </PrimaryButton>
            </Link>
          </div>
        </div>
      )}
    </>
  );
}
