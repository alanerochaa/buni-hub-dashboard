import { useEffect, useRef, useState } from 'react'

const DURATION_MS = 700

function easeOutQuad(t: number): number {
  return 1 - (1 - t) * (1 - t)
}

/**
 * Anima a transição entre o valor exibido anterior e o novo `target`
 * (nunca de 0 até o valor — evita um "reinício" chamativo a cada
 * atualização de polling). Sem `prefers-reduced-motion`: pula direto
 * para o valor final.
 */
export function useCountUp(target: number): number {
  const [display, setDisplay] = useState(target)
  const fromRef = useRef(target)
  const frameRef = useRef<number>(0)

  useEffect(() => {
    if (target === fromRef.current) return

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const from = fromRef.current
    const startedAt = performance.now()

    function step(now: number) {
      const progress = prefersReducedMotion ? 1 : Math.min(1, (now - startedAt) / DURATION_MS)
      const eased = easeOutQuad(progress)
      setDisplay(Math.round(from + (target - from) * eased))

      if (progress < 1) {
        frameRef.current = requestAnimationFrame(step)
      } else {
        fromRef.current = target
      }
    }

    frameRef.current = requestAnimationFrame(step)
    return () => cancelAnimationFrame(frameRef.current)
  }, [target])

  return display
}
