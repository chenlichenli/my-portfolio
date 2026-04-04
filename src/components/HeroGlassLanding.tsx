import type { MotionValue } from 'framer-motion'
import {
  motion,
  useAnimationFrame,
  useMotionValue,
  useSpring,
  useTransform,
  useReducedMotion,
} from 'framer-motion'
import type { ReactNode } from 'react'
import { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react'
import type { AustinWeatherStatus } from '../hooks/useAustinWeather'
import { blobGradientForTempF } from '../hooks/useAustinWeather'
import { HeroLocationWeather } from './HeroLocationWeather'
import { TypingEyebrow } from './TypingEyebrow'

/** Position follow: very soft spring + heavy mass = slow drift, strong lag behind cursor */
const SPRING = { stiffness: 22, damping: 18, mass: 2.65 } as const

/** Slightly snappier for square / triangle so separation reads as a bounce off the circle */
const SPRING_DEFLECT = { stiffness: 40, damping: 21, mass: 1.85 } as const

type BlobShape = 'circle' | 'square' | 'triangle'

type Vec2 = { x: number; y: number }

type BlobOffsets = {
  circle: Vec2
  square: Vec2
  tri: Vec2
}

function shuffleBlobAssignment(pts: [Vec2, Vec2, Vec2]): BlobOffsets {
  const shuffled: Vec2[] = [...pts]
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    const t = shuffled[i]
    shuffled[i] = shuffled[j]!
    shuffled[j] = t!
  }
  return { circle: shuffled[0]!, square: shuffled[1]!, tri: shuffled[2]! }
}

/**
 * Offsets from the cursor so three blobs stay readable: prefer equilateral (120°) ring
 * placement with a strong minimum edge length, then light jitter / radius variation.
 */
function pickThreeOffsets(w: number, h: number): BlobOffsets {
  const m = Math.min(w, h)
  /** Minimum straight-line gap between any two blob centers (~34% of short side) */
  const minEdge = m * 0.34
  const baseR = m * (0.28 + Math.random() * 0.11)
  const jitter = m * 0.028

  const tryEquilateralJittered = (theta0: number): [Vec2, Vec2, Vec2] | null => {
    const pts: Vec2[] = [0, 1, 2].map((i) => {
      const t = theta0 + (i * 2 * Math.PI) / 3
      const r = baseR * (0.88 + Math.random() * 0.24)
      return {
        x: Math.cos(t) * r + (Math.random() - 0.5) * 2 * jitter,
        y: Math.sin(t) * r + (Math.random() - 0.5) * 2 * jitter,
      }
    })
    for (let i = 0; i < 3; i++) {
      for (let j = i + 1; j < 3; j++) {
        if (Math.hypot(pts[i].x - pts[j].x, pts[i].y - pts[j].y) < minEdge) return null
      }
    }
    return [pts[0]!, pts[1]!, pts[2]!]
  }

  for (let k = 0; k < 55; k++) {
    const triplet = tryEquilateralJittered(Math.random() * Math.PI * 2)
    if (triplet) return shuffleBlobAssignment(triplet)
  }

  /** Guaranteed wide triangle: side ≈ r√3 */
  const r = m * 0.33
  const t0 = Math.random() * Math.PI * 2
  const stable: [Vec2, Vec2, Vec2] = [
    { x: Math.cos(t0) * r, y: Math.sin(t0) * r },
    { x: Math.cos(t0 + (2 * Math.PI) / 3) * r, y: Math.sin(t0 + (2 * Math.PI) / 3) * r },
    { x: Math.cos(t0 + (4 * Math.PI) / 3) * r, y: Math.sin(t0 + (4 * Math.PI) / 3) * r },
  ]
  return shuffleBlobAssignment(stable)
}

type Pt = { x: number; y: number }

/** Keep `b` at least `minD` from fixed `a` (circle stays on cursor). */
function pushOutFromFixed(a: Pt, b: Pt, minD: number) {
  let dx = b.x - a.x
  let dy = b.y - a.y
  let d = Math.hypot(dx, dy)
  if (d < 1e-4) {
    dx = 1
    dy = 0
    d = 1
  }
  if (d >= minD) return
  const nx = dx / d
  const ny = dy / d
  b.x = a.x + nx * minD
  b.y = a.y + ny * minD
}

