/**
 * "Ambiente monitorado" no header identifica qual instância da API
 * este Dashboard consome (via VITE_API_BASE_URL) — não é um agregado
 * do campo `environment` de cada recurso (o payload de /dashboard não
 * expõe essa distribuição). Heurística simples por host, sem endpoint novo.
 *
 * Default é Homologação, não Produção nem Desenvolvimento: o catálogo
 * hoje é majoritariamente homologação (ver ingestion/README.md) — e
 * isso vale mesmo apontando para `localhost`, já que a API local
 * normalmente serve o mesmo catálogo de homologação. Só assume
 * Produção com evidência explícita no host, nunca por omissão.
 */
export function resolveEnvironmentLabel(apiBaseUrl: string): string {
  try {
    const host = new URL(apiBaseUrl).hostname.toLowerCase()
    if (host.includes('prod')) return 'Produção'
    return 'Homologação'
  } catch {
    return 'Homologação'
  }
}
