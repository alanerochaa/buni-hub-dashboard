import { CategoryDistributionTable } from '@/components/CategoryDistributionTable'
import { DashboardFooter } from '@/components/DashboardFooter'
import { DashboardHeader } from '@/components/DashboardHeader'
import { HistoryPanel } from '@/components/HistoryPanel'
import { IncidentsPanel } from '@/components/IncidentsPanel'
import { OverviewBand } from '@/components/OverviewBand'
import { DASHBOARD_COLORS } from '@/constants'
import { useAvailabilityHistory } from '@/hooks/useAvailabilityHistory'
import { useClock } from '@/hooks/useClock'
import { useDashboard } from '@/hooks/useDashboard'

/**
 * Modo TV: `h-screen overflow-hidden`, sem rolagem em nenhuma
 * dimensão — obrigatório para Full HD (1920x1080). As duas primeiras
 * faixas (OverviewBand, CategoryDistributionTable) têm altura fixa;
 * a linha final (Atenção + Histórico) absorve o espaço restante via
 * `flex-1`, com `IncidentsPanel` limitando linhas visíveis para nunca
 * depender de scroll interno.
 *
 * Ordem = hierarquia de leitura, cada dado em exatamente um lugar
 * (justificativa por item no comentário do próprio componente):
 * OverviewBand (Estado Geral + Disponibilidade + Indicadores) →
 * CategoryDistributionTable → IncidentsPanel + HistoryPanel.
 */
export function DashboardPage() {
  const { data, isLoading, error, dataUpdatedAt } = useDashboard()
  const now = useClock()
  const percentage = data ? Math.min(100, Math.max(0, data.summary.availabilityPercentage)) : 0
  const history = useAvailabilityHistory(percentage, data?.summary.lastSweepAt ?? null)

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

      <main className="flex min-h-0 flex-1 flex-col gap-4 overflow-hidden p-5">
        <div className="h-[160px] shrink-0">
          <OverviewBand summary={data.summary} />
        </div>

        <div className="h-[190px] shrink-0">
          <CategoryDistributionTable summary={data.summary} />
        </div>

        <div className="flex min-h-0 flex-1 gap-4">
          <div className="min-h-0 flex-[1.6]">
            <IncidentsPanel incidents={data.incidents} now={now.getTime()} className="h-full" />
          </div>
          <div className="min-h-0 flex-1">
            <HistoryPanel points={history} />
          </div>
        </div>
      </main>

      <DashboardFooter />
    </div>
  )
}
