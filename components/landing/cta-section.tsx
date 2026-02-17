import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowRight } from "lucide-react"

export function CTASection() {
  return (
    <section className="relative px-6 py-24">
      <div className="relative mx-auto max-w-4xl overflow-hidden rounded-2xl border border-border/50 bg-card/80 p-12 text-center md:p-16">
        {/* Background glow */}
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute left-1/2 top-0 h-[300px] w-[500px] -translate-x-1/2 rounded-full bg-primary/10 blur-[100px]" />
        </div>

        <div className="relative z-10">
          <h2 className="text-balance text-3xl font-bold tracking-tight text-foreground md:text-4xl">
            Start Hiring Intelligently Today
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-pretty text-muted-foreground">
            Join the future of recruitment. Let AI handle the complexity while
            you focus on building world-class teams.
          </p>
          <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Button size="lg" className="glow-indigo h-12 px-8 text-base" asChild>
              <Link href="/dashboard">
                Get Started Free
                <ArrowRight className="ml-1 h-4 w-4" />
              </Link>
            </Button>
            <Button size="lg" variant="outline" className="h-12 px-8 text-base border-border/50 bg-transparent" asChild>
              <Link href="#how-it-works">
                Schedule Demo
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  )
}
