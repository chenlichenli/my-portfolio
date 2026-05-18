import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react'
import type { DesktopPetConfig, PetBehaviorId } from './petConfigs'
import {
  DRAG_CLICK_THRESHOLD,
  SPRITE_PX,
  behaviorDef,
  petDisplaySize,
  petSpriteSrc,
  preloadPetSprites,
} from './petConfigs'
import { useDesktopPets } from './DesktopPetsContext'
import { directionAwayFrom, type PetAabb } from './petCollision'
import './DesktopPet.css'

const WALK_SPEED = 2

function pickDirection(): -1 | 1 {
  return Math.random() < 0.5 ? -1 : 1
}

function initialXForRatio(ratio: number, petSize: number): number {
  return Math.max(0, Math.min(window.innerWidth - petSize, ratio * window.innerWidth - petSize / 2))
}

type DesktopPetActorProps = {
  config: DesktopPetConfig
  ariaLabel: string
}

const NALA_EDGE_HIDE_COOLDOWN_MS = 3500
const NALA_JUMP_COLLISION_MS = 2400
const VINNY_WALK_COLLISION_MS = 2000
const LAND_FALL_SPEED = 8
const LAND_GROUND_CYCLES = 2
const LAND_GROUND_EPS = 2

export function DesktopPetActor({ config, ariaLabel }: DesktopPetActorProps) {
  const { register, resolvePosition } = useDesktopPets()
  const basePetSize = petDisplaySize(config.petScale)
  const displaySizeRef = useRef(basePetSize)
  const petRef = useRef<HTMLDivElement>(null)
  const behaviorRef = useRef<PetBehaviorId>('walk')
  const timeoutRef = useRef(0)
  const isDraggingRef = useRef(false)
  const dragMovedRef = useRef(false)
  const dragOffsetRef = useRef({ x: 0, yFromBottom: 0 })
  const dragStartRef = useRef({ x: 0, y: 0 })
  const behaviorBeforeDragRef = useRef<PetBehaviorId>('walk')
  const directionRef = useRef<-1 | 1>(1)
  const collisionCooldownUntilRef = useRef(0)
  const edgeHideCooldownUntilRef = useRef(0)
  const landGroundCyclesRef = useRef(0)
  const frameRef = useRef(1)
  const spriteRef = useRef<HTMLImageElement>(null)
  const [behavior, setBehavior] = useState<PetBehaviorId>('walk')
  const [direction, setDirection] = useState<-1 | 1>(1)
  const [isDragging, setIsDragging] = useState(false)

  const applyFrame = useCallback(
    (frame: number, behaviorId: PetBehaviorId = behaviorRef.current) => {
      frameRef.current = frame
      const img = spriteRef.current
      if (img) img.src = petSpriteSrc(config, behaviorId, frame)
    },
    [config],
  )
  const displaySize = Math.round(basePetSize * (config.behaviorDisplayScale?.[behavior] ?? 1))
  const initialX = initialXForRatio(config.initialXRatio, basePetSize)

  useEffect(() => {
    displaySizeRef.current = displaySize
  }, [displaySize])
  const floorBottom = config.bottomOffset
  const [x, setX] = useState(initialX)
  const [bottom, setBottom] = useState(floorBottom)
  const xRef = useRef(initialX)
  const bottomRef = useRef(floorBottom)

  const clampPosition = useCallback((left: number, bottomPos: number) => {
    const size = displaySizeRef.current
    const el = petRef.current
    if (!el) {
      const maxX = Math.max(0, window.innerWidth - size)
      const maxBottom = Math.max(0, window.innerHeight - size)
      return {
        x: Math.max(0, Math.min(left, maxX)),
        bottom: Math.max(0, Math.min(bottomPos, maxBottom)),
      }
    }

    const rect = el.getBoundingClientRect()
    const style = getComputedStyle(el)
    const currentLeft = Number.parseFloat(style.left) || 0
    const currentBottom = Number.parseFloat(style.bottom) || 0
    const deltaLeft = left - currentLeft
    const deltaBottom = bottomPos - currentBottom

    let nextLeft = left
    let nextBottom = bottomPos
    const predicted = {
      left: rect.left + deltaLeft,
      right: rect.right + deltaLeft,
      top: rect.top - deltaBottom,
      bottom: rect.bottom - deltaBottom,
    }

    if (predicted.left < 0) nextLeft -= predicted.left
    if (predicted.right > window.innerWidth) {
      nextLeft -= predicted.right - window.innerWidth
    }
    if (predicted.top < 0) nextBottom += predicted.top
    if (predicted.bottom > window.innerHeight) {
      nextBottom -= predicted.bottom - window.innerHeight
    }

    return {
      x: Math.max(0, nextLeft),
      bottom: Math.max(0, nextBottom),
    }
  }, [])

  const enforceBounds = useCallback(() => {
    const el = petRef.current
    if (!el) return

    const rect = el.getBoundingClientRect()
    let dx = 0
    let dBottom = 0

    if (rect.left < 0) dx = -rect.left
    if (rect.right > window.innerWidth) dx = window.innerWidth - rect.right
    if (rect.top < 0) dBottom = rect.top
    if (rect.bottom > window.innerHeight) {
      dBottom = -(rect.bottom - window.innerHeight)
    }

    if (dx !== 0) setX((v) => v + dx)
    if (dBottom !== 0) setBottom((v) => v + dBottom)
  }, [])

  const clearSchedule = useCallback(() => {
    window.clearTimeout(timeoutRef.current)
  }, [])

  useEffect(() => {
    directionRef.current = direction
  }, [direction])

  useEffect(() => {
    return register({
      id: config.id,
      petSize: basePetSize,
      getPetSize: () => displaySizeRef.current,
      xRef,
      bottomRef,
    })
  }, [register, config.id, basePetSize])

  const scheduleNext = useCallback(() => {
    clearSchedule()
    const current = behaviorRef.current
    timeoutRef.current = window.setTimeout(() => {
      const next = config.pickNext()
      behaviorRef.current = next
      setBehavior(next)
      applyFrame(1)
      if (
        config.locomotion.includes(next) &&
        (!config.locomotion.includes(current) || next === 'jump')
      ) {
        setDirection(pickDirection())
      }
      scheduleNext()
    }, config.stateDuration(current))
  }, [clearSchedule, config, applyFrame])

  const triggerHideAtEdge = useCallback(() => {
    if (!config.hideAtViewportEdge || !config.behaviors.hide) return
    const now = Date.now()
    if (now < edgeHideCooldownUntilRef.current) return
    edgeHideCooldownUntilRef.current = now + NALA_EDGE_HIDE_COOLDOWN_MS

    clearSchedule()
    behaviorRef.current = 'hide'
    setBehavior('hide')
    applyFrame(1)
    scheduleNext()
  }, [config, clearSchedule, scheduleNext])

  const triggerJumpAwayFrom = useCallback(
    (other: PetAabb) => {
      if (config.id !== 'nala' || !config.behaviors.jump) return
      const now = Date.now()
      if (now < collisionCooldownUntilRef.current) return
      collisionCooldownUntilRef.current = now + NALA_JUMP_COLLISION_MS

      const away = directionAwayFrom(
        { x: xRef.current, bottom: bottomRef.current, petSize: displaySizeRef.current },
        other,
      )
      directionRef.current = away
      setDirection(away)

      clearSchedule()
      behaviorRef.current = 'jump'
      setBehavior('jump')
      applyFrame(1)
      scheduleNext()
    },
    [config, clearSchedule, scheduleNext],
  )

  const triggerWalkAwayFrom = useCallback(
    (other: PetAabb) => {
      if (config.id !== 'vinny' || !config.behaviors.walk) return
      const now = Date.now()
      if (now < collisionCooldownUntilRef.current) return
      collisionCooldownUntilRef.current = now + VINNY_WALK_COLLISION_MS

      const away = directionAwayFrom(
        { x: xRef.current, bottom: bottomRef.current, petSize: displaySizeRef.current },
        other,
      )
      directionRef.current = away
      setDirection(away)

      clearSchedule()
      behaviorRef.current = 'walk'
      setBehavior('walk')
      applyFrame(1)
      scheduleNext()
    },
    [config, clearSchedule, scheduleNext],
  )

  const handlePeerContact = useCallback(
    (otherId: string, other: PetAabb): boolean => {
      if (
        config.passThroughPeerId === otherId &&
        config.passThroughChance != null &&
        Math.random() < config.passThroughChance
      ) {
        return false
      }
      if (config.id === 'nala' && otherId === 'vinny') {
        triggerJumpAwayFrom(other)
        return true
      }
      if (config.id === 'vinny' && otherId === 'nala') {
        triggerWalkAwayFrom(other)
      }
      return true
    },
    [config, triggerJumpAwayFrom, triggerWalkAwayFrom],
  )

  const commitPosition = useCallback(
    (nextX: number, nextBottom: number) => {
      const clamped = clampPosition(nextX, nextBottom)
      const resolved = resolvePosition(
        config.id,
        { x: clamped.x, bottom: clamped.bottom, petSize: displaySizeRef.current },
        handlePeerContact,
      )
      const final = clampPosition(resolved.x, resolved.bottom)
      xRef.current = final.x
      bottomRef.current = final.bottom
      setX(final.x)
      setBottom(final.bottom)
    },
    [clampPosition, resolvePosition, config.id, handlePeerContact],
  )

  /** Autonomous movement — window bottom is the ground. */
  const applyFloorPosition = useCallback(
    (nextX: number) => {
      commitPosition(nextX, floorBottom)
    },
    [commitPosition, floorBottom],
  )

  /** Drag / pickup — free placement in the viewport. */
  const applyFreePosition = useCallback(
    (nextX: number, nextBottom: number) => {
      commitPosition(nextX, nextBottom)
    },
    [commitPosition],
  )

  const triggerRolling = useCallback(() => {
    if (!config.behaviors.rolling) return
    clearSchedule()
    behaviorRef.current = 'rolling'
    setBehavior('rolling')
    applyFrame(1)
    scheduleNext()
  }, [clearSchedule, scheduleNext, config])

  const triggerAnnoyed = useCallback(() => {
    if (!config.behaviors.annoyed) return
    clearSchedule()
    behaviorRef.current = 'annoyed'
    setBehavior('annoyed')
    applyFrame(1)
    scheduleNext()
  }, [clearSchedule, scheduleNext, config])

  const triggerClickBehavior = useCallback(() => {
    if (config.onClick === 'rolling') triggerRolling()
    else if (config.onClick === 'annoyed') triggerAnnoyed()
  }, [config.onClick, triggerRolling, triggerAnnoyed])

  const enterPickup = useCallback(() => {
    if (behaviorRef.current === 'pickup') return
    behaviorBeforeDragRef.current = behaviorRef.current
    clearSchedule()
    behaviorRef.current = 'pickup'
    setBehavior('pickup')
    applyFrame(1, 'pickup')
  }, [clearSchedule, applyFrame])

  const exitPickup = useCallback(() => {
    if (behaviorRef.current !== 'pickup') return
    const restored = behaviorBeforeDragRef.current
    behaviorRef.current = restored
    setBehavior(restored)
    applyFrame(1)
    scheduleNext()
  }, [scheduleNext, applyFrame])

  useEffect(() => {
    applyFrame(frameRef.current, behavior)
  }, [behavior, applyFrame])

  const isAirborne = useCallback(
    () => bottomRef.current > floorBottom + LAND_GROUND_EPS,
    [floorBottom],
  )

  const finishLand = useCallback(() => {
    behaviorRef.current = 'walk'
    setBehavior('walk')
    applyFrame(1)
    applyFloorPosition(xRef.current)
    scheduleNext()
  }, [scheduleNext, applyFloorPosition, applyFrame])

  const enterLand = useCallback(() => {
    const landDef = config.behaviors.land
    if (!landDef) return
    clearSchedule()
    landGroundCyclesRef.current = 0
    behaviorRef.current = 'land'
    setBehavior('land')
    const airFrame = landDef.landAirHoldFrame ?? 4
    const groundStart = landDef.landGroundStartFrame ?? 5
    applyFrame(isAirborne() ? airFrame : groundStart)
  }, [config, clearSchedule, isAirborne, applyFrame])

  const handlePointerDown = useCallback((e: React.PointerEvent<HTMLDivElement>) => {
    if (e.button !== 0 || !petRef.current) return

    behaviorBeforeDragRef.current = behaviorRef.current
    const rect = petRef.current.getBoundingClientRect()
    dragOffsetRef.current = {
      x: e.clientX - rect.left,
      yFromBottom: rect.bottom - e.clientY,
    }
    dragStartRef.current = { x: e.clientX, y: e.clientY }
    dragMovedRef.current = false
    isDraggingRef.current = true
    setIsDragging(true)
    petRef.current.setPointerCapture(e.pointerId)
  }, [])

  const handlePointerMove = useCallback(
    (e: React.PointerEvent<HTMLDivElement>) => {
      if (!isDraggingRef.current) return

      const dx = e.clientX - dragStartRef.current.x
      const dy = e.clientY - dragStartRef.current.y
      if (Math.hypot(dx, dy) > DRAG_CLICK_THRESHOLD) {
        if (!dragMovedRef.current) {
          dragMovedRef.current = true
          enterPickup()
        }
      }

      applyFreePosition(
        e.clientX - dragOffsetRef.current.x,
        window.innerHeight - e.clientY - dragOffsetRef.current.yFromBottom,
      )
    },
    [applyFreePosition, enterPickup],
  )

  const handlePointerUp = useCallback(
    (e: React.PointerEvent<HTMLDivElement>) => {
      if (!isDraggingRef.current) return

      const wasDrag = dragMovedRef.current
      isDraggingRef.current = false
      setIsDragging(false)
      petRef.current?.releasePointerCapture(e.pointerId)

      if (wasDrag) {
        applyFreePosition(xRef.current, bottomRef.current)
        if (config.landOnDragRelease && config.behaviors.land) {
          enterLand()
        } else {
          exitPickup()
        }
      }
    },
    [exitPickup, enterLand, applyFreePosition, config.landOnDragRelease, config.behaviors.land],
  )

  const handleClick = useCallback(() => {
    if (dragMovedRef.current) return
    triggerClickBehavior()
  }, [triggerClickBehavior])

  useEffect(() => {
    const onResize = () => enforceBounds()
    window.addEventListener('resize', onResize)
    return () => window.removeEventListener('resize', onResize)
  }, [enforceBounds])

  useEffect(() => {
    xRef.current = x
    bottomRef.current = bottom
  }, [x, bottom])

  useLayoutEffect(() => {
    enforceBounds()
  }, [x, bottom, behavior, direction, displaySize, enforceBounds])

  useEffect(() => {
    behaviorRef.current = behavior
  }, [behavior])

  useEffect(() => {
    scheduleNext()
    return clearSchedule
  }, [scheduleNext, clearSchedule])

  const didInitialSeparateRef = useRef(false)
  useLayoutEffect(() => {
    if (didInitialSeparateRef.current) return
    didInitialSeparateRef.current = true
    applyFloorPosition(xRef.current)
  }, [applyFloorPosition])

  useEffect(() => {
    preloadPetSprites(config)
  }, [config])

  useEffect(() => {
    if (behavior !== 'land') return undefined

    const landDef = config.behaviors.land
    if (!landDef) return undefined

    const airFrame = landDef.landAirHoldFrame ?? 4
    const groundStart = landDef.landGroundStartFrame ?? 5
    const groundCycles = landDef.landGroundCycles ?? LAND_GROUND_CYCLES
    let finishQueued = false

    const frameId = window.setInterval(() => {
      if (!isAirborne()) {
        const prev = frameRef.current
        let next = prev < groundStart ? groundStart : prev + 1
        if (next > landDef.frameCount) {
          landGroundCyclesRef.current += 1
          if (landGroundCyclesRef.current >= groundCycles && !finishQueued) {
            finishQueued = true
            window.setTimeout(() => finishLand(), 0)
            next = landDef.frameCount
          } else {
            next = groundStart
          }
        }
        applyFrame(next)
      } else {
        applyFrame(airFrame)
      }
    }, landDef.frameMs)

    let rafId = 0
    const fallTick = () => {
      if (bottomRef.current <= floorBottom + LAND_GROUND_EPS) {
        applyFloorPosition(xRef.current)
      } else {
        applyFreePosition(xRef.current, bottomRef.current - LAND_FALL_SPEED)
      }
      rafId = requestAnimationFrame(fallTick)
    }
    rafId = requestAnimationFrame(fallTick)

    return () => {
      window.clearInterval(frameId)
      cancelAnimationFrame(rafId)
    }
  }, [
    behavior,
    config,
    floorBottom,
    isAirborne,
    finishLand,
    applyFloorPosition,
    applyFreePosition,
    applyFrame,
  ])

  useEffect(() => {
    if (behavior === 'pickup' || behavior === 'land') return undefined

    const def = behaviorDef(config, behavior)
    if (!def) return undefined

    if (def.playOnce) {
      applyFrame(1)
      let current = 1
      const holdFrame = def.holdFrame ?? def.frameCount
      const id = window.setInterval(() => {
        if (current >= def.frameCount) {
          window.clearInterval(id)
          applyFrame(holdFrame)
          return
        }
        current += 1
        applyFrame(current)
      }, def.frameMs)
      return () => window.clearInterval(id)
    }

    if (def.loop && def.landAirHoldFrame == null) {
      applyFrame(1)
      const id = window.setInterval(() => {
        applyFrame((frameRef.current % def.frameCount) + 1)
      }, def.frameMs)
      return () => window.clearInterval(id)
    }

    return undefined
  }, [behavior, config, applyFrame])

  useEffect(() => {
    if (!config.locomotion.includes(behavior)) return undefined

    let rafId = 0

    const tick = () => {
      if (isDraggingRef.current) {
        rafId = requestAnimationFrame(tick)
        return
      }

      const speed = config.locomotionSpeed?.[behavior] ?? WALK_SPEED
      let nextX = xRef.current + direction * speed
      const el = petRef.current

      const size = displaySizeRef.current
      const maxX = Math.max(0, window.innerWidth - size)
      let hitViewportEdge = false

      if (el) {
        const rect = el.getBoundingClientRect()
        const style = getComputedStyle(el)
        const currentLeft = Number.parseFloat(style.left) || xRef.current
        const deltaX = nextX - currentLeft
        const predictedLeft = rect.left + deltaX
        const predictedRight = rect.right + deltaX

        if (predictedLeft < 0) {
          hitViewportEdge = true
          nextX = 0
        } else if (predictedRight > window.innerWidth) {
          hitViewportEdge = true
          nextX = maxX
        }
      } else if (nextX <= 0) {
        hitViewportEdge = true
        nextX = 0
      } else if (nextX >= maxX) {
        hitViewportEdge = true
        nextX = maxX
      }

      if (hitViewportEdge && config.hideAtViewportEdge) {
        applyFloorPosition(nextX)
        triggerHideAtEdge()
        return
      }

      if (el) {
        const rect = el.getBoundingClientRect()
        const style = getComputedStyle(el)
        const currentLeft = Number.parseFloat(style.left) || xRef.current
        const deltaX = nextX - currentLeft
        const predictedLeft = rect.left + deltaX
        const predictedRight = rect.right + deltaX

        if (predictedLeft < 0) {
          setDirection(1)
          nextX -= predictedLeft
        } else if (predictedRight > window.innerWidth) {
          setDirection(-1)
          nextX -= predictedRight - window.innerWidth
        }
      } else {
        if (nextX <= 0) {
          setDirection(1)
          nextX = 0
        } else if (nextX >= maxX) {
          setDirection(-1)
          nextX = maxX
        }
      }

      applyFloorPosition(nextX)
      rafId = requestAnimationFrame(tick)
    }

    rafId = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(rafId)
  }, [behavior, direction, config, applyFloorPosition, triggerHideAtEdge])

  return (
    <div
      ref={petRef}
      className={`desktop-pet desktop-pet--${config.id}${isDragging ? ' desktop-pet--dragging' : ''}${direction < 0 ? ' desktop-pet--facing-left' : ''}${behavior === 'hide' ? ' desktop-pet--hide' : ''}`}
      style={{
        left: x,
        bottom,
        ['--pet-size' as string]: `${displaySize}px`,
      }}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerCancel={handlePointerUp}
      onClick={config.onClick ? handleClick : undefined}
      onKeyDown={
        config.onClick
          ? (e) => {
              if (e.key === 'Enter' || e.key === ' ') triggerClickBehavior()
            }
          : undefined
      }
      role="button"
      tabIndex={0}
      aria-label={ariaLabel}
    >
      <img
        ref={spriteRef}
        className="desktop-pet__sprite"
        src={petSpriteSrc(config, 'walk', 1)}
        alt=""
        width={SPRITE_PX}
        height={SPRITE_PX}
        decoding="sync"
        draggable={false}
      />
    </div>
  )
}
