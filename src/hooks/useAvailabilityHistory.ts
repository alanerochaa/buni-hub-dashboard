import { useEffect, useState } from 'react'

// A 30s por sweep, 60 pontos cobrem ~30min de sessão — suficiente para
// o AvailabilityGauge (últimos 12 pontos, tendência recente) e para o
// HistoryPanel (série completa, "Evolução do Ambiente").
const MAX_POINTS = 60

export interface AvailabilityPoint {
  timestamp: number
  value: number
}

/**
 * Histórico de disponibilidade acumulado no cliente, a partir de dados
 * reais já recebidos do polling — não há endpoint de série histórica
 * no Backend hoje (ver api/), então esta é a estrutura preparada para
 * uma futura série vinda do servidor, sem inventar dados: só cresce
 * quando `lastSweepAt` muda de verdade (uma varredura nova de fato),
 * nunca a cada re-render (dedupe pelo timestamp do último ponto já
 * guardado). Reinicia ao recarregar a página (não persiste), o que é
 * aceitável — é um indicador de tendência recente, não um relatório
 * histórico.
 *
 * Pronto para persistência futura: o formato de retorno (`{ timestamp,
 * value }[]`) é exatamente o que um endpoint de série histórica no
 * Backend precisaria devolver — trocar esta implementação client-side
 * por um `useQuery` contra esse endpoint não exigiria mudar nenhum
 * componente consumidor (AvailabilityGauge, HistoryPanel), só esta
 * função.
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
