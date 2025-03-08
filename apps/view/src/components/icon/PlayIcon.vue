<script setup lang="ts">
const props = defineProps<{
  active: boolean
}>()
</script>

<template>
  <span :class="{ active }" class="PlayIcon">
    <i i-carbon:volume-up block />
  </span>
</template>

<style lang="scss">
.PlayIcon {
  &.active {
    opacity: 1;

    color: var(--theme-color);
  }

  opacity: 0.75;
  cursor: pointer;
  font-size: 0.95em;
}
</style>
