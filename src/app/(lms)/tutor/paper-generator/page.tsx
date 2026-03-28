'use client';

import { useState } from 'react';
import { FileEdit, Sparkles, Download, CheckCircle, ChevronDown } from 'lucide-react';
import { classes } from '@/lib/mockData';

const topicsWithPerf = [
  { id: 'fractions', name: 'Fractions', classAvg: 82, needsFocus: true },
  { id: 'decimals', name: 'Decimals', classAvg: 84, needsFocus: false },
  { id: 'algebra', name: 'Algebra', classAvg: 85, needsFocus: false },
  { id: 'geometry', name: 'Geometry', classAvg: 83, needsFocus: true },
  { id: 'word-problems', name: 'Word Problems', classAvg: 82, needsFocus: true },
];

const sampleQuestions = [
  {
    q: 1,
    type: 'MCQ',
    text: 'A ribbon is 3/4 m long. If you cut off 1/4 m, what fraction of the original ribbon remains?',
    difficulty: 'Medium',
    topic: 'Fractions',
  },
  {
    q: 2,
    type: 'Short Answer',
    text: 'John has 2.5 kg of flour. He uses 0.75 kg to bake a cake. How much flour does he have left? Round your answer to 2 decimal places.',
    difficulty: 'Easy',
    topic: 'Word Problems',
  },
];

