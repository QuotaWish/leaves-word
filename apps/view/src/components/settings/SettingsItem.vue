<script setup lang="ts">
defineProps<{
  title: string;
  description?: string;
  arrow?: boolean;
}>();
</script>

<template>
  <div class="settings-item theme-color-transition">
    <div class="item-content">
      <div class="item-title">{{ title }}</div>
      <div class="item-desc" v-if="description">{{ description }}</div>
    </div>
    <div class="item-control">
      <slot />
      <div v-if="arrow" i-carbon-chevron-right />
    </div>
  </div>
</template>

<style lang="scss" scoped>
.settings-item {
  padding: 1rem;
  cursor: pointer;
  display: flex;
  justify-content: space-between;
  align-items: center;
  user-select: none;
  background-color: var(--el-bg-color);
  border-bottom: 1px solid var(--el-border-color-light);

  &:active {
    background-color: var(--el-fill-color);
  }

  &:first-child {
    border-radius: 8px 8px 0 0;
  }

  &:last-child {
    border-bottom: none;
    border-radius: 0 0 8px 8px;
  }

  .item-content {
    flex-grow: 1;
  }

  .item-title {
    font-size: 16px;
    margin-bottom: 5px;
    color: var(--el-text-color-primary);
  }

  .item-desc {
    font-size: 14px;
    color: var(--el-text-color-secondary);
  }

  .item-control {
    display: flex;
    align-items: center;

    color: var(--el-text-color-primary);
  }
}

// 暗黑模式适配
.dark .settings-item {
  &:hover {
    background-color: var(--el-bg-color-overlay);
  }
}
</style>
