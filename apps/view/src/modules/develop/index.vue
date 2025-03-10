<script setup lang="ts">
import { useGlobalSplashState, ScreenMode } from '~/modules/splash'
import { useStorage } from '@vueuse/core'
import { ref, computed, onMounted, onUnmounted, watch } from 'vue'
import type VConsole from 'vconsole'

const splashState = useGlobalSplashState()
const isWrapped = computed(() => splashState.screenMode.value === ScreenMode.WRAPPED)

const devModeEnabled = useStorage('leaves-dev-mode-enabled', false)

const isVisible = computed(() => {
  if (isWrapped.value) return true
  return devModeEnabled.value
})

// vConsole实例
const vConsoleInstance = ref<VConsole | null>(null)

// 判断是否为开发环境
const isDev = process.env.NODE_ENV === 'development'

// 如果是开发环境，动态引入vConsole
async function initVConsole() {
  if (isDev || devModeEnabled.value) {
    try {
      const VConsole = (await import('vconsole')).default
      if (!vConsoleInstance.value) {
        vConsoleInstance.value = new VConsole()
        console.log('[Dev] vConsole initialized')
      }
    } catch (err) {
      console.error('[Dev] Failed to load vConsole:', err)
    }
  } else if (vConsoleInstance.value) {
    // 如果不是开发环境或关闭了开发者模式，销毁vConsole实例
    vConsoleInstance.value.destroy()
    vConsoleInstance.value = null
    console.log('[Dev] vConsole destroyed')
  }
}

// 监听devModeEnabled变化，初始化或销毁vConsole
watch(devModeEnabled, initVConsole, { immediate: true })

const rootMainSize = ref({ width: 0, height: 0 })

function updateRootMainSize() {
  const rootMain = document.getElementById('rootMain')
  if (rootMain) {
    rootMainSize.value = {
      width: rootMain.clientWidth,
      height: rootMain.clientHeight
    }
  }
}

// 拖动相关状态
const isDragging = ref(false)
const position = useStorage('leaves-dev-ball-position', {
  x: 0,
  y: 0
})

// 贴边状态
const stickyPosition = ref('right') // 'left' 或 'right'
const isShowingPositionTip = ref(false)

const dragOffset = ref({ x: 0, y: 0 })
const isExpanded = useStorage('leaves-dev-ball-expanded', false)

// 展开时的炫光动效
const isGlowing = ref(false)

// 监听isExpanded，展开时触发炫光动效
watch(isExpanded, (newVal) => {
  if (newVal) {
    isGlowing.value = true
    setTimeout(() => {
      isGlowing.value = false
    }, 1500) // 延长闪烁时间
  }
})

const lastMovePosition = ref({ x: 0, y: 0 });

function initializePosition() {
  updateRootMainSize()
  const width = rootMainSize.value.width || window.innerWidth
  const height = rootMainSize.value.height || window.innerHeight

  // 默认初始在右侧
  position.value = {
    x: width - 60,
    y: height * 0.7 // 距离底部30%
  }
  stickyPosition.value = 'right'
}

// 自动贴边功能
function snapToEdge() {
  const ballWidth = isExpanded.value ? 50 : 30
  const threshold = rootMainSize.value.width * 0.5

  // 根据球的位置确定应该贴哪边
  if (position.value.x < threshold) {
    // 贴左边
    position.value.x = 0
    stickyPosition.value = 'left'
  } else {
    // 贴右边
    position.value.x = rootMainSize.value.width - ballWidth
    stickyPosition.value = 'right'
  }

  // 使球的Y位置保持在视口内
  position.value.y = Math.max(0, Math.min(position.value.y, rootMainSize.value.height - ballWidth))

  // 显示位置提示，然后淡出
  isShowingPositionTip.value = true
  setTimeout(() => {
    isShowingPositionTip.value = false
  }, 2000)
}

// 处理拖动
function handleMouseDown(e: MouseEvent) {
  // 如果点击是右键，则不进行拖拽
  if (e.button === 2) return

  isDragging.value = true

  // 记录最后的移动位置
  lastMovePosition.value = {
    x: e.clientX,
    y: e.clientY
  };

  // 计算鼠标与圆球位置的偏移量
  dragOffset.value = {
    x: e.clientX - position.value.x,
    y: e.clientY - position.value.y
  }

  // 立即展开球
  isExpanded.value = true

  // 阻止事件冒泡和默认行为
  e.stopPropagation()
  e.preventDefault()

  // 添加事件监听器，使用捕获阶段以确保更快的响应
  document.addEventListener('mousemove', handleMouseMove, { capture: true })
  document.addEventListener('mouseup', handleMouseUp, { capture: true })
  document.addEventListener('touchmove', handleTouchMove, { capture: true, passive: false })
  document.addEventListener('touchend', handleMouseUp, { capture: true })
}

