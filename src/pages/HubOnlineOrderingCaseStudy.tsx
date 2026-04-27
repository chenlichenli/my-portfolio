import type { ReactNode } from 'react'
import { CaseStudyDesignDetails } from '../components/CaseStudyDesignDetails'
import { HeroGlassProject } from '../components/HeroGlassLanding'
import { useAustinWeather } from '../hooks/useAustinWeather'
import './TempusOneCaseStudy.css'
import './IQueueForClinicsCaseStudy.css'

const TAGS = ['Enterprise UX', 'Scalability', 'Healthcare'] as const

const SUBLINE =
  'Redesigned and scaled online ordering experience, increasing order volume from 23K to 40K.'

const INTRO =
  'Oncology NGS testing is central to Tempus, but the ordering experience was complex and frustrating due to varying test requirements. As the business grew, adding new tests made the order form harder to maintain, challenging the goal of increasing order volume. I helped redesign a scalable order form and integrate the new xG Test.'

const TEAM = ['2 Product Designers', '1 Product Manager', '6 Engineers'] as const

const HUB_ORDERING_DESIGN_DIR = 'Online Ordering'

function hubOrderingDesignSrc(file: string) {
  return `/${encodeURI(`${HUB_ORDERING_DESIGN_DIR}/${file}`)}`
}

const HUB_DESIGN_DETAIL_SLIDES = [
  {
    id: 'test-selection',
    title: 'Test selection',
    file: 'Test Selection.png',
    imageAlt: 'Test selection step in Hub online ordering',
  },
  {
    id: 'existing-patient-autofill',
    title: 'Existing patient auto fill',
    file: 'Existing Patient Auto Fill.png',
    imageAlt: 'Existing patient auto fill in Hub online ordering',
  },
  {
    id: 'confirmation-page',
    title: 'Confirmation page',
    file: 'Confirmation Page.png',
    imageAlt: 'Order confirmation page in Hub online ordering',
  },
] as const

const IMPACT_METRICS: { id: string; content: ReactNode }[] = [
  {
    id: 'hub-ordering-impact-failure',
    content: (
      <>
        <strong className="case-tempus-impact-num">&lt;1%</strong> failure rate on order submission
      </>
    ),
  },
  {
    id: 'hub-ordering-impact-submission-time',
    content: (
      <>
        Reduce submission time from <strong className="case-tempus-impact-num">40%</strong> (
        <strong className="case-tempus-impact-num">~9 seconds</strong> to{' '}
        <strong className="case-tempus-impact-num">&lt;3 seconds</strong>) post national rollout
      </>
    ),
  },
  {
    id: 'hub-ordering-impact-volume',
    content: (
      <>
        Increase online order form volume from <strong className="case-tempus-impact-num">27k</strong> to{' '}
        <strong className="case-tempus-impact-num">40k</strong> YTD in 2023
      </>
    ),
  },
]

export function HubOnlineOrderingCaseStudy() {
  const { tempF, weatherCode, status: weatherStatus } = useAustinWeather()
  return (
    <article className="case-tempus case-with-glass-hero" aria-label="Hub Online Ordering case study">
      <HeroGlassProject
        tempF={tempF}
        weatherCode={weatherCode}
        weatherStatus={weatherStatus}
        title="Hub Online Ordering"
        tags={TAGS}
        subtitle={SUBLINE}
      />

      <section className="case-tempus-intro" aria-labelledby="case-hub-ordering-intro-heading">
        <div className="case-tempus-intro-grid">
          <div className="case-tempus-intro-copy">
            <h2 id="case-hub-ordering-intro-heading" className="case-tempus-intro-heading">
              Intro
            </h2>
            <p className="case-tempus-intro-text">{INTRO}</p>
          </div>
          <aside className="case-tempus-meta" aria-label="Project details">
            <div className="case-tempus-meta-block">
              <h3 className="case-tempus-meta-heading">Team</h3>
              <ul className="case-tempus-meta-list">
                {TEAM.map((line) => (
                  <li key={line}>{line}</li>
                ))}
              </ul>
            </div>
            <div className="case-tempus-meta-block case-tempus-meta-block--timeline">
              <h3 className="case-tempus-meta-heading">Timeline</h3>
              <p className="case-tempus-meta-timeline">Sept 2022 - April 2023</p>
            </div>
          </aside>
        </div>
      </section>

      <CaseStudyDesignDetails
        slides={HUB_DESIGN_DETAIL_SLIDES}
        getSrc={hubOrderingDesignSrc}
        idPrefix="hub-ordering"
        headingId="case-hub-ordering-design-heading"
      />

      <section className="case-tempus-impact" aria-labelledby="case-hub-ordering-impact-heading">
        <h2 id="case-hub-ordering-impact-heading" className="case-tempus-intro-heading">
          🎉 Impact
        </h2>
        <ul className="case-tempus-impact-list">
          {IMPACT_METRICS.map(({ id, content }) => (
            <li key={id}>{content}</li>
          ))}
        </ul>
      </section>
    </article>
  )
}
