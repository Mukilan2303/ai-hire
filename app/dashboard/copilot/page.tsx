"use client"

import { useState, useRef, useEffect } from "react"
import { DashboardTopbar } from "@/components/dashboard/topbar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Brain, Send, Sparkles, User } from "lucide-react"
import { cn } from "@/lib/utils"
import { useAppStore } from "@/lib/store"

interface Message {
  role: "user" | "assistant"
  content: string
}

export default function CopilotPage() {
  const { candidates, jobs, activities } = useAppStore()
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content:
        "Hello! I'm your AI hiring copilot. I can help you compare candidates, explain rankings, suggest interview strategies, and provide hiring insights based on your actual data. What would you like to know?",
    },
  ])
  const [input, setInput] = useState("")
  const [isTyping, setIsTyping] = useState(false)
  const bottomRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages, isTyping])

  // Generate intelligent responses based on real data
  function generateResponse(question: string): string {
    const lowerQ = question.toLowerCase()
    const doneCandidates = candidates.filter((c) => c.status === "done")
    const sortedCandidates = [...doneCandidates].sort((a, b) => b.matchScore - a.matchScore)

    // No candidates uploaded yet
    if (doneCandidates.length === 0) {
      return "I don't have any candidate data to analyze yet. Please upload and analyze some resumes first, then I can help you with insights about your candidates!"
    }

    // Best candidate question
    if (lowerQ.includes("best") || lowerQ.includes("top candidate") || lowerQ.includes("strongest")) {
      const top = sortedCandidates[0]
      return `Based on my analysis, **${top.name}** is the strongest candidate.

**Match Score: ${top.matchScore}%** | **Success Probability: ${top.successProbability}%** | **Risk: ${top.risk}**

**Key Strengths:**
${top.strengths.map(s => `- ${s}`).join('\n')}

${top.gaps.length > 0 ? `**Areas for Development:**\n${top.gaps.map(g => `- ${g}`).join('\n')}\n\n` : ''}**AI Summary:** ${top.summary}

${top.hiddenTalent ? '🌟 **Hidden Talent Alert:** This candidate has non-obvious strengths that might be missed by traditional screening!\n\n' : ''}**Recommendation:** I suggest proceeding to the interview stage with ${top.name.split(' ')[0]}. Would you like me to suggest interview questions?`
    }

    // Compare candidates
    if (lowerQ.includes("compare") || lowerQ.includes("comparison")) {
      const topN = sortedCandidates.slice(0, Math.min(3, sortedCandidates.length))
      let comparison = `Here's a comparison of your top ${topN.length} candidate${topN.length > 1 ? 's' : ''}:\n\n`

      topN.forEach((c, i) => {
        comparison += `**${i + 1}. ${c.name}** (${c.matchScore}% match, ${c.successProbability}% success, ${c.risk} risk)\n`
        comparison += `- **Skills:** ${c.skills.slice(0, 3).join(', ')}${c.skills.length > 3 ? ` +${c.skills.length - 3} more` : ''}\n`
        comparison += `- **Strengths:** ${c.strengths.slice(0, 2).join(', ')}\n`
        if (c.gaps.length > 0) {
          comparison += `- **Gaps:** ${c.gaps.slice(0, 2).join(', ')}\n`
        }
        if (c.hiddenTalent) {
          comparison += `- 🌟 **Hidden Talent Detected**\n`
        }
        comparison += `\n`
      })

      comparison += `**Recommendation:** ${topN[0].name.split(' ')[0]} is the clear leader. `
      if (topN.length > 1) {
        comparison += `${topN[1].name.split(' ')[0]} brings ${topN[1].strengths[0]?.toLowerCase() || 'unique strengths'}. `
      }
      if (topN.length > 2 && topN[2].hiddenTalent) {
        comparison += `${topN[2].name.split(' ')[0]} has hidden potential worth exploring.`
      }

      return comparison
    }

    // Why ranked lowest
    if (lowerQ.includes("lowest") || lowerQ.includes("worst") || lowerQ.includes("last")) {
      const lowest = sortedCandidates[sortedCandidates.length - 1]
      return `${lowest.name} ranked #${sortedCandidates.length} with a **${lowest.matchScore}% match score** and **${lowest.successProbability}% success probability**.

**Key Factors:**
${lowest.gaps.length > 0 ? lowest.gaps.map(g => `- ${g}`).join('\n') : '- Limited alignment with job requirements'}

**However, ${lowest.name.split(' ')[0]} has strengths:**
${lowest.strengths.map(s => `- ${s}`).join('\n')}

**Recommendation:** ${lowest.name.split(' ')[0]} may be a better fit for a different role. Consider them for future openings that align better with their ${lowest.skills[0] || 'skill set'} background.`
    }

    // Skills gap analysis
    if (lowerQ.includes("skill") && (lowerQ.includes("missing") || lowerQ.includes("gap") || lowerQ.includes("need"))) {
      const allSkills = doneCandidates.flatMap(c => c.skills)
      const skillCount: Record<string, number> = {}
      allSkills.forEach(s => { skillCount[s] = (skillCount[s] || 0) + 1 })
      const topSkills = Object.entries(skillCount).sort((a, b) => b[1] - a[1]).slice(0, 5)
      const rareSkills = Object.entries(skillCount).filter(([, count]) => count === 1).map(([skill]) => skill)

      let response = `After analyzing all ${doneCandidates.length} candidates, here's the skills landscape:\n\n`
      response += `**Most Common Skills:**\n${topSkills.map(([s, c]) => `- ${s} (${c} candidate${c > 1 ? 's' : ''})`).join('\n')}\n\n`

      if (rareSkills.length > 0) {
        response += `**Rare Skills Found:**\n${rareSkills.slice(0, 5).map(s => `- ${s}`).join('\n')}\n\n`
      }

      response += `**Potential Gaps:**\n`
      response += `- Advanced specializations may be underrepresented\n`
      response += `- Consider if you need more diversity in technical stacks\n\n`
      response += `**Recommendation:** If specific skills are critical for your role, consider broadening your sourcing strategy or adjusting job requirements.`

      return response
    }

    // Interview questions
    if (lowerQ.includes("interview") || lowerQ.includes("question")) {
      const top = sortedCandidates[0]
      return `Here are personalized interview questions for **${top.name}** based on their profile:\n\n**Technical Questions:**\n- Can you walk me through a ${top.skills[0] || 'technical'} project you built from scratch?\n- How would you approach ${top.skills[1] || 'a complex'} challenges in a production environment?\n- Explain your experience with ${top.skills[2] || 'modern technologies'} and best practices.\n\n**Behavioral Questions:**\n- Tell me about a time you had to explain complex technical concepts to non-technical stakeholders.\n- Describe a situation where you disagreed with a team decision. How did you handle it?\n- How do you prioritize when working on multiple projects?\n\n**Scenario Questions:**\n- If you discovered a critical bug in production, walk me through your debugging process.\n- How would you design a scalable system for ${top.skills[0] || 'our use case'}?\n\nYou can find more questions on the AI Insights page!`
    }

    // Statistics/overview
    if (lowerQ.includes("how many") || lowerQ.includes("total") || lowerQ.includes("overview") || lowerQ.includes("summary")) {
      const avgScore = Math.round(doneCandidates.reduce((sum, c) => sum + c.matchScore, 0) / doneCandidates.length)
      const lowRisk = doneCandidates.filter(c => c.risk === "low").length
      const hiddenTalents = doneCandidates.filter(c => c.hiddenTalent).length
      const activeJobs = jobs.filter(j => j.status === "Active").length

      return `Here's your hiring pipeline overview:\n\n**Candidates:**\n- ${doneCandidates.length} total candidates analyzed\n- Average match score: ${avgScore}%\n- ${lowRisk} low-risk candidates (${Math.round(lowRisk / doneCandidates.length * 100)}%)\n- ${hiddenTalents} hidden talent${hiddenTalents !== 1 ? 's' : ''} discovered 🌟\n\n**Jobs:**\n- ${activeJobs} active job posting${activeJobs !== 1 ? 's' : ''}\n- ${jobs.length} total jobs\n\n**Top Candidate:** ${sortedCandidates[0].name} (${sortedCandidates[0].matchScore}% match)\n\n**Recent Activity:**\n${activities.slice(0, 3).map(a => `- ${a.text}`).join('\n')}\n\nWhat would you like to explore in more detail?`
    }

    // Specific candidate inquiry
    const mentionedCandidate = doneCandidates.find(c =>
      lowerQ.includes(c.name.toLowerCase()) ||
      lowerQ.includes(c.name.split(' ')[0].toLowerCase())
    )
    if (mentionedCandidate) {
      const rank = sortedCandidates.findIndex(c => c.id === mentionedCandidate.id) + 1
      return `Here's what I know about **${mentionedCandidate.name}**:\n\n**Ranking:** #${rank} out of ${sortedCandidates.length} candidates\n**Match Score:** ${mentionedCandidate.matchScore}%\n**Success Probability:** ${mentionedCandidate.successProbability}%\n**Risk Level:** ${mentionedCandidate.risk}\n\n**Skills:** ${mentionedCandidate.skills.join(', ')}\n\n**Strengths:**\n${mentionedCandidate.strengths.map(s => `- ${s}`).join('\n')}\n\n${mentionedCandidate.gaps.length > 0 ? `**Development Areas:**\n${mentionedCandidate.gaps.map(g => `- ${g}`).join('\n')}\n\n` : ''}**AI Analysis:** ${mentionedCandidate.summary}\n\n${mentionedCandidate.hiddenTalent ? '🌟 **This candidate has hidden talent potential!**\n\n' : ''}Would you like me to compare ${mentionedCandidate.name.split(' ')[0]} with other candidates?`
    }

    // Recommendations
    if (lowerQ.includes("recommend") || lowerQ.includes("suggest") || lowerQ.includes("should i")) {
      const top3 = sortedCandidates.slice(0, 3)
      return `Based on my analysis of your ${doneCandidates.length} candidates, here are my recommendations:\n\n**Immediate Action:**\n1. **Schedule interviews** with ${top3.map(c => c.name.split(' ')[0]).join(', ')}\n2. **Prioritize** ${sortedCandidates[0].name} - highest match at ${sortedCandidates[0].matchScore}%\n\n**Interview Strategy:**\n- Focus on ${sortedCandidates[0].skills[0] || 'technical'} depth for ${sortedCandidates[0].name.split(' ')[0]}\n${top3.length > 1 ? `- Assess ${top3[1].strengths[0]?.toLowerCase() || 'key strengths'} with ${top3[1].name.split(' ')[0]}\n` : ''}${top3.length > 2 && top3[2].hiddenTalent ? `- Explore hidden potential with ${top3[2].name.split(' ')[0]}\n` : ''}\n**Pipeline Health:**\n- ${doneCandidates.filter(c => c.matchScore >= 75).length} candidates ready for shortlist\n- ${doneCandidates.filter(c => c.risk === "low").length} low-risk hires available\n\nWould you like specific interview questions for any of these candidates?`
    }

    // Default intelligent response
    return `That's a great question! Based on my analysis of your ${doneCandidates.length} candidate${doneCandidates.length !== 1 ? 's' : ''}:\n\n- **Top candidate:** ${sortedCandidates[0].name} (${sortedCandidates[0].matchScore}% match)\n- **Average match score:** ${Math.round(doneCandidates.reduce((sum, c) => sum + c.matchScore, 0) / doneCandidates.length)}%\n- **Low-risk candidates:** ${doneCandidates.filter(c => c.risk === "low").length}\n\nI can help you with:\n- Comparing candidates\n- Explaining rankings\n- Analyzing skill gaps\n- Generating interview questions\n- Providing hiring recommendations\n\nWhat specific aspect would you like to explore?`
  }

  function sendMessage(text: string) {
    const userMessage = text.trim()
    if (!userMessage) return

    setMessages((prev) => [...prev, { role: "user", content: userMessage }])
    setInput("")
    setIsTyping(true)

    // Generate intelligent response based on real data
    setTimeout(() => {
      const response = generateResponse(userMessage)
      setIsTyping(false)
      setMessages((prev) => [...prev, { role: "assistant", content: response }])
    }, 1500)
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    sendMessage(input)
  }

  // Generate dynamic preset questions based on available data
  const doneCandidates = candidates.filter((c) => c.status === "done")
  const sortedCandidates = [...doneCandidates].sort((a, b) => b.matchScore - a.matchScore)

  const presetQuestions = doneCandidates.length > 0 ? [
    `Who is the best candidate${jobs.length > 0 ? ` for ${jobs[0].title}` : ''}?`,
    sortedCandidates.length >= 3 ? "Compare the top 3 candidates" : "Compare all candidates",
    sortedCandidates.length > 1 ? `Why was ${sortedCandidates[sortedCandidates.length - 1].name.split(' ')[0]} ranked lowest?` : "What are the strengths of my candidates?",
    "What skills are missing from our candidate pool?",
  ] : [
    "How do I get started?",
    "What can you help me with?",
    "Tell me about the AI features",
    "How does candidate analysis work?",
  ]

  return (
    <div className="flex h-[100dvh] flex-col">
      <DashboardTopbar title="AI Copilot" />

      <div className="flex flex-1 flex-col overflow-hidden">
        {/* Messages */}
        <div className="flex-1 overflow-y-auto px-8 py-8">
          <div className="mx-auto max-w-3xl flex flex-col gap-6">
            {messages.map((message, index) => (
              <div
                key={index}
                className={cn(
                  "flex gap-4",
                  message.role === "user" ? "justify-end" : "justify-start"
                )}
              >
                {message.role === "assistant" && (
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                    <Brain className="h-4 w-4 text-primary" />
                  </div>
                )}
                <div
                  className={cn(
                    "max-w-[80%] rounded-xl px-5 py-4",
                    message.role === "user"
                      ? "bg-secondary/80 text-foreground"
                      : "border border-primary/10 bg-primary/5 text-foreground"
                  )}
                >
                  <div className="whitespace-pre-wrap text-sm leading-relaxed">
                    {message.content.split(/(\*\*.*?\*\*)/).map((part, i) => {
                      if (part.startsWith("**") && part.endsWith("**")) {
                        return (
                          <strong key={i} className="font-semibold">
                            {part.slice(2, -2)}
                          </strong>
                        )
                      }
                      return <span key={i}>{part}</span>
                    })}
                  </div>
                </div>
                {message.role === "user" && (
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-secondary text-sm font-medium text-muted-foreground">
                    <User className="h-4 w-4" />
                  </div>
                )}
              </div>
            ))}

            {isTyping && (
              <div className="flex gap-4">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                  <Brain className="h-4 w-4 text-primary ai-pulse" />
                </div>
                <div className="rounded-xl border border-primary/10 bg-primary/5 px-5 py-4">
                  <div className="flex items-center gap-1.5">
                    <div className="h-2 w-2 rounded-full bg-primary/40 ai-pulse" style={{ animationDelay: "0ms" }} />
                    <div className="h-2 w-2 rounded-full bg-primary/40 ai-pulse" style={{ animationDelay: "300ms" }} />
                    <div className="h-2 w-2 rounded-full bg-primary/40 ai-pulse" style={{ animationDelay: "600ms" }} />
                  </div>
                </div>
              </div>
            )}

            <div ref={bottomRef} />
          </div>
        </div>

        {/* Preset Questions */}
        {messages.length <= 2 && (
          <div className="border-t border-border/30 px-8 py-4">
            <div className="mx-auto flex max-w-3xl flex-wrap gap-2">
              {presetQuestions.map((q) => (
                <button
                  key={q}
                  className="rounded-lg border border-border/50 bg-card/80 px-4 py-2 text-sm text-muted-foreground transition-all hover:-translate-y-0.5 hover:border-primary/30 hover:text-foreground"
                  onClick={() => sendMessage(q)}
                >
                  <Sparkles className="mr-1.5 inline h-3.5 w-3.5 text-primary" />
                  {q}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Input */}
        <div className="border-t border-border/50 bg-background/80 px-8 py-4 backdrop-blur-sm">
          <form
            onSubmit={handleSubmit}
            className="mx-auto flex max-w-3xl items-center gap-3"
          >
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask about candidates, rankings, or hiring insights..."
              className="flex-1 border-border/50 bg-secondary/50 text-foreground placeholder:text-muted-foreground/50"
              disabled={isTyping}
            />
            <Button
              type="submit"
              size="icon"
              className="glow-indigo shrink-0"
              disabled={isTyping || !input.trim()}
              aria-label="Send message"
            >
              <Send className="h-4 w-4" />
            </Button>
          </form>
        </div>
      </div>
    </div>
  )
}
