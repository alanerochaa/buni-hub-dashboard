import { CategoryDistributionTable } from '@/components/CategoryDistributionTable'
import { DashboardFooter } from '@/components/DashboardFooter'
import { DashboardHeader } from '@/components/DashboardHeader'
import { HistoryPanel } from '@/components/HistoryPanel'
import { IncidentsPanel } from '@/components/IncidentsPanel'
import { OverviewBand } from '@/components/OverviewBand'
import { DASHBOARD_COLORS } from '@/constants'
import { useClock } from '@/hooks/useClock'
import { useDashboard } from '@/hooks/useDashboard'
import { useOperationalHistory } from '@/hooks/useOperationalHistory'

export function DashboardPage() {
  const { data, isLoading, error, dataUpdatedAt } = useDashboard()
  const now = useClock()
  const { points: history } = useOperationalHistory()

  if (isLoading && !data) {
    return (
      <div className="flex h-screen items-center justify-center" style={{ backgroundColor: DASHBOARD_COLORS.bg }}>
        <p className="text-lg" style={{ color: DASHBOARD_COLORS.textMuted }}>
          Carregando Painel Operacional…
        </p>
      </div>
    )
  }

  if (error && !data) {
    return (
      <div className="flex h-screen items-center justify-center" style={{ backgroundColor: DASHBOARD_COLORS.bg }}>
        <p className="text-lg" style={{ color: '#F0645C' }}>
          {error}
        </p>
      </div>
    )
  }

  if (!data) return null

  return (
    <div className="flex h-screen flex-col overflow-hidden" style={{ backgroundColor: DASHBOARD_COLORS.bg }}>
      <DashboardHeader dataUpdatedAt={dataUpdatedAt} />

      <main className="flex min-h-0 flex-1 flex-col gap-4 overflow-hidden p-4">
        <div className="shrink-0">
          <OverviewBand summary={data.summary} />
        </div>

        <div className="grid shrink-0 grid-cols-[3fr_2fr] gap-4">
          <IncidentsPanel incidents={data.incidents} now={now.getTime()} className="h-full" />
          <HistoryPanel points={history} />
        </div>

        <div className="min-h-0 flex-1">
          <CategoryDistributionTable summary={data.summary} />
        </div>
      </main>

      <DashboardFooter />
    </div>
  )
}
