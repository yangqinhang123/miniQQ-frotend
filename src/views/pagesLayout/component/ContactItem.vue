<template>
  <div class="contact-item">
    <div class="avatar">
      <el-avatar :size="50" :src="avatarUrl" fit="fill" />
    </div>
    <div class="name">{{ contactName }}</div>
  </div>
</template>

<script setup lang="ts">
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
  height: 60px;
  display: flex;
  gap: 10px;
  padding-left: 10px;
}
</style>
