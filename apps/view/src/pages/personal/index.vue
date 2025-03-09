<script setup>
import PersonalModule from '~/modules/personal/index.vue'
</script>

<template>
  <div class="PersonalPage">
    <PersonalModule />
  </div>
</template>

<style lang="scss">
.PersonalPage {
  z-index: 1;
  position: relative;

  width: 100%;
  height: 100%;

  overflow-y: hidden;
  overflow-x: hidden;

  /* 添加渐变背景 */
  background: linear-gradient(135deg, rgba(28, 27, 51, 0.02) 0%, rgba(45, 53, 82, 0.05) 100%);

  /* 设置滚动条样式 */
  &::-webkit-scrollbar {
    width: 6px;
  }

  &::-webkit-scrollbar-thumb {
    background: rgba(var(--theme-color-rgb), 0.3);
    border-radius: 3px;
  }

  &::-webkit-scrollbar-track {
    background: transparent;
  }
}
</style>

<route lang="yaml">
meta:
  transition: nav
</route>
