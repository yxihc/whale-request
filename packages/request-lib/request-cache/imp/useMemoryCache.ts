import type { AsyncCacheStore } from '../asyncCacheStore'

class MemoryCacheStore implements AsyncCacheStore {
  private store: Map<string, any> = new Map()

  async get<T>(key: string): Promise<T | undefined> {
    return this.store.get(key)
  }

  async set<T>(key: string, value: T): Promise<void> {
    this.store.set(key, value)
  }

  async delete(key: string): Promise<void> {
    this.store.delete(key)
  }

  async has(key: string): Promise<boolean> {
    return this.store.has(key)
  }
}

export function useMemoryCache() {
  return new MemoryCacheStore()
}
