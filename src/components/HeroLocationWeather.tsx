import { useEffect, useMemo, useState } from 'react'
import type { AustinWeatherStatus } from '../hooks/useAustinWeather'
import { useLanguage } from '../i18n/LanguageContext'

const AUSTIN_TZ = 'America/Chicago'

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

function describeWeather(code: number, t: (path: string) => string): string {
  if (code === 0) return t('weather.clear')
  if (code === 1) return t('weather.mainlyClear')
  if (code === 2) return t('weather.partlyCloudy')
  if (code === 3) return t('weather.overcast')
  if (code === 45 || code === 48) return t('weather.fog')
  if (code >= 51 && code <= 67) return t('weather.rain')
  if (code >= 71 && code <= 77) return t('weather.snow')
  if (code >= 80 && code <= 82) return t('weather.showers')
  if (code >= 85 && code <= 86) return t('weather.snowShowers')
  if (code >= 95 && code <= 99) return t('weather.thunderstorm')
  return t('weather.generic')
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
  const { locale, t } = useLanguage()
  const [now, setNow] = useState(() => new Date())

  const timeLocale = locale === 'zh' ? 'zh-CN' : 'en-US'
  const austinTimeFormatter = useMemo(
    () =>
      new Intl.DateTimeFormat(timeLocale, {
        timeZone: AUSTIN_TZ,
        hour: 'numeric',
        minute: '2-digit',
        second: '2-digit',
        hour12: locale !== 'zh',
        timeZoneName: 'short',
      }),
    [timeLocale, locale],
  )

  useEffect(() => {
    const id = window.setInterval(() => setNow(new Date()), 1000)
    return () => window.clearInterval(id)
  }, [])

  const emoji =
    status === 'ready' && weatherCode != null ? weatherCodeToEmoji(weatherCode) : '🌡️'

  const timeLine = austinTimeFormatter.format(now)

  const weatherDesc =
    status === 'ready' && weatherCode != null ? describeWeather(weatherCode, t) : ''

  const weatherAria =
    status === 'ready' && tempF != null && weatherCode != null
      ? t('weather.ariaWeather', { temp: tempF, desc: weatherDesc })
      : undefined

  const clockAria = t('weather.ariaClock', { time: timeLine })

  return (
    <p
      className={`text-[0.9375rem] font-normal leading-relaxed text-[#5c5650] tabular-nums md:text-[1rem] ${className}`}
    >
      <span>{t('weather.austin')}</span>
      {status === 'loading' && (
        <span aria-busy="true">
          {' '}
          · {t('weather.loading')}
        </span>
      )}
      {status === 'ready' && tempF != null && (
        <span aria-label={weatherAria}>
          {' '}
          · {tempF}°F {emoji}
        </span>
      )}
      {status === 'error' && <span className="sr-only">{t('weather.error')}</span>}
      <span aria-hidden="true"> · </span>
      <time dateTime={now.toISOString()} aria-label={clockAria}>
        {timeLine}
      </time>
    </p>
  )
}
