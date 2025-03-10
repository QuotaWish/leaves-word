<script setup lang="ts">
import PageNavHolder from '~/components/page/holder/PageNavHolder.vue'
import { isDark, toggleDark, themeColor, themeColorMap, changeThemeColor, useTheme } from '~/composables/theme'
import { ref, computed } from 'vue'

const theme = useTheme()

// 当前主题设置
const currentTheme = computed(() => isDark.value ? '暗黑模式' : '亮色模式')

// 切换暗黑模式
const handleDarkToggle = (event: MouseEvent) => {
  toggleDark(undefined, event)
}

// 主题色相关
const themeColors = Object.entries(themeColorMap).map(([key, value]) => ({
  name: key,
  color: value.primary,
  label: {
    'blue': '深空蓝',
    'green': '自然绿',
    'purple': '梦幻紫',
    'orange': '活力橙',
    'red': '热情红'
  }[key]
}))

// 选择主题色
const selectThemeColor = (color: string, event: MouseEvent) => {
  changeThemeColor(color as any, event)
}

// 自定义设置
const fontSize = ref(14)
const enableAnimation = ref(true)
</script>

<template>
  <PageNavHolder class="ThemePage" title="主题设置" content-padding>
    <div class="theme-container">
      <div class="theme-section">
        <h2 class="section-title">显示模式</h2>
        <div class="display-mode">
          <div 
            class="mode-item" 
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
            class="mode-item" 
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
      </div>

      <div class="theme-section">
        <h2 class="section-title">主题颜色</h2>
        <div class="color-options">
          <div 
            v-for="colorItem in themeColors" 
            :key="colorItem.name"
            class="color-option"
            :class="{ active: themeColor === colorItem.name }"
            @click="($event) => selectThemeColor(colorItem.name, $event)"
          >
            <div class="color-preview" :style="{ backgroundColor: colorItem.color }">
              <div v-if="themeColor === colorItem.name" class="check-icon">
                <span i-carbon-checkmark />
              </div>
            </div>
            <div class="color-name">{{ colorItem.label }}</div>
          </div>
        </div>
      </div>

      <div class="theme-section">
        <h2 class="section-title">自定义设置</h2>
        <div class="custom-options">
          <div class="option-item">
            <div class="option-info">
              <div class="option-title">字体大小</div>
              <div class="option-desc">调整应用内文字大小</div>
            </div>
            <div class="option-control">
              <el-slider v-model="fontSize" :min="12" :max="20" :step="1" />
            </div>
          </div>
          
          <div class="option-item">
            <div class="option-info">
              <div class="option-title">动画效果</div>
              <div class="option-desc">启用页面过渡动画</div>
            </div>
            <div class="option-control">
              <el-switch v-model="enableAnimation" />
            </div>
          </div>
        </div>
      </div>
    </div>
  </PageNavHolder>
</template>

<style lang="scss" scoped>
.theme-container {
  padding: 1rem;
  max-width: 800px;
  margin: 0 auto;
}

.theme-section {
  margin-bottom: 2rem;
  padding: 1.5rem;
  border-radius: 12px;
  background-color: var(--el-fill-color-light);
}

.section-title {
  font-size: 1.2rem;
  font-weight: 600;
  margin-bottom: 1.5rem;
  color: var(--el-text-color-primary);
}

.display-mode {
  display: flex;
  justify-content: center;
  gap: 2rem;
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
      box-shadow: 0 0 0 2px rgba(var(--theme-color-primary, var(--el-color-primary)), 0.2);
    }
    
    .mode-name {
      color: var(--theme-color-primary, var(--el-color-primary));
      font-weight: 600;
    }
  }
}

.mode-preview {
  width: 100px;
  height: 160px;
  border-radius: 12px;
  border: 2px solid var(--el-border-color);
  overflow: hidden;
  margin-bottom: 1rem;
  transition: all 0.3s ease;
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
  height: 20px;
  width: 100%;
}

.preview-content {
  padding: 10px;
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.content-line {
  height: 10px;
  width: 100%;
  border-radius: 2px;
  
  &.short {
    width: 60%;
  }
}

.mode-name {
  font-size: 1rem;
  transition: color 0.3s ease;
}

.color-options {
  display: flex;
  flex-wrap: wrap;
  gap: 1.5rem;
  justify-content: center;
}

.color-option {
  display: flex;
  flex-direction: column;
  align-items: center;
  cursor: pointer;
  transition: all 0.3s ease;
  
  &.active {
    transform: scale(1.05);
    
    .color-name {
      color: var(--theme-color-primary, var(--el-color-primary));
      font-weight: 600;
    }
  }
}

.color-preview {
  width: 60px;
  height: 60px;
  border-radius: 50%;
  margin-bottom: 0.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
  border: 2px solid transparent;
  
  .check-icon {
    color: white;
    font-size: 1.2rem;
    filter: drop-shadow(0 0 1px rgba(0, 0, 0, 0.5));
  }
}

.active .color-preview {
  border-color: white;
  box-shadow: 0 0 0 2px var(--theme-color-primary, var(--el-color-primary));
}

.color-name {
  font-size: 0.9rem;
  transition: color 0.3s ease;
}

.custom-options {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.option-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.5rem 0;
}

.option-info {
  flex: 1;
}

.option-title {
  font-size: 1rem;
  margin-bottom: 0.2rem;
}

.option-desc {
  font-size: 0.85rem;
  color: var(--el-text-color-secondary);
}

.option-control {
  width: 120px;
}
</style> 