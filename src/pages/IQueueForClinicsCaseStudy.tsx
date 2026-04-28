import { useMemo } from 'react'
import { CaseStudyDesignDetails } from '../components/CaseStudyDesignDetails'
import { CaseStudyMoreProjects } from '../components/CaseStudyMoreProjects'
import { HeroGlassProject } from '../components/HeroGlassLanding'
import { useAustinWeather } from '../hooks/useAustinWeather'
import { useLanguage } from '../i18n/LanguageContext'
import './TempusOneCaseStudy.css'
import './IQueueForClinicsCaseStudy.css'

const DESIGN_IMAGE_DIR = 'iQueue for Clinics'

/**
 * Public assets under `iQueue for Clinics/`. Each path segment is `encodeURIComponent`’d
 * so spaces become `%20` and literal `+` in filenames become `%2B`. Leaving `+` raw
 * (`encodeURI`) breaks many production hosts/CDNs that decode `+` as a space in paths.
 */
function iqueueAssetPath(...segments: string[]) {
  const path = segments.map((s) => encodeURIComponent(s)).join('/')
  const base = import.meta.env.BASE_URL
  if (!base || base === '/') return `/${path}`
  return `${base.replace(/\/$/, '')}/${path}`
}

function designImageSrc(file: string) {
  return iqueueAssetPath(DESIGN_IMAGE_DIR, file)
}

const IQUEUE_SLIDES = [
  { id: 'data-health', file: 'iqueue 1.png', slideKey: 'dataHealth' as const },
  { id: 'room-allocation', file: 'iqueue 0.png', slideKey: 'room' as const },
  { id: 'provider-template-review', file: 'iqueue 2.png', slideKey: 'provider' as const },
] as const

export function IQueueForClinicsCaseStudy() {
  const { t, messages } = useLanguage()
  const m = messages.iqueue
  const { tempF, weatherCode, status: weatherStatus } = useAustinWeather()

  const slides = useMemo(
    () =>
      IQUEUE_SLIDES.map((row) => {
        const s = m.slides[row.slideKey]
        return { id: row.id, title: s.title, file: row.file, imageAlt: s.alt }
      }),
    [m.slides],
  )

  const teamLines = [m.team0, m.team1, m.team2, m.team3, m.team4]
  const takeaways = [m.takeaway0, m.takeaway1, m.takeaway2]

  return (
    <article className="case-tempus case-with-glass-hero" aria-label={m.articleAria}>
      <HeroGlassProject
        tempF={tempF}
        weatherCode={weatherCode}
        weatherStatus={weatherStatus}
        title={messages.projects['iqueue-for-clinics'].title}
        tags={m.tags}
        subtitle={m.subline}
        sectionBgClassName="bg-[#001F59]/20"
      />

      <section className="case-tempus-intro" aria-labelledby="case-iqueue-intro-heading">
        <div className="case-tempus-intro-grid">
          <div className="case-tempus-intro-copy">
            <h2 id="case-iqueue-intro-heading" className="case-tempus-intro-heading">
              {t('caseStudy.intro')}
            </h2>
            <p className="case-tempus-intro-text">{m.intro}</p>
          </div>
          <aside className="case-tempus-meta" aria-label={t('caseStudy.projectDetails')}>
            <div className="case-tempus-meta-block">
              <h3 className="case-tempus-meta-heading">{t('caseStudy.team')}</h3>
              <ul className="case-tempus-meta-list">
                {teamLines.map((line) => (
                  <li key={line}>{line}</li>
                ))}
              </ul>
            </div>
            <div className="case-tempus-meta-block case-tempus-meta-block--timeline">
              <h3 className="case-tempus-meta-heading">{t('caseStudy.timeline')}</h3>
              <p className="case-tempus-meta-timeline">{m.timelineRange}</p>
            </div>
          </aside>
        </div>
      </section>

      <CaseStudyDesignDetails
        slides={slides}
        getSrc={designImageSrc}
        idPrefix="iqueue"
        headingId="case-iqueue-design-heading"
      />

      <section className="case-iqueue-takeaways" aria-labelledby="case-iqueue-takeaways-heading">
        <h2 id="case-iqueue-takeaways-heading" className="case-tempus-intro-heading">
          {m.takeawaysHeading}
        </h2>
        <ul className="case-tempus-impact-list">
          {takeaways.map((line, i) => (
            <li key={i}>{line}</li>
          ))}
        </ul>
      </section>

      <CaseStudyMoreProjects excludeSlug="iqueue-for-clinics" />
    </article>
  )
}
