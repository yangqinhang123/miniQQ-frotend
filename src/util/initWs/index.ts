import { StateKey } from "@/store/useChatStore";
import { jsonParse, showTip } from "..";
import { WebSocketClient, type ChatMsgType, type MsgType } from "../WebSocket";
import { useChatStore } from "@/store/useChatStore";
import pinia from "@/store/store";
import { logout } from "../logout";
import { ElMessageBox } from "element-plus";
import localStore from "../LocalStore";
import { yourIp } from "@/lib/config";
const chatStore = useChatStore(pinia);
const { setChatState, setWsInstance } = chatStore;
const getInitWsFn = () => {
  /**加锁，保证全局只能初始化一次 */
  let isInit = false;
  /**websocket实例 */
  let ws: WebSocketClient;
  return {
    /**
     * 初始化ws实例和回调
     * @param user_name 当前登录的用户名
     * @returns 
     */
    initWs(user_name: string) {
      if (isInit) {
        return;
      }
      // 创建websocket实例，同时将当前用户名当作参数传递，方便后端存储各个用户的websocket实例
      ws = new WebSocketClient(
        `ws://${yourIp}:3000/mySocketUrl?user_name=${user_name}`
      );
      /**websocket连接 */
      ws.connect();
      /**处理接收消息逻辑 */
      ws.onmessage((e: MessageEvent<string>) => {
        // console.log(e.data);
        const res = jsonParse<MsgType>(e.data);
        console.log(res);

        if (res.type === "chat") {
          console.log(111);
          /**在前端临时存储聊天记录 */
          setChatState(res.data.from, res.data, StateKey.CURRENT_CHAT_STATE);
          // currentChatList.value.push(jsonParse<ChatMsgType>(e.data).data);
        }
        if (res.type === "error") {
          // showTip(res.data.msg, res.type);

          //退出登录
          localStore.removeItem("token");
          destoryWs();
          ElMessageBox.alert(res.data.msg, {
            confirmButtonText: "确认",
          }).finally(() => {
            window.location.assign("/");
          });

          // if (res.data.msgType === "error") {
          //   logout();
          // }
        }
      });
      setWsInstance(ws);
      isInit = true;
    },
    destoryWs() {
      if (!ws) {
        return;
      }
      ws.close();
      isInit = false;
    },
  };
};
export const { initWs, destoryWs } = getInitWsFn();
