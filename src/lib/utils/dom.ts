export const batchDOMUpdates = (updates: (() => void)[]) => {
  requestAnimationFrame(() => {
    const fragment = document.createDocumentFragment()
    updates.forEach(update => update())
    document.body.appendChild(fragment)
  })
} 