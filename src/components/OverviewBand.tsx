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

function formatPercentage(value: number): string {
  return `${value.toLocaleString('pt-BR', { maximumFractionDigits: 2 })}%`
}

const CELL_CLASSES = 'flex h-full flex-col justify-center gap-1 rounded-xl border px-2.5 py-1.5'

/**
 * Faixa única cobrindo os 3 primeiros níveis da hierarquia — Estado
 * Geral, Disponibilidade e Indicadores Principais — lidos em conjunto
 * pelo operador, sem números repetidos entre eles. As 7 células (Estado
 * Geral, Disponibilidade, Total, Online, Offline, Manutenção,
 * Desconhecidos) dividem a faixa em partes iguais — mesma altura,
 * mesma largura proporcional, mesmo tratamento visual (card
 * `surfaceElevated`), para leitura em grade única, sem hierarquia de
 * tamanho entre elas.
 */
export function OverviewBand({ summary }: OverviewBandProps) {
  const isOperational = summary.offline === 0
  const status = isOperational ? STATUS_CONFIG.online : STATUS_CONFIG.offline

  return (
    <div
      className="grid h-full grid-cols-7 gap-2.5 rounded-xl p-2.5"
      style={{
        backgroundColor: DASHBOARD_COLORS.surface,
        border: `1px solid ${DASHBOARD_COLORS.border}`,
        boxShadow: PANEL_SHADOW,
      }}
    >
      <div
        className={CELL_CLASSES}
        style={{ backgroundColor: DASHBOARD_COLORS.surfaceElevated, borderColor: `${status.bright}33` }}
      >
        <div className="flex flex-1 flex-col items-center justify-center gap-1 text-center">
          <span
            className="flex size-7 items-center justify-center rounded-full"
            style={{ backgroundColor: `${status.bright}1a`, color: status.bright }}
            aria-hidden="true"
          >
            {isOperational ? <CheckCircleIcon className="size-4" /> : <AlertTriangleIcon className="size-4" />}
          </span>
          <p className="text-xs leading-tight font-bold tracking-wide uppercase" style={{ color: status.bright }}>
            {isOperational ? 'Ambiente Operacional' : 'Incidente em Andamento'}
          </p>
          <p className="text-[0.625rem] leading-tight" style={{ color: DASHBOARD_COLORS.textSubtle }}>
            {isOperational ? 'Todos os sistemas funcionando normalmente.' : `${summary.offline} recurso(s) offline`}
          </p>
        </div>
      </div>

      <div className={CELL_CLASSES} style={{ backgroundColor: DASHBOARD_COLORS.surfaceElevated, borderColor: DASHBOARD_COLORS.border }}>
        <p className="text-center text-[0.5625rem] font-semibold tracking-wide uppercase" style={{ color: DASHBOARD_COLORS.textMuted }}>
          Disponibilidade Geral
        </p>
        <div className="flex flex-1 items-center justify-center">
          <AvailabilityGauge percentage={summary.availabilityPercentage} caption="Meta: ≥ 95%" />
        </div>
      </div>

      <MetricCard
        label="Total de Recursos"
        value={summary.total}
        icon={<LayersIcon className="size-3.5" />}
        accentColor={DASHBOARD_COLORS.textMuted}
        subtitle="100% do total"
      />
      <MetricCard
        label="Recursos Online"
        value={summary.online}
        icon={<CheckCircleIcon className="size-3.5" />}
        accentColor={STATUS_CONFIG.online.bright}
        subtitle={formatPercentage(shareOf(summary.online, summary.total))}
      />
      <MetricCard
        label="Recursos Offline"
        value={summary.offline}
        icon={<AlertTriangleIcon className="size-3.5" />}
        accentColor={STATUS_CONFIG.offline.bright}
        subtitle={formatPercentage(shareOf(summary.offline, summary.total))}
        alert={summary.offline > 0}
      />
      <MetricCard
        label="Em Manutenção"
        value={summary.maintenance}
        icon={<WrenchIcon className="size-3.5" />}
        accentColor={STATUS_CONFIG.maintenance.bright}
        subtitle={formatPercentage(shareOf(summary.maintenance, summary.total))}
      />
      <MetricCard
        label="Desconhecidos"
        value={summary.unknown}
        icon={<HelpCircleIcon className="size-3.5" />}
        accentColor={STATUS_CONFIG.unknown.bright}
        subtitle={formatPercentage(shareOf(summary.unknown, summary.total))}
      />
    </div>
  )
}
