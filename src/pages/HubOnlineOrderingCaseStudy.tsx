import type { ReactNode } from 'react'
import './TempusOneCaseStudy.css'

const TAGS = ['Enterprise UX', 'Scalability', 'Healthcare'] as const

const SUBLINE =
  'Redesigned and scaled online ordering experience, increasing order volume from 23K to 40K.'

const INTRO =
  'Oncology NGS testing is central to Tempus, but the ordering experience was complex and frustrating due to varying test requirements. As the business grew, adding new tests made the order form harder to maintain, challenging the goal of increasing order volume. I helped redesign a scalable order form and integrate the new xG Test.'

const TEAM = ['2 Product Designers', '1 Product Manager', '6 Engineers'] as const

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
  return (
    <article className="case-tempus" aria-label="Hub Online Ordering case study">
      <header className="case-tempus-hero">
        <h1 className="case-tempus-title">Hub Online Ordering</h1>
        <ul className="case-tempus-tags" aria-label="Project tags">
          {TAGS.map((tag) => (
            <li key={tag} className="case-tempus-tag">
              {tag}
            </li>
          ))}
        </ul>
        <p className="case-tempus-subline">{SUBLINE}</p>
      </header>

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
