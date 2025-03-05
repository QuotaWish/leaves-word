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
            <div class="value">{{ formatTime(averageTimePerWord) }}</div>
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
        <div class="chart-wrapper">
          <div ref="learningPatternChart" class="chart"></div>
          <div class="chart-analysis">
            <p>学习曲线分析：{{ getLearningCurveAnalysis() }}</p>
          </div>
        </div>
        
        <div class="chart-wrapper">
          <div ref="timeDistributionChart" class="chart"></div>
          <div class="chart-analysis">
            <p>时间分布分析：{{ getTimeDistributionAnalysis() }}</p>
          </div>
        </div>
        
        <div class="chart-wrapper">
          <div ref="performanceRadarChart" class="chart"></div>
          <div class="chart-analysis">
            <p>能力评估分析：{{ getPerformanceAnalysis() }}</p>
          </div>
        </div>
      </div>

      <div class="footer">
        <div class="brand">
          <Logo />
          <h1>LeavesWord</h1>
        </div>
        <div class="disclaimer">
          <p>© 2025 LeavesWord AI 学习助手</p>
          <p>隐私声明：您的学习数据仅用于个性化学习体验，我们严格保护您的隐私安全。</p>
          <p>AI 分析声明：本分析报告由 AI 算法生成，仅供参考。持续学习才是提高的关键。</p>
        </div>
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

const formatTime = (ms: number) => {
  const seconds = ms / 1000
  return `${seconds.toFixed(2)}秒`
}

const formatDuration = (ms: number) => {
  const totalSeconds = ms / 1000
  const minutes = Math.floor(totalSeconds / 60)
  const seconds = (totalSeconds % 60).toFixed(2)
  return minutes > 0 ? `${minutes}分${seconds}秒` : `${seconds}秒`
}

const getLearningCurveAnalysis = () => {
  if (!stat.value.data.wordsDetails?.length) return '暂无数据'
  
  const times = stat.value.data.wordsDetails.map(w => w.timeSpent / 1000)
  const avg = times.reduce((a, b) => a + b, 0) / times.length
  const trend = times.slice(-3).reduce((a, b) => a + b, 0) / 3
  
  if (trend < avg * 0.8) return '学习曲线呈下降趋势，表现越来越好！'
  if (trend > avg * 1.2) return '近期响应时间略有上升，建议适当放慢节奏。'
  return '学习曲线平稳，保持良好的学习状态。'
}

const getTimeDistributionAnalysis = () => {
  if (!stat.value.data.wordsDetails?.length) return '暂无数据'
  
  const times = stat.value.data.wordsDetails.map(w => w.timeSpent / 1000)
  const fastCount = times.filter(t => t <= 2).length
  const fastRate = (fastCount / times.length * 100).toFixed(1)
  
  return `快速反应（≤2秒）占比${fastRate}%，整体掌握程度良好。`
}

const getPerformanceAnalysis = () => {
  if (!stat.value.data.wordsDetails?.length) return '暂无数据'
  
  const scores = [
    correctRate.value * 100,
    Math.min(100, 10000 / averageTimePerWord.value),
    correctRate.value * 100,
    Math.min(100, stat.value.data.wordsDetails.length / (sessionDuration.value / 60000) * 10),
    Math.min(100, stat.value.data.wordsDetails.filter(w => w.attempts === 1).length / stat.value.data.wordsDetails.length * 100)
  ]
  
  const avgScore = scores.reduce((a, b) => a + b, 0) / scores.length
  return `综合评分${avgScore.toFixed(1)}分，${avgScore >= 80 ? '表现优秀' : avgScore >= 60 ? '表现良好' : '仍有提升空间'}。`
}

