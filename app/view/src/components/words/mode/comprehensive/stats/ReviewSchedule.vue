<template>
  <div class="w-full rounded-xl bg-purple-100/30 p-4">
    <h4 class="text-sm text-gray-600 font-medium mb-4">推荐复习计划</h4>
    <div class="relative w-full">
      <!-- 使用容器限制最大宽度并居中 -->
      <div class="flex overflow-x-auto py-8 px-2 gap-2 md:gap-3 scrollbar-thin scroll-smooth max-w-full" ref="timelineRef">
        <!-- SVG连接线 -->
        <svg class="absolute top-0 left-0 w-full pointer-events-none" height="30" preserveAspectRatio="none" viewBox="0 0 600 30">
          <path d="M0,15 H600" stroke="#e4e7ed" stroke-width="2" stroke-dasharray="5,5" fill="none" />
          <path d="M0,15 H600" class="active-path" stroke="#7e57c2" stroke-width="2" fill="none"
            :stroke-dasharray="getTotalLength" :stroke-dashoffset="getDashOffset" />
        </svg>

        <div v-for="(review, index) in reviewSchedule" :key="index" 
          class="flex-shrink-0 flex flex-col items-center w-[16%] min-w-16 max-w-20"
          :class="{ 'review-active': review.isActive }">
          <div class="w-3 h-3 rounded-full bg-gray-400 mb-4 relative z-2 transition-all duration-300 -top-4"
               :class="{ 'bg-purple-500 shadow-purple-500/20 shadow-[0_0_0_4px]': review.isActive }"></div>
          <div class="text-center w-full">
            <div class="font-medium mb-1 text-xs text-gray-700 truncate" :class="{ 'text-purple-500': review.isActive }">
              {{ review.day }}
            </div>
            <div class="text-xs text-gray-500 mb-0.5 truncate" :class="{ 'text-purple-500': review.isActive }">
              {{ review.time }}
            </div>
            <div class="text-[11px] text-gray-400 truncate" :class="{ 'text-purple-500': review.isActive }">
              {{ review.status }}
            </div>
          </div>
        </div>
      </div>
      
      <!-- 添加指示器提示用户可以左右滑动 -->
      <div v-if="showScrollHint" class="absolute bottom-0 right-2.5 text-xs text-gray-400 opacity-70 flex items-center gap-1 animate-pulse">
        <i class="el-icon-arrow-right"></i>
        <span>左右滑动查看更多</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'

const timelineRef = ref<HTMLElement | null>(null)

// 是否显示滚动提示
const showScrollHint = ref(false)

const reviewSchedule = ref([
  { day: '今天', time: '已完成', status: '已完成', isActive: false },
  { day: '明天', time: '19:30', status: '首次复习', isActive: true },
  { day: '3天后', time: '20:00', status: '第二次复习', isActive: false },
  { day: '7天后', time: '待定', status: '第三次复习', isActive: false },
  { day: '15天后', time: '待定', status: '第四次复习', isActive: false },
  { day: '30天后', time: '待定', status: '最终巩固', isActive: false }
])

// 找出当前激活的复习项索引
const activeIndex = computed(() => {
  const index = reviewSchedule.value.findIndex(item => item.isActive)
  return index >= 0 ? index : 0
})

// 计算SVG路径的总长度
const getTotalLength = computed(() => '600')

// 根据当前激活的项目计算dash offset
const getDashOffset = computed(() => {
  const segmentLength = 600 / (reviewSchedule.value.length - 1)
  return 600 - (activeIndex.value * segmentLength)
})

// 检查是否需要显示横向滚动提示
const checkScrollHint = () => {
  if (timelineRef.value) {
    showScrollHint.value = timelineRef.value.scrollWidth > timelineRef.value.clientWidth
  }
}

onMounted(() => {
  // 检查是否需要显示滚动提示
  checkScrollHint()
  window.addEventListener('resize', checkScrollHint)
})

onUnmounted(() => {
  window.removeEventListener('resize', checkScrollHint)
})
</script>

<style scoped>
.active-path {
  transition: stroke-dashoffset 0.5s ease;
}

@keyframes pulse {
  0% { opacity: 0.7; }
  50% { opacity: 0.3; }
  100% { opacity: 0.7; }
}

.scrollbar-thin::-webkit-scrollbar {
  height: 4px;
}

.scrollbar-thin::-webkit-scrollbar-thumb {
  background: rgba(100, 100, 100, 0.2);
  border-radius: 2px;
}

.scrollbar-thin::-webkit-scrollbar-track {
  background: rgba(100, 100, 100, 0.05);
  border-radius: 2px;
}
</style>
