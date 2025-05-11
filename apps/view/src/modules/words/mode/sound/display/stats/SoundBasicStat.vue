<script setup lang="ts">
import type { SoundStatistics } from '../../stat';

const props = defineProps<{
  data: SoundStatistics
}>()

function formatDuration(ms: number): string {
  const seconds = Math.floor(ms / 1000)
  const minutes = Math.floor(seconds / 60)
  const remainingSeconds = seconds % 60

  return `${minutes}分${remainingSeconds}秒`
}
</script>

<template>
  <div class="SoundBasicStat grid gap-4 grid-cols-2 grid-rows-2">
    <div class="SoundStatSection">
      <div class="label">
        学习时长
      </div>
      <div class="value">
        {{ formatDuration(data.data.sessionDuration || 0) }}
      </div>
    </div>

    <div class="SoundStatSection">
      <div class="label">
        听写单词数
      </div>
      <div class="value">
        {{ data.data.dictationWords || 0 }}
      </div>
    </div>

    <div class="SoundStatSection">
      <div class="label">
        例句单词数
      </div>
      <div class="value">
        {{ data.data.exampleWords || 0 }}
      </div>
    </div>

    <div class="SoundStatSection">
      <div class="label">
        音频播放次数
      </div>
      <div class="value">
        {{ data.data.audioPlayCount || 0 }}
      </div>
    </div>
  </div>
</template>
