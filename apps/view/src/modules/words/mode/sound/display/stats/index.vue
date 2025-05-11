<script setup lang="ts">
import { computed } from "vue";
import { ElSkeleton, ElSkeletonItem } from "element-plus";
import Logo from "~/components/chore/Logo.vue";
import type { SoundStatistics } from "../../stat";
import AiInsights from "./AiInsights.vue";
import ChartCarousel from "./ChartCarousel.vue";
import LearningPattern from "./LearningPattern.vue";
import SoundAIFeatures from "./SoundAIFeatures.vue";
import SummaryCards from "./SummaryCards.vue";

const props = defineProps<{
  data: SoundStatistics;
}>();

const isLoading = computed(() => !props.data || !props.data.data);

const soundData = computed(() => {
  if (isLoading.value || !props.data.data) {
    return null;
  }
  return props.data.data;
});

// AI分析和统计计算 (保持原有核心逻辑, 稍作调整以适应新结构)
const aiAnalysis = computed(() => {
  if (!soundData.value) {
    return {};
  }
  const data = soundData.value;
  const wordDetails = data.wordsDetails || [];

  const dictationWords = wordDetails.filter(w => w.type === "dictation");
  const avgDictationTimePerWord = dictationWords.length
    ? dictationWords.reduce((sum, w) => sum + w.timeSpent, 0) / dictationWords.length
    : 0;

  const exampleWords = wordDetails.filter(w => w.type === "example");
  const avgExampleTimePerWord = exampleWords.length
    ? exampleWords.reduce((sum, w) => sum + w.timeSpent, 0) / exampleWords.length
    : 0;

  const totalAudioPlays = data.audioPlayCount || 1;
  const dictationCorrectRate = data.dictationCorrectRate || 0;
  const exampleCorrectRate = data.exampleCorrectRate || 0;

  const audioEfficiency =
    totalAudioPlays > 0
      ? (dictationCorrectRate + exampleCorrectRate) / 2 / totalAudioPlays
      : 0;

  const suggestions = [];
  if (avgDictationTimePerWord > 15000) {
    suggestions.push("听写反应较慢，尝试集中注意力，快速回忆。");
  }
  if (avgExampleTimePerWord > 20000) {
    suggestions.push("例句理解时间偏长，多关注句意和语境。");
  }
  if (dictationCorrectRate < 0.7) {
    suggestions.push("听写正确率有待提高，加强单词拼写和发音记忆。");
  }
  if (exampleCorrectRate < 0.7) {
    suggestions.push("例句掌握度不高，多练习句子结构和用法。");
  }
  if (
    audioEfficiency < 0.1 &&
    totalAudioPlays > dictationWords.length + exampleWords.length &&
    dictationWords.length + exampleWords.length > 0
  ) {
    suggestions.push(
      "音频播放次数较多，但正确率提升不明显，尝试理解后再听，而非盲目重复。",
    );
  }
  if (suggestions.length === 0) {
    suggestions.push("整体表现不错，继续保持！");
  }

  return {
    avgDictationTimePerWord,
    avgExampleTimePerWord,
    audioEfficiency:
      Number.isNaN(audioEfficiency) || !Number.isFinite(audioEfficiency) ? 0 : audioEfficiency,
    suggestions,
    dictationWordsCount: dictationWords.length,
    exampleWordsCount: exampleWords.length,
    totalWords: wordDetails.length,
    dictationCorrectRate,
    exampleCorrectRate,
  };
});

function formatTime(ms: number | undefined) {
  if (ms === undefined || ms === null || Number.isNaN(ms)) {
    return "N/A";
  }
  const seconds = ms / 1000;
  return `${seconds.toFixed(1)}秒`;
}

