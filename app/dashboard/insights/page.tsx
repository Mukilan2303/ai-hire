"use client"

import { useMemo, useState } from "react"
import { DashboardTopbar } from "@/components/dashboard/topbar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { useAppStore } from "@/lib/store"
import { Sparkles, TrendingUp, Users, Target, Copy, CheckCircle } from "lucide-react"

const interviewQuestionBank = {
  technical: [
    "Describe a machine learning model you built from scratch and took to production. What were the key challenges?",
    "How would you handle a scenario where your training data has significant class imbalance?",
    "Explain the difference between batch and online learning. When would you use each?",
  ],
  behavioral: [
    "Tell me about a time you had to simplify a complex technical concept for a non-technical stakeholder.",
    "Describe a situation where you disagreed with a team decision. How did you handle it?",
    "How do you prioritize when working on multiple projects with competing deadlines?",
  ],
  scenario: [
    "You discover that your deployed model's accuracy has dropped 15% over the past month. Walk me through your debugging process.",
    "A stakeholder wants a model deployed by next week, but you believe it needs more testing. How would you approach this?",
    "How would you design a real-time recommendation system that needs to handle 10,000 requests per second?",
  ],
}

export default function InsightsPage() {
  const { candidates, jobs } = useAppStore()
  const [copiedIndex, setCopiedIndex] = useState<string | null>(null)

  function copyQuestion(question: string, id: string) {
    navigator.clipboard.writeText(question)
    setCopiedIndex(id)
    setTimeout(() => setCopiedIndex(null), 2000)
  }

  const insights = useMemo(() => {
    const doneCandidates = candidates.filter((c) => c.status === "done")
    const totalCandidates = doneCandidates.length
    const avgMatch = totalCandidates > 0
      ? Math.round(doneCandidates.reduce((sum, c) => sum + c.matchScore, 0) / totalCandidates)
      : 0

    // Top candidate
    const topCandidate = doneCandidates.sort((a, b) => b.matchScore - a.matchScore)[0]

    // Skill frequency
    const skillCount: Record<string, number> = {}
    doneCandidates.forEach((c) => c.skills.forEach((s) => { skillCount[s] = (skillCount[s] || 0) + 1 }))
    const topSkills = Object.entries(skillCount).sort((a, b) => b[1] - a[1]).slice(0, 5)
    const rareSkills = Object.entries(skillCount).filter(([, count]) => count === 1).map(([skill]) => skill)

    // Pipeline stages derived from data
    const screened = doneCandidates.filter((c) => c.matchScore >= 50).length
    const shortlisted = doneCandidates.filter((c) => c.matchScore >= 75).length
    const interview = doneCandidates.filter((c) => c.matchScore >= 85).length
    const offer = doneCandidates.filter((c) => c.matchScore >= 92).length

    // Low risk percentage
    const lowRisk = doneCandidates.filter((c) => c.risk === "low").length
    const lowRiskPct = totalCandidates > 0 ? Math.round((lowRisk / totalCandidates) * 100) : 0

    return {
      totalCandidates,
      avgMatch,
      topCandidate,
      topSkills,
      rareSkills,
      pipeline: [
        { stage: "Applied", count: totalCandidates, percent: 100, color: "bg-primary" },
        { stage: "AI Screened", count: screened, percent: totalCandidates > 0 ? Math.round((screened / totalCandidates) * 100) : 0, color: "bg-[#06B6D4]" },
        { stage: "Shortlisted", count: shortlisted, percent: totalCandidates > 0 ? Math.round((shortlisted / totalCandidates) * 100) : 0, color: "bg-[#10B981]" },
        { stage: "Interview", count: interview, percent: totalCandidates > 0 ? Math.round((interview / totalCandidates) * 100) : 0, color: "bg-[#F59E0B]" },
        { stage: "Offer", count: offer, percent: totalCandidates > 0 ? Math.round((offer / totalCandidates) * 100) : 0, color: "bg-[#8B5CF6]" },
      ],
      lowRiskPct,
      activeJobs: jobs.filter((j) => j.status === "Active").length,
    }
  }, [candidates, jobs])

  return (
    <div className="flex flex-col">
      <DashboardTopbar title="AI Insights" />
      <div className="flex-1 px-4 py-8 lg:px-8">
        {/* Key Insights - data driven */}
        <div className="mb-8 grid gap-6 md:grid-cols-3">
          <div className="rounded-xl border border-primary/20 bg-primary/5 p-6">
            <div className="mb-4 flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-primary" />
              <span className="text-sm font-semibold text-primary">Top Insight</span>
            </div>
            <p className="text-sm leading-relaxed text-foreground/80">
              {insights.topCandidate
                ? `${insights.topCandidate.name} is a standout candidate with a ${insights.topCandidate.matchScore}% match score. ${insights.topCandidate.summary}`
                : "Upload and analyze candidates to see AI-generated insights here."}
            </p>
          </div>
          <div className="rounded-xl border border-[#10B981]/20 bg-[#10B981]/5 p-6">
            <div className="mb-4 flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-[#10B981]" />
              <span className="text-sm font-semibold text-[#10B981]">Pipeline Health</span>
            </div>
            <p className="text-sm leading-relaxed text-foreground/80">
              {insights.totalCandidates > 0
                ? `${insights.totalCandidates} candidates analyzed with an average match score of ${insights.avgMatch}%. ${insights.lowRiskPct}% are low-risk hires.`
                : "No candidate data available yet. Start by uploading resumes."}
            </p>
          </div>
          <div className="rounded-xl border border-[#06B6D4]/20 bg-[#06B6D4]/5 p-6">
            <div className="mb-4 flex items-center gap-2">
              <Target className="h-4 w-4 text-[#06B6D4]" />
              <span className="text-sm font-semibold text-[#06B6D4]">Skills Gap</span>
            </div>
            <p className="text-sm leading-relaxed text-foreground/80">
              {insights.topSkills.length > 0
                ? `Most common skills: ${insights.topSkills.map(([s]) => s).join(", ")}. ${insights.rareSkills.length > 0 ? `Rare skills found: ${insights.rareSkills.slice(0, 3).join(", ")}.` : "No rare skill gaps detected."}`
                : "Skill analysis will appear once candidates are processed."}
            </p>
          </div>
        </div>

        {/* Pipeline Funnel */}
        <div className="mb-8 rounded-xl border border-border/50 bg-card/80 p-6 card-elevated">
          <div className="mb-6 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Users className="h-5 w-5 text-primary" />
              <h2 className="text-base font-semibold text-foreground">Candidate Pipeline</h2>
            </div>
            <span className="text-sm text-muted-foreground">{insights.activeJobs} active jobs</span>
          </div>
          <div className="flex flex-col gap-3">
            {insights.pipeline.map((stage) => (
              <div key={stage.stage} className="flex items-center gap-4">
                <span className="w-24 text-sm text-muted-foreground">{stage.stage}</span>
                <div className="h-3 flex-1 overflow-hidden rounded-full bg-secondary">
                  <div
                    className={`h-full rounded-full ${stage.color} transition-all duration-700`}
                    style={{ width: `${Math.max(stage.percent, stage.count > 0 ? 2 : 0)}%` }}
                  />
                </div>
                <span className="w-16 text-right text-sm font-medium text-foreground">{stage.count.toLocaleString()}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Top Skills Distribution */}
        {insights.topSkills.length > 0 && (
          <div className="mb-8 rounded-xl border border-border/50 bg-card/80 p-6 card-elevated">
            <div className="mb-6 flex items-center gap-3">
              <Sparkles className="h-5 w-5 text-primary" />
              <h2 className="text-base font-semibold text-foreground">Top Skills Across Candidates</h2>
            </div>
            <div className="flex flex-col gap-3">
              {insights.topSkills.map(([skill, count]) => {
                const pct = Math.round((count / insights.totalCandidates) * 100)
                return (
                  <div key={skill} className="flex items-center gap-4">
                    <span className="w-28 text-sm text-muted-foreground">{skill}</span>
                    <div className="h-3 flex-1 overflow-hidden rounded-full bg-secondary">
                      <div className="h-full rounded-full bg-primary transition-all duration-700" style={{ width: `${pct}%` }} />
                    </div>
                    <span className="w-20 text-right text-sm text-foreground">{count} ({pct}%)</span>
                  </div>
                )
              })}
            </div>
          </div>
        )}

        {/* Interview Questions Generator */}
        <div className="rounded-xl border border-border/50 bg-card/80 card-elevated">
          <div className="border-b border-border/50 px-6 py-4">
            <div className="flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-primary" />
              <h2 className="text-base font-semibold text-foreground">AI-Generated Interview Questions</h2>
            </div>
            <p className="mt-1 text-sm text-muted-foreground">
              {insights.topCandidate
                ? `Personalized questions based on ${insights.topCandidate.name}'s profile and top skills`
                : "Personalized questions for your candidates"}
            </p>
          </div>
          <div className="p-6">
            {Object.entries(interviewQuestionBank).map(([category, questions]) => (
              <div key={category} className="mb-8 last:mb-0">
                <h3 className="mb-4 text-sm font-semibold capitalize text-foreground">{category} Questions</h3>
                <div className="flex flex-col gap-3">
                  {questions.map((q, i) => {
                    const id = `${category}-${i}`
                    return (
                      <div key={id} className="flex items-start gap-3 rounded-lg bg-secondary/30 px-4 py-3">
                        <span className="mt-0.5 flex-1 text-sm text-foreground/80">{q}</span>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="shrink-0 h-7 w-7 text-muted-foreground hover:text-foreground"
                          onClick={() => copyQuestion(q, id)}
                          aria-label="Copy question"
                        >
                          {copiedIndex === id ? (
                            <CheckCircle className="h-3.5 w-3.5 text-[#10B981]" />
                          ) : (
                            <Copy className="h-3.5 w-3.5" />
                          )}
                        </Button>
                      </div>
                    )
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
