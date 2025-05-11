<script setup lang="ts">
import type { ECharts } from 'echarts'
import type { SoundStatistics } from '../../stat'
import { computed, nextTick, onBeforeUnmount, onMounted, ref, type Ref, watch } from 'vue'
import { isDark } from '~/composables/theme'
import { useCharts } from './charts'

const props = defineProps<{
  data: SoundStatistics
}>()

interface ChartDefinition {
  id: string
  title: string
  description: string
  refId: string
  initFn: (el: HTMLElement) => ECharts | null
  instance?: ECharts | null
  hasData?: () => boolean
}

const chartRefs = ref<{ [key: string]: HTMLElement | null }>({
  correctRate: null,
  timeDistribution: null,
  exampleStage: null,
  audioUsage: null,
  sessionDuration: null,
})

const chartDefs = ref<ChartDefinition[]>([])
const currentIndex = ref(0)
let autoplayTimer: number | null = null
const allChartsInitialized = ref(false)

const hasExampleStageData = computed(() => props.data.data?.exampleStageStats && Object.keys(props.data.data.exampleStageStats).length > 0)

function buildChartDefs() {
  const currentData = props.data.data;
  if (!currentData) {
    chartDefs.value = [];
    allChartsInitialized.value = false;
    if (currentIndex.value >= chartDefs.value.length && chartDefs.value.length > 0) {
      currentIndex.value = 0;
    } else if (chartDefs.value.length === 0) {
      currentIndex.value = 0;
    }
    return;
  }

  const {
    initCorrectRateChart,
    initTimeDistributionChart,
    initExampleStageChart,
    initAudioUsageChart,
    initSessionDurationChart,
  } = useCharts(currentData);

  const definitions: ChartDefinition[] = []

  // 添加学习时长分布图表
  definitions.push({
    id: 'sessionDuration',
    title: '学习时长分布',
    description: '各类学习活动占用时间比例',
    refId: 'sessionDuration',
    initFn: initSessionDurationChart,
    hasData: () => !!currentData.sessionDuration,
  })

  definitions.push({
    id: 'correctRate',
    title: '正确率对比',
    description: '听写和例句练习的正确率对比',
    refId: 'correctRate',
    initFn: initCorrectRateChart,
    hasData: () => (currentData.dictationCorrectRate !== undefined || currentData.exampleCorrectRate !== undefined),
  })

  definitions.push({
    id: 'timeDistribution',
    title: '平均时间对比',
    description: '听写和例句练习的平均耗时对比',
    refId: 'timeDistribution',
    initFn: initTimeDistributionChart,
    hasData: () => !!currentData.wordsDetails && currentData.wordsDetails.length > 0,
  })

  if (hasExampleStageData.value) {
    definitions.push({
      id: 'exampleStage',
      title: '例句阶段完成率',
      description: '不同例句阶段的完成率雷达图',
      refId: 'exampleStage',
      initFn: initExampleStageChart,
      hasData: () => !!hasExampleStageData.value,
    })
  }

  definitions.push({
    id: 'audioUsage',
    title: '音频使用分析',
    description: '平均播放次数与音频使用效率分析',
    refId: 'audioUsage',
    initFn: initAudioUsageChart,
    hasData: () => currentData.audioPlayCount !== undefined,
  })

  chartDefs.value = definitions
  allChartsInitialized.value = false
  if (currentIndex.value >= chartDefs.value.length && chartDefs.value.length > 0) {
    currentIndex.value = 0
  } else if (chartDefs.value.length === 0) {
    currentIndex.value = 0;
  }
}

function disposeAllCharts() {
  for (const def of chartDefs.value) {
    if (def.instance) {
      def.instance.dispose()
      def.instance = null
    }
  }
  allChartsInitialized.value = false
}

function initAllCharts() {
  if (allChartsInitialized.value)
    return
  disposeAllCharts() // Ensure old charts are disposed before re-init

  nextTick(() => {
    let initializedCount = 0
    for (const def of chartDefs.value) {
      const el = chartRefs.value[def.refId]
      if (el && typeof def.initFn === 'function') {
        // Check specific data presence for this chart if hasData function is defined
        const chartHasData = def.hasData ? def.hasData() : true
        if (chartHasData) {
          def.instance = def.initFn(el)
          if (def.instance)
            initializedCount++
        } else {
          // Ensure instance is null if no data
          def.instance = null
        }
      }
    }
    if (initializedCount > 0 || chartDefs.value.length === 0) { // Consider initialized if no charts or some charts are up
      allChartsInitialized.value = true
    }
    resizeCurrentChart() // Resize after initialization
  })
}

