'use client';

import { useAuth } from '@/lib/authContext';

export default function Navbar() {
  const { currentUser } = useAuth();

  const initials = currentUser?.avatar ?? '??';
  const name = currentUser?.name ?? '';
  const role = currentUser?.role
    ? currentUser.role.charAt(0).toUpperCase() + currentUser.role.slice(1)
    : '';

  return (
    <header className="h-16 glass-effect border-b border-white/60 flex items-center justify-end px-8 flex-shrink-0 shadow-[0_1px_3px_rgba(0,0,0,0.06)] sticky top-0 z-30">
      <div className="flex items-center gap-3">
        {/* Avatar */}
        <div className="w-9 h-9 rounded-full bg-gradient-to-br from-amber-300 to-amber-500 flex items-center justify-center flex-shrink-0 shadow-sm ring-2 ring-amber-100">
          <span className="text-[11px] font-bold text-zinc-900">{initials}</span>
        </div>
        {/* Name + role */}
        <div className="text-right">
          <p className="text-sm font-semibold text-zinc-900 leading-tight">{name}</p>
          <p className="text-xs text-zinc-400 font-medium">{role}</p>
        </div>
      </div>
    </header>
  );
}
