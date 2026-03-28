'use client';

import { usePathname } from 'next/navigation';
import Sidebar from '@/components/Sidebar';

export default function LMSLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const role = pathname.startsWith('/tutor') ? 'tutor' : 'student';

  return (
    <div className="flex min-h-screen bg-gray-100">
      <Sidebar role={role} />
      <main className="flex-1 overflow-auto">
        {children}
      </main>
    </div>
  );
}
