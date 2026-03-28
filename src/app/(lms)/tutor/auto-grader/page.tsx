'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { Info, RefreshCw, CheckCircle, XCircle, Eye } from 'lucide-react';
import StatCard from '@/components/ui/StatCard';
import StatusBadge from '@/components/ui/StatusBadge';
import OutlineButton from '@/components/ui/OutlineButton';
import {
  getResults,
  getGradingStatus,
  uploadForGrading,
} from '@/lib/api';
import type { DatabaseFeed, GradingStatus } from '@/types/database';

export default function AutoGraderPage() {
  const [feed, setFeed] = useState<DatabaseFeed | null>(null);
  const [gradingStatus, setGradingStatus] = useState<GradingStatus>({ status: 'idle', progress: '' });
  const [markingScheme, setMarkingScheme] = useState<File | null>(null);
  const [worksheets, setWorksheets] = useState<File[]>([]);
  const [isUploading, setIsUploading] = useState(false);

  const pollRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const stopPolling = () => {
    if (pollRef.current) {
      clearInterval(pollRef.current);
      pollRef.current = null;
    }
  };

  const startPolling = () => {
    stopPolling();
    pollRef.current = setInterval(async () => {
      const s = await getGradingStatus();
      setGradingStatus(s);
      if (s.status === 'complete') {
        stopPolling();
        const data = await getResults().catch(() => null);
        if (data) setFeed(data);
      } else if (s.status === 'error') {
        stopPolling();
      }
    }, 3000);
  };

  // On mount: load existing results + current status
  useEffect(() => {
    getResults().then(setFeed).catch(() => null);
    getGradingStatus().then((s) => {
      // Treat a stale error from a previous session as idle
      if (s.status === 'error') return;
      setGradingStatus(s);
      if (s.status === 'processing') startPolling();
    });
    return stopPolling;
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleStartGrading = async () => {
    if (!markingScheme || worksheets.length === 0) return;
    setIsUploading(true);
    try {
      await uploadForGrading(markingScheme, worksheets);
      setGradingStatus({ status: 'processing', progress: 'Starting...' });
      startPolling();
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Upload failed');
    } finally {
      setIsUploading(false);
    }
  };

  // Derived stats
  const totalStudents = feed
    ? feed.all_classes.reduce((sum, cls) => sum + cls.class_summary.total_students, 0)
    : 0;

  // Flatten all students for the submissions list
  const allStudents = feed
    ? feed.all_classes.flatMap((cls) =>
        cls.students.map((s) => ({ ...s, class_id: cls.class_summary.class_id }))
      )
    : [];

  return (
    <>
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">AI Auto Grader</h1>
        <p className="text-gray-500 text-sm mt-1">Automated worksheet marking and evaluation.</p>
      </div>

      {/* ── Upload Card ── */}
      <div className="bg-white rounded-xl border border-gray-200 p-6 mb-6">
        <h2 className="text-base font-bold text-gray-900 mb-1">Upload &amp; Grade Worksheets</h2>
        <p className="text-xs text-gray-400 mb-4">
          Filename format: ClassName_StudentName.pdf &nbsp;·&nbsp; e.g. P3-MATH-E_Ke_Xin.pdf
        </p>

        {gradingStatus.status === 'processing' ? (
          <div className="flex items-center gap-3 bg-blue-50 border border-blue-200 rounded-lg p-4">
            <RefreshCw size={18} className="text-blue-500 animate-spin flex-shrink-0" />
            <span className="text-sm text-blue-700 font-medium">
              {gradingStatus.progress || 'Processing…'}
            </span>
          </div>
        ) : gradingStatus.status === 'complete' ? (
          <div className="flex items-center gap-3 bg-green-50 border border-green-200 rounded-lg p-4">
            <CheckCircle size={18} className="text-green-600 flex-shrink-0" />
            <span className="text-sm text-green-700 font-medium">✓ Grading Complete!</span>
          </div>
        ) : gradingStatus.status === 'error' ? (
          <div className="flex flex-col gap-3">
            <div className="flex items-start gap-3 bg-red-50 border border-red-200 rounded-lg p-4">
              <span className="text-red-500 font-bold text-lg leading-none flex-shrink-0">✗</span>
              <div>
                <p className="text-sm text-red-700 font-semibold">Grading failed</p>
                <p className="text-xs text-red-500 mt-0.5 break-all">{gradingStatus.progress}</p>
              </div>
            </div>
            <button
              onClick={() => setGradingStatus({ status: 'idle', progress: '' })}
              className="text-xs text-gray-500 hover:text-gray-700 underline w-fit"
            >
              Try again
            </button>
          </div>
        ) : (
          <div className="flex flex-col sm:flex-row gap-4">
            {/* Marking scheme input */}
            <div className="flex-1">
              <label className="block text-xs font-semibold text-gray-600 mb-1">
                Marking Scheme
              </label>
              <input
                type="file"
                accept=".pdf"
                onChange={(e) => setMarkingScheme(e.target.files?.[0] ?? null)}
                className="block w-full text-sm text-gray-500 file:mr-3 file:py-1.5 file:px-3
                  file:rounded-lg file:border file:border-gray-200 file:text-xs file:font-semibold
                  file:bg-gray-50 file:text-gray-700 hover:file:bg-gray-100"
              />
            </div>

            {/* Worksheets input */}
            <div className="flex-1">
              <label className="block text-xs font-semibold text-gray-600 mb-1">
                Student Worksheets
              </label>
              <input
                type="file"
                accept=".pdf"
                multiple
                onChange={(e) =>
                  setWorksheets(e.target.files ? Array.from(e.target.files) : [])
                }
                className="block w-full text-sm text-gray-500 file:mr-3 file:py-1.5 file:px-3
                  file:rounded-lg file:border file:border-gray-200 file:text-xs file:font-semibold
                  file:bg-gray-50 file:text-gray-700 hover:file:bg-gray-100"
              />
            </div>

            {/* Submit */}
            <div className="flex items-end">
              <button
                onClick={handleStartGrading}
                disabled={!markingScheme || worksheets.length === 0 || isUploading}
                className="bg-[#FFC107] text-black text-sm font-bold px-5 py-2 rounded-lg
                  disabled:opacity-40 disabled:cursor-not-allowed hover:bg-[#e6ad06] transition-colors"
              >
                {isUploading ? 'Uploading…' : 'Start Grading'}
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <StatCard
          title="Pending Review"
          value={totalStudents}
          subtitle="Needs tutor verification"
          icon={<Info size={18} />}
        />
        <StatCard
          title="AI Processing"
          value={gradingStatus.status === 'processing' ? 1 : 0}
          subtitle="In progress"
          icon={<RefreshCw size={18} />}
        />
        <StatCard
          title="Approved"
          value={0}
          subtitle="Completed & verified"
          icon={<CheckCircle size={18} />}
        />
        <StatCard
          title="Not Submitted"
          value={0}
          subtitle="Awaiting upload"
          icon={<XCircle size={18} />}
        />
      </div>

      {/* Submissions list */}
      <h2 className="text-base font-bold text-gray-900 mb-4">Recent Submissions</h2>

      {allStudents.length === 0 ? (
        <p className="text-sm text-gray-400">
          {gradingStatus.status === 'processing'
            ? 'Grading in progress — results will appear here when complete.'
            : 'No submissions yet. Upload worksheets above to get started.'}
        </p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {allStudents.map((s) => (
            <div
              key={`${s.class_id}-${s.student_name}`}
              className="bg-white rounded-xl border border-gray-100 p-5 shadow-sm flex flex-col gap-3"
            >
              <div className="flex items-center justify-between">
                <div>
                  <span className="font-semibold text-gray-900">{s.student_name}</span>
                  <span className="ml-2 text-xs text-gray-400">{s.class_id}</span>
                </div>
                <StatusBadge status="pending-review" />
              </div>

              <span className="inline-block bg-[#FFC107] text-black text-xs font-bold px-3 py-1.5 rounded-lg w-fit">
                Score: {s.overall_percentage}%
              </span>

              <Link
                href={`/tutor/auto-grader/review?student=${encodeURIComponent(s.student_name)}&class=${encodeURIComponent(s.class_id)}`}
              >
                <OutlineButton fullWidth className="flex items-center justify-center gap-2 text-sm mt-1">
                  <Eye size={14} />
                  Review &amp; Verify
                </OutlineButton>
              </Link>
            </div>
          ))}
        </div>
      )}
    </>
  );
}
