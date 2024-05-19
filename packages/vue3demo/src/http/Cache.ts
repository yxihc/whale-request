// Cache.ts
class RequestCache {
    private cache: Map<string, any>;
    private ttl: number; // Time to live in milliseconds

    constructor(ttl = 60000) { // Default TTL is 1 minute
        this.cache = new Map();
        this.ttl = ttl;
    }

    set(key: string, value: any) {
        const expiry = Date.now() + this.ttl;
        this.cache.set(key, { value, expiry });
    }

    get(key: string) {
        const cached = this.cache.get(key);
        if (cached) {
            if (Date.now() < cached.expiry) {
                return cached.value;
            } else {
                this.cache.delete(key);
            }
        }
        return null;
    }
}

export const requestCache = new RequestCache();