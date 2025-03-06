<script setup lang="ts">
import { ref, provide, onMounted, onUnmounted, watch, reactive, computed } from 'vue'
import { DrawerControl, DrawerState } from './types'
import DrawerStateButton from '~/components/button/DrawerStateButton.vue'

// 将枚举暴露给模板使用
const DrawerStateEnum = DrawerState

const currentState = ref<DrawerState>(DrawerState.HIDE)
const drawerRef = ref<HTMLElement | null>(null)
const drawerContentRef = ref<HTMLElement | null>(null)
const decorationBarRef = ref<HTMLElement | null>(null)

// 添加状态菜单相关引用
const stateMenuVisible = ref(false)
const stateMenuRef = ref<HTMLElement | null>(null)
const longPressTimer = ref<number | null>(null)

// 添加滑动方向状态追踪
const lastSlideDirection = ref<'up' | 'down' | null>(null)

// 计算属性，用于向后兼容
const isExpanded = computed(() =>
  currentState.value === DrawerState.EXPAND ||
  currentState.value === DrawerState.FULLSCREEN
)
const isHidden = computed(() => currentState.value === DrawerState.HIDE)

// 定义屏幕尺寸相关常量
const topReservedSpace = 48

// 更高速直接的动画曲线，取消回弹效果
const qCubicBezier = 'cubic-bezier(0.25, 0.1, 0.25, 1.0)' // 更改为标准曲线，取消回弹
const transitionDuration = '0.15s' // 进一步减少时间至0.15s

// 配置参数 - 修复循环引用问题
const options = reactive({
  threshold: window.innerHeight * 0.2,
  defaultPeekHeight: 15,
  elasticity: 0.5,
  topReservedSpace: topReservedSpace,
  positions: {
    [DrawerState.HIDE]: window.innerHeight + 100, // 修改为屏幕外
    [DrawerState.VISIBLE]: window.innerHeight * 0.97, // 只显示小横条
    [DrawerState.SHRINK]: window.innerHeight * 0.8,   // 显示约20%内容
    [DrawerState.EXPAND]: topReservedSpace,   // 展开模式占据大部分屏幕（原全屏模式）
    [DrawerState.FULLSCREEN]: 0  // 真正的全屏模式（无边距）
  }
})

// 获取当前状态对应的位置
const getPositionForState = (state: DrawerState) => {
  return options.positions[state]
}

// 处理长按开始
function handleLongPressStart() {
  // 如果是隐藏状态，不处理长按
  if (currentState.value === DrawerState.HIDE) return

  longPressTimer.value = window.setTimeout(() => {
    stateMenuVisible.value = true
    useVibrate('medium'); // 长按触发时震动反馈
  }, 500) // 500ms长按触发
}

// 处理长按结束
function handleLongPressEnd() {
  if (longPressTimer.value) {
    clearTimeout(longPressTimer.value)
    longPressTimer.value = null
  }
}

// 处理状态菜单点击
function handleStateMenuSelect(state: DrawerState) {
  stateMenuVisible.value = false
  useVibrate('light');
  currentState.value = state
}

// 点击document时关闭菜单
function handleDocumentClick(e: MouseEvent) {
  if (stateMenuVisible.value && stateMenuRef.value && !stateMenuRef.value.contains(e.target as Node)) {
    stateMenuVisible.value = false
  }
}

