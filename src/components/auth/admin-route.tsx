"use client"
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import useStore from '@/store';
import { Loader2 } from 'lucide-react';

export default function AdminRoute({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const { user, token } = useStore(state => ({
    user: state.user,
    token: state.token
  }));

  useEffect(() => {
    if (!token) {
      router.push('/auth/login');
      return;
    }

    if (user?.role !== 'Admin') {
      router.push('/unauthorized');
      return;
    }
  }, [user, token, router]);

  if (!token || user?.role !== 'Admin') {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return <>{children}</>;
} 