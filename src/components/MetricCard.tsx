import type { ReactNode } from 'react'

import { DASHBOARD_COLORS } from '@/constants'
import { useCountUp } from '@/hooks/useCountUp'

export interface MetricCardProps {
  label: string
  value: number
  icon: ReactNode
  accentColor: string
  /** Linha pequena abaixo do número — percentual ou "100% do total". */
  subtitle?: string
  /** Ativa o tratamento de alerta (usado só por Offline > 0). */
  alert?: boolean
}

/**
 * Célula de KPI uniforme — mesma estrutura de `AmbienteOperacionalCard`/
 * `DisponibilidadeGeralCard` (label no topo, valor central, legenda
 * abaixo), para as 7 células da faixa de visão geral ficarem com
 * altura/alinhamento idênticos.
 */
export function MetricCard({ label, value, icon, accentColor, subtitle, alert }: MetricCardProps) {
  const displayValue = useCountUp(value)

  return (
    <div
      className="flex h-full flex-col justify-center gap-1 rounded-xl px-2.5 py-1.5"
      style={{
        backgroundColor: alert ? `${accentColor}12` : DASHBOARD_COLORS.surfaceElevated,
        border: `1px solid ${alert ? `${accentColor}40` : DASHBOARD_COLORS.border}`,
      }}
    >
      <div className="flex items-center gap-1.5">
        <span style={{ color: accentColor }}>{icon}</span>
        <p
          className="truncate text-[0.5625rem] leading-tight font-semibold tracking-wide uppercase"
          style={{ color: alert ? accentColor : DASHBOARD_COLORS.textMuted }}
        >
          {label}
        </p>
      </div>
      <p className="font-mono text-2xl leading-none font-bold tabular-nums" style={{ color: DASHBOARD_COLORS.text }}>
        {displayValue}
      </p>
      {subtitle !== undefined && (
        <span className="font-mono text-[0.6875rem] tabular-nums" style={{ color: DASHBOARD_COLORS.textFaint }}>
          {subtitle}
        </span>
      )}
    </div>
  )
}
