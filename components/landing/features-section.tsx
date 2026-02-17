import {
  BrainCircuit,
  TrendingUp,
  ShieldCheck,
  Search,
  MessageSquare,
  Sparkles,
} from "lucide-react"

const features = [
  {
    icon: BrainCircuit,
    title: "Explainable AI",
    description: "Understand exactly why each candidate was recommended. Full transparency in every hiring decision.",
    color: "text-primary",
    bg: "bg-primary/10",
  },
  {
    icon: TrendingUp,
    title: "Success Prediction",
    description: "Predict candidate success probability with 94% accuracy using our proprietary ML models.",
    color: "text-[#10B981]",
    bg: "bg-[#10B981]/10",
  },
  {
    icon: ShieldCheck,
    title: "Bias Detection",
    description: "Real-time bias monitoring across gender, education, and experience to ensure fair hiring.",
    color: "text-[#F59E0B]",
    bg: "bg-[#F59E0B]/10",
  },
  {
    icon: Search,
    title: "Hidden Talent Discovery",
    description: "Our AI identifies high-potential candidates that traditional screening would miss entirely.",
    color: "text-[#06B6D4]",
    bg: "bg-[#06B6D4]/10",
  },
  {
    icon: MessageSquare,
    title: "AI Copilot",
    description: "Chat with your AI hiring assistant to compare candidates, get insights, and make decisions faster.",
    color: "text-[#8B5CF6]",
    bg: "bg-[#8B5CF6]/10",
  },
  {
    icon: Sparkles,
    title: "Smart Interview Prep",
    description: "Auto-generate personalized technical, behavioral, and scenario-based interview questions.",
    color: "text-primary",
    bg: "bg-primary/10",
  },
]

export function FeaturesSection() {
  return (
    <section id="features" className="relative px-6 py-24">
      <div className="mx-auto max-w-7xl">
        <div className="mb-16 text-center">
          <p className="mb-3 text-sm font-medium uppercase tracking-widest text-primary">
            Capabilities
          </p>
          <h2 className="text-balance text-3xl font-bold tracking-tight text-foreground md:text-4xl">
            Intelligence at every step
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-pretty text-muted-foreground">
            From sourcing to screening to decision-making, HireMind AI augments
            your entire recruiting workflow.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {features.map((feature) => (
            <div
              key={feature.title}
              className="group rounded-xl border border-border/50 bg-card/50 p-8 transition-all duration-300 hover:-translate-y-1 card-elevated"
            >
              <div className={`mb-5 flex h-12 w-12 items-center justify-center rounded-xl ${feature.bg}`}>
                <feature.icon className={`h-6 w-6 ${feature.color}`} />
              </div>
              <h3 className="mb-3 text-lg font-semibold text-foreground">
                {feature.title}
              </h3>
              <p className="text-sm leading-relaxed text-muted-foreground">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
