import { StackedPhotoGallery } from '../components/StackedPhotoGallery'
import './About.css'

/** Photos from /public: me.jpg, Vinny.JPG, Nala.JPG */
const ABOUT_PHOTOS = [
  { src: '/me.jpg', name: 'me', alt: 'Li Chen' },
  { src: '/Vinny.JPG', name: 'vinny', alt: 'Vinny the cat' },
  { src: '/Nala.JPG', name: 'nala', alt: 'Nala the cat' },
] as const

export function About() {
  return (
    <article className="about-page">
      <div className="about-page-shell">
        <div className="about-page-split">
          <div className="about-page-split-media">
            <section aria-label="Photos">
              <StackedPhotoGallery items={ABOUT_PHOTOS} initialOrder={[1, 2, 0]} />
            </section>
          </div>

          <div className="about-page-split-copy space-y-6 text-[var(--text)] leading-relaxed">
            <div className="space-y-3">
              <h1 className="whitespace-nowrap font-sans text-4xl font-normal leading-[1.1] tracking-tight text-[var(--text-heading)] md:text-5xl lg:text-6xl">
                nice to meet you!
              </h1>
              <p>Hi there, this is Li.</p>
            </div>

            <p className="text-[var(--text-muted)]">
              Currently working at Tempus AI, with previous experience at Real Chemistry and LeanTaaS. I
              hold an MFA in Design and Technology from Parsons School of Design. My educational and
              professional journey has taken me from China, where I was born and raised, to Germany and
              New York City. Now I reside in Charlotte, NC.
            </p>

            <p className="text-[var(--text-muted)]">
              I enjoy traveling ✈️, hunting for cozy coffee shops ☕️, practice my tennis swing 🎾,
              diving into video games 👾, and playing with my two cats 🐈 🔸Vinny and ▪️Nala.
            </p>
          </div>
        </div>
      </div>
    </article>
  )
}
