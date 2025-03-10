<script setup lang="ts">
defineProps<{
  title: string
  description?: string
  arrow?: boolean
}>()
</script>

<template>
  <div class="settings-item theme-color-transition">
    <div class="item-content">
      <div class="item-title">{{ title }}</div>
      <div class="item-desc" v-if="description">{{ description }}</div>
    </div>
    <div class="item-control">
      <slot />
      <span v-if="arrow" class="arrow" />
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
  border-bottom: 1px solid var(--el-border-color-light);
  transition: background-color 0.3s ease, transform 0.3s ease;
  
  &:last-child {
    border-bottom: none;
  }
  
  &:hover {
    background-color: var(--el-fill-color);
    transform: translateX(2px);
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
  }
  
  .arrow::after {
    content: '>';
    color: var(--el-text-color-secondary);
    font-size: 14px;
    margin-left: 8px;
    transition: transform 0.3s ease;
  }
  
  &:hover .arrow::after {
    transform: translateX(3px);
    color: var(--theme-color-primary);
  }
}

// 暗黑模式适配
.dark .settings-item {
  &:hover {
    background-color: var(--el-bg-color-overlay);
  }
}
</style>