import { AvailabilityGauge } from '@/components/AvailabilityGauge'
import { DashboardHeader } from '@/components/DashboardHeader'
import { HistoryPanel } from '@/components/HistoryPanel'
import { IncidentsPanel } from '@/components/IncidentsPanel'
import { MetricsRow } from '@/components/MetricsRow'
import { ResourceDistribution } from '@/components/ResourceDistribution'
import { StatusBanner } from '@/components/StatusBanner'
import { DASHBOARD_COLORS } from '@/constants'
import { useAvailabilityHistory } from '@/hooks/useAvailabilityHistory'
import { useDashboard } from '@/hooks/useDashboard'

/**
 * Modo TV: tela cheia, sem Sidebar/Header institucional, sem
 * navegação — objetivo diferente de um portal de consulta/cadastro.
 * Este projeto é um frontend independente, com esta página como único
 * ponto de entrada (ver src/App.tsx).
 *
 * Hierarquia de leitura (de cima para baixo, a ordem em que um
 * operador deve absorver a tela em até 5 segundos):
 *   1. StatusBanner + MetricsRow  — Estado Geral
 *   2. AvailabilityGauge          — Disponibilidade
 *   3. ResourceDistribution       — Distribuição dos Recursos
 *   4. IncidentsPanel             — Recursos em atenção (largura total,
 *      é a tabela principal do sistema)
 *   5. HistoryPanel               — Evolução do ambiente
 *
 * Disponibilidade e Distribuição dividem a mesma linha em telas largas
 * (>= xl) — lidas em sequência esquerda→direita, sem gastar altura de
 * tela extra à toa — mas cada uma ocupa a largura total em telas
 * estreitas, mantendo a ordem 2 antes de 3 também em notebook.
 *
 * Sem altura fixa de propósito: em Full HD/2K/4K tudo cabe numa tela
 * só; em resoluções menores a própria página rola verticalmente —
 * nunca corta conteúdo nem depende de zoom do navegador.
 */
export function DashboardPage() {
  const { data, isLoading, error, dataUpdatedAt } = useDashboard()
  const percentage = data ? Math.min(100, Math.max(0, data.summary.availabilityPercentage)) : 0
  const history = useAvailabilityHistory(percentage, data?.summary.lastSweepAt ?? null)

  if (isLoading && !data) {
    return (
      <div
        className="flex min-h-svh items-center justify-center"
        style={{ backgroundColor: DASHBOARD_COLORS.bg }}
      >
        <p className="text-lg" style={{ color: DASHBOARD_COLORS.textMuted }}>
          Carregando Painel Operacional…
        </p>
      </div>
    )
  }

  if (error && !data) {
    return (
      <div
        className="flex min-h-svh items-center justify-center"
        style={{ backgroundColor: DASHBOARD_COLORS.bg }}
      >
        <p className="text-lg" style={{ color: '#F0645C' }}>
          {error}
        </p>
      </div>
    )
  }

  if (!data) return null

  return (
    <div className="flex min-h-svh flex-col" style={{ backgroundColor: DASHBOARD_COLORS.bg }}>
      <DashboardHeader
        dataUpdatedAt={dataUpdatedAt}
        totalResources={data.summary.total}
        offlineCount={data.summary.offline}
      />
      <StatusBanner summary={data.summary} />

      <main className="flex flex-1 flex-col gap-4 px-6 py-5 lg:gap-5 lg:px-10 lg:py-6 2xl:mx-auto 2xl:w-full 2xl:max-w-[120rem]">
        <MetricsRow summary={data.summary} />

        <div className="grid grid-cols-1 gap-4 lg:gap-5 xl:grid-cols-[22rem_1fr]">
          <AvailabilityGauge summary={data.summary} history={history} />
          <ResourceDistribution summary={data.summary} />
        </div>

        <IncidentsPanel incidents={data.incidents} className="min-h-[20rem] flex-1" />

        <HistoryPanel points={history} />
      </main>
    </div>
  )
}
