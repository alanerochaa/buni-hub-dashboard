import { useMemo } from 'react'

import {
  DASHBOARD_COLORS,
  INCIDENT_STATUS_ORDER,
  RESOURCE_ENVIRONMENT_LABELS,
  STATUS_CONFIG,
} from '@/constants'
import { useClock } from '@/hooks/useClock'
import type { DashboardIncident, ResourceType } from '@/types'
import { formatElapsed } from '@/utils/formatElapsed'

import { ApiIcon, ShieldCheckIcon, SiteIcon, WebServiceIcon } from './icons'

export interface IncidentsPanelProps {
  incidents: DashboardIncident[]
  className?: string
}

const TIME_FORMATTER = new Intl.DateTimeFormat('pt-BR', {
  hour: '2-digit',
  minute: '2-digit',
  second: '2-digit',
  hour12: false,
})

const TYPE_ICONS: Record<ResourceType, typeof ApiIcon> = {
  api: ApiIcon,
  'web-service': WebServiceIcon,
  site: SiteIcon,
}

function AllOperationalState() {
  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-3 py-16">
      <span style={{ color: STATUS_CONFIG.online.bright }}>
        <ShieldCheckIcon className="size-12" />
      </span>
      <p className="text-lg font-semibold" style={{ color: DASHBOARD_COLORS.text }}>
        Todos os serviços estão operacionais
      </p>
      <p className="text-sm" style={{ color: DASHBOARD_COLORS.textSubtle }}>
        Nenhum recurso exige atenção no momento.
      </p>
    </div>
  )
}

function StatusBadge({ status }: { status: DashboardIncident['status'] }) {
  const config = STATUS_CONFIG[status]
  return (
    <span
      className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold"
      style={{
        color: config.bright,
        backgroundColor: `${config.base}22`,
      }}
    >
      <span className="size-1.5 rounded-full" style={{ backgroundColor: config.bright }} />
      {config.label}
    </span>
  )
}

/**
 * Ordem de leitura pedida (Offline → Manutenção → Desconhecido) é
 * aplicada só aqui, na apresentação — a API já devolve apenas
 * incidentes (nunca Online), essa função apenas reorganiza a mesma
 * lista para a tela, sem tocar em regra de negócio do Backend.
 */
function sortForDisplay(incidents: DashboardIncident[]): DashboardIncident[] {
  return [...incidents].sort((a, b) => {
    const diff = INCIDENT_STATUS_ORDER.indexOf(a.status) - INCIDENT_STATUS_ORDER.indexOf(b.status)
    if (diff !== 0) return diff
    return a.name.localeCompare(b.name, 'pt-BR')
  })
}

/**
 * Item 4 da hierarquia ("Recursos em atenção") — a tabela principal
 * do sistema: recebe o maior espaço horizontal da página (largura
 * total, ver DashboardPage) e o tratamento tipográfico mais próximo
 * de um painel de Operações real — cabeçalho discreto, linhas com
 * respiro generoso, hierarquia por peso de fonte (nome em destaque,
 * metadados em tom secundário), nunca por cor além do necessário
 * (só a barra de severidade e o badge de status usam cor).
 */
