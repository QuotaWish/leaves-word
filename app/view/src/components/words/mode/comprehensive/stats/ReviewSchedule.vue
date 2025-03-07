<template>
  <div class="w-full rounded-xl bg-purple-100/30 dark:bg-purple-900/20 p-4">
    <h4 class="text-sm text-gray-600 dark:text-gray-300 font-medium mb-4">推荐复习计划</h4>
    <div class="relative w-full">
      <!-- 使用容器限制最大宽度并居中 -->
      <div
        class="flex overflow-x-auto py-10 px-2 gap-2 md:gap-3 scrollbar-thin scroll-smooth max-w-full relative timeline-container"
        ref="timelineRef" @scroll="handleScroll">

        <div v-for="(review, index) in reviewSchedule" :key="`dot-${index}`"
          class="flex-shrink-0 flex flex-col items-center w-[16%] min-w-16 max-w-20 relative dot-container" :class="{
            'review-active': review.isActive,
            'line-completed': index < activeIndex,
            'line-active': index === activeIndex,
            'line-future': index > activeIndex,
            'last-item': index === reviewSchedule.length - 1
          }">
          <!-- 点 -->
          <div
            class="w-4 h-4 rounded-full bg-gray-200 dark:bg-gray-600 mb-4 relative z-2 transition-all duration-500 timeline-dot"
            :class="{
              'bg-gradient-to-br from-purple-400 to-purple-600 shadow-purple-500/30 shadow-[0_0_0_5px] scale-110': review.isActive,
              'pulse-effect bg-gradient-to-br from-purple-300/70 to-purple-400/80': review.isNext,
              'completed bg-gradient-to-br from-green-300 to-green-500': index < activeIndex,
              'dark:from-purple-300 dark:to-purple-500 dark:shadow-purple-400/30': review.isActive && isDarkMode,
              'dark:from-purple-200/70 dark:to-purple-300/80': review.isNext && isDarkMode,
              'dark:from-green-200 dark:to-green-400': index < activeIndex && isDarkMode
            }">
            <!-- 中心点闪光效果 -->
            <div v-if="review.isActive || review.isNext"
              class="absolute inset-0 rounded-full bg-white opacity-0 center-glow"></div>
          </div>
          <!-- 文本信息 -->
          <div class="text-center w-full">
            <div class="font-medium mb-1 text-xs text-gray-700 dark:text-gray-300 truncate" :class="{
              'text-purple-600 dark:text-purple-300 font-semibold': review.isActive,
              'text-purple-400 dark:text-purple-300/80': review.isNext,
              'text-green-600 dark:text-green-400': index < activeIndex
            }">
              {{ review.day }}
            </div>
            <div class="text-xs text-gray-500 dark:text-gray-400 mb-0.5 truncate" :class="{
              'text-purple-500 dark:text-purple-300': review.isActive,
              'text-purple-300 dark:text-purple-300/70': review.isNext,
              'text-green-500 dark:text-green-400': index < activeIndex
            }">
              {{ review.time }}
            </div>
            <div class="text-[11px] text-gray-400 dark:text-gray-500 truncate" :class="{
              'text-purple-400 dark:text-purple-300': review.isActive,
              'text-purple-300/80 dark:text-purple-300/60': review.isNext,
              'text-green-500/80 dark:text-green-400/80': index < activeIndex
            }">
              {{ review.status }}
            </div>
          </div>
        </div>
      </div>

      <!-- 添加指示器提示用户可以左右滑动 -->
      <div v-if="showScrollHint"
        class="absolute bottom-0 right-2.5 text-xs text-gray-400 dark:text-gray-500 flex items-center gap-1 scroll-hint-animation">
        <i class="el-icon-arrow-right"></i>
        <span>左右滑动查看更多</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted, watch } from 'vue'

const timelineRef = ref<HTMLElement | null>(null)
const scrollOffset = ref(0)
const visibleItemsCount = ref(6) // 默认可见点数

// 是否显示滚动提示
const showScrollHint = ref(false)

// 检查是否为暗黑模式
const isDarkMode = computed(() => {
  return document.documentElement.getAttribute('data-theme') === 'dark'
})

const reviewSchedule = ref([
  { day: '今天', time: '已完成', status: '已完成', isActive: false, isNext: false },
  { day: '明天', time: '19:30', status: '首次复习', isActive: true, isNext: false },
  { day: '3天后', time: '20:00', status: '第二次复习', isActive: false, isNext: true },
  { day: '7天后', time: '待定', status: '第三次复习', isActive: false, isNext: false },
  { day: '15天后', time: '待定', status: '第四次复习', isActive: false, isNext: false },
  { day: '30天后', time: '待定', status: '最终巩固', isActive: false, isNext: false }
])

