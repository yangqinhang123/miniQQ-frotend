<script setup lang="ts">
import { RouterView } from "vue-router";
import { useGetTransitionName } from "./hooks/useGetTransitionName";
import { onMounted } from "vue";
import { WebSocketClient } from "./util/WebSocket";
const { transitionName } = useGetTransitionName();

onMounted(() => {
  const ws = new WebSocketClient("ws://localhost:3000/mySocketUrl");
  ws.connect();

  ws.onmessage((e: MessageEvent<any>) => {
    console.log(e.data);
  });
});
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
