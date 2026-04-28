import { useEffect, useRef, useState, type CSSProperties, type KeyboardEvent as ReactKeyboardEvent } from 'react'
import { createPortal } from 'react-dom'
import { useRevealOnScroll } from '../hooks/useRevealOnScroll'
import './SideWork.css'

type SideWorkVimeoKey = 'alice' | 'ipl' | 'giveMeFish'

const SIDE_WORK_VIMEO: Record<
  SideWorkVimeoKey,
  { page: string; embed: string; dialogTitle: string; iframeTitle: string }
> = {
  alice: {
    page: 'https://vimeo.com/270918447?fl=pl&fe=ti',
    embed: 'https://player.vimeo.com/video/270918447?dnt=1',
    dialogTitle: 'Alice Wonderland',
    iframeTitle: 'Alice Wonderland on Vimeo',
  },
  ipl: {
    page: 'https://vimeo.com/266034746',
    embed: 'https://player.vimeo.com/video/266034746?dnt=1',
    dialogTitle: 'I am Programming Language',
    iframeTitle: 'I am Programming Language on Vimeo',
  },
  giveMeFish: {
    page: 'https://vimeo.com/260331165',
    embed: 'https://player.vimeo.com/video/260331165?dnt=1',
    dialogTitle: 'Give Me Fish',
    iframeTitle: 'Give Me Fish on Vimeo',
  },
}

export type SideWorkTag = 'Motion graphics' | 'Data viz'

/** Single-GIF tiles (excludes composite groups below). */
const MOTION_GRAPHICS_GIFS = ['GiveMeFish_Li.gif', 'TomatoUFO.gif'] as const

/** Combined “I am Programming Language” card — three related GIFs. */
const I_AM_PROGRAMMING_LANGUAGE_GIFS = [
  'IAMAPROGRAMMINGLANGUAGE2_800x600.gif',
  'IAMAPROGRAMMINGLANGUAGE3_600x400.gif',
] as const

/** Combined “Alice Wonderland” card — four related GIFs in one tile. */
const ALICE_WONDERLAND_GIFS = [
  'CakeLoop_800x600.gif',
  'King&Queen_800x600.gif',
  'MagicCakeHat_800x600.gif',
  'Poker_800x600.gif',
] as const

const MOTION_GRAPHICS_BASE = '/Motion Graphics'

/** Embedded interactive piece (GitHub Pages). */
const DATA_VIZ_PROGRAMMING_LANG = {
  url: 'https://chenlichenli.github.io/DVIA_F18_Social/',
  title: 'The Development of Programming Language',
  description:
    'Interactive data visualization: explore how programming languages spread across nationality, native language, gender, and decade.',
  iframeTitle: 'The Development of Programming Language — interactive visualization',
} as const

/** Display titles that shouldn’t be derived from the filename alone. */
const MOTION_GIF_TITLE_OVERRIDES: Record<string, string> = {
  'GiveMeFish_Li.gif': 'Give Me Fish',
  'TomatoUFO.gif': 'Tomato UFO',
}

function motionGifSrc(filename: string): string {
  return encodeURI(`${MOTION_GRAPHICS_BASE}/${filename}`)
}

/** Human-ish title from filename (drops .gif and _800x600 style suffixes). */
function titleFromGifFilename(filename: string): string {
  const override = MOTION_GIF_TITLE_OVERRIDES[filename]
  if (override) return override
  return filename
    .replace(/\.gif$/i, '')
    .replace(/_\d+x\d+$/i, '')
    .replace(/_/g, ' ')
    .trim()
}

/** Optional WxH from filename (e.g. `_800x600.gif`) for layout reserve / aspect hint. */
function dimensionsFromGifFilename(filename: string): { width?: number; height?: number } {
  const m = filename.match(/_(\d+)x(\d+)\.gif$/i)
  if (!m) return {}
  return { width: Number(m[1]), height: Number(m[2]) }
}

/** Share of frame height trimmed from top + bottom (layout uses shorter box so rows don’t keep letterbox space). */
const MOTION_GIF_FRAME_CROP_Y = 0.18

function motionGifFrameAspectStyle(filename: string): CSSProperties {
  const d = dimensionsFromGifFilename(filename)
  const w = d.width ?? 4
  const h = d.height ?? 3
  const hShown = Math.max(1, h * (1 - 2 * MOTION_GIF_FRAME_CROP_Y))
  return { aspectRatio: `${w} / ${hShown}` }
}