// 抽屉控制函数
const drawerControl = {
  currentState,
  setState: (state: DrawerState) => currentState.value = state,
  isExpanded,
  isHidden,
  toggleDrawer: () => {
    useVibrate('light');
    
    // 根据最后滑动方向和当前状态决定切换行为
    if (lastSlideDirection.value === 'up') {
      // 向上滑动模式下，按钮点击切换到更高层级
      if (currentState.value === DrawerState.VISIBLE) {
        currentState.value = DrawerState.SHRINK
      } else if (currentState.value === DrawerState.SHRINK) {
        currentState.value = DrawerState.EXPAND
      } else if (currentState.value === DrawerState.EXPAND) {
        currentState.value = DrawerState.FULLSCREEN
      } else if (currentState.value === DrawerState.FULLSCREEN) {
        // 保持全屏状态
        currentState.value = DrawerState.FULLSCREEN
      }
    } else if (lastSlideDirection.value === 'down') {
      // 向下滑动模式下，按钮点击切换到更低层级
      if (currentState.value === DrawerState.FULLSCREEN) {
        currentState.value = DrawerState.EXPAND
      } else if (currentState.value === DrawerState.EXPAND) {
        currentState.value = DrawerState.SHRINK
      } else if (currentState.value === DrawerState.SHRINK) {
        currentState.value = DrawerState.VISIBLE
      } else if (currentState.value === DrawerState.VISIBLE) {
        // 保持VISIBLE状态，不做变化
        currentState.value = DrawerState.VISIBLE
      }
    } else {
      // 默认切换逻辑（如果没有滑动方向记录）
      if (currentState.value === DrawerState.FULLSCREEN) {
        currentState.value = DrawerState.EXPAND
      } else if (currentState.value === DrawerState.EXPAND) {
        currentState.value = DrawerState.SHRINK
      } else if (currentState.value === DrawerState.SHRINK) {
        currentState.value = DrawerState.EXPAND
      } else if (currentState.value === DrawerState.VISIBLE) {
        currentState.value = DrawerState.SHRINK
      }
    }
  },
  toggleFullscreen: () => {
    useVibrate('light');
    if (currentState.value === DrawerState.FULLSCREEN) {
      currentState.value = DrawerState.EXPAND
    } else {
      currentState.value = DrawerState.FULLSCREEN
    }
  },
  expand: () => {
    useVibrate('light');
    currentState.value = DrawerState.EXPAND
  },
  shrink: () => {
    useVibrate('light');
    currentState.value = DrawerState.SHRINK
  },
  collapse: () => {
    useVibrate('light');
    currentState.value = DrawerState.VISIBLE
  },
  hide: () => {
    useVibrate('light');
    if (currentState.value !== DrawerState.HIDE) {
      if (drawerRef.value) {
        // 先设置位置到HIDE状态（屏幕外）
        const finalPosition = getPositionForState(DrawerState.HIDE)
        drawerRef.value.style.transition = `transform ${transitionDuration} ${qCubicBezier}`
        touchState.currentTranslateY = finalPosition
        drawerRef.value.style.transform = `translateY(${finalPosition}px)`

        // 延迟设置状态，等待动画完成
        setTimeout(() => {
          currentState.value = DrawerState.HIDE
        }, 150) // 更新为与新的transitionDuration匹配
      } else {
        currentState.value = DrawerState.HIDE
      }
    }
  },
  show: () => {
    useVibrate('light');
    if (currentState.value === DrawerState.HIDE) {
      if (drawerRef.value) {
        // 确保drawer是可见的但不可交互
        currentState.value = DrawerState.VISIBLE

        // 先设置位置到屏幕外
        const hidePosition = getPositionForState(DrawerState.HIDE)
        drawerRef.value.style.transform = `translateY(${hidePosition}px)`
        drawerRef.value.style.transition = 'none'

        // 强制回流以确保上面的变化先应用
        drawerRef.value.offsetHeight

        // 接着应用过渡效果并移动到VISIBLE位置
        setTimeout(() => {
          if (drawerRef.value) {
            drawerRef.value.style.transition = `transform ${transitionDuration} ${qCubicBezier}`
            const visiblePosition = getPositionForState(DrawerState.VISIBLE)
            touchState.currentTranslateY = visiblePosition
            drawerRef.value.style.transform = `translateY(${visiblePosition}px)`
          }
        }, 10)
      } else {
        currentState.value = DrawerState.VISIBLE
      }
    }
  }
}

provide(DrawerControl, drawerControl)

defineExpose({
  drawerControl
})

// 触摸相关状态
const touchState = reactive({
  touching: false,
  startY: 0,
  lastY: 0,
  currentTranslateY: 0,
  isDecorationBarTouch: false, // 是否是点击小白条
  originalState: DrawerState.VISIBLE, // 记录触摸开始时的状态
})

// 检查内容是否滚动到顶部
function isContentScrolledToTop() {
  if (!drawerContentRef.value) return true
  const innerContent = drawerContentRef.value.querySelector('.DrawerPage-Drawer-ContentInner')
  if (!innerContent) return true
  return innerContent.scrollTop <= 0
}

// 处理触摸开始
function handleTouchStart(e: TouchEvent) {
  if (e.touches.length !== 1 || currentState.value === DrawerState.HIDE) return

  const touch = e.touches[0]
  const target = e.target as HTMLElement
  touchState.isDecorationBarTouch = target.classList.contains('drawer-decoration-bar-line') ||
    target.closest('.drawer-decoration-bar-line') !== null ||
    target.classList.contains('drawer-decoration-bar') ||
    target.closest('.drawer-decoration-bar') !== null

  if (!touchState.isDecorationBarTouch && !isContentScrolledToTop()) {
    return
  }

  touchState.touching = true
  touchState.startY = touch.clientY
  touchState.lastY = touch.clientY
  touchState.originalState = currentState.value // 记录初始状态

  if (drawerRef.value) {
    drawerRef.value.style.transition = 'none'
  }
}

