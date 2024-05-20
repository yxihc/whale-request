interface AsyncCacheStore {
  get<T>(key: string): Promise<T | undefined>;
  set<T>(key: string, value: T): Promise<void>;
  delete(key: string): Promise<void>;
}

class CacheManager {
  private store: AsyncCacheStore;

  constructor(store: AsyncCacheStore) {
    this.store = store;
  }

  async get<T>(key: string): Promise<T | undefined> {
    const item = await this.store.get<CacheItem<T>>(key);
    if (item && item.expiration > Date.now()) {
      return item.value;
    } else {
      if (item) {
        await this.store.delete(key); // 删除过期的缓存项
      }
      return undefined;
    }
  }

  async set<T>(key: string, value: T, ttl: number): Promise<void> {
    const expiration = Date.now() + ttl * 1000;
    await this.store.set(key, { value, expiration });
  }

  async delete(key: string): Promise<void> {
    await this.store.delete(key);
  }
}

// 缓存项接口，包含数据和过期时间
interface CacheItem<T> {
  value: T;
  expiration: number; // 过期时间的时间戳
}


class MemoryCacheStore implements AsyncCacheStore {
  private store: Map<string, any> = new Map();

  async get<T>(key: string): Promise<T | undefined> {
    return this.store.get(key);
  }

  async set<T>(key: string, value: T): Promise<void> {
    this.store.set(key, value);
  }

  async delete(key: string): Promise<void> {
    this.store.delete(key);
  }
}


async function exampleUsage() {
  const memoryStore = new MemoryCacheStore();
  const cacheManager = new CacheManager(memoryStore);

  await cacheManager.set("key1", "value1", 10); // 缓存 10 秒
  console.log(await cacheManager.get<string>("key1")); // 输出: value1

  setTimeout(async () => {
    console.log(await cacheManager.get<string>("key1")); // 输出: undefined（缓存过期）
  }, 11000);
}

exampleUsage();
