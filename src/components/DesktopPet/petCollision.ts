export type PetAabb = {
  x: number
  bottom: number
  petSize: number
}

export function petAabbOverlap(a: PetAabb, b: PetAabb): boolean {
  return (
    a.x < b.x + b.petSize &&
    a.x + a.petSize > b.x &&
    a.bottom < b.bottom + b.petSize &&
    a.bottom + a.petSize > b.bottom
  )
}

/** Push `mover` horizontally out of `other` (minimal shift). */
export function separatePetX(mover: PetAabb, other: PetAabb, proposedX: number): number {
  if (!petAabbOverlap({ ...mover, x: proposedX }, other)) return proposedX

  const moverCenter = proposedX + mover.petSize / 2
  const otherCenter = other.x + other.petSize / 2

  if (moverCenter < otherCenter) {
    return other.x - mover.petSize - 2
  }
  return other.x + other.petSize + 2
}

/** Push `mover` vertically (bottom axis) out of `other`. */
export function separatePetBottom(mover: PetAabb, other: PetAabb, proposedBottom: number): number {
  if (!petAabbOverlap({ ...mover, bottom: proposedBottom }, other)) return proposedBottom

  const moverMid = proposedBottom + mover.petSize / 2
  const otherMid = other.bottom + other.petSize / 2

  if (moverMid < otherMid) {
    return other.bottom - mover.petSize - 2
  }
  return other.bottom + other.petSize + 2
}

/** Direction for `self` to move away from `other`. */
export function directionAwayFrom(self: PetAabb, other: PetAabb): -1 | 1 {
  const selfCenter = self.x + self.petSize / 2
  const otherCenter = other.x + other.petSize / 2
  return selfCenter < otherCenter ? -1 : 1
}

const VIEWPORT_EDGE_THRESHOLD = 8

/** True when the pet box touches or nears a viewport edge (incl. corners). */
export function isAtViewportEdge(x: number, bottom: number, petSize: number): boolean {
  const maxX = Math.max(0, window.innerWidth - petSize)
  const maxBottom = Math.max(0, window.innerHeight - petSize)
  const t = VIEWPORT_EDGE_THRESHOLD
  return (
    x <= t ||
    x >= maxX - t ||
    bottom <= t ||
    bottom >= maxBottom - t
  )
}
