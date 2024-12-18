import { MemoryMonitor } from './memoryMonitor'
import { AssetPreloader } from './assetPreloader'
import { RenderQueue } from './renderQueue'
import { resourcePool } from './threePool'

class PerformanceManager {
  private memoryMonitor = new MemoryMonitor()
  private assetPreloader = new AssetPreloader()
  private renderQueue = new RenderQueue()
  private isInitialized = false

  initialize() {
    if (this.isInitialized) return
    this.isInitialized = true

    // Start memory monitoring silently
    this.memoryMonitor.start()

    // Clean up on page unload
    window.addEventListener('unload', () => {
      this.cleanup()
    })
  }

  preloadAssets(urls: string[]) {
    return Promise.all(
      urls.map(url => {
        if (url.match(/\.(jpg|jpeg|png|gif|webp)$/i)) {
          return this.assetPreloader.preloadImage(url)
        }
        if (url.match(/\.(mp3|wav|ogg)$/i)) {
          return this.assetPreloader.preloadAudio(url)
        }
        return Promise.resolve()
      })
    )
  }

  queueRender(task: { id: string; priority: number; execute: () => void }) {
    this.renderQueue.add(task)
  }

  cleanup() {
    this.memoryMonitor.stop()
    this.assetPreloader.clear()
    this.renderQueue.clear()
    resourcePool.dispose()
  }
}

export const performanceManager = new PerformanceManager() 