<script setup lang="ts">
defineProps<{
  data: any;
  formatDuration: (ms: number | undefined) => string;
}>();
</script>

<template>
  <div class="summary-grid">
    <div class="summary-item">
      <div class="summary-icon">
        <div class="i-carbon-time" />
      </div>
      <div class="summary-content">
        <div class="label">学习时长</div>
        <div class="value animated-value">
          {{ formatDuration(data.sessionDuration) }}
        </div>
      </div>
    </div>
    <div class="summary-item">
      <div class="summary-icon">
        <div class="i-carbon-text-creation" />
      </div>
      <div class="summary-content">
        <div class="label">听写单词数</div>
        <div class="value animated-value">
          {{ data.dictationWords || 0 }}
        </div>
      </div>
    </div>
    <div class="summary-item">
      <div class="summary-icon">
        <div class="i-carbon-text-link" />
      </div>
      <div class="summary-content">
        <div class="label">例句练习数</div>
        <div class="value animated-value">
          {{ data.exampleWords || 0 }}
        </div>
      </div>
    </div>
    <div class="summary-item">
      <div class="summary-icon">
        <div class="i-carbon-play-filled" />
      </div>
      <div class="summary-content">
        <div class="label">音频播放次数</div>
        <div class="value animated-value">
          {{ data.audioPlayCount || 0 }}
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.summary-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(130px, 1fr));
  gap: 16px;
}

.summary-item {
  display: flex;
  align-items: center;
  padding: 16px;
  background: rgba(255, 255, 255, 0.03);
  border-radius: 16px;
  border: 1px solid rgba(255, 255, 255, 0.08);
  transition: all 0.3s ease;
  overflow: hidden;
  position: relative;
  backdrop-filter: blur(10px);
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.02);
}

.summary-item:hover {
  transform: translateY(-3px);
  box-shadow: 0 6px 12px rgba(0, 0, 0, 0.05);
  border-color: rgba(255, 255, 255, 0.15);
  background: rgba(126, 87, 194, 0.08);
}

.summary-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 38px;
  height: 38px;
  background: linear-gradient(45deg, rgba(126, 87, 194, 0.2), rgba(33, 150, 243, 0.2));
  border-radius: 12px;
  margin-right: 12px;
  color: #7e57c2;
  font-size: 1.2rem;
}

.summary-content {
  flex: 1;
}

.label {
  font-size: 0.85rem;
  color: var(--color-text-secondary, #555e6d);
  margin-bottom: 6px;
  white-space: nowrap;
}

.value {
  font-size: 1.25rem;
  font-weight: 700;
  background: linear-gradient(45deg, #00c6ff, #0072ff);
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
}

.animated-value {
  animation: fadeIn 0.8s ease-in-out forwards;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* 响应式调整 */
@media (max-width: 640px) {
  .summary-grid {
    grid-template-columns: repeat(2, 1fr);
    gap: 10px;
  }

  .summary-item {
    padding: 12px;
  }

  .summary-icon {
    width: 32px;
    height: 32px;
    margin-right: 8px;
    font-size: 1rem;
  }

  .label {
    font-size: 0.8rem;
  }

  .value {
    font-size: 1.1rem;
  }
}
</style>
