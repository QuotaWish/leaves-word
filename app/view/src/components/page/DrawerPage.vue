<script setup lang="ts">
import { ref, provide, onMounted, onUnmounted, watch, reactive } from 'vue'

const isExpanded = ref(false)
const drawerRef = ref<HTMLElement | null>(null)
const drawerContentRef = ref<HTMLElement | null>(null)
const decorationBarRef = ref<HTMLElement | null>(null)

const toggleDrawer = () => {
  isExpanded.value = !isExpanded.value
}

provide('drawerControl', {
  isExpanded,
  toggleDrawer,
  expand: () => isExpanded.value = true,
  collapse: () => isExpanded.value = false
})

// 触摸相关状态
const touchState = reactive({
  touching: false,
  startY: 0,
  lastY: 0,
  currentTranslateY: 0,
  isDecorationBarTouch: false // 新增：是否是点击小白条
})

// 配置参数
const options = {
  threshold: window.innerHeight * 0.3, // 展开/收起的阈值
  defaultPeekHeight: 25, // 默认露出的高度（从50减半）
  elasticity: 0.5, // 拖动的弹性系数
  topReservedSpace: 48, // 新增：顶部保留空间，确保不会完全覆盖导航栏
  collapsedPosition: window.innerHeight * 0.75 // 收起时的位置，修改为稍微露出一点
}

// 检查内容是否滚动到顶部
function isContentScrolledToTop() {
  if (!drawerContentRef.value) return true
  
  // 获取内部内容的滚动容器
  const innerContent = drawerContentRef.value.querySelector('.DrawerPage-Drawer-ContentInner')
  if (!innerContent) return true
  
  // 检查scrollTop是否为0（即滚动到顶部）
  return innerContent.scrollTop <= 0
}

// 处理触摸开始
function handleTouchStart(e: TouchEvent) {
  if (e.touches.length !== 1) return
  
  const touch = e.touches[0]
  
  // 判断触摸点是否在小白条上
  const target = e.target as HTMLElement
  touchState.isDecorationBarTouch = target.classList.contains('drawer-decoration-bar') ||
                                    target.closest('.drawer-decoration-bar') !== null
  
  // 如果不是点击小白条，且内容没有滚动到顶部，则不允许拉伸
  if (!touchState.isDecorationBarTouch && !isContentScrolledToTop()) {
    return
  }
  
  touchState.touching = true
  touchState.startY = touch.clientY
  touchState.lastY = touch.clientY
  
  if (drawerRef.value) {
    drawerRef.value.style.transition = 'none'
  }
}

// 处理触摸移动
function handleTouchMove(e: TouchEvent) {
  if (!touchState.touching || !drawerRef.value) return
  
  // 如果不是小白条触摸，且内容未滚动到顶部，阻止拖拽
  if (!touchState.isDecorationBarTouch && !isContentScrolledToTop()) {
    touchState.touching = false
    return
  }
  
  const touch = e.touches[0]
  const deltaY = touch.clientY - touchState.lastY
  touchState.lastY = touch.clientY
  
  const totalDeltaY = touch.clientY - touchState.startY
  
  // 计算新的位置，加入弹性，并且确保不会小于顶部保留空间
  const newTranslateY = Math.max(options.topReservedSpace, touchState.currentTranslateY + deltaY * options.elasticity)
  touchState.currentTranslateY = newTranslateY
  
  // 更新抽屉位置
  drawerRef.value.style.transform = `translateY(${newTranslateY}px)`
  
  // 根据移动距离动态更新状态
  if (Math.abs(totalDeltaY) > options.threshold) {
    isExpanded.value = totalDeltaY < 0
  }
}

// 处理触摸结束
function handleTouchEnd() {
  if (!touchState.touching || !drawerRef.value) return
  
  touchState.touching = false
  touchState.isDecorationBarTouch = false // 重置小白条触摸状态
  
  drawerRef.value.style.transition = 'transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
  
  // 根据当前展开状态设置最终位置，确保展开时保留顶部空间
  const finalPosition = isExpanded.value ? options.topReservedSpace : options.collapsedPosition
  touchState.currentTranslateY = finalPosition
  drawerRef.value.style.transform = `translateY(${finalPosition}px)`
}

