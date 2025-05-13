<script setup lang="ts">
defineProps<{
  title: string;
  icon?: string;
  gradient?: boolean;
  plain?: boolean;
}>();
</script>

<template>
  <div :class="{ plain }" class="settings-section theme-color-transition">
    <div class="settings-section-header">
      <div class="header-icon" v-if="icon">
        <div :class="icon" />
      </div>
      <div class="header-title">{{ title }}</div>
      <div class="header-end">
        <slot name="header-end" />
      </div>
    </div>
    <div class="settings-section-content">
      <slot />
    </div>
  </div>
</template>

<style lang="scss" scoped>
.settings-section {
  border-radius: 15px;
  background-color: var(--el-bg-color);
  overflow: hidden;
  margin-bottom: 1rem;
  border: 1px solid var(--el-border-color-light);
  transition: all 0.3s ease;
  position: relative;

  .settings-section-header {
    display: flex;
    align-items: center;
    padding: 0.75rem 1rem;
    border-bottom: 1px solid var(--el-border-color-light);

    .header-icon {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 30px;
      height: 30px;
      border-radius: 50%;
      background-color: var(--theme-color-light, #e8f5e9);
      color: var(--theme-color-primary, #2e7d32);
      margin-right: 0.75rem;
    }

    .header-title {
      flex: 1;
      font-size: 1.1rem;
      font-weight: 600;
      color: var(--el-text-color-primary);
    }

    .header-end {
      display: flex;
      align-items: center;
    }
  }

  .settings-section-content {
    padding: 0;
  }
}

// 暗黑模式适配
.dark .settings-section {
  background-color: var(--el-bg-color-overlay);
  border-color: var(--el-border-color-darker);
}

.settings-section.plain {
  div.settings-section-header {
    margin: 1rem 0;
    padding: 0 0.5rem;

    border: none;
  }

  .header-title {
    flex: 1;
    font-size: 1.1rem;
    font-weight: 300;
    color: var(--el-text-color-primary);
  }

  border: none;
  background: none;
}
</style>
