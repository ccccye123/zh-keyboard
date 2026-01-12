export interface KeyRepeatOptions {
  /** Long-press delay before repeating starts (ms). */
  delay?: number
  /** Repeat interval after the initial delay (ms). */
  interval?: number
}

export interface KeyRepeater {
  start: (action: () => void) => void
  stop: () => void
}

/**
 * Create a small, framework-agnostic key repeater for long-press.
 *
 * - Calls `action()` immediately on start.
 * - After `delay`, repeats with `interval` until `stop()` is called.
 */
export function createKeyRepeater(options: KeyRepeatOptions = {}): KeyRepeater {
  const delay = options.delay ?? 400
  const interval = options.interval ?? 60

  let delayTimer: ReturnType<typeof setTimeout> | undefined
  let intervalTimer: ReturnType<typeof setInterval> | undefined

  function stop() {
    if (delayTimer) {
      clearTimeout(delayTimer)
      delayTimer = undefined
    }
    if (intervalTimer) {
      clearInterval(intervalTimer)
      intervalTimer = undefined
    }
  }

  function start(action: () => void) {
    stop()

    action()

    delayTimer = setTimeout(() => {
      intervalTimer = setInterval(() => {
        action()
      }, interval)
    }, delay)
  }

  return { start, stop }
}
