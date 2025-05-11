<script setup lang="ts">
import { computed } from 'vue';
import * as echarts from 'echarts';
import { onMounted, onBeforeUnmount, ref } from 'vue';
import { isDark } from '~/composables/theme';

const props = defineProps<{
  wordsDetails: any[];
}>();

// 图表DOM引用
const timePatternChart = ref<HTMLElement | null>(null);
const wordTypeChart = ref<HTMLElement | null>(null);

// 保存图表实例
let timeChart: echarts.ECharts | null = null;
let typeChart: echarts.ECharts | null = null;

// 计算听写和例句数据
const dictationWords = computed(() => props.wordsDetails.filter(w => w.type === 'dictation'));
const exampleWords = computed(() => props.wordsDetails.filter(w => w.type === 'example'));

// 计算正确率
const dictationCorrectRate = computed(() => {
  if (!dictationWords.value.length) {
    return 0;
  }
  return dictationWords.value.filter(w => w.isCorrect).length / dictationWords.value.length;
});

const exampleCorrectRate = computed(() => {
  if (!exampleWords.value.length) {
    return 0;
  }
  return exampleWords.value.filter(w => w.isCorrect).length / exampleWords.value.length;
});

// 计算各个时间段的数量
const getTimeDistribution = () => {
  // 初始化时间段计数对象
  const timeDistribution = {
    // 听写单词在各时间段的数量
    dictation: {
      '0-3秒': 0,
      '3-5秒': 0,
      '5-10秒': 0,
      '10秒以上': 0
    },
    // 例句单词在各时间段的数量
    example: {
      '0-3秒': 0,
      '3-5秒': 0,
      '5-10秒': 0,
      '10秒以上': 0
    }
  };

  // 统计听写单词
  dictationWords.value.forEach(word => {
    const timeSpent = word.timeSpent;
    if (timeSpent <= 3000) {
      timeDistribution.dictation['0-3秒']++;
    } else if (timeSpent <= 5000) {
      timeDistribution.dictation['3-5秒']++;
    } else if (timeSpent <= 10000) {
      timeDistribution.dictation['5-10秒']++;
    } else {
      timeDistribution.dictation['10秒以上']++;
    }
  });

  // 统计例句单词
  exampleWords.value.forEach(word => {
    const timeSpent = word.timeSpent;
    if (timeSpent <= 3000) {
      timeDistribution.example['0-3秒']++;
    } else if (timeSpent <= 5000) {
      timeDistribution.example['3-5秒']++;
    } else if (timeSpent <= 10000) {
      timeDistribution.example['5-10秒']++;
    } else {
      timeDistribution.example['10秒以上']++;
    }
  });

  return timeDistribution;
};

// 初始化时间模式图表
const initTimePatternChart = () => {
  if (!timePatternChart.value) {
    return;
  }

  // 处理深色模式
  const textColor = isDark.value ? '#ffffff' : '#333333';
  const timeDistribution = getTimeDistribution();

  timeChart = echarts.init(timePatternChart.value);

  const option = {
    title: {
      text: '反应时间分布',
      left: 'center',
      textStyle: {
        color: textColor
      }
    },
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'shadow'
      }
    },
    legend: {
      data: ['听写', '例句'],
      bottom: '0%',
      textStyle: {
        color: textColor
      }
    },
    grid: {
      left: '3%',
      right: '4%',
      bottom: '15%',
      top: '15%',
      containLabel: true
    },
    xAxis: {
      type: 'category',
      data: ['0-3秒', '3-5秒', '5-10秒', '10秒以上'],
      axisLine: {
        lineStyle: {
          color: textColor
        }
      },
      axisLabel: {
        color: textColor
      }
    },
    yAxis: {
      type: 'value',
      minInterval: 1,
      axisLine: {
        lineStyle: {
          color: textColor
        }
      },
      axisLabel: {
        color: textColor
      },
      splitLine: {
        lineStyle: {
          color: 'rgba(128, 128, 128, 0.2)'
        }
      }
    },
    series: [
      {
        name: '听写',
        type: 'bar',
        data: [
          timeDistribution.dictation['0-3秒'],
          timeDistribution.dictation['3-5秒'],
          timeDistribution.dictation['5-10秒'],
          timeDistribution.dictation['10秒以上']
        ],
        itemStyle: {
          color: '#7e57c2'
        }
      },
      {
        name: '例句',
        type: 'bar',
        data: [
          timeDistribution.example['0-3秒'],
          timeDistribution.example['3-5秒'],
          timeDistribution.example['5-10秒'],
          timeDistribution.example['10秒以上']
        ],
        itemStyle: {
          color: '#2196f3'
        }
      }
    ]
  };

  timeChart.setOption(option);
};

