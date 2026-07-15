import type { DashboardResourceStatus, ResourceEnvironment, ResourceType } from '../types'

/**
 * Paleta escura própria deste projeto (nunca em assets/styles/index.css
 * como tema global) — hierarquia por camadas (bg → surface →
 * surfaceElevated), nunca por saturação, referência NOC/financeira.
 *
 * Contraste validado com a skill dataviz: `text`/`textMuted`/`textSubtle`
 * ≥ 4.5:1 sobre `surface`/`surfaceElevated`. `textFaint` fica abaixo de
 * propósito — só para elementos decorativos, nunca texto legível.
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
 * Sombra única, reutilizada por todo painel de superfície (`surface`)
 * — profundidade sutil (elevação sobre `bg`), não um efeito chamativo.
 * Mesma sombra em todo o dashboard para manter consistência "premium"
 * sem introduzir variação visual desnecessária entre componentes.
 */
export const PANEL_SHADOW =
  '0 1px 0 0 rgba(255,255,255,0.04) inset, 0 12px 32px -16px rgba(0,0,0,0.6)'

/** Título de seção padrão — mesmo peso/tamanho em todos os painéis. */
export const SECTION_TITLE_CLASSES = 'text-sm font-semibold tracking-wide uppercase'

/**
 * Escala fixa e reservada, nunca reaproveitada como cor categórica.
 * "base": fundos translúcidos; "bright": texto/ícone/gráfico (≥ 5:1
 * sobre as superfícies). Tons deliberadamente menos saturados que um
 * alerta genérico.
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
