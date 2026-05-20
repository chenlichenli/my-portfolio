import { PET_FLOOR_EPS } from './petCollision'

/** Match site mobile breakpoint — pets use separate pick weights & locomotion rules. */
export const MOBILE_PET_BREAKPOINT_PX = 768

/** Minimum horizontal travel (px) before walk looks worthwhile on a phone. */
export const MOBILE_MIN_WALK_RANGE_PX = 88

export function isMobilePetLayout(): boolean {
  if (typeof window === 'undefined') return false
  return window.matchMedia(`(max-width: ${MOBILE_PET_BREAKPOINT_PX}px)`).matches
}

export function isCoarsePointer(): boolean {
  if (typeof window === 'undefined') return false
  return window.matchMedia('(pointer: coarse)').matches
}

const DRAG_THRESHOLD_DESKTOP = 5
const DRAG_THRESHOLD_TOUCH = 12

export function getDragClickThreshold(): number {
  return isCoarsePointer() || isMobilePetLayout() ? DRAG_THRESHOLD_TOUCH : DRAG_THRESHOLD_DESKTOP
}

export function getViewportWidth(): number {
  if (typeof window === 'undefined') return 0
  return window.visualViewport?.width ?? window.innerWidth
}

export function getViewportHeight(): number {
  if (typeof window === 'undefined') return 0
  return window.visualViewport?.height ?? window.innerHeight
}

export function getPetWalkRange(petSize: number): number {
  return Math.max(0, getViewportWidth() - petSize)
}

export function hasRoomToWalk(petSize: number): boolean {
  return getPetWalkRange(petSize) >= MOBILE_MIN_WALK_RANGE_PX
}

/** Map screen position to CSS `bottom` (fixed positioning). */
export function bottomFromRect(rect: DOMRect, floorBottom = 0): number {
  return Math.max(floorBottom, Math.round(getViewportHeight() - rect.bottom))
}

export function petTouchesViewportGround(el: HTMLElement | null): boolean {
  if (!el) return false
  return el.getBoundingClientRect().bottom >= getViewportHeight() - PET_FLOOR_EPS
}
