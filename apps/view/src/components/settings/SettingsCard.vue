<script setup lang="ts">
defineProps<{
  title: string
  icon?: string
  gradient?: boolean
}>()
</script>

<template>
  <div class="settings-card theme-color-transition">
    <div class="settings-card-header">
      <div class="header-icon" v-if="icon">
        <div :class="icon" />
      </div>
      <h3 class="header-title">{{ title }}</h3>
    </div>
    <div class="settings-card-content">
      <slot />
    </div>
  </div>
</template>

<style lang="scss" scoped>
.settings-card {
  border-radius: 16px;
  background-color: var(--el-fill-color-light);
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.04);
  overflow: hidden;
  margin-bottom: 1rem;
  border: 1px solid var(--el-border-color-light);

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(var(--theme-color-primary-rgb), 0.1);
  }

  .settings-card-header {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    padding: 1rem;
    border-bottom: 1px solid var(--el-border-color-light);

    .header-icon {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 32px;
      height: 32px;
      border-radius: 8px;
      background-color: var(--theme-color-light);
      color: var(--theme-color-primary);
    }

    .header-title {
      margin: 0;
      font-size: 1.1rem;
      font-weight: 600;
      color: var(--el-text-color-primary);
    }
  }

  .settings-card-content {
    padding: 1rem;
  }
}
</style>