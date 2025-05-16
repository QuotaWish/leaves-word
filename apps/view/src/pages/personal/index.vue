<script setup>
import { useGlobalPageState } from '~/components/page/state';
import PersonalModule from "~/modules/personal/index.vue";

defineOptions({
  name: "PersonalPage",
});

const globalPageState = useGlobalPageState()

globalPageState.value.title = "个人中心"
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
  background: linear-gradient(135deg, rgba(var(--theme-color-rgb), 0.02) 0%, rgba(var(--theme-color-rgb), 0.05) 100%);

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

  :deep(.option-item) {
    background: rgba(var(--theme-color-rgb), 0.1) !important;
    border: 1px solid rgba(var(--theme-color-rgb), 0.15) !important;
    border-radius: 12px;
    transition: all 0.3s ease;

    &:hover {
      background: rgba(var(--theme-color-rgb), 0.15) !important;
      border-color: rgba(var(--theme-color-rgb), 0.2) !important;
      transform: translateY(-2px);
    }

    &:active {
      transform: translateY(0);
    }
  }
}
</style>

<route lang="yaml">
meta:
  index: root
  transition: nav
</route>
