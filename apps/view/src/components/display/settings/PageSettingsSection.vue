<script setup lang="ts">
defineProps<{
  title: string;
  icon?: string;
  color?: string;
}>();
</script>

<template>
  <div class="PageSettingsSection">
    <div class="PageSettingsSection-header">
      <div
        class="PageSettingsSection-icon"
        :style="{ backgroundColor: color || 'var(--theme-color)' }"
      >
        <div :class="icon" v-if="icon" />
        <slot name="icon" v-else />
      </div>
      <div class="PageSettingsSection-title">{{ title }}</div>
    </div>
    <div class="PageSettingsSection-content">
      <slot />
    </div>
  </div>
</template>

<style lang="scss" scoped>
.PageSettingsSection {
  width: 100%;
  border-radius: 12px;
  background: rgba(255, 255, 255, 0.95);
  overflow: visible;
  margin-bottom: 16px;
  position: relative;
  border: 1px solid var(--el-border-color-light);

  &-header {
    &::before {
      z-index: -1;
      content: "";
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      opacity: 0.25;
      filter: blur(2px);
      background-image: linear-gradient(
      45deg,
      var(--theme-color-light) 0,
      var(--theme-color-primary) 100%
    );
      border-radius: 12px 12px 0 0;
    }
    z-index: 1;
    display: flex;
    align-items: center;
    padding: 12px 16px;
    gap: 12px;
    position: relative;
    overflow: hidden;
    border-radius: 12px 12px 0 0;
    border-bottom: 1px solid rgba(0, 0, 0, 0.05);
  }

  &-icon {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 32px;
    height: 32px;
    border-radius: 50%;
    color: white;
    flex-shrink: 0;
    font-size: 16px;
    position: relative;
    overflow: hidden;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  }

  &-title {
    font-size: 16px;
    font-weight: 700;
    color: var(--el-text-color-primary);
  }

  &-content {
    width: 100%;
    background-color: transparent;
    // padding: 12px 16px;
    max-height: 450px;
    overflow-y: auto;

    &::-webkit-scrollbar {
      width: 3px;
    }

    &::-webkit-scrollbar-track {
      background: transparent;
    }

    &::-webkit-scrollbar-thumb {
      background-color: var(--el-border-color);
      border-radius: 3px;
    }
  }
}

:root.dark {
  .PageSettingsSection {
    background: rgba(28, 28, 30, 0.95);
    border: 1px solid var(--el-border-color-extra-light);

    &-header {
      border-bottom: 1px solid rgba(255, 255, 255, 0.05);
      &::before {
        filter: brightness(0.5);
      }
    }

    &-title {
      color: #ffffff;
    }

    &-content {
      background-color: transparent;

      &::-webkit-scrollbar-thumb {
        background-color: var(--el-border-color);
      }
    }
  }
}
</style>