// 处理触摸移动
function handleTouchMove(e: TouchEvent) {
  if (!touchState.touching || !drawerRef.value || currentState.value === DrawerState.HIDE) return

  if (!touchState.isDecorationBarTouch && !isContentScrolledToTop()) {
    touchState.touching = false
    return
  }

  const touch = e.touches[0]
  const deltaY = touch.clientY - touchState.lastY
  touchState.lastY = touch.clientY

  // 计算总位移
  const totalDeltaY = touch.clientY - touchState.startY

  // 更新滑动方向
  if (deltaY > 0) {
    lastSlideDirection.value = 'down'
  } else if (deltaY < 0) {
    lastSlideDirection.value = 'up'
  }

  // 确保值在有效范围内
  const fullscreenPos = options.positions[DrawerState.FULLSCREEN] || topReservedSpace
  const visiblePos = options.positions[DrawerState.VISIBLE] || (window.innerHeight * 0.97)

  // 对下拉多做一些阻力，特别是可见状态下
  const elasticityFactor = deltaY > 0 && currentState.value === DrawerState.VISIBLE ? 
    options.elasticity * 0.5 : options.elasticity

  const newTranslateY = Math.max(
    fullscreenPos,
    Math.min(
      visiblePos,
      touchState.currentTranslateY + deltaY * elasticityFactor
    )
  )

  touchState.currentTranslateY = newTranslateY
  drawerRef.value.style.transform = `translateY(${newTranslateY}px)`

  // 根据位移决定状态，但增加全屏模式的阈值，防止误触
  if (Math.abs(totalDeltaY) > options.threshold) {
    if (totalDeltaY > 0) { // 向下拖动
      // 全屏模式需要更大的滑动距离才会切换
      if (currentState.value === DrawerState.FULLSCREEN) {
        // 从全屏滑动到展开需要更大的阈值
        if (totalDeltaY > options.threshold * 1.5) {
          currentState.value = DrawerState.EXPAND
          touchState.originalState = DrawerState.EXPAND // 更新原始状态
        }
      } else if (currentState.value === DrawerState.EXPAND) {
        currentState.value = DrawerState.SHRINK
        touchState.originalState = DrawerState.SHRINK // 更新原始状态
      } else if (currentState.value === DrawerState.SHRINK) {
        currentState.value = DrawerState.VISIBLE
        touchState.originalState = DrawerState.VISIBLE // 更新原始状态
      }
      // 注意：不允许从VISIBLE状态隐藏抽屉
    } else { // 向上拖动
      if (currentState.value === DrawerState.VISIBLE) {
        currentState.value = DrawerState.SHRINK
        touchState.originalState = DrawerState.SHRINK // 更新原始状态
      } else if (currentState.value === DrawerState.SHRINK) {
        currentState.value = DrawerState.EXPAND
        touchState.originalState = DrawerState.EXPAND // 更新原始状态
      } else if (currentState.value === DrawerState.EXPAND) {
        currentState.value = DrawerState.FULLSCREEN
        touchState.originalState = DrawerState.FULLSCREEN // 更新原始状态
      } else if (currentState.value === DrawerState.FULLSCREEN) {
        // 全屏模式下向上滑动应该保持全屏状态
        currentState.value = DrawerState.FULLSCREEN
        touchState.originalState = DrawerState.FULLSCREEN // 维持原始状态
      }
    }
  }
}

// 处理触摸结束
function handleTouchEnd() {
  if (!touchState.touching || !drawerRef.value) return

  touchState.touching = false
  touchState.isDecorationBarTouch = false

  // 更快速的动画结束
  drawerRef.value.style.transition = `transform ${transitionDuration} ${qCubicBezier}`
  const finalPosition = getPositionForState(currentState.value)
  touchState.currentTranslateY = finalPosition
  drawerRef.value.style.transform = `translateY(${finalPosition}px)`
}

// 监听状态变化，更新位置
watch(currentState, (newState) => {
  if (!drawerRef.value) return

  // 隐藏状态特殊处理已在hide方法中实现
  if (newState !== DrawerState.HIDE) {
    drawerRef.value.style.transition = `transform ${transitionDuration} ${qCubicBezier}`
    const finalPosition = getPositionForState(newState)
    touchState.currentTranslateY = finalPosition
    drawerRef.value.style.transform = `translateY(${finalPosition}px)`
  }
})

