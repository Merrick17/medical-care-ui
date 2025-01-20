import { useRouter } from 'next/navigation';
import { useEffect, useCallback } from 'react';
import useStore from '@/store';

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles?: Array<'Patient' | 'Doctor' | 'Admin'>;
}

export default function ProtectedRoute({ children, allowedRoles }: ProtectedRouteProps) {
  const router = useRouter();
  const user = useStore(state => state.user);
  const token = useStore(state => state.token);

  const checkAuth = useCallback(() => {
    if (!token || !user) {
      router.push('/auth/login');
      return false;
    }

    if (allowedRoles && !allowedRoles.includes(user.role)) {
      router.push('/');
      return false;
    }

    return true;
  }, [token, user, router, allowedRoles]);

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  if (!checkAuth()) {
    return null;
  }

  return <>{children}</>;
} 