import Link from "next/link"
import { Brain } from "lucide-react"

export function Footer() {
  return (
    <footer className="border-t border-border/30 px-6 py-12">
      <div className="mx-auto max-w-7xl">
        <div className="flex flex-col items-center justify-between gap-6 md:flex-row">
          <div className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
              <Brain className="h-5 w-5 text-primary-foreground" />
            </div>
            <span className="text-lg font-semibold tracking-tight text-foreground">
              HireMind AI
            </span>
          </div>
          <div className="flex gap-8">
            <Link href="#" className="text-sm text-muted-foreground transition-colors hover:text-foreground">
              Privacy
            </Link>
            <Link href="#" className="text-sm text-muted-foreground transition-colors hover:text-foreground">
              Terms
            </Link>
            <Link href="#" className="text-sm text-muted-foreground transition-colors hover:text-foreground">
              Contact
            </Link>
          </div>
          <p className="text-sm text-muted-foreground">
            {"2026 HireMind AI. All rights reserved."}
          </p>
        </div>
      </div>
    </footer>
  )
}