// 初始化单词类型图表
const initWordTypeChart = () => {
  if (!wordTypeChart.value) {
    return;
  }

  // 处理深色模式
  const textColor = isDark.value ? '#ffffff' : '#333333';

  // 准备数据
  const dictCorrect = dictationWords.value.filter(w => w.isCorrect).length;
  const dictIncorrect = dictationWords.value.length - dictCorrect;
  const exampleCorrect = exampleWords.value.filter(w => w.isCorrect).length;
  const exampleIncorrect = exampleWords.value.length - exampleCorrect;

  typeChart = echarts.init(wordTypeChart.value);

  const option = {
    title: {
      text: '听力掌握情况',
      left: 'center',
      textStyle: {
        color: textColor
      }
    },
    tooltip: {
      trigger: 'item',
      formatter: '{a} <br/>{b}: {c} ({d}%)'
    },
    legend: {
      orient: 'vertical',
      left: 10,
      top: 'center',
      data: ['听写正确', '听写错误', '例句正确', '例句错误'],
      textStyle: {
        color: textColor
      }
    },
    series: [
      {
        name: '学习情况',
        type: 'pie',
        radius: ['40%', '70%'],
        avoidLabelOverlap: false,
        itemStyle: {
          borderRadius: 10,
          borderWidth: 2
        },
        label: {
          show: false,
          position: 'center'
        },
        emphasis: {
          label: {
            show: true,
            fontSize: 14,
            fontWeight: 'bold',
            color: textColor
          }
        },
        labelLine: {
          show: false
        },
        data: [
          { value: dictCorrect, name: '听写正确', itemStyle: { color: '#4caf50' } },
          { value: dictIncorrect, name: '听写错误', itemStyle: { color: '#f44336' } },
          { value: exampleCorrect, name: '例句正确', itemStyle: { color: '#2196f3' } },
          { value: exampleIncorrect, name: '例句错误', itemStyle: { color: '#ff9800' } }
        ]
      }
    ]
  };

  typeChart.setOption(option);
};

// 获取学习模式分析
const getLearningPatternAnalysis = computed(() => {
  if (!props.wordsDetails.length) {
    return '需要更多数据进行学习模式分析';
  }

  const timeDistribution = getTimeDistribution();
  const dictQuickResponses = timeDistribution.dictation['0-3秒'] + timeDistribution.dictation['3-5秒'];
  const dictSlowResponses = timeDistribution.dictation['5-10秒'] + timeDistribution.dictation['10秒以上'];
  const exampleQuickResponses = timeDistribution.example['0-3秒'] + timeDistribution.example['3-5秒'];
  const exampleSlowResponses = timeDistribution.example['5-10秒'] + timeDistribution.example['10秒以上'];

  if (dictQuickResponses > dictSlowResponses && exampleQuickResponses > exampleSlowResponses) {
    return '你的学习模式显示听力反应速度快，继续保持这种高效学习节奏。';
  } else if (dictQuickResponses <= dictSlowResponses && exampleQuickResponses <= exampleSlowResponses) {
    return '听力反应时间较长，建议增加基础听力训练，提高音形关联速度。';
  } else if (dictQuickResponses > dictSlowResponses && exampleQuickResponses <= exampleSlowResponses) {
    return '单词听写能力较强，但例句理解需要提高，建议多练习上下文理解。';
  } else {
    return '例句理解较好，但单词听写反应较慢，建议强化单词音形对应关系。';
  }
});

// 监听深色模式变化，更新图表
watch(isDark, () => {
  if (timeChart || typeChart) {
    setTimeout(() => {
      // 销毁并重新创建图表
      if (timeChart) {
        timeChart.dispose();
        timeChart = null;
      }
      if (typeChart) {
        typeChart.dispose();
        typeChart = null;
      }

      initTimePatternChart();
      initWordTypeChart();
    }, 200);
  }
});

// 组件挂载时初始化图表
onMounted(() => {
  nextTick(() => {
    initTimePatternChart();
    initWordTypeChart();

    // 添加窗口大小变化监听
    window.addEventListener('resize', handleResize);
  });
});

