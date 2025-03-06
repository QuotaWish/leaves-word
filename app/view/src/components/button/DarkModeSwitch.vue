<script setup lang="ts">
import { useDark, useToggle } from '@vueuse/core'
import { ref } from 'vue'

const isDark = useDark({
  selector: 'html',
  attribute: 'data-bs-theme',
  valueDark: 'dark',
  valueLight: 'light'
})

const toggleDark = useToggle(isDark)

// 处理暗色模式切换
const handleToggle = (event: MouseEvent) => {
  const x = event.clientX
  const y = event.clientY
  // 计算最大半径 - 从点击位置到最远角落的距离
  const endRadius = Math.hypot(
    Math.max(x, innerWidth - x),
    Math.max(y, innerHeight - y)
  )

  // 如果浏览器不支持 View Transitions API，直接切换
  if (!document.startViewTransition) {
    toggleDark()
    return
  }

  // 启动过渡动画
  const transition = document.startViewTransition(async () => {
    toggleDark()
  })

  // 当准备好后开始动画
  transition.ready.then(() => {
    const clipPath = [
      `circle(0px at ${x}px ${y}px)`,
      `circle(${endRadius}px at ${x}px ${y}px)`
    ]

    document.documentElement.animate(
      {
        clipPath: isDark.value ? [...clipPath].reverse() : clipPath,
      },
      {
        duration: 400,
        easing: 'cubic-bezier(0.4, 0, 0.2, 1)',
        pseudoElement: isDark.value
          ? '::view-transition-old(root)'
          : '::view-transition-new(root)',
      }
    )
  })
}
</script>

<template>
  <div class="DarkModeSwitch">
    <ElTooltip :content="isDark ? '切换亮色模式' : '切换暗色模式'">
      <div
        class="switch-button flex cursor-pointer items-center rounded-md p-1.5 transition-colors hover:bg-gray-100 dark:hover:bg-gray-800"
        @click="handleToggle"
      >
        <div i-carbon-moon v-if="isDark" />
        <div i-carbon-sun v-else />
      </div>
    </ElTooltip>
  </div>
</template>

<style lang="scss" scoped>
.DarkModeSwitch {
  .switch-button {
    color: var(--el-text-color-primary);
  }
}
</style>

<style>
::view-transition-old(root),
::view-transition-new(root) {
  animation: none;
  mix-blend-mode: normal;
}

/* 控制暗色模式切换时的层级顺序 */
::view-transition-old(root) {
  z-index: 1;
}

::view-transition-new(root) {
  z-index: 2147483646;
}

/* 暗色模式下调整层级顺序 */
[data-bs-theme="dark"]::view-transition-old(root) {
  z-index: 2147483646;
}

[data-bs-theme="dark"]::view-transition-new(root) {
  z-index: 1;
}
</style>
