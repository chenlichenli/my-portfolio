import { useMemo } from 'react'
import { CaseStudyConnectCta } from '../components/CaseStudyConnectCta'
import { CaseStudyMoreProjects } from '../components/CaseStudyMoreProjects'
import { HeroGlassProject } from '../components/HeroGlassLanding'
import { useAustinWeather } from '../hooks/useAustinWeather'
import { useLanguage } from '../i18n/LanguageContext'
import './TempusOneCaseStudy.css'

/** Opens in Figma; also used for embed `url` param. */
const CUSTOMER_ASSISTANT_FIGMA_PROTO =
  'https://www.figma.com/proto/4URRvDMVfbF91qpw68lFjH/CAA-Demo?content-scaling=fixed&kind=proto&node-id=1-775&page-id=0%3A1&scaling=scale-down&starting-point-node-id=1%3A775'

const CUSTOMER_ASSISTANT_FIGMA_EMBED_SRC = `https://www.figma.com/embed?embed_host=share&url=${encodeURIComponent(CUSTOMER_ASSISTANT_FIGMA_PROTO)}`

const TEMPUS_ONE_ASSET_DIR = 'Tempus One'

function tempusOneAssetPath(...segments: string[]) {
  const path = segments.map((s) => encodeURIComponent(s)).join('/')
  const base = import.meta.env.BASE_URL
  if (!base || base === '/') return `/${path}`
  return `${base.replace(/\/$/, '')}/${path}`
}

const ORDERING_FEATURE_KEYS = ['orderTest', 'orderAddOn', 'orderSampleKit', 'cancelOrder'] as const

const ORDERING_FEATURE_IMAGES = {
  orderTest: 'feature - order test2.png',
  orderAddOn: 'feature - add ons2.png',
  orderSampleKit: 'feature - sample kits2.png',
  cancelOrder: 'feature - cancellation2.png',
} as const

const TIMELINE_KEYS = [
  'beta',
  'analysis',
  'fte',
  'national',
  'ca',
  'ordering',
  'lit',
  'ipo',
  'rebrand',
] as const

const IMPACT_STAT_KEYS = ['unique', 'mau', 'retention'] as const

/** Fits viewport: fr-based columns; gaps keep a tiny min so the stroke stays visible. */
function timelineGridTemplateColumns(milestoneCount: number) {
  const body = `minmax(0, 1fr) ${Array.from({ length: milestoneCount - 1 }, () => 'minmax(2px, 0.26fr) minmax(0, 1fr)').join(' ')}`
  return `${body} minmax(1.25rem, 0.5fr)`
}