function resizeCurrentChart() {
  if (!allChartsInitialized.value || currentIndex.value < 0 || currentIndex.value >= chartDefs.value.length)
    return
  const currentChartDef = chartDefs.value[currentIndex.value]
  if (currentChartDef?.instance) {
    currentChartDef.instance.resize()
  }
}

function nextChart() {
  if (chartDefs.value.length === 0)
    return;
  currentIndex.value = (currentIndex.value + 1) % chartDefs.value.length
}

function _prevChart() {
  if (chartDefs.value.length === 0)
    return;
  currentIndex.value = (currentIndex.value - 1 + chartDefs.value.length) % chartDefs.value.length
}

function setCurrentChart(index: number) {
  if (index >= 0 && index < chartDefs.value.length) {
    currentIndex.value = index
  }
}

function startAutoplay() {
  stopAutoplay()
  if (chartDefs.value.length <= 1)
    return
  autoplayTimer = window.setInterval(() => {
    nextChart()
  }, 7000) // 7 seconds per chart
}

function stopAutoplay() {
  if (autoplayTimer) {
    clearInterval(autoplayTimer)
    autoplayTimer = null
  }
}

function setChartRef(el: any, id: string) {
  if (el instanceof HTMLElement) {
    chartRefs.value[id] = el
  }
}

watch(currentIndex, () => {
  startAutoplay() // Restart autoplay when index changes manually
  if (allChartsInitialized.value) {
    nextTick(() => {
      resizeCurrentChart()
    })
  }
})

watch(
  () => props.data,
  () => {
    buildChartDefs()
    initAllCharts()
  },
  { deep: true },
)

watch(isDark, () => {
  if (allChartsInitialized.value) {
    // Theme changed, re-initialize charts
    // setTimeout to allow DOM to update with new theme variables
    setTimeout(() => {
      disposeAllCharts()
      initAllCharts()
    }, 200)
  }
})

let resizeObserver: ResizeObserver | null = null

onMounted(() => {
  buildChartDefs() // Initial build
  // Delay initialization slightly to ensure DOM is fully ready
  setTimeout(() => {
    initAllCharts()
  }, 100)

  startAutoplay()

  const container = document.querySelector('.charts-carousel-container') // Use a more specific selector if needed
  if (container) {
    container.addEventListener('mouseenter', stopAutoplay)
    container.addEventListener('mouseleave', startAutoplay)
  }

  if (window.ResizeObserver) {
    const chartSliderElement = document.querySelector('.chart-slider')
    if (chartSliderElement) {
      resizeObserver = new ResizeObserver(() => {
        if (allChartsInitialized.value) {
          resizeCurrentChart()
        }
      })
      resizeObserver.observe(chartSliderElement)
    }
  }
})

onBeforeUnmount(() => {
  stopAutoplay()
  disposeAllCharts()

  const container = document.querySelector('.charts-carousel-container')
  if (container) {
    container.removeEventListener('mouseenter', stopAutoplay)
    container.removeEventListener('mouseleave', startAutoplay)
  }
  if (resizeObserver) {
    resizeObserver.disconnect()
  }
})
</script>

<template>
  <div v-if="chartDefs.length > 0" class="charts-carousel-container">
    <div class="chart-slider">
      <div class="charts-wrapper">
        <template v-for="(chart, index) in chartDefs" :key="chart.id">
          <div v-show="currentIndex === index" class="chart-item-wrapper">
            <div
              v-if="chart.hasData ? chart.hasData() : true"
              class="chart-canvas"
              :ref="(el) => setChartRef(el, chart.refId)"
            />
            <div v-else class="empty-chart-placeholder">
              <svg
                width="48"
                height="48"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                class="empty-icon"
              >
                <path
                  d="M3 16L7 12L10 15L17 8L21 12"
                  stroke="currentColor"
                  stroke-width="1.5"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
              </svg>
              <p>暂无数据生成图表：{{ chart.title }}</p>
            </div>
          </div>
        </template>
      </div>
    </div>

    <div v-if="chartDefs.length > 1" class="carousel-tab-indicators">
      <button
        v-for="(chart, index) in chartDefs"
        :key="chart.id"
        class="tab-indicator-item"
        :class="{ active: currentIndex === index }"
        :aria-label="`切换到 ${chart.title}`"
        @click="setCurrentChart(index)"
      >
        <span class="tab-title">{{ chart.title }}</span>
      </button>
    </div>
  </div>
  <div v-else class="charts-carousel-container empty-state">
    <p>没有可供显示的图表数据。请完成一次听力练习后再查看。</p>
  </div>
