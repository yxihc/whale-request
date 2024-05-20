// RequestMethod.ts
export interface RequestOptions {
    url: string;
    params?: Record<string, any>;
    data?: Record<string, any>;
    headers?: Record<string, string>;
    cache?:CacheOptions
}

export interface CacheOptions{
    useCache?: boolean;
    //是否持久化存储
    isPersist?:boolean
    // 缓存时间
    duration?:number
    // 缓存的key
    key?(config:RequestOptions):string
    // 自定义缓存是否有效，提供该配置后，duration配置失效
    // key表示缓存键， config表示此次请求配置
    // 返回true表示缓存有效，返回false缓存无效。
    isValid?(key:string, config:RequestOptions):boolean
}


export type RequestOptionsType = (options: RequestOptions) => Promise<any>;