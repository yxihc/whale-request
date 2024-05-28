export interface RequestOptions {
  //请求地址
  url?: string
  baseUrl?: string
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

export type RequestOptionsType = (options: RequestOptions) => Promise<any>

export const defaultRequestOptions: RequestOptions = {
  cache: getDefaultCacheOptions(),
}

export function getDefaultCacheOptions(): CacheOptions {
  return {
    duration: 60 * 1000,
    key: (config: RequestOptions): string => {
      return defaultCacheKey(config)
    },
    isPersist: false,
  }
}

function defaultCacheKey(options: RequestOptions): string {
  // 请求缓存
  const cacheKey = `${options.url}_${JSON.stringify(
    options.params || {}
  )}_${JSON.stringify(options.data || {})}`
  return cacheKey
}