// 处理drawer点击事件
function handleDrawerClick(e: MouseEvent) {
  // 当处于visible状态时，点击drawer区域直接切换到shrink状态
  if (currentState.value === DrawerState.VISIBLE) {
    // 阻止事件冒泡，防止触发其他点击事件
    e.stopPropagation()
    useVibrate('medium');
    currentState.value = DrawerState.SHRINK
  }
}

// 添加装饰条点击处理函数
function handleDecorationBarClick(e: MouseEvent) {
  if (e.target && (e.target as HTMLElement).classList.contains('drawer-decoration-bar-line')) {
    useVibrate('medium');

    // 添加视觉反馈
    const decorBar = e.target as HTMLElement
    decorBar.classList.add('clicked')
    setTimeout(() => {
      decorBar.classList.remove('clicked')
    }, 150) // 更新为与新的transitionDuration匹配

    // 根据最后滑动方向和当前状态切换到相应的状态
    if (lastSlideDirection.value === 'up') {
      // 向上滑动模式，点击小横条向上切换一级
      if (currentState.value === DrawerState.VISIBLE) {
        currentState.value = DrawerState.SHRINK
      } else if (currentState.value === DrawerState.SHRINK) {
        currentState.value = DrawerState.EXPAND
      } else if (currentState.value === DrawerState.EXPAND) {
        currentState.value = DrawerState.FULLSCREEN
      } else if (currentState.value === DrawerState.FULLSCREEN) {
        // 全屏模式下保持全屏
        currentState.value = DrawerState.FULLSCREEN
      }
    } else if (lastSlideDirection.value === 'down') {
      // 向下滑动模式，点击小横条向下切换一级
      if (currentState.value === DrawerState.FULLSCREEN) {
        currentState.value = DrawerState.EXPAND
      } else if (currentState.value === DrawerState.EXPAND) {
        currentState.value = DrawerState.SHRINK
      } else if (currentState.value === DrawerState.SHRINK) {
        currentState.value = DrawerState.VISIBLE
      } else if (currentState.value === DrawerState.VISIBLE) {
        // 可见状态保持可见
        currentState.value = DrawerState.VISIBLE
      }
    } else {
      // 默认行为（无滑动方向记录）
      if (currentState.value === DrawerState.VISIBLE) {
        currentState.value = DrawerState.SHRINK
      } else if (currentState.value === DrawerState.SHRINK) {
        currentState.value = DrawerState.EXPAND
      } else if (currentState.value === DrawerState.EXPAND) {
        currentState.value = DrawerState.SHRINK
      } else if (currentState.value === DrawerState.FULLSCREEN) {
        currentState.value = DrawerState.EXPAND
      }
    }
  }
}

onMounted(() => {
  if (!drawerRef.value) return

  // 初始化位置
  touchState.currentTranslateY = getPositionForState(currentState.value)
  drawerRef.value.style.transform = `translateY(${touchState.currentTranslateY}px)`

  // 添加触摸事件监听
  drawerRef.value.addEventListener('touchstart', handleTouchStart)
  drawerRef.value.addEventListener('touchmove', handleTouchMove)
  drawerRef.value.addEventListener('touchend', handleTouchEnd)

  // 添加点击事件监听
  drawerRef.value.addEventListener('click', handleDrawerClick)

  // 为装饰条添加点击监听
  if (decorationBarRef.value) {
    decorationBarRef.value.addEventListener('click', handleDecorationBarClick)
  }

  // 防止点击按钮时触发拖动
  const buttons = drawerRef.value.querySelectorAll('.drawer-button')
  buttons.forEach(btn => {
    btn.addEventListener('touchstart', (e) => {
      e.stopPropagation()
    })

    // 防止按钮点击触发drawer的点击事件
    btn.addEventListener('click', (e) => {
      e.stopPropagation()
    })
  })

  // 添加文档点击事件监听，用于关闭状态菜单
  document.addEventListener('click', handleDocumentClick)
})

