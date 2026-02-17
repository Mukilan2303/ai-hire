"use client"

import { DashboardTopbar } from "@/components/dashboard/topbar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Settings, Bell, Shield, User } from "lucide-react"

export default function SettingsPage() {
  return (
    <div className="flex flex-col">
      <DashboardTopbar title="Settings" />
      <div className="flex-1 px-8 py-8">
        <div className="mx-auto max-w-2xl">
          {/* Profile */}
          <div className="mb-8 rounded-xl border border-border/50 bg-card/80 p-6 card-elevated">
            <div className="mb-6 flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                <User className="h-5 w-5 text-primary" />
              </div>
              <h2 className="text-base font-semibold text-foreground">
                Profile
              </h2>
            </div>
            <div className="flex flex-col gap-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-2">
                  <Label className="text-sm text-muted-foreground">
                    First name
                  </Label>
                  <Input
                    defaultValue="Jane"
                    className="border-border/50 bg-secondary/50 text-foreground"
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <Label className="text-sm text-muted-foreground">
                    Last name
                  </Label>
                  <Input
                    defaultValue="Smith"
                    className="border-border/50 bg-secondary/50 text-foreground"
                  />
                </div>
              </div>
              <div className="flex flex-col gap-2">
                <Label className="text-sm text-muted-foreground">
                  Email
                </Label>
                <Input
                  defaultValue="jane@company.com"
                  className="border-border/50 bg-secondary/50 text-foreground"
                />
              </div>
              <div className="flex flex-col gap-2">
                <Label className="text-sm text-muted-foreground">
                  Company
                </Label>
                <Input
                  defaultValue="Acme Corp"
                  className="border-border/50 bg-secondary/50 text-foreground"
                />
              </div>
              <Button className="glow-indigo w-fit">Save Changes</Button>
            </div>
          </div>

          {/* Notifications */}
          <div className="mb-8 rounded-xl border border-border/50 bg-card/80 p-6 card-elevated">
            <div className="mb-6 flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#06B6D4]/10">
                <Bell className="h-5 w-5 text-[#06B6D4]" />
              </div>
              <h2 className="text-base font-semibold text-foreground">
                Notifications
              </h2>
            </div>
            <div className="flex flex-col gap-4">
              {[
                { label: "New candidate matches", description: "Get notified when AI finds high-match candidates", defaultChecked: true },
                { label: "Bias alerts", description: "Receive alerts when bias is detected in your pipeline", defaultChecked: true },
                { label: "Weekly reports", description: "Get a weekly summary of your hiring pipeline", defaultChecked: false },
                { label: "AI insights", description: "Receive proactive insights from the AI copilot", defaultChecked: true },
              ].map((item) => (
                <div
                  key={item.label}
                  className="flex items-center justify-between rounded-lg bg-secondary/20 px-4 py-3"
                >
                  <div>
                    <p className="text-sm font-medium text-foreground">
                      {item.label}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {item.description}
                    </p>
                  </div>
                  <Switch defaultChecked={item.defaultChecked} />
                </div>
              ))}
            </div>
          </div>

          {/* Security */}
          <div className="rounded-xl border border-border/50 bg-card/80 p-6 card-elevated">
            <div className="mb-6 flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#10B981]/10">
                <Shield className="h-5 w-5 text-[#10B981]" />
              </div>
              <h2 className="text-base font-semibold text-foreground">
                Security
              </h2>
            </div>
            <div className="flex flex-col gap-4">
              <div className="flex items-center justify-between rounded-lg bg-secondary/20 px-4 py-3">
                <div>
                  <p className="text-sm font-medium text-foreground">
                    Two-factor authentication
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Add an extra layer of security to your account
                  </p>
                </div>
                <Switch />
              </div>
              <Button variant="outline" className="w-fit border-border/50">
                Change Password
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