/** Push square / triangle apart equally when they overlap. */
function separatePair(s: Pt, t: Pt, minD: number) {
  let dx = t.x - s.x
  let dy = t.y - s.y
  let d = Math.hypot(dx, dy)
  if (d < 1e-4) {
    dx = 0.70710678
    dy = 0.70710678
    d = 1
  }
  if (d >= minD) return
  const nx = dx / d
  const ny = dy / d
  const c = (minD - d) / 2
  s.x -= nx * c
  s.y -= ny * c
  t.x += nx * c
  t.y += ny * c
}

const COLLISION_ITERS = 10

/** Space left under the hero so “Selected Works” / stat peek above the fold */
/** Viewport minus sticky header and footer band so the glass section + site footer fit without page scroll. */
export const HERO_MIN_H =
  'min-h-[calc(100svh-var(--site-header-height)-clamp(6.5rem,13.5vh,10.25rem))]'

/** Public asset: `public/glass effect.png` — frosted texture above blur, below copy (z-[1] stack order). */
const HERO_GLASS_TEXTURE_URL = encodeURI('/glass effect.png')

/** Triangle blob: fixed accent blue */
const HERO_TRIANGLE_FILL = '#5271FF'

/** Square blob: fixed orange */
const HERO_SQUARE_FILL = '#F69C04'

export type HeroGlassLandingProps = {
  tempF: number | null
  weatherCode: number | null
  weatherStatus: AustinWeatherStatus
}

export type HeroGlassSceneProps = HeroGlassLandingProps & {
  children: ReactNode
  /** Section layout classes (Tailwind). Landing uses `HERO_MIN_H`; About uses `flex-1` to fill `main` under header. */
  sectionMinClass: string
  /** Inner column: z-index, max-width, padding, flex (landing centers copy vertically). */
  contentClassName: string
  /** Austin location + local time chip (Design hero only). */
  showLocationWeather?: boolean
}

/**
 * Full landing visual stack: pointer-driven jelly blobs, collision separation, frosted blur + texture,
 * Austin weather chip. Reused by the Design hero and About so behavior matches exactly.
 */
