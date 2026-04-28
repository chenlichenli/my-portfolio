import type { ReactNode } from 'react'
import { useCallback, useLayoutEffect, useRef } from 'react'
import { NavLink } from 'react-router-dom'
import { useLanguage } from '../../i18n/LanguageContext'
import type { Locale } from '../../i18n/messages'
import { HeaderSocialNav } from '../HeaderSocialNav'

const FOOTER_EMAIL = 'mailto:designer.chenli@gmail.com'
const FOOTER_LINKEDIN = 'https://www.linkedin.com/in/li-chen-8060b3155/'
const FOOTER_RESUME =
  'https://cdn.prod.website-files.com/663b86ab9b3d0891099847b0/67d088cada2c6cd7a6c22d32_Resume_Li%20Chen_2025.pdf'

/**
 * Clipped width = one arrow + gap + label. Row is [→][label][→]; default translate shows
 * label+right arrow; hover translate 0 shows left+label (right clipped) — text moves with arrows.
 */
function SiteFooterLink({
  href,
  label,
  external,
}: {
  href: string
  label: string
  external?: boolean
}) {
  const linkRef = useRef<HTMLAnchorElement>(null)
  const rowRef = useRef<HTMLSpanElement>(null)
  const labelRef = useRef<HTMLSpanElement>(null)
  const leftSlotRef = useRef<HTMLSpanElement>(null)

  const syncFooterLinkBox = useCallback(() => {
    const link = linkRef.current
    const row = rowRef.current
    const labelEl = labelRef.current
    const leftSlot = leftSlotRef.current
    if (!link || !row || !labelEl || !leftSlot) return

    const gapStr = getComputedStyle(row).gap
    const gapPx = Number.parseFloat(gapStr) || 0
    const slotW = leftSlot.offsetWidth
    const labelW = labelEl.offsetWidth
    const boxW = slotW + gapPx + labelW
    const restShift = -(slotW + gapPx)

    link.style.setProperty('--footer-box-w', `${boxW}px`)
    link.style.setProperty('--footer-rest-shift', `${restShift}px`)
  }, [])

  useLayoutEffect(() => {
    const row = rowRef.current
    const labelEl = labelRef.current
    const leftSlot = leftSlotRef.current
    if (!row || !labelEl || !leftSlot) return

    syncFooterLinkBox()
    const ro = new ResizeObserver(syncFooterLinkBox)
    ro.observe(row)
    ro.observe(labelEl)
    ro.observe(leftSlot)
    window.addEventListener('resize', syncFooterLinkBox)
    return () => {
      ro.disconnect()
      window.removeEventListener('resize', syncFooterLinkBox)
    }
  }, [label, syncFooterLinkBox])

  return (
    <a
      ref={linkRef}
      href={href}
      className="site-footer-link"
      {...(external ? ({ target: '_blank', rel: 'noreferrer' } as const) : {})}
    >
      <span className="site-footer-link-window">
        <span ref={rowRef} className="site-footer-link-row">
          <span ref={leftSlotRef} className="site-footer-link-slot" aria-hidden="true">
            →
          </span>
          <span ref={labelRef} className="site-footer-link-label">
            {label}
          </span>
          <span className="site-footer-link-slot" aria-hidden="true">
            →
          </span>
        </span>
      </span>
    </a>
  )
}

/** Two stacked copies; hover slides vertically from the first line to the second. */
function PrimaryNavSlide({ label }: { label: string }) {
  return (
    <span className="site-nav-slide">
      <span className="site-nav-slide-track">
        <span className="site-nav-slide-line">{label}</span>
        <span className="site-nav-slide-line" aria-hidden="true">
          {label}
        </span>
      </span>
    </span>
  )
}

function LanguageToggle() {
  const { locale, setLocale, t } = useLanguage()
  const set = (next: Locale) => () => setLocale(next)
  return (
    <nav className="site-lang-nav" aria-label={t('lang.switchNav')}>
      <div className="site-lang-icon-wrap">
        <div className="site-lang-icon-split" role="group">
          <button
            type="button"
            className={`site-lang-icon-btn${locale === 'en' ? ' site-lang-icon-btn--active' : ''}`}
            onClick={set('en')}
            aria-pressed={locale === 'en'}
          >
            {t('lang.enShort')}
          </button>
          <span className="site-lang-icon-sep" aria-hidden>
            /
          </span>
          <button
            type="button"
            className={`site-lang-icon-btn${locale === 'zh' ? ' site-lang-icon-btn--active' : ''}`}
            onClick={set('zh')}
            aria-pressed={locale === 'zh'}
          >
            {t('lang.zhShort')}
          </button>
        </div>
      </div>
    </nav>
  )
}

export function SiteLayout({ children }: { children: ReactNode }) {
  const { t } = useLanguage()
  return (
    <div className="site">
      <header className="site-header">
        <div className="site-header-inner">
          <div className="site-header-start">
            <NavLink
              to="/"
              className="site-logo"
              end
              aria-label={t('nav.homeAria')}
            >
              <img
                className="site-logo-img"
                src="/logo.png"
                alt=""
                width={1024}
                height={1024}
                decoding="async"
              />
            </NavLink>
            <nav aria-label={t('nav.primary')}>
              <ul className="site-nav">
                <li>
                  <NavLink to="/" className={({ isActive }) => (isActive ? 'active' : '')} end>
                    <PrimaryNavSlide label={t('nav.design')} />
                  </NavLink>
                </li>
                <li>
                  <NavLink
                    to="/side-work"
                    className={({ isActive }) => (isActive ? 'active' : '')}
                  >
                    <PrimaryNavSlide label={t('nav.sideWork')} />
                  </NavLink>
                </li>
                <li>
                  <NavLink
                    to="/about"
                    className={({ isActive }) => (isActive ? 'active' : '')}
                  >
                    <PrimaryNavSlide label={t('nav.about')} />
                  </NavLink>
                </li>
              </ul>
            </nav>
          </div>
          <div className="site-header-end">
            <HeaderSocialNav />
            <LanguageToggle />
          </div>
        </div>
      </header>

      <main className="site-main">{children}</main>

      <footer className="site-footer">
        <hr className="site-footer-divider" aria-hidden="true" />
        <div className="site-footer-inner">
          <nav className="site-footer-links" aria-label={t('footer.contactLinks')}>
            <SiteFooterLink href={FOOTER_EMAIL} label={t('footer.email')} />
            <SiteFooterLink href={FOOTER_LINKEDIN} label={t('footer.linkedin')} external />
            <SiteFooterLink href={FOOTER_RESUME} label={t('footer.resume')} external />
          </nav>
          <div className="site-footer-stack">
            <span className="site-footer-copyright">© Li Chen {new Date().getFullYear()}</span>
            <span className="site-footer-meta">
              <span>{t('footer.vibeCoded')}</span>
              <span aria-hidden="true">{t('footer.with')}</span>
              <span aria-label={t('footer.love')}>💜</span>
            </span>
          </div>
        </div>
      </footer>
    </div>
  )
}