onUnmounted(() => {
  if (drawerRef.value) {
    drawerRef.value.removeEventListener('touchstart', handleTouchStart)
    drawerRef.value.removeEventListener('touchmove', handleTouchMove)
    drawerRef.value.removeEventListener('touchend', handleTouchEnd)
    drawerRef.value.removeEventListener('click', handleDrawerClick)

    // 移除按钮的事件监听
    const buttons = drawerRef.value.querySelectorAll('.drawer-button')
    buttons.forEach(btn => {
      btn.removeEventListener('touchstart', (e) => {
        e.stopPropagation()
      })
      btn.removeEventListener('click', (e) => {
        e.stopPropagation()
      })
    })
  }

  // 移除文档点击事件监听
  document.removeEventListener('click', handleDocumentClick)

  // 清除定时器
  if (longPressTimer.value) {
    clearTimeout(longPressTimer.value)
    longPressTimer.value = null
  }

  // 移除装饰条点击监听
  if (decorationBarRef.value) {
    decorationBarRef.value.removeEventListener('click', handleDecorationBarClick)
  }
})

// 处理主区域点击事件
function handleMainAreaClick(e: MouseEvent) {
  // 当处于展开或全屏模式时，点击非drawer区域收缩到visible状态
  if (currentState.value === DrawerState.EXPAND || currentState.value === DrawerState.FULLSCREEN) {
    // 阻止事件冒泡
    e.stopPropagation();
    useVibrate('light');
    
    // 设置向下滑动方向，保持箭头逻辑一致
    lastSlideDirection.value = 'down';
    
    // 直接收缩到可见状态
    currentState.value = DrawerState.VISIBLE;
  }
}
</script>

