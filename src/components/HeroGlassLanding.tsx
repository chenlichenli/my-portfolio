import type { MotionValue } from 'framer-motion'
import { motion, useMotionValue, useSpring, useTransform, useReducedMotion } from 'framer-motion'
import { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react'
import type { AustinWeatherStatus } from '../hooks/useAustinWeather'
import { blobGradientForTempF } from '../hooks/useAustinWeather'
import { HeroLocationWeather } from './HeroLocationWeather'
import { TypingEyebrow } from './TypingEyebrow'

/** Position follow: very soft spring + heavy mass = slow drift, strong lag behind cursor */
const SPRING = { stiffness: 22, damping: 18, mass: 2.65 } as const

/** Space left under the hero so “Selected Works” / stat peek above the fold */
const HERO_MIN_H =
  'min-h-[calc(100svh-var(--site-header-height)-clamp(6.5rem,13.5vh,10.25rem))]'

export type HeroGlassLandingProps = {
  tempF: number | null
  weatherCode: number | null
  weatherStatus: AustinWeatherStatus
}

export function HeroGlassLanding({ tempF, weatherCode, weatherStatus }: HeroGlassLandingProps) {
  const reduceMotion = useReducedMotion()
  const blobGradient = useMemo(
    () => blobGradientForTempF(weatherStatus === 'ready' ? tempF : null),
    [weatherStatus, tempF],
  )

  const sectionRef = useRef<HTMLElement>(null)
  const [bubbleSize, setBubbleSize] = useState(400)

  const mouseX = useMotionValue(0)
  const mouseY = useMotionValue(0)
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
    }

    measure()
    const ro = new ResizeObserver(measure)
    ro.observe(el)
    return () => ro.disconnect()
  }, [])

  useLayoutEffect(() => {
    const el = sectionRef.current
    if (!el) return
    const rect = el.getBoundingClientRect()
    const cx = rect.width / 2
    const cy = rect.height / 2
    mouseX.set(cx)
    mouseY.set(cy)
    lastRef.current = { x: cx, y: cy, t: performance.now() }
    rawStretch.set(0)
  }, [mouseX, mouseY, bubbleSize, rawStretch])

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

  return (
    <section
      ref={sectionRef}
      onPointerMove={onPointerMove}
      onPointerLeave={onPointerLeave}
      className={`relative ml-[calc(50%-50vw)] mr-[calc(50%-50vw)] w-screen ${HERO_MIN_H} overflow-hidden bg-[#f4f1ee] selection:bg-[#5271FF]/25`}
    >
      <div className="absolute inset-0">
        {reduceMotion ? (
          <StaticBlob size={bubbleSize} gradient={blobGradient} />
        ) : (
          <MotionBlob
            mouseX={mouseX}
            mouseY={mouseY}
            rawStretch={rawStretch}
            angleTarget={angleTarget}
            size={bubbleSize}
            stiffness={SPRING.stiffness}
            damping={SPRING.damping}
            mass={SPRING.mass}
            gradient={blobGradient}
          />
        )}
      </div>

      <div
        className="pointer-events-none absolute inset-0 z-[1] bg-[#f4f1ee]/[0.06] backdrop-blur-[50px] [-webkit-backdrop-filter:blur(50px)]"
        aria-hidden
      />

      <div
        className={`relative z-[2] mx-auto flex w-full max-w-[1120px] ${HERO_MIN_H} flex-col items-start justify-center px-6 py-20 md:px-10 -translate-y-14 md:-translate-y-24`}
      >
        <div className="mb-8 sm:mb-10">
          <TypingEyebrow />
        </div>
        <h1 className="max-w-[22ch] text-left text-[clamp(1.85rem,5.2vw,3.35rem)] font-medium leading-[1.06] tracking-[-0.03em] text-[#1a1816]">
          Hi, I&apos;m Li! 👋
        </h1>
        <p className="mt-6 max-w-md text-left text-[0.9375rem] font-normal leading-[1.65] text-[#5c5650] md:max-w-lg md:text-[1.0625rem]">
          A product designer focused on building intuitive tools for complex systems — from
          generative AI to healthcare platforms.
        </p>
      </div>

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
    </section>
  )
}

type MotionBlobProps = {
  mouseX: MotionValue<number>
  mouseY: MotionValue<number>
  rawStretch: MotionValue<number>
  angleTarget: MotionValue<number>
  size: number
  stiffness: number
  damping: number
  mass: number
  gradient: string
}

function MotionBlob({
  mouseX,
  mouseY,
  rawStretch,
  angleTarget,
  size,
  stiffness,
  damping,
  mass,
  gradient,
}: MotionBlobProps) {
  const sx = useSpring(mouseX, { stiffness, damping, mass })
  const sy = useSpring(mouseY, { stiffness, damping, mass })

  /** Softer springs = stretch / rotation / snap-back all ease over a longer time */
  const smoothStretch = useSpring(rawStretch, { stiffness: 88, damping: 26, mass: 1.05 })
  const smoothAngle = useSpring(angleTarget, { stiffness: 58, damping: 20, mass: 0.92 })

  const x = useTransform(sx, (v) => v - size / 2)
  const y = useTransform(sy, (v) => v - size / 2)

  const scaleX = useTransform(smoothStretch, [0, 1], [1, 2.75])
  const scaleY = useTransform(smoothStretch, [0, 1], [1, 0.28])
  const skewX = useTransform(smoothStretch, [0, 1], [0, 14])
  const rotate = useTransform(smoothAngle, (r) => (r * 180) / Math.PI)

  return (
    <motion.div
      className="absolute left-0 top-0 aspect-square rounded-full will-change-transform"
      style={{
        width: size,
        height: size,
        minWidth: size,
        minHeight: size,
        background: gradient,
        transformOrigin: 'center center',
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

function StaticBlob({ size, gradient }: { size: number; gradient: string }) {
  return (
    <div
      className="pointer-events-none absolute left-1/2 top-1/2 aspect-square rounded-full"
      style={{
        width: size,
        height: size,
        minWidth: size,
        minHeight: size,
        background: gradient,
        transform: 'translate(-50%, -50%)',
      }}
    />
  )
}
