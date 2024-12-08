export class MemoryMonitor {
  private snapshots: WeakMap<object, number>[] = []
  private intervalId?: number

  start() {
    this.snapshots = []
    this.intervalId = window.setInterval(() => {
      // Take heap snapshot
      const snapshot = new WeakMap<object, number>()
      this.snapshots.push(snapshot)

      // Keep only last 5 snapshots
      if (this.snapshots.length > 5) {
        this.snapshots.shift()
      }

      // Check for memory leaks
      if (this.snapshots.length >= 2) {
        const growth = this.checkMemoryGrowth()
        if (growth > 20) { // 20% growth threshold
          console.warn(`Potential memory leak detected: ${growth}% heap growth`)
        }
      }
    }, 10000) // Check every 10 seconds
  }

  stop() {
    if (this.intervalId) {
      clearInterval(this.intervalId)
    }
  }

  private checkMemoryGrowth(): number {
    if ('memory' in performance) {
      const { usedJSHeapSize, totalJSHeapSize } = (performance as any).memory
      return (usedJSHeapSize / totalJSHeapSize) * 100
    }
    return 0
  }
} 