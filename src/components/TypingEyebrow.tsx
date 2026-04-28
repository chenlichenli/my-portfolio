import { motion, useReducedMotion } from 'framer-motion'
import { useEffect, useState } from 'react'

const TYPE_MS = 72
const DELETE_MS = 44
const HOLD_MS = 2400
const BETWEEN_MS = 420

type Mode = 'forward' | 'back'

export type TypingEyebrowProps = {
  phrases: readonly string[]
  ariaLabel: string
}

export function TypingEyebrow({ phrases, ariaLabel }: TypingEyebrowProps) {
  const reduceMotion = useReducedMotion()
  const [phraseIndex, setPhraseIndex] = useState(0)
  const [charIndex, setCharIndex] = useState(0)
  const [mode, setMode] = useState<Mode>('forward')

  const phrase = phrases[phraseIndex] ?? ''

  useEffect(() => {
    setPhraseIndex(0)
    setCharIndex(reduceMotion ? (phrases[0]?.length ?? 0) : 0)
    setMode('forward')
  }, [phrases, reduceMotion])

  useEffect(() => {
    if (reduceMotion) return
    if (!phrase) return

    let id: ReturnType<typeof setTimeout>

    if (mode === 'forward') {
      if (charIndex < phrase.length) {
        id = setTimeout(() => setCharIndex((c) => c + 1), TYPE_MS)
      } else {
        id = setTimeout(() => setMode('back'), HOLD_MS)
      }
    } else {
      if (charIndex > 0) {
        id = setTimeout(() => setCharIndex((c) => c - 1), DELETE_MS)
      } else {
        id = setTimeout(() => {
          setPhraseIndex((i) => (phrases.length ? (i + 1) % phrases.length : 0))
          setMode('forward')
        }, BETWEEN_MS)
      }
    }

    return () => clearTimeout(id)
  }, [mode, charIndex, phrase, phrase.length, phrases.length, reduceMotion])

  const visible = reduceMotion ? (phrases[0] ?? '') : phrase.slice(0, charIndex)

  return (
    <div
      className="min-h-[2rem] text-left text-[1.0625rem] font-medium leading-snug tracking-[-0.01em] text-[#5c5650] md:min-h-[2.125rem] md:text-[1.1875rem]"
      aria-live={reduceMotion ? 'off' : 'polite'}
      aria-label={ariaLabel}
    >
      <span className="whitespace-pre-wrap">{visible}</span>
      {reduceMotion ? (
        <span aria-hidden className="ml-px inline-block font-light text-[#1a1816]">
          |
        </span>
      ) : (
        <motion.span
          aria-hidden
          className="ml-px inline-block font-light text-[#1a1816]"
          animate={{ opacity: [1, 1, 0, 0] }}
          transition={{
            duration: 1.05,
            repeat: Infinity,
            ease: 'linear',
            times: [0, 0.52, 0.52, 1],
          }}
        >
          |
        </motion.span>
      )}
    </div>
  )
}
