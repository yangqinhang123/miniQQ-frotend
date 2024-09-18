<template>
  <!-- <i :style="{fontSize: props.size, color: props.color}"> -->
  <svg
    t="1725006262307"
    viewBox="0 0 1024 1024"
    version="1.1"
    xmlns="http://www.w3.org/2000/svg"
    p-id="951"
    :width="props.size"
    :height="props.size"
  >
    <path
      d="M513.4 97.2c-220.5 0-399.2 156.4-399.2 349.3 0 110.3 58.5 208.4 149.7 272.5v176.7l174.9-106.1c24.2 4 49.1 6.3 74.6 6.3 220.5 0 399.2-156.4 399.2-349.3 0.1-193-178.7-349.4-399.2-349.4z m124.8 474.1H388.7c-13.8 0-25-11.2-25-25s11.2-25 25-25h249.5c13.8 0 25 11.2 25 25s-11.2 25-25 25z m49.9-149.8H338.8c-13.8 0-25-11.2-25-25s11.2-25 25-25h349.3c13.8 0 25 11.2 25 25 0 13.9-11.2 25-25 25z"
      :fill="props.color || '#0A0101'"
      p-id="952"
    ></path>
  </svg>
  <!-- </i> -->
</template>

<script setup lang="ts">
import type { iconProps } from "./iconProps";

const props = defineProps<iconProps>();
</script>
