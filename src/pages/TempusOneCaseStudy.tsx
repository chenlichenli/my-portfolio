import type { ReactNode } from 'react'
import { Link } from 'react-router-dom'
import './TempusOneCaseStudy.css'

const TAGS = ['AI Experience', 'Growth Design', '0-1'] as const

const SUBLINE =
  'Designed a cross-platform AI experience that unlocked new growth and boosted engagement.'

const INTRO =
  'Tempus One is a conversational AI assistant integrated into the Hub platform, available on both web and mobile (iOS & Android). It helps external oncologists quickly access patient data and streamline treatment workflows. After the beta launch, I joined as the product design lead to improve user engagement and drive adoption among clinical users.'

const TEAM = [
  '1 Product Designer',
  '1 Product Manager',
  '1 Operation Manager',
  '1 Marketing Manager',
  '5 Engineers',
] as const

const PRODUCT_PROBLEM_LEAD = 'Product Problem: low acquisition and retention rate'

const PRODUCT_PROBLEM_DETAIL =
  'Beta launch brings the user stickiness issue with low acquisition and retention rate, however, business goal is to grow user base.'

type TimelineMilestone = { title: string; date?: string }

const TIMELINE_MILESTONES: TimelineMilestone[] = [
  { title: 'Beta Launch', date: '05.2023' },
  { title: 'User Analysis & Product Strategy' },
  { title: 'First Time Experience Redesign (Activation)' },
  { title: 'National Launch', date: '09.2023' },
  { title: 'Customer Assistant Launch (1st Gen AI agent)' },
  { title: 'Ordering Capability Launch' },
  { title: 'Literature Search Launch' },
  { title: 'Company IPO', date: '06.2024' },
  { title: 'Product Rebrand' },
]

const IMPACT_METRICS: { id: string; content: ReactNode }[] = [
  {
    id: 'impact-unique-users',
    content: (
      <>
        The unique user base has grown by <strong className="case-tempus-impact-num">685.7%</strong>
      </>
    ),
  },
  {
    id: 'impact-mau',
    content: (
      <>
        Monthly active users increased by <strong className="case-tempus-impact-num">48.8%</strong>
      </>
    ),
  },
  {
    id: 'impact-retention',
    content: (
      <>
        Retention rate increased from <strong className="case-tempus-impact-num">19.4%</strong> to{' '}
        <strong className="case-tempus-impact-num">34.7%</strong>
      </>
    ),
  },
  {
    id: 'impact-hub-mau-one',
    content: (
      <>
        Increased Hub&apos;s MAU using One from <strong className="case-tempus-impact-num">2.3%</strong> to{' '}
        <strong className="case-tempus-impact-num">5.49%</strong>
      </>
    ),
  },
]

/** Fits viewport: fr-based columns; gaps keep a tiny min so the stroke stays visible. */
function timelineGridTemplateColumns(milestoneCount: number) {
  const body = `minmax(0, 1fr) ${Array.from({ length: milestoneCount - 1 }, () => 'minmax(2px, 0.26fr) minmax(0, 1fr)').join(' ')}`
  return `${body} minmax(1.25rem, 0.5fr)`
}

export function TempusOneCaseStudy() {
  const timelineColumns = timelineGridTemplateColumns(TIMELINE_MILESTONES.length)
  return (
    <article className="case-tempus" aria-label="Tempus One case study">
      <header className="case-tempus-hero">
        <h1 className="case-tempus-title">Tempus One</h1>
        <ul className="case-tempus-tags" aria-label="Project tags">
          {TAGS.map((tag) => (
            <li key={tag} className="case-tempus-tag">
              {tag}
            </li>
          ))}
        </ul>
        <p className="case-tempus-subline">{SUBLINE}</p>
        <Link className="case-tempus-back" to="/">
          ← Design work
        </Link>
      </header>

      <section className="case-tempus-intro" aria-labelledby="case-tempus-intro-heading">
        <div className="case-tempus-intro-grid">
          <div className="case-tempus-intro-copy">
            <h2 id="case-tempus-intro-heading" className="case-tempus-intro-heading">
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
              <p className="case-tempus-meta-timeline">May 2023 - October 2024</p>
            </div>
          </aside>
        </div>
      </section>

      <section
        className="case-tempus-problem"
        aria-labelledby="case-tempus-problem-heading"
      >
        <h2 id="case-tempus-problem-heading" className="case-tempus-intro-heading">
          Product problem
        </h2>
        <p className="case-tempus-problem-lead">{PRODUCT_PROBLEM_LEAD}</p>
        <p className="case-tempus-intro-text case-tempus-problem-detail">{PRODUCT_PROBLEM_DETAIL}</p>
      </section>

      <section
        className="case-tempus-timeline-section"
        aria-labelledby="case-tempus-vis-timeline-heading"
      >
        <h2 id="case-tempus-vis-timeline-heading" className="case-tempus-intro-heading">
          Timeline
        </h2>
        <div className="case-tempus-timeline-scroll">
          <div className="case-tempus-timeline-stack">
            <div className="case-tempus-tg-rail" style={{ gridTemplateColumns: timelineColumns }}>
              <div className="case-tempus-tg-rail-line" aria-hidden="true" />
              {TIMELINE_MILESTONES.map((_, i) => (
                <div key={`m-${i}`} className="case-tempus-tg-markerCell" style={{ gridColumn: i * 2 + 1 }}>
                  <span className="case-tempus-milestone-marker" />
                </div>
              ))}
              {TIMELINE_MILESTONES.map((_, i) =>
                i < TIMELINE_MILESTONES.length - 1 ? (
                  <div key={`g-${i}`} className="case-tempus-tg-gap" style={{ gridColumn: i * 2 + 2 }} />
                ) : null,
              )}
              <div
                className="case-tempus-tg-tail-spacer"
                style={{ gridColumn: TIMELINE_MILESTONES.length * 2 }}
                aria-hidden="true"
              />
            </div>
            <div className="case-tempus-tg-labels" style={{ gridTemplateColumns: timelineColumns }}>
              {TIMELINE_MILESTONES.map((m, i) => (
                <div key={`l-${i}`} className="case-tempus-tg-label" style={{ gridColumn: i * 2 + 1 }}>
                  <span className="case-tempus-tg-label-title">{m.title}</span>
                  {m.date ? <span className="case-tempus-tg-label-date">{m.date}</span> : null}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="case-tempus-impact" aria-labelledby="case-tempus-impact-heading">
        <h2 id="case-tempus-impact-heading" className="case-tempus-intro-heading">
          Impact
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
