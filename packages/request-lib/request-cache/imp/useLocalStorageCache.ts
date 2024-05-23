import type { AsyncCacheStore } from '../asyncCacheStore'

class LocalStorageCacheStore implements AsyncCacheStore {
  private storage: Storage

  constructor() {
    this.storage = localStorage
  }

  async get<T>(key: string): Promise<T | undefined> {
    const item = this.storage.getItem(key)
    if (item) {
      return JSON.parse(item) as T
    }
    return undefined
  }

  async set<T>(key: string, value: T): Promise<void> {
    this.storage.setItem(key, JSON.stringify(value))
  }

  async delete(key: string): Promise<void> {
    this.storage.removeItem(key)
  }

  async has(key: string): Promise<boolean> {
    return this.storage.getItem(key) !== null
  }
}

export function useLocationStorageCache() {
  return new LocalStorageCacheStore()
}