</template>

<style scoped>
.charts-carousel-container {
  display: flex;
  flex-direction: column;
  width: 100%;
  min-height: 350px; /* Adjusted for potentially taller charts or tabs */
  background: rgba(255, 255, 255, 0.02);
  border-radius: 12px;
  padding: 16px;
  box-shadow: none;
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.08);
  overflow: hidden; /* Prevent content overflow */
  position: relative;
  transition: all 0.3s ease;
}

.charts-carousel-container:hover {
  border-color: rgba(255, 255, 255, 0.15);
  transform: translateY(-2px);
}

.charts-carousel-container.empty-state {
  display: flex;
  justify-content: center;
  align-items: center;
  text-align: center;
  color: var(--color-text-secondary, #666);
  font-size: 1rem;
}

.chart-slider {
  flex-grow: 1;
  position: relative;
  display: flex;
  overflow: hidden; /* For potential future sliding animations */
}

.charts-wrapper {
  display: flex;
  width: 100%;
  height: 100%;
}

.chart-item-wrapper {
  width: 100%;
  height: 100%;
  flex-shrink: 0; /* Important for v-show items in flex container */
  display: flex; /* Center content */
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

.chart-canvas {
  width: 100%;
  height: 100%;
  min-height: 280px; /* Ensure chart has enough space */
}

.empty-chart-placeholder {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  text-align: center;
  color: var(--color-text-muted, #999);
  height: 100%;
  width: 100%;
  padding: 20px;
}

.empty-chart-placeholder .empty-icon {
  width: 48px;
  height: 48px;
  margin-bottom: 12px;
  opacity: 0.7;
}

.carousel-tab-indicators {
  display: flex;
  justify-content: center;
  align-items: center;
  padding-top: 12px;
  margin-top: auto; /* Push to bottom if chart-slider doesn't fill height */
  flex-wrap: wrap; /* Allow tabs to wrap on small screens */
  gap: 8px;
}

.tab-indicator-item {
  padding: 8px 16px;
  border: none;
  background: rgba(255, 255, 255, 0.05);
  color: var(--color-text-secondary, #333);
  border-radius: 20px; /* Pill shape */
  cursor: pointer;
  transition:
    background-color 0.3s ease,
    color 0.3s ease,
    transform 0.2s ease;
  font-size: 0.875rem;
  font-weight: 500;
  backdrop-filter: blur(5px);
  border: 1px solid rgba(255, 255, 255, 0.05);
}

.tab-indicator-item:hover {
  background: rgba(126, 87, 194, 0.1);
  transform: translateY(-2px);
  border-color: rgba(255, 255, 255, 0.1);
}

.tab-indicator-item.active {
  background: rgba(126, 87, 194, 0.2);
  color: var(--color-text-primary, #333);
  font-weight: 600;
  box-shadow: 0 2px 8px rgba(126, 87, 194, 0.2);
  border-color: rgba(126, 87, 194, 0.3);
}

.tab-title {
  white-space: nowrap;
}

/* Ensure v-show works correctly by not setting display: none !important on children */
.chart-item-wrapper[style*='display: none;'] {
  /* Allow v-show to control display */
}

/* 响应式调整 */
@media (max-width: 640px) {
  .charts-carousel-container {
    min-height: 300px;
    padding: 12px;
  }

  .chart-canvas {
    min-height: 240px;
  }

  .carousel-tab-indicators {
    padding-top: 8px;
    gap: 6px;
  }

  .tab-indicator-item {
    padding: 6px 12px;
    font-size: 0.8rem;
  }
}
</style>
