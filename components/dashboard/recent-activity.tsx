"use client"

import { Users, FileText, Sparkles, ShieldAlert, Briefcase } from "lucide-react"
import { useAppStore, formatRelativeTime } from "@/lib/store"
import type { ActivityEvent } from "@/lib/store"

const iconMap: Record<ActivityEvent["icon"], { icon: typeof Users; bg: string; color: string }> = {
  candidates: { icon: Users, bg: "bg-primary/10", color: "text-primary" },
  analysis: { icon: Sparkles, bg: "bg-[#10B981]/10", color: "text-[#10B981]" },
  bias: { icon: ShieldAlert, bg: "bg-[#F59E0B]/10", color: "text-[#F59E0B]" },
  questions: { icon: FileText, bg: "bg-[#06B6D4]/10", color: "text-[#06B6D4]" },
  job: { icon: Briefcase, bg: "bg-primary/10", color: "text-primary" },
}

export function RecentActivity() {
  const { activities } = useAppStore()

  return (
    <div className="rounded-xl border border-border/50 bg-card/80 card-elevated">
      <div className="border-b border-border/50 px-6 py-4">
        <h2 className="text-base font-semibold text-foreground">Recent Activity</h2>
      </div>
      <div className="flex flex-col">
        {activities.length === 0 ? (
          <div className="px-6 py-8 text-center">
            <p className="text-sm text-muted-foreground">No activity yet</p>
          </div>
        ) : (
          activities.slice(0, 10).map((activity) => {
            const config = iconMap[activity.icon]
            const IconComponent = config.icon
            return (
              <div
                key={activity.id}
                className="flex items-start gap-4 border-b border-border/20 px-6 py-4 last:border-b-0"
              >
                <div className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg ${config.bg}`}>
                  <IconComponent className={`h-4 w-4 ${config.color}`} />
                </div>
                <div className="flex-1">
                  <p className="text-sm text-foreground/80">{activity.text}</p>
                  <p className="mt-1 text-xs text-muted-foreground">
                    {formatRelativeTime(activity.timestamp)}
                  </p>
                </div>
              </div>
            )
          })
        )}
      </div>
    </div>
  )
}