export default function PaperGeneratorPage() {
  const [selectedClass, setSelectedClass] = useState('');
  const [selectedTopics, setSelectedTopics] = useState<string[]>([]);
  const [numQuestions, setNumQuestions] = useState('10');
  const [difficulty, setDifficulty] = useState('Mixed Recommended');
  const [instructions, setInstructions] = useState('');
  const [generated, setGenerated] = useState(false);
  const [generating, setGenerating] = useState(false);

  const toggleTopic = (id: string) => {
    setSelectedTopics((prev) =>
      prev.includes(id) ? prev.filter((t) => t !== id) : [...prev, id]
    );
  };

  const handleAISuggest = () => {
    setSelectedTopics(topicsWithPerf.filter((t) => t.needsFocus).map((t) => t.id));
  };

  const handleGenerate = () => {
    if (!selectedClass) return;
    setGenerating(true);
    setTimeout(() => {
      setGenerating(false);
      setGenerated(true);
    }, 1500);
  };

  const selectedTopicNames = topicsWithPerf
    .filter((t) => selectedTopics.includes(t.id))
    .map((t) => t.name);

  return (
    <div className="p-8">
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-1">
          <FileEdit size={24} className="text-yellow-500" />
          <h1 className="text-2xl font-bold text-gray-900">AI Practice Paper Generator</h1>
        </div>
        <p className="text-gray-500 text-sm">Generate customized practice papers based on class performance data</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left: Configuration */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <h2 className="font-bold text-gray-900 mb-5">Configure Practice Paper</h2>

          <div className="space-y-4">
            {/* Select Class */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">Select Class</label>
              <div className="relative">
                <select
                  value={selectedClass}
                  onChange={(e) => { setSelectedClass(e.target.value); setGenerated(false); }}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm appearance-none focus:outline-none focus:ring-2 focus:ring-yellow-400 bg-white text-gray-700"
                >
                  <option value="">Choose a class...</option>
                  {classes.map((c) => (
                    <option key={c.id} value={c.id}>{c.name} — {c.subject}</option>
                  ))}
                </select>
                <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
              </div>
              {selectedClass && (
                <p className="text-xs text-gray-500 mt-1">
                  {classes.find((c) => c.id === selectedClass)?.studentCount} students in this class
                </p>
              )}
            </div>

            {/* Subject (auto-filled) */}
            {selectedClass && (
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Subject</label>
                <input
                  readOnly
                  value={classes.find((c) => c.id === selectedClass)?.subject || ''}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm bg-gray-50 text-gray-600 cursor-not-allowed"
                />
              </div>
            )}

            {/* Topics */}
            {selectedClass && (
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-sm font-semibold text-gray-700">Topics (AI Recommended)</label>
                  <button
                    onClick={handleAISuggest}
                    className="flex items-center gap-1 text-xs font-semibold text-yellow-700 bg-yellow-100 hover:bg-yellow-200 px-2.5 py-1.5 rounded-lg transition-colors"
                  >
                    <Sparkles size={12} />
                    AI Suggested
                  </button>
                </div>
                <div className="space-y-2">
                  {topicsWithPerf.map((topic) => (
                    <label key={topic.id} className="flex items-center justify-between bg-gray-50 rounded-lg px-3 py-2.5 cursor-pointer hover:bg-gray-100">
                      <div className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          checked={selectedTopics.includes(topic.id)}
                          onChange={() => toggleTopic(topic.id)}
                          className="rounded border-gray-300 text-yellow-400 focus:ring-yellow-400"
                        />
                        <span className="text-sm text-gray-700">{topic.name}</span>
                        {topic.needsFocus && (
                          <span className="text-xs bg-orange-100 text-orange-600 px-2 py-0.5 rounded-full font-medium">Needs focus</span>
                        )}
                      </div>
                      <span className="text-xs text-gray-500">Class avg: {topic.classAvg}%</span>
                    </label>
                  ))}
                </div>
              </div>
            )}

            {/* Number of Questions */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">Number of Questions</label>
              <div className="relative">
                <select
                  value={numQuestions}
                  onChange={(e) => setNumQuestions(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm appearance-none focus:outline-none focus:ring-2 focus:ring-yellow-400 bg-white text-gray-700"
                >
                  <option value="5">5 questions — Estimated time: 15 minutes</option>
                  <option value="10">10 questions — Estimated time: 30 minutes</option>
                  <option value="15">15 questions — Estimated time: 45 minutes</option>
                  <option value="20">20 questions — Estimated time: 60 minutes</option>
                </select>
                <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
              </div>
            </div>

            {/* Difficulty */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">Difficulty Distribution</label>
              <div className="relative">
                <select
                  value={difficulty}
                  onChange={(e) => setDifficulty(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm appearance-none focus:outline-none focus:ring-2 focus:ring-yellow-400 bg-white text-gray-700"
                >
                  <option>Mixed Recommended</option>
                  <option>Easy (70%) / Hard (30%)</option>
                  <option>Balanced (50/50)</option>
                  <option>Hard (70%) / Easy (30%)</option>
                </select>
                <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
              </div>
            </div>

            {/* Additional Instructions */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">Additional Instructions (Optional)</label>
              <textarea
                value={instructions}
                onChange={(e) => setInstructions(e.target.value)}
                rows={3}
                placeholder="E.g., Focus on real-world word problems, include diagrams..."
                className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-yellow-400 resize-none"
              />
            </div>

            <button
              onClick={handleGenerate}
              disabled={!selectedClass || generating}
              className="w-full bg-yellow-400 hover:bg-yellow-500 disabled:opacity-50 disabled:cursor-not-allowed text-gray-900 font-semibold py-3 rounded-lg transition-colors flex items-center justify-center gap-2"
            >
              {generating ? (
                <>
                  <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
                  </svg>
                  Generating...
                </>
              ) : (
                <>
                  <Sparkles size={16} />
                  Generate Practice Paper
                </>
              )}
            </button>
          </div>
        </div>

        {/* Right: Preview */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <h2 className="font-bold text-gray-900 mb-5">Generated Paper Preview</h2>

          {!generated ? (
            <div className="flex flex-col items-center justify-center h-80 text-center">
              <div className="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center mb-4">
                <FileEdit size={28} className="text-gray-400" />
              </div>
              <p className="text-gray-500 font-semibold">Configure and generate a practice paper</p>
              <p className="text-gray-400 text-sm mt-1">Select a class and topics, then click generate</p>
            </div>
          ) : (
            <div>
              <div className="bg-green-50 border border-green-200 rounded-lg p-3 flex items-center gap-2 mb-5">
                <CheckCircle size={16} className="text-green-500" />
                <p className="text-sm text-green-700 font-semibold">Practice paper generated successfully!</p>
              </div>

              <div className="space-y-3 mb-5">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Title</span>
                  <span className="font-semibold text-gray-900">
                    {classes.find((c) => c.id === selectedClass)?.name} Practice Paper
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Questions</span>
                  <span className="font-semibold text-gray-900">{numQuestions} questions</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Estimated Time</span>
                  <span className="font-semibold text-gray-900">{Number(numQuestions) * 3} minutes</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Difficulty Level</span>
                  <span className="font-semibold text-gray-900">{difficulty}</span>
                </div>
                <div>
                  <p className="text-sm text-gray-500 mb-2">Topics Covered</p>
                  <div className="flex flex-wrap gap-2">
                    {(selectedTopicNames.length > 0 ? selectedTopicNames : ['All Topics']).map((t) => (
                      <span key={t} className="px-2 py-1 bg-yellow-100 text-yellow-700 text-xs font-semibold rounded-full">{t}</span>
                    ))}
                  </div>
                </div>
              </div>

              <div className="border-t border-gray-100 pt-4 mb-5">
                <p className="text-sm font-semibold text-gray-700 mb-3">Sample Questions Preview</p>
                <div className="space-y-3">
                  {sampleQuestions.map((sq) => (
                    <div key={sq.q} className="bg-gray-50 rounded-lg p-3">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-xs font-bold text-gray-700">Q{sq.q}</span>
                        <span className="text-xs bg-blue-100 text-blue-700 px-1.5 py-0.5 rounded font-medium">{sq.type}</span>
                        <span className="text-xs bg-gray-200 text-gray-600 px-1.5 py-0.5 rounded font-medium">{sq.difficulty}</span>
                        <span className="text-xs bg-yellow-100 text-yellow-700 px-1.5 py-0.5 rounded font-medium">{sq.topic}</span>
                      </div>
                      <p className="text-sm text-gray-700">{sq.text}</p>
                    </div>
                  ))}
                </div>
              </div>

              <button className="w-full bg-yellow-400 hover:bg-yellow-500 text-gray-900 font-semibold py-3 rounded-lg transition-colors flex items-center justify-center gap-2 mb-2">
                <Download size={16} />
                Download Practice Paper (PDF)
              </button>
              <button className="w-full text-center text-sm text-yellow-600 hover:underline font-medium">
                Download Answer Sheet
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
