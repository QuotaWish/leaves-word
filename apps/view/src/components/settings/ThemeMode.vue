<script lang="ts" setup>
const _props = defineProps<{
  active: boolean;
  mode: "light" | "dark";
}>();
</script>

<template>
  <div
    class="ThemeMode mode-item theme-color-transition"
    :class="{ active }"
    @click="($event) => toggleDark(false, $event)"
  >
    <div
      class="mode-preview"
      :class="{
        'light-preview': mode === 'light',
        'dark-preview': mode === 'dark',
      }"
    >
      <div class="preview-header"></div>
      <div class="preview-content">
        <div class="content-line"></div>
        <div class="content-line"></div>
        <div class="content-line short"></div>
      </div>
    </div>
    <div class="mode-name">
      {{ mode === "light" ? "亮色模式" : "暗色模式" }}
    </div>
  </div>
</template>

<style lang="scss" scoped>
.mode-item {
  display: flex;
  flex-direction: column;
  align-items: center;

  width: 100%;

  cursor: pointer;
  transition: all 0.3s ease;

  &.active {
    .mode-preview {
      border-color: var(--theme-color-primary, var(--el-color-primary));
      box-shadow: 0 0 0 3px
        rgba(var(--theme-color-primary-rgb, 23, 119, 255), 0.2);
    }

    .mode-name {
      color: var(--theme-color-primary, var(--el-color-primary));
      font-weight: 600;
    }
  }
}

.mode-preview {
  width: 100%;
  height: 180px;
  border-radius: 16px;
  border: 3px solid var(--el-border-color);
  overflow: hidden;
  transition: all 0.3s ease;
  position: relative;
}

.light-preview {
  background-color: #fff;

  .preview-header {
    background-color: #f0f2f5;
  }

  .content-line {
    background-color: #e0e0e0;
  }
}

.dark-preview {
  background-color: #1a1a1a;

  .preview-header {
    background-color: #333;
  }

  .content-line {
    background-color: #444;
  }
}

.preview-header {
  height: 24px;
  width: 100%;
}

.preview-content {
  padding: 15px;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.mode-name {
  font-size: 1.1rem;
  transition: color 0.3s ease;
  margin-top: 0.5rem;
}

.content-line {
  height: 12px;
  width: 100%;
  border-radius: 4px;

  &.short {
    width: 60%;
  }
}
</style>
