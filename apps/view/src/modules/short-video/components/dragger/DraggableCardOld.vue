<script setup lang="ts">
import { ref, reactive, computed, onMounted } from 'vue'

// 定义事件
const emit = defineEmits(['refresh'])

// 定义加载更多函数类型
type LoadMoreFn = () => Promise<any[]>

// 定义组件属性
const props = defineProps({
  // 加载更多回调函数，返回新的数据项
  onLoadMore: {
    type: Function,
    required: true
  },
  // 是否启用循环滚动
  enableLoop: {
    type: Boolean,
    default: true
  }
})

// 滑动容器引用
const containerRef = ref<HTMLElement | null>(null)

// 状态
const state = reactive({
  // 内部管理的数据列表
  items: [] as any[],
  // 当前显示项目的索引
  currentIndex: 0,
  // 渲染窗口的起始索引
  startPointer: 0,
  // 渲染窗口的结束索引
  endPointer: 3,  // 默认显示4个项目
  // 触摸相关状态
  startY: 0,
  currentY: 0,
  lastY: 0,
  lastMoveTime: 0,
  moveSpeed: 0,      // 当前滑动速度
  isDragging: false,
  // 容器高度
  containerHeight: 0,
  // 刷新相关状态
  isRefreshing: false,
  refreshProgress: 0,
  // 加载更多状态
  isLoadingMore: false,
  // 滑动阻尼系数
  dampingFactor: 0.8,
  // 动画帧ID
  animationFrameId: 0,
  // 连续触摸点数组，用于计算加速度
  touchPoints: [] as {time: number, y: number}[]
})

// 刷新阈值常量
const REFRESH_THRESHOLD = 100
// 滑动切换阈值 - 降低切换所需距离
const SWIPE_THRESHOLD = 30
// 滑动速度阈值（像素/毫秒）- 超过这个速度就触发快速滑动
const VELOCITY_THRESHOLD = 0.5

// 安全调用加载更多函数
const safeLoadMore = async () => {
  try {
    return await (props.onLoadMore as LoadMoreFn)()
  } catch (error) {
    console.error('加载数据失败:', error)
    return []
  }
}

// 检查是否需要加载更多
const checkNeedLoadMore = async () => {
  // 如果正在加载或者没有项目，则跳过
  if (state.isLoadingMore || state.items.length === 0) return

  // 如果当前索引已经接近末尾，触发加载更多
  if (state.currentIndex >= state.items.length - 2) {
    state.isLoadingMore = true
    try {
      const newItems = await safeLoadMore()
      if (newItems && newItems.length > 0) {
        state.items = [...state.items, ...newItems]
      }
    } finally {
      state.isLoadingMore = false
    }
  }
}

// 更新渲染窗口
const updateRenderWindow = () => {
  // 确保当前索引有效
  if (state.currentIndex < 0 && props.enableLoop && state.items.length > 0) {
    // 无限循环：从最后一项开始
    state.currentIndex = state.items.length - 1
  } else if (state.currentIndex < 0) {
    state.currentIndex = 0
  }
  
  if (state.currentIndex >= state.items.length && props.enableLoop && state.items.length > 0) {
    // 无限循环：从第一项开始
    state.currentIndex = 0
  } else if (state.currentIndex >= state.items.length && state.items.length > 0) {
    state.currentIndex = state.items.length - 1
  }

  // 计算渲染窗口的起始和结束位置
  // 为了保证前后各有一个缓冲项，我们将窗口前移一位，后移两位
  state.startPointer = Math.max(0, state.currentIndex - 1)
  state.endPointer = Math.min(state.items.length - 1, state.startPointer + 3)

  // 调整开始指针，确保能够显示4个项目（如果有足够的项目）
  if (state.endPointer - state.startPointer < 3 && state.startPointer > 0) {
    state.startPointer = Math.max(0, state.endPointer - 3)
  }
}

// 计算项目样式
const getItemStyle = (index: number) => {
  const virtualIndex = state.startPointer + index
  const offset = virtualIndex - state.currentIndex
  const translateY = offset * state.containerHeight

  // 使用缩放和透明度效果增强视觉体验
  const scale = 1 - Math.min(0.1, Math.abs(offset) * 0.05)
  const opacity = 1 - Math.min(0.3, Math.abs(offset) * 0.15)

  return {
    transform: `translate3d(0, ${translateY}px, 0) scale(${scale})`,
    opacity: opacity,
    // 减少过渡时间以提高响应速度，改用cubic-bezier曲线使动画更加自然
    transition: state.isDragging ? 'none' : 'all 0.2s cubic-bezier(0.33, 1, 0.68, 1)',
    position: 'absolute' as const,
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    willChange: 'transform, opacity',
    zIndex: 10 - Math.abs(offset)
  }
}

