import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from 'react'

export type DesktopPetId = 'vinny' | 'nala'

type Visibility = Record<DesktopPetId, boolean>

type DesktopPetVisibilityContextValue = {
  visible: Visibility
  togglePet: (id: DesktopPetId) => void
}

const DesktopPetVisibilityContext = createContext<DesktopPetVisibilityContextValue | null>(
  null,
)

export function DesktopPetVisibilityProvider({ children }: { children: ReactNode }) {
  const [visible, setVisible] = useState<Visibility>({ vinny: true, nala: true })

  const togglePet = useCallback((id: DesktopPetId) => {
    setVisible((prev) => ({ ...prev, [id]: !prev[id] }))
  }, [])

  const value = useMemo(() => ({ visible, togglePet }), [visible, togglePet])

  return (
    <DesktopPetVisibilityContext.Provider value={value}>
      {children}
    </DesktopPetVisibilityContext.Provider>
  )
}

export function useDesktopPetVisibility(): DesktopPetVisibilityContextValue {
  const ctx = useContext(DesktopPetVisibilityContext)
  if (!ctx) {
    throw new Error('useDesktopPetVisibility must be used within DesktopPetVisibilityProvider')
  }
  return ctx
}
