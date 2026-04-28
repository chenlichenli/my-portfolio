import { CaseStudyDesignDetails } from '../components/CaseStudyDesignDetails'
import { CaseStudyMoreProjects } from '../components/CaseStudyMoreProjects'
import { HeroGlassProject } from '../components/HeroGlassLanding'
import { useAustinWeather } from '../hooks/useAustinWeather'
import './TempusOneCaseStudy.css'
import './IQueueForClinicsCaseStudy.css'

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

const DESIGN_DETAIL_SLIDES = [
  {
    id: 'data-health',
    title: 'Data Health',
    file: 'iqueue 1.png',
    imageAlt: 'Data Health in iQueue for Clinics',
  },
  {
    id: 'room-allocation',
    title: 'Room allocation',
    file: 'iqueue 0.png',
    imageAlt: 'Room allocation view in iQueue for Clinics',
  },
  {
    id: 'provider-template-review',
    title: 'Provider Template Review',
    file: 'iqueue 2.png',
    imageAlt: 'Provider Template Review in iQueue for Clinics',
  },
] as const

const KEY_TAKEAWAYS = [
  'What User require not always means what they need',
  'Involving engineering team from the outset can save time in an agile environment',
  "Try to find resources when there aren't enough, be proactive as the only designer on the team",
] as const

export function IQueueForClinicsCaseStudy() {
  const { tempF, weatherCode, status: weatherStatus } = useAustinWeather()
  return (
    <article className="case-tempus case-with-glass-hero" aria-label="iQueue for Clinics case study">
      <HeroGlassProject
        tempF={tempF}
        weatherCode={weatherCode}
        weatherStatus={weatherStatus}
        title="iQueue for Clinics"
        tags={TAGS}
        subtitle={SUBLINE}
        sectionBgClassName="bg-[#001F59]/20"
      />

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
            <div className="case-tempus-meta-block case-tempus-meta-block--timeline">
              <h3 className="case-tempus-meta-heading">Timeline</h3>
              <p className="case-tempus-meta-timeline">Dec 2019 - March 2020</p>
            </div>
          </aside>
        </div>
      </section>

      <CaseStudyDesignDetails
        slides={DESIGN_DETAIL_SLIDES}
        getSrc={designImageSrc}
        idPrefix="iqueue"
        headingId="case-iqueue-design-heading"
      />

      <section className="case-iqueue-takeaways" aria-labelledby="case-iqueue-takeaways-heading">
        <h2 id="case-iqueue-takeaways-heading" className="case-tempus-intro-heading">
          📒 Key Takeaways
        </h2>
        <ul className="case-tempus-impact-list">
          {KEY_TAKEAWAYS.map((line) => (
            <li key={line}>{line}</li>
          ))}
        </ul>
      </section>

      <CaseStudyMoreProjects excludeSlug="iqueue-for-clinics" />
    </article>
  )
}
