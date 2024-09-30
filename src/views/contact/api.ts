import request from "@/util/request";
/**查找用户 - 请求参数 */
export interface SearchUserParamType {
  /**qq号关键词 */
  key_word: string;
}
/**查找用户 - 返回结果 */
export interface SearchUserResType {
  /**qq号 */
  user_name: string;
  /**昵称 */
  nickName: string;
  /**邮箱 */
  user_email: string;
  /**头像 */
  user_avatar: string;
}
/**添加联系人 - 请求参数 */
export interface AddContactParamType {
  /**联系人A的qq号（自己或对方） */
  personA: string;
  /**联系人B的qq号（自己或对方） */
  personB: string;
}

export interface AddContactResType {
    isOk: boolean,
    msg: string,
}

/**
 * 查找用户
 * @param key_word qq号关键词
 * @returns 符合条件的用户列表
 */
export const searchUser = async (key_word: string) => {
  return await request.get<SearchUserResType[], SearchUserParamType>(
    "/user/queryUser",
    { key_word }
  );
};

/**
 * 添加联系人
 * @param own_user_name 自己的qq号
 * @param other_user_name 要添加的好友的qq号
 * @returns
 */
export const addContactReq = async (
  own_user_name: string,
  other_user_name: string
) => {
  return await request.post<AddContactResType, AddContactParamType>("/contact/addContact", {
    personA: own_user_name,
    personB: other_user_name,
  });
};
