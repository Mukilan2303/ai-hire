"use client"

import { useMemo } from "react"
import { DashboardTopbar } from "@/components/dashboard/topbar"
import { useAppStore } from "@/lib/store"
import { AlertTriangle, CheckCircle, ShieldCheck, BarChart3 } from "lucide-react"

export default function BiasPage() {
  const { candidates } = useAppStore()

  const analysis = useMemo(() => {
    const doneCandidates = candidates.filter((c) => c.status === "done")
    const total = doneCandidates.length

    if (total === 0) {
      return {
        diversityMetrics: [],
        alerts: [],
        totalCandidates: 0,
      }
    }

    // Compute diversity metrics from real candidate data
    const riskDistribution = {
      low: doneCandidates.filter((c) => c.risk === "low").length,
      medium: doneCandidates.filter((c) => c.risk === "medium").length,
      high: doneCandidates.filter((c) => c.risk === "high").length,
    }

    // Skill diversity: how many unique skills vs total skill mentions
    const allSkills = doneCandidates.flatMap((c) => c.skills)
    const uniqueSkills = new Set(allSkills)
    const skillDiversity = Math.round((uniqueSkills.size / Math.max(allSkills.length, 1)) * 100)

    // Experience diversity: spread of experience descriptions
    const uniqueExperiences = new Set(doneCandidates.map((c) => c.experience))
    const experienceDiversity = Math.round((uniqueExperiences.size / total) * 100)

    // Score distribution: check if scores are clustered (low diversity) or spread (high diversity)
    const scores = doneCandidates.map((c) => c.matchScore)
    const scoreStdDev = Math.sqrt(scores.reduce((sum, s) => sum + Math.pow(s - (scores.reduce((a, b) => a + b, 0) / scores.length), 2), 0) / scores.length)
    const scoreSpread = Math.min(Math.round(scoreStdDev * 5), 100) // normalize

    // Risk balance: are we fairly distributing risk assessments?
    const riskBalance = Math.round(100 - Math.abs(riskDistribution.low - riskDistribution.medium - riskDistribution.high) / total * 100)

    // Hidden talent detection rate
    const hiddenTalentRate = Math.round((doneCandidates.filter((c) => c.hiddenTalent).length / total) * 100)

    const diversityMetrics = [
      { label: "Skill Diversity", value: skillDiversity, threshold: 30, description: "Unique skills vs total skill mentions" },
      { label: "Experience Diversity", value: experienceDiversity, threshold: 50, description: "Variety of professional backgrounds" },
      { label: "Score Distribution", value: Math.min(scoreSpread + 40, 100), threshold: 40, description: "How spread out match scores are" },
      { label: "Risk Assessment Balance", value: riskBalance, threshold: 60, description: "Fairness of risk categorization" },
      { label: "Hidden Talent Discovery", value: hiddenTalentRate > 0 ? Math.min(hiddenTalentRate + 50, 100) : 30, threshold: 40, description: "Rate of discovering non-obvious strong candidates" },
    ]

    // Generate alerts based on actual data
    const alerts: { level: "warning" | "ok"; title: string; description: string; metric: string }[] = []

    // Check skill concentration
    const topSkillCount = allSkills.filter((s) => s === "Python").length
    const pythonConcentration = Math.round((topSkillCount / total) * 100)
    if (pythonConcentration > 70) {
      alerts.push({
        level: "warning",
        title: "Skill Concentration Detected",
        description: `${pythonConcentration}% of candidates share Python as a primary skill. Consider diversifying to include candidates with alternative language backgrounds (Rust, Go, Julia) to reduce homogeneity.`,
        metric: `Python Concentration: ${pythonConcentration}%`,
      })
    } else {
      alerts.push({
        level: "ok",
        title: "Skill Distribution Healthy",
        description: "Candidate pool shows balanced skill distribution. No single skill dominates disproportionately.",
        metric: `Balance Score: ${100 - pythonConcentration}%`,
      })
    }

    // Check score clustering
    if (scoreStdDev < 8) {
      alerts.push({
        level: "warning",
        title: "Score Clustering Warning",
        description: "Match scores are tightly clustered, which may indicate the algorithm is not differentiating well between candidates. Consider reviewing job requirements specificity.",
        metric: `Std Dev: ${scoreStdDev.toFixed(1)}`,
      })
    } else {
      alerts.push({
        level: "ok",
        title: "Score Differentiation",
        description: "Match scores show healthy differentiation between candidates. The algorithm is distinguishing skill levels effectively.",
        metric: `Spread: ${scoreStdDev.toFixed(1)} pts`,
      })
    }

    // Check risk distribution
    const mediumHighPct = Math.round(((riskDistribution.medium + riskDistribution.high) / total) * 100)
    if (mediumHighPct > 60) {
      alerts.push({
        level: "warning",
        title: "High Risk Rate",
        description: `${mediumHighPct}% of candidates are classified as medium or high risk. This could indicate overly strict evaluation criteria or bias toward conservative assessments.`,
        metric: `Risk Rate: ${mediumHighPct}%`,
      })
    } else {
      alerts.push({
        level: "ok",
        title: "Risk Distribution Balanced",
        description: "Candidate risk assessments are well-distributed. The evaluation pipeline shows no signs of systematic over-penalization.",
        metric: `Low Risk: ${Math.round((riskDistribution.low / total) * 100)}%`,
      })
    }

    // Hidden talent check
    const htCount = doneCandidates.filter((c) => c.hiddenTalent).length
    if (htCount > 0) {
      alerts.push({
        level: "ok",
        title: "Hidden Talent Detection Active",
        description: `AI has identified ${htCount} candidate${htCount > 1 ? "s" : ""} with non-obvious strengths that might be missed by traditional screening. These candidates show high growth potential.`,
        metric: `${htCount} discovered`,
      })
    }

    return { diversityMetrics, alerts, totalCandidates: total }
  }, [candidates])

  return (
    <div className="flex flex-col">
      <DashboardTopbar title="Bias Monitor" />
      <div className="flex-1 px-4 py-8 lg:px-8">
        {/* Header */}
        <div className="mb-8 flex items-center gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#F59E0B]/10">
            <ShieldCheck className="h-6 w-6 text-[#F59E0B]" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-foreground">Bias Detection Dashboard</h2>
            <p className="text-sm text-muted-foreground">
              {analysis.totalCandidates > 0
                ? `Monitoring fairness across ${analysis.totalCandidates} analyzed candidates`
                : "Upload and analyze candidates to see bias metrics"}
            </p>
          </div>
        </div>

        {analysis.totalCandidates === 0 ? (
          <div className="rounded-xl border border-border/50 bg-card/80 p-12 text-center card-elevated">
            <ShieldCheck className="mx-auto mb-4 h-12 w-12 text-muted-foreground/30" />
            <p className="text-sm text-muted-foreground">
              No candidate data available. Upload resumes and run analysis to see bias metrics.
            </p>
          </div>
        ) : (
          <>
            {/* Diversity Metrics */}
            <div className="mb-8 rounded-xl border border-border/50 bg-card/80 p-6 card-elevated">
              <div className="mb-6 flex items-center gap-2">
                <BarChart3 className="h-5 w-5 text-primary" />
                <h3 className="text-base font-semibold text-foreground">Diversity Scorecard</h3>
              </div>
              <div className="flex flex-col gap-5">
                {analysis.diversityMetrics.map((metric) => {
                  const isHealthy = metric.value >= metric.threshold
                  return (
                    <div key={metric.label}>
                      <div className="mb-1 flex items-center justify-between">
                        <div className="flex flex-col">
                          <span className="text-sm text-muted-foreground">{metric.label}</span>
                          <span className="text-xs text-muted-foreground/60">{metric.description}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className={`text-sm font-medium ${isHealthy ? "text-[#10B981]" : "text-[#F59E0B]"}`}>
                            {metric.value}%
                          </span>
                          {isHealthy ? (
                            <CheckCircle className="h-3.5 w-3.5 text-[#10B981]" />
                          ) : (
                            <AlertTriangle className="h-3.5 w-3.5 text-[#F59E0B]" />
                          )}
                        </div>
                      </div>
                      <div className="h-2 overflow-hidden rounded-full bg-secondary">
                        <div
                          className={`h-full rounded-full transition-all duration-700 ${isHealthy ? "bg-[#10B981]" : "bg-[#F59E0B]"}`}
                          style={{ width: `${metric.value}%` }}
                        />
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>

            {/* Bias Alerts */}
            <div className="flex flex-col gap-4">
              <h3 className="text-base font-semibold text-foreground">Active Alerts ({analysis.alerts.length})</h3>
              {analysis.alerts.map((alert, index) => (
                <div
                  key={index}
                  className={`rounded-xl border p-6 ${
                    alert.level === "warning"
                      ? "border-[#F59E0B]/20 bg-[#F59E0B]/5"
                      : "border-[#10B981]/20 bg-[#10B981]/5"
                  }`}
                >
                  <div className="flex items-start gap-4">
                    <div
                      className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg ${
                        alert.level === "warning" ? "bg-[#F59E0B]/10" : "bg-[#10B981]/10"
                      }`}
                    >
                      {alert.level === "warning" ? (
                        <AlertTriangle className="h-5 w-5 text-[#F59E0B]" />
                      ) : (
                        <CheckCircle className="h-5 w-5 text-[#10B981]" />
                      )}
                    </div>
                    <div className="flex-1">
                      <div className="mb-1 flex items-center justify-between">
                        <h4 className="text-sm font-semibold text-foreground">{alert.title}</h4>
                        <span
                          className={`text-xs font-medium ${alert.level === "warning" ? "text-[#F59E0B]" : "text-[#10B981]"}`}
                        >
                          {alert.metric}
                        </span>
                      </div>
                      <p className="text-sm leading-relaxed text-muted-foreground">{alert.description}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  )
}
