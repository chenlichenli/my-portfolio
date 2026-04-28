import { Link } from 'react-router-dom'
import { useLanguage } from '../i18n/LanguageContext'

export function PlaceholderPage() {
  const { t } = useLanguage()
  return (
    <div className="mx-auto max-w-2xl px-6 py-16 md:px-8">
      <h1 className="mb-4 font-sans text-4xl font-normal tracking-tight text-[var(--text-heading)]">
        {t('notFound.title')}
      </h1>
      <p className="mb-8 text-[var(--text-muted)] leading-relaxed">{t('notFound.description')}</p>
      <Link
        to="/"
        className="font-bold text-[var(--accent)] underline-offset-4 hover:underline"
      >
        {t('notFound.back')}
      </Link>
    </div>
  )
}
