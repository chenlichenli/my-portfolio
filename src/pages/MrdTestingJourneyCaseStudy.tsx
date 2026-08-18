import { CaseStudyConnectCta } from '../components/CaseStudyConnectCta'
import { CaseStudyMoreProjects } from '../components/CaseStudyMoreProjects'
import { HeroGlassProject } from '../components/HeroGlassLanding'
import { useAustinWeather } from '../hooks/useAustinWeather'
import { useLanguage } from '../i18n/LanguageContext'
import './TempusOneCaseStudy.css'
import './MrdTestingJourneyCaseStudy.css'

const MRD_ASSET_DIR = 'Reimagining the MRD Testing Journey'

function mrdAssetSrc(file: string) {
  return encodeURI(`/${MRD_ASSET_DIR}/${file}`)
}

const MRD_PROBLEM_IMAGES = {
  single: 'Single Test.png',
  monitoring: 'Monitoring test.png',
} as const

const MRD_REFRAMING_IMAGES = {
  tracking: 'test tracking.png',
  result: 'test result.png',
} as const

const MRD_DESIGNING_IMAGES = {
  resultTypes: 'Different result types.gif',
  variableCanvas: 'Variable canvas.gif',
} as const

export function MrdTestingJourneyCaseStudy() {
  const { t, messages } = useLanguage()
  const m = messages.mrd
  const project = messages.projects['mrd-testing-journey']
  const { tempF, weatherCode, status: weatherStatus } = useAustinWeather()

  const teamLines = [m.team0, m.team1, m.team2, m.team3, m.team4]

  return (
    <article className="case-tempus case-with-glass-hero" aria-label={m.articleAria}>
      <HeroGlassProject
        tempF={tempF}
        weatherCode={weatherCode}
        weatherStatus={weatherStatus}
        title={project.title.replace('\n', ' ')}
        tags={m.tags}
        subtitle={m.subline}
        sectionBgClassName="bg-[#001F59]/20"
      />

      <section className="case-tempus-intro" aria-labelledby="case-mrd-intro-heading">
        <div className="case-tempus-intro-grid">
          <div className="case-tempus-intro-copy">
            <h2 id="case-mrd-intro-heading" className="case-tempus-intro-heading">
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

      <section
        className="case-tempus-problem case-mrd-my-role"
        aria-labelledby="case-mrd-problem-heading"
      >
        <h2 id="case-mrd-problem-heading" className="case-tempus-intro-heading">
          {m.problem}
        </h2>
        <p className="case-tempus-intro-text case-tempus-problem-detail case-mrd-the-problem-summary">
          {m.problemLead}
        </p>
        <p className="case-tempus-intro-text case-tempus-problem-detail case-mrd-the-problem-summary">
          {m.problemDetail}
        </p>
      </section>

      <section
        className="case-tempus-problem case-mrd-the-problem"
        aria-labelledby="case-mrd-the-problem-heading"
      >
        <h2 id="case-mrd-the-problem-heading" className="case-tempus-intro-heading">
          {m.theProblem}
        </h2>
        <div className="case-mrd-problem-compare">
          <p className="case-mrd-problem-compare-label case-mrd-problem-compare-label--single">
            {m.theProblemSingleTest}
          </p>
          <p className="case-mrd-problem-compare-label case-mrd-problem-compare-label--monitoring">
            {m.theProblemMonitoring}
          </p>
          <figure className="case-mrd-problem-compare-media case-mrd-problem-compare-media--single">
            <img
              src={mrdAssetSrc(MRD_PROBLEM_IMAGES.single)}
              alt={m.theProblemSingleTestImageAlt}
              loading="lazy"
              decoding="async"
            />
          </figure>
          <figure className="case-mrd-problem-compare-media case-mrd-problem-compare-media--monitoring">
            <img
              src={mrdAssetSrc(MRD_PROBLEM_IMAGES.monitoring)}
              alt={m.theProblemMonitoringImageAlt}
              loading="lazy"
              decoding="async"
            />
          </figure>
        </div>
        <p className="case-tempus-intro-text case-tempus-problem-detail case-mrd-the-problem-summary">
          {m.theProblemText}
        </p>
      </section>

      <section
        className="case-tempus-problem case-mrd-reframing"
        aria-labelledby="case-mrd-reframing-heading"
      >
        <h2 id="case-mrd-reframing-heading" className="case-tempus-intro-heading">
          {m.reframingProblem}
        </h2>
        <p className="case-tempus-intro-text case-tempus-problem-detail case-mrd-the-problem-summary">
          {m.reframingProblemText}
        </p>
        <div className="case-mrd-problem-compare">
          <p className="case-mrd-problem-compare-label case-mrd-problem-compare-label--tracking">
            {m.reframingTestTracking}
          </p>
          <p className="case-mrd-problem-compare-label case-mrd-problem-compare-label--result">
            {m.reframingTestResult}
          </p>
          <figure className="case-mrd-problem-compare-media case-mrd-problem-compare-media--tracking">
            <img
              src={mrdAssetSrc(MRD_REFRAMING_IMAGES.tracking)}
              alt={m.reframingTestTrackingImageAlt}
              loading="lazy"
              decoding="async"
            />
          </figure>
          <figure className="case-mrd-problem-compare-media case-mrd-problem-compare-media--result">
            <img
              src={mrdAssetSrc(MRD_REFRAMING_IMAGES.result)}
              alt={m.reframingTestResultImageAlt}
              loading="lazy"
              decoding="async"
            />
          </figure>
        </div>
        <p className="case-tempus-intro-text case-tempus-problem-detail case-mrd-the-problem-summary">
          {m.reframingProblemClosing}
        </p>
      </section>

      <section
        className="case-tempus-problem case-mrd-designing-system"
        aria-labelledby="case-mrd-designing-system-heading"
      >
        <h2 id="case-mrd-designing-system-heading" className="case-tempus-intro-heading">
          {m.designingSystem}
        </h2>
        <div className="case-mrd-problem-compare">
          <p className="case-mrd-problem-compare-label case-mrd-problem-compare-label--result-types">
            {m.designingResultTypes}
          </p>
          <p className="case-mrd-problem-compare-label case-mrd-problem-compare-label--variable-canvas">
            {m.designingVariableCanvas}
          </p>
          <figure className="case-mrd-problem-compare-media case-mrd-problem-compare-media--result-types">
            <img
              src={mrdAssetSrc(MRD_DESIGNING_IMAGES.resultTypes)}
              alt={m.designingResultTypesImageAlt}
              loading="lazy"
              decoding="async"
            />
          </figure>
          <figure className="case-mrd-problem-compare-media case-mrd-problem-compare-media--variable-canvas">
            <img
              src={mrdAssetSrc(MRD_DESIGNING_IMAGES.variableCanvas)}
              alt={m.designingVariableCanvasImageAlt}
              loading="lazy"
              decoding="async"
            />
          </figure>
        </div>
      </section>

      <section className="case-tempus-problem case-mrd-outcome" aria-labelledby="case-mrd-outcome-heading">
        <h2 id="case-mrd-outcome-heading" className="case-tempus-intro-heading">
          {m.outcome}
        </h2>
        <p className="case-tempus-intro-text case-tempus-problem-detail case-mrd-the-problem-summary">
          {m.outcomeText}
        </p>
      </section>

      <CaseStudyConnectCta />

      <CaseStudyMoreProjects excludeSlug="mrd-testing-journey" />
    </article>
  )
}
