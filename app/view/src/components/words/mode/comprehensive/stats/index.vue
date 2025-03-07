<template>
  <div class="ai-word-analysis">
    <template v-if="isLoading">
      <div class="loading-skeleton">
        <el-skeleton :rows="3" animated>
          <template #template>
            <el-skeleton-item variant="h3" style="width: 30%" />
            <div style="padding: 14px">
              <el-skeleton-item variant="h3" style="width: 50%" />
              <div style="display: flex; justify-content: space-between; align-items: center; margin-top: 16px">
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
            <div class="label">掌握率</div>
            <div class="value">{{ (correctRate * 100).toFixed(1) }}%</div>
          </div>
          <div class="summary-item">
            <div class="label">学习时长</div>
            <div class="value">{{ formatDuration(sessionDuration) }}</div>
          </div>
        </div>
      </div>

      <!-- 将前三个图表合并到轮播图中 -->
      <ChartsCarousel :correctRate="correctRate" :averageTimePerWord="averageTimePerWord"
        :sessionDuration="sessionDuration" :wordsDetails="wordsDetails" />

      <!-- AI特色功能区域 -->
      <AIFeatures :correctRate="correctRate" :averageTimePerWord="averageTimePerWord" :sessionDuration="sessionDuration"
        :wordsDetails="wordsDetails" />

      <!-- 艾宾浩斯记忆曲线区域 -->
      <EbbinghausSection />

      <!-- AI学习预测区域 -->
      <PredictionSection :correctRate="correctRate" :wordsDetails="wordsDetails" />

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
import { ref, computed } from 'vue'
import { ElSkeleton, ElSkeletonItem } from 'element-plus'
import { ComprehensiveStatistics } from '~/composables/words/mode/comprehensive'
import { Statistics } from '~/composables/words'
import ChartsCarousel from './ChartsCarousel.vue'
import AIFeatures from './AIFeatures.vue'
import EbbinghausSection from './EbbinghausSection.vue'
import PredictionSection from './PredictionSection.vue'
import Logo from '~/components/chore/Logo.vue'

const props = defineProps<{
  data: Statistics<any>
}>()

const stat = computed(() => {
  if (!props.data) return { data: { correctRate: 0, averageTimePerWord: 0, sessionDuration: 0, wordsDetails: [] } }
  return ComprehensiveStatistics.parseStatistics(props.data)
})

// const correctRate = computed(() => stat.value.data.correctRate || 0)
// 掌握率
const correctRate = computed(() => {
  const words = stat.value.data.wordsDetails ?? []
  const correct = words?.filter(item => !item.wrongHistory || item.wrongHistory?.length === 0) ?? []

  return correct.length / words.length
})
const averageTimePerWord = computed(() => stat.value.data.averageTimePerWord || 0)
const sessionDuration = computed(() => stat.value.data.sessionDuration || 0)
const wordsDetails = computed(() => stat.value.data.wordsDetails || [])
const isLoading = computed(() => !props.data /* || !wordsDetails.value.length */)

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
</script>

<style scoped>
.ai-word-analysis {
  padding: 20px 0;
  border-radius: 12px;
  max-width: 100%;
  overflow-x: hidden;
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
  letter-spacing: 0.5px;
}

.analysis-summary {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 12px;
  margin-bottom: 24px;
}

.summary-item {
  text-align: center;
  padding: 16px 8px;
  background: rgba(126, 87, 194, 0.08);
  border-radius: 16px;
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.08);
  transition: all 0.3s ease;
  overflow: hidden;
  position: relative;
}

.summary-item:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 12px rgba(0, 0, 0, 0.05);
  border-color: rgba(255, 255, 255, 0.15);
}

.summary-item .label {
  font-size: 13px;
  color: var(--el-text-color-regular);
  margin-bottom: 8px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.summary-item .value {
  font-size: 16px;
  font-weight: 600;
  background: linear-gradient(45deg, #00c6ff, #0072ff);
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.loading-skeleton {
  padding: 20px;
  background: rgba(126, 87, 194, 0.08);
  border-radius: 16px;
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.08);
}

:deep(.el-skeleton__item) {
  background: rgba(126, 87, 194, 0.12);
}

:deep(.el-skeleton__h3) {
  height: 24px !important;
}

:deep(.el-skeleton__text) {
  height: 16px !important;
}

.footer {
  margin-top: 32px;
  padding: 20px 16px;
  text-align: center;
  border-top: 1px solid rgba(255, 255, 255, 0.08);
}

.brand {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  margin-bottom: 16px;
}

.brand h1 {
  font-size: 18px;
  font-weight: 600;
  background: linear-gradient(45deg, #7e57c2, #2196f3);
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
}

.disclaimer {
  font-size: 11px;
  color: var(--el-text-color-secondary);
  line-height: 1.6;
  max-width: 500px;
  margin: 0 auto;
}

.disclaimer p {
  margin: 2px 0;
}
</style>