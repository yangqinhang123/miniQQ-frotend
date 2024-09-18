<template>
  <div class="page-header">
    <div class="user">
      <el-avatar
        :size="50"
        src="/images/sanye.jpg"
        fit="fill"
        @error="errorHandler"
      />
      <span>今天学web了吗</span>
    </div>
  </div>
</template>

<script setup lang="ts">
const errorHandler = () => {
  console.log("error");
};
</script>

<style lang="less">
.page-header {
  display: flex;
  width: 100%;
  // height: 60px;
  flex: 1;
  padding: 2px;
  .user {
    display: flex;
    gap: 3px;
    justify-content: center;
    align-items: center;
  }
}
</style>
