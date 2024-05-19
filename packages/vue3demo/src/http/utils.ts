export function debounce(func: Function, wait: number) {
    let timeout: ReturnType<typeof setTimeout>;
    return function(...args: any[]) {
        clearTimeout(timeout);
        timeout = setTimeout(() => func.apply(this, args), wait);
    };
}

export function throttle(func: Function, limit: number) {
    let inThrottle: boolean;
    return function(...args: any[]) {
        if (!inThrottle) {
            func.apply(this, args);
            inThrottle = true;
            setTimeout(() => (inThrottle = false), limit);
        }
    };
}

const idempotentMap = new Map<string, Promise<any>>();

export function idempotentRequest(key: string, requestFunc: () => Promise<any>) {
    if (!idempotentMap.has(key)) {
        const promise = requestFunc().finally(() => idempotentMap.delete(key));
        idempotentMap.set(key, promise);
    }
    return idempotentMap.get(key);
}