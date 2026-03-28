'use client';

import { useState } from 'react';
import { Search, Download, BookOpen, Newspaper, FileText } from 'lucide-react';
import { materials } from '@/lib/mockData';

const subjectColors: Record<string, string> = {
  Mathematics: 'bg-blue-100 text-blue-700',
  Science: 'bg-green-100 text-green-700',
  English: 'bg-purple-100 text-purple-700',
};

const typeIcons: Record<string, React.ReactNode> = {
  notes: <BookOpen size={20} className="text-yellow-600" />,
  'past-paper': <Newspaper size={20} className="text-orange-500" />,
  video: <FileText size={20} className="text-blue-500" />,
};

const typeLabels: Record<string, string> = {
  notes: 'Study Notes',
  'past-paper': 'Past Year Paper',
  video: 'Video',
};

export default function MaterialsPage() {
  const [activeSubject, setActiveSubject] = useState<string>('All');
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState('All Types');
  const [topicFilter, setTopicFilter] = useState('All Topics');

  const subjectTabs = ['All', 'Mathematics', 'Science', 'English'];
  const subjectCounts: Record<string, number> = {
    All: materials.length,
    Mathematics: materials.filter((m) => m.subject === 'Mathematics').length,
    Science: materials.filter((m) => m.subject === 'Science').length,
    English: materials.filter((m) => m.subject === 'English').length,
  };

  const filtered = materials.filter((m) => {
    const matchSubject = activeSubject === 'All' || m.subject === activeSubject;
    const matchSearch = !search || m.name.toLowerCase().includes(search.toLowerCase()) || m.description.toLowerCase().includes(search.toLowerCase());
    const matchType = typeFilter === 'All Types' || m.type === typeFilter;
    const matchTopic = topicFilter === 'All Topics' || m.topic === topicFilter;
    return matchSubject && matchSearch && matchType && matchTopic;
  });

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Learning Materials</h1>
          <p className="text-gray-500 text-sm mt-1">Access all your study resources</p>
        </div>
      </div>

      {/* Subject Tabs */}
      <div className="flex gap-1 bg-gray-100 rounded-lg p-1 w-fit mb-6">
        {subjectTabs.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveSubject(tab)}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-semibold transition-colors ${
              activeSubject === tab ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            {tab}
            <span className={`text-xs px-1.5 py-0.5 rounded-full ${activeSubject === tab ? 'bg-yellow-100 text-yellow-700' : 'bg-gray-200 text-gray-500'}`}>
              {subjectCounts[tab]}
            </span>
          </button>
        ))}
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3 mb-6">
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
          <option value="notes">Study Notes</option>
          <option value="past-paper">Past Year Paper</option>
          <option value="video">Video</option>
        </select>
        <select
          value={topicFilter}
          onChange={(e) => setTopicFilter(e.target.value)}
          className="border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-yellow-400 bg-white text-gray-700"
        >
          <option>All Topics</option>
          <option>Algebra</option>
          <option>Geometry</option>
          <option>Fractions</option>
          <option>Forces and Motion</option>
          <option>Cell Biology</option>
          <option>Vocabulary</option>
        </select>
      </div>

      {/* Materials List */}
      <div className="space-y-3">
        {filtered.map((mat) => (
          <div key={mat.id} className="bg-white rounded-xl p-5 shadow-sm border border-gray-100 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 bg-gray-50 rounded-lg flex items-center justify-center flex-shrink-0">
                {typeIcons[mat.type] || <FileText size={20} className="text-gray-400" />}
              </div>
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="font-semibold text-gray-900">{mat.name}</h3>
                  <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${subjectColors[mat.subject] || 'bg-gray-100 text-gray-600'}`}>
                    {mat.subject}
                  </span>
                  <span className="text-xs px-2 py-0.5 rounded-full bg-gray-100 text-gray-600 font-medium">
                    {typeLabels[mat.type]}
                  </span>
                </div>
                <p className="text-sm text-gray-500">{mat.description}</p>
                <p className="text-xs text-gray-400 mt-0.5">By {mat.uploadedBy} • {mat.date} • {mat.size}</p>
              </div>
            </div>
            <button className="flex items-center gap-2 bg-yellow-400 hover:bg-yellow-500 text-gray-900 font-semibold px-4 py-2 rounded-lg text-sm transition-colors flex-shrink-0">
              <Download size={15} />
              Download
            </button>
          </div>
        ))}
        {filtered.length === 0 && (
          <div className="bg-white rounded-xl p-10 text-center text-gray-500 border border-gray-100">
            No materials found matching your filters.
          </div>
        )}
      </div>
    </div>
  );
}
