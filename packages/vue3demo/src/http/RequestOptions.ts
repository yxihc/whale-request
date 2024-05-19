// RequestMethod.ts
export interface RequestOptions {
    url: string;
    params?: Record<string, any>;
    data?: Record<string, any>;
    headers?: Record<string, string>;
}

export type RequestMethod = (options: RequestOptions) => Promise<any>;