import { useLanguage } from '../../i18n/LanguageContext'
import { useDesktopPetVisibility, type DesktopPetId } from './DesktopPetVisibility'

function DesktopPetFooterToggle({
  petId,
  emoji,
}: {
  petId: DesktopPetId
  emoji: string
}) {
  const { t } = useLanguage()
  const { visible, togglePet } = useDesktopPetVisibility()
  const isVisible = visible[petId]
  const hoverLabel =
    petId === 'vinny'
      ? isVisible
        ? t('footer.pet.vinnyBye')
        : t('footer.pet.vinnyHi')
      : isVisible
        ? t('footer.pet.nalaBye')
        : t('footer.pet.nalaHi')

  return (
    <button
      type="button"
      className={`site-footer-pet-toggle${isVisible ? ' site-footer-pet-toggle--active' : ''}`}
      onClick={() => togglePet(petId)}
      aria-pressed={isVisible}
      aria-label={hoverLabel}
    >
      <span className="site-footer-pet-toggle-tip" role="tooltip">
        {hoverLabel}
      </span>
      <span className="site-footer-pet-toggle-emoji" aria-hidden="true">
        {emoji}
      </span>
    </button>
  )
}

export function DesktopPetFooterToggles() {
  const { t } = useLanguage()

  return (
    <nav className="site-footer-pet-nav" aria-label={t('footer.pet.controls')}>
      <DesktopPetFooterToggle petId="vinny" emoji="🐈" />
      <DesktopPetFooterToggle petId="nala" emoji="🐈‍⬛" />
    </nav>
  )
}