// 处理滚动事件
const handleScroll = () => {
  if (timelineRef.value) {
    scrollOffset.value = timelineRef.value.scrollLeft
    calculateVisibleItems();
  }
}

// 计算当前可见的项目数
const calculateVisibleItems = () => {
  if (timelineRef.value) {
    const clientWidth = timelineRef.value.clientWidth;
    const scrollLeft = timelineRef.value.scrollLeft;
    const rightEdge = scrollLeft + clientWidth;

    // 计算当前可见的项目数
    let count = 0;
    const items = timelineRef.value.querySelectorAll('.dot-container');

    items.forEach((item, i) => {
      const rect = item.getBoundingClientRect();
      const containerRect = timelineRef.value!.getBoundingClientRect();

      if (rect.right > containerRect.left && rect.left < containerRect.right) {
        count++;
      }
    });

    visibleItemsCount.value = count;
  }
}

// 找出当前激活的复习项索引
const activeIndex = computed(() => {
  const index = reviewSchedule.value.findIndex(item => item.isActive)
  return index >= 0 ? index : 0
})

// 检查是否需要显示横向滚动提示
const checkScrollHint = () => {
  if (timelineRef.value) {
    showScrollHint.value = timelineRef.value.scrollWidth > timelineRef.value.clientWidth
    calculateVisibleItems();
  }
}

// 滚动到活动项
const scrollToActiveItem = () => {
  if (timelineRef.value && activeIndex.value > 0) {
    const items = timelineRef.value.querySelectorAll('.dot-container');
    if (items[activeIndex.value]) {
      const item = items[activeIndex.value] as HTMLElement;
      const containerWidth = timelineRef.value.clientWidth;
      const scrollPosition = item.offsetLeft - (containerWidth / 2) + (item.offsetWidth / 2);

      timelineRef.value.scrollTo({
        left: Math.max(0, scrollPosition),
        behavior: 'smooth'
      });
    }
  }
}

// 监听主题变化
const setupThemeWatcher = () => {
  const observer = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
      if (mutation.attributeName === 'data-theme') {
        // 触发更新
        reviewSchedule.value = [...reviewSchedule.value]
      }
    })
  })

  observer.observe(document.documentElement, { attributes: true })

  return () => observer.disconnect()
}

// 更新是否为"下一个"点
const updateNextStatus = () => {
  const active = activeIndex.value
  reviewSchedule.value.forEach((item, index) => {
    item.isNext = index === active + 1
  })
}

onMounted(() => {
  // 检查是否需要显示滚动提示
  checkScrollHint()
  window.addEventListener('resize', checkScrollHint)

  // 初始滚动到活动项
  setTimeout(() => {
    scrollToActiveItem();
    calculateVisibleItems();
  }, 300)

  // 更新"下一个"点的状态
  updateNextStatus()

  // 设置主题变化监听
  const cleanupThemeWatcher = setupThemeWatcher()

  onUnmounted(() => {
    window.removeEventListener('resize', checkScrollHint)
    cleanupThemeWatcher()
  })
})

// 当活动索引变化时，自动滚动到该位置
watch(activeIndex, () => {
  scrollToActiveItem()
  updateNextStatus()
  calculateVisibleItems()
})
</script>

<style scoped>
.timeline-container {
  --dot-size: 1rem;
  /* 16px */
}

/* 为每个点添加线条，使用:after伪元素 */
.dot-container:not(.last-item) .timeline-dot::after {
  content: "";
  position: absolute;
  top: 50%;
  left: calc(100% + 2px);
  height: 2px;
  width: calc(100% + 2rem);
  /* 增加线条长度 */
  transform: translateY(-50%);
  background-color: #e5e7eb;
  /* 默认灰色线条 */
  z-index: 1;
  transition: all 0.5s ease;
}

/* 暗色模式下的基础线条 */
:root[data-theme='dark'] .dot-container:not(.last-item) .timeline-dot::after {
  background-color: #374151;
  /* 暗色模式下更深的灰色 */
}

