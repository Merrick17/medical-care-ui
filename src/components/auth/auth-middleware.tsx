"use client"
import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import useStore from '@/store';
import { Loader2 } from 'lucide-react';

interface AuthMiddlewareProps {
  children: React.ReactNode;
  allowedRoles?: Array<'Patient' | 'Doctor' | 'Admin'>;
  requireAuth?: boolean;
}

export default function AuthMiddleware({ 
  children, 
  allowedRoles, 
  requireAuth = true 
}: AuthMiddlewareProps) {
  const router = useRouter();
  const pathname = usePathname();
  const { user, token, logout } = useStore();
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (!isClient) return;

    // Check token expiration
    if (token) {
      try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        if (payload.exp * 1000 < Date.now()) {
          logout();
          router.push(`/auth/login?redirect=${pathname}`);
          return;
        }
      } catch (error) {
        console.error('Invalid token:', error);
        logout();
        router.push(`/auth/login?redirect=${pathname}`);
        return;
      }
    }

    // Handle authentication check
    if (requireAuth && (!token || !user)) {
      router.push(`/auth/login?redirect=${pathname}`);
      return;
    }

    // Handle role-based access
    if (allowedRoles && user && !allowedRoles.includes(user.role)) {
      router.push('/unauthorized');
      return;
    }
  }, [user, token, router, pathname, allowedRoles, requireAuth, logout, isClient]);

  // Don't render anything during SSR
  if (!isClient) {
    return null;
  }

  // Show loading state while checking auth
  if (requireAuth && (!token || !user)) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  // Show loading for role check
  if (allowedRoles && user && !allowedRoles.includes(user.role)) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return <>{children}</>;
} 