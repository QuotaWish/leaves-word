<script setup lang="ts">
import { isDark, toggleDark, features, themeColor, themeColorMap, changeThemeColor, useTheme } from '~/composables/theme'
import { ref, computed, onMounted } from 'vue'

// 主题管理API
const theme = useTheme()

// 处理暗色模式切换
const handleToggle = (event: MouseEvent) => {
  // 传递点击事件参数，启用圆形扩散效果
  toggleDark(undefined, event)
}

// 当前主题色
const currentThemeColor = computed(() => {
  return themeColorMap[themeColor.value].primary
})

// 主题色选项
const themeColors = Object.entries(themeColorMap).map(([key, value]) => ({
  name: key,
  color: value.primary,
}))

// 显示主题色选择器
const showColorPicker = ref(false)

// 处理主题色变更
const handleColorChange = (colorName: string, event?: MouseEvent) => {
  // 传递点击事件参数，启用圆形扩散效果
  // @ts-ignore - 类型转换
  changeThemeColor(colorName, event)
  showColorPicker.value = false
}

// 确保在挂载时应用正确的样式
onMounted(() => {
  // 强制刷新一下样式以确保正确显示
  const currentMode = isDark.value
  document.documentElement.classList.toggle('dark', currentMode)
})
</script>

<template>
  <div class="DarkModeSwitch flex items-center gap-2">
    <!-- 暗色模式切换 -->
    <ElTooltip :content="isDark ? '切换亮色模式' : '切换暗色模式'">
      <div
        class="switch-button flex cursor-pointer items-center rounded-md p-1.5 transition-colors hover:bg-gray-100 dark:hover:bg-gray-800"
        @click="handleToggle"
      >
        <div i-carbon-moon v-if="isDark" />
        <div i-carbon-sun v-else />
      </div>
    </ElTooltip>

    <!-- 主题色选择器 -->
    <ElPopover
      trigger="click"
      :width="200"
      v-model:visible="showColorPicker"
    >
      <template #reference>
        <div
          class="theme-color-button flex cursor-pointer items-center rounded-md p-1.5 transition-colors hover:bg-gray-100 dark:hover:bg-gray-800"
          :style="{ color: currentThemeColor }"
        >
          <div i-carbon-color-palette />
        </div>
      </template>
      
      <div class="theme-color-picker p-2">
        <div class="mb-2 text-sm font-medium">选择主题色</div>
        <div class="flex flex-wrap gap-2">
          <div
            v-for="color in themeColors"
            :key="color.name"
            class="color-item flex h-6 w-6 cursor-pointer items-center justify-center rounded-full transition-transform hover:scale-110"
            :style="{ backgroundColor: color.color }"
            :class="{ 'ring-2 ring-offset-2': themeColor === color.name }"
            @click="($event) => handleColorChange(color.name, $event)"
          >
            <div v-if="themeColor === color.name" i-carbon-checkmark class="text-white text-xs" />
          </div>
        </div>
      </div>
    </ElPopover>
  </div>
</template>

<style lang="scss" scoped>
.DarkModeSwitch {
  .switch-button, .theme-color-button {
    color: var(--el-text-color-primary);
  }
  
  .theme-color-button {
    color: v-bind('currentThemeColor');
  }
}
</style>

<style>
/* 由于View Transitions API样式已经移到theme.ts中统一管理，这里可以删除重复样式 */
</style>
