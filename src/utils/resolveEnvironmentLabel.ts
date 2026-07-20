export function resolveEnvironmentLabel(apiBaseUrl: string): string {
  try {
    const host = new URL(apiBaseUrl).hostname.toLowerCase()
    if (host.includes('prod')) return 'Produção'
    return 'Homologação'
  } catch {
    return 'Homologação'
  }
}
