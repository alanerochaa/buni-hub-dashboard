import { DASHBOARD_COLORS } from '@/constants'

/**
 * Rodapé fino — só crédito institucional, sem nenhum dado operacional
 * (nada aqui muda com o polling). Altura um pouco maior que o mínimo
 * técnico (`h-7`, não `h-5`) para nunca parecer "grudado" no último
 * card, mesmo quando o conteúdo acima preenche quase toda a tela.
 */
export function DashboardFooter() {
  return (
    <footer
      className="flex h-7 shrink-0 items-center justify-center border-t px-6 lg:px-8"
      style={{ borderColor: DASHBOARD_COLORS.border, backgroundColor: DASHBOARD_COLORS.surfaceSunken }}
    >
      <p className="text-xs" style={{ color: DASHBOARD_COLORS.textFaint }}>
        Desenvolvido por <span className="font-semibold">Catarse Tecnologia & Consultoria</span>
      </p>
    </footer>
  )
}
