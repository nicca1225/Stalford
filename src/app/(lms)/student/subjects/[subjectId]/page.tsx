'use client';

import { use } from 'react';
import Link from 'next/link';
import { ChevronLeft, Clock, CheckCircle, BookOpen, ChevronRight, FileText } from 'lucide-react';
import { subjects, topics } from '@/lib/mockData';

function ConfidenceBadge({ score, max = 50 }: { score: number; max?: number }) {
  const pct = Math.round((score / max) * 100);
  if (pct >= 76) return <span className="px-2 py-1 bg-green-100 text-green-700 text-xs font-semibold rounded-full">{score}/{max}</span>;
  if (pct >= 51) return <span className="px-2 py-1 bg-yellow-100 text-yellow-700 text-xs font-semibold rounded-full">{score}/{max}</span>;
  if (pct > 0) return <span className="px-2 py-1 bg-orange-100 text-orange-700 text-xs font-semibold rounded-full">{score}/{max}</span>;
  return <span className="px-2 py-1 bg-red-100 text-red-700 text-xs font-semibold rounded-full">{score}/{max}</span>;
}

function ProgressBar({ value, max }: { value: number; max: number }) {
  const pct = max > 0 ? (value / max) * 100 : 0;
  return (
    <div className="w-full bg-gray-200 rounded-full h-1.5">
      <div className="bg-yellow-400 h-1.5 rounded-full" style={{ width: `${pct}%` }} />
    </div>
  );
}

export default function SubjectPage({ params }: { params: Promise<{ subjectId: string }> }) {
  const { subjectId } = use(params);
  const subject = subjects.find((s) => s.id === subjectId);
  const subjectTopics = topics[subjectId as keyof typeof topics] || [];

  if (!subject) {
    return <div className="p-8 text-gray-600">Subject not found.</div>;
  }

  return (
    <div className="p-8">
      {/* Back */}
      <Link href="/student/home" className="flex items-center gap-1 text-gray-500 hover:text-gray-900 text-sm mb-6">
        <ChevronLeft size={16} />
        Back to Home
      </Link>

      {/* Header */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 mb-6">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 bg-yellow-100 rounded-xl flex items-center justify-center text-3xl">
            {subject.icon}
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{subject.name}</h1>
            <p className="text-gray-500 text-sm">{subject.class}</p>
            <p className="text-yellow-600 text-sm font-semibold mt-1">{subject.totalTopics} topics to master</p>
          </div>
        </div>
      </div>

      {/* Topics */}
      <div className="space-y-4">
        {subjectTopics.map((topic) => (
          <div key={topic.id} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="p-5">
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-1">
                    <h3 className="font-bold text-gray-900">{topic.name}</h3>
                    <ConfidenceBadge score={topic.confidence} max={topic.maxConfidence} />
                  </div>
                  <p className="text-sm text-gray-500">{topic.description}</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                {/* Lesson Attendance */}
                <div className="flex items-center gap-2">
                  {topic.lessonAttended ? (
                    <>
                      <CheckCircle size={16} className="text-green-500" />
                      <span className="text-sm text-green-600 font-medium">Lesson Attended</span>
                    </>
                  ) : (
                    <>
                      <Clock size={16} className="text-orange-500" />
                      <span className="text-sm text-orange-600 font-medium">Lesson Required</span>
                    </>
                  )}
                </div>

                {/* Worksheets Progress */}
                <div>
                  <div className="flex items-center justify-between text-xs text-gray-500 mb-1">
                    <span>Worksheets</span>
                    <span className="font-semibold">{topic.worksheetsCompleted}/{topic.worksheetsTotal}</span>
                  </div>
                  <ProgressBar value={topic.worksheetsCompleted} max={topic.worksheetsTotal} />
                </div>
              </div>

              {/* Worksheet List */}
              {topic.worksheets.length > 0 && (
                <div className="mt-4 space-y-2">
                  {topic.worksheets.map((ws) => (
                    <div key={ws.id} className="flex items-center justify-between bg-gray-50 rounded-lg px-3 py-2">
                      <div className="flex items-center gap-2">
                        <FileText size={14} className={ws.completed ? 'text-green-500' : 'text-gray-400'} />
                        <span className="text-sm text-gray-700">{ws.name}</span>
                        {ws.completed && (
                          <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full">Completed</span>
                        )}
                      </div>
                      <ChevronRight size={14} className="text-gray-400" />
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="px-5 pb-4">
              <Link
                href={`/student/subjects/${subjectId}/topics/${topic.id}`}
                className="flex items-center justify-center gap-2 bg-yellow-400 hover:bg-yellow-500 text-gray-900 font-semibold px-4 py-2.5 rounded-lg text-sm transition-colors w-full"
              >
                <BookOpen size={16} />
                Continue Learning
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
