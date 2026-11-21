
'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

const menuItems = [
  { label: 'Dashboard', href: '/dashboard', icon: '📊' },
  { label: 'Teams', href: '/teams', icon: '👥' },
  { label: 'Applications', href: '/applications', icon: '🖥️' },
  { label: 'Monitoring', href: '/monitoring', icon: '📈' },
  { label: 'Incidents', href: '/incidents', icon: '🚨' },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="flex min-h-screen w-64 flex-col bg-slate-950 px-5 py-7 text-white">
      <div className="mb-10">
        <h1 className="text-2xl font-bold tracking-wide">
          CloudOps
        </h1>
        <p className="mt-1 text-xs text-slate-400">
          Manager Platform
        </p>
      </div>

      <p className="mb-4 text-xs font-semibold uppercase tracking-widest text-slate-500">
        Menu principal
      </p>

      <nav className="flex flex-col gap-2">
        {menuItems.map((item) => {
          const isActive = pathname === item.href;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium transition ${
                isActive
                  ? 'bg-blue-600 text-white shadow-lg'
                  : 'text-slate-300 hover:bg-slate-800 hover:text-white'
              }`}
            >
              <span>{item.icon}</span>
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>

      <div className="mt-auto border-t border-slate-800 pt-5">
        <p className="text-xs text-slate-500">
          CloudOps Manager
        </p>
        <p className="mt-1 text-xs text-slate-400">
          Infrastructure Management
        </p>
      </div>
    </aside>
  );
}
