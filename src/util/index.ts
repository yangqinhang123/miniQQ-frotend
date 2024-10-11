import { showNotify, type NotifyType, type NotifyOptions } from "vant";
import { ElMessage } from "element-plus";
// type NoticeType = 'success' | ''
// /**弹窗，展示信息;
//  * @param message 要提示的文字，或者一个ReactNode
//  * @param type 类型，默认"success"。
//  * @param duration 显示时间，单位s，默认2s ，0代表不关闭
//  * @returns 返回弹窗实例，可以进行.then等
//  */
// export function showTip(
//   message: string,
//   type: NotifyType = "success",
//   duration: number = 2000,
//   otherOptions: NotifyOptions = {
//     teleport: document.body.querySelector('#app')
//   }
// ) {
//   console.log('提示');

//   showNotify(
//     mergeObj(
//       {
//         type,
//         message,
//         duration,
//         zIndex: 99999,
//       },
//       otherOptions
//     )
//   );
// }

/**使用element弹窗，展示信息
 * @param message 要提示的文字
 * @param type 类型，默认"success"。 "error"红色 | "info"灰色 | "success"绿色 |"warning"橙色
 * @param duration 持续时间，单位ms，默认2000
 */
export function showTip(
  message: string,
  type: "success" | "error" | "info" | "warning" = "success",
  duration: number = 2000
) {
  ElMessage({
    message,
    type,
    duration,
    showClose: true,
    offset: 128
  });
}

type Obj = Record<any, any>;
type UnionToIntersection<U> = (
  U extends any ? (arg: U) => void : never
) extends (arg: infer I) => void
  ? I
  : never;
/**合并对象。 基于Object.assign。
 * @param mainObj 主对象。不能为空
 * @param otherObj 要被合并到主对象上的对象
 * @returns 返回一个新对象，避免修改原始对象
 */
export const mergeObj = <T extends Obj, D extends Obj[]>(
  mainObj: T,
  ...otherObj: D
): T & UnionToIntersection<D[number]> => {
  return Object.assign({}, mainObj, ...otherObj);
};

/**传入泛型就有类型提示的 JSON.parse  */
export const jsonParse = <T>(json: string): T => {
  return JSON.parse(json) as T;
};

/**超出长度截断字符串，可以添加末尾字符
 * @param str 字符串
 * @param maxLength 最大长度
 * @param tip 如果超出长度，末尾的提示字符
 * @returns 新字符串
 */
export const sliceStr = (str: string, maxLength: number, tip = "") => {
  if (str.length < maxLength) return str;
  else return str.slice(0, maxLength) + tip;
};

export const generateUUID = () => {
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function (c) {
    const r = (Math.random() * 16) | 0; // 生成随机数
    const v = c === "x" ? r : (r & 0x3) | 0x8; // 根据规则替换
    return v.toString(16);
  });
};
