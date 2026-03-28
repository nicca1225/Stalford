'use client';

import Link from 'next/link';
import { BookOpen, CheckCircle, Clock } from 'lucide-react';
import SubjectIcon from '@/components/ui/SubjectIcon';
import ProgressBar from '@/components/ui/ProgressBar';
import ConfidenceBadge from '@/components/ui/ConfidenceBadge';
import PrimaryButton from '@/components/ui/PrimaryButton';
import ClassBadge from '@/components/ui/ClassBadge';

const subjects = [
  {
    id: 'mathematics',
    name: 'Mathematics',
    subject: 'mathematics' as const,
    classBadge: 'P5-Math-C',
    progress: 15,
    confidence: 35,
    worksheetsCompleted: 1,
    worksheetsTotal: 3,
    topicsCompleted: 0,
    topicsTotal: 5,
    accentColor: 'border-t-blue-400',
  },
  {
    id: 'science',
    name: 'Science',
    subject: 'science' as const,
    classBadge: 'P5-Science-B',
    progress: 100,
    confidence: 93,
    worksheetsCompleted: 5,
    worksheetsTotal: 5,
    topicsCompleted: 5,
    topicsTotal: 5,
    accentColor: 'border-t-emerald-400',
  },
  {
    id: 'english',
    name: 'English',
    subject: 'english' as const,
    classBadge: 'P5-English-A',
    progress: 0,
    confidence: 0,
    worksheetsCompleted: 0,
    worksheetsTotal: 1,
    topicsCompleted: 0,
    topicsTotal: 5,
    accentColor: 'border-t-violet-400',
  },
];

const continueTopics = [
  {
    id: 'algebra',
    name: 'Algebra',
    subject: 'mathematics' as const,
    subjectLabel: 'Mathematics',
    subjectId: 'mathematics',
    lessonPending: false,
    worksheetsRemaining: 1,
  },
  {
    id: 'geometry',
    name: 'Geometry',
    subject: 'mathematics' as const,
    subjectLabel: 'Mathematics',
    subjectId: 'mathematics',
    lessonPending: true,
    worksheetsRemaining: 1,
  },
  {
    id: 'grammar-essentials',
    name: 'Grammar Essentials',
    subject: 'english' as const,
    subjectLabel: 'English',
    subjectId: 'english',
    lessonPending: true,
    worksheetsRemaining: 1,
  },
];

export default function StudentHomePage() {
  return (
    <>
      {/* Header */}
      <div className="mb-8 animate-fade-in-up">
        <h1 className="font-display text-2xl font-bold text-zinc-900 tracking-tight" style={{ letterSpacing: '-0.02em' }}>
          Welcome Back, Itadori Yuji!
        </h1>
        <p className="text-zinc-400 text-sm mt-1 font-medium">Here's an overview of your subjects.</p>
      </div>

      {/* Your Subjects */}
      <section className="mb-10 animate-fade-in-up" style={{ animationDelay: '0.05s' }}>
        <h2 className="text-sm font-semibold text-zinc-400 uppercase tracking-widest mb-4">Your Subjects</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {subjects.map((s) => (
            <Link
              key={s.id}
              href={`/student/subjects/${s.id}`}
              className={`bg-white rounded-2xl border border-zinc-100 border-t-[3px] ${s.accentColor} p-6 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-apple flex flex-col gap-4`}
            >
              {/* Top row */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <SubjectIcon subject={s.subject} />
                  <div>
                    <span className="font-semibold text-zinc-900 text-sm leading-tight">{s.name}</span>
                    <p className="text-[11px] text-zinc-400 mt-0.5">{s.topicsTotal} topics</p>
                  </div>
                </div>
                <ClassBadge subject={s.subject} label={s.classBadge} />
              </div>

              {/* Progress */}
              <div className="space-y-1.5">
                <div className="flex justify-between items-center">
                  <span className="text-xs text-zinc-400 font-medium">Overall Progress</span>
                  <span className="text-xs font-bold text-zinc-700">{s.progress}%</span>
                </div>
                <ProgressBar value={s.progress} />
              </div>

              {/* Confidence */}
              <div className="flex items-center justify-between">
                <span className="text-xs text-zinc-400 font-medium">Confidence Level</span>
                <ConfidenceBadge score={s.confidence} />
              </div>

              {/* Bottom counts */}
              <div className="flex items-center gap-4 pt-3 border-t border-zinc-50">
                <div className="flex items-center gap-1.5 text-xs text-zinc-400">
                  <BookOpen size={12} className="text-zinc-300" />
                  <span>Worksheets&nbsp;
                    <span className="font-semibold text-zinc-600">{s.worksheetsCompleted}/{s.worksheetsTotal}</span>
                  </span>
                </div>
                <div className="flex items-center gap-1.5 text-xs text-zinc-400">
                  <CheckCircle size={12} className="text-zinc-300" />
                  <span>Topics&nbsp;
                    <span className="font-semibold text-zinc-600">{s.topicsCompleted}/{s.topicsTotal}</span>
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Continue Learning */}
      <section className="animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
        <h2 className="text-sm font-semibold text-zinc-400 uppercase tracking-widest mb-4">Continue Learning</h2>
        <div className="flex flex-col gap-2.5">
          {continueTopics.map((t) => (
            <div
              key={t.id}
              className="bg-white rounded-2xl border border-zinc-100 px-6 py-4 flex items-center justify-between shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-apple"
            >
              {/* Left */}
              <div className="flex items-center gap-4">
                <div className="w-9 h-9 flex-shrink-0">
                  <SubjectIcon subject={t.subject} />
                </div>
                <div>
                  <p className="font-semibold text-zinc-900 text-sm">{t.name}</p>
                  <p className="text-xs text-zinc-400 font-medium mt-0.5">{t.subjectLabel}</p>
                </div>
              </div>

              {/* Middle: status pills */}
              <div className="flex items-center gap-2 mx-6">
                {t.lessonPending && (
                  <span className="flex items-center gap-1.5 text-xs text-zinc-500 font-medium bg-zinc-100 px-3 py-1.5 rounded-full">
                    <Clock size={11} className="text-zinc-400" />
                    Lesson Pending
                  </span>
                )}
                <span className="text-xs text-zinc-500 font-medium bg-zinc-100 px-3 py-1.5 rounded-full">
                  {t.worksheetsRemaining} worksheet remaining
                </span>
              </div>

              {/* Right */}
              <Link href={`/student/subjects/${t.subjectId}/topics/${t.id}`}>
                <PrimaryButton className="text-sm px-5 py-2">Continue</PrimaryButton>
              </Link>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}
