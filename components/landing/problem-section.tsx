import { Clock, ShieldAlert, UserX, Snail } from "lucide-react"

const problems = [
  {
    icon: Clock,
    title: "Manual Screening",
    description: "Recruiters spend 23 hours screening resumes for a single hire. Most qualified candidates are overlooked.",
  },
  {
    icon: ShieldAlert,
    title: "Unconscious Bias",
    description: "72% of resumes are rejected based on superficial factors unrelated to job performance.",
  },
  {
    icon: UserX,
    title: "Bad Hires",
    description: "A bad hire costs 30% of an employee's annual salary. Traditional methods can't predict success.",
  },
  {
    icon: Snail,
    title: "Slow Processes",
    description: "Average time-to-hire is 44 days. Top candidates are lost to competitors within 10 days.",
  },
]

export function ProblemSection() {
  return (
    <section className="relative px-6 py-24">
      <div className="mx-auto max-w-7xl">
        <div className="mb-16 text-center">
          <p className="mb-3 text-sm font-medium uppercase tracking-widest text-primary">
            The Problem
          </p>
          <h2 className="text-balance text-3xl font-bold tracking-tight text-foreground md:text-4xl">
            Traditional recruiting is broken
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-pretty text-muted-foreground">
            Information between candidates, hiring managers, and recruiters is
            lost at every step. We realized the opposite could be true.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {problems.map((problem) => (
            <div
              key={problem.title}
              className="group rounded-xl border border-border/50 bg-card/50 p-6 transition-all duration-300 hover:-translate-y-1 card-elevated"
            >
              <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-lg bg-destructive/10">
                <problem.icon className="h-5 w-5 text-destructive" />
              </div>
              <h3 className="mb-2 text-lg font-semibold text-foreground">
                {problem.title}
              </h3>
              <p className="text-sm leading-relaxed text-muted-foreground">
                {problem.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
