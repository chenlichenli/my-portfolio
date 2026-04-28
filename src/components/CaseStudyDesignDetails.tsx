import { useCallback, useLayoutEffect, useRef, useState } from 'react'
import { useLanguage } from '../i18n/LanguageContext'

export type CaseStudyDesignSlide = {
  id: string
  title: string
  file: string
  imageAlt: string
}

type CaseStudyDesignDetailsProps = {
  slides: readonly CaseStudyDesignSlide[]
  getSrc: (file: string) => string
  /** Unique prefix for nav / figure ids (e.g. `iqueue`, `hub-ordering`). */
  idPrefix: string
  /** Must match the section `aria-labelledby` target. */
  headingId: string
}

/**
 * Stacked design screens: sticky nav; active label tracks scroll via one stable
 * “scan line” (closest figure center) + rAF — avoids IntersectionObserver threshold flicker.
 */
export function CaseStudyDesignDetails({
  slides,
  getSrc,
  idPrefix,
  headingId,
}: CaseStudyDesignDetailsProps) {
  const { t } = useLanguage()
  const [activeIndex, setActiveIndex] = useState(0)
  const figureRefs = useRef<(HTMLElement | null)[]>([])

  const setFigureRef = useCallback((index: number) => (el: HTMLElement | null) => {
    figureRefs.current[index] = el
  }, [])

  const slideKey = slides.map((s) => s.id).join(',')

  useLayoutEffect(() => {
    const getFigures = () =>
      slides
        .map((_, i) => figureRefs.current[i])
        .filter((el): el is HTMLElement => el !== null && el !== undefined)

    /** Horizontal line in the viewport; whichever figure center is closest wins (single, stable index). */
    const SCAN_RATIO = 0.38

    let rafId = 0

    const tick = () => {
      rafId = 0
      const figures = getFigures()
      if (figures.length !== slides.length) return

      const lineY = window.innerHeight * SCAN_RATIO
      let best = 0
      let bestDist = Number.POSITIVE_INFINITY
      for (let i = 0; i < figures.length; i++) {
        const r = figures[i].getBoundingClientRect()
        const centerY = (r.top + r.bottom) / 2
        const dist = Math.abs(centerY - lineY)
        if (dist < bestDist) {
          bestDist = dist
          best = i
        }
      }

      setActiveIndex((prev) => (prev === best ? prev : best))
    }

    const scheduleTick = () => {
      if (rafId) cancelAnimationFrame(rafId)
      rafId = requestAnimationFrame(tick)
    }

    tick()
    window.addEventListener('scroll', scheduleTick, { passive: true })
    window.addEventListener('resize', scheduleTick, { passive: true })

    return () => {
      window.removeEventListener('scroll', scheduleTick)
      window.removeEventListener('resize', scheduleTick)
      if (rafId) cancelAnimationFrame(rafId)
    }
  }, [slideKey, slides.length])

  const scrollToFigure = useCallback((index: number) => {
    figureRefs.current[index]?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }, [])

  return (
    <section className="case-iqueue-design" aria-labelledby={headingId}>
      <h2 id={headingId} className="case-tempus-intro-heading">
        {t('caseStudy.designDetails')}
      </h2>
      <div className="case-iqueue-design-layout case-iqueue-design-layout--spy">
        <nav className="case-iqueue-design-titles" aria-label={t('caseStudy.designDetailsNav')}>
          {slides.map((slide, index) => (
            <button
              key={slide.id}
              type="button"
              aria-current={activeIndex === index ? 'true' : undefined}
              id={`${idPrefix}-nav-${slide.id}`}
              className={
                activeIndex === index
                  ? 'case-iqueue-design-tab case-iqueue-design-tab--active'
                  : 'case-iqueue-design-tab'
              }
              onClick={() => scrollToFigure(index)}
            >
              {slide.title}
            </button>
          ))}
        </nav>
        <div className="case-iqueue-design-stack">
          {slides.map((slide, index) => (
            <figure
              key={slide.id}
              ref={setFigureRef(index)}
              id={`${idPrefix}-figure-${slide.id}`}
              className="case-iqueue-design-figure"
              aria-labelledby={`${idPrefix}-nav-${slide.id}`}
            >
              <img
                src={getSrc(slide.file)}
                alt={slide.imageAlt}
                loading={index === 0 ? 'eager' : 'lazy'}
                decoding="async"
              />
            </figure>
          ))}
        </div>
      </div>
    </section>
  )
}
