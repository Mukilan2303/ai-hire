import { DashboardTopbar } from "@/components/dashboard/topbar"
import { StatCards } from "@/components/dashboard/stat-cards"
import { CandidateTable } from "@/components/dashboard/candidate-table"
import { RecentActivity } from "@/components/dashboard/recent-activity"

export default function DashboardPage() {
  return (
    <div className="flex flex-col">
      <DashboardTopbar title="Dashboard" />
      <div className="flex-1 px-8 py-8">
        <StatCards />

        <div className="mt-8 grid gap-8 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <CandidateTable />
          </div>
          <div>
            <RecentActivity />
          </div>
        </div>
      </div>
    </div>
  )
}
