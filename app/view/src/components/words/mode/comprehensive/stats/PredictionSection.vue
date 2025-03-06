<template>
  <div class="ai-prediction-section">
    <h3 class="section-title">AI学习预测</h3>
    <div class="prediction-content">
      <div v-if="hasData" ref="predictionChart" class="prediction-chart"></div>
      <div v-else class="empty-prediction">
        <div class="empty-chart-icon">
          <svg width="48" height="48" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M3 12h4v8H3v-8zm7-5h4v13h-4V7zm7-5h4v18h-4V2z" stroke="rgba(126, 87, 194, 0.7)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        </div>
        <p>学习数据不足，开始学习后将自动生成AI预测分析</p>
      </div>
      <div class="prediction-analysis">
        <p>{{ getPredictionAnalysis() }}</p>
        <div class="prediction-accuracy">
          <span>AI预测准确率: </span>
          <div class="custom-progress">
            <div class="progress-track"></div>
            <div class="progress-fill" :style="{width: `${predictAccuracy}%`, background: predictAccuracyColor}"></div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed, onBeforeUnmount } from 'vue'
import * as echarts from 'echarts'
import type { EChartsOption } from 'echarts'
import { ElProgress } from 'element-plus'

const props = defineProps<{
  correctRate: number
  wordsDetails: any[]
}>()

const predictionChart = ref<HTMLElement | null>(null)
const predictAccuracy = ref(87)
let chart: echarts.ECharts | null = null

// 判断是否有足够的数据进行预测
const hasData = computed(() => {
  return props.wordsDetails && props.wordsDetails.length >= 5
})

const predictAccuracyColor = computed(() => {
  if (predictAccuracy.value < 60) return 'linear-gradient(90deg, #f56c6c, #fa9393)'
  if (predictAccuracy.value < 80) return 'linear-gradient(90deg, #e6a23c, #f3d19e)'
  return 'linear-gradient(90deg, #67c23a, #95d475)'
})

const getPredictionAnalysis = () => {
  if (!hasData.value) return '学习数据不足，暂无预测分析'
  
  return 'AI预测如果您保持当前学习频率，预计在14天内词汇量将提升32%，词汇反应速度提升18%。建议增加学习频率以达到更好效果。'
}

const initPredictionChart = () => {
  if (!predictionChart.value || !hasData.value) return
  
  // 销毁之前的图表实例
  if (chart) {
    chart.dispose()
  }
  
  // 创建新图表
  chart = echarts.init(predictionChart.value)
  
  const days = ['今天', '3天后', '7天后', '14天后', '30天后']
  // 模拟预测数据
  const currentRate = props.correctRate * 100
  const predictedRates = [
    currentRate,
    Math.min(100, currentRate * 1.1),
    Math.min(100, currentRate * 1.2),
    Math.min(100, currentRate * 1.35),
    Math.min(100, currentRate * 1.5)
  ]
  
  const option: EChartsOption = {
    title: {
      text: 'AI学习成效预测',
      left: 'center',
      textStyle: {
        fontSize: 14,
        fontWeight: 'normal',
        color: 'var(--el-text-color-regular)'
      }
    },
    tooltip: {
      trigger: 'axis',
      formatter: function(params: any) {
        return `${params[0].name}<br/>${params[0].seriesName}: ${params[0].value.toFixed(1)}%`
      }
    },
    grid: {
      left: '3%',
      right: '4%',
      top: '15%',
      bottom: '10%',
      containLabel: true
    },
    xAxis: {
      type: 'category',
      data: days,
      axisLabel: {
        fontSize: 10,
        color: 'var(--el-text-color-regular)'
      },
      axisLine: {
        lineStyle: {
          color: 'var(--el-border-color)'
        }
      }
    },
    yAxis: {
      type: 'value',
      name: '预测正确率',
      max: 100,
      axisLabel: {
        formatter: '{value}%',
        fontSize: 10,
        color: 'var(--el-text-color-regular)'
      },
      splitLine: {
        lineStyle: {
          color: 'var(--el-border-color-lighter)'
        }
      }
    },
    series: [{
      name: '预测正确率',
      type: 'line',
      data: predictedRates,
      smooth: true,
      symbol: 'circle',
      symbolSize: 6,
      itemStyle: {
        color: '#7e57c2'
      },
      lineStyle: {
        width: 3,
        color: '#7e57c2'
      },
      areaStyle: {
        opacity: 0.1,
        color: {
          type: 'linear',
          x: 0,
          y: 0,
          x2: 0,
          y2: 1,
          colorStops: [
            {
              offset: 0,
              color: 'rgba(126, 87, 194, 0.2)'
            },
            {
              offset: 1,
              color: 'rgba(126, 87, 194, 0.05)'
            }
          ]
        }
      }
    }]
  }
  
  chart.setOption(option)
  
  // 响应式调整
  const resizeHandler = () => {
    if (chart) chart.resize()
  }
  
  window.addEventListener('resize', resizeHandler)
  
  // 返回清理函数
  return () => {
    window.removeEventListener('resize', resizeHandler)
  }
}

