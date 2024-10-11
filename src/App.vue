<script setup lang="ts">
import { useUserStore } from "./store/userStore";
import { RouterView } from "vue-router";
import { useGetTransitionName } from "./hooks/useGetTransitionName";
import { nextTick, onBeforeUnmount, onMounted, provide, ref, watch } from "vue";
import { WebSocketClient } from "./util/WebSocket";
import localStore from "./util/LocalStore";
import { useRouter, useRoute } from "vue-router";
import { storeToRefs } from "pinia";
import { initWs } from "./util/initWs";
import { RouterName } from "./router";
import pinia from "./store/store";
import { useChatStore } from "./store/useChatStore";
import { logout } from "./util/logout";
import { contactListKey } from "./util/provideKey";
const { transitionName } = useGetTransitionName();
const router = useRouter();
const route = useRoute();
const store = useUserStore(pinia);
const chatStore = useChatStore(pinia);
const { userState } = storeToRefs(store);
const { setUserState } = store;
const { getAndSetChatStateHistory } = chatStore;
onMounted(async () => {
  
  if (localStore.getItem("token")) {
    console.log("app.vue - 已登录");

    if (!userState.value) {
      await setUserState();
      nextTick(() => {
        console.log(userState.value!.user_name);
        initWs(userState.value!.user_name);
        getAndSetChatStateHistory(userState.value!.user_name);
      });
    } else {
      console.log(userState.value.user_name);

      initWs(userState.value.user_name);
      getAndSetChatStateHistory(userState.value.user_name);
    }
    router.push({ name: RouterName.INFO });
  }
  //  else {
  //   console.log("app.vue - 未登录");
  //   if (route.path === "/") {
  //     console.log(111);

  //     return;
  //   } else {
  //     window.location.assign("/login");
  //   }
  // }
});

const isNeedToUpdateContactList = ref(false);
const setIsNeedToUpdateContactList = (value: boolean) => {
  isNeedToUpdateContactList.value = value;
};

provide(contactListKey, {
  isNeedToUpdateContactList,
  setIsNeedToUpdateContactList,
});
watch(() => transitionName.value, (newValue) => {
  console.log('变了 --');
  
  console.log(newValue);
  
})
</script>

<template>
  <div class="app-main">
    <RouterView v-slot="{ Component }">
      <Transition :name="transitionName">
        <component :is="Component" />
      </Transition>
    </RouterView>
  </div>
</template>

<style scoped lang="less">
.app-main {
  width: 100%;
  background-color: #e2f0fe;
  color: black;
  height: 100vh;
  min-height: 600px;
  // display: flex;
  // flex-direction: column;
}
//页面最终/最初的状态：屏幕正中间
.go-enter-to,
.go-leave-from {
  transform: translate3d(0, 0, 0);
}
//动画持续时间
.go-enter-active,
.go-leave-active {
  transition: all 0.3s;
}
//离去动画，表示离去页面最终的css：屏幕左侧
.go-leave-to {
  transform: translate3d(-100%, 0, 0);
}
//进入动画，表示进入页面，初始的状态：屏幕右侧
.go-enter-from {
  transform: translate3d(100%, 0, 0);
}
//和上面同理，只时 css 是反着的而已
.back-enter-to,
.back-enter-from {
  transform: translate3d(0, 0, 0);
}
.back-enter-active,
.back-leave-active {
  transition: all 0.3s;
}
.back-enter-from {
  transform: translate3d(-100%, 0, 0);
}
.back-leave-to {
  transform: translate3d(100%, 0, 0);
}
</style>
