import { Link } from 'react-router-dom'

const PROJECTS = [
  { slug: 'tempus-one', title: 'Tempus One', company: 'Tempus AI' },
  { slug: 'hub-online-ordering', title: 'Hub Online Ordering', company: 'Tempus AI' },
  { slug: 'iqueue-for-clinics', title: 'iQueue for Clinics', company: 'LeanTaaS' },
] as const

export type CaseStudyProjectSlug = (typeof PROJECTS)[number]['slug']

type CaseStudyMoreProjectsProps = {
  /** Current case study — the other two are linked. */
  excludeSlug: CaseStudyProjectSlug
}

export function CaseStudyMoreProjects({ excludeSlug }: CaseStudyMoreProjectsProps) {
  const others = PROJECTS.filter((p) => p.slug !== excludeSlug)
  return (
    <nav className="case-more-projects" aria-labelledby="case-more-projects-heading">
      <h2 id="case-more-projects-heading" className="case-tempus-intro-heading">
        More projects
      </h2>
      <ul className="case-more-projects-list">
        {others.map((p) => (
          <li key={p.slug}>
            <Link to={`/${p.slug}`} className="case-more-projects-link">
              <span className="case-more-projects-company">{p.company}</span>
              <span className="case-more-projects-title">{p.title}</span>
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  )
}
