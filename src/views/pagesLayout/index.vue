<template>
  <div class="home-page">
    <pagesHeader />
    <pagesMain />
    <pagesFooter />
  </div>
</template>

<script setup lang="ts">
import pagesHeader from "@/views/pagesLayout/pagesHeader.vue";
import pagesFooter from "@/views/pagesLayout/pagesFooter.vue";
import pagesMain from "@/views/pagesLayout/pagesMain.vue";
</script>

<style scoped>
.home-page {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
}
</style>
