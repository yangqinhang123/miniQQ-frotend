<template>
  <div class="page-footer">
    <div
      @click="router.push({ name: RouterName.INFO })"
      :class="
        router.currentRoute.value.name === RouterName.INFO ? 'active' : ''
      "
    >
      <IconXiaoXi
        size="30px"
        :color="
          router.currentRoute.value.name === RouterName.INFO
            ? '#1296db'
            : '#000'
        "
      />
      消息
    </div>
    <div
      @click="router.push({ name: RouterName.CHANNELS })"
      :class="
        router.currentRoute.value.name === RouterName.CHANNELS ? 'active' : ''
      "
    >
      <IconPinDao
        size="30px"
        :color="
          router.currentRoute.value.name === RouterName.CHANNELS
            ? '#1296db'
            : '#000'
        "
      />
      频道
    </div>
    <div
      @click="router.push({ name: RouterName.CONTACT })"
      :class="
        router.currentRoute.value.name === RouterName.CONTACT ? 'active' : ''
      "
    >
      <IconLianXiRen
        size="30px"
        :color="
          router.currentRoute.value.name === RouterName.CONTACT
            ? '#1296db'
            : '#000'
        "
      />
      联系人
    </div>
    <div
      @click="router.push({ name: RouterName.LIFE })"
      :class="
        router.currentRoute.value.name === RouterName.LIFE ? 'active' : ''
      "
    >
      <IconDongTai
        size="30px"
        :color="
          router.currentRoute.value.name === RouterName.LIFE
            ? '#1296db'
            : '#000'
        "
      />
      动态
    </div>
  </div>
</template>

<script setup lang="ts">
import SvgIcon from "@/components/SvgIcon.vue";
import IconXiaoXi from "@/components/icons/IconXiaoXi.vue";
import IconPinDao from "@/components/icons/IconPinDao.vue";
import IconLianXiRen from "@/components/icons/IconLianXiRen.vue";
import IconDongTai from "@/components/icons/IconDongTai.vue";
import { RouterLink, useRouter } from "vue-router";
import { RouterName } from "@/router";
const router = useRouter();
</script>

<style lang="less">
.page-footer {
  display: flex;
  width: 100%;
  // height: 60px;
  flex: 1;
  padding: 5px;
  div {
    flex: 1;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
  }
}
.active {
  color: #1296db;
}
</style>
