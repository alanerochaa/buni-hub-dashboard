import { DASHBOARD_COLORS } from '@/constants'

import { ShieldCheckIcon } from './icons'

/**
 * Rodapé fino — crédito institucional e nota de conformidade, sem
 * nenhum dado operacional (nada aqui muda com o polling).
 */
export function DashboardFooter() {
  return (
    <footer
      className="flex h-8 shrink-0 items-center justify-between border-t px-6 lg:px-8"
      style={{ borderColor: DASHBOARD_COLORS.border, backgroundColor: DASHBOARD_COLORS.surfaceSunken }}
    >
      <p className="text-xs" style={{ color: DASHBOARD_COLORS.textFaint }}>
        Desenvolvido por Catarse Tecnologia & Consultoria
      </p>
      <p className="flex items-center gap-1.5 text-xs" style={{ color: DASHBOARD_COLORS.textFaint }}>
        <ShieldCheckIcon className="size-3.5" />
        Ambiente seguro · dados protegidos conforme a LGPD
      </p>
    </footer>
  )
}
