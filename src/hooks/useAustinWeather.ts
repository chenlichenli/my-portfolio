import { useEffect, useState } from 'react'

const AUSTIN_LAT = 30.2672
const AUSTIN_LON = -97.7431

export const AUSTIN_METEO_URL = `https://api.open-meteo.com/v1/forecast?latitude=${AUSTIN_LAT}&longitude=${AUSTIN_LON}&current=temperature_2m,weather_code&temperature_unit=fahrenheit&timezone=America%2FChicago`

type MeteoCurrent = {
  temperature_2m?: number
  weather_code?: number
}

type MeteoResponse = {
  current?: MeteoCurrent
}

export type AustinWeatherStatus = 'loading' | 'ready' | 'error'

export function useAustinWeather() {
  const [tempF, setTempF] = useState<number | null>(null)
  const [weatherCode, setWeatherCode] = useState<number | null>(null)
  const [status, setStatus] = useState<AustinWeatherStatus>('loading')

  useEffect(() => {
    let cancelled = false

    fetch(AUSTIN_METEO_URL)
      .then((res) => {
        if (!res.ok) throw new Error(String(res.status))
        return res.json() as Promise<MeteoResponse>
      })
      .then((data) => {
        if (cancelled) return
        const c = data.current
        if (c?.temperature_2m == null || c.weather_code == null) {
          setStatus('error')
          return
        }
        setTempF(Math.round(c.temperature_2m))
        setWeatherCode(c.weather_code)
        setStatus('ready')
      })
      .catch(() => {
        if (!cancelled) setStatus('error')
      })

    return () => {
      cancelled = true
    }
  }, [])

  return { tempF, weatherCode, status }
}

/** HSL stops: cold → blue-violet, hot → red-orange (~28°F–102°F maps across hue). */
function tempFToHsl(tempF: number): { h: number; s: number; l: number } {
  const t = Math.min(102, Math.max(28, tempF))
  const u = (t - 28) / (102 - 28)
  const h = 238 - u * (238 - 18)
  const s = 72 + u * 10
  const l = 58 - u * 8
  return { h, s, l }
}

/** Default ≈ accent #5271FF when temp unknown. */
const DEFAULT_HSL = { h: 228, s: 82, l: 58 }

function hslForBlobTemp(tempF: number | null): { h: number; s: number; l: number } {
  return tempF == null ? DEFAULT_HSL : tempFToHsl(tempF)
}

/** Solid color at the bubble center — same HSL as `blobGradientForTempF`. */
export function blobColorForTempF(tempF: number | null): string {
  const { h, s, l } = hslForBlobTemp(tempF)
  return `hsl(${h} ${s}% ${l}%)`
}

export function blobGradientForTempF(tempF: number | null): string {
  const { h, s, l } = hslForBlobTemp(tempF)
  const c = (a: number) => `hsl(${h} ${s}% ${l}% / ${a})`
  return `radial-gradient(circle at center, ${c(1)} 0%, ${c(1)} 48%, ${c(1)} 62%, ${c(0.72)} 74%, ${c(0.28)} 86%, ${c(0.06)} 94%, ${c(0)} 100%)`
}

/** Same radial falloff as `blobGradientForTempF`, for a fixed hex (About page circle). */
export function blobGradientForHex(hex: string): string {
  const m = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex.trim())
  if (!m) return blobGradientForTempF(null)
  const r = parseInt(m[1]!, 16)
  const g = parseInt(m[2]!, 16)
  const b = parseInt(m[3]!, 16)
  const c = (a: number) => `rgba(${r}, ${g}, ${b}, ${a})`
  return `radial-gradient(circle at center, ${c(1)} 0%, ${c(1)} 48%, ${c(1)} 62%, ${c(0.72)} 74%, ${c(0.28)} 86%, ${c(0.06)} 94%, ${c(0)} 100%)`
}
