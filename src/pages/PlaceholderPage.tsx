import { Link } from 'react-router-dom'

type PlaceholderPageProps = {
  title: string
  description?: string
}

export function PlaceholderPage({ title, description }: PlaceholderPageProps) {
  return (
    <div
      style={{
        maxWidth: '42rem',
        margin: '0 auto',
        padding: '4rem 1.5rem',
      }}
    >
      <h1
        style={{
          fontFamily: 'var(--font-display)',
          fontWeight: 400,
          fontSize: '2.25rem',
          color: 'var(--text-heading)',
          margin: '0 0 1rem',
        }}
      >
        {title}
      </h1>
      {description ? (
        <p style={{ color: 'var(--text-muted)', margin: '0 0 2rem' }}>
          {description}
        </p>
      ) : null}
      <Link
        to="/"
        style={{
          fontWeight: 700,
          color: 'var(--accent)',
        }}
      >
        ← Back to Design
      </Link>
    </div>
  )
}