// 获取刷新器样式
const getRefreshStyle = computed(() => {
  return {
    height: `${state.refreshProgress}px`,
    opacity: state.refreshProgress / REFRESH_THRESHOLD
  }
})

// 触摸开始
const handleTouchStart = (e: TouchEvent) => {
  state.isDragging = true
  state.startY = e.touches[0].clientY
  state.currentY = e.touches[0].clientY
  state.lastY = e.touches[0].clientY
  state.lastMoveTime = Date.now()
  state.moveSpeed = 0
  // 重置触摸点数组
  state.touchPoints = [{time: Date.now(), y: e.touches[0].clientY}]
}

// 触摸移动
const handleTouchMove = (e: TouchEvent) => {
  if (!state.isDragging) return
  if (e.touches.length > 1 || e.touches.length === 0) return

  // 取消之前的动画帧
  if (state.animationFrameId) {
    cancelAnimationFrame(state.animationFrameId)
  }

  const currentTime = Date.now()
  state.currentY = e.touches[0].clientY
  
  // 记录触摸点，用于计算滑动速度
  state.touchPoints.push({time: currentTime, y: state.currentY})
  // 只保留最近10个点，用于计算平均速度
  if (state.touchPoints.length > 10) {
    state.touchPoints.shift()
  }
  
  // 计算滑动速度（像素/毫秒）
  const timeDiff = currentTime - state.lastMoveTime
  if (timeDiff > 0) {
    state.moveSpeed = (state.currentY - state.lastY) / timeDiff
  }
  
  state.lastY = state.currentY
  state.lastMoveTime = currentTime

  const deltaY = state.currentY - state.startY

  // 处理下拉刷新 - 仅在非循环模式且在第一项时才启用
  if (!props.enableLoop && state.currentIndex === 0 && deltaY > 0) {
    e.preventDefault()
    state.refreshProgress = Math.min(REFRESH_THRESHOLD * 1.5, deltaY * 0.5)
    return
  }

  // 防止默认行为，确保滑动更加流畅
  e.preventDefault()

  // 使用requestAnimationFrame优化动画性能
  state.animationFrameId = requestAnimationFrame(() => {
    // 处理滑动中的动画效果
    // 应用阻尼效果使滑动更加自然
    const dampedDeltaY = deltaY * state.dampingFactor
    const moveRatio = dampedDeltaY / state.containerHeight

    // 移除限制条件，允许更大范围的滑动响应
    const elements = document.querySelectorAll('.vertical-slide-item')
    elements.forEach((el) => {
      const element = el as HTMLElement
      const virtualIndexStr = element.getAttribute('data-virtual-index')
      if (!virtualIndexStr) return

      const virtualIndex = parseInt(virtualIndexStr, 10)
      const offset = virtualIndex - state.currentIndex
      
      // 注意：这里修改使滑动方向与卡片移动方向保持顺势一致
      // 向上滑动(负deltaY)应该显示下一个卡片(正方向移动)
      // 向下滑动(正deltaY)应该显示上一个卡片(负方向移动)
      const newOffset = offset - moveRatio

      // 更新卡片的缩放和透明度
      const scale = 1 - Math.min(0.1, Math.abs(newOffset) * 0.05)
      const opacity = 1 - Math.min(0.3, Math.abs(newOffset) * 0.15)

      element.style.transform = `translate3d(0, ${newOffset * state.containerHeight}px, 0) scale(${scale})`
      element.style.opacity = opacity.toString()
      element.style.transition = 'none'
    })
  })
}

// 计算最终滑动速度
const calculateFinalVelocity = () => {
  if (state.touchPoints.length < 2) return 0
  
  // 计算最近几个点的平均速度，更能反映释放时的实际速度
  const recentPoints = state.touchPoints.slice(-5)
  if (recentPoints.length < 2) return 0
  
  const first = recentPoints[0]
  const last = recentPoints[recentPoints.length - 1]
  const timeDiff = last.time - first.time
  
  if (timeDiff <= 0) return 0
  
  // 返回像素/毫秒的速度
  return (last.y - first.y) / timeDiff
}

