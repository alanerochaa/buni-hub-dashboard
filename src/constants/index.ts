import type { DashboardResourceStatus, ResourceEnvironment, ResourceType } from '../types'

/**
 * Paleta escura corporativa do Painel Operacional — escopada a este
 * projeto (nunca escrita em assets/styles/index.css como tema global),
 * para não depender de nenhuma paleta de marca de outro projeto.
 *
 * Referência de tom: instrumentação financeira/NOC (Azure Monitor,
 * Grafana, Datadog, Dynatrace) — superfícies neutras e pouco
 * saturadas, hierarquia por camadas (bg → surface → surfaceElevated),
 * nunca por saturação de cor. O objetivo é transmitir estabilidade e
 * confiabilidade numa tela ligada o dia inteiro, não chamar atenção
 * para si mesma.
 *
 * Contraste validado com a skill dataviz (`validate_palette.js`):
 * `text`/`textMuted`/`textSubtle` ≥ 4.5:1 sobre `surface` e `surfaceElevated`;
 * as variantes "bright" de status ≥ 5:1 sobre ambas (texto/ícone/dado
 * de gráfico); `textFaint` fica abaixo de 4.5:1 de propósito — só para
 * elementos decorativos/não-textuais (divisores, marcas de escala),
 * nunca para texto legível.
 */
export const DASHBOARD_COLORS = {
  bg: '#0B0F17',
  surface: '#131A24',
  surfaceElevated: '#1B2432',
  surfaceSunken: '#0E131C',
  border: 'rgba(255,255,255,0.07)',
  borderStrong: 'rgba(255,255,255,0.14)',
  text: '#E7E9ED',
  textMuted: '#9AA3B0',
  textSubtle: '#8892A2',
  textFaint: '#5B6472',
} as const

/**
 * Cores de status — escala fixa e reservada (nunca reaproveitada como
 * cor categórica). "base" é usada em preenchimentos/fundos translúcidos
 * (baixo peso visual); "bright" é usada em texto, ícone e dado de
 * gráfico (todas ≥ 5:1 sobre `surface`/`surfaceElevated`). Tons
 * deliberadamente menos saturados que um "verde/vermelho de alerta
 * genérico" — o objetivo é comunicar estado com clareza, sem parecer
 * um alerta de jogo.
 */
export const STATUS_CONFIG: Record<
  DashboardResourceStatus,
  { label: string; base: string; bright: string }
> = {
  online: { label: 'Online', base: '#1F7A5C', bright: '#3FB88A' },
  offline: { label: 'Offline', base: '#B91C1C', bright: '#F0645C' },
  maintenance: { label: 'Em Manutenção', base: '#A66A1E', bright: '#E0A63E' },
  unknown: { label: 'Desconhecido', base: '#64748B', bright: '#94A3B8' },
}

// Ordem de leitura da tabela de incidentes e dos gráficos — decisão de
// apresentação (frontend), não altera o que a API retorna.
export const INCIDENT_STATUS_ORDER: DashboardResourceStatus[] = [
  'offline',
  'maintenance',
  'unknown',
]

export const STATUS_CHART_ORDER: DashboardResourceStatus[] = [
  'online',
  'offline',
  'maintenance',
  'unknown',
]

export const RESOURCE_TYPE_LABELS: Record<ResourceType, string> = {
  api: 'API',
  'web-service': 'Web Service',
  site: 'Site',
}

export const RESOURCE_TYPE_LABELS_PLURAL: Record<ResourceType, string> = {
  api: 'APIs',
  'web-service': 'Web Services',
  site: 'Sites',
}

export const RESOURCE_ENVIRONMENT_LABELS: Record<ResourceEnvironment, string> = {
  homologacao: 'Homologação',
  producao: 'Produção',
  desenvolvimento: 'Desenvolvimento',
  unknown: 'Desconhecido',
}
