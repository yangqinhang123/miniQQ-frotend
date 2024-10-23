<template>
  <ul class="infinite-list" :style="{ overflow: 'auto', gap: gap + 'px' }">
    <el-empty description="还未添加好友噢！" v-if="contactList.length === 0" image="/images/linghua.jpg" style="width: 100%; height: 100%;"/>
    <ContactItem
      v-else
      v-for="(i, index) in contactList"
      :key="index"
      :avatar-url="i.user_avatar"
      :contact-name="i.nickName"
      :contact-user-name="i.user_name"
      :router-name="routerName"
    />
  </ul>
</template>

<script setup lang="ts">
import { inject, nextTick, onMounted, reactive, ref, watch } from "vue";
import ContactItem from "./ContactItem.vue";
import { queryContactListReq, type QueryContactListResType } from "../api";
import { useUserStore } from "@/store/userStore";
import { storeToRefs } from "pinia";
import { showTip } from "@/util";
import type { RouterName } from "@/router";
import { contactListKey, type ContactListFlagType } from "@/util/provideKey";
interface props {
  /**每项之间的间距，单位为px */
  gap: number;
  /**点击后要跳转的路由。目前仅支持跳转到聊天页面和用户详情页面 */
  routerName: RouterName.DIALOG | RouterName.DETAIL;
}
const { gap, routerName } = defineProps<props>();
const store = useUserStore();
const { userState } = storeToRefs(store);
const contactList = ref<QueryContactListResType[]>([]);
// const state = reactive<{ contactList: QueryContactListResType[] }>({
//   contactList: [],
// });
const setContactList = async () => {
  const res = await queryContactListReq();
  //   state.contactList = res;
  contactList.value = res;
};
const { isNeedToUpdateContactList, setIsNeedToUpdateContactList } = inject(
  contactListKey
) as ContactListFlagType;
watch(
  () => userState.value?.user_name,
  async () => {
    try {
      if (!userState.value) {
        console.log("名字空空");
        contactList.value = [];
        return;
      }
      //   await setContactList();
      const res = await queryContactListReq();
      contactList.value = res;
    } catch (error) {
      console.log(error);
      showTip("获取联系人列表失败", "error");
    }
  },
  { immediate: true }
);
// onMounted(() => {
//   nextTick(async () => {
//     try {
//       if (!userState.value) {
//         console.log("名字空空");
//         contactList.value = [];
//         return;
//       }
//       await setContactList();
//     } catch (error) {
//       console.log(error);
//       showTip("获取联系人列表失败", "error");
//     }
//   });
// });
watch(
  () => isNeedToUpdateContactList.value,
  (newValue) => {
    if (newValue) {
      setContactList();
      setIsNeedToUpdateContactList(false);
    }
  }
);
</script>

<style lang="less" scoped>
.infinite-list {
  height: 100%;
  padding: 0;
  margin: 0;
  list-style: none;
  &::-webkit-scrollbar {
    width: 0;
    height: 0;
    background-color: transparent;
  }
  // border-radius: 20px 20px 0 0;
  background-color: #fff;
}
.infinite-list .infinite-list-item {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 50px;
  background: var(--el-color-primary-light-9);
  // margin: 10px;
  color: var(--el-color-primary);
}
// .infinite-list .infinite-list-item + .list-item {
//   margin-top: 10px;
// }
</style>
