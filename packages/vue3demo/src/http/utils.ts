export function debounce<T extends (...args: any[]) => Promise<any>>(func: T, wait: number): (...args: Parameters<T>) => Promise<ReturnType<T>> {
    let timeout: NodeJS.Timeout;
    return (...args: Parameters<T>): Promise<ReturnType<T>> => {
        return new Promise((resolve, reject) => {
            if (timeout) clearTimeout(timeout);

            timeout = setTimeout(() => {
                func(...args).then(resolve).catch(reject);
            }, wait);
        });
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