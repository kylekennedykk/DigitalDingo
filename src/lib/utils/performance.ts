import { debounce } from 'lodash'

// Debounce window resize events
export const createResizeHandler = (handler: () => void) => 
  debounce(handler, 100, { leading: true, trailing: true })

// Debounce scroll events
export const createScrollHandler = (handler: () => void) =>
  debounce(handler, 50, { leading: true, trailing: true })

// RAF for smooth animations
export const rafScheduler = (callback: FrameRequestCallback) => {
  let rafId: number
  let lastTimestamp = 0
  
  const animate: FrameRequestCallback = (timestamp) => {
    if (timestamp - lastTimestamp > 16) { // ~60fps
      callback(timestamp)
      lastTimestamp = timestamp
    }
    rafId = requestAnimationFrame(animate)
  }
  
  rafId = requestAnimationFrame(animate)
  return () => cancelAnimationFrame(rafId)
} 

export const measurePerformance = (name: string) => {
  if (typeof performance === 'undefined') return () => {}
  
  const start = performance.now()
  return () => {
    const end = performance.now()
    console.debug(`${name} took ${end - start}ms`)
  }
}

export const deferredExecution = (fn: () => void, timeout = 0) => {
  if (typeof requestIdleCallback !== 'undefined') {
    requestIdleCallback(() => fn())
  } else {
    setTimeout(fn, timeout)
  }
}