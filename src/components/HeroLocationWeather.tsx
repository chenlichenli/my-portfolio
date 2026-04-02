import { useEffect, useState } from 'react'
import type { AustinWeatherStatus } from '../hooks/useAustinWeather'

const AUSTIN_TZ = 'America/Chicago'

const austinTimeFormatter = new Intl.DateTimeFormat('en-US', {
  timeZone: AUSTIN_TZ,
  hour: 'numeric',
  minute: '2-digit',
  second: '2-digit',
  hour12: true,
  timeZoneName: 'short',
})

/** WMO Weather interpretation codes (Open-Meteo). */
function weatherCodeToEmoji(code: number): string {
  if (code === 0) return '☀️'
  if (code === 1) return '🌤️'
  if (code === 2) return '⛅'
  if (code === 3) return '☁️'
  if (code === 45 || code === 48) return '🌫️'
  if (code >= 51 && code <= 55) return '🌦️'
  if (code >= 56 && code <= 57) return '🌧️'
  if (code >= 61 && code <= 65) return '🌧️'
  if (code >= 66 && code <= 67) return '🌨️'
  if (code >= 71 && code <= 77) return '❄️'
  if (code >= 80 && code <= 82) return '🌦️'
  if (code >= 85 && code <= 86) return '🌨️'
  if (code === 95) return '⛈️'
  if (code >= 96 && code <= 99) return '⛈️'
  return '🌡️'
}

function describeWeather(code: number): string {
  if (code === 0) return 'clear skies'
  if (code === 1) return 'mainly clear'
  if (code === 2) return 'partly cloudy'
  if (code === 3) return 'overcast'
  if (code === 45 || code === 48) return 'fog'
  if (code >= 51 && code <= 67) return 'rain'
  if (code >= 71 && code <= 77) return 'snow'
  if (code >= 80 && code <= 82) return 'showers'
  if (code >= 85 && code <= 86) return 'snow showers'
  if (code >= 95 && code <= 99) return 'thunderstorm'
  return 'weather'
}

export type HeroLocationWeatherProps = {
  className?: string
  tempF: number | null
  weatherCode: number | null
  status: AustinWeatherStatus
}

export function HeroLocationWeather({
  className = 'mt-4 max-w-md text-left',
  tempF,
  weatherCode,
  status,
}: HeroLocationWeatherProps) {
  const [now, setNow] = useState(() => new Date())

  useEffect(() => {
    const id = window.setInterval(() => setNow(new Date()), 1000)
    return () => window.clearInterval(id)
  }, [])

  const emoji =
    status === 'ready' && weatherCode != null ? weatherCodeToEmoji(weatherCode) : '🌡️'

  const timeLine = austinTimeFormatter.format(now)

  const weatherAria =
    status === 'ready' && tempF != null && weatherCode != null
      ? `Current weather in Austin, Texas: ${tempF} degrees Fahrenheit, ${describeWeather(weatherCode)}`
      : undefined

  const clockAria = `Local time in Austin, Texas: ${timeLine}`

  return (
    <p
      className={`text-[0.9375rem] font-normal leading-relaxed text-[#5c5650] tabular-nums md:text-[1rem] ${className}`}
    >
      <span>Austin, TX</span>
      {status === 'loading' && (
        <span aria-busy="true">
          {' '}
          · …
        </span>
      )}
      {status === 'ready' && tempF != null && (
        <span aria-label={weatherAria}>
          {' '}
          · {tempF}°F {emoji}
        </span>
      )}
      {status === 'error' && (
        <span className="sr-only">Weather could not be loaded.</span>
      )}
      <span aria-hidden="true"> · </span>
      <time dateTime={now.toISOString()} aria-label={clockAria}>
        {timeLine}
      </time>
    </p>
  )
}
