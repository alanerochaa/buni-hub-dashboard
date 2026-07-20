import { DASHBOARD_COLORS, PANEL_SHADOW, SECTION_TITLE_CLASSES, STATUS_CONFIG } from '@/constants'
import type { AvailabilityPoint } from '@/types'

export interface HistoryPanelProps {
  points: AvailabilityPoint[]
}

const WIDTH = 680
const HEIGHT = 200
const PADDING_LEFT = 32
const PADDING_RIGHT = 6
const PADDING_TOP = 6
const PADDING_BOTTOM = 18
const PLOT_LEFT = PADDING_LEFT
const PLOT_RIGHT = WIDTH - PADDING_RIGHT
const PLOT_TOP = PADDING_TOP
const PLOT_BOTTOM = HEIGHT - PADDING_BOTTOM
const PLOT_WIDTH = PLOT_RIGHT - PLOT_LEFT
const PLOT_HEIGHT = PLOT_BOTTOM - PLOT_TOP

const MAX_X_TICKS = 7

const DATE_FORMATTER = new Intl.DateTimeFormat('pt-BR', { day: '2-digit', month: '2-digit' })

function toneFor(percentage: number): string {
  if (percentage >= 99) return STATUS_CONFIG.online.bright
  if (percentage >= 95) return STATUS_CONFIG.maintenance.bright
  return STATUS_CONFIG.offline.bright
}

function buildYTicks(values: number[]): number[] {
  const dataMin = Math.min(80, ...values)
  const domainMin = Math.floor(dataMin / 5) * 5
  const ticks: number[] = []
  for (let tick = 100; tick >= domainMin; tick -= 5) {
    ticks.push(tick)
  }
  return ticks
}

interface XTick {
  index: number
  label: string
}

function pickTickIndexes(count: number): number[] {
  if (count <= MAX_X_TICKS) return Array.from({ length: count }, (_, index) => index)

  const step = (count - 1) / (MAX_X_TICKS - 1)
  const indexes = Array.from({ length: MAX_X_TICKS }, (_, tick) => Math.round(tick * step))
  return Array.from(new Set(indexes))
}

function buildXTicks(points: AvailabilityPoint[]): XTick[] {
  const indexes = pickTickIndexes(points.length)
  const ticks: XTick[] = []
  let lastLabel: string | null = null

  indexes.forEach((index, position) => {
    const label = DATE_FORMATTER.format(points[index].timestamp)
    const isLast = position === indexes.length - 1
    if (label === lastLabel && !isLast) return
    ticks.push({ index, label })
    lastLabel = label
  })

  return ticks
}

export function HistoryPanel({ points }: HistoryPanelProps) {
  const hasEnoughData = points.length >= 2
  const latest = points[points.length - 1]
  const color = latest ? toneFor(latest.value) : STATUS_CONFIG.online.bright

  const values = points.map((point) => point.value)
  const yTicks = hasEnoughData ? buildYTicks(values) : [100, 95, 90, 85, 80]
  const domainMin = yTicks[yTicks.length - 1]
  const domainMax = yTicks[0]

  function xFor(index: number): number {
    return PLOT_LEFT + (index / (points.length - 1)) * PLOT_WIDTH
  }

  function yFor(value: number): number {
    const clamped = Math.min(domainMax, Math.max(domainMin, value))
    return PLOT_BOTTOM - ((clamped - domainMin) / (domainMax - domainMin)) * PLOT_HEIGHT
  }

  const linePoints = points.map((point, index) => `${xFor(index).toFixed(1)},${yFor(point.value).toFixed(1)}`)
  const xTicks = hasEnoughData ? buildXTicks(points) : []

  return (
    <div
      className="flex h-full min-h-[16rem] flex-col gap-3 rounded-xl p-4"
      style={{
        backgroundColor: DASHBOARD_COLORS.surface,
        border: `1px solid ${DASHBOARD_COLORS.border}`,
        boxShadow: PANEL_SHADOW,
      }}
    >
      <div className="flex shrink-0 items-center justify-between">
        <p className={SECTION_TITLE_CLASSES} style={{ color: DASHBOARD_COLORS.textMuted }}>
          Histórico de Disponibilidade
        </p>
        <span
          className="text-[0.6875rem]"
          style={{ color: DASHBOARD_COLORS.textFaint }}
          title="Período coberto pelo Histórico Operacional persistido"
        >
          Últimos 7 dias
        </span>
      </div>

      {!hasEnoughData ? (
        <div className="flex flex-1 items-center justify-center">
          <p className="text-xs" style={{ color: DASHBOARD_COLORS.textFaint }}>
            Coletando histórico operacional…
          </p>
        </div>
      ) : (
        <svg viewBox={`0 0 ${WIDTH} ${HEIGHT}`} preserveAspectRatio="none" className="min-h-0 flex-1">
          {yTicks.map((tick) => (
            <g key={tick}>
              <line
                x1={PLOT_LEFT}
                x2={PLOT_RIGHT}
                y1={yFor(tick)}
                y2={yFor(tick)}
                stroke={DASHBOARD_COLORS.border}
                strokeWidth={1}
              />
              <text
                x={PLOT_LEFT - 6}
                y={yFor(tick)}
                textAnchor="end"
                dominantBaseline="middle"
                fontSize={9}
                fill={DASHBOARD_COLORS.textFaint}
              >
                {tick}%
              </text>
            </g>
          ))}

          {xTicks.map(({ index, label }) => (
            <text
              key={index}
              x={xFor(index)}
              y={PLOT_BOTTOM + 15}
              textAnchor={index === 0 ? 'start' : index === points.length - 1 ? 'end' : 'middle'}
              fontSize={9}
              fill={DASHBOARD_COLORS.textFaint}
            >
              {label}
            </text>
          ))}

          <polyline
            points={linePoints.join(' ')}
            fill="none"
            stroke={color}
            strokeWidth={1.5}
            strokeLinecap="round"
            strokeLinejoin="round"
            style={{ transition: 'stroke 700ms ease' }}
          />
        </svg>
      )}

      {hasEnoughData && (
        <div className="flex shrink-0 items-center gap-1.5">
          <span className="h-0.5 w-4 rounded-full" style={{ backgroundColor: color }} aria-hidden="true" />
          <span className="text-[0.6875rem]" style={{ color: DASHBOARD_COLORS.textSubtle }}>
            Disponibilidade
          </span>
        </div>
      )}
    </div>
  )
}
