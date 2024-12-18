const moduleCache = new Map()

export function getCachedModule<T>(key: string, factory: () => T): T {
  if (!moduleCache.has(key)) {
    moduleCache.set(key, factory())
  }
  return moduleCache.get(key) as T
} 