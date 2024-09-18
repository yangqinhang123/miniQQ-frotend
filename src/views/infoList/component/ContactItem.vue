<template>
  <div class="contact-item" @click="routerTo(RouterName.DIALOG)">
    <div class="avatar">
      <el-avatar :size="50" :src="avatarUrl" fit="fill" />
    </div>
    <div class="name">{{ contactName }}</div>
  </div>
</template>

<script setup lang="ts">
import { RouterName } from "@/router";
import { routerTo } from "@/util/routerTo";
interface contactItemPropsType {
  /**联系人头像 */
  avatarUrl: string;
  /**联系人名字 */
  contactName: string;
}
const { avatarUrl, contactName } = defineProps<contactItemPropsType>();
</script>

<style lang="less">
.contact-item {
  width: 100%;
  height: 90px;
  display: flex;
  gap: 10px;
  padding: 10px;
  font-size: large;
}
</style>
