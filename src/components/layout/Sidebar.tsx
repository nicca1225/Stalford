'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  House, BookOpen, ClipboardList, BarChart2,
  CheckCircle, FileText, Users, LogOut, Menu, X,
} from 'lucide-react';
import { useAuth } from '@/lib/authContext';

const studentNav = [
  { label: 'Home',        href: '/student/home',        icon: House },
  { label: 'Materials',   href: '/student/materials',   icon: BookOpen },
  { label: 'Submissions', href: '/student/submissions', icon: ClipboardList },
  { label: 'Analytics',   href: '/student/analytics',   icon: BarChart2 },
];

const tutorNav = [
  { label: 'Home',            href: '/tutor/home',            icon: House },
  { label: 'Materials',       href: '/tutor/materials',       icon: BookOpen },
  { label: 'Analytics',       href: '/tutor/analytics',       icon: BarChart2 },
  { label: 'Auto Grader',     href: '/tutor/auto-grader',     icon: CheckCircle },
  { label: 'Paper Generator', href: '/tutor/paper-generator', icon: FileText },
  { label: 'Attendance',      href: '/tutor/attendance',      icon: Users },
];

function NavContent({
  role,
  onClose,
}: {
  role: 'student' | 'tutor';
  onClose?: () => void;
}) {
  const pathname = usePathname();
  const router   = useRouter();
  const { logout } = useAuth();
  const navItems = role === 'student' ? studentNav : tutorNav;

  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  return (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div className="px-6 py-6 flex items-center justify-between">
        <div>
          <p className="text-white font-extrabold text-base tracking-wider leading-tight">STALFORD</p>
          <p className="text-white/35 text-[9px] tracking-[0.2em] uppercase mt-0.5 font-medium">Learning Centre</p>
        </div>
        {onClose && (
          <button onClick={onClose} className="text-white/50 hover:text-white transition-colors md:hidden">
            <X size={18} />
          </button>
        )}
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 space-y-0.5 overflow-y-auto">
        {navItems.map(({ label, href, icon: Icon }) => {
          const isActive = pathname === href || pathname.startsWith(href + '/');
          return (
            <Link
              key={href}
              href={href}
              onClick={onClose}
              className={`flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-apple ${
                isActive
                  ? 'bg-amber-400 text-zinc-900 font-semibold shadow-sm'
                  : 'text-white/50 hover:text-white hover:bg-white/8'
              }`}
            >
              <Icon size={16} strokeWidth={isActive ? 2.5 : 2} />
              {label}
            </Link>
          );
        })}
      </nav>

      {/* Logout */}
      <div className="px-3 py-4 border-t border-white/10">
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium text-white/40 hover:text-white hover:bg-white/8 transition-all duration-150 w-full"
        >
          <LogOut size={16} />
          Logout
        </button>
      </div>
    </div>
  );
}

export default function Sidebar({ role }: { role: 'student' | 'tutor' }) {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <>
      {/* Desktop sidebar — fixed, hidden on mobile */}
      <aside className="hidden md:flex fixed top-0 left-0 h-screen w-[220px] bg-[#18181B] flex-col z-40">
        <NavContent role={role} />
      </aside>

      {/* Mobile hamburger button */}
      <button
        onClick={() => setMobileOpen(true)}
        className="md:hidden fixed top-4 left-4 z-50 w-9 h-9 bg-[#1E1E1E] rounded-lg flex items-center justify-center text-white shadow-lg"
        aria-label="Open menu"
      >
        <Menu size={18} />
      </button>

      {/* Mobile overlay */}
      {mobileOpen && (
        <div
          className="md:hidden fixed inset-0 bg-black/50 z-40"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Mobile drawer */}
      <aside
        className={`md:hidden fixed top-0 left-0 h-screen w-[220px] bg-[#18181B] flex flex-col z-50 transition-transform duration-300 ${
          mobileOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <NavContent role={role} onClose={() => setMobileOpen(false)} />
      </aside>
    </>
  );
}
