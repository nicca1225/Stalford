'use client';

import { use } from 'react';
import Link from 'next/link';
import { ChevronLeft, CheckCircle, Clock, BookOpen, FileText, Video, Download, Newspaper, Star } from 'lucide-react';
import { subjects, topics } from '@/lib/mockData';

function ConfidenceBadge({ score, max = 50 }: { score: number; max?: number }) {
  const pct = Math.round((score / max) * 100);
  if (pct >= 76) return <span className="px-3 py-1 bg-green-100 text-green-700 text-sm font-semibold rounded-full">Confidence: {score}/{max}</span>;
  if (pct >= 51) return <span className="px-3 py-1 bg-yellow-100 text-yellow-700 text-sm font-semibold rounded-full">Confidence: {score}/{max}</span>;
  if (pct > 0) return <span className="px-3 py-1 bg-orange-100 text-orange-700 text-sm font-semibold rounded-full">Confidence: {score}/{max}</span>;
  return <span className="px-3 py-1 bg-red-100 text-red-700 text-sm font-semibold rounded-full">Confidence: {score}/{max}</span>;
}

function MaterialIcon({ type }: { type: string }) {
  if (type === 'video') return <Video size={16} className="text-blue-500" />;
  if (type === 'past-paper') return <Newspaper size={16} className="text-orange-500" />;
  return <BookOpen size={16} className="text-yellow-600" />;
}