export function HeroGlassScene({
  tempF,
  weatherCode,
  weatherStatus,
  children,
  sectionMinClass,
  contentClassName,
  showLocationWeather = true,
}: HeroGlassSceneProps) {
  const reduceMotion = useReducedMotion()
  const blobGradient = useMemo(
    () => blobGradientForTempF(weatherStatus === 'ready' ? tempF : null),
    [weatherStatus, tempF],
  )

  const sectionRef = useRef<HTMLElement>(null)
  const [bubbleSize, setBubbleSize] = useState(400)
  const [blobOffsets, setBlobOffsets] = useState<BlobOffsets | null>(null)
  const offsetsInitializedRef = useRef(false)

  const { squareSize, triW, triH } = useMemo(() => {
    const sq = Math.min(Math.max(Math.round(bubbleSize * 0.48), 104), 300)
    const tw = Math.min(Math.max(Math.round(bubbleSize * 0.78), 168), 460)
    const th = Math.round(tw * 0.866)
    return { squareSize: sq, triW: tw, triH: th }
  }, [bubbleSize])

  const mouseX = useMotionValue(0)
  const mouseY = useMotionValue(0)
  const centerX = useMotionValue(0)
  const centerY = useMotionValue(0)
  /** After collision pass; springs in MotionHeroBlob smooth = soft bounce away from overlaps */
  const squareOutX = useMotionValue(0)
  const squareOutY = useMotionValue(0)
  const triOutX = useMotionValue(0)
  const triOutY = useMotionValue(0)
  const rawStretch = useMotionValue(0)
  const angleTarget = useMotionValue(0)

  const lastRef = useRef({ x: 0, y: 0, t: 0 })
  const idleRef = useRef<ReturnType<typeof setTimeout>>(undefined)

  useEffect(() => {
    return () => {
      if (idleRef.current !== undefined) {
        clearTimeout(idleRef.current)
        idleRef.current = undefined
      }
    }
  }, [])

  useLayoutEffect(() => {
    const el = sectionRef.current
    if (!el) return

    const measure = () => {
      const w = el.clientWidth
      const h = el.clientHeight
      const side = Math.min(w, h)
      setBubbleSize(Math.min(Math.round(side * 0.78), 580))

      centerX.set(w / 2)
      centerY.set(h / 2)

      if (!offsetsInitializedRef.current && w > 48 && h > 48) {
        offsetsInitializedRef.current = true
        setBlobOffsets(pickThreeOffsets(w, h))
      }
    }

    measure()
    const ro = new ResizeObserver(measure)
    ro.observe(el)
    return () => ro.disconnect()
  }, [])

  useLayoutEffect(() => {
    const el = sectionRef.current
    if (!el) return
    const w = el.clientWidth
    const h = el.clientHeight
    const cx = w / 2
    const cy = h / 2
    mouseX.set(cx)
    mouseY.set(cy)
    lastRef.current = { x: cx, y: cy, t: performance.now() }
    rawStretch.set(0)
    // Avoid a frame at (0,0); separation frame will push apart from ideal-overlap at center
    squareOutX.set(cx)
    squareOutY.set(cy)
    triOutX.set(cx)
    triOutY.set(cy)
  }, [mouseX, mouseY, bubbleSize, rawStretch, squareOutX, squareOutY, triOutX, triOutY])

  const onPointerMove = useCallback(
    (e: React.PointerEvent<HTMLElement>) => {
      if (reduceMotion) return
      const el = sectionRef.current
      if (!el) return
      const rect = el.getBoundingClientRect()
      const x = e.clientX - rect.left
      const y = e.clientY - rect.top
      const now = performance.now()
      const dt = Math.max(now - lastRef.current.t, 12)
      const dx = x - lastRef.current.x
      const dy = y - lastRef.current.y
      const vx = (dx / dt) * 12
      const vy = (dy / dt) * 12
      const speed = Math.hypot(vx, vy)

      lastRef.current = { x, y, t: now }
      mouseX.set(x)
      mouseY.set(y)

      if (speed > 1.4) {
        rawStretch.set(Math.min(speed / 280, 1))
        angleTarget.set(Math.atan2(vy, vx))
      }

      if (idleRef.current !== undefined) clearTimeout(idleRef.current)
      idleRef.current = setTimeout(() => {
        idleRef.current = undefined
        rawStretch.set(0)
      }, 320)
    },
    [reduceMotion, mouseX, mouseY, rawStretch, angleTarget],
  )

  const onPointerLeave = useCallback(() => {
    rawStretch.set(0)
    if (idleRef.current !== undefined) {
      clearTimeout(idleRef.current)
      idleRef.current = undefined
    }
  }, [rawStretch])

  const onSeparationFrame = useCallback(() => {
    if (reduceMotion) return

    const mx = mouseX.get()
    const my = mouseY.get()
    const cx = centerX.get()
    const cy = centerY.get()

    const circle: Pt = { x: mx, y: my }
    let square: Pt = { x: 2 * cx - mx, y: 2 * cy - my }
    let tri: Pt = { x: cx + (my - cy), y: cy - (mx - cx) }

    const rC = bubbleSize * 0.5
    const rS = (squareSize * Math.SQRT2) / 2
    const rT = Math.max(triW, triH) * 0.48
    const gap = Math.max(18, Math.min(bubbleSize, squareSize, triW) * 0.055)

    const minCS = rC + rS + gap
    const minCT = rC + rT + gap
    const minST = rS + rT + gap

    for (let i = 0; i < COLLISION_ITERS; i++) {
      pushOutFromFixed(circle, square, minCS)
      pushOutFromFixed(circle, tri, minCT)
      separatePair(square, tri, minST)
    }

    squareOutX.set(square.x)
    squareOutY.set(square.y)
    triOutX.set(tri.x)
    triOutY.set(tri.y)
  }, [
    reduceMotion,
    mouseX,
    mouseY,
    centerX,
    centerY,
    bubbleSize,
    squareSize,
    triW,
    triH,
    squareOutX,
    squareOutY,
    triOutX,
    triOutY,
  ])

  useAnimationFrame(onSeparationFrame)

  const circleTargetX = mouseX
  const circleTargetY = mouseY

  return (
    <section
      ref={sectionRef}
      onPointerMove={onPointerMove}
      onPointerLeave={onPointerLeave}
      className={`relative ml-[calc(50%-50vw)] mr-[calc(50%-50vw)] w-screen ${sectionMinClass} overflow-hidden bg-[#f4f1ee] selection:bg-[#5271FF]/25`}
    >
      <div className="absolute inset-0">
        {reduceMotion ? (
          blobOffsets ? (
            <>
              <StaticHeroBlob
                shape="triangle"
                width={triW}
                height={triH}
                gradient={HERO_TRIANGLE_FILL}
                offsetX={blobOffsets.tri.x}
                offsetY={blobOffsets.tri.y}
              />
              <StaticHeroBlob
                shape="square"
                width={squareSize}
                height={squareSize}
                gradient={HERO_SQUARE_FILL}
                offsetX={blobOffsets.square.x}
                offsetY={blobOffsets.square.y}
              />
              <StaticHeroBlob
                shape="circle"
                width={bubbleSize}
                height={bubbleSize}
                gradient={blobGradient}
                offsetX={blobOffsets.circle.x}
                offsetY={blobOffsets.circle.y}
              />
            </>
          ) : null
        ) : (
          <>
            <MotionHeroBlob
              shape="triangle"
              mouseX={triOutX}
              mouseY={triOutY}
              width={triW}
              height={triH}
              rawStretch={rawStretch}
              angleTarget={angleTarget}
              stiffness={SPRING_DEFLECT.stiffness}
              damping={SPRING_DEFLECT.damping}
              mass={SPRING_DEFLECT.mass}
              gradient={HERO_TRIANGLE_FILL}
              jelly
            />
            <MotionHeroBlob
              shape="square"
              mouseX={squareOutX}
              mouseY={squareOutY}
              width={squareSize}
              height={squareSize}
              rawStretch={rawStretch}
              angleTarget={angleTarget}
              stiffness={SPRING_DEFLECT.stiffness}
              damping={SPRING_DEFLECT.damping}
              mass={SPRING_DEFLECT.mass}
              gradient={HERO_SQUARE_FILL}
              jelly
            />
            <MotionHeroBlob
              shape="circle"
              mouseX={circleTargetX}
              mouseY={circleTargetY}
              width={bubbleSize}
              height={bubbleSize}
              rawStretch={rawStretch}
              angleTarget={angleTarget}
              stiffness={SPRING.stiffness}
              damping={SPRING.damping}
              mass={SPRING.mass}
              gradient={blobGradient}
              jelly
            />
          </>
        )}
      </div>

      <div
        className="pointer-events-none absolute inset-0 z-[1] bg-[#f4f1ee]/[0.06] backdrop-blur-[50px] [-webkit-backdrop-filter:blur(50px)]"
        aria-hidden
      />

      <div
        className="pointer-events-none absolute inset-0 z-[1] bg-cover bg-center bg-no-repeat mix-blend-soft-light opacity-80 [filter:saturate(1.02)]"
        style={{ backgroundImage: `url(${HERO_GLASS_TEXTURE_URL})` }}
        aria-hidden
      />

      <div className={contentClassName}>{children}</div>

      {showLocationWeather ? (
        <div className="pointer-events-none absolute bottom-6 right-6 z-[2] max-w-[min(calc(100vw-3rem),26rem)] sm:bottom-8 md:bottom-10 md:right-10">
          <div className="pointer-events-auto text-right">
            <HeroLocationWeather
              className="mt-0 max-w-full text-right"
              tempF={tempF}
              weatherCode={weatherCode}
              status={weatherStatus}
            />
          </div>
        </div>
      ) : null}
    </section>
  )
}

