'use client';

import { useState } from 'react';
import { Sparkles, Download, CheckCircle, FileText } from 'lucide-react';
import PrimaryButton from '@/components/ui/PrimaryButton';

type ClassOption = '' | 'p5-math-a' | 'p5-math-b';

const topicsData = [
  { id: 'algebra',       label: 'Algebra',       avg: 73, defaultChecked: true },
  { id: 'word-problems', label: 'Word Problems',  avg: 73, defaultChecked: true },
  { id: 'fractions',     label: 'Fractions',      avg: 79, defaultChecked: false },
];

export default function PaperGeneratorPage() {
  const [selectedClass, setSelectedClass] = useState<ClassOption>('');
  const [checkedTopics, setCheckedTopics] = useState<Record<string, boolean>>({
    algebra: true,
    'word-problems': true,
    fractions: false,
  });
  const [numQuestions, setNumQuestions] = useState('10');
  const [difficulty, setDifficulty] = useState('Mixed (Recommended)');
  const [instructions, setInstructions] = useState('');
  const [generated, setGenerated] = useState(false);
  const [generating, setGenerating] = useState(false);

  const toggleTopic = (id: string) =>
    setCheckedTopics((prev) => ({ ...prev, [id]: !prev[id] }));

  const handleGenerate = () => {
    if (!selectedClass) return;
    setGenerating(true);
    setTimeout(() => { setGenerating(false); setGenerated(true); }, 1200);
  };

  const selectedTopicLabels = topicsData
    .filter((t) => checkedTopics[t.id])
    .map((t) => t.label);

  return (
    <>
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">AI Practice Paper Generator</h1>
        <p className="text-gray-500 text-sm mt-1">
          Generate customized practice papers based on student performance data.
        </p>
      </div>

      <div className="flex gap-8 items-start">

        {/* ── LEFT: Configure ── */}
        <div className="w-[480px] flex-shrink-0 bg-white rounded-xl border border-gray-100 p-6 shadow-sm">
          <div className="flex items-center gap-2 mb-6">
            <Sparkles size={16} className="text-yellow-500" />
            <span className="font-semibold text-gray-900">Configure Practice Paper</span>
          </div>

          <div className="flex flex-col gap-5">

            {/* Select Class */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Select Class</label>
              <select
                value={selectedClass}
                onChange={(e) => { setSelectedClass(e.target.value as ClassOption); setGenerated(false); }}
                className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-yellow-400 bg-white text-gray-700"
              >
                <option value="">Choose a class</option>
                <option value="p5-math-a">P5-Math-A - Mathematics</option>
                <option value="p5-math-b">P5-Math-B - Mathematics</option>
              </select>
              {selectedClass === 'p5-math-a' && (
                <p className="text-xs text-gray-400 mt-1">3 students in this class</p>
              )}
              {selectedClass === 'p5-math-b' && (
                <p className="text-xs text-gray-400 mt-1">3 students in this class</p>
              )}
            </div>

            {/* Subject (auto-filled) */}
            {selectedClass && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Subject</label>
                <input
                  type="text"
                  value="Mathematics"
                  disabled
                  className="w-full border border-gray-100 rounded-lg px-3 py-2.5 text-sm bg-gray-50 text-gray-500 cursor-not-allowed"
                />
              </div>
            )}

            {/* Topics */}
            {selectedClass && (
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-sm font-medium text-gray-700">Topics (AI Recommended)</label>
                  <span className="flex items-center gap-1 text-[11px] font-semibold bg-yellow-100 text-yellow-700 px-2 py-0.5 rounded-full">
                    <Sparkles size={10} /> AI Suggested
                  </span>
                </div>
                <div className="border border-gray-100 rounded-lg overflow-hidden">
                  {topicsData.map((t, i) => (
                    <label
                      key={t.id}
                      className={`flex items-center gap-3 px-4 py-3 cursor-pointer hover:bg-gray-50 transition-colors
                        ${i < topicsData.length - 1 ? 'border-b border-gray-100' : ''}`}
                    >
                      <input
                        type="checkbox"
                        checked={checkedTopics[t.id]}
                        onChange={() => toggleTopic(t.id)}
                        className="accent-yellow-400 w-4 h-4"
                      />
                      <span className="flex-1 text-sm text-gray-800">{t.label}</span>
                      <span className="text-xs text-gray-400">Class avg: {t.avg}%</span>
                      <span className="text-[11px] font-semibold bg-orange-100 text-orange-600 px-2 py-0.5 rounded-full">
                        Needs focus
                      </span>
                    </label>
                  ))}
                </div>
                <p className="text-[11px] text-gray-400 italic mt-1.5">
                  ⓘ Topics selected based on lowest class confidence levels
                </p>
              </div>
            )}

            {/* Number of Questions */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Number of Questions</label>
              <select
                value={numQuestions}
                onChange={(e) => setNumQuestions(e.target.value)}
                className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-yellow-400 bg-white text-gray-700"
              >
                {['5', '10', '15', '20'].map((n) => (
                  <option key={n} value={n}>{n} questions</option>
                ))}
              </select>
              <p className="text-xs text-gray-400 mt-1">
                Estimated time: {Number(numQuestions) * 3} minutes
              </p>
            </div>

            {/* Difficulty */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Difficulty Distribution</label>
              <select
                value={difficulty}
                onChange={(e) => setDifficulty(e.target.value)}
                className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-yellow-400 bg-white text-gray-700"
              >
                <option>Mixed (Recommended)</option>
                <option>Easy</option>
                <option>Medium</option>
                <option>Hard</option>
              </select>
            </div>

            {/* Additional Instructions */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Additional Instructions <span className="text-gray-400 font-normal">(Optional)</span>
              </label>
              <textarea
                value={instructions}
                onChange={(e) => setInstructions(e.target.value)}
                rows={3}
                placeholder="E.g., Focus on multi-step problems, include real-world scenarios..."
                className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-yellow-400 resize-none placeholder:text-gray-400"
              />
            </div>

            {/* Generate button */}
            <PrimaryButton
              fullWidth
              className="flex items-center justify-center gap-2 py-3"
              onClick={handleGenerate}
              disabled={!selectedClass || generating}
            >
              <Sparkles size={15} />
              {generating ? 'Generating...' : 'Generate Practice Paper'}
            </PrimaryButton>
          </div>
        </div>

        {/* ── RIGHT: Preview ── */}
        <div className="flex-1 bg-white rounded-xl border border-gray-100 p-6 shadow-sm min-h-[400px]">

          {!generated ? (
            /* Empty state */
            <div className="h-full flex flex-col items-center justify-center text-center py-20">
              <FileText size={48} className="text-gray-200 mb-4" />
              <p className="text-gray-400 font-medium">Configure and generate a practice paper</p>
              <p className="text-xs text-gray-300 mt-1">Select a class and topics to get started</p>
            </div>
          ) : (
            /* Generated state */
            <div className="flex flex-col gap-5">
              {/* Success banner */}
              <div className="bg-green-50 border border-green-200 rounded-lg p-3 flex items-start gap-2">
                <CheckCircle size={16} className="text-green-500 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-sm font-bold text-green-700">Practice Paper Generated Successfully!</p>
                  <p className="text-xs text-gray-500 mt-0.5">Your customized practice paper is ready for download.</p>
                </div>
              </div>

              {/* Details */}
              <div>
                <p className="font-semibold text-gray-900 mb-3">
                  Mathematics Practice Paper — 3/20/2026
                </p>
                <div className="grid grid-cols-2 gap-y-2 text-sm mb-3">
                  <div>
                    <span className="text-gray-400 text-xs">Questions</span>
                    <p className="font-semibold">{numQuestions}</p>
                  </div>
                  <div>
                    <span className="text-gray-400 text-xs">Estimated Time</span>
                    <p className="font-semibold">{Number(numQuestions) * 3} minutes</p>
                  </div>
                </div>
                <div className="mb-3">
                  <span className="text-xs text-gray-400 block mb-1.5">Topics Covered</span>
                  <div className="flex flex-wrap gap-2">
                    {selectedTopicLabels.map((t) => (
                      <span key={t} className="text-xs font-semibold bg-yellow-100 text-yellow-800 px-2.5 py-1 rounded-full">
                        {t}
                      </span>
                    ))}
                  </div>
                </div>
                <div>
                  <span className="text-xs text-gray-400">Difficulty Level</span>
                  <p className="text-sm font-semibold">{difficulty.replace(' (Recommended)', '')}</p>
                </div>
              </div>

              {/* Sample questions */}
              <div className="bg-gray-50 rounded-lg p-4">
                <p className="text-[11px] text-gray-400 mb-1">Algebra</p>
                <p className="text-sm text-gray-800 mb-3">
                  1. Solve for x: 3x + 7 = 22. Show all working steps.
                </p>
                <p className="text-[11px] text-gray-400 mb-1">Algebra</p>
                <p className="text-sm text-gray-800 mb-3">
                  2. If y = 2x − 5 and x = 8, what is the value of y?
                </p>
                <p className="text-xs text-gray-400 italic">... and {Number(numQuestions) - 2} more questions</p>
              </div>

              {/* Download buttons */}
              <PrimaryButton fullWidth className="flex items-center justify-center gap-2 py-3">
                <Download size={15} />
                Download Practice Paper (PDF)
              </PrimaryButton>
              <button className="text-sm text-gray-500 hover:text-gray-700 text-center transition-colors">
                Download Answer Sheet
              </button>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
