import { Link } from 'react-router-dom'
import { useLanguage } from '../i18n/LanguageContext'

const PROJECT_SLUGS = ['tempus-one', 'hub-online-ordering', 'iqueue-for-clinics'] as const

export type CaseStudyProjectSlug = (typeof PROJECT_SLUGS)[number]

type CaseStudyMoreProjectsProps = {
  /** Current case study — the other two are linked. */
  excludeSlug: CaseStudyProjectSlug
}

export function CaseStudyMoreProjects({ excludeSlug }: CaseStudyMoreProjectsProps) {
  const { t, messages } = useLanguage()
  const others = PROJECT_SLUGS.filter((slug) => slug !== excludeSlug)
  return (
    <nav className="case-more-projects" aria-labelledby="case-more-projects-heading">
      <h2 id="case-more-projects-heading" className="case-tempus-intro-heading">
        {t('caseStudy.moreProjects')}
      </h2>
      <ul className="case-more-projects-list">
        {others.map((slug) => {
          const p = messages.projects[slug]
          return (
            <li key={slug}>
              <Link to={`/${slug}`} className="case-more-projects-link">
                <span className="case-more-projects-company">{p.company}</span>
                <span className="case-more-projects-title">{p.title}</span>
              </Link>
            </li>
          )
        })}
      </ul>
    </nav>
  )
}