export function TempusOneCaseStudy() {
  const { t, messages } = useLanguage()
  const m = messages.tempus
  const { tempF, weatherCode, status: weatherStatus } = useAustinWeather()

  const timelineMilestones = useMemo(
    () =>
      TIMELINE_KEYS.map((key) => {
        const row = m.timeline[key]
        return { title: row.title, date: 'date' in row ? row.date : undefined }
      }),
    [m.timeline],
  )

  const timelineColumns = timelineGridTemplateColumns(timelineMilestones.length)

  const teamLines = [m.team0, m.team1, m.team2, m.team3, m.team4]

  return (
    <article className="case-tempus case-with-glass-hero" aria-label={m.articleAria}>
      <HeroGlassProject
        tempF={tempF}
        weatherCode={weatherCode}
        weatherStatus={weatherStatus}
        title={messages.projects['tempus-one'].title}
        tags={m.tags}
        subtitle={m.subline}
        sectionBgClassName="bg-[#98B8A9]/25"
      />

      <section className="case-tempus-intro" aria-labelledby="case-tempus-intro-heading">
        <div className="case-tempus-intro-grid">
          <div className="case-tempus-intro-copy">
            <h2 id="case-tempus-intro-heading" className="case-tempus-intro-heading">
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

      <section className="case-tempus-problem" aria-labelledby="case-tempus-problem-heading">
        <h2 id="case-tempus-problem-heading" className="case-tempus-intro-heading">
          {m.problem}
        </h2>
        <p className="case-tempus-intro-text case-tempus-problem-detail">{m.problemDetail}</p>
        <div className="case-tempus-problem-copy">
          <p className="case-tempus-intro-text case-tempus-problem-data-heading">{m.problemDataHeading}</p>
          <ul className="case-tempus-impact-list case-tempus-problem-list">
            <li>
              {m.problemPoint1Before}
              {m.problemPoint1Highlight}
              {m.problemPoint1After}
            </li>
            <li>{m.problemPoint2}</li>
            <li>{m.problemPoint3}</li>
            <li>
              {m.problemPoint4Before}
              {m.problemPoint4Highlight}
            </li>
          </ul>
          <p className="case-tempus-intro-text case-tempus-problem-conclusion">{m.problemConclusion}</p>
        </div>
      </section>

      <section
        className="case-tempus-timeline-section"
        aria-labelledby="case-tempus-vis-timeline-heading"
      >
        <h2 id="case-tempus-vis-timeline-heading" className="case-tempus-intro-heading">
          {m.timelineHeading}
        </h2>
        <div className="case-tempus-timeline-scroll">
          <div className="case-tempus-timeline-stack">
            <div className="case-tempus-tg-rail" style={{ gridTemplateColumns: timelineColumns }}>
              <div className="case-tempus-tg-rail-line" aria-hidden="true" />
              {timelineMilestones.map((_, i) => (
                <div key={`m-${i}`} className="case-tempus-tg-markerCell" style={{ gridColumn: i * 2 + 1 }}>
                  <span className="case-tempus-milestone-marker" />
                </div>
              ))}
              {timelineMilestones.map((_, i) =>
                i < timelineMilestones.length - 1 ? (
                  <div key={`g-${i}`} className="case-tempus-tg-gap" style={{ gridColumn: i * 2 + 2 }} />
                ) : null,
              )}
              <div
                className="case-tempus-tg-tail-spacer"
                style={{ gridColumn: timelineMilestones.length * 2 }}
                aria-hidden="true"
              />
            </div>
            <div className="case-tempus-tg-labels" style={{ gridTemplateColumns: timelineColumns }}>
              {timelineMilestones.map((item, i) => (
                <div key={`l-${i}`} className="case-tempus-tg-label" style={{ gridColumn: i * 2 + 1 }}>
                  <span className="case-tempus-tg-label-title">{item.title}</span>
                  {item.date ? <span className="case-tempus-tg-label-date">{item.date}</span> : null}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section
        className="case-tempus-customer-assistant"
        aria-labelledby="case-tempus-customer-assistant-heading"
      >
        <h2 id="case-tempus-customer-assistant-heading" className="case-tempus-intro-heading">
          {m.customerAssistant}
        </h2>
        <div className="case-tempus-customer-assistant-grid">
          <div className="case-tempus-customer-assistant-copy">
            <p className="case-tempus-intro-text case-tempus-customer-assistant-intro">{m.customerAssistantIntro}</p>
            <p className="case-tempus-customer-assistant-success-heading">{m.successHeading}</p>
            <p className="case-tempus-intro-text case-tempus-customer-assistant-stat">
              <strong className="case-tempus-impact-num">36%</strong> {m.caStat1}
            </p>
            <p className="case-tempus-intro-text case-tempus-customer-assistant-stat">
              <strong className="case-tempus-impact-num">85.84%</strong> {m.caStat2}{' '}
              <strong className="case-tempus-impact-num">+13.29%</strong> {m.caStat2b}
            </p>
          </div>
          <div className="case-tempus-customer-assistant-embed">
            <div className="case-tempus-customer-assistant-embed-sizer">
              <iframe title={m.figmaTitle} src={CUSTOMER_ASSISTANT_FIGMA_EMBED_SRC} allowFullScreen />
            </div>
          </div>
        </div>
      </section>

      <section
        className="case-tempus-customer-assistant"
        aria-labelledby="case-tempus-ordering-launch-heading"
      >
        <h2 id="case-tempus-ordering-launch-heading" className="case-tempus-intro-heading">
          {m.orderingLaunch}
        </h2>
        <div className="case-tempus-customer-assistant-copy">
          <p className="case-tempus-intro-text case-tempus-customer-assistant-intro">{m.orderingIntro}</p>
          <p className="case-tempus-customer-assistant-success-heading">{m.successHeading}</p>
          <p className="case-tempus-intro-text case-tempus-customer-assistant-stat">
            {m.orderingStat1Before}{' '}
            <strong className="case-tempus-impact-num">2x</strong> {m.orderingStat1After}
          </p>
          <p className="case-tempus-intro-text case-tempus-customer-assistant-stat">
            {m.orderingStat2Before} <strong className="case-tempus-impact-num">No.1</strong>
          </p>
        </div>
        <div className="case-tempus-ordering-features">
          {ORDERING_FEATURE_KEYS.map((key) => {
            const feature = m.orderingFeatures[key]
            return (
              <figure key={key} className="case-tempus-ordering-feature">
                <div className="case-tempus-ordering-feature-media">
                  <img
                    src={tempusOneAssetPath(TEMPUS_ONE_ASSET_DIR, ORDERING_FEATURE_IMAGES[key])}
                    alt={feature.alt}
                    loading="lazy"
                    decoding="async"
                  />
                </div>
                <figcaption className="case-tempus-ordering-feature-label">{feature.label}</figcaption>
              </figure>
            )
          })}
        </div>
      </section>

      <section className="case-tempus-impact-stats" aria-labelledby="case-tempus-impact-stats-heading">
        <h2 id="case-tempus-impact-stats-heading" className="case-tempus-intro-heading">
          {m.impactHeading}
        </h2>
        <div className="case-tempus-impact-stats-grid">
          {IMPACT_STAT_KEYS.map((key) => {
            const stat = m.impactStats[key]
            return (
              <div key={key} className="case-tempus-impact-stat">
                <p className="case-tempus-impact-stat-value">{stat.value}</p>
                <p className="case-tempus-impact-stat-label">{stat.label}</p>
              </div>
            )
          })}
        </div>
        <p className="case-tempus-intro-text case-tempus-impact-summary">{m.impactSummary}</p>
      </section>

      <CaseStudyConnectCta />

      <CaseStudyMoreProjects excludeSlug="tempus-one" />
    </article>
  )
}
