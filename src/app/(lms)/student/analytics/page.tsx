'use client';

import Link from 'next/link';
import SubjectIcon from '@/components/ui/SubjectIcon';
import ConfidenceBadge from '@/components/ui/ConfidenceBadge';
import PrimaryButton from '@/components/ui/PrimaryButton';
import ClassBadge from '@/components/ui/ClassBadge';

const subjects = [
  {
    id: 'mathematics',
    subject: 'mathematics' as const,
    name: 'Mathematics',
    classBadge: 'P5-Math-C',
    confidence: 35,
    strongest: 'Geometry',
    needsFocus: 'Algebra',
  },
  {
    id: 'science',
    subject: 'science' as const,
    name: 'Science',
    classBadge: 'P5-Science-B',
    confidence: 93,
    strongest: 'Cell Biology',
    needsFocus: 'Forces and Motion',
  },
  {
    id: 'english',
    subject: 'english' as const,
    name: 'English',
    classBadge: 'P5-English-A',
    confidence: 0,
    strongest: 'Grammar Essentials',
    needsFocus: 'Human System',
  },
];

export default function AnalyticsPage() {
  return (
    <>
      {/* Header */}
      <div className="mb-8">
        <h1 className="font-display text-2xl font-bold text-zinc-900 tracking-tight" style={{ letterSpacing: '-0.02em' }}>My Performance Analysis</h1>
        <p className="text-zinc-400 text-sm mt-1 font-medium">Track your progress across all subjects.</p>
      </div>

      {/* Subject cards grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {subjects.map((s) => (
          <div key={s.id} className="bg-white rounded-2xl border border-zinc-100 p-6 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-apple flex flex-col gap-4">

            {/* Top: icon + name + class pill */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <SubjectIcon subject={s.subject} />
                <span className="font-semibold text-zinc-900 text-sm">{s.name}</span>
              </div>
              <ClassBadge subject={s.subject} label={s.classBadge} />
            </div>

            {/* Overall confidence */}
            <div className="flex items-center justify-between">
              <span className="text-xs text-zinc-400 font-medium">Overall Confidence</span>
              <ConfidenceBadge score={s.confidence} />
            </div>

            {/* Strongest / Needs Focus */}
            <div className="flex flex-col gap-1.5">
              <div className="flex items-center gap-2">
                <span className="text-xs text-zinc-400">Strongest:</span>
                <span className="text-xs font-semibold text-green-600">{s.strongest}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs text-zinc-400">Needs Focus:</span>
                <span className="text-xs font-semibold text-red-500">{s.needsFocus}</span>
              </div>
            </div>

            {/* CTA */}
            <Link href={`/student/analytics/${s.id}`} className="mt-auto">
              <PrimaryButton fullWidth className="text-sm py-2.5">
                View Detailed Analytics →
              </PrimaryButton>
            </Link>
          </div>
        ))}
      </div>
    </>
  );
}