export function IncidentsPanel({ incidents, className = '' }: IncidentsPanelProps) {
  const now = useClock()
  const sorted = useMemo(() => sortForDisplay(incidents), [incidents])

  return (
    <div
      className={`flex min-h-0 flex-col rounded-lg p-5 ${className}`}
      style={{ backgroundColor: DASHBOARD_COLORS.surface, border: `1px solid ${DASHBOARD_COLORS.border}` }}
    >
      <div className="mb-4 flex shrink-0 items-center justify-between">
        <p
          className="text-[0.8125rem] font-semibold tracking-wide uppercase"
          style={{ color: DASHBOARD_COLORS.textMuted }}
        >
          Recursos que Exigem Atenção
        </p>
        {sorted.length > 0 && (
          <span
            className="rounded-full px-3 py-1 font-mono text-sm font-semibold tabular-nums"
            style={{ color: STATUS_CONFIG.offline.bright, backgroundColor: `${STATUS_CONFIG.offline.base}22` }}
          >
            {sorted.length}
          </span>
        )}
      </div>

      {sorted.length === 0 ? (
        <AllOperationalState />
      ) : (
        <div className="min-h-0 flex-1 overflow-auto">
          <table className="w-full table-fixed border-separate border-spacing-0 text-left text-sm">
            <colgroup>
              {/* Reservado para um indicador de severidade futuro (hoje
                  o próprio status já ordena/colore a linha) — largura
                  fixa pequena para não exigir mudança de layout quando
                  essa coluna ganhar conteúdo. */}
              <col style={{ width: '0.25rem' }} />
              <col style={{ width: '2.75rem' }} />
              <col />
              <col style={{ width: '9.5rem' }} />
              <col style={{ width: '10rem' }} />
              <col style={{ width: '8.5rem' }} />
              <col style={{ width: '8.5rem' }} />
            </colgroup>
            <thead>
              <tr
                className="text-[0.6875rem] font-semibold tracking-wider uppercase"
                style={{ color: DASHBOARD_COLORS.textFaint }}
              >
                <th className="sticky top-0 py-2.5" style={{ backgroundColor: DASHBOARD_COLORS.surface }} />
                <th className="sticky top-0 py-2.5" style={{ backgroundColor: DASHBOARD_COLORS.surface }} />
                <th className="sticky top-0 px-3 py-2.5" style={{ backgroundColor: DASHBOARD_COLORS.surface }}>
                  Recurso
                </th>
                <th className="sticky top-0 px-3 py-2.5" style={{ backgroundColor: DASHBOARD_COLORS.surface }}>
                  Ambiente
                </th>
                <th className="sticky top-0 px-3 py-2.5" style={{ backgroundColor: DASHBOARD_COLORS.surface }}>
                  Status
                </th>
                <th className="sticky top-0 px-3 py-2.5" style={{ backgroundColor: DASHBOARD_COLORS.surface }}>
                  Última verificação
                </th>
                <th className="sticky top-0 px-3 py-2.5" style={{ backgroundColor: DASHBOARD_COLORS.surface }}>
                  Tempo offline
                </th>
              </tr>
            </thead>
            <tbody>
              {sorted.map((incident) => {
                const TypeIcon = TYPE_ICONS[incident.type]
                const config = STATUS_CONFIG[incident.status]
                return (
                  <tr
                    key={incident.id}
                    className="transition-colors hover:bg-white/[0.025]"
                    style={{ borderTop: `1px solid ${DASHBOARD_COLORS.border}` }}
                  >
                    <td style={{ backgroundColor: config.bright }} />
                    <td className="px-3 py-3.5" style={{ color: DASHBOARD_COLORS.textSubtle }} title={incident.type}>
                      <TypeIcon className="size-4" />
                    </td>
                    <td
                      className="truncate px-3 py-3.5 font-medium"
                      style={{ color: DASHBOARD_COLORS.text }}
                      title={incident.name}
                    >
                      {incident.name}
                    </td>
                    <td className="px-3 py-3.5" style={{ color: DASHBOARD_COLORS.textSubtle }}>
                      {RESOURCE_ENVIRONMENT_LABELS[incident.environment]}
                    </td>
                    <td className="px-3 py-3.5">
                      <StatusBadge status={incident.status} />
                    </td>
                    <td
                      className="px-3 py-3.5 font-mono tabular-nums"
                      style={{ color: DASHBOARD_COLORS.textSubtle }}
                    >
                      {TIME_FORMATTER.format(new Date(incident.lastCheckedAt))}
                    </td>
                    <td
                      className="px-3 py-3.5 font-mono tabular-nums"
                      style={{ color: DASHBOARD_COLORS.textSubtle }}
                    >
                      {incident.status === 'offline' && incident.offlineSince
                        ? formatElapsed(new Date(incident.offlineSince).getTime(), now.getTime())
                        : '—'}
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
