import { FileText, Upload, BrainCircuit, BarChart3, CheckCircle } from "lucide-react"

const steps = [
  {
    icon: FileText,
    title: "Upload JD",
    description: "Paste or upload your job description. AI extracts required skills, experience, and education.",
  },
  {
    icon: Upload,
    title: "Upload Resumes",
    description: "Bulk upload candidate resumes. Our parser extracts and maps all relevant information.",
  },
  {
    icon: BrainCircuit,
    title: "AI Analysis",
    description: "Our engine evaluates candidates against your requirements with explainable reasoning.",
  },
  {
    icon: BarChart3,
    title: "Smart Ranking",
    description: "Candidates are ranked by match score, success probability, and growth potential.",
  },
  {
    icon: CheckCircle,
    title: "Decision Intelligence",
    description: "Get actionable insights, bias alerts, and interview questions for your top candidates.",
  },
]

export function WorkflowSection() {
  return (
    <section id="how-it-works" className="relative px-6 py-24">
      <div className="mx-auto max-w-7xl">
        <div className="mb-16 text-center">
          <p className="mb-3 text-sm font-medium uppercase tracking-widest text-primary">
            How It Works
          </p>
          <h2 className="text-balance text-3xl font-bold tracking-tight text-foreground md:text-4xl">
            Five steps to smarter hiring
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-pretty text-muted-foreground">
            A streamlined pipeline that transforms your raw inputs into
            actionable hiring intelligence.
          </p>
        </div>

        <div className="relative flex flex-col gap-0 lg:flex-row lg:items-start lg:gap-0">
          {/* Connecting line */}
          <div className="absolute left-6 top-8 hidden h-0.5 w-[calc(100%-48px)] bg-border/50 lg:block" />

          {steps.map((step, index) => (
            <div key={step.title} className="relative flex flex-1 flex-col items-center text-center">
              <div className="relative z-10 mb-4 flex h-16 w-16 items-center justify-center rounded-2xl border border-border/50 bg-card">
                <step.icon className="h-7 w-7 text-primary" />
                <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-xs font-bold text-primary-foreground">
                  {index + 1}
                </span>
              </div>
              <h3 className="mb-2 text-base font-semibold text-foreground">
                {step.title}
              </h3>
              <p className="max-w-[200px] text-sm leading-relaxed text-muted-foreground">
                {step.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
