"use client"
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  Users,
  Building2,
  Calendar,
  Settings,
  LogOut,
} from "lucide-react";
import useStore from "@/store";

const navigation = [
  { name: "Dashboard", href: "/admin", icon: LayoutDashboard },
  { name: "Doctors", href: "/admin/doctors", icon: Users },
  { name: "Patients", href: "/admin/patients", icon: Users },
  { name: "Departments", href: "/admin/departments", icon: Building2 },
  { name: "Appointments", href: "/admin/appointments", icon: Calendar },
];

export function AdminSidebar() {
  const pathname = usePathname();
  const logout = useStore((state) => state.logout);

  return (
    <div className="flex h-screen flex-col justify-between border-r bg-background/95 px-4 py-6">
      <div className="space-y-4">
        <div className="px-3">
          <h2 className="mb-2 text-lg font-semibold tracking-tight">Admin Panel</h2>
          <p className="text-sm text-muted-foreground">
            Hospital Management System
          </p>
        </div>
        <nav className="space-y-1">
          {navigation.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-all hover:bg-accent hover:text-accent-foreground",
                pathname === item.href
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground"
              )}
            >
              <item.icon className="h-4 w-4" />
              {item.name}
            </Link>
          ))}
        </nav>
      </div>
      <div className="space-y-4">
        <button
          onClick={() => logout()}
          className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-destructive transition-all hover:bg-destructive hover:text-destructive-foreground"
        >
          <LogOut className="h-4 w-4" />
          Logout
        </button>
      </div>
    </div>
  );
} 