export function HeroGlassLanding({ tempF, weatherCode, weatherStatus }: HeroGlassLandingProps) {
  return (
    <HeroGlassScene
      tempF={tempF}
      weatherCode={weatherCode}
      weatherStatus={weatherStatus}
      sectionMinClass={HERO_MIN_H}
      contentClassName={`relative z-[2] mx-auto flex w-full max-w-[1120px] ${HERO_MIN_H} flex-col items-start justify-center px-6 py-20 md:px-10 -translate-y-14 md:-translate-y-24`}
    >
      <div className="mb-8 sm:mb-10">
        <TypingEyebrow />
      </div>
      <h1 className="max-w-[24ch] text-left text-[clamp(2.1rem,5.9vw,3.85rem)] font-medium leading-[1.06] tracking-[-0.03em] text-[#1a1816]">
        Hi, I&apos;m Li! 👋
      </h1>
      <p className="mt-6 max-w-md text-left text-[1.0625rem] font-normal leading-[1.65] text-[#5c5650] md:max-w-xl md:text-[1.1875rem]">
        A product designer focused on building intuitive tools for complex systems — from generative AI
        to healthcare platforms.
      </p>
    </HeroGlassScene>
  )
}

type MotionHeroBlobProps = {
  shape: BlobShape
  mouseX: MotionValue<number>
  mouseY: MotionValue<number>
  width: number
  height: number
  rawStretch: MotionValue<number>
  angleTarget: MotionValue<number>
  stiffness: number
  damping: number
  mass: number
  gradient: string
  jelly: boolean
}

