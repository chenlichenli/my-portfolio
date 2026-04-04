import { useLayoutEffect, useMemo, useRef, useState } from 'react'
import type { MotionValue } from 'framer-motion'
import { motion, useScroll, useSpring, useTransform } from 'framer-motion'
import './AboutExperience.css'

export type AboutExperienceItem = {
  id: string
  dates: string
  title: string
  org: string
  blurb?: string
}

const ITEMS: AboutExperienceItem[] = [
  {
    id: 'tempus',
    dates: '2022 — current',
    title: 'Sr. Product Designer',
    org: 'Tempus AI',
    blurb: 'AI and healthcare product experiences.',
  },
  {
    id: 'real-chemistry',
    dates: '2020 — 2022',
    title: 'Designer',
    org: 'Real Chemistry',
    blurb: 'Enterprise healthcare and marketing platforms.',
  },
  {
    id: 'leantaas',
    dates: '2019 — 2020',
    title: 'Product Designer',
    org: 'LeanTaaS',
    blurb: 'Hospital operations and predictive analytics UX.',
  },
  {
    id: 'precision-strategy',
    dates: '2019',
    title: 'Design intern',
    org: 'Precision Strategy',
  },
  {
    id: 'parsons',
    dates: '2017 — 2019',
    title: 'MFA, Design & Technology',
    org: 'Parsons School of Design',
    blurb: 'New York City.',
  },
  {
    id: 'hfg-offenbach',
    dates: '2015',
    title: 'Visual Communication (exchange)',
    org: 'Hochschule für Gestaltung Offenbach',
  },
  {
    id: 'nanjing-arts',
    dates: '2013 — 2016',
    title: 'MA in Graphic Design',
    org: 'Nanjing University of the Arts',
  },
  {
    id: 'jiangnan',
    dates: '2009 — 2013',
    title: 'BA, Fine art',
    org: 'Jiangnan University',
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
      <p className="about-experience__org">{item.org}</p>
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

  return (
    <section className="about-experience">
      <div
        ref={viewportRef}
        className="about-experience__viewport"
        tabIndex={0}
        role="region"
        aria-label="Work and education timeline. Scroll vertically to see earlier roles and education."
      >
        <ul className="about-experience__list">
          {ITEMS.map((item, index) => (
            <ExperienceSlide
              key={item.id}
              item={item}
              index={index}
              total={ITEMS.length}
              slideHeight={slideHeight}
              scrollY={scrollY}
              reducedMotion={reducedMotion}
            />
          ))}
        </ul>
      </div>
    </section>
  )
}
