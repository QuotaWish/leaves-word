<template>
  <div class="sound-statistics">
    <div class="statistics-header">
      <h2>音析模式学习统计</h2>
      <p>了解你的听写和例句学习表现</p>
    </div>
    
    <el-divider>基础数据</el-divider>
    
    <div class="statistics-grid">
      <div class="stat-item">
        <div class="stat-value">{{ data.dictationWords || 0 }}</div>
        <div class="stat-label">听写单词</div>
      </div>
      
      <div class="stat-item">
        <div class="stat-value">{{ data.exampleWords || 0 }}</div>
        <div class="stat-label">例句学习</div>
      </div>
      
      <div class="stat-item">
        <div class="stat-value">{{ formatTime(data.sessionDuration) }}</div>
        <div class="stat-label">总学习时间</div>
      </div>
      
      <div class="stat-item">
        <div class="stat-value">{{ formatPercent(data.dictationCorrectRate) }}</div>
        <div class="stat-label">听写正确率</div>
      </div>
    </div>
    
    <el-divider>详细统计</el-divider>
    
    <div class="statistics-grid">
      <div class="stat-item">
        <div class="stat-value">{{ formatTime(data.dictationDuration) }}</div>
        <div class="stat-label">听写模式时间</div>
      </div>
      
      <div class="stat-item">
        <div class="stat-value">{{ formatTime(data.exampleDuration) }}</div>
        <div class="stat-label">例句模式时间</div>
      </div>
      
      <div class="stat-item">
        <div class="stat-value">{{ data.audioPlayCount || 0 }}</div>
        <div class="stat-label">音频播放次数</div>
      </div>
      
      <div class="stat-item">
        <div class="stat-value">{{ formatPercent(data.exampleCorrectRate) }}</div>
        <div class="stat-label">例句正确率</div>
      </div>
    </div>

    <template v-if="data.exampleStageStats && Object.keys(data.exampleStageStats).length > 0">
      <el-divider>例句阶段学习</el-divider>
      
      <div class="example-stats">
        <div v-for="(stats, stage) in data.exampleStageStats" :key="stage" class="example-stage-item">
          <div class="stage-name">{{ getStageName(Number(stage)) }}</div>
          <div class="stage-stats">
            <div>完成: {{ stats.completed }}</div>
            <div>尝试: {{ stats.attempts }}</div>
            <div>正确率: {{ formatPercent(stats.completed / stats.attempts) }}</div>
          </div>
        </div>
      </div>
    </template>

    <template v-if="data.wordsDetails && data.wordsDetails.length > 0">
      <el-divider>单词详情</el-divider>
      
      <el-table :data="data.wordsDetails" stripe style="width: 100%">
        <el-table-column prop="word" label="单词" width="180" />
        <el-table-column prop="type" label="类型" width="100">
          <template #default="scope">
            {{ scope.row.type === 'dictation' ? '听写' : '例句' }}
          </template>
        </el-table-column>
        <el-table-column prop="attempts" label="尝试次数" width="100" />
        <el-table-column prop="isCorrect" label="是否正确" width="100">
          <template #default="scope">
            <el-tag :type="scope.row.isCorrect ? 'success' : 'danger'">
              {{ scope.row.isCorrect ? '正确' : '错误' }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="timeSpent" label="花费时间">
          <template #default="scope">
            {{ formatTime(scope.row.timeSpent) }}
          </template>
        </el-table-column>
      </el-table>
    </template>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { ISoundStatData, ExampleStage } from '~/composables/words/mode/sound';

const props = defineProps<{
  data: Partial<ISoundStatData>
}>();

function formatTime(ms: number | undefined): string {
  if (!ms) return '0秒';
  
  const seconds = Math.floor(ms / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);

  if (hours > 0) {
    return `${hours}小时${minutes % 60}分钟`;
  }
  if (minutes > 0) {
    return `${minutes}分钟${seconds % 60}秒`;
  }
  return `${seconds}秒`;
}

function formatPercent(value: number | undefined): string {
  if (value === undefined) return '0%';
  return `${(value * 100).toFixed(1)}%`;
}

function getStageName(stage: ExampleStage): string {
  switch (stage) {
    case ExampleStage.PLUS_ONE:
      return '前一词+当前词';
    case ExampleStage.PERCENT_WORD:
      return '关键部分+当前词';
    case ExampleStage.FULL_SENTENCE:
      return '完整例句';
    default:
      return `阶段${stage}`;
  }
}
</script>

<style scoped>
.sound-statistics {
  padding: 20px;
}

.statistics-header {
  text-align: center;
  margin-bottom: 20px;
}

.statistics-header h2 {
  margin: 0;
  font-size: 24px;
  color: var(--el-color-primary);
}

.statistics-header p {
  margin: 5px 0 0;
  color: var(--el-text-color-secondary);
}

.statistics-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
  gap: 20px;
  margin: 20px 0;
}

.stat-item {
  background-color: var(--el-bg-color-page);
  border-radius: 8px;
  padding: 15px;
  text-align: center;
  box-shadow: var(--el-box-shadow-light);
}

.stat-value {
  font-size: 24px;
  font-weight: bold;
  color: var(--el-color-primary);
  margin-bottom: 5px;
}

.stat-label {
  color: var(--el-text-color-secondary);
  font-size: 14px;
}

.example-stats {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 15px;
  margin: 20px 0;
}

.example-stage-item {
  background-color: var(--el-bg-color-page);
  border-radius: 8px;
  padding: 15px;
  box-shadow: var(--el-box-shadow-light);
}

.stage-name {
  font-weight: bold;
  margin-bottom: 10px;
  color: var(--el-color-primary);
}

.stage-stats {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 10px;
  color: var(--el-text-color-regular);
}
</style> 