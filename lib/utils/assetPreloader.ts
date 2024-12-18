export class AssetPreloader {
  private loadedAssets: Map<string, HTMLImageElement | HTMLAudioElement> = new Map()
  private loadPromises: Map<string, Promise<void>> = new Map()

  preloadImage(url: string): Promise<void> {
    if (this.loadPromises.has(url)) {
      return this.loadPromises.get(url)!
    }

    const promise = new Promise<void>((resolve, reject) => {
      const img = new Image()
      img.onload = () => {
        this.loadedAssets.set(url, img)
        resolve()
      }
      img.onerror = reject
      img.src = url
    })

    this.loadPromises.set(url, promise)
    return promise
  }

  preloadAudio(url: string): Promise<void> {
    if (this.loadPromises.has(url)) {
      return this.loadPromises.get(url)!
    }

    const promise = new Promise<void>((resolve, reject) => {
      const audio = new Audio()
      audio.oncanplaythrough = () => {
        this.loadedAssets.set(url, audio)
        resolve()
      }
      audio.onerror = reject
      audio.src = url
    })

    this.loadPromises.set(url, promise)
    return promise
  }

  getAsset(url: string) {
    return this.loadedAssets.get(url)
  }

  clear() {
    this.loadedAssets.clear()
    this.loadPromises.clear()
  }
} 