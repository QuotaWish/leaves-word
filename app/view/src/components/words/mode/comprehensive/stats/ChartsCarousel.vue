<template>
  <div class="charts-carousel-container">
    <div class="chart-slider">
      <transition name="chart-fade" mode="out-in">
        <div v-if="currentIndex === 0" key="chart1" class="chart-wrapper">
          <div v-if="hasData" ref="learningPatternChart" class="chart"></div>
          <div v-else class="empty-chart">
            <div class="empty-chart-icon">
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M3 16L7 12L10 15L17 8L21 12" stroke="rgba(126, 87, 194, 0.7)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
            </div>
            <p>暂无表现数据，开始学习后将自动生成能力评估分析</p>
          </div>
          <div class="chart-analysis">
            <p>学习曲线分析：{{ getLearningCurveAnalysis() }}</p>
          </div>
        </div>
        
        <div v-else-if="currentIndex === 1" key="chart2" class="chart-wrapper">
          <div v-if="hasData" ref="timeDistributionChart" class="chart"></div>
          <div v-else class="empty-chart">
            <div class="empty-chart-icon">
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="12" cy="12" r="9" stroke="rgba(126, 87, 194, 0.7)" stroke-width="2"/>
                <path d="M12 7V12L15 15" stroke="rgba(126, 87, 194, 0.7)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
            </div>
            <p>暂无时间数据，开始学习后将自动生成时间分布分析</p>
          </div>
          <div class="chart-analysis">
            <p>时间分布分析：{{ getTimeDistributionAnalysis() }}</p>
          </div>
        </div>
        
        <div v-else-if="currentIndex === 2" key="chart3" class="chart-wrapper">
          <div v-if="hasData" ref="performanceRadarChart" class="chart"></div>
          <div v-else class="empty-chart">
            <div class="empty-chart-icon">
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 2L4 6V18L12 22L20 18V6L12 2Z" stroke="rgba(126, 87, 194, 0.7)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                <path d="M12 22V12" stroke="rgba(126, 87, 194, 0.7)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                <path d="M12 12L20 6" stroke="rgba(126, 87, 194, 0.7)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                <path d="M12 12L4 6" stroke="rgba(126, 87, 194, 0.7)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
            </div>
            <p>暂无表现数据，开始学习后将自动生成能力评估分析</p>
          </div>
          <div class="chart-analysis">
            <p>能力评估分析：{{ getPerformanceAnalysis() }}</p>
          </div>
        </div>
      </transition>
    </div>

    <div class="carousel-tab-container">
      <!-- SVG曲线导航指示器 -->
      <div class="tab-track">
        <svg class="tab-curve" width="100%" height="40" preserveAspectRatio="none">
          <path class="tab-curve-path" d="M0,20 C100,40 200,0 300,20 C400,40 500,0 600,20" stroke="rgba(126, 87, 194, 0.2)" stroke-width="2" fill="none"/>
          <path class="tab-curve-active" d="M0,20 C100,40 200,0 300,20 C400,40 500,0 600,20" stroke="rgba(126, 87, 194, 0.8)" stroke-width="2" fill="none" stroke-dasharray="600" :stroke-dashoffset="getDashOffset" />
        </svg>
      </div>
      
      <div class="tab-indicators">
        <div 
          v-for="(title, index) in chartTitles" 
          :key="index" 
          class="tab-item"
          :class="{ active: currentIndex === index }"
          @click="currentIndex = index"
        >
          <div class="tab-dot"></div>
          <span class="tab-title">{{ title }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch, onBeforeUnmount, computed } from 'vue'
import * as echarts from 'echarts'
import { useCharts } from '~/composables/words/mode/comprehensive/charts'

const props = defineProps<{
  correctRate: number
  averageTimePerWord: number
  sessionDuration: number
  wordsDetails: any[]
}>()

const learningPatternChart = ref<HTMLElement | null>(null)
const timeDistributionChart = ref<HTMLElement | null>(null)
const performanceRadarChart = ref<HTMLElement | null>(null)

const currentIndex = ref(0)
const chartTitles = ['学习进度分析', '反应时间分布', '学习能力评估']
let autoplayTimer: number | null = null

// 判断是否有数据
const hasData = computed(() => {
  return props.wordsDetails && props.wordsDetails.length > 0
})

// 计算SVG路径的stroke-dashoffset值
const getDashOffset = computed(() => {
  // 图表的总数量
  const totalTabs = chartTitles.length
  // 每个图表所占的比例
  const segmentPercent = 1 / totalTabs
  // 当前图表所处的位置（0到1之间）
  const position = currentIndex.value * segmentPercent
  // 曲线的总长度为600
  const pathLength = 600
  // 计算偏移量，反向偏移以显示左侧的曲线
  return pathLength - (position * pathLength)
})

const { 
  initLearningPatternChart, 
  initTimeDistributionChart, 
  initPerformanceRadarChart,
  getLearningCurveAnalysis,
  getTimeDistributionAnalysis,
  getPerformanceAnalysis
} = useCharts(props)

// 轮播控制方法
const nextChart = () => {
  currentIndex.value = (currentIndex.value + 1) % chartTitles.length
}

