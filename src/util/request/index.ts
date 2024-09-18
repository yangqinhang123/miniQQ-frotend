import type {
  AxiosError,
  AxiosResponse,
  InternalAxiosRequestConfig,
} from "axios";
import { showTip, sliceStr } from "..";
import MyRequest, {
  addPendingRequest,
  getRequestKey,
  handlePostData,
  removePendingRequest,
  removeRepetitiveRequest,
} from "./axios";
import type { OtherDownloadReq } from "@/api/types/other";
import localStore from "../LocalStore";
import { ResCode, type ResponseData } from "./code";
import { next_reqBaseURL } from "@/lib/config";
/**前端专属的类 */
class FrontRequest extends MyRequest {
  /**前端部分 - 请求blob数据并下载 - get方式
   * @param url url。注意，此处需要自己写根路径
   * @param data post参数
   * @param name 导出的文件名，需要包含后缀
   * @template T 请求参数类型
   */
  public downloadFile<T extends Record<string, any>>(
    url: string,
    data: T,
    name: string
  ): Promise<void> {
    return new Promise(async (resolve, reject) => {
      try {
        showTip("正在下载，请稍后", "success");
        const res = await request.get<Blob, T>(url, data, {
          responseType: "blob",
          baseURL: "",
        });
        const blob = new Blob([res]);
        const fileName = name;
        const elink = document.createElement("a");
        elink.download = fileName;
        elink.style.display = "none";
        elink.href = URL.createObjectURL(blob);
        document.body.appendChild(elink);
        elink.click();
        URL.revokeObjectURL(elink.href); // 释放URL 对象
        document.body.removeChild(elink);
        showTip("下载成功！");
        resolve();
      } catch (error: any) {
        showTip("下载失败，请联系管理员排查", "error");
        reject(error?.message || error);
      }
    });
  }
  /**下载非同源的图片和视频 */
  public async downloadByMyServer(url: string, name: string) {
    try {
      await request.downloadFile<OtherDownloadReq>(
        "/api/other/download",
        { url: encodeURIComponent(url) },
        name
      );
    } catch (error) {
      return Promise.reject(error);
    }
  }
}
/**默认的Request实例，给前端使用, 用来请求自己的Nextjs后端。 注：根路径为 /api */
const request = new FrontRequest(
  { baseURL: next_reqBaseURL, timeout: 100 * 1000 },
  (config) => {
    const urlArr = config.url?.split("/") || [];

    if (!config.noCancel) removeRepetitiveRequest(config); // 检查是否存在重复请求，若存在则取消已发的请求
    addPendingRequest(config); // 把当前请求信息添加到pendingRequest对象中

    if (urlArr[1] !== "log") {
      // 不是日志记录的就弹窗 （日志记录统一以 /log 开头的路径）
      const { showTip: ifShowTip = true, tipText = "加载中" } = config;
      if (ifShowTip) showTip(tipText, "warning"); //添加弹窗
    }

    //请求拦截器，添加token
    const token = localStore.getItem("token");
    if (token) {
      config.headers!.Authorization = token;
    }
    //添加自定义的log字段
    config.headers.log = createLog(config);
  },
  [
    (res: AxiosResponse<ResponseData>) => {
      removePendingRequest(res.config); //请求成功了就移除请求
      if (res.data.code === 200) {
        if (res.headers.token) {
          console.log("前端刷新token", res.headers.token);
          localStore.setItem("token", res.headers.token);
        }
        return res.data.data; //直接返回装着数据的data
      } else {
        if (res.data instanceof Blob) return res.data; //如果返回的是blob，就放行
        let message = res.data.message;
        switch (res.data.code) {
          case ResCode.BAD_REQUEST: //参数错误
          case ResCode.FAIL_REQUEST: //请求失败 - 当前不可用
            break;
          case ResCode.UNAUTHORIZED: //无整个权限
            setTimeout(() => {
              localStore.removeItem("token");
              // window.location.assign(YYportal);
              window.location.assign("/");
            }, 1000);
            break;
          case ResCode.FORBIDDEN: //无模块权限
            setTimeout(() => {
              window.location.assign("/");
            }, 1000);
            break;
          case ResCode.SERVER_ERROR: //系统错误
            message = "系统错误，请联系管理员排查问题";
            // router.push('/registration')
            break;
          default:
            message = "未知错误，请检查网络或联系管理员";
            console.log("未知请求错误 ", res.data);
            break;
        }
        console.log(1111111);

        showTip(`${message}`, "error");
        return Promise.reject(message); //返回提示信息，可能可以在catch中用到
      }
    },
    (err: AxiosError) => {
      console.log(err);
      const config = err.config || ({} as InternalAxiosRequestConfig<any>);

      removePendingRequest(config); // 从pendingRequest对象中移除请求

      //如果是被取消的请求
      if (err.code === "ERR_CANCELED") {
        console.log("被取消的重复请求：" + err.message);
        return Promise.reject("请求重复，取消");
      }

      // 这里用来处理http常见错误，进行全局提示
      let message = err.message;
      // 这里错误消息可以使用全局弹框展示出来
      showTip(`${message}，请检查网络或联系管理员！`, "error");
      // 这里是AxiosError类型，所以一般我们只reject我们需要的响应即可
      return Promise.reject(err); //.response
    },
  ]
);
export default request;
/**下载文件 */
export const downloadFile = request.downloadFile;
/**下载非同源的图片视频 */
export const downloadByMyServer = request.downloadByMyServer;
/**把一些请求信息制作成log，放入headers的自定义字段里，用于日志记录 */
const createLog = (config: InternalAxiosRequestConfig) => {
  const params = handlePostData(config);
  const res = [`🔗: /api${config.url}`];
  if (params) {
    res.push(`🧾: ${sliceStr(params, 500, " [参数过长，已截断]")}`);
  }
  return encodeURIComponent(res.join(" | ")); // 需要编码避免报错
};
