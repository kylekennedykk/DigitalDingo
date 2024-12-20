type RenderTask = {
  id: string
  priority: number
  execute: () => void
}

export class RenderQueue {
  private queue: RenderTask[] = []
  private isProcessing = false
  private frameTime = 16.67 // Target 60fps

  add(task: RenderTask) {
    this.queue.push(task)
    this.queue.sort((a, b) => b.priority - a.priority)
    
    if (!this.isProcessing) {
      this.process()
    }
  }

  private process() {
    this.isProcessing = true
    const startTime = performance.now()

    while (this.queue.length > 0) {
      const task = this.queue[0]
      const currentTime = performance.now()
      
      // Check if we have time in this frame
      if (currentTime - startTime > this.frameTime) {
        requestAnimationFrame(() => this.process())
        return
      }

      // Execute task
      task.execute()
      this.queue.shift()
    }

    this.isProcessing = false
  }

  clear() {
    this.queue = []
    this.isProcessing = false
  }
} 