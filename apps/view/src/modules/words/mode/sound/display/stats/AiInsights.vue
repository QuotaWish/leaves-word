<script setup lang="ts">
defineProps<{
  aiAnalysis: {
    avgDictationTimePerWord: number;
    avgExampleTimePerWord: number;
    dictationCorrectRate: number;
    exampleCorrectRate: number;
    audioEfficiency: number;
    suggestions: string[];
  };
  formatTime: (ms: number | undefined) => string;
  formatPercentage: (value: number | undefined) => string;
}>();
</script>

<template>
  <div class="ai-insights-container">
    <h3 class="section-title"><span class="ai-badge">AI</span> 学习洞察</h3>

    <div class="ai-metrics-grid">
      <div class="ai-metric-item">
        <div class="metric-icon"><div class="i-carbon-time" /></div>
        <div class="metric-content">
          <span class="label">平均听写反应</span>
          <span class="value">{{ formatTime(aiAnalysis.avgDictationTimePerWord) }}</span>
        </div>
      </div>

      <div class="ai-metric-item">
        <div class="metric-icon"><div class="i-carbon-text-link" /></div>
        <div class="metric-content">
          <span class="label">平均例句反应</span>
          <span class="value">{{ formatTime(aiAnalysis.avgExampleTimePerWord) }}</span>
        </div>
      </div>

      <div class="ai-metric-item">
        <div class="metric-icon"><div class="i-carbon-checkmark" /></div>
        <div class="metric-content">
          <span class="label">听写正确率</span>
          <span class="value">{{ formatPercentage(aiAnalysis.dictationCorrectRate) }}</span>
        </div>
      </div>

      <div class="ai-metric-item">
        <div class="metric-icon"><div class="i-carbon-document" /></div>
        <div class="metric-content">
          <span class="label">例句正确率</span>
          <span class="value">{{ formatPercentage(aiAnalysis.exampleCorrectRate) }}</span>
        </div>
      </div>

      <div v-if="aiAnalysis.audioEfficiency !== undefined" class="ai-metric-item full-span">
        <div class="metric-icon"><div class="i-carbon-audio" /></div>
        <div class="metric-content">
          <span class="label">音频使用效率指数</span>
          <span class="value">
            {{ aiAnalysis.audioEfficiency ? aiAnalysis.audioEfficiency.toFixed(2) : "N/A" }}
          </span>
        </div>
      </div>
    </div>

    <div v-if="aiAnalysis.suggestions && aiAnalysis.suggestions.length > 0" class="suggestions-card">
      <div class="suggestions-header">
        <div class="icon-wrapper"><div class="i-carbon-idea" /></div>
        <h4>智能建议</h4>
      </div>
      <ul class="suggestions-list">
        <li v-for="(suggestion, index) in aiAnalysis.suggestions" :key="index">
          {{ suggestion }}
        </li>
      </ul>
    </div>
  </div>
</template>

<style scoped>
.ai-insights-container {
  padding: 24px;
}

.section-title {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  font-size: 1.25rem;
  font-weight: 600;
  color: var(--color-text-primary, #2c3e50);
  margin-bottom: 20px;
  text-align: center;
  padding-bottom: 12px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.08);
}

.ai-badge {
  background: linear-gradient(45deg, #7e57c2, #2196f3);
  color: white;
  font-size: 0.75rem;
  padding: 2px 6px;
  border-radius: 4px;
  font-weight: bold;
}

.ai-metrics-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 16px;
  margin-bottom: 24px;
}

.ai-metric-item {
  display: flex;
  align-items: center;
  padding: 16px;
  background: rgba(255, 255, 255, 0.03);
  border-radius: 12px;
  border: 1px solid rgba(255, 255, 255, 0.08);
  transition: all 0.3s ease;
  backdrop-filter: blur(5px);
}

.ai-metric-item:hover {
  transform: translateY(-2px);
  border-color: rgba(255, 255, 255, 0.15);
  background: rgba(126, 87, 194, 0.05);
}

.metric-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  background: rgba(126, 87, 194, 0.15);
  border-radius: 10px;
  margin-right: 14px;
  color: var(--color-primary-dark, #4f46e5);
}

.metric-content {
  flex: 1;
  display: flex;
  flex-direction: column;
}

.ai-metric-item .label {
  color: var(--color-text-secondary, #555e6d);
  font-weight: 500;
  margin-bottom: 4px;
  font-size: 0.9rem;
}

.ai-metric-item .value {
  color: var(--color-primary-dark, #4f46e5);
  font-weight: 600;
  font-size: 1.1rem;
}

.ai-metric-item.full-span {
  grid-column: 1 / -1;
}

.suggestions-card {
  background: rgba(255, 255, 255, 0.03);
  padding: 20px;
  border-radius: 12px;
  border-left: 4px solid rgba(126, 87, 194, 0.6);
  border: 1px solid rgba(255, 255, 255, 0.08);
  backdrop-filter: blur(5px);
  transition: all 0.3s ease;
}

.suggestions-card:hover {
  border-color: rgba(255, 255, 255, 0.15);
  background: rgba(126, 87, 194, 0.05);
  transform: translateY(-2px);
}

.suggestions-header {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 16px;
}

.icon-wrapper {
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(45deg, #7e57c2, #2196f3);
  border-radius: 50%;
  color: white;
}

.suggestions-card h4 {
  color: var(--color-primary-dark, #4f46e5);
  font-weight: 600;
  margin: 0;
  font-size: 1.1rem;
}

.suggestions-list {
  list-style-type: disc;
  padding-left: 20px;
  color: var(--color-text-primary, #374151);
  font-size: 0.95rem;
}

.suggestions-list li {
  margin-bottom: 10px;
  padding-left: 4px;
}

/* 响应式调整 */
@media (max-width: 640px) {
  .section-title {
    font-size: 1.1rem;
  }

  .ai-metrics-grid {
    grid-template-columns: 1fr;
  }

  .ai-metric-item {
    padding: 12px;
  }

  .metric-icon {
    width: 30px;
    height: 30px;
    margin-right: 10px;
  }

  .ai-metric-item .label {
    font-size: 0.85rem;
  }

  .ai-metric-item .value {
    font-size: 1rem;
  }

  .suggestions-card {
    padding: 16px;
  }

  .suggestions-header {
    margin-bottom: 12px;
  }

  .icon-wrapper {
    width: 28px;
    height: 28px;
  }

  .suggestions-card h4 {
    font-size: 1rem;
  }

  .suggestions-list {
    font-size: 0.9rem;
  }
}
</style>
