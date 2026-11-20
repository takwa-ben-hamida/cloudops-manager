
'use client';

import ProtectedRoute from '@/components/ProtectedRoute';
import LogoutButton from '@/components/LogoutButton';

export default function DashboardPage() {
  return (
    <ProtectedRoute>
      <h1>Dashboard CloudOps</h1>
      <LogoutButton>Logout</LogoutButton>
    </ProtectedRoute>
  );
}