// 单独处理触摸开始事件
function handleTouchStart(e: TouchEvent) {
  isDragging.value = true

  if (e.touches[0]) {
    // 记录最后的移动位置
    lastMovePosition.value = {
      x: e.touches[0].clientX,
      y: e.touches[0].clientY
    };

    // 计算触摸点与圆球位置的偏移量
    dragOffset.value = {
      x: e.touches[0].clientX - position.value.x,
      y: e.touches[0].clientY - position.value.y
    }
  }

  // 立即展开球
  isExpanded.value = true

  // 阻止事件冒泡和默认行为（防止页面滚动）
  e.stopPropagation()
  e.preventDefault()

  // 添加事件监听器，使用捕获阶段以确保更快的响应
  document.addEventListener('touchmove', handleTouchMove, { capture: true, passive: false })
  document.addEventListener('touchend', handleMouseUp, { capture: true })
}

function handleMouseMove(e: MouseEvent) {
  if (!isDragging.value) return

  // 记录最后的移动位置
  lastMovePosition.value = {
    x: e.clientX,
    y: e.clientY
  };

  // 更新球的位置，不限制左右位置，确保自由跟随
  position.value = {
    x: e.clientX - dragOffset.value.x,
    y: e.clientY - dragOffset.value.y
  }

  // 拖动时暂时展开球以提供更好的视觉反馈
  if (!isExpanded.value) {
    isExpanded.value = true
  }

  // 防止事件冒泡和默认行为
  e.preventDefault()
  e.stopPropagation()
}

function handleTouchMove(e: TouchEvent) {
  if (!isDragging.value || !e.touches[0]) return

  // 记录最后的移动位置
  lastMovePosition.value = {
    x: e.touches[0].clientX,
    y: e.touches[0].clientY
  };

  // 更新球的位置，不限制左右位置，确保自由跟随
  position.value = {
    x: e.touches[0].clientX - dragOffset.value.x,
    y: e.touches[0].clientY - dragOffset.value.y
  }

  // 拖动时暂时展开球以提供更好的视觉反馈
  if (!isExpanded.value) {
    isExpanded.value = true
  }

  // 防止事件冒泡和默认行为
  e.preventDefault()
  e.stopPropagation()
}

function handleMouseUp(e?: MouseEvent | TouchEvent) {
  const wasDragging = isDragging.value
  isDragging.value = false

  if (wasDragging) {
    // 结束拖动后自动贴边
    snapToEdge()

    // 3秒后自动隐藏
    setTimeout(() => {
      isExpanded.value = false
      console.log('Developer ball auto collapsed after drag')
      // 隐藏后再次确保贴边
      snapToEdge()
    }, 3000)
  }

  // 移除事件监听器
  document.removeEventListener('mousemove', handleMouseMove, { capture: true })
  document.removeEventListener('mouseup', handleMouseUp, { capture: true })
  document.removeEventListener('touchmove', handleTouchMove, { capture: true })
  document.removeEventListener('touchend', handleMouseUp, { capture: true })
}

// 处理点击事件
function handleClick() {
  // 如果正在拖动，则不处理点击事件
  if (isDragging.value) return

  // 展开球
  isExpanded.value = true
  console.log('Developer ball clicked! expanded')

  // 根据新状态更新位置，确保贴边
  snapToEdge()

  // 设置3秒后自动隐藏
  setTimeout(() => {
    isExpanded.value = false
    console.log('Developer ball auto collapsed after 3s')
    // 隐藏后再次确保贴边
    snapToEdge()
  }, 3000)
}

// 在组件卸载时清理
onUnmounted(() => {
  document.removeEventListener('mousemove', handleMouseMove, { capture: true })
  document.removeEventListener('mouseup', handleMouseUp, { capture: true })
  document.removeEventListener('touchmove', handleTouchMove, { capture: true })
  document.removeEventListener('touchend', handleMouseUp, { capture: true })
  window.removeEventListener('resize', handleResize)

  // 销毁vConsole实例
  if (vConsoleInstance.value) {
    vConsoleInstance.value.destroy()
    vConsoleInstance.value = null
  }
})