export default function TopicDetailPage({ params }: { params: Promise<{ subjectId: string; topicId: string }> }) {
  const { subjectId, topicId } = use(params);
  const subject = subjects.find((s) => s.id === subjectId);
  const subjectTopics = topics[subjectId as keyof typeof topics] || [];
  const topic = subjectTopics.find((t) => t.id === topicId);

  if (!subject || !topic) {
    return <div className="p-8 text-gray-600">Topic not found.</div>;
  }

  const lectureNotes = topic.materials.filter((m) => m.type === 'notes');
  const pastPapers = topic.materials.filter((m) => m.type === 'past-paper');

  return (
    <div className="p-8">
      {/* Back */}
      <Link href={`/student/subjects/${subjectId}`} className="flex items-center gap-1 text-gray-500 hover:text-gray-900 text-sm mb-6">
        <ChevronLeft size={16} />
        Back to {subject.name}
      </Link>

      {/* Header */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 mb-6">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-yellow-100 rounded-xl flex items-center justify-center">
              <BookOpen size={24} className="text-yellow-600" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">{topic.name}</h1>
              <p className="text-gray-500 text-sm">{subject.name} • {subject.class}</p>
              <p className="text-gray-600 text-sm mt-1">{topic.description}</p>
            </div>
          </div>
          <ConfidenceBadge score={topic.confidence} max={topic.maxConfidence} />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Watch Recorded Lesson */}
          <div className="bg-yellow-50 border-2 border-yellow-200 rounded-xl p-5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-yellow-400 rounded-lg flex items-center justify-center">
                  <Video size={20} className="text-gray-900" />
                </div>
                <div>
                  <h3 className="font-bold text-gray-900">Watch Recorded Lesson</h3>
                  <p className="text-sm text-gray-600">Access the lesson recording for {topic.name}</p>
                </div>
              </div>
              <button className="bg-yellow-400 hover:bg-yellow-500 text-gray-900 font-semibold px-4 py-2 rounded-lg text-sm transition-colors">
                Watch Now
              </button>
            </div>
          </div>

          {/* Worksheets */}
          <div>
            <h2 className="text-lg font-bold text-gray-900 mb-3">Worksheets</h2>
            {topic.worksheets.length > 0 ? (
              <div className="space-y-3">
                {topic.worksheets.map((ws) => (
                  <div key={ws.id} className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${ws.completed ? 'bg-green-100' : 'bg-gray-100'}`}>
                          <FileText size={20} className={ws.completed ? 'text-green-600' : 'text-gray-500'} />
                        </div>
                        <div>
                          <h3 className="font-semibold text-gray-900">{ws.name}</h3>
                          {ws.completed && <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full">Completed</span>}
                        </div>
                      </div>
                    </div>
                    <div className="grid grid-cols-3 gap-3 mb-4">
                      <div className="text-center bg-gray-50 rounded-lg p-2">
                        <p className="text-xs text-gray-500">Questions</p>
                        <p className="font-bold text-gray-900">{ws.questions}</p>
                      </div>
                      <div className="text-center bg-gray-50 rounded-lg p-2">
                        <p className="text-xs text-gray-500">Total Points</p>
                        <p className="font-bold text-gray-900">{ws.points}</p>
                      </div>
                      <div className="text-center bg-gray-50 rounded-lg p-2">
                        <p className="text-xs text-gray-500">Time Limit</p>
                        <p className="font-bold text-gray-900">{ws.timeLimit} min</p>
                      </div>
                    </div>
                    {!ws.completed && (
                      <button className="w-full bg-yellow-400 hover:bg-yellow-500 text-gray-900 font-semibold py-2.5 rounded-lg text-sm transition-colors">
                        Start Worksheet
                      </button>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="bg-white rounded-xl p-6 text-center text-gray-500 border border-gray-100">
                No worksheets available yet.
              </div>
            )}
          </div>

          {/* Study Materials */}
          {topic.materials.length > 0 && (
            <div>
              <h2 className="text-lg font-bold text-gray-900 mb-3">Study Materials</h2>

              {lectureNotes.length > 0 && (
                <div className="mb-4">
                  <div className="flex items-center gap-2 mb-2">
                    <BookOpen size={16} className="text-yellow-600" />
                    <h3 className="font-semibold text-gray-700 text-sm">Lecture Notes & Study Guides</h3>
                  </div>
                  <div className="space-y-3">
                    {lectureNotes.map((mat) => (
                      <div key={mat.id} className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 bg-yellow-50 rounded-lg flex items-center justify-center">
                            <MaterialIcon type={mat.type} />
                          </div>
                          <div>
                            <p className="font-semibold text-gray-900 text-sm">{mat.name}</p>
                            <p className="text-xs text-gray-500">{mat.description}</p>
                            <p className="text-xs text-gray-400 mt-0.5">By {mat.uploadedBy} • {mat.date} • {mat.size}</p>
                          </div>
                        </div>
                        <button className="text-gray-400 hover:text-yellow-600 p-2 rounded-lg hover:bg-yellow-50">
                          <Download size={16} />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {pastPapers.length > 0 && (
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <Newspaper size={16} className="text-orange-500" />
                    <h3 className="font-semibold text-gray-700 text-sm">Past Year Papers & Practice</h3>
                  </div>
                  <div className="space-y-3">
                    {pastPapers.map((mat) => (
                      <div key={mat.id} className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 bg-orange-50 rounded-lg flex items-center justify-center">
                            <MaterialIcon type={mat.type} />
                          </div>
                          <div>
                            <p className="font-semibold text-gray-900 text-sm">{mat.name}</p>
                            <p className="text-xs text-gray-500">{mat.description}</p>
                            <p className="text-xs text-gray-400 mt-0.5">By {mat.uploadedBy} • {mat.date} • {mat.size}</p>
                          </div>
                        </div>
                        <button className="text-gray-400 hover:text-yellow-600 p-2 rounded-lg hover:bg-yellow-50">
                          <Download size={16} />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Sidebar Requirements */}
        <div className="space-y-4">
          <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
            <h3 className="font-bold text-gray-900 mb-4">Requirements</h3>

            <div className="space-y-4">
              {/* Lesson Attendance */}
              <div>
                <p className="text-sm font-semibold text-gray-700 mb-2">Lesson Attendance</p>
                {topic.lessonAttended ? (
                  <div className="flex items-center gap-2 bg-green-50 rounded-lg p-3">
                    <CheckCircle size={16} className="text-green-500" />
                    <span className="text-sm text-green-700 font-medium">Completed</span>
                  </div>
                ) : (
                  <div className="flex items-center gap-2 bg-orange-50 rounded-lg p-3">
                    <Clock size={16} className="text-orange-500" />
                    <span className="text-sm text-orange-700 font-medium">Required</span>
                  </div>
                )}
              </div>

              {/* Worksheets */}
              <div>
                <p className="text-sm font-semibold text-gray-700 mb-2">
                  Worksheets ({topic.worksheetsCompleted} of {topic.worksheetsTotal} completed)
                </p>
                <div className="space-y-2">
                  {topic.worksheets.map((ws) => (
                    <div key={ws.id} className="flex items-center gap-2">
                      {ws.completed ? (
                        <CheckCircle size={14} className="text-green-500 flex-shrink-0" />
                      ) : (
                        <div className="w-3.5 h-3.5 rounded-full border-2 border-gray-300 flex-shrink-0" />
                      )}
                      <span className={`text-xs ${ws.completed ? 'text-gray-500 line-through' : 'text-gray-700'}`}>
                        {ws.name}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Confidence Score */}
              <div>
                <p className="text-sm font-semibold text-gray-700 mb-2">Confidence Score</p>
                <div className="bg-gray-50 rounded-lg p-3">
                  <div className="flex items-center gap-2">
                    <Star size={14} className="text-yellow-400" />
                    <span className="text-sm font-semibold text-gray-900">{topic.confidence}/{topic.maxConfidence}</span>
                  </div>
                  <div className="mt-2 bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-yellow-400 h-2 rounded-full"
                      style={{ width: `${(topic.confidence / topic.maxConfidence) * 100}%` }}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
