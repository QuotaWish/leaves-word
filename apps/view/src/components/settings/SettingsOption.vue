<script setup lang="ts">
defineProps<{
  title: string
  description?: string
}>()
</script>

<template>
  <div class="settings-option theme-color-transition">
    <div class="option-info">
      <div class="option-title">{{ title }}</div>
      <div class="option-desc" v-if="description">{{ description }}</div>
    </div>
    <div class="option-control">
      <slot />
    </div>
  </div>
</template>

<style lang="scss" scoped>
.settings-option {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.75rem 0;
  border-bottom: 1px solid var(--el-border-color-light);

  &:last-child {
    border-bottom: none;
  }

  .option-info {
    flex: 1;
  }

  .option-title {
    font-size: 1.1rem;
    margin-bottom: 0.4rem;
    font-weight: 500;
    color: var(--el-text-color-primary);
  }

  .option-desc {
    font-size: 0.9rem;
    color: var(--el-text-color-secondary);
  }

  .option-control {
    width: 180px;
  }
}
</style>