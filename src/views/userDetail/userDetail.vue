<template>
  <div class="user-detail-container">
    <IconBack
      size="20px"
      color="#050505"
      @click="router.back()"
      style="flex: 1"
    />
    <div class="infomation">
      <el-avatar :size="70" :src="target_userAvatar" fit="fill" />
      <div class="right">
        <div class="nick-name">{{ target_nickName }}</div>
        <div class="user-name">{{ "QQ号：" + target_userName }}</div>
      </div>
    </div>
    <el-empty
      description="主人太懒了，什么都没留下～"
      style="flex: 12"
      image="/images/paimeng.jpg"
    />
    <div class="btn-list">
      <el-button type="danger" style="flex: 1" @click="dialogVisible = true"
        >删除好友</el-button
      >
      <el-button
        type="primary"
        style="flex: 1"
        @click="routerTo(RouterName.DIALOG)"
        >发消息</el-button
      >
    </div>
  </div>
  <el-dialog
    v-model="dialogVisible"
    style="width: 70%; display: flex; flex-direction: column; gap: 20px"
  >
    <div
      style="
        width: 100%;
        height: 100%;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        gap: 20px;
      "
    >
      <el-image style="width: 50%" src="/images/caosheng.png" fit="fill" />
      <div>你确定要和我分手吗</div>
    </div>

    <template #footer>
      <div class="dialog-footer">
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="deleContact"> 确定 </el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import { useRoute, useRouter } from "vue-router";
import IconBack from "@/components/icons/IconBack.vue";
import { RouterName } from "@/router";
import { deleContactReq } from "./api";
import { getCurrentInstance, inject, ref } from "vue";
import { ElMessageBox } from "element-plus";
const route = useRoute();
const router = useRouter();
const target_userName: string = route.query.user_name as string;
const target_nickName: string = route.query.nickName as string;
const target_userAvatar: string = route.query.user_avatar as string;
const dialogVisible = ref(false);
const cxt = getCurrentInstance();
const bus = cxt?.appContext.config.globalProperties.$bus;
const routerTo = (routerName: string) => {
  router.push({
    name: routerName,
    query: {
      nickName: target_nickName,
      user_name: target_userName,
      user_avatar: target_userAvatar,
    },
  });
};
const deleContact = async () => {
  await deleContactReq(target_userName);
  dialogVisible.value = false;
  bus.emit("updateContactList");
  router.back();
};
</script>

<style lang="less" scoped>
.user-detail-container {
  height: 100vh;
  display: flex;
  flex-direction: column;
  background-color: #fff;
  padding: 20px;
  padding-top: 40px;
  gap: 10px;
  .infomation {
    flex: 3;
    display: flex;
    gap: 15px;
    .right {
      display: flex;
      flex-direction: column;
      .nick-name {
        font-size: 20px;
      }
      .user-name {
        font-size: 12px;
        color: #818181;
      }
    }
  }
  .btn-list {
    flex: 1;
    display: flex;
  }
}
.dialog-footer {
  display: flex;
  justify-content: space-around;
}
</style>
