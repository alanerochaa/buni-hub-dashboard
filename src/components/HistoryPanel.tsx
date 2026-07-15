import { DASHBOARD_COLORS, PANEL_SHADOW, SECTION_TITLE_CLASSES, STATUS_CONFIG } from '@/constants'
import type { AvailabilityPoint } from '@/hooks/useAvailabilityHistory'

export interface HistoryPanelProps {
  points: AvailabilityPoint[]
}

const CHART_WIDTH = 480
const CHART_HEIGHT = 60

function toneFor(percentage: number): string {
  if (percentage >= 99) return STATUS_CONFIG.online.bright
  if (percentage >= 95) return STATUS_CONFIG.maintenance.bright
  return STATUS_CONFIG.offline.bright
}

/**
 * Item 6 da hierarquia — só tendência, deliberadamente pequeno: o
 * valor atual de disponibilidade já está no gauge, este painel existe
 * só para responder "isso é recente ou vem de mais cedo?".
 */
export function HistoryPanel({ points }: HistoryPanelProps) {
  const hasEnoughData = points.length >= 2
  const latest = points[points.length - 1]
  const color = latest ? toneFor(latest.value) : STATUS_CONFIG.online.bright

  const values = points.map((p) => p.value)
  const min = hasEnoughData ? Math.min(...values, 95) : 95
  const max = hasEnoughData ? Math.max(...values, min + 0.5) : 100
  const step = hasEnoughData ? CHART_WIDTH / (points.length - 1) : 0

  function yFor(value: number): number {
    return CHART_HEIGHT - ((value - min) / (max - min)) * CHART_HEIGHT
  }

  const linePoints = points.map((point, index) => `${(index * step).toFixed(1)},${yFor(point.value).toFixed(1)}`)
  const areaPoints = hasEnoughData ? `0,${CHART_HEIGHT} ${linePoints.join(' ')} ${CHART_WIDTH},${CHART_HEIGHT}` : ''

  return (
    <div
      className="flex h-full flex-col gap-2 rounded-xl p-4"
      style={{
        backgroundColor: DASHBOARD_COLORS.surface,
        border: `1px solid ${DASHBOARD_COLORS.border}`,
        boxShadow: PANEL_SHADOW,
      }}
    >
      <p className={SECTION_TITLE_CLASSES} style={{ color: DASHBOARD_COLORS.textMuted }}>
        Histórico de Disponibilidade
      </p>

      {!hasEnoughData ? (
        <div className="flex flex-1 items-center justify-center">
          <p className="text-xs" style={{ color: DASHBOARD_COLORS.textFaint }}>
            Coletando dados da sessão…
          </p>
        </div>
      ) : (
        <svg viewBox={`0 0 ${CHART_WIDTH} ${CHART_HEIGHT}`} preserveAspectRatio="none" className="flex-1">
          <polygon points={areaPoints} fill={color} fillOpacity={0.1} />
          <polyline
            points={linePoints.join(' ')}
            fill="none"
            stroke={color}
            strokeWidth={2}
            strokeLinecap="round"
            strokeLinejoin="round"
            style={{ transition: 'stroke 700ms ease' }}
          />
        </svg>
      )}
    </div>
  )
}
