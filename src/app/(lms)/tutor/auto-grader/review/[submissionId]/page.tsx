'use client';

import { use, useState } from 'react';
import Link from 'next/link';
import { ChevronLeft, CheckCircle, XCircle, Edit2, Save, X } from 'lucide-react';
import { reviewSubmission } from '@/lib/mockData';

interface Question {
  id: number;
  question: string;
  studentAnswer: string;
  correctAnswer: string;
  isCorrect: boolean;
  marks: number;
  maxMarks: number;
  aiExplanation: string;
}

export default function ReviewPage({ params }: { params: Promise<{ submissionId: string }> }) {
  const { submissionId } = use(params);
  const sub = reviewSubmission;

  const [questions, setQuestions] = useState<Question[]>(sub.questions);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editData, setEditData] = useState<{ isCorrect: boolean; marks: number; explanation: string }>({
    isCorrect: true,
    marks: 1,
    explanation: '',
  });
  const [overrideTotal, setOverrideTotal] = useState<string>('');
  const [approved, setApproved] = useState(false);

  const totalMarks = questions.reduce((sum, q) => sum + q.marks, 0);
  const maxMarks = questions.reduce((sum, q) => sum + q.maxMarks, 0);
  const correct = questions.filter((q) => q.isCorrect).length;
  const incorrect = questions.filter((q) => !q.isCorrect).length;

  const startEdit = (q: Question) => {
    setEditingId(q.id);
    setEditData({ isCorrect: q.isCorrect, marks: q.marks, explanation: q.aiExplanation });
  };

  const saveEdit = (id: number) => {
    setQuestions((prev) =>
      prev.map((q) =>
        q.id === id
          ? { ...q, isCorrect: editData.isCorrect, marks: editData.marks, aiExplanation: editData.explanation }
          : q
      )
    );
    setEditingId(null);
  };

  if (approved) {
    return (
      <div className="p-8 flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle size={40} className="text-green-500" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Submission Approved!</h2>
          <p className="text-gray-500 mb-6">The student will be notified of their results.</p>
          <Link href="/tutor/auto-grader" className="bg-yellow-400 hover:bg-yellow-500 text-gray-900 font-semibold px-6 py-3 rounded-lg transition-colors">
            Back to Auto Grader
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8">
      <Link href="/tutor/auto-grader" className="flex items-center gap-1 text-gray-500 hover:text-gray-900 text-sm mb-6">
        <ChevronLeft size={16} />
        Back to Auto Grader
      </Link>

      {/* Header */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 mb-6">
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-xl font-bold text-gray-900">AI Grader Review — Teacher</h1>
            <p className="text-gray-600 text-sm mt-1">
              <span className="font-semibold">{sub.studentName}</span> • {sub.worksheetName}
            </p>
            <p className="text-gray-400 text-xs mt-0.5">Awaiting your approval</p>
          </div>
          <span className="px-3 py-1 bg-yellow-100 text-yellow-700 text-sm font-semibold rounded-full">Pending</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Panel */}
        <div className="space-y-4">
          {/* AI Score */}
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 text-center">
            <p className="text-sm text-gray-500 mb-2">AI Score</p>
            <div className="text-6xl font-bold text-yellow-400 mb-1">{totalMarks}</div>
            <div className="text-gray-400 text-lg">/ {maxMarks}</div>
            <p className="text-xs text-gray-500 mt-2">AI Confidence: {sub.aiConfidence}%</p>
          </div>

          {/* Override */}
          <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
            <p className="text-sm font-semibold text-gray-700 mb-3">Override Total Marks</p>
            <input
              type="number"
              value={overrideTotal}
              onChange={(e) => setOverrideTotal(e.target.value)}
              placeholder={`${totalMarks}`}
              min="0"
              max={maxMarks}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-yellow-400"
            />
          </div>

          {/* Q-level table */}
          <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
            <p className="text-sm font-semibold text-gray-700 mb-3">Question Marks</p>
            <div className="space-y-2">
              {questions.map((q) => (
                <div key={q.id} className="flex items-center justify-between text-sm">
                  <span className="text-gray-500">Q{q.id}</span>
                  <span className={`font-semibold ${q.isCorrect ? 'text-green-600' : 'text-red-500'}`}>
                    {q.marks}/{q.maxMarks}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Summary */}
          <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
            <p className="text-sm font-semibold text-gray-700 mb-3">Summary</p>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-500">Correct</span>
                <span className="font-semibold text-green-600">{correct}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Incorrect</span>
                <span className="font-semibold text-red-500">{incorrect}</span>
              </div>
              <div className="flex justify-between border-t pt-2">
                <span className="text-gray-700 font-semibold">Total</span>
                <span className="font-bold">{totalMarks}/{maxMarks}</span>
              </div>
            </div>
          </div>

          <button
            onClick={() => setApproved(true)}
            className="w-full bg-green-500 hover:bg-green-600 text-white font-bold py-3 rounded-xl transition-colors flex items-center justify-center gap-2"
          >
            <CheckCircle size={18} />
            Approve
          </button>
        </div>

        {/* Right Panel - Questions */}
        <div className="lg:col-span-2 space-y-4">
          <h2 className="font-bold text-gray-900">AI Evaluation</h2>
          {questions.map((q) => (
            <div
              key={q.id}
              className={`bg-white rounded-xl p-5 shadow-sm border-l-4 ${
                q.isCorrect ? 'border-green-400' : 'border-red-400'
              } border border-gray-100`}
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-2">
                  <span
                    className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold text-white ${
                      q.isCorrect ? 'bg-green-500' : 'bg-red-500'
                    }`}
                  >
                    Q{q.id}
                  </span>
                  {q.isCorrect ? (
                    <CheckCircle size={16} className="text-green-500" />
                  ) : (
                    <XCircle size={16} className="text-red-500" />
                  )}
                  <span className="text-xs text-gray-500">{q.marks}/{q.maxMarks} marks</span>
                </div>
                {editingId !== q.id && (
                  <button
                    onClick={() => startEdit(q)}
                    className="flex items-center gap-1 text-xs text-gray-500 hover:text-yellow-600 bg-gray-100 hover:bg-yellow-50 px-2 py-1 rounded-lg transition-colors"
                  >
                    <Edit2 size={12} />
                    Edit
                  </button>
                )}
              </div>

              <p className="font-semibold text-gray-900 text-sm mb-2">{q.question}</p>

              <div className="bg-gray-50 rounded-lg p-2 mb-3">
                <p className="text-xs text-gray-400">Student Answer</p>
                <p className={`text-sm font-medium ${q.isCorrect ? 'text-green-700' : 'text-red-600'}`}>
                  {q.studentAnswer}
                </p>
              </div>

              {editingId === q.id ? (
                <div className="space-y-3 border-t border-gray-100 pt-3">
                  <div className="flex items-center gap-4">
                    <div>
                      <p className="text-xs font-semibold text-gray-600 mb-1">Status</p>
                      <div className="flex gap-2">
                        <button
                          onClick={() => setEditData((d) => ({ ...d, isCorrect: true, marks: q.maxMarks }))}
                          className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-colors ${
                            editData.isCorrect
                              ? 'bg-green-500 text-white border-green-500'
                              : 'border-gray-300 text-gray-600 hover:border-green-400'
                          }`}
                        >
                          Correct
                        </button>
                        <button
                          onClick={() => setEditData((d) => ({ ...d, isCorrect: false, marks: 0 }))}
                          className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-colors ${
                            !editData.isCorrect
                              ? 'bg-red-500 text-white border-red-500'
                              : 'border-gray-300 text-gray-600 hover:border-red-400'
                          }`}
                        >
                          Incorrect
                        </button>
                      </div>
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-gray-600 mb-1">Marks</p>
                      <input
                        type="number"
                        value={editData.marks}
                        onChange={(e) => setEditData((d) => ({ ...d, marks: Number(e.target.value) }))}
                        min="0"
                        max={q.maxMarks}
                        className="w-16 border border-gray-300 rounded-lg px-2 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-yellow-400"
                      />
                    </div>
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-gray-600 mb-1">AI Explanation</p>
                    <textarea
                      value={editData.explanation}
                      onChange={(e) => setEditData((d) => ({ ...d, explanation: e.target.value }))}
                      rows={3}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-yellow-400 resize-none"
                    />
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => saveEdit(q.id)}
                      className="flex items-center gap-1 bg-yellow-400 hover:bg-yellow-500 text-gray-900 font-semibold px-3 py-1.5 rounded-lg text-xs transition-colors"
                    >
                      <Save size={12} />
                      Save
                    </button>
                    <button
                      onClick={() => setEditingId(null)}
                      className="flex items-center gap-1 border border-gray-300 text-gray-600 hover:bg-gray-50 px-3 py-1.5 rounded-lg text-xs transition-colors"
                    >
                      <X size={12} />
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <div className="border-t border-gray-100 pt-3">
                  <p className="text-xs text-gray-500 font-semibold mb-1">AI Explanation</p>
                  <p className="text-sm text-gray-600">{q.aiExplanation}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
