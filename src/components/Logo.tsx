import logoWhite from '../assets/images/buni-logo-white.png'

export function Logo() {
  return (
    <img
      src={logoWhite}
      alt="Buni"
      className="mr-1 h-18 w-auto shrink-0 select-none sm:mr-2 sm:h-[4.875rem]"
    />
  )
}
