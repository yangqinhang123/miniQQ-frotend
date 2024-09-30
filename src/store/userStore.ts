import { showTip } from "@/util";
import request from "@/util/request";
import { defineStore } from "pinia";
import { computed, reactive, ref } from "vue";

export interface user {
  /**qq号 */
  user_name: string;
  /**昵称 */
  nickName: string;
  /**邮箱 */
  user_email: string;
  /**头像 */
  user_avatar: string;
}
export const useUserStore = defineStore("user", () => {
    console.log(111);
    
  const userState = ref<user | null>(null);
  const setUserState = async () => {
    try {
      const res = await request.get<user, any>("/user/currentUser");
      userState.value = res;
    } catch (error) {
      console.log(error);
      showTip("获取当前用户信息失败", "error");
    }
  };

  return { userState, setUserState };
});
