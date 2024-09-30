import request from "@/util/request";

export interface ChatHistoryType {
  id: string;
  create_time: number;
  from: string;
  to: string;
  msg: string;
  is_del: number;
}

/**存储聊天记录 -  请求参数*/
export interface StorageChatParamType {
  /**聊天记录列表 */
  chat_list: ChatHistoryType[];
}
/**存储聊天记录 -  返回结果*/
export interface StorageChatResType {
  isOk: boolean;
  msg: string;
}
/**删除某条聊天记录 - 请求参数 */
export interface DeleChatParamType {
  /**聊天记录id */
  id: string;
}
export const storageChat = async (
  chatList: StorageChatParamType["chat_list"]
) => {
  return await request.post<StorageChatResType, StorageChatParamType>(
    "/chat/addChatHistory",
    {
      chat_list: chatList,
    }
  );
};

export const deleChatReq = async (chatId: string) => {
  return request.post<any, DeleChatParamType>("/chat/deleChat", { id: chatId });
};