<template>
  <RoutePage class="DrawerPage">
    <div class="DrawerPage-Main" @click="handleMainAreaClick">
      <slot name="main" />
      <button class="close-button" @click.stop="$emit('close')">关闭</button>
    </div>
    <div ref="drawerRef" class="DrawerPage-Drawer" :class="{
      expanded: isExpanded,
      hidden: isHidden,
      fullscreen: currentState === DrawerStateEnum.FULLSCREEN,
      shrink: currentState === DrawerStateEnum.SHRINK,
      visible: currentState === DrawerStateEnum.VISIBLE
    }">
      <div ref="drawerContentRef" class="DrawerPage-Drawer-Content transition-cubic fake-background">
        <div ref="decorationBarRef" class="drawer-decoration-bar">
          <!-- 使用抽离后的 DrawerStateButton 组件，传递滑动方向 -->
          <DrawerStateButton 
            :state="currentState" 
            :onClick="drawerControl.toggleDrawer"
            :lastSlideDirection="lastSlideDirection"
            @longPressStart="handleLongPressStart" 
            @longPressEnd="handleLongPressEnd">

            <!-- 状态菜单 -->
            <div v-if="stateMenuVisible" ref="stateMenuRef" class="drawer-state-menu">
              <button @click.stop="handleStateMenuSelect(DrawerStateEnum.FULLSCREEN)" class="menu-item">
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none"
                  stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                </svg>
                <span>全屏模式</span>
              </button>
              <button @click.stop="handleStateMenuSelect(DrawerStateEnum.EXPAND)" class="menu-item">
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none"
                  stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <polyline points="18 15 12 9 6 15"></polyline>
                </svg>
                <span>展开</span>
              </button>
              <button @click.stop="handleStateMenuSelect(DrawerStateEnum.SHRINK)" class="menu-item">
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none"
                  stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <polyline points="6 9 12 15 18 9"></polyline>
                </svg>
                <span>收缩</span>
              </button>
              <button @click.stop="handleStateMenuSelect(DrawerStateEnum.VISIBLE)" class="menu-item">
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none"
                  stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <line x1="5" y1="12" x2="19" y2="12"></line>
                </svg>
                <span>仅显示条</span>
              </button>
              <button @click.stop="drawerControl.hide()" class="menu-item">
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none"
                  stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <line x1="18" y1="6" x2="6" y2="18"></line>
                  <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
                <span>隐藏</span>
              </button>
            </div>
          </DrawerStateButton>

          <!-- 装饰条中间部分 -->
          <div class="drawer-decoration-bar-line" :class="{ 'is-visible': currentState === DrawerStateEnum.VISIBLE }"
            @click.stop="handleDecorationBarClick"></div>

          <!-- 右侧隐藏按钮 -->
          <button class="drawer-button drawer-hide-button" @click.stop="drawerControl.collapse()">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none"
              stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        </div>
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

    // 不同状态下的样式
    &.expanded {
      .DrawerPage-Drawer-Content {
        border-radius: 12px 12px 0 0; // 当展开时，修改上方圆角，保持美观
      }
    }

    &.fullscreen {
      .DrawerPage-Drawer-Content {
        border-radius: 0; // 全屏模式下无圆角
        
        // 全屏模式下特殊样式，确保完全覆盖屏幕
        padding-top: 38px; // 减少顶部空间，更接近全屏
        
        // 全屏模式下调整装饰栏
        .drawer-decoration-bar {
          top: 8px; // 减少顶部间距
        }
      }
    }

    &.hidden {
      visibility: visible; // 确保动画期间可见
      pointer-events: none;
    }

    &-Content {
      position: relative;

      .drawer-decoration-bar {
        position: absolute;
        top: 12px;
        left: 0;
        width: 100%;
        height: 32px;
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 0 16px;
        z-index: 10;

        .drawer-decoration-bar-line {
          width: 80px;
          height: 6px;
          background: var(--el-text-color-regular);
          border-radius: 4px;
          cursor: grab;
          transition: all 0.2s cubic-bezier(0.25, 1.0, 0.5, 1.4);
          position: relative;

          // visible状态下的样式特殊处理
          &.is-visible {
            background: rgba(255, 255, 255, 0.5);

            &::after {
              content: '';
              position: absolute;
              top: -10px;
              left: 50%;
              transform: translateX(-50%);
              width: 0;
              height: 0;
              border-left: 6px solid transparent;
              border-right: 6px solid transparent;
              border-bottom: 6px solid rgba(255, 255, 255, 0.7);
              animation: bounce 1.5s ease infinite;
            }

            @keyframes bounce {

              0%,
              100% {
                transform: translateX(-50%) translateY(0);
              }

              50% {
                transform: translateX(-50%) translateY(-5px);
              }
            }
          }

          &:active {
            cursor: grabbing;
            transform: scale(1.15);
            background: rgba(255, 255, 255, 0.8);
          }

          &:hover {
            background: rgba(255, 255, 255, 0.6);
            transform: scale(1.05);
          }

          &.clicked {
            background: var(--el-color-primary, #409eff);
            transform: scale(1.15);
            box-shadow: 0 0 10px var(--el-color-primary, #409eff);
          }
        }

        .drawer-button {
          width: 32px;
          height: 32px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          background: rgba(255, 255, 255, 0.15);
          border: 1px solid rgba(255, 255, 255, 0.25);
          color: rgba(255, 255, 255, 0.9);
          cursor: pointer;
          transition: all 0.2s cubic-bezier(0.25, 1.0, 0.5, 1.4);
          position: relative;

          &:hover {
            background: rgba(255, 255, 255, 0.25);
            transform: scale(1.05);
          }

          &:active {
            transform: scale(0.95);
          }

          svg {
            width: 16px;
            height: 16px;
            transition: transform 0.2s cubic-bezier(0.25, 1.0, 0.5, 1.4);
          }

          &:active svg {
            transform: scale(0.9);
          }

          .drawer-state-menu {
            position: absolute;
            top: 40px;
            left: 0;
            background: rgba(30, 30, 30, 0.95);
            backdrop-filter: blur(10px);
            border-radius: 8px;
            box-shadow: 0 5px 15px rgba(0, 0, 0, 0.3);
            display: flex;
            flex-direction: column;
            overflow: hidden;
            z-index: 100;
            animation: menuAppear 0.2s cubic-bezier(0.25, 1.0, 0.5, 1.4);
            transform-origin: top left;

            @keyframes menuAppear {
              from {
                opacity: 0;
                transform: scale(0.8);
              }

              to {
                opacity: 1;
                transform: scale(1);
              }
            }

            .menu-item {
              display: flex;
              align-items: center;
              padding: 10px 12px;
              color: rgba(255, 255, 255, 0.9);
              border: none;
              background: none;
              cursor: pointer;
              transition: all 0.2s ease;
              border-bottom: 1px solid rgba(255, 255, 255, 0.1);
              white-space: nowrap;

              &:last-child {
                border-bottom: none;
              }

              &:hover {
                background: rgba(255, 255, 255, 0.1);
              }

              &:active {
                transform: scale(0.97);
              }

              svg {
                margin-right: 8px;
              }

              span {
                font-size: 14px;
              }
            }
          }
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

      padding-top: 48px; // 增加顶部空间，容纳按钮
      overflow: hidden;
      --fake-opacity: 0.75;
      backdrop-filter: blur(18px) saturate(180%);
      border-radius: 28px 28px 0 0;
      height: 100%;
      touch-action: none;

      &Inner {
        height: 100%;
        overflow-y: auto;
        overscroll-behavior: contain;
        -webkit-overflow-scrolling: touch;
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