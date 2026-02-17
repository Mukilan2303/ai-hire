"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import {
  Brain,
  LayoutDashboard,
  Briefcase,
  Users,
  Sparkles,
  ShieldAlert,
  MessageSquare,
  Settings,
  LogOut,
} from "lucide-react"

const navItems = [
  { label: "Dashboard", icon: LayoutDashboard, href: "/dashboard" },
  { label: "Jobs", icon: Briefcase, href: "/dashboard/jobs" },
  { label: "Candidates", icon: Users, href: "/dashboard/candidates" },
  { label: "AI Insights", icon: Sparkles, href: "/dashboard/insights" },
  { label: "Bias Monitor", icon: ShieldAlert, href: "/dashboard/bias" },
  { label: "Copilot", icon: MessageSquare, href: "/dashboard/copilot" },
  { label: "Settings", icon: Settings, href: "/dashboard/settings" },
]

export function DashboardSidebar() {
  const pathname = usePathname()

  return (
    <aside className="fixed left-0 top-0 z-40 hidden h-screen w-64 flex-col border-r border-border/50 bg-sidebar lg:flex">
      <div className="flex h-16 items-center gap-2.5 border-b border-border/50 px-6">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
          <Brain className="h-5 w-5 text-primary-foreground" />
        </div>
        <span className="text-lg font-semibold tracking-tight text-sidebar-foreground">
          HireMind AI
        </span>
      </div>

      <nav className="flex-1 overflow-y-auto px-3 py-4">
        <div className="flex flex-col gap-1">
          {navItems.map((item) => {
            const isActive = pathname === item.href
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200",
                  isActive
                    ? "bg-sidebar-accent text-sidebar-primary"
                    : "text-muted-foreground hover:bg-sidebar-accent/50 hover:text-sidebar-foreground"
                )}
              >
                <item.icon className="h-4 w-4" />
                {item.label}
              </Link>
            )
          })}
        </div>
      </nav>

      <div className="border-t border-border/50 px-3 py-4">
        <div className="flex items-center gap-3 rounded-lg px-3 py-2.5">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/20 text-sm font-medium text-primary">
            JS
          </div>
          <div className="flex-1">
            <p className="text-sm font-medium text-sidebar-foreground">Jane Smith</p>
            <p className="text-xs text-muted-foreground">Recruiter</p>
          </div>
          <Link href="/" className="text-muted-foreground hover:text-foreground transition-colors" aria-label="Log out">
            <LogOut className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </aside>
  )
}
