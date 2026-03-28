'use client';

import { useState } from 'react';
import { Upload, Search, Play, Eye, Download, Edit, Trash2, Video, FileText, ClipboardList, BookOpen, Newspaper } from 'lucide-react';
import { tutorMaterials } from '@/lib/mockData';

const typeMeta: Record<string, { label: string; color: string; icon: React.ReactNode }> = {
  video: { label: 'Video Lesson', color: 'bg-blue-100 text-blue-700', icon: <Video size={18} className="text-blue-500" /> },
  quiz: { label: 'Quiz', color: 'bg-purple-100 text-purple-700', icon: <ClipboardList size={18} className="text-purple-500" /> },
  worksheet: { label: 'Worksheet', color: 'bg-green-100 text-green-700', icon: <FileText size={18} className="text-green-500" /> },
  notes: { label: 'Notes', color: 'bg-yellow-100 text-yellow-700', icon: <BookOpen size={18} className="text-yellow-600" /> },
  'past-paper': { label: 'Past Year Paper', color: 'bg-orange-100 text-orange-700', icon: <Newspaper size={18} className="text-orange-500" /> },
};

const typeStats = [
  { label: 'Video Lessons', count: 2, icon: <Video size={16} className="text-blue-500" /> },
  { label: 'Quizzes', count: 1, icon: <ClipboardList size={16} className="text-purple-500" /> },
  { label: 'Worksheets', count: 1, icon: <FileText size={16} className="text-green-500" /> },
  { label: 'Notes', count: 1, icon: <BookOpen size={16} className="text-yellow-600" /> },
  { label: 'Past Papers', count: 1, icon: <Newspaper size={16} className="text-orange-500" /> },
];

export default function TutorMaterialsPage() {
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState('All Types');
  const [topicFilter, setTopicFilter] = useState('All Topics');

  const filtered = tutorMaterials.filter((m) => {
    const matchSearch = !search || m.name.toLowerCase().includes(search.toLowerCase());
    const matchType = typeFilter === 'All Types' || m.type === typeFilter;
    const matchTopic = topicFilter === 'All Topics' || m.topic === topicFilter;
    return matchSearch && matchType && matchTopic;
  });

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Materials</h1>
          <p className="text-gray-500 text-sm mt-1">Manage and upload learning resources</p>
        </div>
        <button className="flex items-center gap-2 bg-yellow-400 hover:bg-yellow-500 text-gray-900 font-semibold px-4 py-2.5 rounded-lg text-sm transition-colors">
          <Upload size={16} />
          Upload Material
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mb-6">
        {typeStats.map((stat) => (
          <div key={stat.label} className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 text-center">
            <div className="flex justify-center mb-1">{stat.icon}</div>
            <p className="text-xl font-bold text-gray-900">{stat.count}</p>
            <p className="text-xs text-gray-500">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3 mb-5">
        <div className="relative flex-1 min-w-48">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search materials..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-yellow-400 bg-white"
          />
        </div>
        <select
          value={typeFilter}
          onChange={(e) => setTypeFilter(e.target.value)}
          className="border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-yellow-400 bg-white text-gray-700"
        >
          <option>All Types</option>
          <option value="video">Video Lesson</option>
          <option value="quiz">Quiz</option>
          <option value="worksheet">Worksheet</option>
          <option value="notes">Notes</option>
          <option value="past-paper">Past Year Paper</option>
        </select>
        <select
          value={topicFilter}
          onChange={(e) => setTopicFilter(e.target.value)}
          className="border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-yellow-400 bg-white text-gray-700"
        >
          <option>All Topics</option>
          <option>Fractions</option>
          <option>Decimals</option>
          <option>Algebra</option>
          <option>All Topics</option>
        </select>
      </div>

      {/* Materials List */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-4 border-b border-gray-100 text-sm font-semibold text-gray-500">
          All Materials ({filtered.length})
        </div>
        <div className="divide-y divide-gray-50">
          {filtered.map((mat) => {
            const meta = typeMeta[mat.type];
            return (
              <div key={mat.id} className="flex items-center justify-between p-4 hover:bg-gray-50 transition-colors">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                    {meta?.icon}
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-0.5">
                      <p className="font-semibold text-gray-900">{mat.name}</p>
                      <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${meta?.color}`}>
                        {meta?.label}
                      </span>
                    </div>
                    <p className="text-xs text-gray-500">{mat.description}</p>
                    <p className="text-xs text-gray-400 mt-0.5">{mat.date} • {mat.size}</p>
                  </div>
                </div>

                <div className="flex items-center gap-1">
                  {mat.type === 'video' ? (
                    <button className="p-2 text-gray-400 hover:text-blue-500 hover:bg-blue-50 rounded-lg transition-colors" title="Play">
                      <Play size={16} />
                    </button>
                  ) : (
                    <button className="p-2 text-gray-400 hover:text-green-500 hover:bg-green-50 rounded-lg transition-colors" title="View">
                      <Eye size={16} />
                    </button>
                  )}
                  <button className="p-2 text-gray-400 hover:text-yellow-600 hover:bg-yellow-50 rounded-lg transition-colors" title="Download">
                    <Download size={16} />
                  </button>
                  <button className="p-2 text-gray-400 hover:text-blue-500 hover:bg-blue-50 rounded-lg transition-colors" title="Edit">
                    <Edit size={16} />
                  </button>
                  <button className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors" title="Delete">
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
