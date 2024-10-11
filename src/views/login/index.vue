<template>
  <div :class="`bg ${isAnimation ? 'animation' : ''}`">
    <div class="login-page">
      <div class="title">QQ9</div>
      <el-input
        class="user-name"
        v-model="state.user_name"
        placeholder="输入QQ号"
      />
      <el-input
        v-model="state.user_pwd"
        placeholder="输入QQ密码"
        class="user-pwd"
      />
      <el-button type="primary" class="login" @click="login">登录</el-button>
      <div class="to-register" @click="toRegister">没有账号？注册一个</div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { nextTick, onMounted, reactive, ref } from "vue";
// import { routerTo } from "@/util/routerTo";
import { RouterName } from "@/router";
import { loginReq } from "./api";
import { showTip } from "@/util";
import localStore from "@/util/LocalStore";
import { useUserStore } from "@/store/userStore";
import { useChatStore } from "@/store/useChatStore";
import { initWs } from "@/util/initWs";
import { useRouter } from "vue-router";

const state = reactive({
  user_name: "",
  user_pwd: "",
});
const isAnimation = ref(true);
const store = useUserStore();
const chatStore = useChatStore();
const { setUserState } = store;
const { getAndSetChatStateHistory } = chatStore;
const router = useRouter();
const login = async () => {
  isAnimation.value = false;
  try {
    const res = await loginReq(state.user_name, state.user_pwd);
    if (res.isOk && res.token) {
      showTip(res.msg);
      localStore.setItem("token", res.token);
      await setUserState();
      initWs(state.user_name);
      await getAndSetChatStateHistory(state.user_name);
      router.push({ name: RouterName.INFO });
    } else {
      showTip(res.msg, "warning");
    }
  } catch (error) {
    showTip("登录失败", "error");
  }
};
const toRegister = () => {
  isAnimation.value = false;
  router.push({ name: RouterName.REGISTER });
};

onMounted(() => {
  //已经有token了就不要再来烦我了
  if (localStore.getItem("token")) {
    router.push({ name: RouterName.INFO });
  }
});
</script>

<style lang="less" scoped>
.animation {
  animation: flowAnimation 15s ease infinite alternate;
}
/* 定义动画 */
@keyframes flowAnimation {
  0% {
    background-position: 0% 25%;
  }
  15% {
    background-position: 20% 40%;
  }
  30% {
    background-position: 40% 10%;
  }
  45% {
    background-position: 60% 60%;
  }
  60% {
    background-position: 80% 20%;
  }
  75% {
    background-position: 100% 80%;
  }
  80% {
    background-position: 50% 90%;
  }
  85% {
    background-position: 70% 0%;
  }
  100% {
    background-position: 0% 25%;
  }
}
.bg {
  width: 100%;
  height: 100%;
  background: linear-gradient(
    to bottom right,
    #00c6ff,
    #00aaff,
    #cc00ff,
    #ff77c2
  );
  //   animation: flowAnimation 15s ease infinite alternate;
  background-size: 200% 200%;
}

.title {
  width: 300px;
  height: 100px;
  background-image: linear-gradient(
    to right,
    #00c6ff,
    #00aaff,
    #cc00ff,
    #ff77c2
  );
  background-clip: text;
  -webkit-background-clip: text;
  text-align: center;
  font-size: 60px;
  line-height: 100px;
  -webkit-text-fill-color: transparent;
}
.login-page {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 50px;
  background: rgba(255, 255, 255, 0.8);
  position: relative;

  .user-name,
  .user-pwd {
    margin-top: 20px;
    height: 50px;
  }

  :deep(.el-input__wrapper) {
    background-color: #fff;
    box-shadow: none;
    border-radius: 10px;
    input {
      text-align: center;
      font-size: large;
    }
  }

  .login {
    margin-top: 40px;
    width: 100%;
    height: 40px;
    font-size: large;
  }
}
.to-register {
  position: absolute;
  width: 100%;
  display: flex;
  color: #909090;
  justify-content: center;
  bottom: 20px;
  left: 0;
}
</style>
