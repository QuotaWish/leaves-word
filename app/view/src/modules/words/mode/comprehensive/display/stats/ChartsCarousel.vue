<template>
  <div class="charts-carousel-container">
    <div class="chart-slider">
      <div class="charts-container">
        <!-- 使用v-show而非v-if，保留DOM -->
        <div v-show="currentIndex === 0" key="chart1" class="chart-wrapper" :class="{ 'active': currentIndex === 0 }">
          <div v-if="hasData" ref="learningPatternChart" class="chart"></div>
          <div v-else class="empty-chart">
            <div class="empty-chart-icon">
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M3 16L7 12L10 15L17 8L21 12" stroke="rgba(126, 87, 194, 0.7)" stroke-width="2"
                  stroke-linecap="round" stroke-linejoin="round" />
              </svg>
            </div>
            <p>暂无表现数据，开始学习后将自动生成能力评估分析</p>
          </div>
          <div class="chart-analysis">
            <p>学习曲线分析：{{ getLearningCurveAnalysis() }}</p>
          </div>
        </div>

        <div v-show="currentIndex === 1" key="chart2" class="chart-wrapper" :class="{ 'active': currentIndex === 1 }">
          <div v-if="hasData" ref="timeDistributionChart" class="chart"></div>
          <div v-else class="empty-chart">
            <div class="empty-chart-icon">
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="12" cy="12" r="9" stroke="rgba(126, 87, 194, 0.7)" stroke-width="2" />
                <path d="M12 7V12L15 15" stroke="rgba(126, 87, 194, 0.7)" stroke-width="2" stroke-linecap="round"
                  stroke-linejoin="round" />
              </svg>
            </div>
            <p>暂无时间数据，开始学习后将自动生成时间分布分析</p>
          </div>
          <div class="chart-analysis">
            <p>时间分布分析：{{ getTimeDistributionAnalysis() }}</p>
          </div>
        </div>

        <div v-show="currentIndex === 2" key="chart3" class="chart-wrapper" :class="{ 'active': currentIndex === 2 }">
          <div v-if="hasData" ref="performanceRadarChart" class="chart"></div>
          <div v-else class="empty-chart">
            <div class="empty-chart-icon">
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 2L4 6V18L12 22L20 18V6L12 2Z" stroke="rgba(126, 87, 194, 0.7)" stroke-width="2"
                  stroke-linecap="round" stroke-linejoin="round" />
                <path d="M12 22V12" stroke="rgba(126, 87, 194, 0.7)" stroke-width="2" stroke-linecap="round"
                  stroke-linejoin="round" />
                <path d="M12 12L20 6" stroke="rgba(126, 87, 194, 0.7)" stroke-width="2" stroke-linecap="round"
                  stroke-linejoin="round" />
                <path d="M12 12L4 6" stroke="rgba(126, 87, 194, 0.7)" stroke-width="2" stroke-linecap="round"
                  stroke-linejoin="round" />
              </svg>
            </div>
            <p>暂无表现数据，开始学习后将自动生成能力评估分析</p>
          </div>
          <div class="chart-analysis">
            <p>能力评估分析：{{ getPerformanceAnalysis() }}</p>
          </div>
        </div>
      </div>
    </div>

    <div class="carousel-tab-container">
      <!-- SVG曲线导航指示器 -->
      <div class="tab-track">
        <svg class="tab-curve" width="100%" height="40" preserveAspectRatio="none">
          <path class="tab-curve-path" d="M0,20 C100,40 200,0 300,20 C400,40 500,0 600,20"
            stroke="rgba(126, 87, 194, 0.2)" stroke-width="2" fill="none" />
          <path class="tab-curve-active" d="M0,20 C100,40 200,0 300,20 C400,40 500,0 600,20"
            stroke="rgba(126, 87, 194, 0.8)" stroke-width="2" fill="none" stroke-dasharray="600"
            :stroke-dashoffset="getDashOffset" />
        </svg>
      </div>

      <div class="tab-indicators">
        <div v-for="(title, index) in chartTitles" :key="index" class="tab-item"
          :class="{ active: currentIndex === index }" @click="currentIndex = index">
          <div class="tab-dot"></div>
          <span class="tab-title">{{ title }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch, onBeforeUnmount, computed, nextTick } from 'vue'
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
const chartTitles = ['单词耗时分析', '反应时间分布', '学习能力评估']
let autoplayTimer: number | null = null
let charts: echarts.ECharts[] = []
let allChartsInitialized = false

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

