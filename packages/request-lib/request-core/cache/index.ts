import { requestCache } from '../index'
import type { AsyncCacheStore } from './asyncCacheStore'
import type { CacheItem } from './cacheItem'

export class CacheManager {
  private store: AsyncCacheStore

  constructor(store: AsyncCacheStore) {
    this.store = store
  }

  static create(store: AsyncCacheStore): CacheManager {
    return new CacheManager(store)
  }

  async get<T>(key: string): Promise<T | undefined> {
    const item = await this.store.get<CacheItem<T>>(key)
    if (item?.noExpire) {
      return item.value
    } else {
      if (item && item.expiration > Date.now()) {
        return item.value
      } else {
        if (item) {
          await this.store.delete(key) // 删除过期的缓存项
        }
        return undefined
      }
    }
  }

  async getNormal<T>(key: string): Promise<T | undefined> {
    const item = await this.store.get<CacheItem<T>>(key)
    return item?.value
  }

  async set<T>(key: string, value: T, ttl?: number): Promise<void> {
    let expiration = 0
    let noExpire = false
    if (!ttl) {
      noExpire = true
    } else {
      expiration = Date.now() + ttl
    }

    await this.store.set(key, { value, expiration, noExpire })
  }

  async delete(key: string): Promise<void> {
    await this.store.delete(key)
  }

  async has(key: string): Promise<boolean> {
    return this.store.has(key)
  }
}

export function useCache(isPersist: boolean) {
  return CacheManager.create(
    isPersist ? requestCache.persistCache : requestCache.memoryCache
  )
}
