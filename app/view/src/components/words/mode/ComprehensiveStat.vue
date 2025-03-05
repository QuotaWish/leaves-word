<template>
  <div class="ai-word-analysis">
    <template v-if="isLoading">
      <div class="loading-skeleton">
        <el-skeleton :rows="3" animated>
          <template #template>
            <el-skeleton-item variant="h3" style="width: 30%" />
            <div style="padding: 14px">
              <el-skeleton-item variant="h3" style="width: 50%" />
              <div style="display: f  lex; justify-content: space-between; align-items: center; margin-top: 16px">
                <div style="display: flex; gap: 16px">
                  <el-skeleton-item variant="text" style="margin-right: 16px" />
                  <el-skeleton-item variant="text" style="width: 30%" />
                </div>
              </div>
            </div>
          </template>
        </el-skeleton>
      </div>
    </template>

    <template v-else>
      <div class="analysis-header">
        <h2>AI 辅助学习分析</h2>
        <div class="analysis-summary">
          <div class="summary-item">
            <div class="label">平均响应时间</div>
            <div class="value">{{ formatTime(averageTimePerWord) }}ms</div>
          </div>
          <div class="summary-item">
            <div class="label">正确率</div>
            <div class="value">{{ (correctRate * 100).toFixed(1) }}%</div>
          </div>
          <div class="summary-item">
            <div class="label">学习时长</div>
            <div class="value">{{ formatDuration(sessionDuration) }}</div>
          </div>
        </div>
      </div>
      
      <div class="charts-container">
        <div ref="learningPatternChart" class="chart"></div>
        <div ref="timeDistributionChart" class="chart"></div>
        <div ref="performanceRadarChart" class="chart"></div>
      </div>
    </template>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch, computed } from 'vue'
import * as echarts from 'echarts'
import type { EChartsOption } from 'echarts'
import { ComprehensiveStatistics } from '~/composables/words/mode/comprehensive';
import { Statistics } from '~/composables/words';
import { ElSkeleton, ElSkeletonItem } from 'element-plus'

const props = defineProps<{
  data: Statistics<any>
}>()

const stat = computed(() => ComprehensiveStatistics.parseStatistics(props.data))

const correctRate = computed(() => stat.value.data.correctRate || 0)
const averageTimePerWord = computed(() => stat.value.data.averageTimePerWord || 0)
const sessionDuration = computed(() => stat.value.data.sessionDuration || 0)
const isLoading = computed(() => !stat.value.data.wordsDetails?.length)

const learningPatternChart = ref<HTMLElement | null>(null)
const timeDistributionChart = ref<HTMLElement | null>(null)
const performanceRadarChart = ref<HTMLElement | null>(null)

const formatTime = (ms: number) => Math.round(ms)
const formatDuration = (ms: number) => {
  const minutes = Math.floor(ms / 60000)
  const seconds = Math.floor((ms % 60000) / 1000)
  return `${minutes}分${seconds}秒`
}

const initLearningPatternChart = () => {
  if (!learningPatternChart.value) return
  const chart = echarts.init(learningPatternChart.value)
  
  const timeData = stat.value.data.wordsDetails?.map(word => word.timeSpent)
  const wordLabels = stat.value.data.wordsDetails?.map(word => word.word)
  
  const option: EChartsOption = {
    title: {
      text: '学习模式分析',
      left: 'center'
    },
    tooltip: {
      trigger: 'axis'
    },
    xAxis: {
      type: 'category',
      data: wordLabels
    },
    yAxis: {
      type: 'value',
      name: '响应时间 (ms)'
    },
    series: [{
      name: '响应时间',
      type: 'line',
      data: timeData,
      smooth: true,
      lineStyle: {
        width: 3,
        color: '#7e57c2'
      },
      areaStyle: {
        color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
          { offset: 0, color: 'rgba(126,87,194,0.3)' },
          { offset: 1, color: 'rgba(126,87,194,0.1)' }
        ])
      }
    }]
  }
  
  chart.setOption(option)
}

