// Create a web worker for heavy calculations
const worker = new Worker(
  new URL('./calculation.worker.ts', import.meta.url)
)

export const calculateInWorker = (data: any) => {
  return new Promise((resolve) => {
    worker.postMessage(data)
    worker.onmessage = (e) => resolve(e.data)
  })
} 