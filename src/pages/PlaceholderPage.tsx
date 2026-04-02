import { Link } from 'react-router-dom'

type PlaceholderPageProps = {
  title: string
  description?: string
}

export function PlaceholderPage({ title, description }: PlaceholderPageProps) {
  return (
    <div className="mx-auto max-w-2xl px-6 py-16 md:px-8">
      <h1 className="mb-4 font-sans text-4xl font-normal tracking-tight text-[var(--text-heading)]">
        {title}
      </h1>
      {description ? (
        <p className="mb-8 text-[var(--text-muted)] leading-relaxed">{description}</p>
      ) : null}
      <Link
        to="/"
        className="font-bold text-[var(--accent)] underline-offset-4 hover:underline"
      >
        ← Back to Design
      </Link>
    </div>
  )
}
