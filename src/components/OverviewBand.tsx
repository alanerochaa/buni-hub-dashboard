import { DASHBOARD_COLORS, PANEL_SHADOW, STATUS_CONFIG } from '@/constants'
import { useCountUp } from '@/hooks/useCountUp'
import type { DashboardSummary } from '@/types'

import { AvailabilityGauge } from './AvailabilityGauge'
import { AlertTriangleIcon, CheckCircleIcon, HelpCircleIcon, WrenchIcon } from './icons'

export interface OverviewBandProps {
  summary: DashboardSummary
}

function shareOf(value: number, total: number): number {
  return total > 0 ? Math.round((value / total) * 10_000) / 100 : 0
}

function formatPercentage(value: number): string {
  return `${value.toLocaleString('pt-BR', { maximumFractionDigits: 2 })}%`
}

// Sem borda própria de propósito — a diferença de cor para o fundo do
// painel (surfaceElevated vs. surface) já separa visualmente cada
// célula; borda só aparece onde sinaliza estado (Estado Geral, alerta
// de um indicador offline), nunca só por estrutura.
const TILE_CLASSES = 'rounded-xl'
const TILE_STYLE = { backgroundColor: DASHBOARD_COLORS.surfaceElevated }

interface MiniStatProps {
  label: string
  value: number
  icon: React.ReactNode
  accentColor: string
  subtitle: string
  alert?: boolean
}

// Tile compacto (mesma linguagem visual das duas células hero: bloco
// "surfaceElevated" próprio) — os 4 lado a lado numa única linha são a
// unidade visual, não cada indicador isolado. Deliberadamente menores
// que as duas células hero: são o detalhamento do veredito, não
// informação de mesma prioridade.
function MiniStat({ label, value, icon, accentColor, subtitle, alert }: MiniStatProps) {
  const displayValue = useCountUp(value)

  return (
    <div
      className={`${TILE_CLASSES} flex flex-col justify-center gap-0.5 px-2 py-1 ${alert ? 'border' : ''}`}
      style={{
        backgroundColor: alert ? `${accentColor}14` : DASHBOARD_COLORS.surfaceElevated,
        borderColor: alert ? `${accentColor}40` : undefined,
      }}
    >
      <div className="flex items-center justify-between">
        <span style={{ color: accentColor }}>{icon}</span>
        <span className="font-mono text-[0.625rem] tabular-nums" style={{ color: DASHBOARD_COLORS.textFaint }}>
          {subtitle}
        </span>
      </div>
      <span className="font-mono text-base leading-none font-bold tabular-nums" style={{ color: DASHBOARD_COLORS.text }}>
        {displayValue}
      </span>
      <span className="truncate text-[0.6875rem] font-medium" style={{ color: DASHBOARD_COLORS.textMuted }}>
        {label}
      </span>
    </div>
  )
}

/**
 * Faixa única cobrindo os 3 primeiros níveis da hierarquia, com peso
 * visual decrescente: Disponibilidade Geral (gauge maior, ver
 * `AvailabilityGauge`) continua sendo o indicador principal; Estado
 * Geral é secundário (ícone + 2 linhas de texto); os 4 indicadores de
 * contagem ficam numa única linha compacta, o nível de detalhe mais
 * baixo da hierarquia — por isso em linha, não em grade 2×2 (uma grade
 * de 2 linhas ficava mais alta que as duas células hero, sobrando
 * espaço vazio nelas para acompanhar). Total de Recursos é só o
 * denominador da legenda do Estado Geral, não um card próprio.
 *
 * Altura sempre intrínseca ao conteúdo (sem `h-full`/px fixo no
 * container em `DashboardPage`) — um valor fixo já subestimou o
 * conteúdo real uma vez e fez esta faixa sobrepor a seção seguinte,
 * porque o wrapper não tinha `overflow-hidden`.
 *
 * Células sem borda própria por padrão — só a diferença de cor de
 * fundo (surfaceElevated sobre surface) separa cada uma; borda
 * aparece só para sinalizar estado (Estado Geral, indicador em
 * alerta), nunca por estrutura, para a faixa parecer um conjunto
 * único, não cards independentes.
 */
export function OverviewBand({ summary }: OverviewBandProps) {
  const isOperational = summary.offline === 0
  const status = isOperational ? STATUS_CONFIG.online : STATUS_CONFIG.offline
  const statusSubtitle = isOperational
    ? `Todos os sistemas normais · ${summary.total} recursos monitorados`
    : `${summary.offline} de ${summary.total} recursos offline`

  return (
    <div
      className="grid grid-cols-[1.1fr_1.2fr_1.7fr] gap-3 rounded-xl p-3"
      style={{
        backgroundColor: DASHBOARD_COLORS.surface,
        border: `1px solid ${DASHBOARD_COLORS.border}`,
        boxShadow: PANEL_SHADOW,
      }}
    >
      <div
        className={`${TILE_CLASSES} border flex h-full items-center gap-3 px-3 py-2`}
        style={{ backgroundColor: DASHBOARD_COLORS.surfaceElevated, borderColor: `${status.bright}33` }}
      >
        <span
          className="flex size-8 shrink-0 items-center justify-center rounded-full"
          style={{ backgroundColor: `${status.bright}1a`, color: status.bright }}
          aria-hidden="true"
        >
          {isOperational ? <CheckCircleIcon className="size-4.5" /> : <AlertTriangleIcon className="size-4.5" />}
        </span>
        <div className="flex min-w-0 flex-col gap-0.5">
          <p className="text-lg leading-tight font-bold" style={{ color: status.bright }}>
            {isOperational ? 'Ambiente Operacional' : 'Incidente em Andamento'}
          </p>
          <p className="truncate text-xs leading-tight" style={{ color: DASHBOARD_COLORS.textSubtle }}>
            {statusSubtitle}
          </p>
        </div>
      </div>

      <div className={`${TILE_CLASSES} flex h-full flex-col items-center justify-center gap-1 py-2`} style={TILE_STYLE}>
        <p className="text-xs font-semibold" style={{ color: DASHBOARD_COLORS.textMuted }}>
          Disponibilidade Geral
        </p>
        <AvailabilityGauge percentage={summary.availabilityPercentage} caption="Meta: ≥ 95%" />
      </div>

      <div className="grid h-full grid-cols-4 gap-1.5">
        <MiniStat
          label="Online"
          value={summary.online}
          icon={<CheckCircleIcon className="size-3.5" />}
          accentColor={STATUS_CONFIG.online.bright}
          subtitle={formatPercentage(shareOf(summary.online, summary.total))}
        />
        <MiniStat
          label="Offline"
          value={summary.offline}
          icon={<AlertTriangleIcon className="size-3.5" />}
          accentColor={STATUS_CONFIG.offline.bright}
          subtitle={formatPercentage(shareOf(summary.offline, summary.total))}
          alert={summary.offline > 0}
        />
        <MiniStat
          label="Em Manutenção"
          value={summary.maintenance}
          icon={<WrenchIcon className="size-3.5" />}
          accentColor={STATUS_CONFIG.maintenance.bright}
          subtitle={formatPercentage(shareOf(summary.maintenance, summary.total))}
        />
        <MiniStat
          label="Desconhecidos"
          value={summary.unknown}
          icon={<HelpCircleIcon className="size-3.5" />}
          accentColor={STATUS_CONFIG.unknown.bright}
          subtitle={formatPercentage(shareOf(summary.unknown, summary.total))}
        />
      </div>
    </div>
  )
}
