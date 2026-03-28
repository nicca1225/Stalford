'use client';

import { useState } from 'react';
import { CheckCircle, Clock, User, Calendar, FileText, Bot } from 'lucide-react';
import { submissions } from '@/lib/mockData';

export default function SubmissionsPage() {
  const [activeTab, setActiveTab] = useState<'completed' | 'pending'>('completed');

  const completed = submissions.filter((s) => s.status === 'completed');
  const pending = submissions.filter((s) => s.status !== 'completed');

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">My Submissions</h1>
          <p className="text-gray-500 text-sm mt-1">Track your worksheet submissions and grades</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 bg-gray-100 rounded-lg p-1 w-fit mb-6">
        <button
          onClick={() => setActiveTab('completed')}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-colors ${
            activeTab === 'completed' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          <CheckCircle size={15} />
          Completed ({completed.length})
        </button>
        <button
          onClick={() => setActiveTab('pending')}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-colors ${
            activeTab === 'pending' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          <Clock size={15} />
          Pending ({pending.length})
        </button>
      </div>

      {/* Content */}
      {activeTab === 'completed' && (
        <div className="space-y-4">
          {completed.map((sub) => (
            <div key={sub.id} className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <FileText size={18} className="text-yellow-600" />
                    <h3 className="font-bold text-gray-900">{sub.worksheetName}</h3>
                  </div>
                  <p className="text-sm text-gray-500">{sub.subjectName} • {sub.topicName}</p>
                </div>
                <span className="px-3 py-1 bg-green-100 text-green-700 text-sm font-bold rounded-full">
                  {sub.grade} Grade
                </span>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                <div className="bg-gray-50 rounded-lg p-3 text-center">
                  <p className="text-xs text-gray-500">Total Points</p>
                  <p className="font-bold text-gray-900 text-lg">{sub.totalPoints}</p>
                </div>
                <div className="bg-gray-50 rounded-lg p-3 text-center">
                  <p className="text-xs text-gray-500">Questions</p>
                  <p className="font-bold text-gray-900 text-lg">{sub.questions}</p>
                </div>
                <div className="bg-gray-50 rounded-lg p-3 text-center">
                  <p className="text-xs text-gray-500">Total Time</p>
                  <p className="font-bold text-gray-900 text-lg">{sub.totalTime} min</p>
                </div>
                <div className="bg-gray-50 rounded-lg p-3 text-center">
                  <p className="text-xs text-gray-500">Avg / Question</p>
                  <p className="font-bold text-gray-900 text-lg">{sub.avgTimePerQuestion} min</p>
                </div>
              </div>

              <div className="flex flex-wrap gap-4 text-sm text-gray-600 mb-4">
                <div className="flex items-center gap-1">
                  <Calendar size={14} />
                  <span>Submitted: {sub.submittedDate}</span>
                </div>
                {sub.reviewedBy && (
                  <div className="flex items-center gap-1">
                    <User size={14} />
                    <span>Reviewed by: {sub.reviewedBy}</span>
                  </div>
                )}
                {sub.gradedDate && (
                  <div className="flex items-center gap-1">
                    <CheckCircle size={14} />
                    <span>Graded on: {sub.gradedDate}</span>
                  </div>
                )}
              </div>

              <button className="bg-yellow-400 hover:bg-yellow-500 text-gray-900 font-semibold px-5 py-2.5 rounded-lg text-sm transition-colors">
                View Marked Worksheet with Corrections
              </button>
            </div>
          ))}
        </div>
      )}

      {activeTab === 'pending' && (
        <div className="space-y-4">
          {pending.map((sub) => (
            <div key={sub.id} className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <FileText size={18} className="text-blue-500" />
                    <h3 className="font-bold text-gray-900">{sub.worksheetName}</h3>
                  </div>
                  <p className="text-sm text-gray-500">{sub.subjectName} • {sub.topicName}</p>
                </div>
                <div className="flex items-center gap-2 px-3 py-1 bg-blue-100 text-blue-700 text-sm font-semibold rounded-full">
                  <svg className="w-3 h-3 animate-spin" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                  Grading...
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-4">
                <div className="bg-gray-50 rounded-lg p-3 text-center">
                  <p className="text-xs text-gray-500">Total Points</p>
                  <p className="font-bold text-gray-900 text-lg">{sub.totalPoints}</p>
                </div>
                <div className="bg-gray-50 rounded-lg p-3 text-center">
                  <p className="text-xs text-gray-500">Questions</p>
                  <p className="font-bold text-gray-900 text-lg">{sub.questions}</p>
                </div>
              </div>

              <div className="flex items-center gap-1 text-sm text-gray-600 mb-4">
                <Calendar size={14} />
                <span>Submitted: {sub.submittedDate}</span>
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 flex items-start gap-3">
                <Bot size={18} className="text-blue-500 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-semibold text-blue-800">AI Auto-Grader & Tutor Review in Progress</p>
                  <p className="text-xs text-blue-600 mt-1">Your submission is being evaluated by our AI system and will be reviewed by your tutor. You will be notified once grading is complete.</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
