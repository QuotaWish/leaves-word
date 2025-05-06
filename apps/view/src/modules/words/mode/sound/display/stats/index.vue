<template>
  <div class="sound-stats-container">
    <div class="stats-header">
      <h2 class="stats-title">音析模式学习统计</h2>
    </div>

    <div class="stats-content">
      <!-- 基本统计信息 -->
      <div class="stats-section">
        <h3 class="section-title">基本信息</h3>
        <div class="stats-grid">
          <div class="stat-item">
            <div class="stat-label">学习时长</div>
            <div class="stat-value">{{ formatDuration(statistics.data.sessionDuration || 0) }}</div>
          </div>

          <div class="stat-item">
            <div class="stat-label">听写单词数</div>
            <div class="stat-value">{{ statistics.data.dictationWords || 0 }}</div>
          </div>

          <div class="stat-item">
            <div class="stat-label">例句单词数</div>
            <div class="stat-value">{{ statistics.data.exampleWords || 0 }}</div>
          </div>

          <div class="stat-item">
            <div class="stat-label">音频播放次数</div>
            <div class="stat-value">{{ statistics.data.audioPlayCount || 0 }}</div>
          </div>
        </div>
      </div>

      <!-- 成绩统计 -->
      <div class="stats-section">
        <h3 class="section-title">学习成绩</h3>
        <div class="stats-grid">
          <div class="stat-item">
            <div class="stat-label">听写正确率</div>
            <div class="stat-value">{{ formatPercentage(statistics.data.dictationCorrectRate || 0) }}</div>
          </div>

          <div class="stat-item">
            <div class="stat-label">例句正确率</div>
            <div class="stat-value">{{ formatPercentage(statistics.data.exampleCorrectRate || 0) }}</div>
          </div>
        </div>
      </div>

      <!-- 阶段统计 -->
      <div v-if="hasExampleStats" class="stats-section">
        <h3 class="section-title">例句学习阶段</h3>
        <div class="stats-grid">
          <div class="stat-item" v-for="(value, key) in stageStats" :key="key">
            <div class="stat-label">{{ getStageName(Number(key)) }}</div>
            <div class="stat-value">{{ formatPercentage(value.completed / value.attempts) }}</div>
          </div>
        </div>
      </div>

      <!-- 词汇列表 -->
      <div v-if="hasWordDetails" class="stats-section">
        <h3 class="section-title">单词学习详情</h3>
        <div class="word-details-table">
          <table>
            <thead>
              <tr>
                <th>单词</th>
                <th>类型</th>
                <th>尝试次数</th>
                <th>用时</th>
                <th>结果</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(detail, index) in wordDetails" :key="index">
                <td>{{ detail.word }}</td>
                <td>{{ getTypeLabel(detail.type) }}</td>
                <td>{{ detail.attempts }}</td>
                <td>{{ formatDuration(detail.timeSpent) }}</td>
                <td :class="{ 'correct': detail.isCorrect, 'error': !detail.isCorrect }">
                  {{ detail.isCorrect ? '正确' : '错误' }}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { SoundStatistics } from '../../stat'
import type { ISoundStatData, SoundWordDetail } from '../../prepare'
import type { SoundWordType } from '../..'

const props = defineProps<{
  statistics: SoundStatistics
}>()

// 计算属性
const stageStats = computed(() => props.statistics.data.exampleStageStats || {})
const wordDetails = computed(() => props.statistics.data.wordsDetails || [])
const hasExampleStats = computed(() => Object.keys(stageStats.value).length > 0)
const hasWordDetails = computed(() => wordDetails.value.length > 0)

// 格式化方法
function formatDuration(ms: number): string {
  const seconds = Math.floor(ms / 1000)
  const minutes = Math.floor(seconds / 60)
  const remainingSeconds = seconds % 60

  return `${minutes}分${remainingSeconds}秒`
}

function formatPercentage(value: number): string {
  return `${(value * 100).toFixed(1)}%`
}

function getStageName(stage: number): string {
  switch (stage) {
    case 0: return '阶段1 (关键词)'
    case 1: return '阶段2 (部分句子)'
    case 2: return '阶段3 (完整句子)'
    default: return `阶段${stage + 1}`
  }
}

function getTypeLabel(type: SoundWordType): string {
  if (type === 'dictation') return '听写'
  if (type === 'example') return '例句'
  return type
}
</script>

<style scoped>
.sound-stats-container {
  width: 100%;
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
}

.stats-header {
  margin-bottom: 24px;
  border-bottom: 1px solid #eaeaea;
  padding-bottom: 16px;
}

.stats-title {
  font-size: 24px;
  color: #333;
  margin: 0;
}

.stats-content {
  display: flex;
  flex-direction: column;
  gap: 32px;
}

.stats-section {
  background-color: #fff;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  padding: 20px;
}

.section-title {
  font-size: 18px;
  color: #3498db;
  margin-top: 0;
  margin-bottom: 16px;
  font-weight: 600;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
  gap: 16px;
}

.stat-item {
  background-color: #f8f9fa;
  padding: 16px;
  border-radius: 8px;
}

.stat-label {
  font-size: 14px;
  color: #666;
  margin-bottom: 8px;
}

.stat-value {
  font-size: 20px;
  color: #333;
  font-weight: 600;
}

.word-details-table {
  overflow-x: auto;
}

table {
  width: 100%;
  border-collapse: collapse;
}

th, td {
  padding: 12px;
  text-align: left;
  border-bottom: 1px solid #eee;
}

th {
  background-color: #f8f9fa;
  font-weight: 500;
  color: #666;
}

td.correct {
  color: #2ecc71;
  font-weight: 500;
}

td.error {
  color: #e74c3c;
  font-weight: 500;
}
</style>
