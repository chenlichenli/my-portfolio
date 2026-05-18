import { useEffect, useState, type ReactNode } from 'react'
import { useLanguage } from '../../i18n/LanguageContext'
import { DesktopPetActor } from './DesktopPetActor'
import { DesktopPetsProvider } from './DesktopPetsContext'
import { DesktopPetVisibilityProvider, useDesktopPetVisibility } from './DesktopPetVisibility'
import { NALA_PET, VINNY_PET } from './petConfigs'

function usePrefersReducedMotion(): boolean {
  const [reduced, setReduced] = useState(false)

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)')
    const sync = () => setReduced(mq.matches)
    sync()
    mq.addEventListener('change', sync)
    return () => mq.removeEventListener('change', sync)
  }, [])

  return reduced
}

function DesktopPetLayer() {
  const { t } = useLanguage()
  const { visible } = useDesktopPetVisibility()

  return (
    <>
      {visible.vinny ? <DesktopPetActor config={VINNY_PET} ariaLabel={t('pet.aria')} /> : null}
      {visible.nala ? <DesktopPetActor config={NALA_PET} ariaLabel={t('pet.nalaAria')} /> : null}
    </>
  )
}

function DesktopPetLayerGate() {
  const prefersReducedMotion = usePrefersReducedMotion()
  if (prefersReducedMotion) return null
  return <DesktopPetLayer />
}

/** Wraps layout so footer toggles and pets share visibility + collision context. */
export function DesktopPetShell({ children }: { children: ReactNode }) {
  return (
    <DesktopPetVisibilityProvider>
      <DesktopPetsProvider>
        <DesktopPetLayerGate />
        {children}
      </DesktopPetsProvider>
    </DesktopPetVisibilityProvider>
  )
}
