export const SPRITE_PX = 320
export const VINNY_PET_SCALE = 0.524 * 0.8
export const NALA_PET_SCALE = VINNY_PET_SCALE * 0.7 * 1.2
export const BOTTOM_OFFSET = 0

export function petDisplaySize(petScale: number): number {
  return Math.round(SPRITE_PX * petScale)
}
export const DRAG_CLICK_THRESHOLD = 5

const VINNY_BASE = '/desktop-pet'
const NALA_BASE = '/desktop-pet/Pet Nala'

export type PetBehaviorId = string

export type PetBehaviorDef = {
  frameCount: number
  frameMs: number
  /** Play frames 1…N once, then hold (see holdFrame). */
  playOnce?: boolean
  /** After playOnce, hold this frame until the state ends. Defaults to last frame. */
  holdFrame?: number
  /** Loop frames for the whole state duration. */
  loop?: boolean
  /** Land: hold this frame while airborne before touchdown. */
  landAirHoldFrame?: number
  /** Land: advance from this frame after touching the ground. */
  landGroundStartFrame?: number
  /** Land: how many times to loop ground frames before finishing. */
  landGroundCycles?: number
  folder: string
  fileName: (frame: number) => string
}

export type PetClickBehavior = 'rolling' | 'annoyed'

export type DesktopPetConfig = {
  id: string
  petScale: number
  assetBase: string
  ariaLabelKey: 'pet.aria' | 'pet.nalaAria'
  initialXRatio: number
  bottomOffset: number
  onClick?: PetClickBehavior
  behaviors: Record<PetBehaviorId, PetBehaviorDef>
  pickup: PetBehaviorDef
  pickNext: () => PetBehaviorId
  stateDuration: (behavior: PetBehaviorId) => number
  locomotion: PetBehaviorId[]
  locomotionSpeed?: Partial<Record<PetBehaviorId, number>>
  hideAtViewportEdge?: boolean
  behaviorDisplayScale?: Partial<Record<PetBehaviorId, number>>
  preloadBehaviors?: PetBehaviorId[]
  /** When colliding with this pet id, chance to pass through (0–1). */
  passThroughPeerId?: string
  passThroughChance?: number
  /** After drag-release, play land instead of restoring prior behavior. */
  landOnDragRelease?: boolean
}

const FRAME_COUNT = 8
const WALK_FRAME_MS = 120
const ROLL_FRAME_MS = 60
const IDLE_FRAME_MS = 120
const EAT_FRAME_MS = 120
const SLEEP_FRAME_MS = 150
const ANNOYED_FRAME_MS = 120
const ANNOYED_FRAME_COUNT = 7
const JUMP_FRAME_MS = 100
const JUMP_CYCLES = 3
const LAND_FRAME_MS = 120
const VINNY_LAND_FRAME_COUNT = 4
const VINNY_LAND_AIR_HOLD_FRAME = 2
const VINNY_LAND_GROUND_START_FRAME = 3
const NALA_LAND_FRAME_COUNT = 8
const NALA_LAND_AIR_HOLD_FRAME = 4
const NALA_LAND_GROUND_START_FRAME = 5
const HIDE_FRAME_MS = 120
const HIDE_FRAME_COUNT = 7
const WALK_MIN_MS = 3500
const WALK_MAX_MS = 7500
/** Hold on last idle frame after playOnce animation finishes. */
const IDLE_HOLD_MIN_MS = 12000
const IDLE_HOLD_MAX_MS = 24000
const SLEEP_SIT_MIN_MS = 8000
const SLEEP_SIT_MAX_MS = 16000
const EAT_CYCLES = 6
const HIDE_SIT_MIN_MS = 4000
const HIDE_SIT_MAX_MS = 8000

const EAT_ASSET_VERSION = '2'

/** Random idle weight; other behaviors keep their prior ratios within the remainder. */
const IDLE_PICK_WEIGHT = 0.6

function idleStateDuration(frameCount: number, frameMs: number): number {
  return (
    frameCount * frameMs +
    IDLE_HOLD_MIN_MS +
    Math.random() * (IDLE_HOLD_MAX_MS - IDLE_HOLD_MIN_MS)
  )
}

function vinnyPickNext(): PetBehaviorId {
  const r = Math.random()
  const walk = (0.3 / 0.7) * (1 - IDLE_PICK_WEIGHT)
  const sleep = walk
  if (r < walk) return 'walk'
  if (r < walk + IDLE_PICK_WEIGHT) return 'idle'
  if (r < walk + IDLE_PICK_WEIGHT + sleep) return 'sleep'
  return 'eat'
}

