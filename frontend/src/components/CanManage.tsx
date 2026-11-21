'use client';

import { useAuth } from '@/context/AuthContext';

export default function CanManage({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user } = useAuth();

  const canManage =
    user?.role === 'ADMIN' || user?.role === 'DEVOPS';

  if (!canManage) return null;

  return <>{children}</>;
}