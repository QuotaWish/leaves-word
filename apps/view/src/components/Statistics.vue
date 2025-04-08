<template>
  <div class="statistics-container">
    <div class="statistics-header">
      <h2>{{ name }}</h2>
      <p>{{ description }}</p>
    </div>

    <div class="statistics-content">
      <div class="stat-item">
        <div class="stat-label">总学习时间</div>
        <div class="stat-value">{{ formatTime(data.totalTime) }}</div>
      </div>

      <div class="stat-item">
        <div class="stat-label">总单词数</div>
        <div class="stat-value">{{ data.totalWords }}</div>
      </div>

      <div class="stat-item">
        <div class="stat-label">正确率</div>
        <div class="stat-value">{{ formatAccuracy(data.accuracy) }}</div>
      </div>

      <template v-if="data.customData">
        <div v-for="(value, key) in data.customData" :key="key" class="stat-item">
          <div class="stat-label">{{ key }}</div>
          <div class="stat-value">{{ value }}</div>
        </div>
      </template>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { IStatisticsData } from '../modules/words/mode'

defineProps<{
  name: string
  description: string
  data: IStatisticsData
}>()

function formatTime(ms: number): string {
  const seconds = Math.floor(ms / 1000)
  const minutes = Math.floor(seconds / 60)
  const hours = Math.floor(minutes / 60)

  if (hours > 0) {
    return `${hours}小时 ${minutes % 60}分钟`
  }
  if (minutes > 0) {
    return `${minutes}分钟 ${seconds % 60}秒`
  }
  return `${seconds}秒`
}

function formatAccuracy(accuracy: number): string {
  return `${(accuracy * 100).toFixed(1)}%`
}
</script>

<style scoped>
.statistics-container {
  padding: 1rem;
  border-radius: 8px;
  background-color: var(--el-bg-color);
  box-shadow: var(--el-box-shadow-light);
}

.statistics-header {
  margin-bottom: 1.5rem;
  text-align: center;
}

.statistics-header h2 {
  margin: 0;
  color: var(--el-text-color-primary);
  font-size: 1.5rem;
}

.statistics-header p {
  margin: 0.5rem 0 0;
  color: var(--el-text-color-secondary);
}

.statistics-content {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
}

.stat-item {
  padding: 1rem;
  border-radius: 6px;
  background-color: var(--el-bg-color-page);
  text-align: center;
}

.stat-label {
  color: var(--el-text-color-secondary);
  font-size: 0.9rem;
  margin-bottom: 0.5rem;
}

.stat-value {
  color: var(--el-text-color-primary);
  font-size: 1.25rem;
  font-weight: 600;
}
</style>
