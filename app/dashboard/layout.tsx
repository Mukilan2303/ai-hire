import { ClientOnly } from "@/components/client-only"
import { DashboardSidebar } from "@/components/dashboard/sidebar"
import { AppStoreProvider } from "@/lib/store"

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <ClientOnly>
      <AppStoreProvider>
        <div className="flex min-h-screen">
          <DashboardSidebar />
          <div className="flex-1 lg:pl-64">
            {children}
          </div>
        </div>
      </AppStoreProvider>
    </ClientOnly>
  )
}
