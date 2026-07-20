export function formatElapsed(fromMs: number, nowMs: number): string {
  if (!fromMs) return '—'
  const diffSeconds = Math.max(0, Math.round((nowMs - fromMs) / 1000))

  if (diffSeconds < 5) return 'agora mesmo'
  if (diffSeconds < 60) return `há ${diffSeconds} segundos`

  const diffMinutes = Math.round(diffSeconds / 60)
  if (diffMinutes < 60) return `há ${diffMinutes} ${diffMinutes === 1 ? 'minuto' : 'minutos'}`

  const diffHours = Math.round(diffMinutes / 60)
  return `há ${diffHours} ${diffHours === 1 ? 'hora' : 'horas'}`
}