// 初始化所有图表
const initAllCharts = () => {
  if (!hasData.value || allChartsInitialized) return

  // 初始化所有图表
  setTimeout(() => {
    // 依次初始化三个图表
    if (learningPatternChart.value) {
      const chart = initLearningPatternChart(learningPatternChart.value)
      if (chart) charts[0] = chart
    }

    if (timeDistributionChart.value) {
      const chart = initTimeDistributionChart(timeDistributionChart.value)
      if (chart) charts[1] = chart
    }

    if (performanceRadarChart.value) {
      const chart = initPerformanceRadarChart(performanceRadarChart.value)
      if (chart) charts[2] = chart
    }

    allChartsInitialized = true

    // 初始化后，resize当前显示的图表
    resizeCurrentChart()
  }, 500)
}

// 重设当前图表大小
const resizeCurrentChart = () => {
  const index = currentIndex.value
  if (charts[index]) {
    charts[index].resize()
  }
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
  // 重启自动轮播
  startAutoplay()

  // 如果图表已经初始化，只需resize当前图表
  if (allChartsInitialized) {
    nextTick(() => {
      resizeCurrentChart()
    })
  }
})

// 监听数据变化
watch(() => props.wordsDetails, () => {
  if (!hasData.value) return

  // 数据变化时重新初始化所有图表
  allChartsInitialized = false

  // 清理旧图表
  charts.forEach(chart => {
    if (chart) chart.dispose()
  })
  charts = [null, null, null] as any

  // 重新初始化
  nextTick(() => {
    initAllCharts()
  })
}, { deep: true })

onMounted(() => {
  // 初始化图表数组
  charts = [null, null, null] as any

  // 延迟初始化，确保DOM已经渲染
  nextTick(() => {
    if (hasData.value) {
      initAllCharts()
    }
  })

  // 开始自动轮播
  startAutoplay()

  // 鼠标移入停止轮播，移出恢复
  const container = document.querySelector('.charts-carousel-container')
  if (container) {
    container.addEventListener('mouseenter', stopAutoplay)
    container.addEventListener('mouseleave', startAutoplay)
  }

  // 添加ResizeObserver监听容器大小变化
  if (window.ResizeObserver) {
    const resizeObserver = new ResizeObserver(() => {
      if (allChartsInitialized) {
        resizeCurrentChart()
      }
    })

    const chartSlider = document.querySelector('.chart-slider')
    if (chartSlider) {
      resizeObserver.observe(chartSlider)
    }

    onBeforeUnmount(() => {
      resizeObserver.disconnect()
    })
  }
})

onBeforeUnmount(() => {
  stopAutoplay()

  // 销毁所有图表实例，避免内存泄漏
  charts.forEach(chart => {
    if (chart) chart.dispose()
  })

  // 移除事件监听
  const container = document.querySelector('.charts-carousel-container')
  if (container) {
    container.removeEventListener('mouseenter', stopAutoplay)
    container.removeEventListener('mouseleave', startAutoplay)
  }
})
</script>

<style scoped>
.charts-carousel-container {
  margin-bottom: 24px;
  position: relative;
  overflow: hidden;
}

.chart-slider {
  height: 320px;
  border-radius: 16px;
  overflow: hidden;
  position: relative;
}

.charts-container {
  position: relative;
  height: 100%;
  width: 100%;
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
  transition: opacity 0.4s ease, transform 0.3s ease, box-shadow 0.3s ease;
  position: absolute;
  top: 0;
  left: 0;
  opacity: 0;
  pointer-events: none;
}

.chart-wrapper.active {
  opacity: 1;
  pointer-events: auto;
}

.chart-wrapper:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.05);
}

.chart {
  flex: 1;
  min-height: 220px;
  width: 100%;
  margin-bottom: 10px;
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
  0% {
    transform: scale(0.95);
    opacity: 0.7;
  }

  50% {
    transform: scale(1.05);
    opacity: 1;
  }

  100% {
    transform: scale(0.95);
    opacity: 0.7;
  }
}

.chart-analysis {
  padding: 12px 16px;
  background: rgba(126, 87, 194, 0.08);
  border-radius: 12px;
  font-size: 14px;
  color: var(--el-text-color-regular);
  line-height: 1.5;
  margin-top: auto;
  /* 将分析固定在底部 */
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

.tab-curve-path,
.tab-curve-active {
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

/* 媒体查询，确保在不同屏幕大小下正常显示 */
@media (max-width: 768px) {
  .chart-slider {
    height: 300px;
  }

  .chart {
    min-height: 200px;
  }
}

/* 暗黑模式适配 */
:root[data-theme='dark'] .chart-wrapper {
  background: rgba(126, 87, 194, 0.15);
  border-color: rgba(255, 255, 255, 0.1);
}

:root[data-theme='dark'] .chart-analysis {
  background: rgba(126, 87, 194, 0.1);
}
</style>