function nalaPickNext(): PetBehaviorId {
  const r = Math.random()
  const walk = (0.3 / 0.6) * (1 - IDLE_PICK_WEIGHT)
  if (r < walk) return 'walk'
  if (r < walk + IDLE_PICK_WEIGHT) return 'idle'
  return 'sleep'
}

function vinnyStateDuration(behavior: PetBehaviorId): number {
  if (behavior === 'idle') {
    return idleStateDuration(FRAME_COUNT, IDLE_FRAME_MS)
  }
  if (behavior === 'sleep') {
    return (
      FRAME_COUNT * SLEEP_FRAME_MS +
      SLEEP_SIT_MIN_MS +
      Math.random() * (SLEEP_SIT_MAX_MS - SLEEP_SIT_MIN_MS)
    )
  }
  if (behavior === 'walk') {
    return WALK_MIN_MS + Math.random() * (WALK_MAX_MS - WALK_MIN_MS)
  }
  if (behavior === 'eat') {
    return FRAME_COUNT * EAT_FRAME_MS * EAT_CYCLES
  }
  if (behavior === 'rolling') {
    const cycles = 2 + Math.floor(Math.random() * 2)
    return FRAME_COUNT * ROLL_FRAME_MS * cycles
  }
  if (behavior === 'land') {
    return VINNY_LAND_FRAME_COUNT * LAND_FRAME_MS * 4
  }
  return WALK_MIN_MS
}

function nalaStateDuration(behavior: PetBehaviorId): number {
  if (behavior === 'idle') {
    return idleStateDuration(1, IDLE_FRAME_MS)
  }
  if (behavior === 'sleep') {
    return (
      FRAME_COUNT * SLEEP_FRAME_MS +
      SLEEP_SIT_MIN_MS +
      Math.random() * (SLEEP_SIT_MAX_MS - SLEEP_SIT_MIN_MS)
    )
  }
  if (behavior === 'walk') {
    return WALK_MIN_MS + Math.random() * (WALK_MAX_MS - WALK_MIN_MS)
  }
  if (behavior === 'annoyed') {
    return ANNOYED_FRAME_COUNT * ANNOYED_FRAME_MS
  }
  if (behavior === 'jump') {
    return FRAME_COUNT * JUMP_FRAME_MS * JUMP_CYCLES
  }
  if (behavior === 'land') {
    return NALA_LAND_FRAME_COUNT * LAND_FRAME_MS * 4
  }
  if (behavior === 'hide') {
    return (
      HIDE_FRAME_COUNT * HIDE_FRAME_MS +
      HIDE_SIT_MIN_MS +
      Math.random() * (HIDE_SIT_MAX_MS - HIDE_SIT_MIN_MS)
    )
  }
  return WALK_MIN_MS
}

export const VINNY_PET: DesktopPetConfig = {
  id: 'vinny',
  petScale: VINNY_PET_SCALE,
  assetBase: VINNY_BASE,
  ariaLabelKey: 'pet.aria',
  initialXRatio: 0.42,
  bottomOffset: BOTTOM_OFFSET,
  onClick: 'rolling',
  locomotion: ['walk'],
  passThroughPeerId: 'nala',
  passThroughChance: 0.3,
  landOnDragRelease: true,
  behaviorDisplayScale: { land: 1.3 },
  preloadBehaviors: ['eat', 'land'],
  pickup: {
    frameCount: 1,
    frameMs: 0,
    folder: 'pickup',
    fileName: () => 'pickup.png',
  },
  behaviors: {
    walk: {
      frameCount: FRAME_COUNT,
      frameMs: WALK_FRAME_MS,
      loop: true,
      folder: 'walk',
      fileName: (n) => `walk${n}.png`,
    },
    idle: {
      frameCount: FRAME_COUNT,
      frameMs: IDLE_FRAME_MS,
      playOnce: true,
      holdFrame: FRAME_COUNT,
      folder: 'idle',
      fileName: (n) => `idle${n}.png`,
    },
    sleep: {
      frameCount: FRAME_COUNT,
      frameMs: SLEEP_FRAME_MS,
      playOnce: true,
      holdFrame: FRAME_COUNT,
      folder: 'Sleep',
      fileName: (n) => `Sleep${n}.png`,
    },
    eat: {
      frameCount: FRAME_COUNT,
      frameMs: EAT_FRAME_MS,
      loop: true,
      folder: 'Eat',
      fileName: (n) => `eat${n}.png?v=${EAT_ASSET_VERSION}`,
    },
    rolling: {
      frameCount: FRAME_COUNT,
      frameMs: ROLL_FRAME_MS,
      loop: true,
      folder: 'Roll',
      fileName: (n) => `Roll${n}.png`,
    },
    land: {
      frameCount: VINNY_LAND_FRAME_COUNT,
      frameMs: LAND_FRAME_MS,
      landAirHoldFrame: VINNY_LAND_AIR_HOLD_FRAME,
      landGroundStartFrame: VINNY_LAND_GROUND_START_FRAME,
      landGroundCycles: 1,
      folder: 'land',
      fileName: (n) => `land${n}.png`,
    },
  },
  pickNext: vinnyPickNext,
  stateDuration: vinnyStateDuration,
}

