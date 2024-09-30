import { showTip } from "@/util";
import request from "@/util/request";
// import { useUserStore } from "./userStore";
import type { ChatHistoryType } from "@/views/Dialog/api";
import { defineStore, storeToRefs } from "pinia";
import { computed, reactive, ref, watch, type Ref } from "vue";
import type { WebSocketClient } from "@/util/WebSocket";
import pinia from "./store";
export interface ChatState {
  /**key为对方的qq号，值为自己与对方的互相聊天记录 */
  [key: string]: ChatHistoryType[];
}

/**查询所有有关自己的聊天记录 - 请求参数 */
export interface GetChatHistoryParamType {
  /**qq号 */
  user_name: string;
}

export enum StateKey {
  CHAT_STATE_HISTORY = "chatStateHistory",
  CURRENT_CHAT_STATE = "currentChatState",
}
export const useChatStore = defineStore("chat", () => {
  console.log(222);
  
  // const store = useUserStore(pinia);
  // const { userState } = storeToRefs(store);
  const chatStateHistory = ref<ChatState | null>(null);
  const currentChatState = ref<ChatState | null>(null);
  const ws_instance = ref<WebSocketClient | null>(null);
  const setWsInstance = (ws: WebSocketClient) => {
    ws_instance.value = ws;
  };
  const setChatState = (
    target_user: string,
    chat: ChatHistoryType,
    stateKey: StateKey
  ) => {
    const target_state =
      stateKey === StateKey.CHAT_STATE_HISTORY
        ? chatStateHistory
        : currentChatState;
    if (!target_state.value) {
      target_state.value = {
        [target_user]: [chat],
      };
    } else {
      if (!target_state.value[target_user]) {
        target_state.value[target_user] = [chat];
      } else {
        target_state.value[target_user].push(chat);
      }
    }
  };
  const getChatHistory = async () => {
    const res = await request.get<ChatHistoryType[]>(
      "/chat/getChatHistory"
    );
    return res;
  };
  const clearCurrentChatState = () => {
    currentChatState.value = null;
  };
  const getAndSetChatStateHistory = async (user_name: string) => {
    const res = await getChatHistory();
    chatStateHistory.value = null;
    res.forEach((element) => {
      const target_user = element.to === user_name ? element.from : element.to;
      setChatState(target_user, element, StateKey.CHAT_STATE_HISTORY);
    });
  };
  // watch(
  //   userState,
  //   async (newUser) => {
  //     if (!newUser) {
  //       return;
  //     }
  //     getAndSetChatStateHistory(newUser.user_name);
  //   },
  //   { immediate: true }
  // );
  return {
    chatStateHistory,
    currentChatState,
    setChatState,
    ws_instance,
    setWsInstance,
    clearCurrentChatState,
    getAndSetChatStateHistory,
  };
});