// 确保在屏幕大小变化时保持圆球在视口内并贴边
function ensureInViewport() {
  updateRootMainSize()
  const ballSize = isExpanded.value ? 50 : 30
  position.value = {
    x: Math.min(position.value.x, rootMainSize.value.width - ballSize),
    y: Math.min(position.value.y, rootMainSize.value.height - ballSize)
  }

  // 保持贴边
  snapToEdge()
}

// 处理窗口大小变化
function handleResize() {
  updateRootMainSize()
  ensureInViewport()
}

onMounted(() => {
  // 初始化位置
  initializePosition()

  // 添加resize监听
  window.addEventListener('resize', handleResize)

  // 初始检查位置
  ensureInViewport()

  // 观察#rootMain元素大小变化
  const resizeObserver = new ResizeObserver(() => {
    updateRootMainSize()
    ensureInViewport()
  })

  const rootMain = document.getElementById('rootMain')
  if (rootMain) {
    resizeObserver.observe(rootMain)
  }

  // 组件卸载时清理
  onUnmounted(() => {
    resizeObserver.disconnect()
  })

  // 初始化vConsole（如果在开发环境）
  initVConsole()
})
</script>

<template>
  <Teleport to="#rootMain" :disabled="false" :defer="true">
    <div v-if="isVisible" class="developer-floating-ball" :class="{
      'collapsed': !isExpanded,
      'expanded': isExpanded,
      'glow-effect': isGlowing,
      'stick-left': stickyPosition === 'left',
      'stick-right': stickyPosition === 'right',
      'dragging': isDragging
    }" :style="{
      left: `${position.x}px`,
      top: `${position.y}px`
    }" @mousedown="handleMouseDown" @touchstart="handleTouchStart" @click="handleClick">
      <div class="ball-content">
        <i class="i-mdi-robot text-xl"></i>
      </div>
      <div class="ball-pulse"></div>
      <div class="ball-ring"></div>
      <div class="glow-overlay" v-if="isGlowing"></div>

      <!-- 位置提示 -->
      <div class="position-tip" v-if="isShowingPositionTip">
        <span>{{ stickyPosition === 'left' ? '左侧' : '右侧' }}</span>
      </div>
    </div>
  </Teleport>
</template>