function MotionHeroBlob({
  shape,
  mouseX,
  mouseY,
  width,
  height,
  rawStretch,
  angleTarget,
  stiffness,
  damping,
  mass,
  gradient,
  jelly,
}: MotionHeroBlobProps) {
  const sx = useSpring(mouseX, { stiffness, damping, mass })
  const sy = useSpring(mouseY, { stiffness, damping, mass })

  /** Softer springs = stretch / rotation / snap-back all ease over a longer time */
  const smoothStretch = useSpring(rawStretch, { stiffness: 88, damping: 26, mass: 1.05 })
  const smoothAngle = useSpring(angleTarget, { stiffness: 58, damping: 20, mass: 0.92 })

  const x = useTransform(sx, (v) => v - width / 2)
  const y = useTransform(sy, (v) => v - height / 2)

  const scaleX = useTransform(smoothStretch, [0, 1], jelly ? [1, 2.75] : [1, 1])
  const scaleY = useTransform(smoothStretch, [0, 1], jelly ? [1, 0.28] : [1, 1])
  const skewX = useTransform(smoothStretch, [0, 1], jelly ? [0, 14] : [0, 0])
  const rotate = useTransform(smoothAngle, (r) => (jelly ? (r * 180) / Math.PI : 0))

  const shapeStyle: React.CSSProperties =
    shape === 'circle'
      ? { borderRadius: '50%' }
      : shape === 'square'
        ? { borderRadius: 'clamp(2px, 1.2vw, 10px)' }
        : { clipPath: 'polygon(50% 0%, 0% 100%, 100% 100%)' }

  return (
    <motion.div
      className="pointer-events-none absolute left-0 top-0 will-change-transform"
      style={{
        width,
        height,
        minWidth: width,
        minHeight: height,
        background: gradient,
        transformOrigin: 'center center',
        ...shapeStyle,
        x,
        y,
        rotate,
        skewX,
        scaleX,
        scaleY,
      }}
    />
  )
}

function StaticHeroBlob({
  shape,
  width,
  height,
  gradient,
  offsetX,
  offsetY,
}: {
  shape: BlobShape
  width: number
  height: number
  gradient: string
  offsetX: number
  offsetY: number
}) {
  const shapeStyle: React.CSSProperties =
    shape === 'circle'
      ? { borderRadius: '50%' }
      : shape === 'square'
        ? { borderRadius: 'clamp(2px, 1.2vw, 10px)' }
        : { clipPath: 'polygon(50% 0%, 0% 100%, 100% 100%)' }

  return (
    <div
      className="pointer-events-none absolute will-change-transform"
      style={{
        left: `calc(50% + ${offsetX}px)`,
        top: `calc(50% + ${offsetY}px)`,
        width,
        height,
        minWidth: width,
        minHeight: height,
        background: gradient,
        transform: 'translate(-50%, -50%)',
        ...shapeStyle,
      }}
    />
  )
}
