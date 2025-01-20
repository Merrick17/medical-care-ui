"use client"
import { useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import useStore from '@/store';
import { Loader2 } from 'lucide-react';

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles?: Array<'Patient' | 'Doctor' | 'Admin'>;
}

export default function ProtectedRoute({ children, allowedRoles }: ProtectedRouteProps) {
  const router = useRouter();
  const pathname = usePathname();
  const { user, token } = useStore();

  useEffect(() => {
    // If not authenticated, redirect to login
    if (!token || !user) {
      router.push(`/auth/login?redirect=${pathname}`);
      return;
    }

    // If role is not allowed, redirect to unauthorized
    if (allowedRoles && !allowedRoles.includes(user.role)) {
      router.push('/unauthorized');
      return;
    }
  }, [user, token, router, pathname, allowedRoles]);

  // Show loading state while checking auth
  if (!token || !user || (allowedRoles && !allowedRoles.includes(user.role))) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return <>{children}</>;
} 