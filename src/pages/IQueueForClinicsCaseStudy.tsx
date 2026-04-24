import './TempusOneCaseStudy.css'

const TAGS = ['Machine Learning UX', 'Healthcare', 'Data-driven'] as const

const SUBLINE =
  'How can we leverage predict analytic to optimize hospital schedule and resource allocation?'

const INTRO =
  'iQueue for Clinics is a web-based analytics tool helping healthcare professionals to reduce patient wait time and maximize resource allocation. Room Allocation is one portion of the Clinic Admin Panel that helps administrators optimize utilization of exam and procedure rooms.'

const TEAM = [
  '1 Product Designer',
  '1 Product Manager',
  '1 Data Scientist',
  '2 Product Implementation Managers',
  '14 Engineers',
] as const

export function IQueueForClinicsCaseStudy() {
  return (
    <article className="case-tempus" aria-label="iQueue for Clinics case study">
      <header className="case-tempus-hero">
        <h1 className="case-tempus-title">iQueue for Clinics</h1>
        <ul className="case-tempus-tags" aria-label="Project tags">
          {TAGS.map((tag) => (
            <li key={tag} className="case-tempus-tag">
              {tag}
            </li>
          ))}
        </ul>
        <p className="case-tempus-subline">{SUBLINE}</p>
      </header>

      <section className="case-tempus-intro" aria-labelledby="case-iqueue-intro-heading">
        <div className="case-tempus-intro-grid">
          <div className="case-tempus-intro-copy">
            <h2 id="case-iqueue-intro-heading" className="case-tempus-intro-heading">
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
          </aside>
        </div>
      </section>
    </article>
  )
}
