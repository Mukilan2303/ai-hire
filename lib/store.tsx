"use client"

import { createContext, useContext, useState, useCallback, type ReactNode } from "react"

// ---- Types ----
export interface Job {
  id: string
  title: string
  department: string
  candidates: number
  status: "Active" | "Paused" | "Closed"
  postedAt: Date
  skills: string[]
  experience: string
  education: string
}

export interface CandidateFile {
  id: string
  name: string
  fileSize: number
  uploadedAt: Date
  status: "uploading" | "parsing" | "done" | "error"
  skills: string[]
  matchScore: number
  successProbability: number
  risk: "low" | "medium" | "high"
  experience: string
  education: string
  strengths: string[]
  gaps: string[]
  hiddenTalent: boolean
  summary: string
  jobId: string | null  // Associated job ID
}

export interface ActivityEvent {
  id: string
  icon: "candidates" | "analysis" | "bias" | "questions" | "job"
  text: string
  timestamp: Date
}

// ---- Initial Data ----
const initialJobs: Job[] = [
  {
    id: "job-1",
    title: "Senior ML Engineer",
    department: "Engineering",
    candidates: 142,
    status: "Active",
    postedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
    skills: ["Python", "TensorFlow", "PyTorch", "MLOps", "AWS"],
    experience: "5+ years in Machine Learning / Deep Learning",
    education: "Master's or PhD in CS, Mathematics, or related field (preferred)",
  },
  {
    id: "job-2",
    title: "Product Designer",
    department: "Design",
    candidates: 89,
    status: "Active",
    postedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
    skills: ["Figma", "Prototyping", "User Research", "Design Systems"],
    experience: "3+ years in product design",
    education: "Bachelor's in Design, HCI, or related field",
  },
  {
    id: "job-3",
    title: "Backend Engineer",
    department: "Engineering",
    candidates: 216,
    status: "Active",
    postedAt: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000),
    skills: ["Go", "PostgreSQL", "Kubernetes", "gRPC", "Redis"],
    experience: "4+ years in backend development",
    education: "Bachelor's in Computer Science or equivalent",
  },
  {
    id: "job-4",
    title: "Data Analyst",
    department: "Analytics",
    candidates: 64,
    status: "Paused",
    postedAt: new Date(Date.now() - 21 * 24 * 60 * 60 * 1000),
    skills: ["SQL", "Python", "Tableau", "Statistics"],
    experience: "2+ years in data analysis",
    education: "Bachelor's in Statistics, Mathematics, or related field",
  },
]

// Start with empty candidates - only show uploaded resumes
const initialCandidates: CandidateFile[] = []

const initialActivities: ActivityEvent[] = [
  {
    id: "act-1",
    icon: "candidates",
    text: "142 new candidates uploaded for Senior ML Engineer",
    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
  },
  {
    id: "act-2",
    icon: "analysis",
    text: "AI analysis completed for Product Designer role",
    timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000),
  },
  {
    id: "act-3",
    icon: "bias",
    text: "Bias alert: education diversity gap detected",
    timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000),
  },
  {
    id: "act-4",
    icon: "questions",
    text: "Interview questions generated for 3 top candidates",
    timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000),
  },
]

// ---- Context ----
interface AppStore {
  jobs: Job[]
  candidates: CandidateFile[]
  activities: ActivityEvent[]
  selectedJobId: string | null
  setSelectedJob: (jobId: string | null) => void
  getCandidatesForJob: (jobId: string) => CandidateFile[]
  addJob: (job: Omit<Job, "id" | "postedAt" | "candidates" | "status">) => void
  addCandidates: (files: File[]) => void
  addActivity: (event: Omit<ActivityEvent, "id" | "timestamp">) => void
}

const AppStoreContext = createContext<AppStore | null>(null)

export function useAppStore() {
  const ctx = useContext(AppStoreContext)
  if (!ctx) throw new Error("useAppStore must be used within AppStoreProvider")
  return ctx
}

