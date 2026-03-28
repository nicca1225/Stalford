'use client';

import { useState } from 'react';
import { Download, Plus, Users, Clock, XCircle, BookOpen } from 'lucide-react';
import StatCard from '@/components/ui/StatCard';
import PrimaryButton from '@/components/ui/PrimaryButton';
import OutlineButton from '@/components/ui/OutlineButton';

type AttendanceStatus = 'Present' | 'Late' | 'Absent';

interface Student {
  name: string;
  status: AttendanceStatus;
  remarks?: string;
}

interface AttendanceRecord {
  id: string;
  class: string;
  date: string;
  time: string;
  mode: 'Physical' | 'Online';
  markedBy: string;
  markedAt: string;
  students: Student[];
}

const records: AttendanceRecord[] = [
  {
    id: '1',
    class: 'PS-Math-A',
    date: 'Mar 20, 2026',
    time: '14:00 – 16:00',
    mode: 'Physical',
    markedBy: 'Tutor Gojo',
    markedAt: '2026-03-20 14:06',
    students: [
      { name: 'Emma Tan',    status: 'Present' },
      { name: 'Ryan Lee',    status: 'Present' },
      { name: 'Sophie Wong', status: 'Late',   remarks: 'Arrived 15 mins late' },
    ],
  },
  {
    id: '2',
    class: 'PS-Math-B',
    date: 'Mar 20, 2026',
    time: '16:00 – 18:00',
    mode: 'Online',
    markedBy: 'Tutor Gojo',
    markedAt: '2026-03-20 16:10',
    students: [
      { name: 'Emma Tan',    status: 'Present' },
      { name: 'Ryan Lee',    status: 'Absent' },
      { name: 'Sophie Wong', status: 'Present' },
    ],
  },
];

const statusStyle: Record<AttendanceStatus, string> = {
  Present: 'bg-green-100 text-green-700',
  Late:    'bg-orange-100 text-orange-600',
  Absent:  'bg-red-100 text-red-600',
};

const modeBadge: Record<string, string> = {
  Physical: 'bg-blue-100 text-blue-700',
  Online:   'bg-green-100 text-green-700',
};

export default function AttendancePage() {
  const [classFilter, setClassFilter]   = useState('All Classes');
  const [startDate,   setStartDate]     = useState('');
  const [endDate,     setEndDate]       = useState('');

  return (
    <>
      {/* Header */}
      <div className="flex items-start justify-between mb-2">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Attendance Management</h1>
          <p className="text-gray-500 text-sm mt-1">
            Mark and track student attendance for physical and online lessons.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <OutlineButton className="flex items-center gap-2 text-sm">
            <Download size={14} />
            Export Records
          </OutlineButton>
          <PrimaryButton className="flex items-center gap-2 text-sm">
            <Plus size={14} />
            Mark Attendance
          </PrimaryButton>
        </div>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 my-6">
        <StatCard title="Total Lessons"    value={2}    subtitle="Recorded"  icon={<BookOpen size={18} />} />
        <StatCard title="Attendance Rate"  value="83%"  subtitle="Overall"   icon={<Users size={18} />} />
        <StatCard title="Late"             value={1}    subtitle="Students"  icon={<Clock size={18} className="text-orange-500" />} />
        <StatCard title="Absent"           value={1}    subtitle="Students"  icon={<XCircle size={18} className="text-red-500" />} />
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-4 mb-6">
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-600 whitespace-nowrap">Filter by Class:</span>
          <select
            value={classFilter}
            onChange={(e) => setClassFilter(e.target.value)}
            className="border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-yellow-400 bg-white text-gray-700"
          >
            <option>All Classes</option>
            <option>PS-Math-A</option>
            <option>PS-Math-B</option>
          </select>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-600 whitespace-nowrap">Filter by Date:</span>
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className="border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-yellow-400 bg-white text-gray-700"
          />
          <span className="text-sm text-gray-400">to</span>
          <input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            className="border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-yellow-400 bg-white text-gray-700"
          />
        </div>
      </div>

      {/* Records */}
      <p className="font-semibold text-gray-900 mb-4">Attendance Records ({records.length})</p>
      <div className="flex flex-col gap-6">
        {records
          .filter((r) => classFilter === 'All Classes' || r.class === classFilter)
          .map((rec) => (
            <div key={rec.id} className="bg-white rounded-xl border border-gray-100 p-6 shadow-sm hover:shadow-md transition-shadow">

              {/* Card header */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3 flex-wrap">
                  <span className="font-bold text-gray-900">{rec.class}</span>
                  <span className="text-sm text-gray-400">{rec.date}</span>
                  <span className="text-sm text-gray-400">{rec.time}</span>
                  <span className={`text-xs font-semibold px-2.5 py-0.5 rounded-full ${modeBadge[rec.mode]}`}>
                    {rec.mode}
                  </span>
                </div>
                <div className="text-right flex-shrink-0">
                  <p className="text-xs text-gray-500">Marked by {rec.markedBy}</p>
                  <p className="text-xs text-gray-400">{rec.markedAt}</p>
                </div>
              </div>

              {/* Table */}
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-100">
                    <th className="text-left text-xs font-semibold text-gray-400 pb-2">Student Name</th>
                    <th className="text-left text-xs font-semibold text-gray-400 pb-2">Status</th>
                    <th className="text-left text-xs font-semibold text-gray-400 pb-2">Remarks</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {rec.students.map((s) => (
                    <tr key={s.name}>
                      <td className="py-3 font-medium text-gray-900">{s.name}</td>
                      <td className="py-3">
                        <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${statusStyle[s.status]}`}>
                          {s.status}
                        </span>
                      </td>
                      <td className="py-3 text-xs text-gray-400">{s.remarks ?? '—'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {/* Pagination */}
              <div className="flex items-center justify-center gap-3 mt-4 pt-3 border-t border-gray-50">
                <button className="text-gray-400 hover:text-gray-600 transition-colors text-sm">&lsaquo;</button>
                <span className="text-sm text-gray-600 font-medium">1</span>
                <button className="text-gray-400 hover:text-gray-600 transition-colors text-sm">&rsaquo;</button>
              </div>
            </div>
          ))}
      </div>
    </>
  );
}
