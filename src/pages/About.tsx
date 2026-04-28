import { useMemo } from 'react'
import { AboutExperience } from '../components/AboutExperience'
import { HeroGlassScene } from '../components/HeroGlassLanding'
import { StackedPhotoGallery } from '../components/StackedPhotoGallery'
import { useLanguage } from '../i18n/LanguageContext'
import './About.css'

/** About glass blobs — landing hero keeps default blue / orange / temp circle. */
const ABOUT_BLOB = {
  circle: '#F2DE35',
  square: '#5271FF',
  triangle: '#DF4702',
} as const

/** Photos from /public: me.jpg, Vinny.JPG, Nala.JPG */
const ABOUT_PHOTO_FILES = [
  { src: '/me.jpg', name: 'me' as const },
  { src: '/Vinny.JPG', name: 'vinny' as const },
  { src: '/Nala.JPG', name: 'nala' as const },
] as const

export function About() {
  const { t, messages } = useLanguage()
  const photos = useMemo(
    () =>
      ABOUT_PHOTO_FILES.map((p) => ({
        ...p,
        alt: messages.about.photoAlt[p.name],
      })),
    [messages.about.photoAlt],
  )

  return (
    <div className="about-route">
      <HeroGlassScene
        tempF={null}
        weatherCode={null}
        weatherStatus="ready"
        circleGradientHex={ABOUT_BLOB.circle}
        triangleFill={ABOUT_BLOB.triangle}
        squareFill={ABOUT_BLOB.square}
        breakout={false}
        sectionMinClass="flex min-h-0 flex-1 flex-col"
        contentClassName="relative z-[2] mx-auto flex min-h-0 w-full max-w-[1120px] flex-1 flex-col justify-center overflow-y-auto overflow-x-hidden px-6 py-10 md:px-10 md:py-12"
        showLocationWeather={false}
      >
        <article className="about-page">
          <div className="about-page-shell">
            <div className="about-page-split">
              <div className="about-page-split-inner">
                <div className="about-page-split-media">
                  <div className="about-page-media-stack">
                    <h1 className="about-page-photo-heading">{t('about.meetHeading')}</h1>
                    <section aria-label={t('about.photosAria')}>
                      <StackedPhotoGallery items={photos} initialOrder={[1, 2, 0]} />
                    </section>
                  </div>
                </div>

                <div className="about-page-split-copy">
                  <AboutExperience />
                  <p className="about-page-intro text-[var(--text)] leading-relaxed">
                    {t('about.intro')}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </article>
      </HeroGlassScene>
    </div>
  )
}
