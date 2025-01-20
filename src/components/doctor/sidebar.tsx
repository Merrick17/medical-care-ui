"use client";

import { Home, Calendar, Users, FileText, Settings, LogOut } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import useStore from "@/store";

const navigation = [
  { name: "Dashboard", href: "/doctor", icon: Home },
  { name: "Appointments", href: "/doctor/appointments", icon: Calendar },
  { name: "Patients", href: "/doctor/patients", icon: Users },
  { name: "Medical Records", href: "/doctor/records", icon: FileText },
  { name: "Settings", href: "/doctor/settings", icon: Settings },
];

export function Sidebar() {
  const pathname = usePathname();
  const logout = useStore((state) => state.logout);

  return (
    <div className="flex h-screen flex-col justify-between border-r bg-white">
      <div>
        <div className="flex h-16 items-center px-6">
          <Link href="/doctor">
            <span className="text-2xl font-bold">MediTro</span>
          </Link>
        </div>
        <nav className="flex-1 space-y-1 px-4 py-4">
          {navigation?.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  "flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-colors",
                  isActive
                    ? "bg-primary text-white"
                    : "text-gray-700 hover:bg-gray-100"
                )}
              >
                <item.icon className="mr-3 h-5 w-5" />
                {item.name}
              </Link>
            );
          })}
        </nav>
      </div>
      <div className="p-4 border-t">
        <button
          onClick={() => {
            logout();
            window.location.href = '/';
          }}
          className="flex w-full items-center px-4 py-3 text-sm font-medium rounded-lg text-red-600 hover:bg-red-50 transition-colors"
        >
          <LogOut className="mr-3 h-5 w-5" />
          Logout
        </button>
      </div>
    </div>
  );
} 