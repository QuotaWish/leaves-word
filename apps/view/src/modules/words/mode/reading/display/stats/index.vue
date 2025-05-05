<script setup lang="ts">
import type { Statistics } from '~/modules/words'

const props = defineProps<{
  stats: Statistics<any>
}>()

const emits = defineEmits<{
  (e: 'close'): void
}>()

const stats = computed(() => {
  return props.stats?.data || {}
})
</script>

<template>
  <div class="reading-stats-container">
    <div class="reading-stats-header">
      <h2>阅读分析模式统计</h2>
      <div class="close-button" @click="emits('close')">
        <div i-carbon-close />
      </div>
    </div>

    <div class="reading-stats-content">
      <div class="stats-card">
        <div class="stats-title">学习概览</div>
        <div class="stats-data">
          <div class="stats-item">
            <div class="stats-label">新学单词</div>
            <div class="stats-value">{{ stats.newWords || 0 }}</div>
          </div>
          <div class="stats-item">
            <div class="stats-label">复习单词</div>
            <div class="stats-value">{{ stats.reviewWords || 0 }}</div>
          </div>
          <div class="stats-item">
            <div class="stats-label">正确率</div>
            <div class="stats-value">{{ ((stats.correctRate || 0) * 100).toFixed(1) }}%</div>
          </div>
        </div>
      </div>

      <div class="stats-card">
        <div class="stats-title">时间统计</div>
        <div class="stats-data">
          <div class="stats-item">
            <div class="stats-label">学习时长</div>
            <div class="stats-value">{{ ((stats.sessionDuration || 0) / 1000 / 60).toFixed(1) }}分钟</div>
          </div>
          <div class="stats-item">
            <div class="stats-label">平均用时</div>
            <div class="stats-value">{{ ((stats.averageTimePerWord || 0) / 1000).toFixed(1) }}秒/词</div>
          </div>
        </div>
      </div>

      <div v-if="stats.wordsDetails && stats.wordsDetails.length > 0" class="stats-card">
        <div class="stats-title">单词详情</div>
        <div class="stats-table">
          <table>
            <thead>
              <tr>
                <th>单词</th>
                <th>状态</th>
                <th>尝试次数</th>
                <th>用时(秒)</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="word in stats.wordsDetails" :key="word.word">
                <td>{{ word.word }}</td>
                <td :class="{ 'correct': word.isCorrect, 'wrong': !word.isCorrect }">
                  {{ word.isCorrect ? '✓' : '✗' }}
                </td>
                <td>{{ word.attempts }}</td>
                <td>{{ (word.timeSpent / 1000).toFixed(1) }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.reading-stats-container {
  height: 100%;
  width: 100%;
  background-color: var(--el-bg-color);
  padding: 1rem;
  overflow-y: auto;
}

.reading-stats-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
  padding-bottom: 1rem;
  border-bottom: 1px solid var(--el-border-color-lighter);

  h2 {
    font-size: 1.5rem;
    color: var(--el-color-primary);
    margin: 0;
  }

  .close-button {
    font-size: 1.5rem;
    cursor: pointer;
    color: var(--el-text-color-secondary);

    &:hover {
      color: var(--el-text-color-primary);
    }
  }
}

.reading-stats-content {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.stats-card {
  background-color: var(--el-fill-color-blank);
  border-radius: 8px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.05);
  padding: 1rem;

  .stats-title {
    font-size: 1.1rem;
    font-weight: bold;
    margin-bottom: 1rem;
    color: var(--el-text-color-primary);
  }

  .stats-data {
    display: flex;
    flex-wrap: wrap;
    gap: 1rem;

    .stats-item {
      flex: 1;
      min-width: 100px;
      background-color: var(--el-fill-color-light);
      padding: 0.75rem;
      border-radius: 6px;
      display: flex;
      flex-direction: column;
      align-items: center;

      .stats-label {
        font-size: 0.9rem;
        color: var(--el-text-color-secondary);
        margin-bottom: 0.5rem;
      }

      .stats-value {
        font-size: 1.4rem;
        font-weight: bold;
        color: var(--el-color-primary);
      }
    }
  }

  .stats-table {
    width: 100%;
    overflow-x: auto;

    table {
      width: 100%;
      border-collapse: collapse;

      th, td {
        padding: 0.75rem;
        text-align: left;
        border-bottom: 1px solid var(--el-border-color-lighter);
      }

      th {
        font-weight: bold;
        color: var(--el-text-color-regular);
        background-color: var(--el-fill-color-light);
      }

      td {
        color: var(--el-text-color-primary);

        &.correct {
          color: var(--el-color-success);
        }

        &.wrong {
          color: var(--el-color-danger);
        }
      }
    }
  }
}
</style>
