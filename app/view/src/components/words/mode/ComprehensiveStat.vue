<template>
  <div class="ai-word-analysis">
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
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch } from 'vue'
import * as echarts from 'echarts'
import type { EChartsOption } from 'echarts'

const props = defineProps<{
  wordsDetails: any[]
  averageTimePerWord: number
  correctRate: number
  sessionDuration: number
}>()

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
  
  const timeData = props.wordsDetails.map(word => word.timeSpent)
  const wordLabels = props.wordsDetails.map(word => word.word)
  
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
  
  const timeData = props.wordsDetails.reduce((acc: number[], word) => {
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
          props.correctRate * 100,
          Math.min(100, 10000 / props.averageTimePerWord),
          props.correctRate * 100,
          Math.min(100, props.wordsDetails.length / (props.sessionDuration / 60000) * 10),
          Math.min(100, props.wordsDetails.filter(w => w.attempts === 1).length / props.wordsDetails.length * 100)
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

watch(() => props.wordsDetails, () => {
  initLearningPatternChart()
  initTimeDistributionChart()
  initPerformanceRadarChart()
}, { deep: true })
</script>

<style scoped>
.ai-word-analysis {
  padding: 20px;
  background: #f5f5f5;
  border-radius: 12px;
}

.analysis-header {
  margin-bottom: 30px;
}

.analysis-header h2 {
  text-align: center;
  color: #333;
  margin-bottom: 20px;
}

.analysis-summary {
  display: flex;
  justify-content: space-around;
  margin-bottom: 30px;
}

.summary-item {
  text-align: center;
  padding: 15px;
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
}

.summary-item .label {
  font-size: 14px;
  color: #666;
  margin-bottom: 5px;
}

.summary-item .value {
  font-size: 20px;
  font-weight: bold;
  color: #7e57c2;
}

.charts-container {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 20px;
}

.chart {
  height: 300px;
  background: white;
  border-radius: 8px;
  padding: 15px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
}

.chart:last-child {
  grid-column: span 2;
}
</style> 