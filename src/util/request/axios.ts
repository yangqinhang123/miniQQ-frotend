import axios from 'axios'
import type { AxiosError, AxiosInstance, AxiosInterceptorOptions, AxiosRequestConfig, AxiosResponse, Canceler, InternalAxiosRequestConfig } from 'axios'
// import { mergeObj, showTip } from '@/lib/util';
// import { ResponseData } from "@/app/api/util/res/code";
import { mergeObj } from '..';
import type { ResponseData } from './code';
/**响应拦截器的类型 */
type ResponseUse = [((value: any) => any | Promise<any>) | null, ((error: any) => any) | null, AxiosInterceptorOptions?]
/**自定义普通config字段 */
export interface MyAxiosRequestConfig<T = any> extends AxiosRequestConfig<T> {
    /**要弹窗展示的文字，默认“加载中” */
    tipText?: string
    /**是否弹窗展示加载提示, 默认true 展示加载提示 */
    showTip?: boolean
    /**是否让这个请求不受“取消重复请求”影响，默认false受影响   */
    noCancel?: boolean
}
/**自定义请求拦截器config字段 */
export interface MyInternalAxiosRequestConfig<T = any> extends InternalAxiosRequestConfig<T> {
    /**要弹窗展示的文字，默认“加载中” */
    tipText?: string
    /**是否弹窗展示加载提示, 默认true 展示加载提示 */
    showTip?: boolean
    /**是否让这个请求不受“取消重复请求”影响，默认false受影响  */
    noCancel?: boolean
}
/**myRequest类，可以用来自定义传递配置来创建实例 */
class MyRequest {
    /**axios 实例 */
    instance: AxiosInstance
    /**基础配置。比如根路径，需要在不同的环境下用不同的根路径 */
    baseConfig: MyAxiosRequestConfig = { baseURL: '', timeout: 60000 }


    /**myRequest类 - 构造函数，在这里进行类的初始化，并配置拦截器等
     * @param config axios基础配置，比如baseURL等
     * @param requestUse 要在请求拦截器中做的事（注：只支持请求拦截成功的配置），参数是config
     * @param responseUse 响应拦截器，数组，分别对应拦截器的三个参数：成功拦截器，失败拦截器，配置
     */
    constructor(config: MyAxiosRequestConfig = {}, requestUse?: (config: MyInternalAxiosRequestConfig) => void | Promise<void>, responseUse?: ResponseUse) {
        // 使用axios.create创建axios实例，配置为基础配置和我们传递进来的配置
        this.instance = axios.create(mergeObj(this.baseConfig, config))
        //请求拦截器：在这里添加token
        this.instance.interceptors.request.use(
            async (config: MyInternalAxiosRequestConfig) => {
                requestUse && await requestUse(config) //注入用户自定义配置 
                return config
            },
            (err: any) => {
                return Promise.reject(err)
            },
        );
        //响应拦截器
        this.instance.interceptors.response.use(
            (res: AxiosResponse<ResponseData>) => {
                return res
            },
            (err: AxiosError) => {
                return Promise.reject(err) //.response
            });
        responseUse && this.instance.interceptors.response.use(...responseUse);
    }

    /** 普通请求方法 
     * @param config 请求配置，遵循axios的配置 
     */
    public request(config: MyAxiosRequestConfig): Promise<AxiosResponse> {
        return this.instance.request(config)
    }
    /** get方法
     * @param url 请求路径 query可以写在里面
     * @param data 请求参数，可以把参数写为一个对象传递在这里，我会把对象转为query查询字符串
     * @param config 请求配置 
     * @template T 返回值类型
     * @template D 请求参数类型 
     */
    public get<T = any, D = Record<string, any>>(url: string, data?: D, config?: MyAxiosRequestConfig): Promise<T> {
        /**转换后的query参数 */
        let query = ""
        //进行对象转query
        if (data) {
            for (let i in data) { // 循环遍历对象
                let value = data[i] as string  // 定义变量接收对象的value值
                if (Array.isArray(value)) {// 若对象的value值为数组
                    value = value.join(",") //则进行join打断
                }
                query += `&${i}=${value}`// 进行字符串拼接
            }
            query = query.replace('&', '?')// 把第一个&替换为?
        }
        return new Promise(async (resolve, reject) => {
            try {
                const res = await this.instance.get<T>(url + query, config) as T //因为前面拦截器，这里得到的实际就是最后的数据
                resolve(res)
            } catch (error: any) {
                reject(error?.message || error?.data || error)
            }
        })
    }

