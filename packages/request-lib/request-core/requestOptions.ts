// RequestMethod.ts
export interface RequestOptions {
    url: string;
    params?: Record<string, any>;
    data?: Record<string, any>;
    headers?: Record<string, string>;
}

export type RequestOptionsType = (options: RequestOptions) => Promise<any>;