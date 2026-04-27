import { CaseStudyDesignDetails } from '../components/CaseStudyDesignDetails'
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

/** Folder on disk is `Iterations` (matches repo); keeps URLs valid on case-sensitive hosts. */
const ITERATIONS_SUBDIR = 'Iterations'

/**
 * Public assets under `iQueue for Clinics/`. Uses `encodeURI` per segment so spaces
 * become %20 but literal `+` in filenames (e.g. exports) stay as `+`. `encodeURIComponent`
 * turns `+` into `%2B`, which often fails static file lookup (broken images).
 */
function iqueueAssetPath(...segments: string[]) {
  return `/${segments.map((s) => encodeURI(s)).join('/')}`
}

function designImageSrc(file: string) {
  return iqueueAssetPath(DESIGN_IMAGE_DIR, file)
}

const ITERATION_IMAGES = [
  {
    id: 'iter-12',
    file: 'iQueue+for+Clinics+Case+Study.012.png',
    alt: 'iQueue for Clinics iteration — exploration 1',
  },
  {
    id: 'iter-13',
    file: 'iQueue+for+Clinics+Case+Study.013.png',
    alt: 'iQueue for Clinics iteration — exploration 2',
  },
  {
    id: 'iter-14',
    file: 'iQueue+for+Clinics+Case+Study.014.png',
    alt: 'iQueue for Clinics iteration — exploration 3',
  },
  {
    id: 'iter-15',
    file: 'iQueue+for+Clinics+Case+Study.015.jpg',
    alt: 'iQueue for Clinics iteration — exploration 4',
  },
  {
    id: 'iter-16',
    file: 'iQueue+for+Clinics+Case+Study.016.png',
    alt: 'iQueue for Clinics iteration — exploration 5',
  },
] as const

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

      <section className="case-iqueue-iterations" aria-labelledby="case-iqueue-iterations-heading">
        <h2 id="case-iqueue-iterations-heading" className="case-tempus-intro-heading">
          Iteration
        </h2>
        <ul className="case-iqueue-iterations-list">
          {ITERATION_IMAGES.map((item) => (
            <li key={item.id} className="case-iqueue-iterations-item">
              <figure className="case-iqueue-iterations-figure">
                <img
                  src={iqueueAssetPath(DESIGN_IMAGE_DIR, ITERATIONS_SUBDIR, item.file)}
                  alt={item.alt}
                  loading="lazy"
                  decoding="async"
                />
              </figure>
            </li>
          ))}
        </ul>
      </section>

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
    </article>
  )
}
