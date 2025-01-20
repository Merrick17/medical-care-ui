"use client"
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import useStore from "@/store";
import { Sidebar } from "@/components/doctor/sidebar";
import { UserNav } from "@/components/user-nav";
import AuthMiddleware from '@/components/auth/auth-middleware';

export default function DoctorLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) {
    return null;
  }

  return (
    <AuthMiddleware allowedRoles={['Doctor']}>
      <div className="flex min-h-screen bg-gray-50">
        <Sidebar />
        <div className="flex-1">
          <div className="flex-1 space-y-4 p-8 pt-6">
            <div className="flex items-center justify-between">
              <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
              <UserNav />
            </div>
            <main>{children}</main>
          </div>
        </div>
      </div>
    </AuthMiddleware>
  );
} 