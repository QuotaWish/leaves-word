import { ref, computed } from 'vue'
import * as echarts from 'echarts'
import type { EChartsOption } from 'echarts'

interface ChartProps {
  correctRate: number
  averageTimePerWord: number
  sessionDuration: number
  wordsDetails: any[]
}

export function useCharts(props: ChartProps) {
  // 学习曲线分析
  const getLearningCurveAnalysis = () => {
    if (!props.wordsDetails?.length) return '暂无数据'

    const times = props.wordsDetails.map(w => w.timeSpent / 1000)
    const avg = times.reduce((a, b) => a + b, 0) / times.length
    const trend = times.slice(-3).reduce((a, b) => a + b, 0) / 3

    if (trend < avg * 0.8) return '学习曲线呈下降趋势，表现越来越好！'
    if (trend > avg * 1.2) return '近期响应时间略有上升，建议适当放慢节奏。'
    return '学习曲线平稳，保持良好的学习状态。'
  }

  // 时间分布分析
  const getTimeDistributionAnalysis = () => {
    if (!props.wordsDetails?.length) return '暂无数据'

    const times = props.wordsDetails.map(w => w.timeSpent / 1000)
    const fastCount = times.filter(t => t <= 2).length
    const fastRate = (fastCount / times.length * 100).toFixed(1)

    return `快速反应（≤2秒）占比${fastRate}%，整体掌握程度良好。`
  }

  // 能力评估分析
  const getPerformanceAnalysis = () => {
    if (!props.wordsDetails?.length) return '暂无数据'

    const scores = [
      props.correctRate * 100,
      Math.min(100, 10000 / props.averageTimePerWord),
      props.correctRate * 100,
      Math.min(100, props.wordsDetails.length / (props.sessionDuration / 60000) * 10),
      Math.min(100, props.wordsDetails.filter(w => w.attempts === 1).length / props.wordsDetails.length * 100)
    ]

    const avgScore = scores.reduce((a, b) => a + b, 0) / scores.length
    return `综合评分${avgScore.toFixed(1)}分，${avgScore >= 80 ? '表现优秀' : avgScore >= 60 ? '表现良好' : '仍有提升空间'}。`
  }

  // 初始化学习进度分析图表
  const initLearningPatternChart = (chartElement: HTMLElement | null) => {
    if (!chartElement || !props.wordsDetails?.length) return
    const chart = echarts.init(chartElement)

    const timeData = props.wordsDetails.map(word => word.timeSpent / 1000)
    const wordLabels = props.wordsDetails.map(word => word.word)

    // 从计算样式中获取颜色变量值
    const textColor = getComputedStyle(chartElement).getPropertyValue('--chart-text-color').trim() || '#000'

    const option: EChartsOption = {
      title: {
        text: '单词耗时分析',
        left: 'center',
        textStyle: {
          color: textColor
        }
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
          rotate: 45,
          color: textColor
        },
        axisLine: {
          lineStyle: {
            color: textColor
          }
        }
      },
      yAxis: {
        type: 'value',
        name: '响应时间 (秒)',
        nameTextStyle: {
          color: textColor
        },
        axisLabel: {
          color: textColor
        },
        splitLine: {
          lineStyle: {
            color: textColor,
            opacity: 0.1
          }
        }
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

    // 监听窗口大小变化，重绘图表
    window.addEventListener('resize', () => chart.resize())

    return chart
  }

  // 初始化反应时间分布图表
  const initTimeDistributionChart = (chartElement: HTMLElement | null) => {
    if (!chartElement || !props.wordsDetails?.length) return
    const chart = echarts.init(chartElement)

    const timeRanges = [
      '0-2秒', '2-5秒', '5-10秒', '10秒+'
    ]

    const timeData = props.wordsDetails.reduce((acc: number[], word) => {
      const seconds = word.timeSpent / 1000
      if (seconds <= 2) acc[0]++
      else if (seconds <= 5) acc[1]++
      else if (seconds <= 10) acc[2]++
      else acc[3]++
      return acc
    }, [0, 0, 0, 0])

    // 从计算样式中获取颜色变量值
    const textColor = getComputedStyle(chartElement).getPropertyValue('--chart-text-color').trim() || '#000'

    const option: EChartsOption = {
      title: {
        text: '',
        left: 'center',
        textStyle: {
          color: textColor
        }
      },
      tooltip: {
        trigger: 'item',
        formatter: '{b}: {c}个词 ({d}%)'
      },
      legend: {
        orient: 'vertical',
        left: 'left',
        top: 'middle',
        textStyle: {
          color: textColor
        }
      },
      series: [{
        name: '',
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
          formatter: '{b}: {d}%',
          color: textColor
        }
      }]
    }

    chart.setOption(option)

    // 监听窗口大小变化，重绘图表
    window.addEventListener('resize', () => chart.resize())

    return chart
  }

  // 初始化学习能力评估图表
  const initPerformanceRadarChart = (chartElement: HTMLElement | null) => {
    if (!chartElement || !props.wordsDetails?.length) return
    const chart = echarts.init(chartElement)

    // 优化评分算法，避免极端值
    const normalizeScore = (value: number) => {
      return Math.max(40, Math.min(95, value)) // 将分数限制在40-95之间
    }

    const memoryScore = normalizeScore(props.correctRate * 100)
    const speedScore = normalizeScore(Math.min(100, 8000 / props.averageTimePerWord))
    const accuracyScore = normalizeScore(props.correctRate * 100)
    const efficiencyScore = normalizeScore(Math.min(100, props.wordsDetails.length / (props.sessionDuration / 60000) * 8))
    const connectionScore = normalizeScore(props.wordsDetails.filter(w => w.attempts === 1).length / props.wordsDetails.length * 100)

    // 从计算样式中获取颜色变量值
    const textColor = getComputedStyle(chartElement).getPropertyValue('--chart-text-color').trim() || '#000'

    const option: EChartsOption = {
      title: {
        text: '',
        left: 'center',
        textStyle: {
          color: textColor
        }
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
        },
        axisName: {
          color: textColor
        },
        axisLine: {
          lineStyle: {
            color: textColor,
            opacity: 0.1
          }
        },
        splitLine: {
          lineStyle: {
            color: textColor,
            opacity: 0.1
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

    // 监听窗口大小变化，重绘图表
    window.addEventListener('resize', () => chart.resize())

    return chart
  }

  return {
    getLearningCurveAnalysis,
    getTimeDistributionAnalysis,
    getPerformanceAnalysis,
    initLearningPatternChart,
    initTimeDistributionChart,
    initPerformanceRadarChart
  }
}
