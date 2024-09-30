<template>
  <ul class="infinite-list" style="overflow: auto">
    <!-- <li v-for="i in count" :key="i" class="infinite-list-item">{{ i }}</li> -->
    <ContactItem
      v-for="(i, index) in contactList"
      :key="index"
      :avatar-url="i.user_avatar"
      :contact-name="i.nickName"
      :contact-user-name="i.user_name"
    />
  </ul>
</template>

<script setup lang="ts">
import { onMounted, ref, watch } from "vue";
import ContactItem from "./component/ContactItem.vue";
import { queryContactListReq, type QueryContactListResType } from "./api";
import { useUserStore } from "@/store/userStore";
import { storeToRefs } from "pinia";
import { showTip } from "@/util";

const store = useUserStore();
const { userState } = storeToRefs(store);
const contactList = ref<QueryContactListResType[]>([]);
watch(
  userState,
  async () => {
    try {
      if (!userState.value) {
        console.log("名字空空");
        contactList.value = [];
        return;
      }
      console.log('请求');
      
      const res = await queryContactListReq();
      contactList.value = res;
    } catch (error) {
      console.log(error);
      showTip("获取联系人列表失败", "error");
    }
  },
  { immediate: true }
);
onMounted(async () => {
  console.log("infolist.vue");
});
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
