'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { ChevronLeft, CheckCircle, Pencil, X, Save } from 'lucide-react';
import { getResults } from '@/lib/api';
import type { DatabaseFeed, DetailedGrading } from '@/types/database';

/* ── Question card ──────────────────────────────────────────── */

interface QuestionCardProps {
  q: DetailedGrading;
  overrideMark: number;
  onMarkChange: (qNum: string, val: number) => void;
}

function QuestionCard({ q, overrideMark, onMarkChange }: QuestionCardProps) {
  const [editing, setEditing] = useState(!q.is_fully_correct);
  const [status, setStatus] = useState<'correct' | 'incorrect'>(
    q.is_fully_correct ? 'correct' : 'incorrect'
  );
  const [marks, setMarks] = useState(overrideMark);
  const [explanation, setExplanation] = useState(q.tutor_reasoning);

  // First sentence only for the context blurb
  const contextSentence = q.tutor_reasoning.split(/\.\s+/)[0] + '.';

  const isCorrect = q.is_fully_correct;
  const cardBase = isCorrect ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200';
  const badgeBase = isCorrect ? 'bg-green-500 text-white' : 'bg-red-500 text-white';

  const handleMarkChange = (val: number) => {
    setMarks(val);
    onMarkChange(q.question_number, val);
  };

  return (
    <div className={`rounded-xl border p-4 ${cardBase}`}>
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${badgeBase}`}>
          Q{q.question_number} — AI awarded {q.marks_awarded}/{q.max_marks}
        </span>
        {editing ? (
          <div className="flex items-center gap-2">
            <button
              onClick={() => setEditing(false)}
              className="flex items-center gap-1 text-xs border border-gray-300 rounded-lg px-2.5 py-1 bg-white hover:bg-gray-50 font-medium"
            >
              <Save size={11} /> Save
            </button>
            <button
              onClick={() => { setEditing(false); setMarks(overrideMark); setExplanation(q.tutor_reasoning); }}
              className="flex items-center gap-1 text-xs border border-gray-300 rounded-lg px-2.5 py-1 bg-white hover:bg-gray-50 font-medium"
            >
              <X size={11} /> Cancel
            </button>
          </div>
        ) : (
          <button
            onClick={() => setEditing(true)}
            className="flex items-center gap-1 text-xs text-gray-500 hover:text-gray-800 font-medium transition-colors"
          >
            <Pencil size={12} /> Edit
          </button>
        )}
      </div>

      {/* Context sentence */}
      <p className="text-sm text-gray-700 mb-3">{contextSentence}</p>

      {!isCorrect && (
        <p className="text-sm mb-3">
          <span className="text-gray-500">Student error: </span>
          <span className="text-red-500 font-medium">{q.error_type ?? '—'}</span>
        </p>
      )}

      {editing ? (
        <div className="flex flex-col gap-3">
          {/* Status toggle */}
          <div>
            <p className="text-xs text-gray-500 mb-1.5">Status</p>
            <div className="flex gap-2">
              <button
                onClick={() => setStatus('correct')}
                className={`text-xs px-3 py-1.5 rounded-lg border font-semibold transition-colors
                  ${status === 'correct'
                    ? 'bg-green-500 text-white border-green-500'
                    : 'bg-white text-green-600 border-green-400 hover:bg-green-50'}`}
              >
                ✓ Correct
              </button>
              <button
                onClick={() => setStatus('incorrect')}
                className={`text-xs px-3 py-1.5 rounded-lg border font-semibold transition-colors
                  ${status === 'incorrect'
                    ? 'bg-red-500 text-white border-red-500'
                    : 'bg-white text-red-500 border-red-400 hover:bg-red-50'}`}
              >
                ✗ Incorrect
              </button>
            </div>
          </div>

          {/* Marks */}
          <div>
            <p className="text-xs text-gray-500 mb-1.5">Marks ({q.max_marks} total)</p>
            <input
              type="number"
              min={0}
              max={q.max_marks}
              value={marks}
              onChange={(e) => handleMarkChange(Number(e.target.value))}
              className="w-20 border border-gray-200 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-yellow-400"
            />
          </div>

          {/* Explanation editable */}
          <div>
            <p className="text-xs text-gray-500 mb-1.5">AI explanation:</p>
            <textarea
              value={explanation}
              onChange={(e) => setExplanation(e.target.value)}
              rows={3}
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-yellow-400 bg-white resize-none"
            />
          </div>
        </div>
      ) : (
        <div>
          <p className="text-xs text-gray-500 mb-1">AI explanation:</p>
          <p className="text-sm text-gray-700">{explanation}</p>
        </div>
      )}

      {/* Tip */}
      <p className="text-sm text-gray-400 italic mt-3">
        Tip: {q.student_exam_tip}
      </p>
    </div>
  );
}

/* ── Page ───────────────────────────────────────────────────── */

export default function AutoGraderReviewPage() {
  const params = useSearchParams();
  const studentName = params.get('student') ?? '';
  const classId = params.get('class') ?? '';

  const [feed, setFeed] = useState<DatabaseFeed | null>(null);
  const [overrideTotal, setOverrideTotal] = useState<number>(0);
  const [qOverrides, setQOverrides] = useState<Record<string, number>>({});
  const [approved, setApproved] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getResults()
      .then((data) => {
        setFeed(data);
        const classData = data.all_classes.find(
          (c) => c.class_summary.class_id === classId
        );
        const student = classData?.students.find(
          (s) => s.student_name === studentName
        );
        if (student) {
          setOverrideTotal(student.student_total_marks);
          const defaults: Record<string, number> = {};
          for (const q of student.detailed_grading) {
            defaults[q.question_number] = q.marks_awarded;
          }
          setQOverrides(defaults);
        }
      })
      .catch(() => null)
      .finally(() => setLoading(false));
  }, [studentName, classId]);

  const classData = feed?.all_classes.find(
    (c) => c.class_summary.class_id === classId
  );
  const student = classData?.students.find(
    (s) => s.student_name === studentName
  );

  const handleQMarkChange = (qNum: string, val: number) => {
    setQOverrides((prev) => ({ ...prev, [qNum]: val }));
  };

  const correctCount = student?.detailed_grading.filter((q) => q.is_fully_correct).length ?? 0;
  const incorrectCount = student?.detailed_grading.filter((q) => !q.is_fully_correct).length ?? 0;
  const totalQuestions = student?.detailed_grading.length ?? 0;

  if (loading) {
    return (
      <p className="text-sm text-gray-400 mt-8 text-center">Loading grading data…</p>
    );
  }

  if (!student) {
    return (
      <>
        <Link
          href="/tutor/auto-grader"
          className="inline-flex items-center gap-1 text-sm text-gray-500 hover:text-gray-800 mb-6 transition-colors"
        >
          <ChevronLeft size={15} /> Back to Auto Grader
        </Link>
        <p className="text-sm text-red-500 mt-4">
          Student &quot;{studentName}&quot; not found in class &quot;{classId}&quot;.
        </p>
      </>
    );
  }

  return (
    <>
      {/* Back nav */}
      <Link
        href="/tutor/auto-grader"
        className="inline-flex items-center gap-1 text-sm text-gray-500 hover:text-gray-800 mb-6 transition-colors"
      >
        <ChevronLeft size={15} /> Back to Auto Grader
      </Link>

      {/* Approve toast */}
      {approved && (
        <div className="mb-6 flex items-center gap-2 bg-green-50 border border-green-200 rounded-lg px-4 py-3">
          <CheckCircle size={16} className="text-green-600" />
          <span className="text-sm text-green-700 font-medium">
            Grading approved for {student.student_name}!
          </span>
        </div>
      )}

      {/* Page header */}
      <div className="flex items-start justify-between mb-1">
        <h1 className="text-xl font-bold text-gray-900">AI Grader Review — Teacher</h1>
        <span className="text-xs font-semibold bg-yellow-100 text-yellow-700 px-3 py-1 rounded-full mt-1">
          Pending
        </span>
      </div>
      <p className="text-sm text-gray-400 mb-8">
        {student.student_name} &middot; {student.class_id} &middot; Awaiting your approval
      </p>

      {/* Two-column layout */}
      <div className="flex gap-8 items-start">

        {/* ── Left panel ── */}
        <div className="w-[380px] flex-shrink-0 bg-white rounded-xl border border-gray-100 p-6 shadow-sm">

          {/* Score */}
          <p className="text-sm text-gray-400 text-center mb-1">AI score</p>
          <div className="flex items-end justify-center gap-2 mb-1">
            <span className="text-5xl font-bold text-[#FFC107]">
              {student.student_total_marks}
            </span>
            <span className="text-2xl text-gray-400 mb-1">/ {student.paper_total_marks}</span>
          </div>
          <p className="text-sm text-gray-400 text-center mb-6">
            AI confidence: {student.overall_percentage}%
          </p>

          {/* Override total */}
          <div className="mb-4">
            <label className="block text-xs font-semibold text-gray-600 mb-1.5">
              Override total marks
            </label>
            <input
              type="number"
              value={overrideTotal}
              onChange={(e) => setOverrideTotal(Number(e.target.value))}
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-yellow-400"
            />
          </div>

          {/* Q-level overrides */}
          <p className="text-xs font-semibold text-gray-600 mb-2">Q-level overrides:</p>
          <div className="max-h-48 overflow-y-auto border border-gray-100 rounded-lg">
            <table className="w-full text-sm">
              <tbody>
                {student.detailed_grading.map((q) => (
                  <tr key={q.question_number} className="border-b border-gray-100 last:border-0">
                    <td className="py-2 pl-3 text-gray-600 w-10">Q{q.question_number}</td>
                    <td className="py-2 text-gray-500">{q.marks_awarded}/{q.max_marks}</td>
                    <td className="py-2 pr-3 text-right">
                      <input
                        type="number"
                        min={0}
                        max={q.max_marks}
                        value={qOverrides[q.question_number] ?? q.marks_awarded}
                        onChange={(e) =>
                          handleQMarkChange(q.question_number, Number(e.target.value))
                        }
                        className="w-12 border border-gray-200 rounded px-2 py-1 text-xs text-center focus:outline-none focus:ring-1 focus:ring-yellow-400"
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Summary */}
          <div className="mt-4 pt-4 border-t border-gray-100 space-y-1.5">
            <div className="flex justify-between text-sm">
              <span className="text-green-600 font-medium">✓ Correct</span>
              <span className="font-semibold">{correctCount}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-red-500 font-medium">✗ Incorrect</span>
              <span className="font-semibold">{incorrectCount}</span>
            </div>
            <div className="flex justify-between text-sm border-t border-gray-100 pt-1.5 mt-1.5">
              <span className="text-gray-600">Total Questions</span>
              <span className="font-semibold">{totalQuestions}</span>
            </div>
          </div>

          {/* Approve */}
          <button
            onClick={() => setApproved(true)}
            className="w-full mt-6 bg-green-500 hover:bg-green-600 text-white font-semibold py-3 rounded-lg flex items-center justify-center gap-2 transition-colors"
          >
            <CheckCircle size={16} />
            Approve
          </button>
          <button className="w-full mt-2 text-sm text-gray-400 hover:text-gray-600 transition-colors py-1">
            Save edits
          </button>
        </div>

        {/* ── Right panel ── */}
        <div className="flex-1 bg-white rounded-xl border border-gray-100 p-6 shadow-sm">
          <p className="font-semibold text-gray-900 mb-4">AI evaluation — review &amp; edit</p>
          <div className="flex flex-col gap-4">
            {student.detailed_grading.map((q) => (
              <QuestionCard
                key={q.question_number}
                q={q}
                overrideMark={qOverrides[q.question_number] ?? q.marks_awarded}
                onMarkChange={handleQMarkChange}
              />
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
