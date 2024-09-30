import { StateKey } from "@/store/useChatStore";
import { jsonParse, showTip } from "..";
import { WebSocketClient, type ChatMsgType, type MsgType } from "../WebSocket";
import { useChatStore } from "@/store/useChatStore";
import pinia from "@/store/store";
import { logout } from "../logout";
const chatStore = useChatStore(pinia);
const { setChatState, setWsInstance } = chatStore;
const getInitWsFn = () => {
  let isInit = false;
  let ws: WebSocketClient;
  return {
    initWs(user_name: string) {
      if (isInit) {
        return;
      }
      ws = new WebSocketClient(
        `ws://192.168.121.176:3000/mySocketUrl?user_name=${user_name}`
      );
      ws.connect();
      ws.onmessage((e: MessageEvent<string>) => {
        // console.log(e.data);
        const res = jsonParse<MsgType>(e.data);
        console.log(res);

        if (res.type === "chat") {
          console.log(111);
          setChatState(res.data.from, res.data, StateKey.CURRENT_CHAT_STATE);
          // currentChatList.value.push(jsonParse<ChatMsgType>(e.data).data);
        }
        if (res.type === "tip") {
          showTip(res.data.msg, res.data.msgType);
          if (res.data.msgType === "error") {
            logout();
          }
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
