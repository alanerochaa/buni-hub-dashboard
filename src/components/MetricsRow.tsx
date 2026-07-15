import { RESOURCE_TYPE_LABELS_PLURAL, STATUS_CONFIG } from '@/constants'
import type { DashboardSummary, ResourceType } from '@/types'

import { AlertTriangleIcon, CheckCircleIcon, HelpCircleIcon, LayersIcon, WrenchIcon } from './icons'
import { MetricCard } from './MetricCard'

export interface MetricsRowProps {
  summary: DashboardSummary
}

const TYPE_ORDER: ResourceType[] = ['api', 'web-service', 'site']

/**
 * Hierarquia pedida: Online/Offline são a resposta imediata ("existe
 * algo fora do ar?"), por isso ganham cards grandes (hero) lado a
 * lado, cada um detalhando sua composição por categoria — o número
 * sozinho ("151 Online") comunica pouco; "151 Online: 122 APIs, 6 Web
 * Services, 23 Sites" comunica o suficiente para agir sem abrir mais
 * nenhuma tela. Em Manutenção/Desconhecidos/Total são contexto, não o
 * destaque principal, por isso ficam numa linha compacta abaixo.
 */
export function MetricsRow({ summary }: MetricsRowProps) {
  const onlineBreakdown = TYPE_ORDER.map((type) => ({
    label: RESOURCE_TYPE_LABELS_PLURAL[type],
    value: summary.byType[type].online,
  })).filter((item) => item.value > 0)

  const offlineBreakdown = TYPE_ORDER.map((type) => ({
    label: RESOURCE_TYPE_LABELS_PLURAL[type],
    value: summary.byType[type].offline,
  })).filter((item) => item.value > 0)

  return (
    <div className="flex flex-col gap-3">
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <MetricCard
          label="Online"
          value={summary.online}
          icon={<CheckCircleIcon />}
          accentColor={STATUS_CONFIG.online.bright}
          size="hero"
          caption={summary.online === summary.total ? 'Totalidade do ambiente saudável' : undefined}
          breakdown={onlineBreakdown}
        />
        <MetricCard
          label="Offline"
          value={summary.offline}
          icon={summary.offline > 0 ? <AlertTriangleIcon /> : <CheckCircleIcon />}
          accentColor={STATUS_CONFIG.offline.bright}
          size="hero"
          alert={summary.offline > 0}
          caption={summary.offline > 0 ? 'Requer atenção imediata' : 'Nenhuma ocorrência no momento'}
          breakdown={offlineBreakdown}
        />
      </div>
      <div className="grid grid-cols-3 gap-3">
        <MetricCard
          label="Em Manutenção"
          value={summary.maintenance}
          icon={<WrenchIcon className="size-4" />}
          accentColor={STATUS_CONFIG.maintenance.bright}
        />
        <MetricCard
          label="Desconhecidos"
          value={summary.unknown}
          icon={<HelpCircleIcon className="size-4" />}
          accentColor={STATUS_CONFIG.unknown.bright}
        />
        <MetricCard
          label="Total de Recursos"
          value={summary.total}
          icon={<LayersIcon className="size-4" />}
          accentColor="#6B7686"
        />
      </div>
    </div>
  )
}
