"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Brain, ArrowLeft, CheckCircle } from "lucide-react"

export default function ForgotPasswordPage() {
  const [submitted, setSubmitted] = useState(false)

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setSubmitted(true)
  }

  return (
    <main className="flex min-h-screen items-center justify-center px-6">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-1/2 top-1/3 h-[500px] w-[600px] -translate-x-1/2 rounded-full bg-primary/5 blur-[120px]" />
      </div>

      <div className="relative z-10 w-full max-w-md">
        <div className="mb-8 text-center">
          <Link href="/" className="mb-6 inline-flex items-center gap-2.5">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary">
              <Brain className="h-6 w-6 text-primary-foreground" />
            </div>
            <span className="text-xl font-semibold tracking-tight text-foreground">
              HireMind AI
            </span>
          </Link>
          <h1 className="mt-6 text-2xl font-bold text-foreground">
            Reset your password
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">
            {"Enter your email and we'll send you a reset link"}
          </p>
        </div>

        <div className="rounded-xl border border-border/50 bg-card/80 p-8 card-elevated">
          {!submitted ? (
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              <div className="flex flex-col gap-2">
                <Label htmlFor="email" className="text-sm text-muted-foreground">
                  Email
                </Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="you@company.com"
                  className="border-border/50 bg-secondary/50 text-foreground placeholder:text-muted-foreground/50"
                  required
                />
              </div>
              <Button type="submit" className="glow-indigo mt-2 w-full">
                Send Reset Link
              </Button>
            </form>
          ) : (
            <div className="text-center py-4">
              <CheckCircle className="mx-auto mb-4 h-12 w-12 text-[#10B981]" />
              <h3 className="text-lg font-semibold text-foreground">Check your email</h3>
              <p className="mt-2 text-sm text-muted-foreground">
                {"We've sent a password reset link to your email address."}
              </p>
            </div>
          )}
        </div>

        <div className="mt-6 text-center">
          <Link href="/login" className="inline-flex items-center gap-1.5 text-sm text-primary hover:underline">
            <ArrowLeft className="h-3.5 w-3.5" />
            Back to sign in
          </Link>
        </div>
      </div>
    </main>
  )
}
