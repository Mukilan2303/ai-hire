"use client"

import { useState } from "react"
import { cn } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"
import { Star, ChevronRight } from "lucide-react"
import { CandidatePanel } from "./candidate-panel"
import { useAppStore, type CandidateFile } from "@/lib/store"

function getRiskColor(risk: string) {
  switch (risk) {
    case "low": return "bg-[#10B981]/10 text-[#10B981]"
    case "medium": return "bg-[#F59E0B]/10 text-[#F59E0B]"
    case "high": return "bg-destructive/10 text-destructive"
    default: return "bg-muted text-muted-foreground"
  }
}

function getScoreGradient(score: number) {
  if (score >= 85) return "from-primary to-[#06B6D4]"
  if (score >= 70) return "from-[#06B6D4] to-[#10B981]"
  if (score >= 50) return "from-[#F59E0B] to-[#06B6D4]"
  return "from-destructive to-[#F59E0B]"
}

function getScoreColor(score: number) {
  if (score >= 85) return "bg-[#10B981]"
  if (score >= 70) return "bg-[#06B6D4]"
  if (score >= 50) return "bg-[#F59E0B]"
  return "bg-destructive"
}

export function CandidateTable() {
  const { candidates } = useAppStore()
  const [selectedCandidate, setSelectedCandidate] = useState<CandidateFile | null>(null)

  // Only show parsed candidates, sorted by match score
  const rankedCandidates = candidates
    .filter((c) => c.status === "done")
    .sort((a, b) => b.matchScore - a.matchScore)
    .slice(0, 10)

  return (
    <>
      <div className="rounded-xl border border-border/50 bg-card/80 card-elevated overflow-hidden">
        <div className="flex items-center justify-between border-b border-border/50 px-6 py-4">
          <h2 className="text-base font-semibold text-foreground">Top Candidates</h2>
          <span className="text-sm text-muted-foreground">{rankedCandidates.length} candidates</span>
        </div>
        {rankedCandidates.length === 0 ? (
          <div className="px-6 py-12 text-center">
            <p className="text-sm text-muted-foreground mb-3">No candidates uploaded yet.</p>
            <a href="/dashboard/candidates" className="text-sm text-primary hover:underline">
              Upload resumes to get started →
            </a>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border/30">
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground">Rank</th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground">Candidate</th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground">Match Score</th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground">Success Prob.</th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground">Risk</th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground"><span className="sr-only">Actions</span></th>
                </tr>
              </thead>
              <tbody>
                {rankedCandidates.map((candidate, index) => (
                  <tr
                    key={candidate.id}
                    className={cn(
                      "cursor-pointer border-b border-border/20 transition-colors hover:bg-secondary/30",
                      index % 2 === 0 ? "bg-transparent" : "bg-secondary/10"
                    )}
                    onClick={() => setSelectedCandidate(candidate)}
                  >
                    <td className="px-6 py-4">
                      <span className="text-sm font-medium text-muted-foreground">#{index + 1}</span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary/10 text-sm font-medium text-primary">
                          {candidate.name.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase()}
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <p className="text-sm font-medium text-foreground">{candidate.name}</p>
                            {candidate.hiddenTalent && (
                              <Star className="h-3.5 w-3.5 text-[#F59E0B] fill-[#F59E0B]" />
                            )}
                          </div>
                          <p className="text-xs text-muted-foreground">{candidate.experience}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="h-2 w-24 overflow-hidden rounded-full bg-secondary">
                          <div
                            className={cn("h-full rounded-full bg-gradient-to-r", getScoreGradient(candidate.matchScore))}
                            style={{ width: `${candidate.matchScore}%` }}
                          />
                        </div>
                        <span className="text-sm font-medium text-foreground">{candidate.matchScore}%</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <div className={cn("h-2 w-2 rounded-full", getScoreColor(candidate.successProbability))} />
                        <span className="text-sm text-foreground">{candidate.successProbability}%</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <Badge variant="secondary" className={cn("text-xs", getRiskColor(candidate.risk))}>
                        {candidate.risk}
                      </Badge>
                    </td>
                    <td className="px-6 py-4">
                      <ChevronRight className="h-4 w-4 text-muted-foreground" />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <CandidatePanel
        candidate={selectedCandidate}
        onClose={() => setSelectedCandidate(null)}
      />
    </>
  )
}
