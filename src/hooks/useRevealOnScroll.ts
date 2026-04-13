import { useLayoutEffect, type RefObject } from 'react'

const REVEAL_SCROLL_INSTANT_CLASS = 'reveal-scroll-instant'

export function useRevealOnScroll(
  containerRef: RefObject<HTMLElement | null>,
  cardSelector: string,
) {
  useLayoutEffect(() => {
    const root = containerRef.current
    if (!root) return

    const cards = [...root.querySelectorAll<HTMLElement>(cardSelector)]
    if (!cards.length) return

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      cards.forEach((c) => c.setAttribute('data-revealed', ''))
      return
    }

    const prevRects = new WeakMap<HTMLElement, DOMRectReadOnly>()

    function snapHiddenDirThenReveal(el: HTMLElement, dir: 'up' | 'down') {
      el.classList.add(REVEAL_SCROLL_INSTANT_CLASS)
      el.setAttribute('data-dir', dir)
      void el.offsetHeight
      el.classList.remove(REVEAL_SCROLL_INSTANT_CLASS)
      el.setAttribute('data-revealed', '')
    }

    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const el = entry.target as HTMLElement
          const rect = entry.boundingClientRect
          const prev = prevRects.get(el)
          const vh = window.innerHeight

          if (entry.isIntersecting) {
            const fromAbove = prev != null && prev.bottom <= 0
            if (fromAbove) {
              snapHiddenDirThenReveal(el, 'up')
            } else {
              snapHiddenDirThenReveal(el, 'down')
            }
          } else {
            if (rect.bottom < 0) {
              el.setAttribute('data-dir', 'down')
            } else if (rect.top > vh) {
              el.setAttribute('data-dir', 'up')
            }
            el.removeAttribute('data-revealed')
          }

          prevRects.set(el, rect)
        })
      },
      { threshold: 0, rootMargin: '0px 0px -6% 0px' },
    )

    /* Defer observe until after paint so above-the-fold cards keep a frame at hidden styles
       and the slide-in is visible (figures / stacked rows, not only the last bento cell). */
    let cancelled = false
    let raf2 = 0
    const raf1 = requestAnimationFrame(() => {
      if (cancelled) return
      raf2 = requestAnimationFrame(() => {
        if (cancelled) return
        cards.forEach((card) => io.observe(card))
      })
    })

    return () => {
      cancelled = true
      cancelAnimationFrame(raf1)
      cancelAnimationFrame(raf2)
      io.disconnect()
    }
  }, [containerRef, cardSelector])
}
