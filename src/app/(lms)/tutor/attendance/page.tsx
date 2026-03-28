'use client';

import { useState } from 'react';
import { CalendarCheck, Download, Plus, Users, Clock, AlertTriangle, XCircle, CheckCircle, Filter } from 'lucide-react';
import { attendanceRecords } from '@/lib/mockData';

function StatusBadge({ status }: { status: string }) {
  if (status === 'present') return (
    <span className="flex items-center gap-1 px-2 py-1 bg-green-100 text-green-700 text-xs font-semibold rounded-full">
      <CheckCircle size={12} />Present
    </span>
  );
  if (status === 'late') return (
    <span className="flex items-center gap-1 px-2 py-1 bg-yellow-100 text-yellow-700 text-xs font-semibold rounded-full">
      <Clock size={12} />Late
    </span>
  );
  return (
    <span className="flex items-center gap-1 px-2 py-1 bg-red-100 text-red-700 text-xs font-semibold rounded-full">
      <XCircle size={12} />Absent
    </span>
  );
}

export default function AttendancePage() {
  const [classFilter, setClassFilter] = useState('All Classes');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  const totalStudentRecords = attendanceRecords.flatMap((r) => r.students);
  const presentCount = totalStudentRecords.filter((s) => s.status === 'present').length;
  const lateCount = totalStudentRecords.filter((s) => s.status === 'late').length;
  const absentCount = totalStudentRecords.filter((s) => s.status === 'absent').length;
  const totalCount = totalStudentRecords.length;
  const attendanceRate = Math.round(((presentCount + lateCount) / totalCount) * 100);

  const filtered = attendanceRecords.filter((r) => {
    if (classFilter !== 'All Classes' && r.class !== classFilter) return false;
    if (startDate && r.date < startDate) return false;
    if (endDate && r.date > endDate) return false;
    return true;
  });

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <CalendarCheck size={24} className="text-yellow-500" />
            <h1 className="text-2xl font-bold text-gray-900">Attendance Management</h1>
          </div>
          <p className="text-gray-500 text-sm">Track and manage student attendance records</p>
        </div>
        <div className="flex gap-3">
          <button className="flex items-center gap-2 border border-gray-300 hover:bg-gray-50 text-gray-700 font-semibold px-4 py-2.5 rounded-lg text-sm transition-colors">
            <Download size={16} />
            Export Records
          </button>
          <button className="flex items-center gap-2 bg-yellow-400 hover:bg-yellow-500 text-gray-900 font-semibold px-4 py-2.5 rounded-lg text-sm transition-colors">
            <Plus size={16} />
            Mark Attendance
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
          <div className="flex items-center gap-2 mb-1">
            <CalendarCheck size={16} className="text-blue-500" />
            <p className="text-xs text-gray-500">Total Lessons</p>
          </div>
          <p className="text-2xl font-bold text-gray-900">{attendanceRecords.length}</p>
        </div>
        <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
          <div className="flex items-center gap-2 mb-1">
            <Users size={16} className="text-green-500" />
            <p className="text-xs text-gray-500">Attendance Rate</p>
          </div>
          <p className="text-2xl font-bold text-gray-900">{attendanceRate}%</p>
        </div>
        <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
          <div className="flex items-center gap-2 mb-1">
            <AlertTriangle size={16} className="text-yellow-500" />
            <p className="text-xs text-gray-500">Late</p>
          </div>
          <p className="text-2xl font-bold text-gray-900">{lateCount}</p>
        </div>
        <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
          <div className="flex items-center gap-2 mb-1">
            <XCircle size={16} className="text-red-500" />
            <p className="text-xs text-gray-500">Absent</p>
          </div>
          <p className="text-2xl font-bold text-gray-900">{absentCount}</p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3 mb-6">
        <div className="flex items-center gap-2">
          <Filter size={15} className="text-gray-400" />
          <select
            value={classFilter}
            onChange={(e) => setClassFilter(e.target.value)}
            className="border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-yellow-400 bg-white text-gray-700"
          >
            <option>All Classes</option>
            <option>P5-Math-A</option>
            <option>P5-Math-B</option>
          </select>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-500">From</span>
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className="border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-yellow-400"
          />
          <span className="text-sm text-gray-500">to</span>
          <input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            className="border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-yellow-400"
          />
        </div>
      </div>

      {/* Attendance Records */}
      <div className="space-y-4">
        {filtered.map((record) => (
          <div key={record.id} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="flex items-center justify-between p-5 bg-gray-50 border-b border-gray-100">
              <div>
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 bg-yellow-400 rounded-lg flex items-center justify-center">
                    <CalendarCheck size={18} className="text-gray-900" />
                  </div>
                  <div>
                    <p className="font-bold text-gray-900">{record.class}</p>
                    <div className="flex items-center gap-3 text-xs text-gray-500 mt-0.5">
                      <span>{record.date}</span>
                      <span>•</span>
                      <span>{record.startTime} – {record.endTime}</span>
                      <span>•</span>
                      <span className={`font-medium ${record.mode === 'Physical' ? 'text-blue-600' : 'text-green-600'}`}>
                        {record.mode}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
              <p className="text-xs text-gray-400">Marked by {record.markedBy}</p>
            </div>

            <div className="divide-y divide-gray-50">
              {record.students.map((student, idx) => (
                <div key={idx} className="flex items-center justify-between px-5 py-3">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
                      <span className="text-xs font-bold text-gray-600">
                        {student.name.split(' ').map((n) => n[0]).join('')}
                      </span>
                    </div>
                    <p className="text-sm font-semibold text-gray-900">{student.name}</p>
                  </div>
                  <div className="flex items-center gap-3">
                    {student.note && (
                      <span className="text-xs text-gray-400 italic">{student.note}</span>
                    )}
                    <StatusBadge status={student.status} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
