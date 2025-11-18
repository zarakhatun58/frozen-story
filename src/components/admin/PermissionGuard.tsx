import { ReactNode } from 'react';
import { useAuth } from '@/contexts/AuthContext';

interface PermissionGuardProps {
  children: ReactNode;
  requires: 'view' | 'edit' | 'delete' | 'admin';
  fallback?: ReactNode;
}

export const PermissionGuard = ({ children, requires, fallback = null }: PermissionGuardProps) => {
  const { permissions } = useAuth();

  if (!permissions[requires]) {
    return <>{fallback}</>;
  }

  return <>{children}</>;
};