/* 已完成的线条 - 绿色渐变 */
.line-completed .timeline-dot::after {
  background: linear-gradient(to right, #10b981, #34d399);
  box-shadow: 0 0 8px 0 rgba(16, 185, 129, 0.4);
}

/* 当前激活的线条 - 紫色渐变 + 动画 */
.line-active .timeline-dot::after {
  background: linear-gradient(to right, #8b5cf6, #a78bfa);
  animation: active-line-animation 2s infinite ease-in-out;
  box-shadow: 0 0 12px 0 rgba(139, 92, 246, 0.6);
  width: calc(100% + 1.2rem);
  /* 给活动线条留出一点间隙 */
}

/* 暗色模式下的已完成线条 */
:root[data-theme='dark'] .line-completed .timeline-dot::after {
  background: linear-gradient(to right, #059669, #10b981);
  box-shadow: 0 0 8px 0 rgba(5, 150, 105, 0.5);
}

/* 暗色模式下的激活线条 */
:root[data-theme='dark'] .line-active .timeline-dot::after {
  background: linear-gradient(to right, #7c3aed, #8b5cf6);
  animation: dark-active-line-animation 2s infinite ease-in-out;
  box-shadow: 0 0 12px 0 rgba(124, 58, 237, 0.7);
  width: calc(100% + 1.2rem);
  /* 给活动线条留出一点间隙 */
}

.pulse-effect {
  animation: pulse-animation 2.5s infinite ease-in-out;
}

.completed {
  transition: all 0.5s ease;
}

.center-glow {
  animation: center-glow-animation 3s infinite ease-in-out;
}

@keyframes active-line-animation {
  0% {
    opacity: 0.6;
    box-shadow: 0 0 8px 0 rgba(139, 92, 246, 0.4);
  }

  50% {
    opacity: 1;
    box-shadow: 0 0 12px 0 rgba(139, 92, 246, 0.7);
  }

  100% {
    opacity: 0.6;
    box-shadow: 0 0 8px 0 rgba(139, 92, 246, 0.4);
  }
}

@keyframes center-glow-animation {

  0%,
  100% {
    opacity: 0;
  }

  50% {
    opacity: 0.5;
  }
}

@keyframes pulse-animation {
  0% {
    box-shadow: 0 0 0 0 rgba(126, 87, 194, 0.4);
    transform: scale(1);
  }

  50% {
    box-shadow: 0 0 0 8px rgba(126, 87, 194, 0);
    transform: scale(1.05);
  }

  100% {
    box-shadow: 0 0 0 0 rgba(126, 87, 194, 0);
    transform: scale(1);
  }
}

.scroll-hint-animation {
  animation: fade-pulse 2s infinite ease-in-out;
}

@keyframes fade-pulse {
  0% {
    opacity: 0.9;
  }

  50% {
    opacity: 0.4;
  }

  100% {
    opacity: 0.9;
  }
}

.scrollbar-thin::-webkit-scrollbar {
  height: 4px;
}

.scrollbar-thin::-webkit-scrollbar-thumb {
  background: rgba(100, 100, 100, 0.2);
  border-radius: 4px;
}

.scrollbar-thin::-webkit-scrollbar-track {
  background: rgba(100, 100, 100, 0.05);
  border-radius: 4px;
}

/* 黑暗模式滚动条适配 */
:root[data-theme='dark'] .scrollbar-thin::-webkit-scrollbar-thumb {
  background: rgba(180, 180, 180, 0.2);
}

:root[data-theme='dark'] .scrollbar-thin::-webkit-scrollbar-track {
  background: rgba(180, 180, 180, 0.05);
}

/* 黑暗模式脉冲效果适配 */
:root[data-theme='dark'] .pulse-effect {
  animation: dark-pulse-animation 2.5s infinite ease-in-out;
}

@keyframes dark-pulse-animation {
  0% {
    box-shadow: 0 0 0 0 rgba(167, 139, 250, 0.4);
    transform: scale(1);
  }

  50% {
    box-shadow: 0 0 0 8px rgba(167, 139, 250, 0);
    transform: scale(1.05);
  }

  100% {
    box-shadow: 0 0 0 0 rgba(167, 139, 250, 0);
    transform: scale(1);
  }
}

@keyframes dark-active-line-animation {
  0% {
    opacity: 0.6;
    box-shadow: 0 0 8px 0 rgba(124, 58, 237, 0.5);
  }

  50% {
    opacity: 1;
    box-shadow: 0 0 12px 0 rgba(124, 58, 237, 0.8);
  }

  100% {
    opacity: 0.6;
    box-shadow: 0 0 8px 0 rgba(124, 58, 237, 0.5);
  }
}
</style>
