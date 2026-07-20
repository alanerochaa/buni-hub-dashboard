import { useMemo } from 'react'

import {
  DASHBOARD_COLORS,
  INCIDENT_STATUS_ORDER,
  PANEL_SHADOW,
  RESOURCE_ENVIRONMENT_SHORT_LABELS,
  RESOURCE_TYPE_LABELS,
  SECTION_TITLE_CLASSES,
  STATUS_CONFIG,
} from '@/constants'
import type { DashboardIncident, DashboardIncidentEnvironment, ResourceType } from '@/types'
import { formatElapsed } from '@/utils/formatElapsed'

import { ApiIcon, ShieldCheckIcon, SiteIcon, WebServiceIcon } from './icons'
import { IconChip } from './IconChip'

export interface IncidentsPanelProps {
  incidents: DashboardIncident[]
  now: number
  className?: string
}

const TIME_FORMATTER = new Intl.DateTimeFormat('pt-BR', { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false })

const TYPE_ICONS: Record<ResourceType, typeof ApiIcon> = {
  api: ApiIcon,
  'web-service': WebServiceIcon,
  site: SiteIcon,
}

function AllOperationalState() {
  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-2">
      <span style={{ color: STATUS_CONFIG.online.bright }}>
        <ShieldCheckIcon className="size-9" />
      </span>
      <p className="text-base font-semibold" style={{ color: DASHBOARD_COLORS.text }}>
        Todos os recursos operacionais
      </p>
    </div>
  )
}

function EnvironmentBadge({ entry }: { entry: DashboardIncidentEnvironment }) {
  const config = STATUS_CONFIG[entry.status]
  return (
    <span
      className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold"
      style={{ color: config.bright, backgroundColor: `${config.base}1f`, border: `1px solid ${config.base}40` }}
      title={`${RESOURCE_ENVIRONMENT_SHORT_LABELS[entry.environment]}: ${config.label}`}
    >
      <span className="size-1.5 shrink-0 rounded-full" style={{ backgroundColor: config.bright }} />
      {RESOURCE_ENVIRONMENT_SHORT_LABELS[entry.environment]}
    </span>
  )
}

function sortForDisplay(incidents: DashboardIncident[]): DashboardIncident[] {
  return [...incidents].sort((a, b) => {
    const diff = INCIDENT_STATUS_ORDER.indexOf(a.status) - INCIDENT_STATUS_ORDER.indexOf(b.status)
    if (diff !== 0) return diff
    return a.name.localeCompare(b.name, 'pt-BR')
  })
}

// Ambiente com pior status primeiro — quem está lendo a linha não
// precisa escanear os dois badges para achar qual ambiente é o
// afetado, ele já vem à esquerda.
const ENVIRONMENT_BADGE_ORDER = [...INCIDENT_STATUS_ORDER, 'online'] as const

function sortEnvironmentsBySeverity(
  environments: DashboardIncidentEnvironment[],
): DashboardIncidentEnvironment[] {
  return [...environments].sort(
    (a, b) => ENVIRONMENT_BADGE_ORDER.indexOf(a.status) - ENVIRONMENT_BADGE_ORDER.indexOf(b.status),
  )
}

function primaryEnvironmentOf(incident: DashboardIncident): DashboardIncidentEnvironment {
  const matches = incident.environments.filter((entry) => entry.status === incident.status)
  if (incident.status === 'offline') {
    return matches.reduce((oldest, entry) =>
      (entry.offlineSince ?? '') < (oldest.offlineSince ?? '') ? entry : oldest,
    )
  }
  return matches[0] ?? incident.environments[0]
}

export function IncidentsPanel({ incidents, now, className = '' }: IncidentsPanelProps) {
  const sorted = useMemo(() => sortForDisplay(incidents), [incidents])

  // Tom neutro por padrão — só assume o vermelho de alerta quando há de
  // fato um recurso offline entre os listados; manutenção/desconhecido
  // sozinhos não justificam a mesma urgência visual.
  const hasOffline = sorted.some((incident) => incident.status === 'offline')
  const countTone = hasOffline ? STATUS_CONFIG.offline : { bright: DASHBOARD_COLORS.textMuted, base: DASHBOARD_COLORS.textMuted }

  return (
    <div
      className={`flex min-h-0 flex-col gap-3 overflow-hidden rounded-xl p-4 ${className}`}
      style={{
        backgroundColor: DASHBOARD_COLORS.surface,
        border: `1px solid ${DASHBOARD_COLORS.border}`,
        boxShadow: PANEL_SHADOW,
      }}
    >
      <div className="flex shrink-0 items-center justify-between">
        <p className={SECTION_TITLE_CLASSES} style={{ color: DASHBOARD_COLORS.textMuted }}>
          Recursos que Exigem Atenção
        </p>
        {sorted.length > 0 && (
          <span
            className="rounded-full px-2 py-0.5 font-mono text-xs font-medium tabular-nums"
            style={{ color: countTone.bright, backgroundColor: `${countTone.base}1f` }}
          >
            {sorted.length}
          </span>
        )}
      </div>

      {sorted.length === 0 ? (
        <AllOperationalState />
      ) : (
        <div className="flex min-h-0 flex-1 flex-col justify-center overflow-hidden">
          <table className="w-full table-fixed border-separate border-spacing-0 text-left">
            <colgroup>
              <col style={{ width: '2.25rem' }} />
              <col />
              <col style={{ width: '6rem' }} />
              <col style={{ width: '12rem' }} />
              <col style={{ width: '6rem' }} />
            </colgroup>
            <thead>
              <tr className="text-[0.6875rem] font-semibold" style={{ color: DASHBOARD_COLORS.textFaint }}>
                <th className="pb-2" />
                <th className="pb-2">Recurso</th>
                <th className="pb-2">Tipo</th>
                <th className="pb-2">Ambientes</th>
                <th className="pb-2 text-right">Tempo</th>
              </tr>
            </thead>
            <tbody>
              {sorted.map((incident) => {
                const TypeIcon = TYPE_ICONS[incident.type]
                const primary = primaryEnvironmentOf(incident)
                return (
                  <tr key={incident.id} style={{ borderTop: `1px solid ${DASHBOARD_COLORS.border}` }}>
                    <td className="py-2.5" title={incident.type}>
                      <IconChip size="sm">
                        <TypeIcon className="size-3" />
                      </IconChip>
                    </td>
                    <td className="truncate py-2.5 text-sm font-semibold" style={{ color: DASHBOARD_COLORS.text }} title={incident.name}>
                      {incident.name}
                    </td>
                    <td className="py-2.5 text-xs" style={{ color: DASHBOARD_COLORS.textSubtle }}>
                      {RESOURCE_TYPE_LABELS[incident.type]}
                    </td>
                    <td className="py-2.5">
                      <div className="flex flex-wrap gap-1.5">
                        {sortEnvironmentsBySeverity(incident.environments).map((entry) => (
                          <EnvironmentBadge key={entry.environment} entry={entry} />
                        ))}
                      </div>
                    </td>
                    <td className="py-2.5 text-right font-mono text-xs tabular-nums" style={{ color: DASHBOARD_COLORS.textSubtle }}>
                      {primary.status === 'offline' && primary.offlineSince
                        ? formatElapsed(new Date(primary.offlineSince).getTime(), now)
                        : TIME_FORMATTER.format(new Date(primary.lastCheckedAt))}
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
