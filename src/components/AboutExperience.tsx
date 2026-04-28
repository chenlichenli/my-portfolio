import { useLayoutEffect, useMemo, useRef, useState } from 'react'
import type { MotionValue } from 'framer-motion'
import { motion, useScroll, useSpring, useTransform } from 'framer-motion'
import { useLanguage } from '../i18n/LanguageContext'
import type { Messages } from '../i18n/messages'
import './AboutExperience.css'

type ExpKey = keyof Messages['about']['exp']

export type AboutExperienceItem = {
  id: string
  dates: string
  title: string
  org: string
  /** Official org site — opens in a new tab. */
  website: string
  /** Optional logo image URL; if omitted, a logo is inferred from the website domain. */
  logoUrl?: string
  /** When false, no logo or monogram is shown (organization link only). */
  showLogo?: boolean
  blurb?: string
}

function hostnameFromWebsite(website: string): string {
  try {
    return new URL(website).hostname.replace(/^www\./i, '')
  } catch {
    return ''
  }
}

function logoImageSources(website: string, logoUrl?: string): string[] {
  const host = hostnameFromWebsite(website)
  const list: string[] = []
  if (logoUrl) list.push(logoUrl)
  if (host) {
    list.push(`https://logo.clearbit.com/${host}`)
    list.push(
      `https://www.google.com/s2/favicons?domain=${encodeURIComponent(host)}&sz=128`,
    )
  }
  return [...new Set(list)]
}

function monogramFromOrg(org: string): string {
  const t = org.trim()
  if (!t) return '?'
  const ascii = t.replace(/[^A-Za-z0-9]/g, '')
  if (ascii.length > 0) return ascii[0]!.toUpperCase()
  const ch = [...t][0]
  return ch ?? '?'
}

function ExperienceOrgLogo({
  website,
  org,
  logoUrl,
}: {
  website: string
  org: string
  logoUrl?: string
}) {
  const sources = useMemo(() => logoImageSources(website, logoUrl), [website, logoUrl])
  const [sourceIndex, setSourceIndex] = useState(0)
  const monogram = monogramFromOrg(org)

  if (sourceIndex >= sources.length) {
    return (
      <span className="about-experience__logo-fallback" aria-hidden="true">
        {monogram}
      </span>
    )
  }

  return (
    <img
      className="about-experience__logo"
      src={sources[sourceIndex]}
      alt=""
      loading="lazy"
      decoding="async"
      referrerPolicy="no-referrer"
      onError={() => setSourceIndex((n) => n + 1)}
    />
  )
}

const ROW_DEFS: {
  id: string
  expKey: ExpKey
  website: string
  logoUrl?: string
  showLogo?: boolean
}[] = [
  { id: 'tempus', expKey: 'tempus', website: 'https://www.tempus.com' },
  {
    id: 'real-chemistry',
    expKey: 'realChemistry',
    website: 'https://www.realchemistry.com',
  },
  { id: 'leantaas', expKey: 'leantaas', website: 'https://www.leantaas.com' },
  {
    id: 'precision-strategy',
    expKey: 'precisionStrategy',
    website: 'https://www.precisionstrategies.com',
  },
  {
    id: 'parsons',
    expKey: 'parsons',
    website: 'https://www.newschool.edu/parsons/',
  },
  {
    id: 'hfg-offenbach',
    expKey: 'hfg',
    website: 'https://www.hfg-offenbach.de',
    showLogo: false,
  },
  {
    id: 'nanjing-arts',
    expKey: 'nanjing',
    website: 'https://www.nua.edu.cn',
    showLogo: false,
  },
  {
    id: 'jiangnan',
    expKey: 'jiangnan',
    website: 'https://www.jiangnan.edu.cn',
    showLogo: false,
  },
]

const SPRING = { stiffness: 120, damping: 28, mass: 0.42 }

function usePrefersReducedMotion(): boolean {
  const [reduced, setReduced] = useState(
    () =>
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches,
  )
  useLayoutEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)')
    const onChange = () => setReduced(mq.matches)
    mq.addEventListener('change', onChange)
    return () => mq.removeEventListener('change', onChange)
  }, [])
  return reduced
}

