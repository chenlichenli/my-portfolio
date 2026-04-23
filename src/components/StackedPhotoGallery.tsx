import { useCallback, useLayoutEffect, useRef, useState } from 'react'
import { motion, useAnimationControls, useReducedMotion } from 'framer-motion'
import './StackedPhotoGallery.css'

export type StackedGalleryItem = {
  src: string
  alt: string
  name?: string
}

/** Bottom → middle → top (which photo index sits in each slot). */
export type StackOrder = [number, number, number]

/**
 * Tight fan: back cards sit down-right with a gentle clockwise tilt; top card stays straight.
 * rotate in degrees (Framer); transform-origin on card is low-center so the arc feels natural.
 */
const SLOTS = [
  { x: 28, y: 36, zIndex: 1, rotate: 5 },
  { x: 14, y: 18, zIndex: 5, rotate: 2.5 },
  { x: 0, y: 0, zIndex: 10, rotate: 0 },
] as const

/** Flick out — smooth ease-out (no sharp acceleration spike) */
const EASE_EXIT = [0.25, 0.46, 0.45, 0.94] as const

/** Settle — soft deceleration on x / y / rotate together */
const EASE_SETTLE = [0.33, 1, 0.68, 1] as const

/** Slightly shorter travel so the same duration feels quicker */
const FLY_DISTANCE = 200
const EXIT_DURATION = 0.058
const REORDER_DURATION = 0.115

const CARD_W = 368
const CARD_H = 460
const HALF_W = CARD_W / 2
const HALF_H = CARD_H / 2

function cycleOrder(prev: StackOrder): StackOrder {
  const [bottom, middle, top] = prev
  return [top, bottom, middle]
}

type StackedPhotoGalleryProps = {
  items: readonly StackedGalleryItem[]
  className?: string
  initialOrder?: StackOrder
  withCanvas?: boolean
}

export function StackedPhotoGallery({
  items,
  className = '',
  initialOrder = [1, 2, 0],
  withCanvas = true,
}: StackedPhotoGalleryProps) {
  if (items.length !== 3) {
    throw new Error('StackedPhotoGallery requires exactly three items.')
  }

  const reduceMotion = useReducedMotion()
  const [order, setOrder] = useState<StackOrder>(initialOrder)
  const orderRef = useRef(order)
  orderRef.current = order

  const busyRef = useRef(false)
  const didInitControls = useRef(false)

  const c0 = useAnimationControls()
  const c1 = useAnimationControls()
  const c2 = useAnimationControls()

  const syncXYToOrder = useCallback((ord: StackOrder) => {
    const ctrls = [c0, c1, c2]
    for (let i = 0; i < 3; i++) {
      const slot = ord.indexOf(i)
      const t = SLOTS[slot]
      void ctrls[i].set({ x: t.x, y: t.y, rotate: t.rotate })
    }
  }, [c0, c1, c2])

  useLayoutEffect(() => {
    if (didInitControls.current) return
    didInitControls.current = true
    syncXYToOrder(orderRef.current)
  }, [syncXYToOrder])

  const topPhotoIndex = order[2]

  const runCycle = useCallback(async () => {
    if (busyRef.current) return
    const ord = orderRef.current

    if (reduceMotion) {
      const next = cycleOrder(ord)
      setOrder(next)
      orderRef.current = next
      syncXYToOrder(next)
      return
    }

    busyRef.current = true
    const topPhoto = ord[2]
    const ctrls = [c0, c1, c2]

    try {
      /* Always exit to the left (negative x from top slot) */
      const flyTarget = SLOTS[2].x - FLY_DISTANCE

      await ctrls[topPhoto].start({
        x: flyTarget,
        y: SLOTS[2].y,
        rotate: SLOTS[2].rotate,
        transition: { duration: EXIT_DURATION, ease: EASE_EXIT },
      })

      const next = cycleOrder(ord)
      setOrder(next)
      orderRef.current = next

      await Promise.all(
        [0, 1, 2].map((i) => {
          const slot = next.indexOf(i)
          const t = SLOTS[slot]
          return ctrls[i].start({
            x: t.x,
            y: t.y,
            rotate: t.rotate,
            transition: { duration: REORDER_DURATION, ease: EASE_SETTLE },
          })
        }),
      )
    } finally {
      busyRef.current = false
    }
  }, [c0, c1, c2, reduceMotion, syncXYToOrder])

  const onKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault()
        void runCycle()
      }
    },
    [runCycle],
  )

  const cardControls = [c0, c1, c2]
  const topAlt = items[topPhotoIndex].alt

  const stack = (
    <div
      className={`stacked-gallery ${className}`.trim()}
      role="button"
      tabIndex={0}
      onClick={() => void runCycle()}
      onKeyDown={onKeyDown}
      aria-label={`${topAlt}. Activate to show the next photo.`}
    >
      <div className="stacked-gallery-stage">
        {items.map((item, photoIndex) => {
          const isTop = order[2] === photoIndex
          const slot = order.indexOf(photoIndex)
          const z = SLOTS[slot].zIndex
          return (
            <motion.div
              key={photoIndex}
              className="stacked-gallery-card"
              initial={false}
              animate={cardControls[photoIndex]}
              style={{
                width: CARD_W,
                height: CARD_H,
                marginLeft: -HALF_W,
                marginTop: -HALF_H,
                zIndex: z,
              }}
              aria-hidden={!isTop}
            >
              <img
                src={item.src}
                alt={isTop ? item.alt : ''}
                width={CARD_W}
                height={CARD_H}
                loading={photoIndex === 0 ? 'eager' : 'lazy'}
                decoding="async"
                draggable={false}
              />
            </motion.div>
          )
        })}
      </div>
    </div>
  )

  if (!withCanvas) {
    return stack
  }

  return <div className="stacked-gallery-scene">{stack}</div>
}