export function AppStoreProvider({ children }: { children: ReactNode }) {
  const [jobs, setJobs] = useState<Job[]>(initialJobs)
  const [candidates, setCandidates] = useState<CandidateFile[]>(initialCandidates)
  const [activities, setActivities] = useState<ActivityEvent[]>(initialActivities)
  const [selectedJobId, setSelectedJobId] = useState<string | null>(null)

  const addActivity = useCallback((event: Omit<ActivityEvent, "id" | "timestamp">) => {
    setActivities((prev) => [
      { ...event, id: `act-${Date.now()}`, timestamp: new Date() },
      ...prev,
    ])
  }, [])

  const addJob = useCallback(
    (job: Omit<Job, "id" | "postedAt" | "candidates" | "status">) => {
      const newJob: Job = {
        ...job,
        id: `job-${Date.now()}`,
        postedAt: new Date(),
        candidates: 0,
        status: "Active",
      }
      setJobs((prev) => [newJob, ...prev])
      addActivity({
        icon: "job",
        text: `New job created: ${job.title}. AI sourcing started.`,
      })
    },
    [addActivity]
  )


  const setSelectedJob = useCallback((jobId: string | null) => {
    setSelectedJobId(jobId)
  }, [])

  const getCandidatesForJob = useCallback(
    (jobId: string) => {
      return candidates.filter((c) => c.jobId === jobId)
    },
    [candidates]
  )

  const addCandidates = useCallback(
    (files: File[]) => {
      // Import job matcher dynamically
      import("./job-matcher").then(({ calculateJobMatch }) => {
        const selectedJob = selectedJobId ? jobs.find((j) => j.id === selectedJobId) : null

        const simulatedSkillSets = [
          { skills: ["Python", "TensorFlow", "AWS"], experience: "5 years in ML/AI" },
          { skills: ["JavaScript", "React", "Node.js"], experience: "3 years in web development" },
          { skills: ["Python", "SQL", "Statistics"], experience: "4 years in data analysis" },
          { skills: ["Java", "Spark", "Hadoop"], experience: "6 years in big data" },
          { skills: ["Python", "PyTorch", "Docker"], experience: "7 years in deep learning" },
        ]

        const newCandidates: CandidateFile[] = files.map((file, i) => {
          const sim = simulatedSkillSets[i % simulatedSkillSets.length]
          const nameFromFile = file.name.replace(/\.(pdf|docx|doc)$/i, "").replace(/[_-]/g, " ")

          // Calculate job-specific match if job is selected
          let matchData
          if (selectedJob) {
            matchData = calculateJobMatch(sim.skills, sim.experience, selectedJob)
          } else {
            // Fallback to generic scoring if no job selected
            matchData = {
              matchScore: 70 + Math.floor(Math.random() * 25),
              successProbability: 65 + Math.floor(Math.random() * 25),
              risk: "medium" as const,
              strengths: ["Strong technical skills"],
              gaps: ["No specific job selected for analysis"],
              summary: "Resume uploaded. Select a job for detailed analysis.",
              hiddenTalent: false,
            }
          }

          return {
            id: `cand-${Date.now()}-${i}`,
            name: nameFromFile,
            fileSize: file.size,
            uploadedAt: new Date(),
            status: "uploading" as const,
            skills: sim.skills,
            matchScore: matchData.matchScore,
            successProbability: matchData.successProbability,
            risk: matchData.risk,
            experience: sim.experience,
            education: "Parsed from resume",
            strengths: matchData.strengths,
            gaps: matchData.gaps,
            hiddenTalent: matchData.hiddenTalent,
            summary: matchData.summary,
            jobId: selectedJobId,
          }
        })

        setCandidates((prev) => [...newCandidates, ...prev])

        // Simulate parsing stages
        newCandidates.forEach((cand, i) => {
          setTimeout(() => {
            setCandidates((prev) =>
              prev.map((c) => (c.id === cand.id ? { ...c, status: "parsing" as const } : c))
            )
          }, 500 * (i + 1))

          setTimeout(() => {
            setCandidates((prev) =>
              prev.map((c) => (c.id === cand.id ? { ...c, status: "done" as const } : c))
            )
          }, 1200 * (i + 1))
        })

        const jobContext = selectedJob ? ` for ${selectedJob.title}` : ""
        addActivity({
          icon: "candidates",
          text: `${files.length} new resume${files.length > 1 ? "s" : ""} uploaded${jobContext}`,
        })
      })
    },
    [addActivity, selectedJobId, jobs]
  )


  return (
    <AppStoreContext.Provider value={{ jobs, candidates, activities, selectedJobId, setSelectedJob, getCandidatesForJob, addJob, addCandidates, addActivity }}>
      {children}
    </AppStoreContext.Provider>
  )
}

// ---- Utilities ----
export function formatRelativeTime(date: Date): string {
  const now = new Date()
  const diffMs = now.getTime() - date.getTime()
  const diffMinutes = Math.floor(diffMs / (1000 * 60))
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60))
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24))

  if (diffMinutes < 1) return "Just now"
  if (diffMinutes < 60) return `${diffMinutes}m ago`
  if (diffHours < 24) return `${diffHours}h ago`
  if (diffDays === 1) return "Yesterday"
  if (diffDays < 7) return `${diffDays}d ago`
  if (diffDays < 30) return `${Math.floor(diffDays / 7)}w ago`
  return date.toLocaleDateString("en-US", { month: "short", day: "numeric" })
}

export function formatDate(date: Date): string {
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  })
}
