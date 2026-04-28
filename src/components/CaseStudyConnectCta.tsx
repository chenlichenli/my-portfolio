import { useLanguage } from '../i18n/LanguageContext'

/** Closing line on case study pages — after Impact (or last outcomes section). */
export function CaseStudyConnectCta() {
  const { t } = useLanguage()
  return (
    <section className="case-connect-cta" aria-label={t('caseStudy.connectCtaAria')}>
      <p className="case-connect-cta__text">{t('caseStudy.connectCta')}</p>
    </section>
  )
}