const initLearningPatternChart = () => {
  if (!learningPatternChart.value || !stat.value.data.wordsDetails?.length) return
  const chart = echarts.init(learningPatternChart.value)
  
  const timeData = stat.value.data.wordsDetails.map(word => word.timeSpent / 1000)
  const wordLabels = stat.value.data.wordsDetails.map(word => word.word)
  
  const option: EChartsOption = {
    title: {
      text: 'AI 学习进度分析',
      left: 'center'
    },
    tooltip: {
      trigger: 'axis',
      formatter: (params: any) => {
        const data = params[0]
        return `${data.name}<br/>${data.value.toFixed(2)}秒`
      }
    },
    xAxis: {
      type: 'category',
      data: wordLabels,
      axisLabel: {
        interval: 0,
        rotate: 45
      }
    },
    yAxis: {
      type: 'value',
      name: '响应时间 (秒)'
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
      markPoint: {
        data: [
          { type: 'min', name: '最快' },
          { type: 'max', name: '最慢' }
        ]
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
  if (!timeDistributionChart.value || !stat.value.data.wordsDetails?.length) return
  const chart = echarts.init(timeDistributionChart.value)
  
  const timeRanges = [
    '0-2秒', '2-5秒', '5-10秒', '10秒+'
  ]
  
  const timeData = stat.value.data.wordsDetails.reduce((acc: number[], word) => {
    const seconds = word.timeSpent / 1000
    if (seconds <= 2) acc[0]++
    else if (seconds <= 5) acc[1]++
    else if (seconds <= 10) acc[2]++
    else acc[3]++
    return acc
  }, [0, 0, 0, 0])
  
  const option: EChartsOption = {
    title: {
      text: 'AI 反应时间分布',
      left: 'center'
    },
    tooltip: {
      trigger: 'item',
      formatter: '{b}: {c}个词 ({d}%)'
    },
    legend: {
      orient: 'vertical',
      left: 'left',
      top: 'middle'
    },
    series: [{
      name: '反应时间分布',
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
      },
      label: {
        show: true,
        formatter: '{b}: {d}%'
      }
    }]
  }
  
  chart.setOption(option)
}

const initPerformanceRadarChart = () => {
  if (!performanceRadarChart.value || !stat.value.data.wordsDetails?.length) return
  const chart = echarts.init(performanceRadarChart.value)
  
  const data = stat.value.data
  const correctRate = data.correctRate || 0
  const averageTimePerWord = data.averageTimePerWord || 0
  const wordsDetails = data.wordsDetails || []
  const sessionDuration = data.sessionDuration || 0

  // 优化评分算法，避免极端值
  const normalizeScore = (value: number) => {
    return Math.max(40, Math.min(95, value)) // 将分数限制在40-95之间
  }

  const memoryScore = normalizeScore(correctRate * 100)
  const speedScore = normalizeScore(Math.min(100, 8000 / averageTimePerWord))
  const accuracyScore = normalizeScore(correctRate * 100)
  const efficiencyScore = normalizeScore(Math.min(100, wordsDetails.length / (sessionDuration / 60000) * 8))
  const connectionScore = normalizeScore(wordsDetails.filter(w => w.attempts === 1).length / wordsDetails.length * 100)

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
      ],
      splitArea: {
        areaStyle: {
          color: ['rgba(126,87,194,0.1)', 'rgba(126,87,194,0.2)', 'rgba(126,87,194,0.3)', 'rgba(126,87,194,0.4)', 'rgba(126,87,194,0.5)']
        }
      }
    },
    tooltip: {
      trigger: 'item',
      formatter: (params: any) => {
        const value = params.value
        return `${params.name}<br/>
          记忆力: ${value[0].toFixed(1)}分<br/>
          反应速度: ${value[1].toFixed(1)}分<br/>
          准确度: ${value[2].toFixed(1)}分<br/>
          学习效率: ${value[3].toFixed(1)}分<br/>
          知识关联: ${value[4].toFixed(1)}分`
      }
    },
    series: [{
      type: 'radar',
      data: [{
        value: [
          memoryScore,
          speedScore,
          accuracyScore,
          efficiencyScore,
          connectionScore
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
  margin-bottom: 24px;
}

.chart-wrapper {
  background: rgba(255, 255, 255, 0.1);
  border-radius: 16px;
  padding: 16px;
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  transition: all 0.3s ease;
}

.chart-wrapper:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.1);
}

.chart {
  height: 280px;
}

.chart-analysis {
  margin-top: 12px;
  padding: 8px 16px;
  background: rgba(126,87,194,0.1);
  border-radius: 8px;
  font-size: 14px;
  color: var(--el-text-color-regular);
}

.chart-analysis p {
  margin: 0;
  line-height: 1.5;
}

.footer {
  margin-top: 24px;
  padding: 16px;
  text-align: center;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
}

.brand {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  margin-bottom: 12px;
}

.brand h1 {
  font-size: 20px;
  font-weight: 600;
  background: linear-gradient(45deg, #7e57c2, #2196f3);
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
}

.disclaimer {
  font-size: 12px;
  color: var(--el-text-color-secondary);
  line-height: 1.4;
}

.disclaimer p {
  margin: 2px 0;
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