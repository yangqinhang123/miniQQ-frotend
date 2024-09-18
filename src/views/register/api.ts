import request from "@/util/request";
interface registerParam {
  user_name: string;
  user_pwd: string;
  user_email: string;
  nickName: string;
  user_avatar: string
}
/**
 * 注册新用户
 * @param user_name 用户qq号
 * @param user_pwd 密码
 * @param user_email 用户邮箱
 * @param nickName 用户昵称
 * @returns 
 */
export const registerReq = async (user_name: string, user_pwd: string, user_email: string, nickName: string) => {
  return await request.post<null, registerParam>("/user/addUser", {user_name, user_pwd, user_email, nickName, user_avatar: 'https://cube.elemecdn.com/3/7c/3ea6beec64369c2642b92c6726f1epng.png'});
};
