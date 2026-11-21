
'use client';

import { useAuth } from '@/context/AuthContext';
import LogoutButton from '@/components/LogoutButton';

export default function Topbar() {
  const { user } = useAuth();

  return (
    <header className="flex h-20 items-center justify-between border-b border-slate-200 bg-white px-8 shadow-sm">
      <div>
        <h2 className="text-lg font-semibold text-slate-800">
          CloudOps Manager
        </h2>
        <p className="text-sm text-slate-500">
          Cloud Infrastructure Management
        </p>
      </div>

      <div className="flex items-center gap-5">
        <div className="text-right">
          <p className="text-sm font-semibold text-slate-800">
            {user?.fullName ?? 'Utilisateur'}
          </p>
          <p className="text-xs text-slate-500">
            {user?.email}
          </p>
        </div>

        <span className="rounded-full bg-blue-100 px-3 py-1 text-xs font-semibold text-blue-700">
          {user?.role ?? 'USER'}
        </span>

        <LogoutButton />
      </div>
    </header>
  );
}
