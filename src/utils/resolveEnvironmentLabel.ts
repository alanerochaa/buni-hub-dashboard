/**
 * "Ambiente monitorado" no header identifica qual instância da API
 * este Dashboard consome (via VITE_API_BASE_URL) — não é um agregado
 * do campo `environment` de cada recurso (o payload de /dashboard não
 * expõe essa distribuição). Heurística simples por host, sem endpoint novo.
 */
export function resolveEnvironmentLabel(apiBaseUrl: string): string {
  try {
    const host = new URL(apiBaseUrl).hostname.toLowerCase()
    if (host === 'localhost' || host === '127.0.0.1') return 'Desenvolvimento'
    if (host.includes('ghml') || host.includes('hml') || host.includes('staging')) return 'Homologação'
    return 'Produção'
  } catch {
    return 'Produção'
  }
}
