import { destoryWs } from "./initWs";
import localStore from "./LocalStore";
/**退出登录 */
export const logout = () => {
  localStore.removeItem("token");
  destoryWs();
  window.location.assign("/");
};
