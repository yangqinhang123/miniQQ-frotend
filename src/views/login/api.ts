import request from "@/util/request";
/**登录 - 请求参数 */
export interface LoginParam {
  /**qq号 */
  user_name: string;
  /**密码 */
  user_pwd: string;
}
/**登录 - 返回结果 */
export interface LoginRes {
  /**是否成功 */
  isOk: boolean;
  msg: string;
  /**成功返回token */
  token?: string;
}
/**
 * 登录
 * @param user_name qq号
 * @param user_pwd 密码
 * @returns
 */
export const loginReq = async (user_name: string, user_pwd: string) => {
  return request.post<LoginRes, LoginParam>("/login", { user_name, user_pwd });
};