onMounted(() => {
  // 延迟初始化以确保DOM已渲染
  setTimeout(() => {
    initPredictionChart()
  }, 300)
})

onBeforeUnmount(() => {
  // 清理图表资源
  if (chart) {
    chart.dispose()
    chart = null
  }
})
</script>

<style scoped>
.ai-prediction-section {
  margin-bottom: 24px;
  background: rgba(126, 87, 194, 0.08);
  border-radius: 16px;
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.08);
  padding: 16px;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.ai-prediction-section:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.05);
}

.section-title {
  text-align: center;
  font-size: 16px;
  margin: 0 0 20px;
  color: var(--el-text-color-primary);
  font-weight: 600;
  letter-spacing: 0.5px;
  position: relative;
  padding-bottom: 10px;
}

.section-title::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 50%;
  transform: translateX(-50%);
  width: 40px;
  height: 2px;
  background: linear-gradient(90deg, #7e57c2, #2196f3);
  border-radius: 2px;
}

.prediction-content {
  display: grid;
  grid-template-columns: 1fr;
  gap: 16px;
}

@media (min-width: 768px) {
  .prediction-content {
    grid-template-columns: 1fr 1fr;
  }
}

.prediction-chart {
  height: 240px;
  min-height: 200px;
  width: 100%;
}

.empty-prediction {
  height: 240px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  color: var(--el-text-color-secondary);
  text-align: center;
  padding: 20px;
  background: rgba(126, 87, 194, 0.05);
  border-radius: 12px;
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

.prediction-analysis {
  background: rgba(126, 87, 194, 0.08);
  padding: 16px;
  border-radius: 12px;
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.prediction-analysis p {
  font-size: 14px;
  line-height: 1.6;
  color: var(--el-text-color-regular);
  margin: 0 0 16px;
  font-weight: 500;
}

.prediction-accuracy {
  margin-top: 8px;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.prediction-accuracy span {
  white-space: nowrap;
  font-size: 13px;
  color: var(--el-text-color-regular);
}

.custom-progress {
  position: relative;
  height: 10px;
  border-radius: 5px;
  overflow: hidden;
}

.progress-track {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(100, 100, 100, 0.1);
}

.progress-fill {
  position: absolute;
  top: 0;
  left: 0;
  height: 100%;
  border-radius: 5px;
  transition: width 0.5s ease;
}

/* 暗黑模式适配 */
:root[data-theme='dark'] .ai-prediction-section {
  background: rgba(126, 87, 194, 0.15);
  border-color: rgba(255, 255, 255, 0.1);
}

:root[data-theme='dark'] .prediction-analysis,
:root[data-theme='dark'] .empty-prediction {
  background: rgba(126, 87, 194, 0.1);
}
</style> 