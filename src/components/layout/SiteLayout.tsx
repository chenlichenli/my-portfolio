import type { ReactNode } from 'react'
import { useCallback, useLayoutEffect, useRef } from 'react'
import { NavLink } from 'react-router-dom'
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

export function SiteLayout({ children }: { children: ReactNode }) {
  return (
    <div className="site">
      <header className="site-header">
        <div className="site-header-inner">
          <div className="site-header-start">
            <NavLink
              to="/"
              className="site-logo"
              end
              aria-label="li.design — home"
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
            <nav aria-label="Primary">
              <ul className="site-nav">
                <li>
                  <NavLink to="/" className={({ isActive }) => (isActive ? 'active' : '')} end>
                    <PrimaryNavSlide label="Design" />
                  </NavLink>
                </li>
                <li>
                  <NavLink
                    to="/side-work"
                    className={({ isActive }) => (isActive ? 'active' : '')}
                  >
                    <PrimaryNavSlide label="Side Work" />
                  </NavLink>
                </li>
                <li>
                  <NavLink
                    to="/about"
                    className={({ isActive }) => (isActive ? 'active' : '')}
                  >
                    <PrimaryNavSlide label="About Me" />
                  </NavLink>
                </li>
              </ul>
            </nav>
          </div>
          <HeaderSocialNav />
        </div>
      </header>

      <main className="site-main">
        {children}
        <div className="site-footer-divider" role="presentation">
          <span className="site-footer-divider-line" aria-hidden="true" />
          <span className="site-footer-divider-glyph" aria-hidden="true">
            ≽^•⩊•^≼
          </span>
          <span className="site-footer-divider-line" aria-hidden="true" />
        </div>
      </main>

      <footer className="site-footer">
        <div className="site-footer-inner">
          <nav className="site-footer-links" aria-label="Contact links">
            <SiteFooterLink href={FOOTER_EMAIL} label="Email" />
            <SiteFooterLink href={FOOTER_LINKEDIN} label="LinkedIn" external />
            <SiteFooterLink href={FOOTER_RESUME} label="Resume" external />
          </nav>
          <div className="site-footer-stack">
            <span className="site-footer-copyright">© Li Chen {new Date().getFullYear()}</span>
            <span className="site-footer-meta">
              <span>Vibe coded 4/2026</span>
              <span aria-hidden="true">with</span>
              <span aria-label="love">💜</span>
            </span>
          </div>
        </div>
      </footer>
    </div>
  )
}