// 监听展开状态变化
watch(isExpanded, (newValue) => {
  if (!drawerRef.value) return
  
  drawerRef.value.style.transition = 'transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
  const finalPosition = newValue ? options.topReservedSpace : options.collapsedPosition
  touchState.currentTranslateY = finalPosition
  drawerRef.value.style.transform = `translateY(${finalPosition}px)`
})

onMounted(() => {
  if (!drawerRef.value) return
  
  // 初始化位置
  touchState.currentTranslateY = options.collapsedPosition
  drawerRef.value.style.transform = `translateY(${options.collapsedPosition}px)`
  
  // 添加触摸事件监听
  drawerRef.value.addEventListener('touchstart', handleTouchStart)
  drawerRef.value.addEventListener('touchmove', handleTouchMove)
  drawerRef.value.addEventListener('touchend', handleTouchEnd)
})

onUnmounted(() => {
  if (drawerRef.value) {
    drawerRef.value.removeEventListener('touchstart', handleTouchStart)
    drawerRef.value.removeEventListener('touchmove', handleTouchMove)
    drawerRef.value.removeEventListener('touchend', handleTouchEnd)
  }
})
</script>

<template>
  <RoutePage class="DrawerPage">
    <div class="DrawerPage-Main">
      <slot name="main" />
      <button class="close-button" @click="$emit('close')">关闭</button>
    </div>
    <div ref="drawerRef" class="DrawerPage-Drawer" :class="{ expanded: isExpanded }">
      <div ref="drawerContentRef" class="DrawerPage-Drawer-Content transition-cubic fake-background">
        <div ref="decorationBarRef" class="drawer-decoration-bar" />
        <div class="DrawerPage-Drawer-ContentInner">
          <slot name="drawer" />
        </div>
      </div>
    </div>

    <template #bg>
      <slot name="bg" />
    </template>
  </RoutePage>
</template>

<style lang="scss" scoped>
.DrawerPage {
  .close-button {
    position: absolute;
    top: 24px;
    right: 24px;
    padding: 8px 16px;
    border-radius: 20px;
    font-size: 14px;
    background: rgba(255, 255, 255, 0.1);
    color: rgba(255, 255, 255, 0.9);
    border: 1px solid rgba(255, 255, 255, 0.2);
    cursor: pointer;
    transition: all 0.3s ease;
    z-index: 200;

    &:hover {
      background: rgba(255, 255, 255, 0.2);
    }
  }

  &-Main {
    z-index: 10;
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
  }

  &-Drawer {
    &.expanded {
      .DrawerPage-Drawer-Content {
        border-radius: 12px 12px 0 0; // 当展开时，修改上方圆角，保持美观
      }
    }
  
    &-Content {
      position: relative;
      
      .drawer-decoration-bar {
        position: absolute;
        top: 12px;
        left: 50%;
        transform: translateX(-50%);
        width: 80px;
        height: 6px;
        background: var(--el-text-color-regular);
        border-radius: 4px;
        cursor: grab;
        
        &:active {
          cursor: grabbing;
        }
      }

      &::before {
        content: "";
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        opacity: 0.75;
        background: linear-gradient(135deg, rgba(255, 255, 255, 0.15), rgba(255, 255, 255, 0.05));
      }
      
      padding-top: 32px;
      overflow: hidden;
      --fake-opacity: 0.75;
      backdrop-filter: blur(18px) saturate(180%);
      border-radius: 28px 28px 0 0;
      height: 100%;
      touch-action: none;

      &Inner {
        height: 100%;
        overflow-y: scroll;
      }
    }

    z-index: 100;
    position: fixed;
    bottom: 0;
    left: 0;
    width: 100%;
    height: 100%;
    will-change: transform;
    touch-action: none;
  }
}
</style>