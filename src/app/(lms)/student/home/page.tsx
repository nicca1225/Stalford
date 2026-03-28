'use client';

import Link from 'next/link';
import { BookOpen, ChevronRight, Clock, ArrowRight } from 'lucide-react';
import { subjects, continuelearning } from '@/lib/mockData';

function ConfidenceBadge({ score }: { score: number }) {
  if (score >= 76) return <span className="px-2 py-1 bg-green-100 text-green-700 text-xs font-semibold rounded-full">{score}/100</span>;
  if (score >= 51) return <span className="px-2 py-1 bg-yellow-100 text-yellow-700 text-xs font-semibold rounded-full">{score}/100</span>;
  if (score > 0) return <span className="px-2 py-1 bg-orange-100 text-orange-700 text-xs font-semibold rounded-full">{score}/100</span>;
  return <span className="px-2 py-1 bg-red-100 text-red-700 text-xs font-semibold rounded-full">{score}/100</span>;
}

function ProgressBar({ value, max }: { value: number; max: number }) {
  const pct = max > 0 ? (value / max) * 100 : 0;
  return (
    <div className="w-full bg-gray-200 rounded-full h-2">
      <div
        className="bg-yellow-400 h-2 rounded-full transition-all"
        style={{ width: `${pct}%` }}
      />
    </div>
  );
}

export default function StudentHomePage() {
  return (
    <div className="p-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Welcome Back Itadori Yuji!</h1>
          <p className="text-gray-500 text-sm mt-1">Here is your learning overview</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="text-right">
            <p className="text-sm font-semibold text-gray-900">Itadori Yuji</p>
            <p className="text-xs text-gray-500">Student</p>
          </div>
          <div className="w-10 h-10 bg-yellow-400 rounded-full flex items-center justify-center">
            <span className="font-bold text-gray-900 text-sm">IY</span>
          </div>
        </div>
      </div>

      {/* Your Subjects */}
      <section className="mb-8">
        <h2 className="text-lg font-bold text-gray-900 mb-4">Your Subjects</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {subjects.map((subject) => (
            <Link
              key={subject.id}
              href={`/student/subjects/${subject.id}`}
              className="bg-white rounded-xl p-5 shadow-sm border border-gray-100 hover:shadow-md transition-shadow"
            >
              <div className="flex items-start justify-between mb-3">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-2xl">{subject.icon}</span>
                    <h3 className="font-bold text-gray-900">{subject.name}</h3>
                  </div>
                  <p className="text-xs text-gray-500">{subject.class}</p>
                </div>
                <ConfidenceBadge score={subject.confidence} />
              </div>

              <div className="mb-3">
                <div className="flex justify-between text-xs text-gray-500 mb-1">
                  <span>Overall Progress</span>
                  <span>{subject.progress}%</span>
                </div>
                <ProgressBar value={subject.progress} max={100} />
              </div>

              <div className="space-y-1">
                <div className="flex items-center justify-between text-xs text-gray-600">
                  <span>Confidence</span>
                  <span className="font-semibold">{subject.confidence}/100</span>
                </div>
                <div className="flex items-center justify-between text-xs text-gray-600">
                  <span>Worksheets</span>
                  <span className="font-semibold">{subject.worksheetsCompleted}/{subject.worksheetsTotal}</span>
                </div>
                <div className="flex items-center justify-between text-xs text-gray-600">
                  <span>Topics Mastered</span>
                  <span className="font-semibold">{subject.topicsCompleted}/{subject.topicsTotal}</span>
                </div>
              </div>

              <div className="mt-3 pt-3 border-t border-gray-100 flex items-center text-yellow-600 text-xs font-semibold">
                <span>View Topics</span>
                <ChevronRight size={14} className="ml-1" />
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Continue Learning */}
      <section>
        <h2 className="text-lg font-bold text-gray-900 mb-4">Continue Learning</h2>
        <div className="space-y-3">
          {continuelearning.map((item, idx) => (
            <div key={idx} className="bg-white rounded-xl p-5 shadow-sm border border-gray-100 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center">
                  <BookOpen size={20} className="text-yellow-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">{item.topicName}</h3>
                  <p className="text-xs text-gray-500">{item.subjectName}</p>
                  <div className="flex items-center gap-2 mt-1">
                    {item.status === 'lesson-pending' && (
                      <span className="flex items-center gap-1 text-xs text-orange-600 bg-orange-50 px-2 py-0.5 rounded-full">
                        <Clock size={10} />
                        Lesson Pending
                      </span>
                    )}
                    <span className="text-xs text-gray-500">{item.message}</span>
                  </div>
                </div>
              </div>
              <Link
                href={`/student/subjects/${item.subjectId}/topics/${item.topicId}`}
                className="flex items-center gap-2 bg-yellow-400 hover:bg-yellow-500 text-gray-900 font-semibold px-4 py-2 rounded-lg text-sm transition-colors"
              >
                Continue
                <ArrowRight size={14} />
              </Link>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