    //函数重载
    /**  post方法 
     * @param url 请求路径，如果有query参数请写在这
     * @param data body请求参数
     * @param config post请求配置 
     * @template T 返回值类型 
     */
    public post<T>(url: string, data?: undefined, config?: MyAxiosRequestConfig): Promise<T>
    /**  post方法 
     * @param url 请求路径，如果有query参数请写在这
     * @param data body请求参数
     * @param config post请求配置 
     * @template T 返回值类型
     * @template D 请求参数类型 ：如果传递了泛型D，将会有ts报错提示传参
     */
    public post<T, D>(url: string, data: D, config?: MyAxiosRequestConfig): Promise<T>
    //函数重载的实现
    public post<T = any, D = undefined>(url: string, data?: D, config?: MyAxiosRequestConfig): Promise<T> {
        return new Promise(async (resolve, reject) => {
            try {
                const res = await this.instance.post<T>(url, data, config) as T //因为前面拦截器，这里得到的实际就是最后的数据
                resolve(res)
            } catch (error: any) {
                reject(error?.message || error?.data || error)
            }
        })
    }

    /**POST方法，以表单形式请求  （帮你填写了header） */
    public async postByForm<T = any, D = Record<string, any>>(url: string, data: D, config: MyAxiosRequestConfig = {}): Promise<T> {
        return new Promise(async (resolve, reject) => {
            try {              
                const res = await this.post<T, D>(url, data, Object.assign(config, {
                    headers: {
                        "content-type": "application/x-www-form-urlencoded",
                        ...config.headers
                    },
                }))
                resolve(res)
            } catch (error: any) {
                reject(error) //这里复用post，所以返回error就整个返回
            }
        })
    }
    /** put方法
     * @param url 请求路径
     * @param data 请求参数
     * @param config  请求配置
     * @template T 返回值类型
     * @template D 请求参数类型 
     */
    public put<T = any, D = Record<string, any>>(url: string, data?: D, config?: MyAxiosRequestConfig): Promise<T> {
        return new Promise(async (resolve, reject) => {
            try {
                const res = await this.instance.put<T>(url, data, config) as T //因为前面拦截器，这里得到的实际就是最后的数据
                resolve(res)
            } catch (error: any) {
                reject(error?.message || error?.data || error)
            }
        })
    }
    /** delete方法 
     * @param url 请求路径
     * @param config 请求参数 
     * @template T 返回值类型
     * @template D 请求参数类型 
     */
    public delete<T = any, D = Record<string, any>>(url: string, config?: MyAxiosRequestConfig): Promise<T> {
        return new Promise(async (resolve, reject) => {
            try {
                const res = await this.instance.delete<T>(url, config) as T //因为前面拦截器，这里得到的实际就是最后的数据
                resolve(res)
            } catch (error: any) {
                reject(error?.message || error?.data || error)
            }
        })
    }

}
export default MyRequest

//#region 下面是防止重复请求的代码

/**请求列表 */
export const pendingRequest = new Map<string, Canceler>();
/** 传入axios的config 函数返回唯一的请求key **/
export function getRequestKey(config: MyInternalAxiosRequestConfig) {
    let { method, url, params, data, } = config;
    const keyList = [method, url]

    const handleData = handlePostData(config)
    if (handleData) keyList.push(handleData)

    return keyList.join('&')
};
/**处理post请求的data */
export const handlePostData = (config: MyInternalAxiosRequestConfig): string | undefined => {
    const { data } = config;
    //如果有body参数的话，也进行处理
    if (data) {
        //请求拦截器中是对象，响应拦截器中是JSON
        if (typeof data === 'object') {
            return JSON.stringify(data)
        } else {
            return (data)
        }
    }
}

/**添加请求信息到Map中 */
export function addPendingRequest(config: MyInternalAxiosRequestConfig) {
    let requestKey = getRequestKey(config);
    config.cancelToken = config.cancelToken || new axios.CancelToken((cancel) => {
        if (!pendingRequest.has(requestKey)) {
            pendingRequest.set(requestKey, cancel);
        }
    });
}
/**把请求信息从map移除 */
export function removePendingRequest(config: MyInternalAxiosRequestConfig) {
    let requestKey = getRequestKey(config);
    pendingRequest.delete(requestKey)
}
/**取消重复请求 */
export function removeRepetitiveRequest(config: MyInternalAxiosRequestConfig) {
    let requestKey = getRequestKey(config);
    if (pendingRequest.has(requestKey)) {
        // 如果是重复的请求，则执行对应的cancel函数
        let cancel = pendingRequest.get(requestKey);
        cancel?.(requestKey);
        // 将前一次重复的请求移除
        pendingRequest.delete(requestKey);
    }
}
//#endregion