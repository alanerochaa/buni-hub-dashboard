import { DASHBOARD_COLORS, STATUS_CONFIG } from '@/constants'
import type { AvailabilityPoint } from '@/hooks/useAvailabilityHistory'

import { TrendingUpIcon } from './icons'

export interface HistoryPanelProps {
  points: AvailabilityPoint[]
}

const TIME_FORMATTER = new Intl.DateTimeFormat('pt-BR', {
  hour: '2-digit',
  minute: '2-digit',
})

const CHART_WIDTH = 1200
const CHART_HEIGHT = 120
const REFERENCE_LINES = [100, 95, 90]

function toneFor(percentage: number): string {
  if (percentage >= 99) return STATUS_CONFIG.online.bright
  if (percentage >= 95) return STATUS_CONFIG.maintenance.bright
  return STATUS_CONFIG.offline.bright
}

/**
 * Item 5 da hierarquia ("Evolução do Ambiente") — deliberadamente o
 * último painel da leitura: não é o que decide uma ação imediata (isso
 * já foi respondido pelos itens 1–4), é contexto de tendência. Faixa
 * larga e baixa (não um card quadrado) para não competir por atenção
 * com a tabela de incidentes acima. Sem gradiente de preenchimento —
 * só uma área sólida translúcida, para não parecer um gráfico de
 * "growth hacking".
 */
export function HistoryPanel({ points }: HistoryPanelProps) {
  const hasEnoughData = points.length >= 2

  const latest = points[points.length - 1]
  const color = latest ? toneFor(latest.value) : STATUS_CONFIG.online.bright

  const values = points.map((p) => p.value)
  const min = hasEnoughData ? Math.min(...values, 90) : 90
  const max = hasEnoughData ? Math.max(...values, min + 0.5) : 100
  const step = hasEnoughData ? CHART_WIDTH / (points.length - 1) : 0

  function yFor(value: number): number {
    return CHART_HEIGHT - ((value - min) / (max - min)) * CHART_HEIGHT
  }

  const linePoints = points.map((point, index) => `${(index * step).toFixed(1)},${yFor(point.value).toFixed(1)}`)
  const areaPoints = hasEnoughData
    ? `0,${CHART_HEIGHT} ${linePoints.join(' ')} ${CHART_WIDTH},${CHART_HEIGHT}`
    : ''

  return (
    <div
      className="flex shrink-0 flex-col gap-3 rounded-lg p-5"
      style={{ backgroundColor: DASHBOARD_COLORS.surface, border: `1px solid ${DASHBOARD_COLORS.border}` }}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span style={{ color: DASHBOARD_COLORS.textMuted }} aria-hidden="true">
            <TrendingUpIcon className="size-4" />
          </span>
          <p
            className="text-[0.8125rem] font-semibold tracking-wide uppercase"
            style={{ color: DASHBOARD_COLORS.textMuted }}
          >
            Evolução do Ambiente
          </p>
          <span className="text-xs" style={{ color: DASHBOARD_COLORS.textFaint }}>
            Disponibilidade ao longo da sessão atual
          </span>
        </div>
        {hasEnoughData && (
          <span className="font-mono text-xs tabular-nums" style={{ color: DASHBOARD_COLORS.textSubtle }}>
            {TIME_FORMATTER.format(points[0].timestamp)} — {TIME_FORMATTER.format(latest.timestamp)}
          </span>
        )}
      </div>

      {!hasEnoughData ? (
        <p className="py-6 text-center text-sm" style={{ color: DASHBOARD_COLORS.textFaint }}>
          Coletando histórico da sessão — o gráfico aparece a partir da segunda varredura.
        </p>
      ) : (
        <div className="relative">
          <svg
            viewBox={`0 0 ${CHART_WIDTH} ${CHART_HEIGHT}`}
            preserveAspectRatio="none"
            className="h-28 w-full"
          >
            {REFERENCE_LINES.filter((ref) => ref > min).map((ref) => (
              <line
                key={ref}
                x1={0}
                x2={CHART_WIDTH}
                y1={yFor(ref)}
                y2={yFor(ref)}
                stroke={DASHBOARD_COLORS.border}
                strokeWidth={1}
                strokeDasharray="4 4"
              />
            ))}
            <polygon points={areaPoints} fill={color} fillOpacity={0.08} />
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
          <div className="pointer-events-none absolute inset-0">
            {REFERENCE_LINES.filter((ref) => ref > min).map((ref) => (
              <span
                key={ref}
                className="absolute left-0 -translate-y-1/2 font-mono text-[0.625rem] tabular-nums"
                style={{ top: `${(yFor(ref) / CHART_HEIGHT) * 100}%`, color: DASHBOARD_COLORS.textFaint }}
              >
                {ref}%
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
