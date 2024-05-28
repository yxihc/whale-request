interface AsyncCacheStore {
    get<T>(key: string): Promise<T | undefined>;
    set<T>(key: string, value: T): Promise<void>;
    has(key: string): Promise<boolean>;
    delete(key: string): Promise<void>;
}

declare class CacheManager {
    private store;
    constructor(store: AsyncCacheStore);
    static create(store: AsyncCacheStore): CacheManager;
    get<T>(key: string): Promise<T | undefined>;
    getNormal<T>(key: string): Promise<T | undefined>;
    set<T>(key: string, value: T, ttl?: number): Promise<void>;
    delete(key: string): Promise<void>;
    has(key: string): Promise<boolean>;
}
declare const requestCache: {
    memoryCache: AsyncCacheStore;
    persistCache: AsyncCacheStore;
};
declare function injectCache(memoryCache: AsyncCacheStore, persistCache: AsyncCacheStore): void;
declare function useCache(isPersist: boolean): CacheManager;

interface CacheItem<T> {
    value: T;
    noExpire: boolean;
    expiration: number;
}

declare class LocalStorageCacheStore implements AsyncCacheStore {
    private storage;
    constructor();
    get<T>(key: string): Promise<T | undefined>;
    set<T>(key: string, value: T): Promise<void>;
    delete(key: string): Promise<void>;
    has(key: string): Promise<boolean>;
}
declare function useLocationStorageCache(): LocalStorageCacheStore;

declare class MemoryCacheStore implements AsyncCacheStore {
    private store;
    get<T>(key: string): Promise<T | undefined>;
    set<T>(key: string, value: T): Promise<void>;
    delete(key: string): Promise<void>;
    has(key: string): Promise<boolean>;
}
declare function useMemoryCache(): MemoryCacheStore;

declare class SessionStorageCacheStore implements AsyncCacheStore {
    private storage;
    constructor();
    get<T>(key: string): Promise<T | undefined>;
    set<T>(key: string, value: T): Promise<void>;
    delete(key: string): Promise<void>;
    has(key: string): Promise<boolean>;
}
declare function useSessionStorageCache(): SessionStorageCacheStore;

interface RequestOptions {
    url?: string;
    baseUrl?: string;
    params?: Record<string, any>;
    data?: Record<string, any>;
    headers?: Record<string, string>;
    useCache?: boolean;
    cache?: CacheOptions;
    retry?: number;
    retryInterval?: number;
}
interface CacheOptions {
    isPersist?: boolean;
    duration?: number;
    key?(config: RequestOptions): string;
    isValid?(key: string, config: RequestOptions): boolean;
}
type RequestOptionsType = (options: RequestOptions) => Promise<any>;
declare const defaultRequestOptions: RequestOptions;
declare function getDefaultCacheOptions(): CacheOptions;

type RequestInterceptor = (options: RequestOptions) => RequestOptions | Promise<RequestOptions>;
type ResponseInterceptor = (response: any) => any | Promise<any>;
type ErrorInterceptor = (error: any) => any | Promise<any>;

interface Requestor {
    get: RequestOptionsType;
    post: RequestOptionsType;
    put?: RequestOptionsType;
    delete?: RequestOptionsType;
    requestInterceptors?: RequestInterceptor[];
    responseInterceptors?: ResponseInterceptor[];
    errorInterceptors?: ErrorInterceptor[];
}

declare function actualErrorRetryInterval(retriedCount: number): number;

declare class WhaleRequest implements Requestor {
    private client;
    static create(client: Requestor): WhaleRequest;
    constructor(client: Requestor);
    private applyRequestInterceptors;
    private applyResponseInterceptors;
    private applyInterceptors;
    private applyErrorInterceptors;
    private getCachedResponse;
    private applyCache;
    private retry;
    private request;
    private normalizeOptions;
    get(options: RequestOptions): Promise<RequestOptions>;
    post(options: RequestOptions): Promise<RequestOptions>;
}
declare let whaleRequest: WhaleRequest;
declare function inject(requestor: Requestor): void;
declare function useRequestor(): Requestor;
declare function setGlobalOptions(options: RequestOptions): void;

export { AsyncCacheStore, CacheItem, CacheManager, CacheOptions, ErrorInterceptor, RequestInterceptor, RequestOptions, RequestOptionsType, Requestor, ResponseInterceptor, actualErrorRetryInterval, defaultRequestOptions, getDefaultCacheOptions, inject, injectCache, requestCache, setGlobalOptions, useCache, useLocationStorageCache, useMemoryCache, useRequestor, useSessionStorageCache, whaleRequest };
