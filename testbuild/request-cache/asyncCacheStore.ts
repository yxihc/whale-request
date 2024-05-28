export interface AsyncCacheStore {
  get<T>(key: string): Promise<T | undefined>

  set<T>(key: string, value: T): Promise<void>

  has(key: string): Promise<boolean>

  delete(key: string): Promise<void>
}