function ExperienceSlide({
  item,
  index,
  total,
  slideHeight,
  scrollY,
  reducedMotion,
}: {
  item: AboutExperienceItem
  index: number
  total: number
  slideHeight: number
  scrollY: MotionValue<number>
  reducedMotion: boolean
}) {
  const ranges = useMemo(() => {
    const H = Math.max(1, slideHeight)
    if (total <= 1) {
      return { input: [0, 1] as number[], opacityOut: [1, 1] as number[], yOut: [0, 0] as number[] }
    }
    if (index === 0) {
      return {
        input: [0, H],
        opacityOut: [1, 0.38],
        yOut: [0, 12],
      }
    }
    if (index === total - 1) {
      return {
        input: [(index - 1) * H, index * H],
        opacityOut: [0.38, 1],
        yOut: [12, 0],
      }
    }
    return {
      input: [(index - 1) * H, index * H, (index + 1) * H],
      opacityOut: [0.38, 1, 0.38],
      yOut: [12, 0, -12],
    }
  }, [index, total, slideHeight])

  const opacity = useTransform(scrollY, ranges.input, ranges.opacityOut)
  const y = useTransform(scrollY, ranges.input, ranges.yOut)
  const smoothOpacity = useSpring(opacity, SPRING)
  const smoothY = useSpring(y, SPRING)

  const body = (
    <>
      <p className="about-experience__dates">{item.dates}</p>
      <h3 className="about-experience__title">{item.title}</h3>
      {item.showLogo === false ? (
        <p className="about-experience__org about-experience__org--solo">
          <a
            href={item.website}
            target="_blank"
            rel="noopener noreferrer"
            className="about-experience__org-link"
          >
            {item.org}
          </a>
        </p>
      ) : (
        <div className="about-experience__org-row">
          <ExperienceOrgLogo website={item.website} org={item.org} logoUrl={item.logoUrl} />
          <p className="about-experience__org">
            <a
              href={item.website}
              target="_blank"
              rel="noopener noreferrer"
              className="about-experience__org-link"
            >
              {item.org}
            </a>
          </p>
        </div>
      )}
      {item.blurb ? <p className="about-experience__blurb">{item.blurb}</p> : null}
    </>
  )

  return (
    <li
      className="about-experience__item"
      style={{
        height: slideHeight,
        minHeight: slideHeight,
        maxHeight: slideHeight,
      }}
    >
      <div className="about-experience__slide">
        <span className="about-experience__dot" aria-hidden="true" />
        {reducedMotion ? (
          <div className="about-experience__body">{body}</div>
        ) : (
          <motion.div className="about-experience__body" style={{ opacity: smoothOpacity, y: smoothY }}>
            {body}
          </motion.div>
        )}
      </div>
    </li>
  )
}

export function AboutExperience() {
  const { messages, t } = useLanguage()
  const items: AboutExperienceItem[] = useMemo(
    () =>
      ROW_DEFS.map((row) => {
        const e = messages.about.exp[row.expKey]
        return {
          id: row.id,
          dates: e.dates,
          title: e.title,
          org: e.org,
          website: row.website,
          logoUrl: row.logoUrl,
          showLogo: row.showLogo,
          blurb: e.blurb || undefined,
        }
      }),
    [messages.about.exp],
  )

  const viewportRef = useRef<HTMLDivElement>(null)
  const [slideHeight, setSlideHeight] = useState(240)
  const reducedMotion = usePrefersReducedMotion()
  const { scrollY } = useScroll({ container: viewportRef })

  useLayoutEffect(() => {
    const el = viewportRef.current
    if (!el) return
    const measure = () => setSlideHeight(Math.max(1, el.clientHeight))
    measure()
    const ro = new ResizeObserver(measure)
    ro.observe(el)
    return () => ro.disconnect()
  }, [])

  const scrollHintId = 'about-experience-scroll-hint'

  return (
    <section className="about-experience">
      <div
        ref={viewportRef}
        className="about-experience__viewport"
        tabIndex={0}
        role="region"
        aria-label={t('about.experienceAria')}
        aria-describedby={scrollHintId}
      >
        <ul className="about-experience__list">
          {items.map((item, index) => (
            <ExperienceSlide
              key={item.id}
              item={item}
              index={index}
              total={items.length}
              slideHeight={slideHeight}
              scrollY={scrollY}
              reducedMotion={reducedMotion}
            />
          ))}
        </ul>
      </div>
      <p id={scrollHintId} className="about-experience__hint">
        {t('about.scrollHint')}
      </p>
    </section>
  )
}
