import {
  DASHBOARD_COLORS,
  PANEL_SHADOW,
  RESOURCE_TYPE_LABELS_PLURAL,
  SECTION_TITLE_CLASSES,
  STATUS_CONFIG,
} from '@/constants'
import type { DashboardSummary, ResourceType } from '@/types'

import { ApiIcon, SiteIcon, WebServiceIcon } from './icons'

export interface CategoryDistributionTableProps {
  summary: DashboardSummary
}

const TYPE_ORDER: ResourceType[] = ['api', 'web-service', 'site']

const TYPE_ICONS: Record<ResourceType, typeof ApiIcon> = {
  api: ApiIcon,
  'web-service': WebServiceIcon,
  site: SiteIcon,
}

function availabilityOf(online: number, total: number): number {
  return total > 0 ? Math.round((online / total) * 10_000) / 100 : 100
}

/**
 * Item 4 da hierarquia — única fonte de "qual categoria foi
 * impactada". Formato de tabela (não cards empilhados) para caber as
 * 3 categorias em pouca altura, com barra de disponibilidade por
 * linha em vez de um gráfico separado.
 */
export function CategoryDistributionTable({ summary }: CategoryDistributionTableProps) {
  return (
    <div
      className="flex h-full flex-col gap-3 rounded-xl p-5"
      style={{
        backgroundColor: DASHBOARD_COLORS.surface,
        border: `1px solid ${DASHBOARD_COLORS.border}`,
        boxShadow: PANEL_SHADOW,
      }}
    >
      <p className={SECTION_TITLE_CLASSES} style={{ color: DASHBOARD_COLORS.textMuted }}>
        Distribuição por Categoria
      </p>

      <table className="w-full flex-1 border-separate border-spacing-0 text-left text-sm">
        <thead>
          <tr className="text-[0.6875rem] font-semibold tracking-wider uppercase" style={{ color: DASHBOARD_COLORS.textFaint }}>
            <th className="pb-2 font-semibold">Tipo</th>
            <th className="pb-2 text-right font-semibold">Total</th>
            <th className="pb-2 text-right font-semibold">Online</th>
            <th className="pb-2 text-right font-semibold">Offline</th>
            <th className="pb-2 text-right font-semibold">Manut.</th>
            <th className="pb-2 text-right font-semibold">Desc.</th>
            <th className="pb-2 pl-4 font-semibold">Disponibilidade</th>
          </tr>
        </thead>
        <tbody>
          {TYPE_ORDER.map((type) => {
            const counts = summary.byType[type]
            const TypeIcon = TYPE_ICONS[type]
            const availability = availabilityOf(counts.online, counts.total)

            return (
              <tr key={type} style={{ borderTop: `1px solid ${DASHBOARD_COLORS.border}` }}>
                <td className="py-3">
                  <div className="flex items-center gap-2">
                    <span style={{ color: DASHBOARD_COLORS.textMuted }}>
                      <TypeIcon className="size-4" />
                    </span>
                    <span className="font-semibold" style={{ color: DASHBOARD_COLORS.text }}>
                      {RESOURCE_TYPE_LABELS_PLURAL[type]}
                    </span>
                  </div>
                </td>
                <td className="py-3 text-right font-mono tabular-nums" style={{ color: DASHBOARD_COLORS.text }}>
                  {counts.total}
                </td>
                <td className="py-3 text-right font-mono tabular-nums" style={{ color: STATUS_CONFIG.online.bright }}>
                  {counts.online}
                </td>
                <td className="py-3 text-right font-mono tabular-nums" style={{ color: STATUS_CONFIG.offline.bright }}>
                  {counts.offline}
                </td>
                <td className="py-3 text-right font-mono tabular-nums" style={{ color: STATUS_CONFIG.maintenance.bright }}>
                  {counts.maintenance}
                </td>
                <td className="py-3 text-right font-mono tabular-nums" style={{ color: STATUS_CONFIG.unknown.bright }}>
                  {counts.unknown}
                </td>
                <td className="py-3 pl-4">
                  <div className="flex items-center gap-2.5">
                    <div className="h-2 w-28 overflow-hidden rounded-full" style={{ backgroundColor: DASHBOARD_COLORS.surfaceElevated }}>
                      <div
                        className="h-full rounded-full"
                        style={{
                          width: `${availability}%`,
                          backgroundColor:
                            availability >= 99
                              ? STATUS_CONFIG.online.bright
                              : availability >= 95
                                ? STATUS_CONFIG.maintenance.bright
                                : STATUS_CONFIG.offline.bright,
                          transition: 'width 700ms ease',
                        }}
                      />
                    </div>
                    <span className="font-mono text-xs tabular-nums" style={{ color: DASHBOARD_COLORS.textSubtle }}>
                      {availability.toLocaleString('pt-BR', { maximumFractionDigits: 2 })}%
                    </span>
                  </div>
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}
