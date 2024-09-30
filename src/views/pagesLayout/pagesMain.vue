<template>
  <div class="page-main">
    <RouterView />
  </div>
</template>

<script setup lang="ts">
import { RouterView } from "vue-router";
</script>

<style lang="less" scoped>
.page-main {
  width: 100%;
  // height: calc(100vh - 60px - 60px);
  flex: 10;
  overflow: auto;
  border-radius: 20px 20px 0 0;
}
</style>
