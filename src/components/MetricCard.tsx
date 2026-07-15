import type { ReactNode } from 'react'

import { DASHBOARD_COLORS } from '@/constants'
import { useCountUp } from '@/hooks/useCountUp'

export interface MetricCardBreakdownItem {
  label: string
  value: number
}

export interface MetricCardProps {
  label: string
  value: number
  icon: ReactNode
  accentColor: string
  size?: 'hero' | 'compact'
  /** Ativa o tratamento de alerta (usado só por Offline > 0). */
  alert?: boolean
  /** Legenda curta abaixo do número (ex. "ambiente estável"). */
  caption?: string
  /** Composição por categoria — só usada nos cards hero (Online/Offline). */
  breakdown?: MetricCardBreakdownItem[]
}

/**
 * Card de KPI com dois pesos visuais: `hero` (Online/Offline — as duas
 * perguntas que precisam de resposta em menos de 3s) e `compact`
 * (Em Manutenção/Desconhecidos/Total — contexto secundário). Cada
 * card tem identidade própria via faixa de cor no topo + ícone + peso
 * tipográfico — nunca por saturação alta de fundo, para não competir
 * visualmente com o estado de alerta real (offline > 0).
 */
export function MetricCard({
  label,
  value,
  icon,
  accentColor,
  size = 'compact',
  alert,
  caption,
  breakdown,
}: MetricCardProps) {
  const displayValue = useCountUp(value)
  const isHero = size === 'hero'

  return (
    <div
      className={`relative flex flex-1 flex-col overflow-hidden rounded-lg transition-colors ${
        isHero ? 'gap-3 px-6 py-5' : 'gap-2 px-4 py-3.5'
      }`}
      style={{
        backgroundColor: alert ? `${accentColor}12` : DASHBOARD_COLORS.surface,
        border: `1px solid ${alert ? `${accentColor}45` : DASHBOARD_COLORS.border}`,
        boxShadow: `inset 0 2px 0 0 ${alert ? accentColor : `${accentColor}55`}`,
      }}
    >
      <div className="flex items-center justify-between">
        <p
          className={`font-semibold tracking-wide uppercase ${isHero ? 'text-[0.8125rem]' : 'text-[0.6875rem]'}`}
          style={{ color: alert ? accentColor : DASHBOARD_COLORS.textMuted }}
        >
          {label}
        </p>
        <span
          className={alert ? 'animate-pulse [animation-duration:2.5s]' : ''}
          style={{ color: accentColor }}
        >
          {icon}
        </span>
      </div>

      <p
        className={`font-mono leading-none font-bold tabular-nums ${isHero ? 'text-6xl' : 'text-3xl'}`}
        style={{ color: DASHBOARD_COLORS.text }}
      >
        {displayValue}
      </p>

      {caption && (
        <p className="text-xs" style={{ color: alert ? accentColor : DASHBOARD_COLORS.textSubtle }}>
          {caption}
        </p>
      )}

      {isHero && breakdown && breakdown.length > 0 && (
        <div
          className="mt-1 flex flex-wrap items-center gap-x-4 gap-y-1 border-t pt-3"
          style={{ borderColor: alert ? `${accentColor}30` : DASHBOARD_COLORS.border }}
        >
          {breakdown.map((item) => (
            <span key={item.label} className="flex items-baseline gap-1.5 text-sm">
              <span className="font-mono font-semibold tabular-nums" style={{ color: DASHBOARD_COLORS.text }}>
                {item.value}
              </span>
              <span style={{ color: DASHBOARD_COLORS.textSubtle }}>{item.label}</span>
            </span>
          ))}
        </div>
      )}
    </div>
  )
}
