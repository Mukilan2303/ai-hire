import { Navbar } from "@/components/landing/navbar"
import { HeroSection } from "@/components/landing/hero-section"
import { ProblemSection } from "@/components/landing/problem-section"
import { FeaturesSection } from "@/components/landing/features-section"
import { WorkflowSection } from "@/components/landing/workflow-section"
import { SocialProof } from "@/components/landing/social-proof"
import { CTASection } from "@/components/landing/cta-section"
import { Footer } from "@/components/landing/footer"

export default function LandingPage() {
  return (
    <main className="min-h-screen">
      <Navbar />
      <HeroSection />
      <SocialProof />
      <ProblemSection />
      <FeaturesSection />
      <WorkflowSection />
      <CTASection />
      <Footer />
    </main>
  )
}
