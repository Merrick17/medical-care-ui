"use client"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { LucideIcon } from "lucide-react"

interface SidebarProps {
  items: {
    title: string
    href: string
    icon: LucideIcon
  }[]
}

export function Sidebar({ items }: SidebarProps) {
  const pathname = usePathname()

  return (
    <div className="border-r bg-gray-100/40 w-64">
      <ScrollArea className="h-full py-6">
        <div className="space-y-4">
          <div className="px-3 py-2">
            <div className="space-y-1">
              {items.map((item) => (
                <Link key={item.href} href={item.href}>
                  <Button
                    variant={pathname === item.href ? "secondary" : "ghost"}
                    className={cn(
                      "w-full justify-start",
                      pathname === item.href
                        ? "bg-gray-200/80 hover:bg-gray-200/80"
                        : "hover:bg-gray-200/50"
                    )}
                  >
                    <item.icon className="mr-2 h-4 w-4" />
                    {item.title}
                  </Button>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </ScrollArea>
    </div>
  )
} 