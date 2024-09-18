<template>
  <ul class="infinite-list" style="overflow: auto">
    <!-- <li v-for="i in count" :key="i" class="infinite-list-item">{{ i }}</li> -->
    <ContactItem
      v-for="(i, index) in contactList"
      :key="index"
      :avatar-url="i.avatarUrl"
      :contact-name="i.contactName"
    />
  </ul>
</template>

<script setup lang="ts">
import { ref } from "vue";
import ContactItem from "./component/ContactItem.vue";
interface ContactItemType {
  avatarUrl: string;
  contactName: string;
}
const contactList = ref<ContactItemType[]>([
  {
    avatarUrl: "/images/sanye.jpg",
    contactName: "杨钦航",
  },
  {
    avatarUrl: "/images/sanye.jpg",
    contactName: "杨钦航",
  },
  {
    avatarUrl: "/images/sanye.jpg",
    contactName: "杨钦航",
  },
  {
    avatarUrl: "/images/sanye.jpg",
    contactName: "杨钦航",
  },
  {
    avatarUrl: "/images/sanye.jpg",
    contactName: "杨钦航",
  },
  {
    avatarUrl: "/images/sanye.jpg",
    contactName: "杨钦航",
  },
  {
    avatarUrl: "/images/sanye.jpg",
    contactName: "杨钦航",
  },
  {
    avatarUrl: "/images/sanye.jpg",
    contactName: "杨钦航",
  },
]);
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