function MotionGifFrame(props: {
  file: string
  alt: string
  loading?: 'eager' | 'lazy'
  decoding?: 'async' | 'auto' | 'sync'
}) {
  const { file, alt, loading, decoding } = props
  return (
    <div
      className="side-work-motion-gif-frame"
      style={motionGifFrameAspectStyle(file)}
    >
      <img src={motionGifSrc(file)} alt={alt} loading={loading} decoding={decoding} />
    </div>
  )
}

export function SideWork() {
  const [vimeoModal, setVimeoModal] = useState<SideWorkVimeoKey | null>(null)
  const sideWorkRevealRootRef = useRef<HTMLDivElement>(null)
  useRevealOnScroll(sideWorkRevealRootRef, '.side-work-reveal-card')

  useEffect(() => {
    if (vimeoModal === null) return
    const prevOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setVimeoModal(null)
    }
    window.addEventListener('keydown', onKeyDown)
    return () => {
      document.body.style.overflow = prevOverflow
      window.removeEventListener('keydown', onKeyDown)
    }
  }, [vimeoModal])

  function onVimeoCardKeyDown(e: ReactKeyboardEvent<HTMLElement>, key: SideWorkVimeoKey) {
    if (e.key !== 'Enter' && e.key !== ' ') return
    e.preventDefault()
    setVimeoModal(key)
  }

  const vimeoOpen = vimeoModal !== null ? SIDE_WORK_VIMEO[vimeoModal] : null

  return (
    <>
    <article className="side-work" aria-label="Side work">
      <div className="side-work-unified" ref={sideWorkRevealRootRef}>
        <div className="side-work-motion-bento">
          <figure
            className="side-work-motion-tile side-work-motion-tile--alice side-work-motion-tile--vimeo-trigger side-work-reveal-card"
            role="button"
            tabIndex={0}
            aria-label="Alice Wonderland — open full video"
            aria-haspopup="dialog"
            onClick={() => setVimeoModal('alice')}
            onKeyDown={(e) => onVimeoCardKeyDown(e, 'alice')}
          >
            <div className="side-work-motion-tile-media side-work-motion-tile-media--alice">
              <div className="side-work-motion-tile-alice-grid" role="group" aria-label="Alice Wonderland clips">
                {(
                  [
                    [0, 2],
                    [1, 3],
                  ] as const
                ).map((indices) => (
                  <div key={indices.join('-')} className="side-work-motion-tile-alice-col">
                    {indices.map((i) => {
                      const file = ALICE_WONDERLAND_GIFS[i]
                      const clipTitle = titleFromGifFilename(file)
                      return (
                        <MotionGifFrame
                          key={file}
                          file={file}
                          alt={`${clipTitle}, part of Alice Wonderland`}
                          loading={i < 2 ? 'eager' : 'lazy'}
                          decoding="async"
                        />
                      )
                    })}
                  </div>
                ))}
              </div>
            </div>
            <figcaption className="side-work-motion-tile-caption">
              <span className="side-work-bento__tag side-work-bento__tag--motion">Motion graphics</span>
              <span className="side-work-motion-tile-title">Alice Wonderland</span>
            </figcaption>
          </figure>

          <div className="side-work-motion-ipl-row">
            <figure
              className="side-work-motion-tile side-work-motion-tile--ipl side-work-motion-tile--vimeo-trigger side-work-reveal-card"
              role="button"
              tabIndex={0}
              aria-label="I am Programming Language — open full video"
              aria-haspopup="dialog"
              onClick={() => setVimeoModal('ipl')}
              onKeyDown={(e) => onVimeoCardKeyDown(e, 'ipl')}
            >
              <div className="side-work-motion-tile-media side-work-motion-tile-media--ipl">
                <div
                  className="side-work-motion-tile-ipl-grid"
                  role="group"
                  aria-label="I am Programming Language clips"
                >
                  {I_AM_PROGRAMMING_LANGUAGE_GIFS.map((file, i) => {
                    const clipTitle = titleFromGifFilename(file)
                    return (
                      <MotionGifFrame
                        key={file}
                        file={file}
                        alt={`${clipTitle}, part of I am Programming Language`}
                        loading={i < 1 ? 'eager' : 'lazy'}
                        decoding="async"
                      />
                    )
                  })}
                </div>
              </div>
              <figcaption className="side-work-motion-tile-caption">
                <span className="side-work-bento__tag side-work-bento__tag--motion">Motion graphics</span>
                <span className="side-work-motion-tile-title">I am Programming Language</span>
              </figcaption>
            </figure>

            <div className="side-work-motion-ipl-row__singles">
              {MOTION_GRAPHICS_GIFS.map((file, index) => {
                const title = titleFromGifFilename(file)
                const isGiveMeFish = file === 'GiveMeFish_Li.gif'
                if (isGiveMeFish) {
                  return (
                    <figure
                      key={file}
                      className="side-work-motion-tile side-work-motion-tile--vimeo-trigger side-work-reveal-card"
                      role="button"
                      tabIndex={0}
                      aria-label={`${title} — open full video`}
                      aria-haspopup="dialog"
                      onClick={() => setVimeoModal('giveMeFish')}
                      onKeyDown={(e) => onVimeoCardKeyDown(e, 'giveMeFish')}
                    >
                      <div className="side-work-motion-tile-media">
                        <MotionGifFrame
                          file={file}
                          alt={title}
                          loading={index < 2 ? 'eager' : 'lazy'}
                          decoding="async"
                        />
                      </div>
                      <figcaption className="side-work-motion-tile-caption">
                        <span className="side-work-bento__tag side-work-bento__tag--motion">
                          Motion graphics
                        </span>
                        <span className="side-work-motion-tile-title">{title}</span>
                      </figcaption>
                    </figure>
                  )
                }
                return (
                  <figure key={file} className="side-work-motion-tile side-work-reveal-card">
                    <div className="side-work-motion-tile-media">
                      <MotionGifFrame
                        file={file}
                        alt={title}
                        loading={index < 2 ? 'eager' : 'lazy'}
                        decoding="async"
                      />
                    </div>
                    <figcaption className="side-work-motion-tile-caption">
                      <span className={`side-work-bento__tag side-work-bento__tag--motion`}>
                        Motion graphics
                      </span>
                      <span className="side-work-motion-tile-title">{title}</span>
                    </figcaption>
                  </figure>
                )
              })}
            </div>
          </div>
        </div>

        <div className="side-work-dataviz-card side-work-bento__cell">
          <span className="side-work-bento__tag side-work-bento__tag--dataviz">Data viz</span>
          <div className="side-work-dataviz__title-row">
            <h3 className="side-work-bento__cell-title">{DATA_VIZ_PROGRAMMING_LANG.title}</h3>
            <a
              className="side-work-dataviz__title-link"
              href={DATA_VIZ_PROGRAMMING_LANG.url}
              target="_blank"
              rel="noopener noreferrer"
            >
              Open in new tab
            </a>
          </div>
          <p className="side-work-bento__cell-desc">{DATA_VIZ_PROGRAMMING_LANG.description}</p>
          <div className="side-work-dataviz__frame">
            <iframe
              src={DATA_VIZ_PROGRAMMING_LANG.url}
              title={DATA_VIZ_PROGRAMMING_LANG.iframeTitle}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              allow="fullscreen"
            />
          </div>
        </div>
      </div>
    </article>

    {vimeoOpen &&
      createPortal(
        <div
          className="side-work-vimeo-modal"
          role="dialog"
          aria-modal="true"
          aria-labelledby="side-work-vimeo-modal-heading"
        >
          <button
            type="button"
            className="side-work-vimeo-modal__backdrop"
            aria-label="Close video"
            onClick={() => setVimeoModal(null)}
          />
          <div className="side-work-vimeo-modal__panel">
            <div className="side-work-vimeo-modal__toolbar">
              <h2 id="side-work-vimeo-modal-heading" className="side-work-vimeo-modal__title">
                {vimeoOpen.dialogTitle}
              </h2>
              <a
                className="side-work-vimeo-modal__open-tab"
                href={vimeoOpen.page}
                target="_blank"
                rel="noopener noreferrer"
              >
                Open on Vimeo
              </a>
              <button
                type="button"
                className="side-work-vimeo-modal__close"
                aria-label="Close"
                onClick={() => setVimeoModal(null)}
              >
                ×
              </button>
            </div>
            <div className="side-work-vimeo-modal__embed">
              <iframe
                key={vimeoOpen.embed}
                src={vimeoOpen.embed}
                title={vimeoOpen.iframeTitle}
                allow="autoplay; fullscreen; picture-in-picture"
                allowFullScreen
              />
            </div>
          </div>
        </div>,
        document.body,
      )}
    </>
  )
}
