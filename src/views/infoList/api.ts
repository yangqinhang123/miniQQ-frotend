import request from "@/util/request";
/**查询自己的联系人列表 - 请求参数 */
export interface QueryContactListParamType {
  user_name: string;
}
/**查询自己的联系人列表 - 返回结果 */
export interface QueryContactListResType {
  user_name: string;
  nickName: string;
  user_email: string;
  user_avatar: string;
}
/**
 * 查询自己的联系人列表
 * @param user_name 用户名
 * @returns
 */
export const queryContactListReq = async () => {
  return await request.get<QueryContactListResType[]>(
    "/contact/queryContactList"
  );
};
