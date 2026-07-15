import { DASHBOARD_COLORS, STATUS_CONFIG } from '@/constants'
import { useClock } from '@/hooks/useClock'
import { formatElapsed } from '@/utils/formatElapsed'

import { ShieldCheckIcon } from './icons'
import { Logo } from './Logo'

export interface DashboardHeaderProps {
  dataUpdatedAt: number
  totalResources: number
  offlineCount: number
}

const DATE_FORMATTER = new Intl.DateTimeFormat('pt-BR', {
  weekday: 'long',
  day: '2-digit',
  month: 'long',
  year: 'numeric',
})

const TIME_FORMATTER = new Intl.DateTimeFormat('pt-BR', {
  hour: '2-digit',
  minute: '2-digit',
  second: '2-digit',
  hour12: false,
})

function capitalize(value: string): string {
  return value.charAt(0).toUpperCase() + value.slice(1)
}

/**
 * Barra superior — três blocos (marca | status geral | horário),
 * separados por divisores verticais discretos, para caber em uma
 * única linha mesmo em notebooks (1366px) sem disputar espaço. O
 * status geral aqui é o mesmo dado já usado pelo StatusBanner
 * (offlineCount > 0), só reduzido a um badge compacto — não é uma
 * métrica nova, é a mesma informação vista em outro nível de zoom.
 */
export function DashboardHeader({ dataUpdatedAt, totalResources, offlineCount }: DashboardHeaderProps) {
  const now = useClock()
  const isOperational = offlineCount === 0
  const statusColor = isOperational ? STATUS_CONFIG.online.bright : STATUS_CONFIG.offline.bright

  return (
    <header
      className="flex shrink-0 flex-wrap items-center justify-between gap-x-8 gap-y-3 border-b px-6 py-3.5 lg:px-10"
      style={{ borderColor: DASHBOARD_COLORS.border, backgroundColor: DASHBOARD_COLORS.surfaceSunken }}
    >
      <div className="flex items-center gap-4">
        <Logo />
        <div className="border-l pl-4" style={{ borderColor: DASHBOARD_COLORS.borderStrong }}>
          <p className="text-base leading-tight font-semibold" style={{ color: DASHBOARD_COLORS.text }}>
            Painel Operacional
          </p>
          <div className="mt-0.5 flex items-center gap-2">
            <span
              className="size-1.5 rounded-full animate-pulse [animation-duration:2.5s]"
              style={{ backgroundColor: STATUS_CONFIG.online.bright }}
              aria-hidden="true"
            />
            <p
              className="text-[0.6875rem] font-medium tracking-[0.18em] uppercase"
              style={{ color: DASHBOARD_COLORS.textSubtle }}
            >
              Monitoramento contínuo
            </p>
          </div>
        </div>
      </div>

      <div className="flex flex-1 items-center justify-center gap-3">
        <span
          className="inline-flex items-center gap-2 rounded-full px-3.5 py-1.5 text-xs font-semibold tracking-wide uppercase"
          style={{ color: statusColor, backgroundColor: `${statusColor}16`, border: `1px solid ${statusColor}33` }}
        >
          <ShieldCheckIcon className="size-3.5" />
          {isOperational ? 'Ambiente operacional' : 'Atenção necessária'}
        </span>
        <span
          className="hidden rounded-full px-3.5 py-1.5 font-mono text-xs tabular-nums sm:inline-block"
          style={{ backgroundColor: DASHBOARD_COLORS.surfaceElevated, color: DASHBOARD_COLORS.textMuted }}
        >
          {totalResources} recursos monitorados
        </span>
      </div>

      <div className="flex items-center gap-6">
        <div className="hidden text-right md:block">
          <p className="text-[0.6875rem]" style={{ color: DASHBOARD_COLORS.textSubtle }}>
            Última atualização: {formatElapsed(dataUpdatedAt, now.getTime())}
          </p>
          <p className="text-sm" style={{ color: DASHBOARD_COLORS.textMuted }}>
            {capitalize(DATE_FORMATTER.format(now))}
          </p>
        </div>
        <p
          className="font-mono text-3xl leading-none font-bold tabular-nums lg:text-4xl"
          style={{ color: DASHBOARD_COLORS.text }}
        >
          {TIME_FORMATTER.format(now)}
        </p>
      </div>
    </header>
  )
}
