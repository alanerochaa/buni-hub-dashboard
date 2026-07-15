import { DASHBOARD_COLORS, STATUS_CONFIG } from '@/constants'
import type { AvailabilityPoint } from '@/hooks/useAvailabilityHistory'
import type { DashboardSummary } from '@/types'

export interface AvailabilityGaugeProps {
  summary: DashboardSummary
  /** Histórico completo da sessão — este painel só usa a cauda recente (tendência). */
  history: AvailabilityPoint[]
}

function toneFor(percentage: number): string {
  if (percentage >= 99) return STATUS_CONFIG.online.bright
  if (percentage >= 95) return STATUS_CONFIG.maintenance.bright
  return STATUS_CONFIG.offline.bright
}

const GAUGE_WIDTH = 240
const GAUGE_HEIGHT = 132
const GAUGE_RADIUS = 100
const GAUGE_STROKE = 18
const GAUGE_CENTER_X = GAUGE_WIDTH / 2
const GAUGE_CENTER_Y = 118
// Semicírculo (180°) desenhado da esquerda para a direita — usar
// pathLength=100 deixa strokeDasharray em unidades de porcentagem
// direto, sem precisar calcular circunferência manualmente.
const GAUGE_PATH = `M ${GAUGE_CENTER_X - GAUGE_RADIUS} ${GAUGE_CENTER_Y} A ${GAUGE_RADIUS} ${GAUGE_RADIUS} 0 0 1 ${GAUGE_CENTER_X + GAUGE_RADIUS} ${GAUGE_CENTER_Y}`

function MicroTrend({ points, color }: { points: { value: number }[]; color: string }) {
  if (points.length < 2) {
    return (
      <p className="text-xs" style={{ color: DASHBOARD_COLORS.textFaint }}>
        Coletando tendência da sessão…
      </p>
    )
  }

  const width = 220
  const height = 28
  const values = points.map((p) => p.value)
  const min = Math.min(...values, 100)
  const max = Math.max(...values, min + 0.5)
  const step = width / (points.length - 1)

  const coords = points.map((point, index) => {
    const x = index * step
    const y = height - ((point.value - min) / (max - min)) * height
    return `${x.toFixed(1)},${y.toFixed(1)}`
  })

  return (
    <svg viewBox={`0 0 ${width} ${height}`} className="h-7 w-full" preserveAspectRatio="none">
      <polyline
        points={coords.join(' ')}
        fill="none"
        stroke={color}
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
        style={{ transition: 'stroke 700ms ease' }}
      />
    </svg>
  )
}

/**
 * Gauge semicircular — item 2 da hierarquia ("Disponibilidade"),
 * inspirado no instrumento de painel de controle (velocímetro), não
 * num anel de progresso genérico: comunica "quão perto do teto de
 * 100%" de forma mais imediata que uma barra linear, sem o peso visual
 * de um donut cheio. A tendência da sessão aqui é só um micro-contexto
 * ("subiu ou caiu recentemente?") — o histórico completo, com mais
 * pontos e eixo de tempo, vive em HistoryPanel (item 5, "Evolução").
 */
export function AvailabilityGauge({ summary, history }: AvailabilityGaugeProps) {
  const percentage = Math.min(100, Math.max(0, summary.availabilityPercentage))
  const color = toneFor(percentage)
  const percentageLabel = percentage.toLocaleString('pt-BR', {
    minimumFractionDigits: percentage % 1 === 0 ? 0 : 2,
    maximumFractionDigits: 2,
  })
  const microHistory = history.slice(-12)

  return (
    <div
      className="flex h-full flex-col gap-1 rounded-lg p-5"
      style={{ backgroundColor: DASHBOARD_COLORS.surface, border: `1px solid ${DASHBOARD_COLORS.border}` }}
    >
      <p
        className="text-[0.8125rem] font-semibold tracking-wide uppercase"
        style={{ color: DASHBOARD_COLORS.textMuted }}
      >
        Disponibilidade Geral
      </p>

      <div className="relative mx-auto mt-1 w-full max-w-[15rem]">
        <svg viewBox={`0 0 ${GAUGE_WIDTH} ${GAUGE_HEIGHT}`} className="w-full">
          <path
            d={GAUGE_PATH}
            fill="none"
            stroke={DASHBOARD_COLORS.surfaceElevated}
            strokeWidth={GAUGE_STROKE}
            strokeLinecap="round"
          />
          <path
            d={GAUGE_PATH}
            fill="none"
            stroke={color}
            strokeWidth={GAUGE_STROKE}
            strokeLinecap="round"
            pathLength={100}
            strokeDasharray={`${percentage} 100`}
            style={{ transition: 'stroke-dasharray 700ms ease, stroke 700ms ease' }}
          />
        </svg>
        <div className="absolute inset-x-0 bottom-1 flex flex-col items-center">
          <span
            className="font-mono text-4xl leading-none font-bold tabular-nums"
            style={{ color: DASHBOARD_COLORS.text }}
          >
            {percentageLabel}
            <span className="text-lg" style={{ color: DASHBOARD_COLORS.textMuted }}>
              %
            </span>
          </span>
          <span className="mt-1 font-mono text-xs tabular-nums" style={{ color: DASHBOARD_COLORS.textSubtle }}>
            {summary.online} / {summary.total} online
          </span>
        </div>
      </div>

      <div className="mt-auto border-t pt-3" style={{ borderColor: DASHBOARD_COLORS.border }}>
        <p className="mb-1 text-[0.6875rem] tracking-wide uppercase" style={{ color: DASHBOARD_COLORS.textFaint }}>
          Tendência da sessão
        </p>
        <MicroTrend points={microHistory} color={color} />
      </div>
    </div>
  )
}
