"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Search, Bell, Brain, Menu, X, LayoutDashboard, Briefcase, Users, Sparkles, ShieldAlert, MessageSquare, Settings } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

const mobileNavItems = [
  { label: "Dashboard", icon: LayoutDashboard, href: "/dashboard" },
  { label: "Jobs", icon: Briefcase, href: "/dashboard/jobs" },
  { label: "Candidates", icon: Users, href: "/dashboard/candidates" },
  { label: "AI Insights", icon: Sparkles, href: "/dashboard/insights" },
  { label: "Bias Monitor", icon: ShieldAlert, href: "/dashboard/bias" },
  { label: "Copilot", icon: MessageSquare, href: "/dashboard/copilot" },
  { label: "Settings", icon: Settings, href: "/dashboard/settings" },
]

export function DashboardTopbar({ title }: { title: string }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const pathname = usePathname()

  return (
    <>
      <header className="flex h-16 items-center justify-between border-b border-border/50 bg-background/80 px-4 backdrop-blur-sm lg:px-8">
        <div className="flex items-center gap-3">
          <button
            className="lg:hidden text-muted-foreground hover:text-foreground"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle navigation"
          >
            {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
          <Link href="/dashboard" className="flex items-center gap-2 lg:hidden">
            <div className="flex h-7 w-7 items-center justify-center rounded-md bg-primary">
              <Brain className="h-4 w-4 text-primary-foreground" />
            </div>
          </Link>
          <h1 className="text-lg font-semibold text-foreground">{title}</h1>
        </div>
        <div className="flex items-center gap-4">
          <div className="relative hidden md:block">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search candidates, jobs..."
              className="w-64 border-border/50 bg-secondary/50 pl-9 text-foreground placeholder:text-muted-foreground/50"
            />
          </div>
          <Button variant="ghost" size="icon" className="relative text-muted-foreground" aria-label="Notifications">
            <Bell className="h-4 w-4" />
            <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-primary" />
          </Button>
        </div>
      </header>

      {/* Mobile Navigation Drawer */}
      {mobileMenuOpen && (
        <div className="border-b border-border/50 bg-card/95 backdrop-blur-xl lg:hidden">
          <nav className="flex flex-col gap-1 px-3 py-3">
            {mobileNavItems.map((item) => {
              const isActive = pathname === item.href
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={cn(
                    "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                    isActive
                      ? "bg-secondary text-primary"
                      : "text-muted-foreground hover:bg-secondary/50 hover:text-foreground"
                  )}
                >
                  <item.icon className="h-4 w-4" />
                  {item.label}
                </Link>
              )
            })}
          </nav>
        </div>
      )}
    </>
  )
}
