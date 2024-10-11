<template>
  <div :class="`bg ${isAnimation ? 'animation' : ''}`">
    <div class="register-page">
      <div class="title">新建账号</div>
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
      <el-input
        v-model="state.nickName"
        placeholder="你的昵称"
        class="nick-name"
      />
      <el-input
        v-model="state.user_email"
        placeholder="你的邮箱"
        class="user-email"
      />
      <el-button type="primary" class="register" @click="register"
        >注册</el-button
      >
      <div class="to-login" @click="toLogin">去登录</div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { reactive, ref } from "vue";
// import { routerTo } from "@/util/routerTo";
import router, { RouterName } from "@/router";
import { registerReq } from "./api";
import { showTip } from "@/util";

const state = reactive({
  user_name: "",
  user_pwd: "",
  nickName: "",
  user_email: "",
});
const isAnimation = ref(true);
const register = async () => {
  isAnimation.value = false;
  const res = await registerReq(
    state.user_name,
    state.user_pwd,
    state.user_email,
    state.nickName
  );
  if (res.isOk) {
    showTip(res.msg, "success");
  } else {
    showTip(res.msg, "warning");
  }
  router.push({ name: RouterName.LOGIN });
};

const toLogin = () => {
  isAnimation.value = false;
  router.push({ name: RouterName.LOGIN });
};
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
.register-page {
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
  .user-pwd,
  .nick-name,
  .user-email {
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

  .register {
    margin-top: 40px;
    width: 100%;
    height: 40px;
    font-size: large;
  }
}
.to-login {
  position: absolute;
  width: 100%;
  display: flex;
  color: #909090;
  justify-content: center;
  bottom: 20px;
  left: 0;
}
</style>
