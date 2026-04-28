import type { ReactNode } from 'react'
import { useMemo } from 'react'
import { CaseStudyConnectCta } from '../components/CaseStudyConnectCta'
import { CaseStudyDesignDetails } from '../components/CaseStudyDesignDetails'
import { CaseStudyMoreProjects } from '../components/CaseStudyMoreProjects'
import { HeroGlassProject } from '../components/HeroGlassLanding'
import { useAustinWeather } from '../hooks/useAustinWeather'
import { useLanguage } from '../i18n/LanguageContext'
import './TempusOneCaseStudy.css'
import './IQueueForClinicsCaseStudy.css'

const HUB_ORDERING_DESIGN_DIR = 'Online Ordering'

function hubOrderingDesignSrc(file: string) {
  return `/${encodeURI(`${HUB_ORDERING_DESIGN_DIR}/${file}`)}`
}

const HUB_SLIDE_FILES = [
  { id: 'test-selection', file: 'Test Selection.png', slideKey: 'testSelection' as const },
  { id: 'existing-patient-autofill', file: 'Existing Patient Auto Fill.png', slideKey: 'autofill' as const },
  { id: 'confirmation-page', file: 'Confirmation Page.png', slideKey: 'confirm' as const },
] as const

export function HubOnlineOrderingCaseStudy() {
  const { locale, t, messages } = useLanguage()
  const m = messages.hub
  const { tempF, weatherCode, status: weatherStatus } = useAustinWeather()

  const slides = useMemo(
    () =>
      HUB_SLIDE_FILES.map((row) => {
        const s = m.slides[row.slideKey]
        return { id: row.id, title: s.title, file: row.file, imageAlt: s.alt }
      }),
    [m.slides],
  )

  const teamLines = [m.team0, m.team1, m.team2]

  const impactMetrics: { id: string; content: ReactNode }[] = useMemo(
    () => [
      {
        id: 'hub-ordering-impact-failure',
        content: (
          <>
            <strong className="case-tempus-impact-num">&lt;1%</strong>
            {locale === 'zh' ? '' : ' '}
            {m.impact.fail}
          </>
        ),
      },
      {
        id: 'hub-ordering-impact-submission-time',
        content: (
          <>
            {m.impact.timeBefore}{' '}
            <strong className="case-tempus-impact-num">{m.impact.timePct}</strong> {m.impact.timeMid}
            <strong className="case-tempus-impact-num">{m.impact.timeFrom}</strong> {m.impact.timeTo}{' '}
            <strong className="case-tempus-impact-num">{m.impact.timeFast}</strong>
            {m.impact.timeAfter}
          </>
        ),
      },
      {
        id: 'hub-ordering-impact-volume',
        content:
          locale === 'zh' ? (
            <>
              {m.impact.volBefore}
              <strong className="case-tempus-impact-num">{m.impact.volFrom}</strong>
              <strong className="case-tempus-impact-num">{m.impact.volTo}</strong>
              {m.impact.volAfter}
            </>
          ) : (
            <>
              {m.impact.volBefore}{' '}
              <strong className="case-tempus-impact-num">{m.impact.volFrom}</strong> to{' '}
              <strong className="case-tempus-impact-num">{m.impact.volTo}</strong> {m.impact.volAfter}
            </>
          ),
      },
    ],
    [locale, m.impact],
  )

  return (
    <article className="case-tempus case-with-glass-hero" aria-label={m.articleAria}>
      <HeroGlassProject
        tempF={tempF}
        weatherCode={weatherCode}
        weatherStatus={weatherStatus}
        title={messages.projects['hub-online-ordering'].title}
        tags={m.tags}
        subtitle={m.subline}
        sectionBgClassName="bg-[#9D5A15]/30"
      />

      <section className="case-tempus-intro" aria-labelledby="case-hub-ordering-intro-heading">
        <div className="case-tempus-intro-grid">
          <div className="case-tempus-intro-copy">
            <h2 id="case-hub-ordering-intro-heading" className="case-tempus-intro-heading">
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
        getSrc={hubOrderingDesignSrc}
        idPrefix="hub-ordering"
        headingId="case-hub-ordering-design-heading"
      />

      <section className="case-tempus-impact" aria-labelledby="case-hub-ordering-impact-heading">
        <h2 id="case-hub-ordering-impact-heading" className="case-tempus-intro-heading">
          {t('caseStudy.impact')}
        </h2>
        <ul className="case-tempus-impact-list">
          {impactMetrics.map(({ id, content }) => (
            <li key={id}>{content}</li>
          ))}
        </ul>
      </section>

      <CaseStudyConnectCta />

      <CaseStudyMoreProjects excludeSlug="hub-online-ordering" />
    </article>
  )
}
