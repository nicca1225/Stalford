'use client';

import { useState } from 'react';
import {
  Play, FileText, ClipboardList, BookOpen, Newspaper,
  Download, Pencil, Trash2, Upload, Search,
} from 'lucide-react';
import PrimaryButton from '@/components/ui/PrimaryButton';

type MaterialType = 'video' | 'quiz' | 'worksheet' | 'notes' | 'past-paper';

interface Material {
  id: string;
  title: string;
  type: MaterialType;
  topic: string;
  class: string;
  meta: string; // duration or file size
}

const materials: Material[] = [
  { id: '1', title: 'Introduction to Fractions', type: 'video',      topic: 'Fractions',    class: 'Primary 5', meta: '1h 18:42' },
  { id: '2', title: 'Fractions Practice Quiz',   type: 'quiz',       topic: 'Fractions',    class: 'Primary 5', meta: 'PDF' },
  { id: '3', title: 'Decimals Worksheet 1',       type: 'worksheet',  topic: 'Decimals',     class: 'Primary 5', meta: 'PDF' },
  { id: '4', title: 'Algebra Study Notes',        type: 'notes',      topic: 'Algebra',      class: 'Primary 5', meta: 'PDF' },
  { id: '5', title: '2025 Mid-Year Exam Paper',   type: 'past-paper', topic: 'Mixed Topics', class: 'Primary 5', meta: 'PDF' },
];

const typeConfig: Record<MaterialType, { label: string; badge: string; icon: React.ReactNode }> = {
  'video':      { label: 'Video Lesson', badge: 'bg-blue-100 text-blue-700',   icon: <Play size={18} className="text-blue-500" /> },
  'quiz':       { label: 'Quiz',         badge: 'bg-orange-100 text-orange-700', icon: <ClipboardList size={18} className="text-orange-500" /> },
  'worksheet':  { label: 'Worksheet',    badge: 'bg-yellow-100 text-yellow-700', icon: <FileText size={18} className="text-yellow-600" /> },
  'notes':      { label: 'Notes',        badge: 'bg-purple-100 text-purple-700', icon: <BookOpen size={18} className="text-purple-500" /> },
  'past-paper': { label: 'Past Year Paper', badge: 'bg-red-100 text-red-600',  icon: <Newspaper size={18} className="text-red-500" /> },
};

const summaryCounts: { type: MaterialType; label: string }[] = [
  { type: 'video',      label: 'Video Lessons' },
  { type: 'quiz',       label: 'Quizzes' },
  { type: 'worksheet',  label: 'Worksheets' },
  { type: 'notes',      label: 'Notes' },
  { type: 'past-paper', label: 'Past Papers' },
];

export default function TutorMaterialsPage() {
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState('All Types');
  const [topicFilter, setTopicFilter] = useState('All Topics');

  const filtered = materials.filter((m) => {
    const matchSearch = !search || m.title.toLowerCase().includes(search.toLowerCase());
    const matchType = typeFilter === 'All Types' || typeConfig[m.type].label === typeFilter;
    const matchTopic = topicFilter === 'All Topics' || m.topic === topicFilter;
    return matchSearch && matchType && matchTopic;
  });

  const countByType = (t: MaterialType) => materials.filter((m) => m.type === t).length;

  return (
    <>
      {/* Header */}
      <div className="flex items-start justify-between mb-1">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Materials</h1>
          <p className="text-gray-500 text-sm mt-1">Manage learning resources and course content.</p>
        </div>
        <PrimaryButton className="flex items-center gap-2 text-sm">
          <Upload size={15} />
          Upload Material
        </PrimaryButton>
      </div>

      {/* Summary icons row */}
      <div className="flex items-center gap-8 border-b border-gray-100 py-5 mb-6">
        {summaryCounts.map(({ type, label }) => (
          <div key={type} className="flex items-center gap-2">
            {typeConfig[type].icon}
            <div>
              <p className="text-base font-bold text-gray-900 leading-none">{countByType(type)}</p>
              <p className="text-[11px] text-gray-400 mt-0.5">{label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3 mb-6">
        <div className="relative flex-1 min-w-48">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search materials..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-yellow-400 bg-white"
          />
        </div>
        <select
          value={typeFilter}
          onChange={(e) => setTypeFilter(e.target.value)}
          className="border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-yellow-400 bg-white text-gray-700"
        >
          <option>All Types</option>
          {Object.values(typeConfig).map((c) => (
            <option key={c.label}>{c.label}</option>
          ))}
        </select>
        <select
          value={topicFilter}
          onChange={(e) => setTopicFilter(e.target.value)}
          className="border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-yellow-400 bg-white text-gray-700"
        >
          <option>All Topics</option>
          {['Fractions', 'Decimals', 'Algebra', 'Mixed Topics'].map((t) => (
            <option key={t}>{t}</option>
          ))}
        </select>
      </div>

      {/* Materials list */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm divide-y divide-gray-100">
        {filtered.map((m) => {
          const cfg = typeConfig[m.type];
          return (
            <div key={m.id} className="flex items-center gap-4 px-5 py-4">
              {/* Type icon */}
              <div className="w-9 h-9 rounded-lg bg-gray-50 flex items-center justify-center flex-shrink-0">
                {cfg.icon}
              </div>

              {/* Info */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="font-semibold text-sm text-gray-900">{m.title}</span>
                  <span className={`text-[11px] font-semibold px-2 py-0.5 rounded-full ${cfg.badge}`}>
                    {cfg.label}
                  </span>
                </div>
                <p className="text-xs text-gray-400 mt-0.5">
                  {m.topic} &bull; {m.class} &bull; {m.meta}
                </p>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-2 flex-shrink-0">
                <button className="text-xs border border-gray-200 rounded-lg px-3 py-1.5 text-gray-600 hover:bg-gray-50 transition-colors font-medium">
                  {m.type === 'video' ? 'Play' : 'View'}
                </button>
                <button className="p-1.5 text-gray-400 hover:text-gray-700 transition-colors" title="Download">
                  <Download size={15} />
                </button>
                <button className="p-1.5 text-gray-400 hover:text-gray-700 transition-colors" title="Edit">
                  <Pencil size={15} />
                </button>
                <button className="p-1.5 text-red-400 hover:text-red-600 transition-colors" title="Delete">
                  <Trash2 size={15} />
                </button>
              </div>
            </div>
          );
        })}

        {filtered.length === 0 && (
          <div className="py-12 text-center text-sm text-gray-400">
            No materials match your filters.
          </div>
        )}
      </div>
    </>
  );
}
