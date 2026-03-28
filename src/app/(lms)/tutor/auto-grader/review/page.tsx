'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ChevronLeft, CheckCircle, Pencil, X, Save } from 'lucide-react';

/* ── Mock question data ─────────────────────────────────── */
type QStatus = 'correct' | 'incorrect';

interface Question {
  id: number;
  aiScore: number;
  maxScore: number;
  question: string;
  studentAnswer: string;
  aiExplanation: string;
  status: QStatus;
}

const initialQuestions: Question[] = [
  {
    id: 1, aiScore: 0, maxScore: 1,
    question: 'Solve: What is the area of a rectangle with length 8 cm and width 5 cm?',
    studentAnswer: 'The area is 40m²',
    aiExplanation: 'The answer is correct but you got the units wrong. It should be in cm² and not m²',
    status: 'incorrect',
  },
  {
    id: 2, aiScore: 1, maxScore: 1,
    question: 'Solve: Find the perimeter of a square with side length 6 m.',
    studentAnswer: 'The perimeter is 24m',
    aiExplanation: 'Perfect! Correct calculation with good knowledge on length of the sides of squares.',
    status: 'correct',
  },
  {
    id: 3, aiScore: 1, maxScore: 1,
    question: 'Find the perimeter of a rectangle with length 10 cm and width 3 cm.',
    studentAnswer: 'The perimeter is 26m',
    aiExplanation: 'Perfect! Correct calculation on all the sides of a rectangle.',
    status: 'correct',
  },
  {
    id: 4, aiScore: 1, maxScore: 1,
    question: 'What do you call a triangle with two equal sides?',
    studentAnswer: 'Isosceles triangle',
    aiExplanation: 'Correct! An isosceles triangle has exactly two equal sides.',
    status: 'correct',
  },
  {
    id: 5, aiScore: 0, maxScore: 1,
    question: 'Find the area of a triangle with base 6 cm and height 4 cm.',
    studentAnswer: '24 cm²',
    aiExplanation: 'Incorrect. Area of triangle = ½ × base × height = ½ × 6 × 4 = 12 cm².',
    status: 'incorrect',
  },
  {
    id: 6, aiScore: 1, maxScore: 1,
    question: 'What is the sum of all angles in a triangle?',
    studentAnswer: '180°',
    aiExplanation: 'Correct! The sum of interior angles of any triangle is always 180°.',
    status: 'correct',
  },
  {
    id: 7, aiScore: 1, maxScore: 1,
    question: 'What is the volume of a cube with side length 3 cm?',
    studentAnswer: '27 cm³',
    aiExplanation: 'Correct! Volume = side³ = 3³ = 27 cm³.',
    status: 'correct',
  },
];

const qOverrideDefaults: Record<number, number> = { 1: 0, 2: 1, 3: 1, 4: 1, 5: 0, 6: 1, 7: 1 };

/* ── Sub-components ─────────────────────────────────────── */