<style lang="scss" scoped>
.developer-floating-ball {
  position: fixed;
  width: 50px;
  height: 50px;
  border-radius: 50%;
  background: linear-gradient(135deg, #4f56ff, #ff4980);
  box-shadow:
    0 2px 15px rgba(79, 86, 255, 0.5),
    0 0 30px rgba(255, 73, 128, 0.3);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 99999;
  user-select: none;
  touch-action: none;
  cursor: pointer;
  transition:
    width 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275),
    height 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275),
    opacity 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275),
    transform 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275),
    box-shadow 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275),
    border-radius 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: linear-gradient(45deg, rgba(255, 255, 255, 0.1), rgba(255, 255, 255, 0));
    border-radius: 50%;
    z-index: 1;
  }

  &:hover {
    box-shadow:
      0 4px 20px rgba(79, 86, 255, 0.6),
      0 0 40px rgba(255, 73, 128, 0.4);
    transform: scale(1.05);
  }

  &:active {
    transform: scale(0.95);
  }

  // 拖动状态样式
  &.dragging {
    transition: none !important; // 拖动时完全禁用所有过渡效果

    * {
      transition: none !important; // 确保子元素也禁用过渡
    }

    opacity: 0.8;
    transform: scale(1.05);

    .ball-content {
      transform: scale(0.9);
    }
  }

  // 左侧贴边样式
  &.stick-left {
    left: 0 !important;
    border-top-left-radius: 0;
    border-bottom-left-radius: 0;
    border-top-right-radius: 50%;
    border-bottom-right-radius: 50%;

    &.collapsed {
      transform: translateX(-60%);

      &:hover:not(.dragging) {
        transform: translateX(-55%) scale(1.05);
      }

      &:active:not(.dragging) {
        transform: translateX(-55%) scale(0.95);
      }
    }
  }

  // 右侧贴边样式
  &.stick-right {
    right: 0 !important;
    left: auto !important;
    border-top-right-radius: 0;
    border-bottom-right-radius: 0;
    border-top-left-radius: 50%;
    border-bottom-left-radius: 50%;

    &.collapsed {
      transform: translateX(60%);

      &:hover:not(.dragging) {
        transform: translateX(55%) scale(1.05);
      }

      &:active:not(.dragging) {
        transform: translateX(55%) scale(0.95);
      }
    }
  }

  // 收缩状态样式
  &.collapsed {
    width: 30px;
    height: 30px;
    opacity: 0.7;

    .ball-content {
      transform: scale(0.7);
    }

    .ball-pulse,
    .ball-ring {
      animation-play-state: paused;
    }

    &:hover:not(.dragging) {
      opacity: 0.9;
    }
  }

  // 展开状态样式
  &.expanded {
    width: 50px;
    height: 50px;
    opacity: 1;
    transform: translateX(0);

    .ball-content {
      transform: scale(1);
    }

    .ball-pulse,
    .ball-ring {
      animation-play-state: running;
    }
  }

  .ball-content {
    color: white;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;
    height: 100%;
    z-index: 3;
    transition: transform 0.3s ease;
    text-shadow: 0 1px 3px rgba(0, 0, 0, 0.3);
  }

  // 脉冲效果
  .ball-pulse {
    position: absolute;
    width: 100%;
    height: 100%;
    border-radius: 50%;
    background: radial-gradient(circle, rgba(255, 255, 255, 0.8) 0%, rgba(255, 255, 255, 0) 70%);
    opacity: 0;
    z-index: 2;
    animation: pulse 2s ease-in-out infinite;
  }

  // 外环效果
  .ball-ring {
    position: absolute;
    width: 100%;
    height: 100%;
    border-radius: 50%;
    border: 2px solid rgba(255, 255, 255, 0.3);
    box-sizing: border-box;
    z-index: 0;
    animation: rotate 10s linear infinite;
  }

  // 炫光效果
  &.glow-effect {
    animation: glow-pulse 1s ease-out;
  }

  // 炫光叠加层
  .glow-overlay {
    position: absolute;
    top: -20px;
    left: -20px;
    right: -20px;
    bottom: -20px;
    background: radial-gradient(circle, rgba(255, 255, 255, 0.9) 0%, rgba(255, 255, 255, 0) 70%);
    border-radius: 50%;
    z-index: 4;
    pointer-events: none;
    animation: glow-overlay 1s ease-out forwards;
  }

  // 位置提示
  .position-tip {
    position: absolute;
    bottom: -30px;
    left: 50%;
    transform: translateX(-50%);
    background-color: rgba(0, 0, 0, 0.7);
    color: white;
    padding: 4px 8px;
    border-radius: 4px;
    font-size: 12px;
    white-space: nowrap;
    opacity: 0;
    animation: fade-in-out 2s ease-in-out forwards;
    z-index: 5;
  }
}

@keyframes pulse {
  0% {
    transform: scale(0.5);
    opacity: 0;
  }

  50% {
    opacity: 0.2;
  }

  100% {
    transform: scale(1.5);
    opacity: 0;
  }
}

@keyframes rotate {
  from {
    transform: rotate(0deg);
  }

  to {
    transform: rotate(360deg);
  }
}

// 炫光脉冲动画
@keyframes glow-pulse {
  0% {
    box-shadow: 0 0 5px rgba(79, 86, 255, 0.5), 0 0 10px rgba(255, 73, 128, 0.3);
  }

  50% {
    box-shadow: 0 0 40px rgba(79, 86, 255, 0.9), 0 0 80px rgba(255, 73, 128, 0.8);
    transform: scale(1.1);
  }

  100% {
    box-shadow: 0 0 5px rgba(79, 86, 255, 0.5), 0 0 10px rgba(255, 73, 128, 0.3);
  }
}

// 炫光叠加层动画
@keyframes glow-overlay {
  0% {
    opacity: 0.9;
    transform: scale(0.3);
  }

  50% {
    opacity: 0.7;
  }

  100% {
    opacity: 0;
    transform: scale(2.5);
  }
}

// 提示淡入淡出动画
@keyframes fade-in-out {
  0% {
    opacity: 0;
  }

  20% {
    opacity: 1;
  }

  80% {
    opacity: 1;
  }

  100% {
    opacity: 0;
  }
}
</style>
