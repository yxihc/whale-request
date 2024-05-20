import {AsyncCacheStore} from "./asyncCacheStore"
import {CacheItem} from "./cacheItem"

class CacheManager implements AsyncCacheStore {
    private store: AsyncCacheStore;
    constructor(store: AsyncCacheStore) {
        this.store = store;
    }

    static create(store: AsyncCacheStore): AsyncCacheStore {
        return new CacheManager(store);
    }
    async get<T>(key: string): Promise<T | undefined> {
        const item = await this.store.get<CacheItem<T>>(key);
        if (item?.noExpire) {
            return item.value;
        } else {
            if (item && item.expiration > Date.now()) {
                return item.value;
            } else {
                if (item) {
                    await this.store.delete(key); // 删除过期的缓存项
                }
                return undefined;
            }
        }
    }

    async getNromal<T>(key: string): Promise<T | undefined> {
        const item = await this.store.get<CacheItem<T>>(key);
        return item.value;
    }
    async set<T>(key: string, value: T, ttl?: number): Promise<void> {
        const expiration = Date.now() + ttl;
        let noExpire = false
        if (!ttl) noExpire = true
        await this.store.set(key, {value, expiration, noExpire});
    }
    async delete(key: string): Promise<void> {
        await this.store.delete(key);
    }

    async has(key: string): Promise<boolean> {
        return await this.store.has(key);
    }
}

import {useMemoryCache} from "./imp/useMemoryCache";
import {useLocationStorageCache} from "./imp/useLocalStorageCache";


export function useCache (isPersist:boolean):AsyncCacheStore{
    return CacheManager.create(isPersist?useLocationStorageCache():useMemoryCache())
}

async function exampleUsage() {
    const memoryStore = useCache(true);
    const cacheManager = new CacheManager(memoryStore);

    await cacheManager.set("key1", "value1", 2000); // 缓存 10 秒
    console.log(await cacheManager.get<string>("key1")); // 输出: value1

    setTimeout(async () => {
        console.log(await cacheManager.get<string>("key1")); // 输出: undefined（缓存过期）
    }, 3000);
}

// exampleUsage();