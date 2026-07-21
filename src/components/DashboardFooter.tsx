import { DASHBOARD_COLORS } from '@/constants'

export function DashboardFooter() {
  return (
    <footer
      className="flex h-7 shrink-0 items-center justify-center border-t px-6 lg:px-8"
      style={{ borderColor: DASHBOARD_COLORS.border, backgroundColor: DASHBOARD_COLORS.surfaceSunken }}
    >
      <p className="text-xs" style={{ color: DASHBOARD_COLORS.textFaint }}>
        Desenvolvido por{' '}
        <a
          href="https://catarse.co/"
          target="_blank"
          rel="noopener noreferrer"
          className="font-semibold cursor-pointer hover:underline"
        >
          Catarse Tecnologia & Consultoria
        </a>
      </p>
    </footer>
  )
}
