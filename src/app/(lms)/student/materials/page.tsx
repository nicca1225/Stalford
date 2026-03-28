'use client';

import { useState } from 'react';
import { Download, FileText } from 'lucide-react';
import PrimaryButton from '@/components/ui/PrimaryButton';

type Subject = 'Mathematics' | 'Science' | 'English';

interface Material {
  id: string;
  title: string;
  description: string;
  subject: Subject;
  fileType: string;
  teacher: string;
  date: string;
  size: string;
}

const materials: Material[] = [
  {
    id: '1',
    title: 'Forces and Motion Notes',
    description: 'Complete notes on forces, friction, and Newton\'s laws',
    subject: 'Science',
    fileType: 'PDF',
    teacher: 'Ms. Sarah Lim',
    date: '14/03/25',
    size: '2.7 MB',
  },
  {
    id: '2',
    title: 'PSLE Forces Past Year Paper 2025',
    description: 'PSLE questions on forces and motion with solutions',
    subject: 'Science',
    fileType: 'PDF',
    teacher: 'Ms. Sarah Lim',
    date: '10/03/25',
    size: '1.1 MB',
  },
  {
    id: '3',
    title: 'Vocabulary Builder — Week 1',
    description: 'Weekly vocabulary words with definitions and examples',
    subject: 'English',
    fileType: 'PDF',
    teacher: 'Mrs. Wang Mei Ling',
    date: '7/3/25',
    size: '512 KB',
  },
  {
    id: '4',
    title: 'Geometry Formula Cheat Sheet',
    description: 'Quick reference list of all important geometry formulas',
    subject: 'Mathematics',
    fileType: 'PDF',
    teacher: 'Mr. Tan Wei Ming',
    date: '5/3/25',
    size: '768 KB',
  },
  {
    id: '5',
    title: 'Algebra Basics — Study Guide',
    description: 'Comprehensive guide covering algebraic expressions, equations, and problem-solving strategies',
    subject: 'Mathematics',
    fileType: 'PDF',
    teacher: 'Mr. Tan Wei Ming',
    date: '1/3/25',
    size: '2.4 MB',
  },
];

const subjectStyles: Record<Subject, string> = {
  Mathematics: 'bg-blue-50 text-blue-700 border border-blue-200',
  Science:     'bg-emerald-50 text-emerald-700 border border-emerald-200',
  English:     'bg-violet-50 text-violet-700 border border-violet-200',
};

const tabSubjectStyles: Record<Subject, string> = {
  Mathematics: 'bg-blue-500 text-white',
  Science:     'bg-emerald-500 text-white',
  English:     'bg-violet-500 text-white',
};

const tabs: { label: string; value: Subject | 'All' }[] = [
  { label: 'All Materials', value: 'All' },
  { label: 'Mathematics',   value: 'Mathematics' },
  { label: 'Science',       value: 'Science' },
  { label: 'English',       value: 'English' },
];

function countFor(subject: Subject | 'All') {
  if (subject === 'All') return materials.length;
  return materials.filter((m) => m.subject === subject).length;
}

export default function MaterialsPage() {
  const [active, setActive] = useState<Subject | 'All'>('All');
  const filtered = active === 'All' ? materials : materials.filter((m) => m.subject === active);

  return (
    <>
      {/* Header */}
      <div className="mb-6 animate-fade-in-up">
        <h1 className="font-display text-2xl font-bold text-zinc-900 tracking-tight" style={{ letterSpacing: '-0.02em' }}>
          Learning Materials
        </h1>
        <p className="text-zinc-400 text-sm mt-1 font-medium">Access all your study resources and materials.</p>
      </div>

      {/* Filter tabs */}
      <div className="flex flex-wrap gap-2 mb-6 animate-fade-in-up" style={{ animationDelay: '0.04s' }}>
        {tabs.map(({ label, value }) => {
          const isActive = active === value;
          const isSubject = value !== 'All';
          return (
            <button
              key={value}
              onClick={() => setActive(value)}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-semibold transition-apple ${
                isActive
                  ? isSubject
                    ? tabSubjectStyles[value as Subject]
                    : 'bg-amber-400 text-zinc-900'
                  : 'bg-zinc-100 text-zinc-500 hover:bg-zinc-200'
              }`}
            >
              {label}
              <span className={`text-xs px-1.5 py-0.5 rounded-full font-bold ${
                isActive ? 'bg-black/15 text-inherit' : 'bg-zinc-200 text-zinc-400'
              }`}>
                {countFor(value)}
              </span>
            </button>
          );
        })}
      </div>

      {/* Materials list */}
      <div className="flex flex-col gap-2.5 animate-fade-in-up" style={{ animationDelay: '0.08s' }}>
        {filtered.map((m) => (
          <div
            key={m.id}
            className="bg-white rounded-2xl border border-zinc-100 px-6 py-4 flex items-center justify-between shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-apple"
          >
            {/* Left: file icon + info */}
            <div className="flex items-center gap-4 flex-1 min-w-0">
              {/* PDF icon */}
              <div className="w-10 h-10 rounded-xl bg-red-50 border border-red-100 flex flex-col items-center justify-center flex-shrink-0 gap-0.5">
                <FileText size={14} className="text-red-500" />
                <span className="text-[8px] font-bold text-red-500 leading-none tracking-wide">PDF</span>
              </div>

              {/* Text + badge */}
              <div className="min-w-0">
                <p className="font-semibold text-sm text-zinc-900">{m.title}</p>
                <div className="flex items-center gap-2 mt-1">
                  <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${subjectStyles[m.subject]}`}>
                    {m.subject}
                  </span>
                </div>
                <p className="text-xs text-zinc-400 mt-1 font-medium">
                  By {m.teacher} &bull; {m.date} &bull; {m.size}
                </p>
              </div>
            </div>

            {/* Right: download */}
            <PrimaryButton className="flex items-center gap-2 text-sm ml-4 flex-shrink-0">
              <Download size={14} />
              Download
            </PrimaryButton>
          </div>
        ))}

        {filtered.length === 0 && (
          <div className="bg-white rounded-2xl border border-zinc-100 p-10 text-center text-zinc-400 text-sm">
            No materials found.
          </div>
        )}
      </div>
    </>
  );
}
