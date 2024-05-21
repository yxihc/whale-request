// RequestMethod.ts
export interface RequestOptions {
  //请求地址
  url: string
  params?: Record<string, any>
  data?: Record<string, any>
  headers?: Record<string, string>
  useCache?: boolean
  cache?: CacheOptions
  retry?: number
  retryInterval?: number
}

export interface CacheOptions {
  //是否持久化存储
  isPersist?: boolean
  // 缓存时间
  duration?: number
  // 缓存的key
  key?(config: RequestOptions): string
  // 自定义缓存是否有效，提供该配置后，duration配置失效
  // key表示缓存键， config表示此次请求配置
  // 返回true表示缓存有效，返回false缓存无效。
  isValid?(key: string, config: RequestOptions): boolean
}

// const actualErrorRetryInterval = computed(() => {
//   if (errorRetryIntervalRef.value) return errorRetryIntervalRef.value;
//   const baseTime = 1000;
//   const minCoefficient = 1;
//   const maxCoefficient = 9;
//   // When retrying for the first time, in order to avoid the coefficient being 0
//   // so replace 0 with 2, the coefficient range will become 1 - 2
//   const coefficient = Math.floor(
//     Math.random() * 2 ** Math.min(retriedCount.value, maxCoefficient) +
//     minCoefficient,
//   );
//   return baseTime * coefficient;
// });

export type RequestOptionsType = (options: RequestOptions) => Promise<any>
