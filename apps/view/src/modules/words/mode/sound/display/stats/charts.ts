import * as echarts from 'echarts'
import type { ECharts } from 'echarts'
import type { EChartsOption } from 'echarts'

interface ChartProps {
  wordsDetails?: any[]
  dictationCorrectRate?: number
  exampleCorrectRate?: number
  audioPlayCount?: number
  exampleStageStats?: Record<string, any>
  sessionDuration?: number
  dictationWords?: number
  exampleWords?: number
}

// 定义返回类型以避免类型错误
interface ChartFunctions {
  initCorrectRateChart: (chartElement: HTMLElement | null) => ECharts | null;
  initTimeDistributionChart: (chartElement: HTMLElement | null) => ECharts | null;
  initExampleStageChart: (chartElement: HTMLElement | null) => ECharts | null;
  initAudioUsageChart: (chartElement: HTMLElement | null) => ECharts | null;
  initSessionDurationChart: (chartElement: HTMLElement | null) => ECharts | null;
}

export function useCharts(props: ChartProps): ChartFunctions {
  // 获取单词详情数据
  const getWordsDetails = () => {
    return props.wordsDetails || []
  }

  // 获取听写和例句单词
  const getDictationWords = () => {
    return getWordsDetails().filter(w => w.type === 'dictation')
  }

  const getExampleWords = () => {
    return getWordsDetails().filter(w => w.type === 'example')
  }

  // 计算平均时间
  const getAvgTimePerWord = (type: 'dictation' | 'example') => {
    const words = type === 'dictation' ? getDictationWords() : getExampleWords()
    if (!words.length) return 0
    return words.reduce((sum, w) => sum + w.timeSpent, 0) / words.length
  }

  // 计算正确率
  const getCorrectRate = (type: 'dictation' | 'example') => {
    const words = type === 'dictation' ? getDictationWords() : getExampleWords()
    if (!words.length) return 0
    return words.filter(w => w.isCorrect).length / words.length
  }

  // 公共样式设置
  const getCommonStyles = (chartElement: HTMLElement) => {
    // 获取文本颜色，支持深色模式
    const textColor = getComputedStyle(chartElement).getPropertyValue('--chart-text-color').trim() || '#3c404d'

    // 主题色
    const primaryColor = '#7e57c2'
    const secondaryColor = '#2196f3'
    const tertiaryColor = '#00bcd4'
    const quaternaryColor = '#4caf50'

    return {
      textColor,
      colors: [primaryColor, secondaryColor, tertiaryColor, quaternaryColor],
      gradients: {
        primary: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
          { offset: 0, color: 'rgba(126, 87, 194, 0.8)' },
          { offset: 1, color: 'rgba(126, 87, 194, 0.2)' }
        ]),
        secondary: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
          { offset: 0, color: 'rgba(33, 150, 243, 0.8)' },
          { offset: 1, color: 'rgba(33, 150, 243, 0.2)' }
        ]),
        mixed: new echarts.graphic.LinearGradient(0, 0, 1, 1, [
          { offset: 0, color: 'rgba(126, 87, 194, 0.7)' },
          { offset: 1, color: 'rgba(33, 150, 243, 0.7)' }
        ])
      },
      axisStyle: {
        axisLine: {
          lineStyle: {
            color: textColor,
            opacity: 0.5
          }
        },
        axisLabel: {
          color: textColor
        },
        splitLine: {
          lineStyle: {
            color: 'rgba(128, 128, 128, 0.12)'
          }
        }
      }
    }
  }

  // 初始化正确率对比图表
  const initCorrectRateChart = (chartElement: HTMLElement | null): ECharts | null => {
    if (!chartElement) return null
    const chart = echarts.init(chartElement)

    const styles = getCommonStyles(chartElement)
    const dictationRate = props.dictationCorrectRate !== undefined ? props.dictationCorrectRate : getCorrectRate('dictation')
    const exampleRate = props.exampleCorrectRate !== undefined ? props.exampleCorrectRate : getCorrectRate('example')

    const option: EChartsOption = {
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'shadow'
        },
        backgroundColor: 'rgba(255, 255, 255, 0.8)',
        borderColor: 'rgba(126, 87, 194, 0.2)',
        borderWidth: 1,
        textStyle: {
          color: '#333'
        },
        formatter: (params: any) => {
          if (Array.isArray(params) && params.length > 0) {
            return `${params[0].name}: ${(params[0].value * 100).toFixed(1)}%`
          }
          return ''
        }
      },
      grid: {
        left: '3%',
        right: '4%',
        bottom: '3%',
        top: '15%',
        containLabel: true
      },
      xAxis: {
        type: 'category',
        data: ['听写', '例句'],
        ...styles.axisStyle
      },
      yAxis: {
        type: 'value',
        max: 1,
        ...styles.axisStyle,
        axisLabel: {
          ...styles.axisStyle.axisLabel,
          formatter: (value: number) => `${(value * 100).toFixed(0)}%`
        }
      },
      series: [
        {
          name: '正确率',
          type: 'bar',
          data: [dictationRate, exampleRate],
          itemStyle: {
            color: (params: any) => {
              // 使用渐变色
              return [styles.gradients.primary, styles.gradients.secondary][params.dataIndex]
            },
            borderRadius: [4, 4, 0, 0]
          },
          emphasis: {
            itemStyle: {
              opacity: 0.8,
              borderWidth: 1,
              borderColor: 'rgba(255, 255, 255, 0.2)'
            }
          },
          label: {
            show: true,
            position: 'top',
            color: styles.textColor,
            formatter: (params: any) => `${(params.value * 100).toFixed(1)}%`
          },
          barWidth: '50%'
        }
      ]
    }

    chart.setOption(option)
    return chart
  }

  // 初始化时间分布图表
  const initTimeDistributionChart = (chartElement: HTMLElement | null): ECharts | null => {
    if (!chartElement) return null
    const chart = echarts.init(chartElement)

    const styles = getCommonStyles(chartElement)
    const dictationAvgTime = getAvgTimePerWord('dictation')
    const exampleAvgTime = getAvgTimePerWord('example')

    const option: EChartsOption = {
      tooltip: {
        trigger: 'axis',
        backgroundColor: 'rgba(255, 255, 255, 0.8)',
        borderColor: 'rgba(126, 87, 194, 0.2)',
        borderWidth: 1,
        textStyle: {
          color: '#333'
        },
        formatter: (params: any) => {
          if (Array.isArray(params) && params.length > 0) {
            const time = params[0].value
            const seconds = Math.floor(time / 1000)
            const minutes = Math.floor(seconds / 60)
            const remainingSeconds = seconds % 60
            return `${params[0].name}: ${minutes}分${remainingSeconds}秒`
          }
          return ''
        }
      },
      grid: {
        left: '3%',
        right: '4%',
        bottom: '3%',
        top: '15%',
        containLabel: true
      },
      xAxis: {
        type: 'category',
        data: ['听写', '例句'],
        ...styles.axisStyle
      },
      yAxis: {
        type: 'value',
        ...styles.axisStyle,
        axisLabel: {
          ...styles.axisStyle.axisLabel,
          formatter: (value: number) => {
            const seconds = Math.floor(value / 1000)
            if (seconds < 60) {
              return `${seconds}秒`
            }
            const minutes = Math.floor(seconds / 60)
            const remainingSeconds = seconds % 60
            return `${minutes}分${remainingSeconds}秒`
          }
        }
      },
      series: [
        {
          name: '平均时间',
          type: 'bar',
          data: [dictationAvgTime, exampleAvgTime],
          itemStyle: {
            color: (params: any) => {
              return [styles.gradients.primary, styles.gradients.secondary][params.dataIndex]
            },
            borderRadius: [4, 4, 0, 0]
          },
          emphasis: {
            itemStyle: {
              opacity: 0.8,
              borderWidth: 1,
              borderColor: 'rgba(255, 255, 255, 0.2)'
            }
          },
          label: {
            show: true,
            position: 'top',
            color: styles.textColor,
            formatter: (params: any) => {
              const time = params.value
              const seconds = Math.floor(time / 1000)
              const minutes = Math.floor(seconds / 60)
              const remainingSeconds = seconds % 60
              return `${minutes}分${remainingSeconds}秒`
            }
          },
          barWidth: '50%'
        }
      ]
    }

    chart.setOption(option)
    return chart
  }

  // 初始化例句阶段统计图表
  const initExampleStageChart = (chartElement: HTMLElement | null): ECharts | null => {
    if (!chartElement || !props.exampleStageStats) return null
    const chart = echarts.init(chartElement)

    const styles = getCommonStyles(chartElement)
    const stageStats = props.exampleStageStats || {}
    const stageNames = ['关键词', '部分句子', '完整句子']
    const stageData = [0, 1, 2].map(stage => {
      const stats = stageStats[stage] || { attempts: 0, completed: 0 }
      return stats.attempts > 0 ? stats.completed / stats.attempts : 0
    })

    const option: EChartsOption = {
      tooltip: {
        trigger: 'item',
        backgroundColor: 'rgba(255, 255, 255, 0.8)',
        borderColor: 'rgba(126, 87, 194, 0.2)',
        borderWidth: 1,
        textStyle: {
          color: '#333'
        },
        formatter: (params: any) => {
          if (params.value !== undefined) {
            return `${params.name}: ${(params.value * 100).toFixed(1)}%`
          }
          return ''
        }
      },
      radar: {
        indicator: stageNames.map(name => ({ name, max: 1 })),
        splitNumber: 4,
        axisName: {
          color: styles.textColor,
          fontSize: 12
        },
        splitLine: {
          lineStyle: {
            color: 'rgba(128, 128, 128, 0.15)'
          }
        },
        splitArea: {
          show: true,
          areaStyle: {
            color: ['rgba(255, 255, 255, 0.02)', 'rgba(126, 87, 194, 0.02)']
          }
        },
        axisLine: {
          lineStyle: {
            color: 'rgba(128, 128, 128, 0.15)'
          }
        }
      },
      series: [
        {
          type: 'radar',
          data: [
            {
              value: stageData,
              name: '完成率',
              areaStyle: {
                color: styles.gradients.mixed
              },
              lineStyle: {
                width: 2,
                color: styles.colors[0]
              },
              symbol: 'circle',
              symbolSize: 6,
              itemStyle: {
                color: styles.colors[0]
              }
            }
          ]
        }
      ]
    }

    chart.setOption(option)
    return chart
  }

  // 初始化音频使用分析图表
  const initAudioUsageChart = (chartElement: HTMLElement | null): ECharts | null => {
    if (!chartElement) return null
    const chart = echarts.init(chartElement)

    const styles = getCommonStyles(chartElement)
    const wordsDetails = getWordsDetails()
    const totalWords = wordsDetails.length || 1
    const audioPlayCount = props.audioPlayCount || 0
    const avgPlaysPerWord = audioPlayCount / totalWords

    // 计算音频使用效率
    const totalAttempts = wordsDetails.reduce((sum, w) => sum + (w.attempts || 1), 0)
    const audioEfficiency = Math.min(totalAttempts / (audioPlayCount || 1), 1)

    const option: EChartsOption = {
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'shadow'
        },
        backgroundColor: 'rgba(255, 255, 255, 0.8)',
        borderColor: 'rgba(126, 87, 194, 0.2)',
        borderWidth: 1,
        textStyle: {
          color: '#333'
        }
      },
      grid: {
        left: '3%',
        right: '4%',
        bottom: '3%',
        top: '15%',
        containLabel: true
      },
      xAxis: {
        type: 'category',
        data: ['平均播放次数', '音频使用效率'],
        ...styles.axisStyle
      },
      yAxis: [
        {
          type: 'value',
          name: '次数',
          position: 'left',
          ...styles.axisStyle,
          axisLine: {
            lineStyle: {
              color: styles.colors[0],
              opacity: 0.5
            }
          },
          axisLabel: {
            ...styles.axisStyle.axisLabel,
            formatter: (value: number) => `${value.toFixed(1)}次`
          }
        },
        {
          type: 'value',
          name: '效率',
          position: 'right',
          min: 0,
          max: 1,
          ...styles.axisStyle,
          axisLine: {
            lineStyle: {
              color: styles.colors[1],
              opacity: 0.5
            }
          },
          axisLabel: {
            ...styles.axisStyle.axisLabel,
            formatter: (value: number) => `${(value * 100).toFixed(0)}%`
          },
          splitLine: {
            show: false
          }
        }
      ],
      series: [
        {
          name: '平均播放次数',
          type: 'bar',
          data: [avgPlaysPerWord],
          itemStyle: {
            color: styles.gradients.primary,
            borderRadius: [4, 4, 0, 0]
          },
          emphasis: {
            itemStyle: {
              opacity: 0.8,
              borderWidth: 1,
              borderColor: 'rgba(255, 255, 255, 0.2)'
            }
          },
          label: {
            show: true,
            position: 'top',
            color: styles.textColor,
            formatter: (params: any) => `${params.value.toFixed(1)}次`
          },
          barWidth: '50%',
          yAxisIndex: 0
        },
        {
          name: '音频使用效率',
          type: 'bar',
          data: [null, audioEfficiency],
          itemStyle: {
            color: styles.gradients.secondary,
            borderRadius: [4, 4, 0, 0]
          },
          emphasis: {
            itemStyle: {
              opacity: 0.8,
              borderWidth: 1,
              borderColor: 'rgba(255, 255, 255, 0.2)'
            }
          },
          label: {
            show: true,
            position: 'top',
            color: styles.textColor,
            formatter: (params: any) => `${(params.value * 100).toFixed(1)}%`
          },
          barWidth: '50%',
          yAxisIndex: 1
        }
      ]
    }

    chart.setOption(option)
    return chart
  }

  // 初始化学习时长分析图表
  const initSessionDurationChart = (chartElement: HTMLElement | null): ECharts | null => {
    if (!chartElement) return null
    const chart = echarts.init(chartElement)

    const styles = getCommonStyles(chartElement)
    const sessionDuration = props.sessionDuration || 0
    const dictationWords = props.dictationWords || 0
    const exampleWords = props.exampleWords || 0

    // 计算听写和例句练习的预估时长
    const dictationTimeEstimate = dictationWords * 10000 // 假设每个单词平均10秒
    const exampleTimeEstimate = exampleWords * 15000 // 假设每个例句平均15秒

    // 计算其他时间（包括预习、思考、准备等）
    const otherTime = Math.max(0, sessionDuration - dictationTimeEstimate - exampleTimeEstimate)

    const option: EChartsOption = {
      tooltip: {
        trigger: 'item',
        backgroundColor: 'rgba(255, 255, 255, 0.8)',
        borderColor: 'rgba(126, 87, 194, 0.2)',
        borderWidth: 1,
        textStyle: {
          color: '#333'
        },
        formatter: (params: any) => {
          const time = params.value
          const seconds = Math.floor(time / 1000)
          const minutes = Math.floor(seconds / 60)
          const remainingSeconds = seconds % 60
          return `${params.name}: ${minutes}分${remainingSeconds}秒 (${params.percent}%)`
        }
      },
      legend: {
        orient: 'horizontal',
        bottom: 10,
        data: ['听写练习', '例句练习', '其他时间'],
        textStyle: {
          color: styles.textColor
        }
      },
      series: [
        {
          name: '学习时间分布',
          type: 'pie',
          radius: ['40%', '70%'],
          center: ['50%', '50%'],
          avoidLabelOverlap: true,
          itemStyle: {
            borderColor: 'rgba(255, 255, 255, 0.1)',
            borderWidth: 2
          },
          label: {
            show: false
          },
          emphasis: {
            label: {
              show: true,
              fontSize: 14,
              fontWeight: 'bold',
              color: styles.textColor
            }
          },
          labelLine: {
            show: false
          },
          data: [
            {
              value: dictationTimeEstimate,
              name: '听写练习',
              itemStyle: { color: styles.colors[0] }
            },
            {
              value: exampleTimeEstimate,
              name: '例句练习',
              itemStyle: { color: styles.colors[1] }
            },
            {
              value: otherTime,
              name: '其他时间',
              itemStyle: { color: styles.colors[2] }
            }
          ]
        }
      ]
    }

    chart.setOption(option)
    return chart
  }

  return {
    initCorrectRateChart,
    initTimeDistributionChart,
    initExampleStageChart,
    initAudioUsageChart,
    initSessionDurationChart
  }
}