const prevChart = () => {
  currentIndex.value = (currentIndex.value - 1 + chartTitles.length) % chartTitles.length
}

// 自动轮播
const startAutoplay = () => {
  stopAutoplay()
  autoplayTimer = window.setInterval(() => {
    nextChart()
  }, 5000) // 5秒切换一次
}

const stopAutoplay = () => {
  if (autoplayTimer) {
    clearInterval(autoplayTimer)
    autoplayTimer = null
  }
}

// 监听图表激活状态
watch(currentIndex, (index) => {
  if (!hasData.value) return
  
  // 当前展示的图表初始化
  if (index === 0) initLearningPatternChart(learningPatternChart.value)
  if (index === 1) initTimeDistributionChart(timeDistributionChart.value)
  if (index === 2) initPerformanceRadarChart(performanceRadarChart.value)
  
  // 重启自动轮播
  startAutoplay()
})

onMounted(() => {
  // 只有在有数据的情况下初始化图表
  if (hasData.value) {
    initLearningPatternChart(learningPatternChart.value)
  }
  
  // 开始自动轮播
  startAutoplay()
  
  // 鼠标移入停止轮播，移出恢复
  const container = document.querySelector('.charts-carousel-container')
  if (container) {
    container.addEventListener('mouseenter', stopAutoplay)
    container.addEventListener('mouseleave', startAutoplay)
  }
})

onBeforeUnmount(() => {
  stopAutoplay()
  
  // 移除事件监听
  const container = document.querySelector('.charts-carousel-container')
  if (container) {
    container.removeEventListener('mouseenter', stopAutoplay)
    container.removeEventListener('mouseleave', startAutoplay)
  }
})

watch(() => props.wordsDetails, () => {
  if (!hasData.value) return
  
  // 当数据变化时重新初始化当前图表
  if (currentIndex.value === 0) initLearningPatternChart(learningPatternChart.value)
  if (currentIndex.value === 1) initTimeDistributionChart(timeDistributionChart.value)
  if (currentIndex.value === 2) initPerformanceRadarChart(performanceRadarChart.value)
}, { deep: true })
</script>

<style scoped>
.charts-carousel-container {
  margin-bottom: 24px;
  position: relative;
  overflow: hidden;
}

.chart-slider {
  height: 350px;
  border-radius: 16px;
  overflow: hidden;
  position: relative;
}

.chart-wrapper {
  background: rgba(126, 87, 194, 0.08);
  border-radius: 16px;
  padding: 16px;
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.08);
  height: 100%;
  display: flex;
  flex-direction: column;
  width: 100%;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.chart-wrapper:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.05);
}

.chart {
  flex: 1;
  min-height: 280px;
}

.empty-chart {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  color: var(--el-text-color-secondary);
  text-align: center;
  padding: 20px;
}

.empty-chart-icon {
  margin-bottom: 16px;
  width: 80px;
  height: 80px;
  border-radius: 50%;
  background: rgba(126, 87, 194, 0.05);
  display: flex;
  align-items: center;
  justify-content: center;
  animation: pulse 3s infinite ease-in-out;
}

@keyframes pulse {
  0% { transform: scale(0.95); opacity: 0.7; }
  50% { transform: scale(1.05); opacity: 1; }
  100% { transform: scale(0.95); opacity: 0.7; }
}

.chart-analysis {
  margin-top: 12px;
  padding: 12px 16px;
  background: rgba(126,87,194,0.08);
  border-radius: 12px;
  font-size: 14px;
  color: var(--el-text-color-regular);
  line-height: 1.5;
}

.chart-analysis p {
  margin: 0;
  white-space: normal;
  overflow: hidden;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  font-weight: 500;
}

/* 轮播TAB样式 */
.carousel-tab-container {
  position: relative;
  margin-top: 16px;
  padding: 20px 0;
  width: 100%;
}

.tab-track {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 40px;
  overflow: hidden;
}

.tab-curve {
  width: 100%;
}

.tab-curve-path, .tab-curve-active {
  transition: stroke-dashoffset 0.5s ease;
}

.tab-indicators {
  position: relative;
  z-index: 2;
  display: flex;
  justify-content: space-around;
  padding: 0 20px;
}

.tab-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  cursor: pointer;
  opacity: 0.7;
  transition: all 0.3s ease;
}

.tab-item:hover {
  opacity: 1;
}

.tab-item.active {
  opacity: 1;
}

.tab-dot {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background: rgba(126, 87, 194, 0.3);
  margin-bottom: 8px;
  transition: all 0.3s ease;
}

.tab-item.active .tab-dot {
  background: rgba(126, 87, 194, 1);
  transform: scale(1.3);
}

.tab-title {
  font-size: 13px;
  color: var(--el-text-color-regular);
  transition: all 0.3s ease;
  white-space: nowrap;
}

.tab-item.active .tab-title {
  color: var(--el-text-color-primary);
  font-weight: 500;
}

/* 淡入淡出过渡效果 */
.chart-fade-enter-active,
.chart-fade-leave-active {
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
}

.chart-fade-enter-from {
  opacity: 0;
  transform: translateY(10px);
}

.chart-fade-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}
</style> 