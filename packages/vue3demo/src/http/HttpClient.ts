import { RequestInterceptor, ResponseInterceptor, ErrorInterceptor } from './Interceptors.ts';
import {RequestMethod} from "./RequestOptions.ts";

export interface HttpClient {
    get: RequestMethod;
    post: RequestMethod;
    put?: RequestMethod;
    delete?: RequestMethod;
    requestInterceptors?: RequestInterceptor[];
    responseInterceptors?: ResponseInterceptor[];
    errorInterceptors?: ErrorInterceptor[];
}