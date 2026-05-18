import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useRef,
  type ReactNode,
  type MutableRefObject,
} from 'react'
import { petAabbOverlap, separatePetBottom, separatePetX, type PetAabb } from './petCollision'

export type RegisteredPet = {
  id: string
  petSize: number
  getPetSize?: () => number
  xRef: MutableRefObject<number>
  bottomRef: MutableRefObject<number>
}

function registeredPetSize(pet: RegisteredPet): number {
  return pet.getPetSize?.() ?? pet.petSize
}

type DesktopPetsContextValue = {
  register: (pet: RegisteredPet) => () => void
  resolvePosition: (
    selfId: string,
    proposed: PetAabb,
    /** Return false to pass through the other pet (no separation). */
    onContact?: (otherId: string, other: PetAabb) => boolean | void,
  ) => PetAabb
}

const DesktopPetsContext = createContext<DesktopPetsContextValue | null>(null)

export function DesktopPetsProvider({ children }: { children: ReactNode }) {
  const petsRef = useRef(new Map<string, RegisteredPet>())

  const register = useCallback((pet: RegisteredPet) => {
    petsRef.current.set(pet.id, pet)
    return () => {
      petsRef.current.delete(pet.id)
    }
  }, [])

  const resolvePosition = useCallback(
    (
      selfId: string,
      proposed: PetAabb,
      onContact?: (otherId: string, other: PetAabb) => boolean | void,
    ): PetAabb => {
      const self = petsRef.current.get(selfId)
      if (!self) return proposed

      let { x, bottom, petSize } = proposed

      for (const [otherId, other] of petsRef.current) {
        if (otherId === selfId) continue

        const otherPose: PetAabb = {
          x: other.xRef.current ?? 0,
          bottom: other.bottomRef.current ?? 0,
          petSize: registeredPetSize(other),
        }

        const selfPose = { x, bottom, petSize }
        if (!petAabbOverlap(selfPose, otherPose)) continue

        const shouldSeparate = onContact?.(otherId, otherPose)
        if (shouldSeparate === false) continue

        x = separatePetX(selfPose, otherPose, x)
        bottom = separatePetBottom({ ...selfPose, x }, otherPose, bottom)

        const separatedSelf = { x, bottom, petSize }
        if (petAabbOverlap(separatedSelf, otherPose)) {
          x = separatePetX(separatedSelf, otherPose, x)
        }
      }

      return { x, bottom, petSize }
    },
    [],
  )

  const value = useMemo(() => ({ register, resolvePosition }), [register, resolvePosition])

  return <DesktopPetsContext.Provider value={value}>{children}</DesktopPetsContext.Provider>
}

export function useDesktopPets(): DesktopPetsContextValue {
  const ctx = useContext(DesktopPetsContext)
  if (!ctx) {
    throw new Error('useDesktopPets must be used within DesktopPetsProvider')
  }
  return ctx
}
