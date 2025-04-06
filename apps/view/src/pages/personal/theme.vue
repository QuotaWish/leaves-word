<script setup lang="ts">
import PageNavHolder from "~/components/page/holder/PageNavHolder.vue";
import SettingsOption from "~/components/settings/SettingsOption.vue";
import ColorOption from "~/components/settings/ColorOption.vue";
import {
  isDark,
  toggleDark,
  themeColor,
  themeColorMap,
  changeThemeColor,
  useTheme,
} from "~/composables/theme";
import { ref, computed } from "vue";

const theme = useTheme();

// 当前主题设置
const currentTheme = computed(() => (isDark.value ? "暗黑模式" : "亮色模式"));

// 切换暗黑模式
const handleDarkToggle = (event: MouseEvent) => {
  toggleDark(undefined, event);
};

// 主题色相关
const themeColors = Object.entries(themeColorMap).map(([key, value]) => ({
  name: key,
  color: value.primary,
  label: {
    blue: "深空蓝",
    green: "自然绿",
    purple: "梦幻紫",
    orange: "活力橙",
    red: "热情红",
  }[key] || "未知颜色",
}));

// 选择主题色
const selectThemeColor = (color: string, event: MouseEvent) => {
  changeThemeColor(color as any, event);
};

// 自定义设置
const fontSize = ref(14);
const enableAnimation = ref(true);
</script>

<template>
  <PageNavHolder class="ThemePage" title="主题设置" :content-padding="false">
    <div class="theme-container">
      <!-- 显示模式 -->
      <PageSettingsSection title="显示模式" icon="i-carbon-screen">
        <div class="display-mode my-4">
          <div
            class="mode-item theme-color-transition"
            :class="{ active: !isDark }"
            @click="($event) => toggleDark(false, $event)"
          >
            <div class="mode-preview light-preview">
              <div class="preview-header"></div>
              <div class="preview-content">
                <div class="content-line"></div>
                <div class="content-line"></div>
                <div class="content-line short"></div>
              </div>
            </div>
            <div class="mode-name">亮色模式</div>
          </div>

          <div
            class="mode-item theme-color-transition"
            :class="{ active: isDark }"
            @click="($event) => toggleDark(true, $event)"
          >
            <div class="mode-preview dark-preview">
              <div class="preview-header"></div>
              <div class="preview-content">
                <div class="content-line"></div>
                <div class="content-line"></div>
                <div class="content-line short"></div>
              </div>
            </div>
            <div class="mode-name">暗黑模式</div>
          </div>
        </div>
      </PageSettingsSection>

      <!-- 主题颜色 -->
      <PageSettingsSection title="主题颜色" icon="i-carbon-color-palette">
        <div class="color-options">
          <ColorOption
            v-for="colorItem in themeColors"
            :key="colorItem.name"
            :color="colorItem.color"
            :name="colorItem.name"
            :label="colorItem.label"
            :active="themeColor === colorItem.name"
            @select="($event) => selectThemeColor(colorItem.name, $event)"
          />
        </div>
      </PageSettingsSection>

      <!-- 自定义设置 -->
      <PageSettingsSection title="自定义设置" icon="i-carbon-settings-adjust">
        <div class="custom-options">
          <SettingsOption title="字体大小" description="调整应用内文字大小">
            <el-slider v-model="fontSize" :min="12" :max="20" :step="1" />
          </SettingsOption>

          <SettingsOption title="动画效果" description="启用页面过渡动画">
            <el-switch v-model="enableAnimation" />
          </SettingsOption>
        </div>
      </PageSettingsSection>
    </div>
  </PageNavHolder>
</template>

<style lang="scss" scoped>
.theme-container {
  padding: 1.5rem;
  max-width: 800px;
  margin: 0 auto;
}

.display-mode {
  display: flex;
  justify-content: center;
  gap: 3rem;
}

.mode-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  cursor: pointer;
  transition: all 0.3s ease;

  &.active {
    transform: scale(1.05);

    .mode-preview {
      border-color: var(--theme-color-primary, var(--el-color-primary));
      box-shadow: 0 0 0 3px rgba(var(--theme-color-primary-rgb, 23, 119, 255), 0.2);
    }

    .mode-name {
      color: var(--theme-color-primary, var(--el-color-primary));
      font-weight: 600;
    }
  }

  &:hover:not(.active) .mode-preview {
    transform: translateY(-5px);
    box-shadow: 0 5px 15px rgba(0, 0, 0, 0.08);
  }
}

.mode-preview {
  width: 120px;
  height: 180px;
  border-radius: 16px;
  border: 2px solid var(--el-border-color);
  overflow: hidden;
  margin-bottom: 1.25rem;
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

.content-line {
  height: 12px;
  width: 100%;
  border-radius: 4px;

  &.short {
    width: 60%;
  }
}

.mode-name {
  font-size: 1.1rem;
  transition: color 0.3s ease;
  margin-top: 0.5rem;
}

.color-options {
  display: flex;
  flex-wrap: wrap;
  gap: 2rem;
  justify-content: center;
  padding: 0.5rem;
}

.custom-options {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}
</style>
