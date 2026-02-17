"use client"

import { Briefcase, Users, TrendingUp, Clock } from "lucide-react"
import { useAppStore } from "@/lib/store"

export function StatCards() {
  const { jobs, candidates } = useAppStore()

  const activeJobs = jobs.filter((j) => j.status === "Active").length
  const totalCandidates = candidates.length
  const doneCandidates = candidates.filter((c) => c.status === "done")
  const avgMatch =
    doneCandidates.length > 0
      ? Math.round(doneCandidates.reduce((sum, c) => sum + c.matchScore, 0) / doneCandidates.length)
      : 0

  // Compute time-to-hire based on oldest active job
  const activeJobDates = jobs.filter((j) => j.status === "Active").map((j) => j.postedAt)
  const avgDays =
    activeJobDates.length > 0
      ? Math.round(
          activeJobDates.reduce((sum, d) => sum + (Date.now() - d.getTime()) / (1000 * 60 * 60 * 24), 0) /
            activeJobDates.length
        )
      : 0

  const stats = [
    {
      label: "Active Jobs",
      value: String(activeJobs),
      change: `${jobs.length} total positions`,
      icon: Briefcase,
      iconBg: "bg-primary/10",
      iconColor: "text-primary",
    },
    {
      label: "Total Candidates",
      value: totalCandidates.toLocaleString(),
      change: `${doneCandidates.length} parsed`,
      icon: Users,
      iconBg: "bg-[#10B981]/10",
      iconColor: "text-[#10B981]",
    },
    {
      label: "Avg. Match Score",
      value: `${avgMatch}%`,
      change: doneCandidates.length > 0 ? `Based on ${doneCandidates.length} candidates` : "No data yet",
      icon: TrendingUp,
      iconBg: "bg-[#06B6D4]/10",
      iconColor: "text-[#06B6D4]",
    },
    {
      label: "Avg. Time Active",
      value: `${avgDays}d`,
      change: activeJobDates.length > 0 ? `Across ${activeJobDates.length} active jobs` : "No active jobs",
      icon: Clock,
      iconBg: "bg-[#F59E0B]/10",
      iconColor: "text-[#F59E0B]",
    },
  ]

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat) => (
        <div
          key={stat.label}
          className="rounded-xl border border-border/50 bg-card/80 p-6 transition-all duration-300 hover:-translate-y-0.5 card-elevated"
        >
          <div className="flex items-center justify-between">
            <p className="text-sm text-muted-foreground">{stat.label}</p>
            <div className={`flex h-9 w-9 items-center justify-center rounded-lg ${stat.iconBg}`}>
              <stat.icon className={`h-4 w-4 ${stat.iconColor}`} />
            </div>
          </div>
          <p className="mt-3 text-2xl font-bold text-foreground">{stat.value}</p>
          <p className="mt-1 text-xs text-muted-foreground">{stat.change}</p>
        </div>
      ))}
    </div>
  )
}
