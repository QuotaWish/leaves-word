<script setup lang="ts">
import type { WordPronounce } from '~/composables/api/types'
import { ref } from 'vue'

const props = defineProps<{
  type: 'american' | 'british'
  pronounce: WordPronounce
}>()

const isPlaying = ref(false)
const audio = new Audio()

async function playPronunciation() {
  if (isPlaying.value)
    return

  try {
    isPlaying.value = true
    audio.src = props.pronounce.audio
    await audio.play()

    audio.onended = () => {
      isPlaying.value = false
    }
  }
  catch (error) {
    console.error('Failed to play audio:', error)
    isPlaying.value = false
  }
}
</script>

<template>
  <button
    :class="[type, { 'is-playing': isPlaying }]"
    class="PronounceDisplay"
    :disabled="isPlaying"
    @click="playPronunciation"
  >
    <div class="PronounceDisplay-Text">
      <template v-if="!isPlaying">
        {{ props.type === 'american' ? '美' : '英' }}
      </template>
      <div v-else class="wave-animation">
        <span />
        <span />
        <span />
      </div>
    </div>
    <span class="PronounceDisplay-Content">
      {{ props.pronounce.content }}
    </span>
  </button>
</template>

<style lang="scss" scoped>
.PronounceDisplay {
  display: inline-flex;
  align-items: center;
  padding: 0.3rem 0.8rem;
  border-radius: 8px;
  transition: all 0.2s ease;
  cursor: pointer;
  border: none;

  &:disabled {
    cursor: wait;
    opacity: 0.8;
  }

  &.american {
    background: linear-gradient(120deg, #f0f7ff 0%, #e6f4ff 100%);

    .PronounceDisplay-Text {
      color: #0958d9;
    }

    .dark & {
      background: linear-gradient(120deg, #111d2c 0%, #112a45 100%);

      .PronounceDisplay-Text {
        color: #1677ff;
      }
    }
  }

  &.british {
    background: linear-gradient(120deg, #fff1f0 0%, #fff2f0 100%);

    .PronounceDisplay-Text {
      color: #cf1322;
    }

    .dark & {
      background: linear-gradient(120deg, #2a1215 0%, #2b161b 100%);

      .PronounceDisplay-Text {
        color: #ff4d4f;
      }
    }
  }

  &:hover:not(:disabled) {
    transform: translateY(-1px);
    filter: brightness(1.05);
  }

  &.is-playing {
    background: rgba(0, 0, 0, 0.04);

    .dark & {
      background: rgba(255, 255, 255, 0.04);
    }

    .PronounceDisplay-Content {
      opacity: 1;
      font-weight: 700;
    }
  }

  .PronounceDisplay-Text {
    width: 1rem;
    height: 1rem;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-right: 0.4rem;
    font-size: 0.9rem;
    font-weight: 700;
  }

  .PronounceDisplay-Content {
    color: var(--el-text-color-primary);
    font-family: 'Roboto Mono', monospace;
    font-size: 0.95rem;
    font-weight: 600;
    letter-spacing: 0.5px;
  }

  .play-icon {
    width: 1.2rem;
    height: 1.2rem;
    margin-left: 0.5rem;
    opacity: 0.7;
    transition: all 0.3s ease;

    &.is-playing {
      animation: pulse 2s infinite;
    }
  }

  .wave-animation {
    display: flex;
    align-items: center;
    gap: 2px;
    height: 12px;

    span {
      display: inline-block;
      width: 2px;
      height: 100%;
      background-color: currentColor;
      border-radius: 1px;
      animation: wave 1s ease-in-out infinite;

      &:nth-child(2) {
        animation-delay: 0.2s;
      }

      &:nth-child(3) {
        animation-delay: 0.4s;
      }
    }
  }
}

@keyframes pulse {
  0% {
    transform: scale(1);
    opacity: 0.7;
  }
  50% {
    transform: scale(1.1);
    opacity: 1;
  }
  100% {
    transform: scale(1);
    opacity: 0.7;
  }
}

@keyframes wave {
  0%,
  100% {
    height: 4px;
  }
  50% {
    height: 12px;
  }
}
</style>
