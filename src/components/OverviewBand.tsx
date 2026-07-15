import { DASHBOARD_COLORS, PANEL_SHADOW, STATUS_CONFIG } from '@/constants'
import type { DashboardSummary } from '@/types'

import { AvailabilityGauge } from './AvailabilityGauge'
import { AlertTriangleIcon, CheckCircleIcon, HelpCircleIcon, LayersIcon, WrenchIcon } from './icons'
import { MetricCard } from './MetricCard'

export interface OverviewBandProps {
  summary: DashboardSummary
}

function shareOf(value: number, total: number): number {
  return total > 0 ? Math.round((value / total) * 10_000) / 100 : 0
}

/**
 * Faixa única cobrindo os 3 primeiros níveis da hierarquia — Estado
 * Geral, Disponibilidade e Indicadores Principais — lidos em conjunto
 * pelo operador, sem números repetidos entre eles: o veredito é texto
 * (sem números), a Disponibilidade só existe no gauge, e cada KPI
 * aparece uma única vez.
 */
export function OverviewBand({ summary }: OverviewBandProps) {
  const isOperational = summary.offline === 0
  const status = isOperational ? STATUS_CONFIG.online : STATUS_CONFIG.offline

  return (
    <div
      className="flex h-full items-stretch gap-5 rounded-xl p-4"
      style={{
        backgroundColor: DASHBOARD_COLORS.surface,
        border: `1px solid ${DASHBOARD_COLORS.border}`,
        boxShadow: PANEL_SHADOW,
      }}
    >
      <div className="flex w-56 shrink-0 flex-col items-center justify-center gap-2 border-r pr-5 text-center" style={{ borderColor: DASHBOARD_COLORS.border }}>
        <span
          className="flex size-14 items-center justify-center rounded-full"
          style={{ backgroundColor: `${status.bright}1a`, color: status.bright }}
          aria-hidden="true"
        >
          {isOperational ? <CheckCircleIcon className="size-7" /> : <AlertTriangleIcon className="size-7" />}
        </span>
        <p className="text-sm font-bold tracking-wide uppercase" style={{ color: status.bright }}>
          {isOperational ? 'Ambiente Operacional' : 'Incidente em Andamento'}
        </p>
        <p className="text-xs" style={{ color: DASHBOARD_COLORS.textSubtle }}>
          {isOperational ? 'Todos os sistemas normais' : `${summary.offline} recurso(s) offline`}
        </p>
      </div>

      <div className="flex shrink-0 items-center border-r pr-5" style={{ borderColor: DASHBOARD_COLORS.border }}>
        <AvailabilityGauge percentage={summary.availabilityPercentage} />
      </div>

      <div className="grid flex-1 grid-cols-5 gap-3">
        <MetricCard
          label="Total"
          value={summary.total}
          icon={<LayersIcon className="size-4" />}
          accentColor={DASHBOARD_COLORS.textMuted}
        />
        <MetricCard
          label="Online"
          value={summary.online}
          icon={<CheckCircleIcon className="size-4" />}
          accentColor={STATUS_CONFIG.online.bright}
          percentage={shareOf(summary.online, summary.total)}
        />
        <MetricCard
          label="Offline"
          value={summary.offline}
          icon={<AlertTriangleIcon className="size-4" />}
          accentColor={STATUS_CONFIG.offline.bright}
          percentage={shareOf(summary.offline, summary.total)}
          alert={summary.offline > 0}
        />
        <MetricCard
          label="Manutenção"
          value={summary.maintenance}
          icon={<WrenchIcon className="size-4" />}
          accentColor={STATUS_CONFIG.maintenance.bright}
          percentage={shareOf(summary.maintenance, summary.total)}
        />
        <MetricCard
          label="Desconhecidos"
          value={summary.unknown}
          icon={<HelpCircleIcon className="size-4" />}
          accentColor={STATUS_CONFIG.unknown.bright}
          percentage={shareOf(summary.unknown, summary.total)}
        />
      </div>
    </div>
  )
}
