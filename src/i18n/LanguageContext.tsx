import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react'
import { enMessages, zhMessages, type Locale, type Messages } from './messages'

const STORAGE_KEY = 'portfolio-locale'

function getNested(obj: Messages, path: string): string {
  const parts = path.split('.')
  let cur: unknown = obj
  for (const p of parts) {
    if (cur == null || typeof cur !== 'object') return path
    cur = (cur as Record<string, unknown>)[p]
  }
  return typeof cur === 'string' ? cur : path
}

function interpolate(template: string, vars?: Record<string, string | number>): string {
  if (!vars) return template
  let s = template
  for (const [k, v] of Object.entries(vars)) {
    s = s.replaceAll(`{${k}}`, String(v))
  }
  return s
}

type LanguageContextValue = {
  locale: Locale
  setLocale: (locale: Locale) => void
  t: (path: string, vars?: Record<string, string | number>) => string
  /** Active locale message bundle (arrays, nested objects). */
  messages: Messages
}

const LanguageContext = createContext<LanguageContextValue | null>(null)

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>(() => {
    if (typeof window === 'undefined') return 'en'
    const s = window.localStorage.getItem(STORAGE_KEY)
    return s === 'zh' ? 'zh' : 'en'
  })

  const bundle = locale === 'zh' ? zhMessages : enMessages

  const setLocale = useCallback((next: Locale) => {
    setLocaleState(next)
    try {
      window.localStorage.setItem(STORAGE_KEY, next)
    } catch {
      /* ignore */
    }
  }, [])

  useEffect(() => {
    document.documentElement.lang = locale === 'zh' ? 'zh-Hans' : 'en'
  }, [locale])

  const t = useCallback(
    (path: string, vars?: Record<string, string | number>) => {
      const raw = getNested(bundle, path)
      return interpolate(raw, vars)
    },
    [bundle],
  )

  const value = useMemo(
    () => ({ locale, setLocale, t, messages: bundle }),
    [locale, setLocale, t, bundle],
  )

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>
}

export function useLanguage(): LanguageContextValue {
  const ctx = useContext(LanguageContext)
  if (!ctx) throw new Error('useLanguage must be used within LanguageProvider')
  return ctx
}

export function useLocale(): Locale {
  return useLanguage().locale
}
