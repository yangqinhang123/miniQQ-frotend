<template>
  <div class="contact-item" @click="routerTo(routerName)">
    <div class="avatar">
      <el-avatar :size="50" :src="avatarUrl" fit="fill" />
    </div>
    <div class="name">{{ contactName }}</div>
  </div>
</template>

<script setup lang="ts">
import { RouterName } from "@/router";
import { useRouter } from "vue-router";
// import { routerTo } from "@/util/routerTo";
interface contactItemPropsType {
  /**联系人头像 */
  avatarUrl: string;
  /**联系人nic */
  contactName: string;
  /**联系人qq号 */
  contactUserName: string;
  /**点击后要跳转的路由。目前仅支持跳转到聊天页面和用户详情页面 */
  routerName: RouterName.DIALOG | RouterName.DETAIL;
}
const router = useRouter();
const { avatarUrl, contactName, contactUserName, routerName } =
  defineProps<contactItemPropsType>();
const routerTo = (routerName: string) => {
  console.log(routerName);

  router.push({
    name: routerName,
    query: {
      nickName: contactName,
      user_name: contactUserName,
      user_avatar: avatarUrl,
    },
  });
};
</script>

<style lang="less" scoped>
.contact-item {
  width: 100%;
  height: 90px;
  display: flex;
  gap: 10px;
  padding: 10px;
  font-size: large;
}
</style>