// 触摸结束
const handleTouchEnd = async () => {
  if (!state.isDragging) return
  state.isDragging = false

  // 取消可能正在执行的动画帧
  if (state.animationFrameId) {
    cancelAnimationFrame(state.animationFrameId)
    state.animationFrameId = 0
  }

  const deltaY = state.currentY - state.startY
  
  // 计算最终释放时的速度
  const finalVelocity = calculateFinalVelocity()
  const absVelocity = Math.abs(finalVelocity)
  
  console.log('滑动结束', { 
    deltaY, 
    finalVelocity, 
    absVelocity,
    velocityThreshold: VELOCITY_THRESHOLD
  })

  // 判断是否触发下拉刷新 (仅在非循环模式且在第一项时才启用)
  if (!props.enableLoop && state.currentIndex === 0 && deltaY > 0 && state.refreshProgress > REFRESH_THRESHOLD) {
    state.isRefreshing = true
    emit('refresh')

    try {
      const initialItems = await safeLoadMore()
      if (initialItems && initialItems.length > 0) {
        state.items = [...initialItems]
        state.currentIndex = 0
        updateRenderWindow()
      }
    } finally {
      // 自动结束刷新状态
      setTimeout(() => {
        state.isRefreshing = false
        state.refreshProgress = 0
      }, 800) // 缩短刷新动画时间
    }
    return
  }

  // 重置卡片样式
  const elements = document.querySelectorAll('.vertical-slide-item')
  elements.forEach((el) => {
    (el as HTMLElement).style.transition = 'all 0.2s cubic-bezier(0.33, 1, 0.68, 1)'
  })

  // 两种情况触发切换：
  // 1. 滑动距离超过阈值
  // 2. 滑动速度超过速度阈值
  const shouldSwipeByDistance = Math.abs(deltaY) > SWIPE_THRESHOLD
  const shouldSwipeByVelocity = absVelocity > VELOCITY_THRESHOLD
  
  if (shouldSwipeByDistance || shouldSwipeByVelocity) {
    // 根据速度和滑动距离确定滚动的数量
    let scrollAmount = 1 // 默认至少滚动1个
    
    // 如果是通过速度触发的，根据速度计算滚动数量
    if (shouldSwipeByVelocity) {
      // 速度越快，滚动的卡片数量越多
      scrollAmount = Math.min(3, Math.ceil(absVelocity / VELOCITY_THRESHOLD))
    } else {
      // 通过距离触发的，根据距离计算
      scrollAmount = Math.ceil(Math.abs(deltaY) / (SWIPE_THRESHOLD * 2))
    }
    
    console.log('卡片切换', {
      触发方式: shouldSwipeByVelocity ? '速度触发' : '距离触发',
      滚动数量: scrollAmount,
      方向: finalVelocity > 0 ? '向下' : '向上'
    })

    // 判断滑动方向 - 注意这里我们需要改变方向逻辑，使其更符合直觉
    // 向上滑动(负finalVelocity)应该显示下一个卡片(索引增加)
    // 向下滑动(正finalVelocity)应该显示上一个卡片(索引减少)
    const direction = finalVelocity > 0 ? 'down' : 'up'
    
    if (direction === 'up' && (state.currentIndex < state.items.length - 1 || props.enableLoop)) {
      // 向上滑动，展示下一个卡片（索引增加）
      state.currentIndex += scrollAmount
      // 检查是否需要加载更多
      await checkNeedLoadMore()
    } else if (direction === 'down' && (state.currentIndex > 0 || props.enableLoop)) {
      // 向下滑动，展示上一个卡片（索引减少）
      state.currentIndex -= scrollAmount
    }

    // 更新渲染窗口 - 此处会处理无限循环逻辑
    updateRenderWindow()
  } else {
    // 如果滑动距离和速度都不够，回弹到当前项
    console.log('回弹到当前项', { 
      deltaY, 
      velocity: finalVelocity,
      distanceThreshold: SWIPE_THRESHOLD,
      velocityThreshold: VELOCITY_THRESHOLD
    })
    updateRenderWindow()
  }

  // 重置刷新进度
  state.refreshProgress = 0
}

// 监听窗口大小变化
const handleResize = () => {
  if (containerRef.value) {
    state.containerHeight = containerRef.value.clientHeight
    // 更新渲染窗口以确保正确的位置
    updateRenderWindow()
  }
}

