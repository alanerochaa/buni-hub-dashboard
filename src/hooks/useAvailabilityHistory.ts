import { useEffect, useState } from 'react'

// AvailabilityGauge usa os últimos 12 pontos; 30 dá folga sem
// acumular histórico ilimitado em memória.
const MAX_POINTS = 30

export interface AvailabilityPoint {
  timestamp: number
  value: number
}

/**
 * Histórico acumulado no cliente — não há endpoint de série histórica
 * no Backend hoje. Só cresce quando `lastSweepAt` muda de fato (dedupe
 * por timestamp), nunca a cada re-render; não persiste entre reloads.
 * Retorno já no formato que um futuro endpoint devolveria, então trocar
 * por um `useQuery` não exigiria mudar `AvailabilityGauge`.
 */
export function useAvailabilityHistory(
  percentage: number,
  lastSweepAt: string | null,
): AvailabilityPoint[] {
  const [history, setHistory] = useState<AvailabilityPoint[]>([])

  useEffect(() => {
    if (!lastSweepAt) return
    const timestamp = new Date(lastSweepAt).getTime()

    // setState só dentro do callback (não direto no corpo do efeito),
    // mesmo padrão já usado em useCountUp — evita disparar a
    // atualização de estado como efeito colateral síncrono do render.
    const frame = requestAnimationFrame(() => {
      setHistory((prev) => {
        if (prev.length > 0 && prev[prev.length - 1].timestamp === timestamp) return prev
        const next = [...prev, { timestamp, value: percentage }]
        return next.length > MAX_POINTS ? next.slice(next.length - MAX_POINTS) : next
      })
    })

    return () => cancelAnimationFrame(frame)
  }, [lastSweepAt, percentage])

  return history
}
