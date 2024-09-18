import { jsonParse } from "."

/**本地存储的数据 */
export interface LocalhostData {
    /**用户token */
    token: string,
}
/**二次封装的本地存储，添加ts类型支持 */
class LocalStore<T extends Record<string, any>, key extends string = Extract<keyof T, string>>   {
    /**获取数据。会从JSON转回对象。如果localStorage中没有该值，则将返回null */
    getItem<D extends key>(key: D): T[D] | null {
        const data = localStorage.getItem(key) || "null"//这样JSON.parse解析出来的就是null
        try {
            const res = jsonParse<T[D]>(data)
            return res
        } catch (error) {//如果出现报错，那么就返回原数据
            console.log('getItem出错', error)
            return data as T[D]
        }
    }
    /**设置数据。会帮忙把对象转为JSON存储 */
    setItem<D extends key>(key: D, value: T[D]) {
        if (!key || value == undefined) {
            console.log('setItem - 请传递正确的参数');
            return
        }
        localStorage.setItem(key, JSON.stringify(value))
    }
    /**移除数据 */
    removeItem(key: key) {
        localStorage.removeItem(key)
    }
}
/**二次封装的本地存储实例，添加ts类型支持 */
const localStore = new LocalStore<LocalhostData>()
export default localStore