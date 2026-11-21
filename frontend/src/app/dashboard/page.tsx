
'use client';

import ProtectedRoute from '@/components/ProtectedRoute';
import DashboardLayout from '@/components/DashboardLayout';

export default function DashboardPage() {
  return (
    <ProtectedRoute>
      <DashboardLayout>
        <div>
          <h1 className="text-3xl font-bold text-slate-800">
            Dashboard
          </h1>

          <p className="mt-2 text-slate-600">
            Bienvenue sur votre plateforme CloudOps Manager.
          </p>

          <div className="mt-8 grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-4">
            <div className="rounded-xl bg-white p-6 shadow-sm">
              <p className="text-sm text-slate-500">Teams</p>
              <h2 className="mt-2 text-3xl font-bold text-slate-800">0</h2>
            </div>

            <div className="rounded-xl bg-white p-6 shadow-sm">
              <p className="text-sm text-slate-500">Applications</p>
              <h2 className="mt-2 text-3xl font-bold text-slate-800">0</h2>
            </div>

            <div className="rounded-xl bg-white p-6 shadow-sm">
              <p className="text-sm text-slate-500">Monitoring</p>
              <h2 className="mt-2 text-3xl font-bold text-slate-800">0</h2>
            </div>

            <div className="rounded-xl bg-white p-6 shadow-sm">
              <p className="text-sm text-slate-500">Incidents</p>
              <h2 className="mt-2 text-3xl font-bold text-slate-800">0</h2>
            </div>
          </div>
        </div>
      </DashboardLayout>
    </ProtectedRoute>
  );
}
