import { DASHBOARD_COLORS, RESOURCE_TYPE_LABELS_PLURAL, STATUS_CHART_ORDER, STATUS_CONFIG } from '@/constants'
import type { DashboardCategoryCounts, DashboardSummary, ResourceType } from '@/types'

export interface ResourceDistributionProps {
  summary: DashboardSummary
}

const TYPE_ORDER: ResourceType[] = ['api', 'web-service', 'site']

function StackedBar({ counts, height = 'h-3' }: { counts: DashboardCategoryCounts; height?: string }) {
  if (counts.total === 0) {
    return (
      <div className={`${height} w-full rounded-full`} style={{ backgroundColor: DASHBOARD_COLORS.surfaceElevated }} />
    )
  }

  return (
    <div className={`flex ${height} w-full gap-0.5 overflow-hidden rounded-full`}>
      {STATUS_CHART_ORDER.filter((status) => counts[status] > 0).map((status) => (
        <div
          key={status}
          className="h-full transition-[flex-basis] duration-700 ease-out"
          style={{ flex: `${counts[status]} 0 0%`, backgroundColor: STATUS_CONFIG[status].bright }}
          title={`${STATUS_CONFIG[status].label}: ${counts[status]}`}
        />
      ))}
    </div>
  )
}

function StatusReadout({ status, value }: { status: (typeof STATUS_CHART_ORDER)[number]; value: number }) {
  if (value === 0) return null
  const config = STATUS_CONFIG[status]
  return (
    <span className="flex items-center gap-1.5 font-mono text-xs tabular-nums" style={{ color: config.bright }}>
      <span className="size-1.5 rounded-full" style={{ backgroundColor: config.bright }} aria-hidden="true" />
      {value}
      <span className="font-sans" style={{ color: DASHBOARD_COLORS.textFaint }}>
        {config.label.toLowerCase()}
      </span>
    </span>
  )
}

/**
 * Item 3 da hierarquia ("Distribuição dos Recursos") — um único
 * painel, não dois gráficos redundantes: a faixa agregada no topo
 * responde "qual a situação geral por status" (o que antes era um
 * donut isolado, informação já implícita na soma das barras por
 * categoria — por isso deixou de existir como gráfico separado); as
 * linhas abaixo detalham "de qual categoria", com leitura numérica
 * completa por status (Total/Online/Offline/Manutenção/Desconhecido),
 * não só os números que fogem do padrão.
 */
export function ResourceDistribution({ summary }: ResourceDistributionProps) {
  return (
    <div
      className="flex h-full flex-col gap-5 rounded-lg p-5"
      style={{ backgroundColor: DASHBOARD_COLORS.surface, border: `1px solid ${DASHBOARD_COLORS.border}` }}
    >
      <div className="flex items-center justify-between">
        <p
          className="text-[0.8125rem] font-semibold tracking-wide uppercase"
          style={{ color: DASHBOARD_COLORS.textMuted }}
        >
          Distribuição dos Recursos
        </p>
        <span className="font-mono text-xs tabular-nums" style={{ color: DASHBOARD_COLORS.textFaint }}>
          {summary.total} no total
        </span>
      </div>

      <div className="flex flex-col gap-2">
        <StackedBar
          counts={{
            total: summary.total,
            online: summary.online,
            offline: summary.offline,
            maintenance: summary.maintenance,
            unknown: summary.unknown,
          }}
          height="h-4"
        />
        <div className="flex flex-wrap items-center gap-x-4 gap-y-1">
          <StatusReadout status="online" value={summary.online} />
          <StatusReadout status="offline" value={summary.offline} />
          <StatusReadout status="maintenance" value={summary.maintenance} />
          <StatusReadout status="unknown" value={summary.unknown} />
        </div>
      </div>

      <div className="flex flex-col gap-4 border-t pt-4" style={{ borderColor: DASHBOARD_COLORS.border }}>
        {TYPE_ORDER.map((type) => {
          const counts = summary.byType[type]

          return (
            <div key={type} className="flex flex-col gap-1.5">
              <div className="flex items-baseline justify-between gap-2">
                <p className="text-sm font-semibold" style={{ color: DASHBOARD_COLORS.text }}>
                  {RESOURCE_TYPE_LABELS_PLURAL[type]}
                </p>
                <div className="flex items-center gap-3">
                  {STATUS_CHART_ORDER.map((status) => (
                    <StatusReadout key={status} status={status} value={counts[status]} />
                  ))}
                  <span className="font-mono text-xs tabular-nums" style={{ color: DASHBOARD_COLORS.textFaint }}>
                    {counts.total} total
                  </span>
                </div>
              </div>
              <StackedBar counts={counts} />
            </div>
          )
        })}
      </div>
    </div>
  )
}
