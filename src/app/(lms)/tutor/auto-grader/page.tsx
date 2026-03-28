'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Bot, Clock, CheckCircle, XCircle, AlertCircle } from 'lucide-react';
import { autoGraderSubmissions } from '@/lib/mockData';

function StatusBadge({ status }: { status: string }) {
  if (status === 'pending-review') return <span className="px-2 py-1 bg-yellow-100 text-yellow-700 text-xs font-semibold rounded-full">Pending Review</span>;
  if (status === 'processing') return (
    <span className="flex items-center gap-1 px-2 py-1 bg-blue-100 text-blue-700 text-xs font-semibold rounded-full">
      <svg className="w-3 h-3 animate-spin" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/></svg>
      Processing
    </span>
  );
  if (status === 'approved') return <span className="px-2 py-1 bg-green-100 text-green-700 text-xs font-semibold rounded-full">Approved</span>;
  return <span className="px-2 py-1 bg-red-100 text-red-700 text-xs font-semibold rounded-full">Not Submitted</span>;
}

const tabs = [
  { key: 'pending-review', label: 'Review', icon: Clock },
  { key: 'processing', label: 'Processing', icon: Bot },
  { key: 'approved', label: 'Approved', icon: CheckCircle },
  { key: 'not-submitted', label: 'Not Yet', icon: XCircle },
];

export default function AutoGraderPage() {
  const [activeTab, setActiveTab] = useState('pending-review');

  const counts = {
    'pending-review': autoGraderSubmissions.filter((s) => s.status === 'pending-review').length,
    processing: autoGraderSubmissions.filter((s) => s.status === 'processing').length,
    approved: autoGraderSubmissions.filter((s) => s.status === 'approved').length,
    'not-submitted': autoGraderSubmissions.filter((s) => s.status === 'not-submitted').length,
  };

  const filtered = autoGraderSubmissions.filter((s) => s.status === activeTab);

  return (
    <div className="p-8">
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-1">
          <Bot size={24} className="text-yellow-500" />
          <h1 className="text-2xl font-bold text-gray-900">AI Auto Grader</h1>
        </div>
        <p className="text-gray-500 text-sm">Automated worksheet marking and evaluation</p>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
          <div className="flex items-center gap-2 mb-1">
            <Clock size={16} className="text-yellow-500" />
            <p className="text-xs text-gray-500">Pending Review</p>
          </div>
          <p className="text-2xl font-bold text-gray-900">{counts['pending-review']}</p>
        </div>
        <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
          <div className="flex items-center gap-2 mb-1">
            <Bot size={16} className="text-blue-500" />
            <p className="text-xs text-gray-500">AI Processing</p>
          </div>
          <p className="text-2xl font-bold text-gray-900">{counts.processing}</p>
        </div>
        <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
          <div className="flex items-center gap-2 mb-1">
            <CheckCircle size={16} className="text-green-500" />
            <p className="text-xs text-gray-500">Approved</p>
          </div>
          <p className="text-2xl font-bold text-gray-900">{counts.approved}</p>
        </div>
        <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
          <div className="flex items-center gap-2 mb-1">
            <XCircle size={16} className="text-red-500" />
            <p className="text-xs text-gray-500">Not Submitted</p>
          </div>
          <p className="text-2xl font-bold text-gray-900">{counts['not-submitted']}</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="flex border-b border-gray-100">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const count = counts[tab.key as keyof typeof counts];
            return (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`flex items-center gap-2 px-5 py-3.5 text-sm font-semibold transition-colors border-b-2 ${
                  activeTab === tab.key
                    ? 'border-yellow-400 text-yellow-700 bg-yellow-50'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                <Icon size={15} />
                {tab.label} ({count})
              </button>
            );
          })}
        </div>

        <div className="p-5 space-y-3">
          {filtered.map((sub) => (
            <div key={sub.id} className="flex items-center justify-between bg-gray-50 rounded-xl p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
                  <span className="text-sm font-bold text-gray-600">{sub.studentInitials}</span>
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-0.5">
                    <p className="font-semibold text-gray-900">{sub.studentName}</p>
                    <StatusBadge status={sub.status} />
                  </div>
                  <p className="text-sm text-gray-500">{sub.worksheetName} • {sub.class}</p>
                  {sub.submittedDate && (
                    <p className="text-xs text-gray-400 mt-0.5">Submitted: {sub.submittedDate}</p>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-3">
                {sub.aiScore !== null && (
                  <div className="text-right">
                    <p className="text-xs text-gray-500">AI Score</p>
                    <p className="font-bold text-gray-900">{sub.aiScore}%</p>
                  </div>
                )}
                {sub.status === 'pending-review' && (
                  <Link
                    href={`/tutor/auto-grader/review/${sub.id}`}
                    className="bg-yellow-400 hover:bg-yellow-500 text-gray-900 font-semibold px-4 py-2 rounded-lg text-sm transition-colors"
                  >
                    Review & Verify
                  </Link>
                )}
                {sub.status === 'processing' && (
                  <div className="flex items-center gap-1 text-blue-500 text-sm">
                    <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
                    </svg>
                    Processing...
                  </div>
                )}
                {sub.status === 'approved' && (
                  <div className="flex items-center gap-1 text-green-500 text-sm font-semibold">
                    <CheckCircle size={16} />
                    Approved
                  </div>
                )}
                {sub.status === 'not-submitted' && (
                  <div className="flex items-center gap-1 text-red-500 text-sm font-semibold">
                    <AlertCircle size={16} />
                    Not Submitted
                  </div>
                )}
              </div>
            </div>
          ))}

          {filtered.length === 0 && (
            <div className="text-center py-8 text-gray-500 text-sm">
              No submissions in this category.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
