import request from "@/util/request";

export interface DeleContactParamType {
  /**对方的qq号 */
  target_user: string;
}

/**
 * 删除联系人
 * @param target_user 对方的qq号
 * @returns
 */
export const deleContactReq = (target_user: string) => {
  return request.post<any, DeleContactParamType>("/contact/deleContact", {
    target_user,
  });
};