// 导出此函数供SummaryCards组件使用
function formatDuration(ms: number | undefined) {
  if (ms === undefined || ms === null || Number.isNaN(ms)) {
    return "N/A";
  }
  const totalSeconds = Math.floor(ms / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return minutes > 0 ? `${minutes}分${seconds}秒` : `${seconds}秒`;
}

function formatPercentage(value: number | undefined) {
  if (value === undefined || value === null || Number.isNaN(value)) {
    return "N/A";
  }
  return `${(value * 100).toFixed(1)}%`;
}
</script>

<template>
  <div class="sound-stats-page">
    <template v-if="isLoading">
      <div class="loading-skeleton">
        <ElSkeleton :rows="5" animated>
          <template #template>
            <ElSkeletonItem variant="h3" style="width: 40%; margin-bottom: 16px" />
            <div class="grid grid-cols-2 mb-4 gap-3 sm:grid-cols-4">
              <ElSkeletonItem variant="text" style="height: 60px" />
              <ElSkeletonItem variant="text" style="height: 60px" />
              <ElSkeletonItem variant="text" style="height: 60px" />
              <ElSkeletonItem variant="text" style="height: 60px" />
            </div>
            <ElSkeletonItem
              variant="rect"
              style="width: 100%; height: 300px; margin-bottom: 16px"
            />
            <ElSkeletonItem variant="h3" style="width: 30%; margin-bottom: 8px" />
            <ElSkeletonItem variant="text" style="width: 80%; margin-bottom: 6px" />
            <ElSkeletonItem variant="text" style="width: 70%" />
          </template>
        </ElSkeleton>
      </div>
    </template>

    <template v-else-if="soundData">
      <!-- 主要状态卡片区 -->
      <div class="analysis-header">
        <h2>听力与发音学习报告</h2>
        <SummaryCards
          :data="soundData"
          :format-duration="formatDuration"
        />
      </div>

      <!-- AI分析特色区域 - 提升优先级 -->
      <SoundAIFeatures
        v-if="aiAnalysis && Object.keys(aiAnalysis).length > 0"
        :analysis="aiAnalysis"
        :sound-data="soundData"
        class="ai-features-section"
      />

      <!-- 图表轮播区域 -->
      <ChartCarousel :data="props.data" class="charts-section" />

      <!-- AI洞察区域 -->
      <AiInsights
        v-if="aiAnalysis && Object.keys(aiAnalysis).length > 0"
        :ai-analysis="aiAnalysis"
        :format-time="formatTime"
        :format-percentage="formatPercentage"
        class="ai-analysis-section"
      />

      <!-- 学习模式分析区 -->
      <LearningPattern
        v-if="soundData.wordsDetails && soundData.wordsDetails.length > 0"
        :words-details="soundData.wordsDetails"
        class="learning-pattern-section"
      />

      <div class="page-footer">
        <div class="brand-info">
          <Logo />
          <h1>LeavesWord</h1>
        </div>
        <div class="disclaimer-text">
          <p>© {{ new Date().getFullYear() }} LeavesWord AI 学习助手</p>
          <p>本分析报告由 AI 算法生成，结果仅供参考</p>
        </div>
      </div>
    </template>
    <div v-else class="no-data-placeholder">
      <p>未能加载学习统计数据。请完成一次听力练习后再查看，或稍后重试。</p>
    </div>
  </div>
</template>

<style scoped>
.sound-stats-page {
  padding: 12px 10px;
  max-width: 100%;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  gap: 16px;
  min-height: 100vh;
  background-color: transparent;
}

.analysis-header {
  padding: 16px;
  background: rgba(126, 87, 194, 0.08);
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
  backdrop-filter: blur(8px);
  border: 1px solid rgba(255, 255, 255, 0.08);
}

.analysis-header h2 {
  text-align: center;
  margin-bottom: 16px;
  font-size: 1.3rem;
  font-weight: 600;
  background: linear-gradient(45deg, #7e57c2, #2196f3);
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
  letter-spacing: 0.5px;
}

.charts-section,
.ai-features-section,
.learning-pattern-section,
.ai-analysis-section {
  border-radius: 12px;
  overflow: hidden;
  background: rgba(255, 255, 255, 0.02);
  border: 1px solid rgba(255, 255, 255, 0.08);
  backdrop-filter: blur(8px);
}

/* 突出AI分析部分 */
.ai-features-section {
  background: rgba(126, 87, 194, 0.1);
  border: 1px solid rgba(126, 87, 194, 0.2);
}

.ai-analysis-section {
  background: rgba(126, 87, 194, 0.08);
  padding: 16px;
}

.no-chart-data,
.no-data-placeholder,
.loading-skeleton {
  text-align: center;
  padding: 30px 16px;
  color: var(--color-text-secondary, #555e6d);
  background: rgba(126, 87, 194, 0.05);
  border-radius: 12px;
  border: 1px solid rgba(255, 255, 255, 0.08);
  backdrop-filter: blur(8px);
  font-size: 0.95rem;
}

.loading-skeleton {
  min-height: 400px;
}

:deep(.el-skeleton__item) {
  background: rgba(126, 87, 194, 0.12);
}

.page-footer {
  margin-top: auto;
  padding: 20px 16px;
  text-align: center;
  border-top: 1px solid rgba(255, 255, 255, 0.08);
  background: rgba(126, 87, 194, 0.05);
  border-radius: 12px;
  backdrop-filter: blur(8px);
  border: 1px solid rgba(255, 255, 255, 0.08);
}

.brand-info {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  margin-bottom: 10px;
}

.brand-info h1 {
  font-size: 1.2rem;
  font-weight: 600;
  background: linear-gradient(45deg, #7e57c2, #2196f3);
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
}

.disclaimer-text {
  font-size: 0.75rem;
  color: var(--color-text-muted, #6b7280);
  line-height: 1.5;
  max-width: 450px;
  margin: 0 auto;
}

.disclaimer-text p {
  margin: 2px 0;
}

/* 确保轮播图占满宽度 */
:deep(.charts-carousel-container) {
  width: 100%;
}

/* 自定义深浅色模式下的图表文字颜色 */
:deep(.dark) .chart {
  --chart-text-color: #ffffff;
}

:deep(.light) .chart {
  --chart-text-color: #333333;
}

/* 深色模式适配 */
:deep(.dark) .sound-stats-page {
  color: #f1f1f1;
}

:deep(.dark) .analysis-header,
:deep(.dark) .ai-features-section,
:deep(.dark) .ai-analysis-section {
  background: rgba(126, 87, 194, 0.15);
  border-color: rgba(126, 87, 194, 0.25);
}

:deep(.dark) .charts-section,
:deep(.dark) .learning-pattern-section {
  background: rgba(33, 33, 33, 0.5);
  border-color: rgba(126, 87, 194, 0.2);
}

:deep(.dark) .page-footer {
  background: rgba(33, 33, 33, 0.5);
  border-color: rgba(126, 87, 194, 0.2);
}

:deep(.dark) .disclaimer-text {
  color: #a0a0a0;
}

:deep(.dark) .no-data-placeholder,
:deep(.dark) .loading-skeleton {
  background: rgba(33, 33, 33, 0.5);
  color: #a0a0a0;
}

/* 响应式调整 */
@media (max-width: 640px) {
  .sound-stats-page {
    padding: 10px 8px;
    gap: 12px;
  }
  .analysis-header h2 {
    font-size: 1.2rem;
    margin-bottom: 12px;
  }
  .analysis-header,
  .ai-features-section,
  .ai-analysis-section,
  .charts-section,
  .learning-pattern-section {
    padding: 12px;
  }
  .page-footer {
    padding: 16px 12px;
  }
  .brand-info h1 {
    font-size: 1rem;
  }
  .disclaimer-text {
    font-size: 0.7rem;
  }
}
</style>