// 组件卸载前清理资源
onBeforeUnmount(() => {
  if (timeChart) {
    timeChart.dispose();
    timeChart = null;
  }
  if (typeChart) {
    typeChart.dispose();
    typeChart = null;
  }

  window.removeEventListener('resize', handleResize);
});

// 处理窗口大小变化
const handleResize = () => {
  if (timeChart) {
    timeChart.resize();
  }
  if (typeChart) {
    typeChart.resize();
  }
};
</script>

<template>
  <div class="learning-pattern">
    <h3 class="section-title"><span class="ai-badge">AI</span> 学习模式分析</h3>

    <div class="pattern-insight">
      <div class="insight-icon">
        <div class="i-carbon-chart-evaluation" />
      </div>
      <p>{{ getLearningPatternAnalysis }}</p>
    </div>

    <div class="charts-grid">
      <div class="chart-container">
        <div ref="timePatternChart" class="chart"></div>
      </div>
      <div class="chart-container">
        <div ref="wordTypeChart" class="chart"></div>
      </div>
    </div>

    <div class="pattern-tips">
      <h4>听力学习模式改进建议</h4>
      <ul class="tips-list">
        <li><span class="tip-marker">快速反应</span> 通过大量重复练习，建立听觉与拼写的神经通路，提高反应速度</li>
        <li><span class="tip-marker">理解记忆</span> 通过多个例句中理解单词，在语境中记忆更加牢固</li>
        <li><span class="tip-marker">混合模式</span> 结合单词听写和例句理解，形成完整的听力学习闭环</li>
      </ul>
    </div>
  </div>
</template>

<style scoped>
.learning-pattern {
  padding: 24px;
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.section-title {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  font-size: 1.25rem;
  font-weight: 600;
  color: var(--color-text-primary, #2c3e50);
  margin-bottom: 8px;
  text-align: center;
  padding-bottom: 12px;
  border-bottom: 1px solid var(--color-border-subtle, #e5e7eb);
}

.ai-badge {
  background: linear-gradient(45deg, #7e57c2, #2196f3);
  color: white;
  font-size: 0.75rem;
  padding: 2px 6px;
  border-radius: 4px;
  font-weight: bold;
}

.pattern-insight {
  display: flex;
  align-items: center;
  background: rgba(126, 87, 194, 0.08);
  padding: 16px;
  border-radius: 12px;
  gap: 16px;
}

.insight-icon {
  width: 48px;
  height: 48px;
  min-width: 48px;
  background: linear-gradient(45deg, #7e57c2, #2196f3);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 1.5rem;
}

.pattern-insight p {
  margin: 0;
  font-size: 1rem;
  line-height: 1.6;
  color: var(--color-text-primary, #2c3e50);
}

.charts-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 20px;
}

.chart-container {
  background-color: var(--color-background-mute, rgba(255, 255, 255, 0.05));
  border-radius: 12px;
  padding: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  height: 300px;
}

.chart {
  height: 100%;
  width: 100%;
}

.pattern-tips {
  background-color: rgba(33, 150, 243, 0.05);
  padding: 16px;
  border-radius: 12px;
  border-left: 4px solid #2196f3;
}

.pattern-tips h4 {
  margin: 0 0 12px 0;
  font-size: 1.1rem;
  color: #1976d2;
}

.tips-list {
  list-style-type: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.tips-list li {
  display: flex;
  align-items: flex-start;
  font-size: 0.95rem;
  line-height: 1.5;
  color: var(--color-text-secondary, #555e6d);
}

.tip-marker {
  background-color: rgba(33, 150, 243, 0.15);
  color: #1976d2;
  padding: 2px 6px;
  border-radius: 4px;
  font-size: 0.8rem;
  font-weight: 600;
  margin-right: 8px;
  white-space: nowrap;
}

@media (max-width: 640px) {
  .learning-pattern {
    padding: 16px;
    gap: 16px;
  }

  .section-title {
    font-size:
    1.1rem;
  }

  .pattern-insight {
    padding: 12px;
    gap: 12px;
  }

  .insight-icon {
    width: 40px;
    height: 40px;
    min-width: 40px;
    font-size: 1.2rem;
  }

  .pattern-insight p {
    font-size: 0.9rem;
  }

  .charts-grid {
    grid-template-columns: 1fr;
  }

  .chart-container {
    height: 250px;
  }

  .pattern-tips h4 {
    font-size: 1rem;
  }

  .tips-list li {
    font-size: 0.85rem;
  }
}
</style>
