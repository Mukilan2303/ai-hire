"use client"

import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { cn } from "@/lib/utils"
import { useAppStore } from "@/lib/store"
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
  const router = useRouter()
  const { user, logout } = useAppStore()

  const handleLogout = () => {
    logout()
    router.push("/")
  }

  // Default values if user is not logged in
  const displayName = user?.name || "Guest User"
  const displayRole = user?.role || "Recruiter"
  const displayInitials = user?.initials || "GU"

  return (
    <aside className="fixed left-0 top-0 z-40 hidden h-screen w-64 flex-col border-r border-border/30 bg-sidebar/95 backdrop-blur-xl lg:flex glass-strong">
      {/* Logo Header with gradient */}
      <div className="flex h-16 items-center gap-2.5 border-b border-border/30 px-6">
        <div className="flex h-9 w-9 items-center justify-center rounded-xl gradient-purple-cyan glow-purple">
          <Brain className="h-5 w-5 text-white" />
        </div>
        <span className="text-lg font-bold tracking-tight text-sidebar-foreground gradient-text-purple">
          HireMind AI
        </span>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto px-3 py-4">
        <div className="flex flex-col gap-1">
          {navItems.map((item) => {
            const isActive = pathname === item.href
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "group relative flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-300 hover-lift",
                  isActive
                    ? "bg-gradient-purple-cyan text-white shadow-lg glow-purple"
                    : "text-muted-foreground hover:bg-sidebar-accent/50 hover:text-sidebar-foreground"
                )}
              >
                {/* Gradient background on hover for inactive items */}
                {!isActive && (
                  <div className="absolute inset-0 rounded-xl bg-gradient-purple-cyan opacity-0 transition-opacity duration-300 group-hover:opacity-10" />
                )}

                <item.icon className={cn(
                  "h-4 w-4 transition-transform duration-300 group-hover:scale-110",
                  isActive && "drop-shadow-lg"
                )} />
                <span className="relative z-10">{item.label}</span>

                {/* Active indicator */}
                {isActive && (
                  <div className="absolute right-2 h-2 w-2 rounded-full bg-white animate-pulse" />
                )}
              </Link>
            )
          })}
        </div>
      </nav>

      {/* User Profile */}
      <div className="border-t border-border/30 px-3 py-4">
        <div className="flex items-center gap-3 rounded-xl bg-sidebar-accent/50 px-3 py-2.5 backdrop-blur-sm glass">
          <div className="flex h-9 w-9 items-center justify-center rounded-full gradient-purple-pink text-sm font-bold text-white glow-pink">
            {displayInitials}
          </div>
          <div className="flex-1">
            <p className="text-sm font-semibold text-sidebar-foreground">{displayName}</p>
            <p className="text-xs text-muted-foreground">{displayRole}</p>
          </div>
          <button
            onClick={handleLogout}
            className="text-muted-foreground transition-all duration-300 hover:text-accent hover:scale-110"
            aria-label="Log out"
          >
            <LogOut className="h-4 w-4" />
          </button>
        </div>
      </div>
    </aside>
  )
}