const initTimeDistributionChart = () => {
  if (!timeDistributionChart.value) return
  const chart = echarts.init(timeDistributionChart.value)
  
  const timeRanges = [
    '0-5s', '5-10s', '10-20s', '20s+'
  ]
  
  const timeData = stat.value.data.wordsDetails?.reduce((acc: number[], word) => {
    const seconds = word.timeSpent / 1000
    if (seconds <= 5) acc[0]++
    else if (seconds <= 10) acc[1]++
    else if (seconds <= 20) acc[2]++
    else acc[3]++
    return acc
  }, [0, 0, 0, 0])
  
  const option: EChartsOption = {
    title: {
      text: '时间分布',
      left: 'center'
    },
    tooltip: {
      trigger: 'item'
    },
    series: [{
      name: '响应时间分布',
      type: 'pie',
      radius: ['40%', '70%'],
      data: timeRanges.map((range, index) => ({
        name: range,
        value: timeData[index]
      })),
      emphasis: {
        itemStyle: {
          shadowBlur: 10,
          shadowOffsetX: 0,
          shadowColor: 'rgba(0, 0, 0, 0.5)'
        }
      }
    }]
  }
  
  chart.setOption(option)
}

const initPerformanceRadarChart = () => {
  if (!performanceRadarChart.value) return
  const chart = echarts.init(performanceRadarChart.value)
  
  const option: EChartsOption = {
    title: {
      text: 'AI 学习能力评估',
      left: 'center'
    },
    radar: {
      indicator: [
        { name: '记忆力', max: 100 },
        { name: '反应速度', max: 100 },
        { name: '准确度', max: 100 },
        { name: '学习效率', max: 100 },
        { name: '知识关联', max: 100 }
      ]
    },
    series: [{
      type: 'radar',
      data: [{
        value: [
          stat.value.correctRate * 100,
          Math.min(100, 10000 / stat.value.averageTimePerWord),
          stat.value.correctRate * 100,
          Math.min(100, stat.value.data.wordsDetails.length / (stat.value.data.sessionDuration / 60000) * 10),
          Math.min(100, stat.value.data.wordsDetails.filter(w => w.attempts === 1).length / stat.value.data.wordsDetails.length * 100)
        ],
        name: '能力评估',
        areaStyle: {
          color: new echarts.graphic.LinearGradient(0, 0, 1, 1, [
            { offset: 0, color: 'rgba(126,87,194,0.3)' },
            { offset: 1, color: 'rgba(126,87,194,0.1)' }
          ])
        }
      }]
    }]
  }
  
  chart.setOption(option)
}

onMounted(() => {
  initLearningPatternChart()
  initTimeDistributionChart()
  initPerformanceRadarChart()
})

watch(() => props.data, () => {
  initLearningPatternChart()
  initTimeDistributionChart()
  initPerformanceRadarChart()
}, { deep: true })
</script>

<style scoped>
.ai-word-analysis {
  padding: 20px 0;
  border-radius: 12px;
}

.analysis-header {
  margin-bottom: 20px;
}

.analysis-header h2 {
  text-align: center;
  color: var(--el-text-color-primary);
  margin-bottom: 20px;
  font-size: 18px;
  font-weight: 600;
}

.analysis-summary {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 12px;
  margin-bottom: 24px;
}

.summary-item {
  text-align: center;
  padding: 12px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 16px;
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.summary-item .label {
  font-size: 14px;
  color: var(--el-text-color-regular);
  margin-bottom: 4px;
}

.summary-item .value {
  font-size: 18px;
  font-weight: bold;
  background: linear-gradient(45deg, #00c6ff, #0072ff);
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
}

.charts-container {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.chart {
  height: 280px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 16px;
  padding: 16px;
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.loading-skeleton {
  padding: 20px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 16px;
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.1);
}

:deep(.el-skeleton__item) {
  background: rgba(255, 255, 255, 0.2);
}

:deep(.el-skeleton__h3) {
  height: 24px !important;
}

:deep(.el-skeleton__text) {
  height: 16px !important;
}
</style> 