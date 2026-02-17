"use client"

import { useState } from "react"
import { X, Sparkles, Star, CheckCircle, AlertTriangle, FileText, Copy, CheckCircle2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import type { CandidateFile } from "@/lib/store"

type Candidate = CandidateFile

function getGaugeColor(score: number) {
  if (score >= 80) return "#10B981"
  if (score >= 60) return "#F59E0B"
  return "#EF4444"
}

// Generate personalized interview questions based on candidate profile
function generateInterviewQuestions(candidate: Candidate) {
  const skills = candidate.skills
  const primarySkill = skills[0] || "technical"
  const secondarySkill = skills[1] || "problem-solving"
  const tertiarySkill = skills[2] || "system design"

  return {
    technical: [
      `Can you walk me through a ${primarySkill} project you built from scratch and took to production?`,
      `How would you approach ${secondarySkill} challenges in a high-scale production environment?`,
      `Explain your experience with ${tertiarySkill} and describe best practices you follow.`,
      `Describe a time when you had to optimize performance in a ${primarySkill} application. What was your approach?`,
      `How do you stay current with ${primarySkill} developments and new technologies?`,
    ],
    behavioral: [
      "Tell me about a time you had to simplify a complex technical concept for a non-technical stakeholder.",
      "Describe a situation where you disagreed with a team decision. How did you handle it?",
      "How do you prioritize when working on multiple projects with competing deadlines?",
      "Tell me about a time you made a mistake in your code. How did you handle it?",
      "Describe your approach to code reviews and giving/receiving feedback.",
    ],
    scenario: [
      `You discover that your deployed ${primarySkill} model's accuracy has dropped 15% over the past month. Walk me through your debugging process.`,
      `A stakeholder wants a ${secondarySkill} solution deployed by next week, but you believe it needs more testing. How would you approach this?`,
      `How would you design a scalable ${tertiarySkill} system that needs to handle 10,000 requests per second?`,
      `If you joined our team and found legacy code with no documentation, how would you approach understanding and improving it?`,
    ],
  }
}

export function CandidatePanel({
  candidate,
  onClose,
}: {
  candidate: Candidate | null
  onClose: () => void
}) {
  const [showQuestions, setShowQuestions] = useState(false)
  const [copiedIndex, setCopiedIndex] = useState<string | null>(null)

  if (!candidate) return null

  const gaugeColor = getGaugeColor(candidate.successProbability)
  const circumference = 2 * Math.PI * 54
  const dashOffset = circumference - (candidate.successProbability / 100) * circumference

  const questions = generateInterviewQuestions(candidate)

  function copyQuestion(question: string, id: string) {
    navigator.clipboard.writeText(question)
    setCopiedIndex(id)
    setTimeout(() => setCopiedIndex(null), 2000)
  }

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      {/* Overlay */}
      <div className="absolute inset-0 bg-background/60 backdrop-blur-sm" onClick={onClose} />

      {/* Panel */}
      <div className="relative z-10 flex h-full w-full max-w-lg flex-col overflow-y-auto border-l border-border/50 bg-card">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-border/50 px-6 py-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-sm font-bold text-primary">
              {candidate.name.split(" ").map(n => n[0]).join("")}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-semibold text-foreground">{candidate.name}</h2>
                {candidate.hiddenTalent && (
                  <Badge className="bg-[#F59E0B]/10 text-[#F59E0B] text-xs">
                    <Star className="mr-1 h-3 w-3 fill-[#F59E0B]" />
                    High Growth Potential
                  </Badge>
                )}
              </div>
              <p className="text-sm text-muted-foreground">{candidate.experience}</p>
            </div>
          </div>
          <Button variant="ghost" size="icon" onClick={onClose} aria-label="Close panel">
            <X className="h-4 w-4" />
          </Button>
        </div>

        <div className="flex-1 px-6 py-6">
          {!showQuestions ? (
            <>
              {/* Success Prediction Gauge */}
              <div className="mb-8 flex flex-col items-center rounded-xl border border-border/50 bg-secondary/30 p-6">
                <p className="mb-4 text-sm font-medium text-muted-foreground">Success Probability</p>
                <div className="relative h-32 w-32">
                  <svg className="h-32 w-32 -rotate-90" viewBox="0 0 120 120" aria-label={`Success probability: ${candidate.successProbability}%`}>
                    <circle cx="60" cy="60" r="54" fill="none" stroke="currentColor" strokeWidth="8" className="text-secondary" />
                    <circle
                      cx="60"
                      cy="60"
                      r="54"
                      fill="none"
                      stroke={gaugeColor}
                      strokeWidth="8"
                      strokeLinecap="round"
                      strokeDasharray={circumference}
                      strokeDashoffset={dashOffset}
                      className="transition-all duration-1000"
                    />
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="text-3xl font-bold text-foreground">{candidate.successProbability}%</span>
                  </div>
                </div>
              </div>

              {/* AI Insight Card */}
              <div className="mb-6 rounded-xl border border-primary/20 bg-primary/5 p-5">
                <div className="mb-3 flex items-center gap-2">
                  <Sparkles className="h-4 w-4 text-primary" />
                  <span className="text-sm font-semibold text-primary">AI Insight</span>
                </div>
                <p className="text-sm leading-relaxed text-foreground/80">{candidate.summary}</p>
              </div>

              {/* Skills */}
              <div className="mb-6">
                <h3 className="mb-3 text-sm font-semibold text-foreground">Skills</h3>
                <div className="flex flex-wrap gap-2">
                  {candidate.skills.map((skill) => (
                    <Badge key={skill} variant="secondary" className="bg-secondary/80 text-secondary-foreground">
                      {skill}
                    </Badge>
                  ))}
                </div>
              </div>

              {/* Strengths */}
              <div className="mb-6">
                <h3 className="mb-3 text-sm font-semibold text-foreground">Strengths</h3>
                <div className="flex flex-col gap-2">
                  {candidate.strengths.map((s) => (
                    <div key={s} className="flex items-start gap-2">
                      <CheckCircle className="mt-0.5 h-4 w-4 shrink-0 text-[#10B981]" />
                      <span className="text-sm text-foreground/80">{s}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Gaps */}
              {candidate.gaps.length > 0 && (
                <div className="mb-6">
                  <h3 className="mb-3 text-sm font-semibold text-foreground">Skill Gaps</h3>
                  <div className="flex flex-col gap-2">
                    {candidate.gaps.map((g) => (
                      <div key={g} className="flex items-start gap-2">
                        <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-[#F59E0B]" />
                        <span className="text-sm text-foreground/80">{g}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Why Not Selected (for lower-ranked) */}
              {candidate.matchScore < 80 && (
                <div className="mb-6 rounded-xl border border-border/50 bg-secondary/30 p-5">
                  <div className="mb-3 flex items-center gap-2">
                    <FileText className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm font-semibold text-foreground">Why Not Top Ranked</span>
                  </div>
                  <p className="text-sm leading-relaxed text-muted-foreground">
                    This candidate shows potential but ranks lower due to {candidate.gaps.length > 0 ? candidate.gaps.join(", ").toLowerCase() : "fewer matching core competencies"}.
                    Consider for future roles that better align with their background.
                  </p>
                </div>
              )}

              {/* Actions */}
              <div className="flex gap-3">
                <Button className="glow-indigo flex-1" onClick={() => setShowQuestions(true)}>
                  Generate Interview Questions
                </Button>
                <Button variant="outline" className="border-border/50">
                  <FileText className="h-4 w-4" />
                  <span className="sr-only">View resume</span>
                </Button>
              </div>
            </>
          ) : (
            <>
              {/* Interview Questions View */}
              <div className="mb-6">
                <div className="mb-4 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Sparkles className="h-5 w-5 text-primary" />
                    <h3 className="text-base font-semibold text-foreground">Interview Questions</h3>
                  </div>
                  <Button variant="ghost" size="sm" onClick={() => setShowQuestions(false)}>
                    <X className="h-4 w-4 mr-1" />
                    Close
                  </Button>
                </div>
                <p className="text-sm text-muted-foreground mb-6">
                  Personalized questions for <span className="font-medium text-foreground">{candidate.name}</span> based on their skills and experience.
                </p>

                {/* Technical Questions */}
                <div className="mb-6">
                  <h4 className="mb-3 text-sm font-semibold text-foreground">Technical Questions</h4>
                  <div className="flex flex-col gap-2">
                    {questions.technical.map((q, i) => {
                      const id = `tech-${i}`
                      return (
                        <div key={id} className="flex items-start gap-2 rounded-lg bg-secondary/30 px-3 py-2.5">
                          <span className="flex-1 text-sm text-foreground/80">{q}</span>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-6 w-6 shrink-0 text-muted-foreground hover:text-foreground"
                            onClick={() => copyQuestion(q, id)}
                          >
                            {copiedIndex === id ? (
                              <CheckCircle2 className="h-3.5 w-3.5 text-[#10B981]" />
                            ) : (
                              <Copy className="h-3.5 w-3.5" />
                            )}
                          </Button>
                        </div>
                      )
                    })}
                  </div>
                </div>

                {/* Behavioral Questions */}
                <div className="mb-6">
                  <h4 className="mb-3 text-sm font-semibold text-foreground">Behavioral Questions</h4>
                  <div className="flex flex-col gap-2">
                    {questions.behavioral.map((q, i) => {
                      const id = `behav-${i}`
                      return (
                        <div key={id} className="flex items-start gap-2 rounded-lg bg-secondary/30 px-3 py-2.5">
                          <span className="flex-1 text-sm text-foreground/80">{q}</span>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-6 w-6 shrink-0 text-muted-foreground hover:text-foreground"
                            onClick={() => copyQuestion(q, id)}
                          >
                            {copiedIndex === id ? (
                              <CheckCircle2 className="h-3.5 w-3.5 text-[#10B981]" />
                            ) : (
                              <Copy className="h-3.5 w-3.5" />
                            )}
                          </Button>
                        </div>
                      )
                    })}
                  </div>
                </div>

                {/* Scenario Questions */}
                <div className="mb-6">
                  <h4 className="mb-3 text-sm font-semibold text-foreground">Scenario Questions</h4>
                  <div className="flex flex-col gap-2">
                    {questions.scenario.map((q, i) => {
                      const id = `scen-${i}`
                      return (
                        <div key={id} className="flex items-start gap-2 rounded-lg bg-secondary/30 px-3 py-2.5">
                          <span className="flex-1 text-sm text-foreground/80">{q}</span>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-6 w-6 shrink-0 text-muted-foreground hover:text-foreground"
                            onClick={() => copyQuestion(q, id)}
                          >
                            {copiedIndex === id ? (
                              <CheckCircle2 className="h-3.5 w-3.5 text-[#10B981]" />
                            ) : (
                              <Copy className="h-3.5 w-3.5" />
                            )}
                          </Button>
                        </div>
                      )
                    })}
                  </div>
                </div>

                {/* Back Button */}
                <Button variant="outline" className="w-full" onClick={() => setShowQuestions(false)}>
                  Back to Profile
                </Button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
