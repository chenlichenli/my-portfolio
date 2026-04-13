import { useLayoutEffect, useMemo, useRef, type RefObject } from 'react'
import { HeroGlassLanding } from '../components/HeroGlassLanding'
import { blobColorForTempF, useAustinWeather } from '../hooks/useAustinWeather'
import { useRevealOnScroll } from '../hooks/useRevealOnScroll'
import { Link } from 'react-router-dom'
import './Home.css'

/** Filenames in /public — must match `hero image_<name>.png` on disk */
const PROJECTS = [
  {
    slug: 'tempus-one',
    company: 'Tempus AI',
    title: 'Tempus One',
    heroFile: 'hero image_Tempus One.png',
    tags: ['AI Experience', 'Growth Design', '0-1'],
    description:
      'How can we leverage AI to help physicians access patient data while grow product usage?',
  },
  {
    slug: 'hub-online-ordering',
    company: 'Tempus AI',
    title: 'Hub Online Ordering',
    heroFile: 'hero image_Online Ordering.png',
    tags: ['Enterprise UX', 'Scalability', 'Healthcare'],
    description:
      'How can we utilize the design system to streamline test portfolio expansion for oncologists’ needs?',
  },
  {
    slug: 'iqueue-for-clinics',
    company: 'LeanTaaS',
    title: 'iQueue for Clinics',
    heroFile: 'hero image_iQueue for Clinics.png',
    tags: ['Machine Learning UX', 'Healthcare Ops', 'Data-driven'],
    description:
      'How can we leverage predictive analytics to optimize hospital schedule and resource allocation?',
  },
] as const

function useEqualProjectCardSizes(containerRef: RefObject<HTMLElement | null>) {
  useLayoutEffect(() => {
    const root = containerRef.current
    if (!root) return

    const sync = () => {
      const cards = [...root.querySelectorAll<HTMLElement>('.project-card')]
      if (!cards.length) return

      cards.forEach((c) => {
        c.style.minHeight = ''
        c.style.height = ''
      })

      void root.offsetHeight

      let maxH = 0
      cards.forEach((c) => {
        maxH = Math.max(maxH, c.getBoundingClientRect().height)
      })

      if (maxH < 1) return

      const h = `${Math.ceil(maxH)}px`
      cards.forEach((c) => {
        c.style.height = h
      })
    }

    sync()

    const imgs = [...root.querySelectorAll<HTMLImageElement>('.project-card img')]
    const onImg = () => sync()
    imgs.forEach((img) => {
      if (!img.complete) img.addEventListener('load', onImg, { passive: true })
    })

    const ro = new ResizeObserver(() => sync())
    ro.observe(root)
    cardsForObserver(root).forEach((c) => ro.observe(c))

    return () => {
      ro.disconnect()
      imgs.forEach((img) => img.removeEventListener('load', onImg))
    }
  }, [])
}

function cardsForObserver(root: HTMLElement) {
  return [...root.querySelectorAll<HTMLElement>('.project-card')]
}

export function Home() {
  const projectsRef = useRef<HTMLDivElement>(null)
  const { tempF, weatherCode, status: weatherStatus } = useAustinWeather()
  const worksArrowColor = useMemo(
    () => blobColorForTempF(weatherStatus === 'ready' ? tempF : null),
    [weatherStatus, tempF],
  )
  useEqualProjectCardSizes(projectsRef)
  useRevealOnScroll(projectsRef, '.project-card')

  return (
    <div className="home">
      <HeroGlassLanding
        tempF={tempF}
        weatherCode={weatherCode}
        weatherStatus={weatherStatus}
      />

      <hr className="home-works-rule" aria-hidden="true" />

      <section className="home-works" aria-labelledby="works-heading">
        <div className="home-works-header">
          <h2 id="works-heading" className="home-section-label home-section-label--inline">
            Selected Works
            <span
              className="home-works-arrow"
              style={{ color: worksArrowColor }}
              aria-hidden="true"
            >
              ↓
            </span>
          </h2>
          <p className="home-stat">
            <span className="home-stat-label">Years of Experience</span>
            <span className="home-stat-colon" aria-hidden="true">
              :
            </span>
            <span className="home-stat-value">6</span>
          </p>
        </div>

        <div className="home-projects" ref={projectsRef}>
          {PROJECTS.map((p) => (
            <Link key={p.slug} className="project-card" to={`/${p.slug}`}>
              <div className="project-card-body">
                <span className="project-card-company">{p.company}</span>
                <h3 className="project-card-title">{p.title}</h3>
                <div className="project-card-tags">
                  {p.tags.map((tag) => (
                    <span key={tag} className="project-card-tag">
                      {tag}
                    </span>
                  ))}
                </div>
                <p className="project-card-desc">{p.description}</p>
              </div>
              <div className="project-card-hero">
                <div className="project-card-hero-square">
                  <img
                    src={encodeURI(`/${p.heroFile}`)}
                    alt=""
                    width={800}
                    height={500}
                    loading="lazy"
                    decoding="async"
                  />
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </div>
  )
}
