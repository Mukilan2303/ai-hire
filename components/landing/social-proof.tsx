export function SocialProof() {
  const companies = [
    "Acme Corp",
    "Quantum Labs",
    "NovaTech",
    "Horizon AI",
    "Vertex Inc",
    "Prism Digital",
  ]

  return (
    <section className="relative border-y border-border/30 px-6 py-16">
      <div className="mx-auto max-w-7xl">
        <p className="mb-10 text-center text-sm font-medium uppercase tracking-widest text-muted-foreground">
          Built for modern recruiting teams
        </p>
        <div className="flex flex-wrap items-center justify-center gap-x-12 gap-y-6">
          {companies.map((company) => (
            <div
              key={company}
              className="text-xl font-bold tracking-tight text-muted-foreground/40 transition-colors hover:text-muted-foreground/70"
            >
              {company}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
