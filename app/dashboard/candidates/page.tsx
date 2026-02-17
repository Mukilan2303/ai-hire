"use client"

import { useState, useRef, useCallback } from "react"
import { DashboardTopbar } from "@/components/dashboard/topbar"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { useAppStore, formatRelativeTime } from "@/lib/store"
import {
  Upload,
  FileText,
  CheckCircle,
  BrainCircuit,
  Sparkles,
  X,
  AlertCircle,
} from "lucide-react"

export default function CandidatesPage() {
  const { candidates, jobs, selectedJobId, setSelectedJob, addCandidates, addActivity } = useAppStore()
  const [isDragging, setIsDragging] = useState(false)
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [analysisComplete, setAnalysisComplete] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const selectedJob = selectedJobId ? jobs.find((j) => j.id === selectedJobId) : null

  const handleFiles = useCallback(
    (fileList: FileList) => {
      const validFiles: File[] = []
      const invalidFiles: string[] = []
      Array.from(fileList).forEach((file) => {
        const ext = file.name.split(".").pop()?.toLowerCase()
        if (ext === "pdf" || ext === "docx" || ext === "doc") {
          validFiles.push(file)
        } else {
          invalidFiles.push(file.name)
        }
      })
      if (validFiles.length > 0) {
        addCandidates(validFiles)
        setAnalysisComplete(false)
      }
      if (invalidFiles.length > 0) {
        alert(`Unsupported files skipped: ${invalidFiles.join(", ")}. Only PDF and DOCX are supported.`)
      }
    },
    [addCandidates]
  )

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault()
      setIsDragging(false)
      if (e.dataTransfer.files.length > 0) {
        handleFiles(e.dataTransfer.files)
      }
    },
    [handleFiles]
  )

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }, [])

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
  }, [])

  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      if (e.target.files && e.target.files.length > 0) {
        handleFiles(e.target.files)
        e.target.value = ""
      }
    },
    [handleFiles]
  )

  function handleAnalyze() {
    setIsAnalyzing(true)
    const jobContext = selectedJob ? ` for ${selectedJob.title}` : ""
    addActivity({ icon: "analysis", text: `AI evaluation started for ${candidates.filter((c) => c.status === "done" && c.jobId === selectedJobId).length} candidates${jobContext}` })
    setTimeout(() => {
      setIsAnalyzing(false)
      setAnalysisComplete(true)
      addActivity({ icon: "analysis", text: `AI candidate evaluation complete${jobContext}. Rankings updated.` })
    }, 3000)
  }

  // Filter candidates by selected job
  const uploadedCandidates = selectedJobId
    ? candidates.filter((c) => c.uploadedAt && c.jobId === selectedJobId)
    : candidates.filter((c) => c.uploadedAt)
  const recentUploads = uploadedCandidates.slice(0, 20)
  const doneCount = recentUploads.filter((c) => c.status === "done").length
  const allDone = recentUploads.length > 0 && recentUploads.every((c) => c.status === "done")

  function formatFileSize(bytes: number) {
    if (bytes < 1024) return `${bytes} B`
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
  }

  return (
    <div className="flex flex-col">
      <DashboardTopbar title="Candidates" />
      <div className="flex-1 px-4 py-8 lg:px-8">
        <div className="mb-8">
          <h2 className="text-xl font-bold text-foreground">Resume Upload & Analysis</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Upload candidate resumes and let AI parse, analyze, and rank them
          </p>
        </div>

        {/* Job Selector */}
        <div className="mb-8 rounded-xl border border-border/50 bg-card/80 card-elevated p-6">
          <div className="mb-4">
            <label htmlFor="job-select" className="block text-sm font-semibold text-foreground mb-2">
              Select Job Position
            </label>
            <select
              id="job-select"
              value={selectedJobId || ""}
              onChange={(e) => setSelectedJob(e.target.value || null)}
              className="w-full rounded-lg border border-border/50 bg-secondary/50 px-4 py-2.5 text-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
            >
              <option value="">No job selected (generic analysis)</option>
              {jobs.map((job) => (
                <option key={job.id} value={job.id}>
                  {job.title} - {job.department}
                </option>
              ))}
            </select>
          </div>

          {selectedJob && (
            <div className="mt-4 rounded-lg border border-primary/20 bg-primary/5 p-4">
              <div className="mb-3 flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-primary" />
                <span className="text-sm font-semibold text-primary">Job Requirements</span>
              </div>
              <div className="space-y-2 text-sm">
                <div>
                  <span className="font-medium text-foreground">Title:</span>{" "}
                  <span className="text-foreground/80">{selectedJob.title}</span>
                </div>
                <div>
                  <span className="font-medium text-foreground">Department:</span>{" "}
                  <span className="text-foreground/80">{selectedJob.department}</span>
                </div>
                <div>
                  <span className="font-medium text-foreground">Required Skills:</span>{" "}
                  <div className="mt-1 flex flex-wrap gap-1.5">
                    {selectedJob.skills.map((skill) => (
                      <Badge key={skill} variant="secondary" className="bg-secondary/80 text-xs">
                        {skill}
                      </Badge>
                    ))}
                  </div>
                </div>
                <div>
                  <span className="font-medium text-foreground">Experience:</span>{" "}
                  <span className="text-foreground/80">{selectedJob.experience}</span>
                </div>
                <div>
                  <span className="font-medium text-foreground">Education:</span>{" "}
                  <span className="text-foreground/80">{selectedJob.education}</span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Upload Area */}
        <input
          ref={fileInputRef}
          type="file"
          accept=".pdf,.docx,.doc"
          multiple
          className="hidden"
          onChange={handleInputChange}
        />
        <div
          className={`mb-8 flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed p-12 text-center transition-all ${isDragging
            ? "border-primary bg-primary/5 scale-[1.01]"
            : "border-border/50 bg-card/40 hover:border-primary/30 hover:bg-card/60"
            }`}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") fileInputRef.current?.click() }}
          aria-label="Upload resumes"
        >
          <Upload className={`mb-4 h-10 w-10 transition-colors ${isDragging ? "text-primary" : "text-muted-foreground"}`} />
          <p className="text-base font-medium text-foreground">
            {isDragging ? "Drop resumes here" : "Drag & drop resumes here"}
          </p>
          <p className="mt-2 text-sm text-muted-foreground">
            Supports PDF and DOCX. Upload multiple files at once.
          </p>
          <Button variant="secondary" className="mt-4" onClick={(e) => { e.stopPropagation(); fileInputRef.current?.click() }}>
            Browse Files
          </Button>
        </div>

        {/* Uploaded Files */}
        {recentUploads.length > 0 && (
          <div className="mb-8 rounded-xl border border-border/50 bg-card/80 card-elevated">
            <div className="flex items-center justify-between border-b border-border/50 px-6 py-4">
              <h3 className="text-base font-semibold text-foreground">
                Uploaded Resumes ({uploadedCandidates.length})
              </h3>
              <span className="text-sm text-muted-foreground">
                {doneCount}/{recentUploads.length} parsed
              </span>
            </div>
            <div className="flex flex-col">
              {recentUploads.map((file) => (
                <div
                  key={file.id}
                  className="flex items-center gap-4 border-b border-border/20 px-6 py-4 last:border-b-0"
                >
                  <FileText className="h-5 w-5 shrink-0 text-muted-foreground" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-foreground truncate">{file.name}</p>
                    <div className="mt-1 flex items-center gap-3">
                      <span className="text-xs text-muted-foreground">{formatFileSize(file.fileSize)}</span>
                      <span className="text-xs text-muted-foreground">{formatRelativeTime(file.uploadedAt)}</span>
                    </div>
                    {file.status === "done" && (
                      <div className="mt-1.5 flex flex-wrap gap-1.5">
                        {file.skills.map((skill) => (
                          <Badge key={skill} variant="secondary" className="bg-primary/10 text-primary text-xs">
                            {skill}
                          </Badge>
                        ))}
                      </div>
                    )}
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    {file.status === "uploading" && (
                      <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
                        <Upload className="h-3.5 w-3.5 ai-pulse" />
                        Uploading...
                      </span>
                    )}
                    {file.status === "parsing" && (
                      <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
                        <BrainCircuit className="h-3.5 w-3.5 ai-pulse" />
                        Parsing...
                      </span>
                    )}
                    {file.status === "done" && (
                      <span className="flex items-center gap-1.5 text-xs text-[#10B981]">
                        <CheckCircle className="h-3.5 w-3.5" />
                        Parsed
                      </span>
                    )}
                    {file.status === "error" && (
                      <span className="flex items-center gap-1.5 text-xs text-destructive">
                        <AlertCircle className="h-3.5 w-3.5" />
                        Error
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Analyze Button */}
        {allDone && !analysisComplete && (
          <Button
            className="glow-indigo w-full py-6 text-base"
            onClick={handleAnalyze}
            disabled={isAnalyzing}
          >
            {isAnalyzing ? (
              <>
                <BrainCircuit className="mr-2 h-5 w-5 ai-pulse" />
                AI is evaluating candidates...
              </>
            ) : (
              <>
                <Sparkles className="mr-2 h-5 w-5" />
                Analyze {doneCount} Candidates
              </>
            )}
          </Button>
        )}

        {/* Ranked Candidates Table */}
        {analysisComplete && (
          <div className="rounded-xl border border-border/50 bg-card/80 card-elevated overflow-hidden">
            <div className="flex items-center justify-between border-b border-border/50 px-6 py-4">
              <div>
                <h3 className="text-base font-semibold text-foreground">
                  Candidate Rankings{selectedJob ? ` for ${selectedJob.title}` : ""}
                </h3>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Sorted by match score{selectedJob ? " against job requirements" : ""}
                </p>
              </div>
              <Badge variant="secondary" className="bg-[#10B981]/10 text-[#10B981]">
                {doneCount} Analyzed
              </Badge>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border/30 bg-secondary/20">
                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground">Rank</th>
                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground">Candidate</th>
                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground">Skills</th>
                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground">Match Score</th>
                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground">Success Prob.</th>
                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground">Risk</th>
                  </tr>
                </thead>
                <tbody>
                  {recentUploads
                    .filter((c) => c.status === "done")
                    .sort((a, b) => b.matchScore - a.matchScore)
                    .map((candidate, index) => {
                      const getRiskColor = (risk: string) => {
                        switch (risk) {
                          case "low": return "bg-[#10B981]/10 text-[#10B981]"
                          case "medium": return "bg-[#F59E0B]/10 text-[#F59E0B]"
                          case "high": return "bg-destructive/10 text-destructive"
                          default: return "bg-muted text-muted-foreground"
                        }
                      }

                      const getScoreGradient = (score: number) => {
                        if (score >= 85) return "from-primary to-[#06B6D4]"
                        if (score >= 70) return "from-[#06B6D4] to-[#10B981]"
                        if (score >= 50) return "from-[#F59E0B] to-[#06B6D4]"
                        return "from-destructive to-[#F59E0B]"
                      }

                      const getScoreColor = (score: number) => {
                        if (score >= 85) return "bg-[#10B981]"
                        if (score >= 70) return "bg-[#06B6D4]"
                        if (score >= 50) return "bg-[#F59E0B]"
                        return "bg-destructive"
                      }

                      return (
                        <tr
                          key={candidate.id}
                          className={`border-b border-border/20 transition-colors hover:bg-secondary/30 ${index % 2 === 0 ? "bg-transparent" : "bg-secondary/10"
                            }`}
                        >
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-2">
                              <span className={`text-sm font-bold ${index === 0 ? "text-[#F59E0B]" :
                                index === 1 ? "text-[#94A3B8]" :
                                  index === 2 ? "text-[#CD7F32]" :
                                    "text-muted-foreground"
                                }`}>
                                #{index + 1}
                              </span>
                              {index < 3 && (
                                <span className="text-lg">
                                  {index === 0 ? "🥇" : index === 1 ? "🥈" : "🥉"}
                                </span>
                              )}
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-3">
                              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary/10 text-sm font-medium text-primary">
                                {candidate.name.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase()}
                              </div>
                              <div>
                                <p className="text-sm font-medium text-foreground">{candidate.name}</p>
                                <p className="text-xs text-muted-foreground">{candidate.experience}</p>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex flex-wrap gap-1.5 max-w-xs">
                              {candidate.skills.slice(0, 3).map((skill) => (
                                <Badge key={skill} variant="secondary" className="bg-primary/10 text-primary text-xs">
                                  {skill}
                                </Badge>
                              ))}
                              {candidate.skills.length > 3 && (
                                <Badge variant="secondary" className="bg-muted text-muted-foreground text-xs">
                                  +{candidate.skills.length - 3}
                                </Badge>
                              )}
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-3">
                              <div className="h-2 w-24 overflow-hidden rounded-full bg-secondary">
                                <div
                                  className={`h-full rounded-full bg-gradient-to-r ${getScoreGradient(candidate.matchScore)}`}
                                  style={{ width: `${candidate.matchScore}%` }}
                                />
                              </div>
                              <span className="text-sm font-medium text-foreground">{candidate.matchScore}%</span>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-2">
                              <div className={`h-2 w-2 rounded-full ${getScoreColor(candidate.successProbability)}`} />
                              <span className="text-sm text-foreground">{candidate.successProbability}%</span>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <Badge variant="secondary" className={`text-xs ${getRiskColor(candidate.risk)}`}>
                              {candidate.risk}
                            </Badge>
                          </td>
                        </tr>
                      )
                    })}
                </tbody>
              </table>
            </div>
            <div className="border-t border-border/50 px-6 py-4 bg-secondary/10">
              <div className="flex items-center justify-between">
                <p className="text-sm text-muted-foreground">
                  Analysis complete • {doneCount} candidates ranked
                </p>
                <Button variant="outline" size="sm" asChild>
                  <a href="/dashboard">View on Dashboard →</a>
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