function QuestionCard({ q }: { q: Question }) {
  const [editing, setEditing] = useState(q.id === 1); // Q1 open by default
  const [status, setStatus] = useState<QStatus>(q.status);
  const [marks, setMarks] = useState(q.aiScore);
  const [explanation, setExplanation] = useState(q.aiExplanation);

  const isCorrect = q.status === 'correct';
  const badgeBase = isCorrect
    ? 'bg-green-500 text-white'
    : 'bg-red-500 text-white';
  const cardBase = isCorrect
    ? 'bg-green-50 border-green-200'
    : 'bg-red-50 border-red-200';

  return (
    <div className={`rounded-xl border p-4 ${cardBase}`}>
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${badgeBase}`}>
          Q{q.id} - AI awarded {q.aiScore}/{q.maxScore}
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
              onClick={() => setEditing(false)}
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

      {/* Question */}
      <p className="text-sm font-bold text-gray-900 mb-2">{q.question}</p>

      {/* Student answer */}
      <p className="text-sm mb-3">
        <span className="text-gray-500">Student answer: </span>
        <span className={isCorrect ? 'text-green-600 font-medium' : 'text-red-500 font-medium'}>
          {q.studentAnswer}
        </span>
      </p>

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
            <p className="text-xs text-gray-500 mb-1.5">Marks ({q.maxScore} total)</p>
            <input
              type="number"
              min={0}
              max={q.maxScore}
              value={marks}
              onChange={(e) => setMarks(Number(e.target.value))}
              className="w-20 border border-gray-200 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-yellow-400"
            />
          </div>

          {/* Explanation editable */}
          <div>
            <p className="text-xs text-gray-500 mb-1.5">AI explanation (editable):</p>
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
          <p className="text-xs text-gray-500 mb-1">AI explanation (editable):</p>
          <p className="text-sm text-gray-700">{explanation}</p>
        </div>
      )}
    </div>
  );
}

/* ── Page ────────────────────────────────────────────────── */

export default function AutoGraderReviewPage() {
  const [questions] = useState<Question[]>(initialQuestions);
  const [overrideTotal, setOverrideTotal] = useState(8);
  const [qOverrides, setQOverrides] = useState<Record<number, number>>(qOverrideDefaults);

  const correct = Object.values(qOverrideDefaults).filter((v) => v === 1).length;
  const incorrect = questions.length - correct;

  return (
    <>
      {/* Back nav */}
      <Link
        href="/tutor/auto-grader"
        className="inline-flex items-center gap-1 text-sm text-gray-500 hover:text-gray-800 mb-6 transition-colors"
      >
        <ChevronLeft size={15} />
        Back to Auto Grader
      </Link>

      {/* Page header */}
      <div className="flex items-start justify-between mb-1">
        <h1 className="text-xl font-bold text-gray-900">AI Grader Review — Teacher</h1>
        <span className="text-xs font-semibold bg-yellow-100 text-yellow-700 px-3 py-1 rounded-full mt-1">
          Pending
        </span>
      </div>
      <p className="text-sm text-gray-400 mb-8">
        Sophie Wong: Decimals Worksheet 1 &middot; Awaiting your approval
      </p>

      {/* Two-column layout */}
      <div className="flex gap-8 items-start">

        {/* ── Left panel ── */}
        <div className="w-[380px] flex-shrink-0 bg-white rounded-xl border border-gray-100 p-6 shadow-sm">

          {/* Score */}
          <p className="text-sm text-gray-400 text-center mb-1">AI score</p>
          <div className="flex items-end justify-center gap-2 mb-1">
            <span className="text-5xl font-bold text-[#FFC107]">8</span>
            <span className="text-2xl text-gray-400 mb-1">/ 10</span>
          </div>
          <p className="text-sm text-gray-400 text-center mb-6">AI confidence: 77%</p>

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
                {questions.map((q) => (
                  <tr key={q.id} className="border-b border-gray-100 last:border-0">
                    <td className="py-2 pl-3 text-gray-600 w-8">Q{q.id}</td>
                    <td className="py-2 text-gray-500">{q.aiScore}/{q.maxScore}</td>
                    <td className="py-2 pr-3 text-right">
                      <input
                        type="number"
                        min={0}
                        max={q.maxScore}
                        value={qOverrides[q.id] ?? q.aiScore}
                        onChange={(e) =>
                          setQOverrides((prev) => ({ ...prev, [q.id]: Number(e.target.value) }))
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
              <span className="font-semibold">{correct}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-red-500 font-medium">✗ Incorrect</span>
              <span className="font-semibold">{incorrect}</span>
            </div>
            <div className="flex justify-between text-sm border-t border-gray-100 pt-1.5 mt-1.5">
              <span className="text-gray-600">Total Questions</span>
              <span className="font-semibold">{questions.length}</span>
            </div>
          </div>

          {/* Approve */}
          <button className="w-full mt-6 bg-green-500 hover:bg-green-600 text-white font-semibold py-3 rounded-lg flex items-center justify-center gap-2 transition-colors">
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
            {questions.map((q) => (
              <QuestionCard key={q.id} q={q} />
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
