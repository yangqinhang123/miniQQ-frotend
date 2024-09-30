<template>
  <div class="chat-room" @touchstart="recordStartPos" @touchend="handleMoveEnd">
    <div class="room-header" @click="router.back()">
      <IconBack size="20px" color="#050505" />
      <span>{{ target_nickName }}</span>
    </div>
    <div class="room-main">
      <ul class="chat_list-container" ref="chat_list_container">
        <li
          v-for="(item, index) in finalChatList"
          :key="index"
          :class="`chat-item ${
            item.from === userState?.user_name ? 'reverse' : ''
          }`"
        >
          <div class="avatar-container">
            <el-avatar
              :size="50"
              :src="
                item.from === userState?.user_name
                  ? userState.user_avatar
                  : target_userAvatar
              "
              fit="fill"
            />
          </div>
          <div class="chat_content-container">
            <div class="name">
              {{
                item.from === userState?.user_name
                  ? userState.nickName
                  : target_nickName
              }}
            </div>
            <div
              class="content"
              @touchstart="handleChatItemTouchStart(item, $event)"
              @touchend="handleChatItemTouchEnd(item, $event)"
              @touchcancel="handleChatItemTouchCancel(item, $event)"
              @contextmenu="handleTextMenu"
            >
              {{ item.msg }}
            </div>
          </div>
        </li>
      </ul>
    </div>
    <div class="room-footer">
      <div class="enter-part">
        <div class="input">
          <el-input
            v-model="input"
            style="width: 100%; height: 100%; max-height: 40px"
            placeholder="Please input"
            type="textarea"
            autosize
            :rows="1"
            :input-style="{ innerHeight: '30px' }"
          />
        </div>
        <div class="send" @click="send">发送</div>
      </div>
      <div class="other-part"></div>
    </div>
  </div>
  <el-drawer
    v-model="drawer"
    :title="currentSelectChatItem?.msg"
    direction="btt"
  >
    <div>
      <div @click="deleChatItem(currentSelectChatItem)">删除</div>
    </div>
  </el-drawer>
</template>

<script setup lang="ts">
import { useRouter } from "vue-router";
import IconBack from "@/components/icons/IconBack.vue";
import {
  computed,
  nextTick,
  onBeforeUnmount,
  ref,
  watch,
  watchEffect,
} from "vue";
import { useUserStore } from "@/store/userStore";
import { onMounted } from "vue";
import { WebSocketClient, type ChatMsgType } from "@/util/WebSocket/index";
import { useRoute } from "vue-router";
import { storeToRefs } from "pinia";
import { generateUUID, jsonParse, showTip } from "@/util";
import { StateKey, useChatStore } from "@/store/useChatStore";
import { deleChatReq, storageChat, type ChatHistoryType } from "./api";
import { initWs } from "@/util/initWs";

const store = useUserStore();
const chatStore = useChatStore();
const route = useRoute();

const { setUserState } = store;
const { userState } = storeToRefs(store);
const {
  setChatState,
  clearCurrentChatState,
  getAndSetChatStateHistory,
  setWsInstance,
} = chatStore;
const { chatStateHistory, currentChatState, ws_instance } =
  storeToRefs(chatStore);
const drawer = ref(false);
const longPressTimeoutId = ref<number | null>(null);
const currentSelectChatItem = ref<ChatHistoryType | null>(null);

onMounted(async () => {
  // await setUserState();
  nextTick(() => {
    chat_list_container.value!.scrollTop =
      chat_list_container.value!.scrollHeight;
  });
  // if (userState.value) {
  //   getAndSetChatStateHistory(userState.value.user_name);
  // }
});
// watch(userState, (newUser) => {
//   if (!newUser) {
//     return;
//   }
//   initWs(newUser.user_name);
// });
onBeforeUnmount(async () => {
  // if (!currentChatState.value) {
  //   return;
  // }

  // console.log(currentChatState.value[target_userName]);

  // await storageChat(currentChatState.value[target_userName]);
  if (currentChatState.value) {
    await storageChat(currentChatState.value[target_userName]);
  }
  clearCurrentChatState();
  if (userState.value) {
    getAndSetChatStateHistory(userState.value.user_name);
  }
});
const router = useRouter();
const input = ref("");
const chat_list_container = ref<HTMLUListElement | null>(null);
const target_userName: string = route.query.user_name as string;
const target_nickName: string = route.query.nickName as string;
const target_userAvatar: string = route.query.user_avatar as string;

/**手指开始触摸时的x坐标位置 */
let startX = 0;
/**手指开始触摸时的y坐标位置 */
let startY = 0;
/**手指开始触摸时的时间 */
let startTime = 0;

/**
 * 记录开始触摸时的x坐标，y坐标，时间
 * @param event 手指触摸事件的事件对象
 */
const recordStartPos = (event: TouchEvent) => {
  event.stopPropagation();
  startX = event.touches[0].pageX;
  startY = event.touches[0].clientY;
  startTime = Date.now();
};
/**
 * 结束触摸时触发的回调函数
 * @param event 结束触摸事件的事件对象
 */
const handleMoveEnd = (event: TouchEvent) => {
  event.stopPropagation();
  const moveEndX = event.changedTouches[0].pageX;
  const moveEndY = event.changedTouches[0].pageY;
  const endTime = Date.now();
  isRouteBack(startX, moveEndX, startY, moveEndY, endTime - startTime);
};
const handleChatItemTouchStart = (
  chatItem: ChatHistoryType,
  event: TouchEvent
) => {
  // 在 touchstart 时设置一个定时器
  longPressTimeoutId.value = setTimeout(() => {
    event.stopPropagation();
    event.preventDefault();
    // 长按触发的逻辑
    console.log("长按事件触发");
    longPressCallBack(chatItem);
    event.preventDefault();
  }, 500); // 500 毫秒为长按的时间，可以根据需要调整
};
const handleChatItemTouchEnd = (
  chatItem: ChatHistoryType,
  event: TouchEvent
) => {
  event.stopPropagation();
  event.preventDefault();
  clearTimeout(longPressTimeoutId.value as number);
};
const handleChatItemTouchCancel = (
  chatItem: ChatHistoryType,
  event: TouchEvent
) => {
  event.stopPropagation();
  event.preventDefault();
  clearTimeout(longPressTimeoutId.value as number);
};
const handleTextMenu = (e: MouseEvent) => {
  e.preventDefault();
};
const longPressCallBack = (chatItem: ChatHistoryType) => {
  drawer.value = true;
  currentSelectChatItem.value = chatItem;
};
const deleChatItem = (chatItem: ChatHistoryType | null) => {
  if (!chatItem) {
    return;
  }
  const thisHistoryState = chatStateHistory.value?.[target_userName];
  const thisCurrentChatState = currentChatState.value?.[target_userName];
  thisCurrentChatState?.forEach((item) => {
    if (item.id === chatItem.id) {
      item.is_del = 1;
    }
  });
  thisHistoryState?.forEach(async (item) => {
    if (item.id === chatItem.id) {
      deleChatReq(item.id);
      if (currentChatState.value) {
        await storageChat(currentChatState.value[target_userName]);
      }
      clearCurrentChatState();
      if (userState.value) {
        getAndSetChatStateHistory(userState.value.user_name);
      }
    }
  });
};
/**
 * 判断是否要回退到上一个路由
 * @param startX 手指触摸开始的x坐标
 * @param endX 手指触摸结束的x坐标
 * @param startY 手指触摸开始的y坐标
 * @param endY 手指触摸结束的y坐标
 * @param timeInterval 从触摸开始到触摸结束的间隔时间
 */
const isRouteBack = (
  startX: number,
  endX: number,
  startY: number,
  endY: number,
  timeInterval: number
) => {
  const X = endX - startX;
  const Y = endY - startY;
  if (X > 0 && Math.abs(Y) <= 10 && timeInterval <= 200) {
    router.back();
  }
};

// const finalChatList = computed(() => {
//   const thisHistoryState = chatStateHistory.value?.[target_userName];
//   const thisCurrentChatState = currentChatState.value?.[target_userName];
//   return [...(thisHistoryState || []), ...(thisCurrentChatState || [])].filter(
//     (item) => !item.is_del
//   );
// });
const finalChatList = ref<ChatHistoryType[]>([]);
watchEffect(() => {
  const thisHistoryState = chatStateHistory.value?.[target_userName];
  const thisCurrentChatState = currentChatState.value?.[target_userName];
  console.log('变了');
  
  finalChatList.value = [
    ...(thisHistoryState || []),
    ...(thisCurrentChatState || []),
  ].filter((item) => !item.is_del);
});

// watch(() => chatStateHistory.value, (newValue, oldValue) => {
//   console.log('变化了', newValue, oldValue);

// })

watch(
  finalChatList,
  () => {
    console.log(111);

    console.log(chat_list_container.value);
    nextTick(() => {
      chat_list_container.value!.scrollTop =
        chat_list_container.value!.scrollHeight;
    });
    // chat_list_container.value!.scrollIntoView({
    //   behavior: "smooth",
    //   // inline: "nearest",
    //   block: 'end'
    // });
  },
  { deep: true }
);

const send = () => {
  if (!userState.value) {
    showTip("无法获取当前用户", "error");
    return;
  }
  if (!ws_instance) {
    showTip("未初始化发送消息函数");
    return;
  }
  const msg = {
    type: "chat",
    data: {
      id: generateUUID(),
      create_time: Date.now(),
      from: userState.value.user_name,
      to: target_userName,
      msg: input.value,
      is_del: 0,
    },
  } as ChatMsgType;
  ws_instance.value?.send(JSON.stringify(msg));
  setChatState(msg.data.to, msg.data, StateKey.CURRENT_CHAT_STATE);
  input.value = "";
};
</script>

<style lang="less" scoped>
.chat-room {
  height: 100vh;
  display: flex;
  flex-direction: column;
}
.room-header {
  //   height: 30px;
  flex: 1;
  // background-color: #2d2d2f;
  padding: 5px;
  color: #050505;
  display: flex;
  align-items: center;
  gap: 20px;
  background-color: #f7f7f7;
  // border-bottom: 2px;
}
.room-footer {
  // border-top: 2px;
  // flex: 2;
  height: auto;
  //   height: 40px;
  // background-color: #2d2d2f;
  background-color: #f7f7f7;
  padding: 5px;
  display: flex;
  flex-direction: column;
  gap: 2px;
  .enter-part {
    // height: 30px;
    display: flex;
    padding: 2px 5px;
    gap: 10px;
    .input {
      flex: 6;
      background-color: #fff;
      border-radius: 5px;
    }
    .send {
      flex: 1;
      height: 30px;
      background-color: #30aff6;
      color: #fff;
      display: flex;
      justify-content: center;
      align-items: center;
      border-radius: 5px;
    }
  }
  .other-part {
    height: 30px;
  }
}
.room-main {
  //   height: calc(100vh - 70px);
  flex: 12;
  overflow: auto;
  background-color: #f1f1f1;
  .chat_list-container {
    width: 100%;
    height: 100%;
    overflow: auto;
    display: flex;
    flex-direction: column;
    gap: 15px;
    padding: 20px 0;
    scroll-behavior: smooth;
  }
  .chat-item {
    width: 100%;
    display: flex;
    color: #fff;
    padding: 0 10px 0 0;
    gap: 10px;
    .chat_content-container {
      display: flex;
      flex-direction: column;
      .name {
        display: flex;
        flex-direction: row-reverse;
        color: #8f8f8f;
      }
      .content {
        background-color: #009dff;
        border-radius: 5px;
        padding: 10px;
        max-width: 250px;
        font-size: 16px;
      }
    }
  }
}
.reverse {
  flex-direction: row-reverse;
}
</style>
