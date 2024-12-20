export const addPassiveEventListener = (
  element: HTMLElement | Window,
  eventName: string,
  handler: EventListener
) => {
  element.addEventListener(eventName, handler, { passive: true })
  return () => element.removeEventListener(eventName, handler)
} 