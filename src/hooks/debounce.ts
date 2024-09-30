/**
 * 防抖
 * @param fn 需要防抖的函数
 * @param interval 时间间隔，单位为ms
 * @returns 
 */
export function debounce(fn: (...params: any) => any, interval: number) {
  let timerId: number | null = null;
  return function () {
    if (timerId) {
      clearTimeout(timerId);
    }
    timerId = setTimeout(() => {
      fn();
    }, interval);
  };
}
