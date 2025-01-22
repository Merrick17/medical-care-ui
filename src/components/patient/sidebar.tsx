"use client";

import { Home, Calendar, FileText, User, Settings, LogOut } from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import useStore from "@/store";
import { AuthSlice } from "@/store/slices/authSlice";

const navigation = [
  { name: "Dashboard", href: "/patient", icon: Home },
  { name: "Appointments", href: "/patient/appointments", icon: Calendar },
  { name: "Medical History", href: "/patient/history", icon: FileText },
  { name: "Settings", href: "/patient/settings", icon: Settings },
];

export function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const logout = useStore((state: AuthSlice) => state.logout);

  const handleLogout = () => {
    logout();
    router.push("/auth/login");
  };

  return (
    <div className="flex h-full w-64 flex-col bg-white border-r">
      <div className="flex h-16 items-center px-6">
        <span className="text-2xl font-bold">MediTro</span>
      </div>
      <nav className="flex flex-col flex-1 space-y-1 px-4 py-4">
        <div className="flex-1 space-y-1">
          {navigation.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  "flex items-center px-4 py-3 text-sm font-medium rounded-lg",
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
        </div>
        <button
          onClick={handleLogout}
          className="flex items-center px-4 py-3 text-sm font-medium rounded-lg text-red-600 hover:bg-red-50"
        >
          <LogOut className="mr-3 h-5 w-5" />
          Logout
        </button>
      </nav>
    </div>
  );
} 