export const NALA_PET: DesktopPetConfig = {
  id: 'nala',
  petScale: NALA_PET_SCALE,
  assetBase: NALA_BASE,
  ariaLabelKey: 'pet.nalaAria',
  initialXRatio: 0.58,
  bottomOffset: BOTTOM_OFFSET,
  onClick: 'annoyed',
  locomotion: ['walk', 'jump'],
  locomotionSpeed: { walk: 2, jump: 3 },
  hideAtViewportEdge: true,
  landOnDragRelease: true,
  behaviorDisplayScale: { hide: 1.3, land: 1.3, pickup: 1.2 },
  preloadBehaviors: ['annoyed', 'land'],
  pickup: {
    frameCount: 1,
    frameMs: 0,
    folder: 'pickup',
    fileName: () => 'pickup.png',
  },
  behaviors: {
    walk: {
      frameCount: FRAME_COUNT,
      frameMs: WALK_FRAME_MS,
      loop: true,
      folder: 'walk',
      fileName: (n) => `walk${n}.png`,
    },
    idle: {
      frameCount: 1,
      frameMs: IDLE_FRAME_MS,
      playOnce: true,
      holdFrame: 1,
      folder: 'idle',
      fileName: () => 'idle.png',
    },
    sleep: {
      frameCount: FRAME_COUNT,
      frameMs: SLEEP_FRAME_MS,
      playOnce: true,
      holdFrame: 4,
      folder: 'sleep',
      fileName: (n) => `sleep${n}.png`,
    },
    annoyed: {
      frameCount: ANNOYED_FRAME_COUNT,
      frameMs: ANNOYED_FRAME_MS,
      playOnce: true,
      holdFrame: ANNOYED_FRAME_COUNT,
      folder: 'annoyed',
      fileName: (n) => `annoyed${n}.png`,
    },
    jump: {
      frameCount: FRAME_COUNT,
      frameMs: JUMP_FRAME_MS,
      loop: true,
      folder: 'jump',
      fileName: (n) => `jump${n}.png`,
    },
    land: {
      frameCount: NALA_LAND_FRAME_COUNT,
      frameMs: LAND_FRAME_MS,
      landAirHoldFrame: NALA_LAND_AIR_HOLD_FRAME,
      landGroundStartFrame: NALA_LAND_GROUND_START_FRAME,
      landGroundCycles: 2,
      folder: 'land',
      fileName: (n) => `land${n}.png`,
    },
    hide: {
      frameCount: HIDE_FRAME_COUNT,
      frameMs: HIDE_FRAME_MS,
      playOnce: true,
      holdFrame: HIDE_FRAME_COUNT,
      folder: 'hide',
      fileName: (n) => `hide${n}.png`,
    },
  },
  pickNext: nalaPickNext,
  stateDuration: nalaStateDuration,
}

export function petSpriteSrc(
  config: DesktopPetConfig,
  behavior: PetBehaviorId,
  frame: number,
): string {
  if (behavior === 'pickup') {
    const p = config.pickup
    return encodeURI(`${config.assetBase}/${p.folder}/${p.fileName(1)}`)
  }
  const def = config.behaviors[behavior]
  if (!def) {
    const walk = config.behaviors.walk
    return encodeURI(`${config.assetBase}/${walk.folder}/${walk.fileName(frame)}`)
  }
  const f = Math.min(Math.max(1, frame), def.frameCount)
  return encodeURI(`${config.assetBase}/${def.folder}/${def.fileName(f)}`)
}

export function behaviorDef(
  config: DesktopPetConfig,
  behavior: PetBehaviorId,
): PetBehaviorDef | undefined {
  if (behavior === 'pickup') return config.pickup
  return config.behaviors[behavior]
}

/** Decode all behavior frames up front to avoid flashes on state / frame changes. */
export function preloadPetSprites(config: DesktopPetConfig): void {
  const seen = new Set<string>()
  const load = (behavior: PetBehaviorId, def: PetBehaviorDef) => {
    for (let i = 1; i <= def.frameCount; i += 1) {
      const url = petSpriteSrc(config, behavior, i)
      if (seen.has(url)) continue
      seen.add(url)
      const img = new Image()
      img.src = url
    }
  }
  load('pickup', config.pickup)
  for (const [id, def] of Object.entries(config.behaviors)) {
    load(id, def)
  }
}
