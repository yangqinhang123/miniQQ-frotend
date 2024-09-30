<template>
  <div class="home-page">
    <pagesHeader />
    <pagesMain />
    <pagesFooter />
  </div>
</template>

<script setup lang="ts">
import pagesHeader from "@/views/pagesLayout/pagesHeader.vue";
import pagesFooter from "@/views/pagesLayout/pagesFooter.vue";
import pagesMain from "@/views/pagesLayout/pagesMain.vue";

import { useUserStore } from "@/store/userStore";
import { onMounted, ref, watch } from "vue";
import { storeToRefs } from "pinia";
import { WebSocketClient, type ChatMsgType } from "@/util/WebSocket";
import { jsonParse } from "@/util";
import { StateKey, useChatStore } from "@/store/useChatStore";
import { initWs } from "@/util/initWs";
const store = useUserStore();
const chatStore = useChatStore();

const { setUserState } = store;
const { userState } = storeToRefs(store);
const { setChatState, setWsInstance } = chatStore;
// onMounted(async () => {
//   if (userState.value) {
//     return;
//   }
//   await setUserState();
// });
// watch(() => userState.value, (newUser, oldUser) => {
//   console.log('更新啦', newUser, oldUser);
  
//   if (!newUser) {
//     return;
//   }
//   if (newUser.user_name === oldUser?.user_name) {
//     return
//   }
//   initWs(newUser.user_name)
// });
</script>

<style scoped>
.home-page {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
}
</style>