// 计算需要渲染的项目
const renderItems = computed(() => {
  const result = []
  for (let i = state.startPointer; i <= state.endPointer; i++) {
    if (i >= 0 && i < state.items.length) {
      result.push({
        item: state.items[i],
        index: i
      })
    }
  }
  return result
})

// 初始化
onMounted(async () => {
  if (containerRef.value) {
    state.containerHeight = containerRef.value.clientHeight

    // 监听容器大小变化
    const resizeObserver = new ResizeObserver(() => {
      handleResize()
    })

    resizeObserver.observe(containerRef.value)
    window.addEventListener('resize', handleResize)

    // 初始加载数据
    try {
      const initialItems = await safeLoadMore()
      if (initialItems && initialItems.length > 0) {
        state.items = [...initialItems]
        updateRenderWindow()
      } else {
        console.error('初始数据加载失败')
      }
    } catch (error) {
      console.error('初始数据加载失败:', error)
    }
  }
})

// 暴露方法
defineExpose({
  scrollToNext: async () => {
    state.currentIndex++
    updateRenderWindow()
    await checkNeedLoadMore()
  },
  scrollToPrev: () => {
    state.currentIndex--
    updateRenderWindow()
  },
  scrollToIndex: (index: number) => {
    if (index >= 0 && index < state.items.length) {
      state.currentIndex = index
      updateRenderWindow()
    }
  },
  finishRefresh: () => {
    state.isRefreshing = false
    state.refreshProgress = 0
  }
})
</script>

<template>
  <div ref="containerRef" class="vertical-slide-container" @touchstart="handleTouchStart" @touchmove="handleTouchMove"
    @touchend="handleTouchEnd">
    <!-- 下拉刷新区域 -->
    <div class="refresh-indicator" :style="getRefreshStyle">
      <div class="refresh-default-indicator">
        <div v-if="state.isRefreshing" class="refresh-spinner"></div>
        <div v-else class="refresh-arrow" :style="{
          transform: `rotate(${Math.min(180, state.refreshProgress / REFRESH_THRESHOLD * 180)}deg)`
        }"></div>
        <div class="refresh-text">
          {{ state.isRefreshing ? '刷新中...' : '下拉刷新' }}
        </div>
      </div>
    </div>

    <!-- 滑动列表 -->
    <div class="vertical-slide-list">
      <template v-if="state.items.length >= 1">
        <div v-for="itemInfo in renderItems" :key="itemInfo.index" class="vertical-slide-item"
          :style="getItemStyle(itemInfo.index - state.startPointer)" :data-virtual-index="itemInfo.index">
          <slot :item="itemInfo.item" :index="itemInfo.index">
            <div class="default-slide-item">
              {{ itemInfo.item }}
            </div>
          </slot>
        </div>
      </template>
      <div v-else class="empty-state">
        <div class="loading-spinner"></div>
        <div class="empty-text">加载中...</div>
      </div>
    </div>

    <!-- 加载更多指示器 -->
    <div v-if="state.isLoadingMore" class="loading-indicator">
      <div class="loading-spinner"></div>
    </div>
  </div>
</template>

<style scoped>
.vertical-slide-container {
  position: relative;
  width: 100%;
  height: 100%;
  overflow: hidden;
  touch-action: none;
  user-select: none;
  background-color: #000;
}

.vertical-slide-list {
  position: relative;
  width: 100%;
  height: 100%;
}

.vertical-slide-item {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  will-change: transform;
  overflow: hidden;
  backface-visibility: hidden;
}

.default-slide-item {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
  font-size: 24px;
  background-color: #f5f5f5;
  border-radius: 0;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
  color: #fff;
}

.empty-text {
  margin-top: 12px;
  font-size: 14px;
}

.refresh-indicator {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  z-index: 100;
  background-color: rgba(0, 0, 0, 0.3);
}

.refresh-default-indicator {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.refresh-spinner {
  width: 24px;
  height: 24px;
  border: 2px solid #ccc;
  border-top-color: #fff;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}

.refresh-arrow {
  width: 0;
  height: 0;
  border-left: 6px solid transparent;
  border-right: 6px solid transparent;
  border-bottom: 12px solid #fff;
  transition: transform 0.2s ease;
}

.refresh-text {
  margin-top: 8px;
  font-size: 12px;
  color: #fff;
}

.loading-indicator {
  position: absolute;
  bottom: 20px;
  left: 50%;
  transform: translateX(-50%);
  z-index: 100;
}

.loading-spinner {
  width: 20px;
  height: 20px;
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-top-color: white;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}
</style>