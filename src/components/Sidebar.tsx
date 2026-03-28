'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, BookOpen, FileText, BarChart2, Bot, FileEdit, CalendarCheck, LogOut } from 'lucide-react';
import { useAuth } from '@/lib/authContext';
import { useRouter } from 'next/navigation';

const studentNav = [
  { label: 'Home', href: '/student/home', icon: Home },
  { label: 'Materials', href: '/student/materials', icon: BookOpen },
  { label: 'Submissions', href: '/student/submissions', icon: FileText },
  { label: 'Analytics', href: '/student/analytics', icon: BarChart2 },
];

const tutorNav = [
  { label: 'Home', href: '/tutor/home', icon: Home },
  { label: 'Materials', href: '/tutor/materials', icon: BookOpen },
  { label: 'Analytics', href: '/tutor/analytics', icon: BarChart2 },
  { label: 'Auto Grader', href: '/tutor/auto-grader', icon: Bot },
  { label: 'Paper Generator', href: '/tutor/paper-generator', icon: FileEdit },
  { label: 'Attendance', href: '/tutor/attendance', icon: CalendarCheck },
];

interface SidebarProps {
  role: 'student' | 'tutor';
}

export default function Sidebar({ role }: SidebarProps) {
  const pathname = usePathname();
  const { logout } = useAuth();
  const router = useRouter();
  const navItems = role === 'student' ? studentNav : tutorNav;

  const handleLogout = () => {
    logout();
    router.push('/');
  };

  return (
    <aside className="w-64 min-h-screen bg-gray-800 flex flex-col">
      <div className="p-6 border-b border-gray-700">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-yellow-400 rounded-lg flex items-center justify-center">
            <span className="text-gray-900 font-bold text-sm">S</span>
          </div>
          <div>
            <p className="text-white font-bold text-sm">Stalford</p>
            <p className="text-gray-400 text-xs">EduCore</p>
          </div>
        </div>
      </div>

      <nav className="flex-1 p-4 space-y-1">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href || pathname.startsWith(item.href + '/');
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors ${
                isActive
                  ? 'bg-yellow-400 text-gray-900 font-semibold'
                  : 'text-gray-300 hover:bg-gray-700 hover:text-white'
              }`}
            >
              <Icon size={18} />
              <span className="text-sm">{item.label}</span>
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t border-gray-700">
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-gray-300 hover:bg-gray-700 hover:text-white transition-colors w-full"
        >
          <LogOut size={18} />
          <span className="text-sm">Logout</span>
        </button>
      </div>
    </aside>
  );
}
