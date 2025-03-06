<template>
  <div class="w-full mb-6 bg-purple-100/8 rounded-4 backdrop-blur-sm border border-white/8 p-4 transition-all duration-300 hover:translate-y-[-2px] hover:shadow-lg hover:shadow-black/5 overflow-hidden">
    <h3 class="text-center text-base m-0 mb-5 text-gray-700 font-semibold tracking-wider relative pb-2.5 after:content-[''] after:absolute after:bottom-0 after:left-1/2 after:transform after:-translate-x-1/2 after:w-10 after:h-0.5 after:bg-gradient-to-r after:from-purple-500 after:to-blue-500 after:rounded-1">艾宾浩斯记忆曲线</h3>
    <div class="grid grid-cols-1 md:grid-cols-[55%_45%] gap-6 w-full max-w-full overflow-x-hidden">
      <div ref="ebbinghausChart" class="h-[260px] min-h-[200px] w-full max-w-full overflow-visible"></div>
      <div class="flex flex-col gap-5 w-full max-w-full overflow-visible">
        <div class="p-5 w-full bg-purple-100/8 rounded-3 shadow-sm shadow-black/3 border border-white/10">
          <div class="flex justify-between items-center mb-4 text-gray-500 text-sm">
            <span>记忆保留率</span>
            <span class="font-semibold text-lg bg-gradient-to-r from-purple-500 to-blue-500 bg-clip-text text-transparent">{{ memoryRetention }}%</span>
          </div>
          <div class="relative h-3 rounded-full overflow-hidden shadow-inner shadow-black/10">
            <div class="absolute top-0 left-0 w-full h-full bg-gray-200/15"></div>
            <div class="absolute top-0 left-0 h-full rounded-full transition-width duration-800 shadow-sm shadow-black/10 overflow-hidden" :style="{ width: `${memoryRetention}%`, background: memoryRetentionColor }">
              <div class="absolute -inset-1/2 bg-gradient-to-r from-white/0 via-white/20 to-white/0 animate-[glow_2s_ease-in-out_infinite] transform rotate-25"></div>
            </div>
          </div>
        </div>
        <!-- 引入推荐复习计划组件 -->
        <ReviewSchedule />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed, onUnmounted } from 'vue'
import * as echarts from 'echarts'
import type { EChartsOption } from 'echarts'
import ReviewSchedule from './ReviewSchedule.vue'

const ebbinghausChart = ref<HTMLElement | null>(null)
const memoryRetention = ref(78)
const memoryRetentionColor = computed(() => {
  if (memoryRetention.value < 50) return 'linear-gradient(90deg, #f56c6c, #fa9393)'
  if (memoryRetention.value < 70) return 'linear-gradient(90deg, #e6a23c, #f3d19e)'
  return 'linear-gradient(90deg, #67c23a, #95d475)'
})

const initEbbinghausChart = () => {
  if (!ebbinghausChart.value) return
  const chart = echarts.init(ebbinghausChart.value, null, {
    renderer: 'canvas',
    useDirtyRect: true
  })

  const hours = [0, 1, 2, 4, 8, 16, 24, 48, 72, 120, 240, 480, 720]

  // 艾宾浩斯记忆曲线数据
  const ebbinghausData = [
    100, 80, 70, 62, 54, 45, 40, 36, 33, 28, 25, 22, 20
  ]

  // 用户实际记忆曲线数据（模拟）
  const userMemoryData = [
    100, 82, 72, 65, 58, 50, 44, 40, 37, 32, 29, 27, 24
  ]

  const option: EChartsOption = {
    title: {
      text: '记忆保留曲线',
      left: 'center',
      textStyle: {
        fontSize: 14,
        fontWeight: 'normal',
        color: '#606266'
      }
    },
    tooltip: {
      trigger: 'axis',
      formatter: function (params: any) {
        const timeStr = params[0].name === '0'
          ? '学习时'
          : (parseInt(params[0].name) < 24
            ? `${params[0].name}小时后`
            : `${Math.floor(parseInt(params[0].name) / 24)}天后`);

        let result = timeStr + '<br/>';

        for (const param of params) {
          result += `${param.seriesName}: ${param.value}%<br/>`;
        }

        return result;
      }
    },
    legend: {
      data: ['标准记忆曲线', '你的记忆曲线'],
      bottom: 0,
      textStyle: {
        fontSize: 12
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
      boundaryGap: false,
      data: hours.map(h => h.toString()),
      axisLabel: {
        formatter: (value: string) => {
          const hour = parseInt(value);
          if (hour === 0) return '当前';
          if (hour < 24) return `${hour}小时`;
          return `${Math.floor(hour / 24)}天`;
        },
        fontSize: 10,
        hideOverlap: true,
        interval: 'auto'
      }
    },
    yAxis: {
      type: 'value',
      min: 0,
      max: 100,
      axisLabel: {
        formatter: '{value}%',
        fontSize: 10
      }
    },
    series: [
      {
        name: '标准记忆曲线',
        type: 'line',
        smooth: true,
        emphasis: {
          focus: 'series'
        },
        data: ebbinghausData,
        lineStyle: {
          width: 2,
          color: '#909399'
        },
        symbolSize: 4
      },
      {
        name: '你的记忆曲线',
        type: 'line',
        smooth: true,
        emphasis: {
          focus: 'series'
        },
        data: userMemoryData,
        lineStyle: {
          width: 3,
          color: '#7e57c2'
        },
        itemStyle: {
          color: '#7e57c2'
        },
        symbolSize: 6,
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
      }
    ]
  }

  chart.setOption(option)

  // 响应式调整
  const resizeHandler = () => {
    chart.resize()
  }

  window.addEventListener('resize', resizeHandler)

  // 添加清理函数
  onUnmounted(() => {
    window.removeEventListener('resize', resizeHandler)
    chart.dispose()
  })

  // 初始化后立即调整大小确保填充容器
  setTimeout(() => {
    resizeHandler()
  }, 0)
}

onMounted(() => {
  initEbbinghausChart()

  // 添加ResizeObserver监听容器大小变化
  if (ebbinghausChart.value && window.ResizeObserver) {
    const resizeObserver = new ResizeObserver(() => {
      if (ebbinghausChart.value) {
        const chart = echarts.getInstanceByDom(ebbinghausChart.value)
        if (chart) {
          chart.resize()
        }
      }
    })

    resizeObserver.observe(ebbinghausChart.value)

    // 同时观察父容器的变化
    const parentElement = ebbinghausChart.value.parentElement
    if (parentElement) {
      resizeObserver.observe(parentElement)
    }

    onUnmounted(() => {
      resizeObserver.disconnect()
    })
  }

  // 立即触发一次resize确保图表正确绘制
  setTimeout(() => {
    if (ebbinghausChart.value) {
      const chart = echarts.getInstanceByDom(ebbinghausChart.value)
      if (chart) {
        chart.resize()
      }
    }
  }, 300)
})
</script>

<style scoped>
@keyframes glow {
  0% {
    transform: translateX(-100%) rotate(25deg);
  }
  100% {
    transform: translateX(100%) rotate(25deg);
  }
}
</style>