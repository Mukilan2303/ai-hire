"use client"

import { useState, useRef } from "react"
import { DashboardTopbar } from "@/components/dashboard/topbar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { useAppStore, formatRelativeTime } from "@/lib/store"
import {
  Plus,
  Upload,
  FileText,
  Users,
  X,
  Sparkles,
  BrainCircuit,
  CheckCircle,
  Pencil,
  ArrowLeft,
} from "lucide-react"

const defaultExtractedSkills = [
  "Python", "TensorFlow", "PyTorch", "MLOps", "AWS", "Kubernetes", "NLP", "Computer Vision",
]

export default function JobsPage() {
  const { jobs, addJob } = useAppStore()
  const [showCreate, setShowCreate] = useState(false)
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [analyzed, setAnalyzed] = useState(false)
  const [jobCreated, setJobCreated] = useState(false)
  const [jdText, setJdText] = useState("")
  const [jobTitle, setJobTitle] = useState("")
  const [department, setDepartment] = useState("")
  const [skills, setSkills] = useState<string[]>([])
  const [newSkill, setNewSkill] = useState("")
  const [experience, setExperience] = useState("5+ years in Machine Learning / Deep Learning")
  const [education, setEducation] = useState("Master's or PhD in CS, Mathematics, or related field (preferred)")
  const [editingExperience, setEditingExperience] = useState(false)
  const [editingEducation, setEditingEducation] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  function resetForm() {
    setShowCreate(false)
    setAnalyzed(false)
    setJobCreated(false)
    setJdText("")
    setJobTitle("")
    setDepartment("")
    setSkills([])
    setNewSkill("")
    setExperience("5+ years in Machine Learning / Deep Learning")
    setEducation("Master's or PhD in CS, Mathematics, or related field (preferred)")
    setEditingExperience(false)
    setEditingEducation(false)
  }

  function handleAnalyze() {
    if (!jdText.trim()) return
    setIsAnalyzing(true)
    setTimeout(() => {
      setIsAnalyzing(false)
      setAnalyzed(true)
      setSkills(defaultExtractedSkills)
    }, 2000)
  }

  function removeSkill(skill: string) {
    setSkills(skills.filter((s) => s !== skill))
  }

  function addSkill() {
    const trimmed = newSkill.trim()
    if (trimmed && !skills.includes(trimmed)) {
      setSkills([...skills, trimmed])
      setNewSkill("")
    }
  }

  function handleCreateJob() {
    addJob({
      title: jobTitle || "Untitled Position",
      department: department || "General",
      skills,
      experience,
      education,
    })
    setJobCreated(true)
  }

  function handleFileUpload(e: React.ChangeEvent<HTMLInputElement>) {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0]
      const reader = new FileReader()
      reader.onload = () => {
        setJdText(reader.result as string)
      }
      reader.readAsText(file)
    }
  }

  return (
    <div className="flex flex-col">
      <DashboardTopbar title="Jobs" />
      <div className="flex-1 px-4 py-8 lg:px-8">
        {!showCreate ? (
          <>
            <div className="mb-8 flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold text-foreground">Active Positions</h2>
                <p className="mt-1 text-sm text-muted-foreground">
                  Manage your job postings and review candidate pipelines
                </p>
              </div>
              <Button className="glow-indigo" onClick={() => setShowCreate(true)}>
                <Plus className="mr-2 h-4 w-4" />
                Create Job
              </Button>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              {jobs.map((job) => (
                <div
                  key={job.id}
                  className="rounded-xl border border-border/50 bg-card/80 p-6 transition-all duration-300 hover:-translate-y-0.5 card-elevated"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="text-base font-semibold text-foreground">{job.title}</h3>
                      <p className="mt-1 text-sm text-muted-foreground">{job.department}</p>
                    </div>
                    <Badge
                      variant="secondary"
                      className={
                        job.status === "Active"
                          ? "bg-[#10B981]/10 text-[#10B981]"
                          : job.status === "Paused"
                            ? "bg-[#F59E0B]/10 text-[#F59E0B]"
                            : "bg-muted text-muted-foreground"
                      }
                    >
                      {job.status}
                    </Badge>
                  </div>
                  <div className="mt-4 flex items-center gap-4">
                    <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                      <Users className="h-4 w-4" />
                      {job.candidates} candidates
                    </div>
                    <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                      <FileText className="h-4 w-4" />
                      Posted {formatRelativeTime(job.postedAt)}
                    </div>
                  </div>
                  {job.skills.length > 0 && (
                    <div className="mt-3 flex flex-wrap gap-1.5">
                      {job.skills.slice(0, 5).map((skill) => (
                        <Badge key={skill} variant="secondary" className="bg-primary/10 text-primary text-xs">
                          {skill}
                        </Badge>
                      ))}
                      {job.skills.length > 5 && (
                        <Badge variant="secondary" className="bg-secondary text-muted-foreground text-xs">
                          +{job.skills.length - 5} more
                        </Badge>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </>
        ) : jobCreated ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-[#10B981]/10">
              <CheckCircle className="h-10 w-10 text-[#10B981]" />
            </div>
            <h2 className="text-2xl font-bold text-foreground">Job Created Successfully</h2>
            <p className="mt-3 max-w-md text-sm leading-relaxed text-muted-foreground">
              {`"${jobTitle || "Untitled Position"}" has been created and AI sourcing has begun. You'll receive candidates as they are matched.`}
            </p>
            <div className="mt-8 flex gap-3">
              <Button variant="secondary" onClick={resetForm}>
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Jobs
              </Button>
              <Button className="glow-indigo" onClick={() => { resetForm(); setShowCreate(true) }}>
                <Plus className="mr-2 h-4 w-4" />
                Create Another
              </Button>
            </div>
          </div>
        ) : (
          <>
            <div className="mb-8">
              <Button variant="ghost" className="mb-4 text-muted-foreground" onClick={resetForm}>
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Jobs
              </Button>
              <h2 className="text-xl font-bold text-foreground">Create New Job</h2>
              <p className="mt-1 text-sm text-muted-foreground">
                Paste your job description and let AI extract the requirements
              </p>
            </div>

            <div className="grid gap-8 lg:grid-cols-2">
              {/* Left: Job Description Input */}
              <div className="rounded-xl border border-border/50 bg-card/80 p-6 card-elevated">
                <div className="mb-6 flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                    <FileText className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="text-base font-semibold text-foreground">Job Description</h3>
                    <p className="text-sm text-muted-foreground">Paste or upload your JD</p>
                  </div>
                </div>

                <div className="mb-4 flex flex-col gap-2">
                  <Label className="text-sm text-muted-foreground">Job Title</Label>
                  <Input
                    placeholder="e.g. Senior ML Engineer"
                    className="border-border/50 bg-secondary/50 text-foreground placeholder:text-muted-foreground/50"
                    value={jobTitle}
                    onChange={(e) => setJobTitle(e.target.value)}
                  />
                </div>

                <div className="mb-4 flex flex-col gap-2">
                  <Label className="text-sm text-muted-foreground">Department</Label>
                  <Input
                    placeholder="e.g. Engineering"
                    className="border-border/50 bg-secondary/50 text-foreground placeholder:text-muted-foreground/50"
                    value={department}
                    onChange={(e) => setDepartment(e.target.value)}
                  />
                </div>

                <div className="mb-4 flex flex-col gap-2">
                  <Label className="text-sm text-muted-foreground">Description</Label>
                  <Textarea
                    rows={8}
                    placeholder="Paste your full job description here..."
                    className="border-border/50 bg-secondary/50 text-foreground placeholder:text-muted-foreground/50 resize-none"
                    value={jdText}
                    onChange={(e) => setJdText(e.target.value)}
                  />
                </div>

                <div className="mb-6 flex items-center gap-3">
                  <div className="h-px flex-1 bg-border/50" />
                  <span className="text-xs text-muted-foreground">or</span>
                  <div className="h-px flex-1 bg-border/50" />
                </div>

                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".pdf,.txt,.doc,.docx"
                  className="hidden"
                  onChange={handleFileUpload}
                />
                <div
                  className="flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-border/50 bg-secondary/20 p-8 text-center transition-colors hover:border-primary/30 hover:bg-secondary/30"
                  onClick={() => fileInputRef.current?.click()}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => { if (e.key === "Enter") fileInputRef.current?.click() }}
                >
                  <Upload className="mb-3 h-8 w-8 text-muted-foreground" />
                  <p className="text-sm font-medium text-foreground">Upload PDF or Document</p>
                  <p className="mt-1 text-xs text-muted-foreground">Drag and drop or click to browse</p>
                </div>

                <Button
                  className="glow-indigo mt-6 w-full"
                  onClick={handleAnalyze}
                  disabled={!jdText.trim() || isAnalyzing}
                >
                  {isAnalyzing ? (
                    <>
                      <BrainCircuit className="mr-2 h-4 w-4 ai-pulse" />
                      AI is extracting requirements...
                    </>
                  ) : (
                    <>
                      <Sparkles className="mr-2 h-4 w-4" />
                      Analyze with AI
                    </>
                  )}
                </Button>
              </div>

              {/* Right: Extracted Requirements */}
              <div className="rounded-xl border border-border/50 bg-card/80 p-6 card-elevated">
                <div className="mb-6 flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#10B981]/10">
                    <BrainCircuit className="h-5 w-5 text-[#10B981]" />
                  </div>
                  <div>
                    <h3 className="text-base font-semibold text-foreground">AI-Extracted Requirements</h3>
                    <p className="text-sm text-muted-foreground">Review and edit the extracted requirements</p>
                  </div>
                </div>

                {!analyzed ? (
                  <div className="flex flex-col items-center justify-center py-16 text-center">
                    <BrainCircuit className="mb-4 h-12 w-12 text-muted-foreground/30" />
                    <p className="text-sm text-muted-foreground">
                      Paste a job description and click Analyze to extract requirements automatically
                    </p>
                  </div>
                ) : (
                  <div className="flex flex-col gap-6">
                    {/* Required Skills */}
                    <div>
                      <h4 className="mb-3 text-sm font-medium text-foreground">Required Skills</h4>
                      <div className="flex flex-wrap gap-2">
                        {skills.map((skill) => (
                          <Badge key={skill} variant="secondary" className="bg-primary/10 text-primary pr-1">
                            {skill}
                            <button
                              className="ml-1.5 rounded-sm p-0.5 hover:bg-primary/20"
                              onClick={() => removeSkill(skill)}
                              aria-label={`Remove ${skill}`}
                            >
                              <X className="h-3 w-3" />
                            </button>
                          </Badge>
                        ))}
                      </div>
                      <div className="mt-3 flex gap-2">
                        <Input
                          placeholder="Add a skill..."
                          className="border-border/50 bg-secondary/50 text-foreground placeholder:text-muted-foreground/50 text-sm h-8"
                          value={newSkill}
                          onChange={(e) => setNewSkill(e.target.value)}
                          onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); addSkill() } }}
                        />
                        <Button size="sm" variant="secondary" onClick={addSkill} className="h-8 text-xs">
                          <Plus className="mr-1 h-3 w-3" />
                          Add
                        </Button>
                      </div>
                    </div>

                    {/* Experience Required */}
                    <div>
                      <div className="mb-3 flex items-center justify-between">
                        <h4 className="text-sm font-medium text-foreground">Experience Required</h4>
                        <button
                          className="text-muted-foreground hover:text-foreground transition-colors"
                          onClick={() => setEditingExperience(!editingExperience)}
                          aria-label="Edit experience"
                        >
                          <Pencil className="h-3.5 w-3.5" />
                        </button>
                      </div>
                      {editingExperience ? (
                        <Input
                          className="border-border/50 bg-secondary/50 text-foreground text-sm"
                          value={experience}
                          onChange={(e) => setExperience(e.target.value)}
                          onBlur={() => setEditingExperience(false)}
                          onKeyDown={(e) => { if (e.key === "Enter") setEditingExperience(false) }}
                          autoFocus
                        />
                      ) : (
                        <div
                          className="cursor-pointer rounded-lg bg-secondary/50 px-4 py-3 transition-colors hover:bg-secondary/70"
                          onClick={() => setEditingExperience(true)}
                        >
                          <p className="text-sm text-foreground/80">{experience}</p>
                        </div>
                      )}
                    </div>

                    {/* Education */}
                    <div>
                      <div className="mb-3 flex items-center justify-between">
                        <h4 className="text-sm font-medium text-foreground">Education</h4>
                        <button
                          className="text-muted-foreground hover:text-foreground transition-colors"
                          onClick={() => setEditingEducation(!editingEducation)}
                          aria-label="Edit education"
                        >
                          <Pencil className="h-3.5 w-3.5" />
                        </button>
                      </div>
                      {editingEducation ? (
                        <Input
                          className="border-border/50 bg-secondary/50 text-foreground text-sm"
                          value={education}
                          onChange={(e) => setEducation(e.target.value)}
                          onBlur={() => setEditingEducation(false)}
                          onKeyDown={(e) => { if (e.key === "Enter") setEditingEducation(false) }}
                          autoFocus
                        />
                      ) : (
                        <div
                          className="cursor-pointer rounded-lg bg-secondary/50 px-4 py-3 transition-colors hover:bg-secondary/70"
                          onClick={() => setEditingEducation(true)}
                        >
                          <p className="text-sm text-foreground/80">{education}</p>
                        </div>
                      )}
                    </div>

                    <Button
                      className="glow-indigo w-full"
                      onClick={handleCreateJob}
                      disabled={!jobTitle.trim()}
                    >
                      <Sparkles className="mr-2 h-4 w-4" />
                      Create Job & Start Sourcing
                    </Button>

                    {!jobTitle.trim() && (
                      <p className="text-center text-xs text-muted-foreground">
                        Please enter a job title to continue
                      </p>
                    )}
                  </div>
                )}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  )
}
