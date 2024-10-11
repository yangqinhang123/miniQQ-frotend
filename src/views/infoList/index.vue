<template>
  <ContactList :gap="0" :router-name="RouterName.DIALOG"/>
</template>

<script setup lang="ts">
import { RouterName } from "@/router";
import ContactList from "./component/ContactList.vue";
</script>

<style lang="less" scoped>

</style>
