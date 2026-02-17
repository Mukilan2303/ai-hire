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
      gradient: "gradient-purple-cyan",
      glowClass: "glow-purple",
    },
    {
      label: "Total Candidates",
      value: totalCandidates.toLocaleString(),
      change: `${doneCandidates.length} parsed`,
      icon: Users,
      gradient: "gradient-cyan-green",
      glowClass: "glow-cyan",
    },
    {
      label: "Avg. Match Score",
      value: `${avgMatch}%`,
      change: doneCandidates.length > 0 ? `Based on ${doneCandidates.length} candidates` : "No data yet",
      icon: TrendingUp,
      gradient: "gradient-purple-pink",
      glowClass: "glow-pink",
    },
    {
      label: "Avg. Time Active",
      value: `${avgDays}d`,
      change: activeJobDates.length > 0 ? `Across ${activeJobDates.length} active jobs` : "No active jobs",
      icon: Clock,
      gradient: "gradient-cyan-green",
      glowClass: "glow-cyan",
    },
  ]

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat, index) => (
        <div
          key={stat.label}
          className="group relative overflow-hidden rounded-xl border border-border/30 bg-card/60 p-6 backdrop-blur-sm transition-all duration-500 hover:-translate-y-1 hover:shadow-2xl card-hover fade-in-up glass"
          style={{ animationDelay: `${index * 100}ms` }}
        >
          {/* Gradient background on hover */}
          <div className={`absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-10 ${stat.gradient}`} />

          <div className="relative z-10">
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium text-muted-foreground">{stat.label}</p>
              <div className={`flex h-11 w-11 items-center justify-center rounded-xl ${stat.gradient} ${stat.glowClass} transition-all duration-300 group-hover:scale-110`}>
                <stat.icon className="h-5 w-5 text-white" />
              </div>
            </div>
            <p className="mt-4 text-3xl font-bold text-foreground gradient-text-purple">{stat.value}</p>
            <p className="mt-2 text-xs text-muted-foreground/80">{stat.change}</p>
          </div>

          {/* Shimmer effect on hover */}
          <div className="absolute inset-0 -translate-x-full opacity-0 transition-all duration-1000 group-hover:translate-x-full group-hover:opacity-100 shimmer" />
        </div>
      ))}
    </div>
  )
}
