export function debounce<T extends (...args: any[]) => Promise<any>>(func: T, wait: number): (...args: Parameters<T>) => Promise<ReturnType<T>> {
  let timeout: NodeJS.Timeout | null = null;
  let promise: Promise<ReturnType<T>> | null = null;
  let lastArgs: Parameters<T>;

  return (...args: Parameters<T>): Promise<ReturnType<T>> => {
    lastArgs = args;
    if (timeout) {
      clearTimeout(timeout);
    }

    if (!promise) {
      promise = new Promise((resolve, reject) => {
        timeout = setTimeout(() => {
          func(...lastArgs).then(result => {
            resolve(result);
            promise = null; // Reset promise for next call
          }).catch(error => {
            reject(error);
            promise = null; // Reset promise for next call
          });
        }, wait);
      });
    }

    return promise;
  };
}

export async function retry<T>(fn: () => Promise<T>, retries: number, interval: number,fun1:()=> Promise<T>): Promise<T> {
  let attempts = 0;
  while (attempts < retries) {
    try {
      return await fn();
    } catch (error) {
      attempts++;
      if (attempts >= retries) {
        fun1(error)
        throw error;
      }
      await new Promise(resolve => setTimeout(resolve, interval));
    }
  }
  throw new Error('Exceeded maximum retries');
}