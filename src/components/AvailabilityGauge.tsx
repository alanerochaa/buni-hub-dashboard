import { DASHBOARD_COLORS, STATUS_CONFIG } from '@/constants'

export interface AvailabilityGaugeProps {
  percentage: number
  /** Legenda abaixo do percentual — ex.: "Meta: ≥ 95%". */
  caption?: string
}

function toneFor(percentage: number): string {
  if (percentage >= 99) return STATUS_CONFIG.online.bright
  if (percentage >= 95) return STATUS_CONFIG.maintenance.bright
  return STATUS_CONFIG.offline.bright
}

const GAUGE_WIDTH = 108
const GAUGE_HEIGHT = 58
const GAUGE_RADIUS = 45
const GAUGE_STROKE = 9
const GAUGE_CENTER_X = GAUGE_WIDTH / 2
const GAUGE_CENTER_Y = 51
// pathLength=100 deixa strokeDasharray em unidades de porcentagem
// direto, sem calcular circunferência manualmente.
const GAUGE_PATH = `M ${GAUGE_CENTER_X - GAUGE_RADIUS} ${GAUGE_CENTER_Y} A ${GAUGE_RADIUS} ${GAUGE_RADIUS} 0 0 1 ${GAUGE_CENTER_X + GAUGE_RADIUS} ${GAUGE_CENTER_Y}`

/**
 * Gauge semicircular compacto — representa "Disponibilidade Geral"
 * uma única vez na tela (não repete o percentual como card à parte).
 * Sem sparkline própria: a tendência ao longo do tempo é só o
 * HistoryPanel, para não duplicar a mesma série em dois lugares.
 */
export function AvailabilityGauge({ percentage, caption }: AvailabilityGaugeProps) {
  const clamped = Math.min(100, Math.max(0, percentage))
  const color = toneFor(clamped)
  const label = clamped.toLocaleString('pt-BR', {
    minimumFractionDigits: clamped % 1 === 0 ? 0 : 2,
    maximumFractionDigits: 2,
  })

  return (
    <div className="relative shrink-0" style={{ width: GAUGE_WIDTH }}>
      <svg viewBox={`0 0 ${GAUGE_WIDTH} ${GAUGE_HEIGHT}`} className="w-full">
        <path d={GAUGE_PATH} fill="none" stroke={DASHBOARD_COLORS.surface} strokeWidth={GAUGE_STROKE} strokeLinecap="round" />
        <path
          d={GAUGE_PATH}
          fill="none"
          stroke={color}
          strokeWidth={GAUGE_STROKE}
          strokeLinecap="round"
          pathLength={100}
          strokeDasharray={`${clamped} 100`}
          style={{ transition: 'stroke-dasharray 700ms ease, stroke 700ms ease' }}
        />
      </svg>
      <div className="absolute inset-x-0 bottom-0 flex flex-col items-center">
        <span className="font-mono text-xl leading-none font-bold tabular-nums" style={{ color: DASHBOARD_COLORS.text }}>
          {label}
          <span className="text-xs" style={{ color: DASHBOARD_COLORS.textMuted }}>
            %
          </span>
        </span>
        {caption && (
          <span className="mt-0.5 text-[0.5625rem] tracking-[0.1em] uppercase" style={{ color: DASHBOARD_COLORS.textFaint }}>
            {caption}
          </span>
        )}
      </div>
    </div>
  )
}
