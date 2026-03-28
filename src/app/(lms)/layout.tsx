'use client';

import { usePathname } from 'next/navigation';
import DashboardLayout from '@/components/layout/DashboardLayout';

export default function LMSLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const role = pathname.startsWith('/tutor') ? 'tutor' : 'student';

  return (
    <DashboardLayout role={role}>
      {children}
    </DashboardLayout>
  );
}
