<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue'
import { useRouter } from 'vue-router'
import type { IAnalysisResult } from '~/composables/useRecording'
import { useRecording } from '~/composables/useRecording'
import { useMessage } from '~/composables/useMessage'
import { useTheme } from '~/composables/theme'
import { pronounceWords } from '~/composables/pronounce'
import TouchDialog from '~/components/dialog/TouchDialog.vue'
import Message from '~/components/message/Message.vue'
import PageNavHolder from '~/components/page/holder/PageNavHolder.vue'

const _router = useRouter()
const message = useMessage()
const { isDark: _isDark } = useTheme()

const {
  isRecording,
  isAnalyzing,
  isSupported,
  isListening,
  result,
  startRecording,
  stopRecording,
  analyzePronunciation,
} = useRecording()

const showScoreCard = ref(false)
const currentIndex = ref(0)
const mouthAnimation = ref<'closed' | 'slightly-open' | 'wide-open'>('closed')
const visualizerData = ref<number[]>(Array(32).fill(0))

const aiAnalysisDetails = ref<IAnalysisResult>({
  wordAnalysis: [],
  accuracy: 0,
  vowelIssues: [],
  consonantIssues: [],
  rhythmIssues: [],
  suggestions: [],
  phonemeAnalysis: [],
  stressPattern: {
    expected: '',
    actual: '',
    isCorrect: false,
  },
  intonation: {
    pattern: '',
    issues: [],
  },
})

const currentWord = computed(() => pronounceWords[currentIndex.value]?.word || '')
const currentPhonetic = computed(() => pronounceWords[currentIndex.value]?.phonetic || '')
const progress = computed(() => ((currentIndex.value + 1) / pronounceWords.length) * 100)

const currentTip = ref({
  type: '',
  content: '',
  icon: ''
})

const pronunciationTips = {
  vowel: {
    type: '元音发音技巧',
    content: '元音"o"发音时嘴唇呈圆形，保持圆形口型对"o"音发音至关重要',
    icon: '<div class="animate-wave w-6 h-6 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full"></div>'
  },
  consonant: {
    type: '辅音发音技巧',
    content: '清晰准确地发出每个辅音，注意音标位置',
    icon: '<div class="animate-pulse w-6 h-6 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full"></div>'
  },
  rhythm: {
    type: '混合发音技巧',
    content: '清晰发音每个音节，注意重音位置',
    icon: '<div class="animate-bounce w-6 h-6 bg-gradient-to-r from-pink-400 to-blue-400 rounded-full"></div>'
  }
}

const pronunciationFocus = computed(() => {
  const word = currentWord.value.toLowerCase()
  if (word.includes('o')) return pronunciationTips.vowel
  if (word.match(/[ptkbdg]/)) return pronunciationTips.consonant
  return pronunciationTips.rhythm
})

// 音频可视化动画
function updateVisualizer() {
  if (isListening.value) {
    visualizerData.value = Array(32).fill(0).map(() => Math.random() * 100)
    requestAnimationFrame(updateVisualizer)
  } else {
    visualizerData.value = Array(32).fill(0)
  }
}

watch(isListening, (value) => {
  mouthAnimation.value = value ? 'wide-open' : 'closed'
  if (value) {
    updateVisualizer()
  }
})

const messageRef = ref(null)
onMounted(() => {
  if (!isSupported.value) {
    message.error('您的浏览器不支持语音识别功能')
  }
  message.setMessageRef(messageRef.value)
})

async function toggleRecording() {
  try {
    if (isRecording.value) {
      const chunks = await stopRecording()
      if (chunks && chunks.length > 0) {
        const blob = new Blob(chunks, { type: 'audio/webm' })
        const _audioUrl = URL.createObjectURL(blob)

        if (result.value && currentWord.value) {
          const analysisResult = await analyzePronunciation(result.value, currentWord.value)
          aiAnalysisDetails.value = analysisResult
          showScoreCard.value = true

          if (analysisResult.accuracy >= 90) {
            message.success('发音优秀！继续保持 🎉')
          } else if (analysisResult.accuracy >= 70) {
            message.info('发音不错，继续努力 💪')
          } else if (analysisResult.accuracy >= 50) {
            message.warning('还需要多加练习 📝')
          } else {
            message.error('建议重新听读标准发音 🎯')
          }
        }
      }
    } else {
      await startRecording()
      message.info('开始录音，请清晰地读出单词...')
    }
  } catch (error) {
    if (error instanceof Error) {
      message.error(error.message)
    } else {
      message.error('录音操作失败')
    }
  }
}
</script>

<template>
  <PageNavHolder :content-padding="false" title="发音训练">
    <div class="flex flex-col items-center justify-start min-h-screen bg-gradient-to-b from-gray-900 to-black p-4">
      <Message ref="messageRef" message="" />

      <!-- AI 风格背景 -->
      <div class="absolute inset-0">
        <div class="absolute inset-0 bg-grid-pattern opacity-5"></div>
        <div class="absolute inset-0 bg-gradient-radial from-blue-500/10 via-transparent to-transparent"></div>
      </div>

      <div class="relative w-full max-w-4xl space-y-6 z-10 mt-8">
        <!-- 进度条 -->
        <div class="glass-panel p-3 rounded-xl">
          <div class="flex items-center justify-between mb-1">
            <span class="text-white/60 text-sm">训练进度</span>
            <span class="text-white/60 text-sm">{{ currentIndex + 1 }}/{{ pronounceWords.length }}</span>
          </div>
          <div class="relative h-1.5 bg-gray-800 rounded-full overflow-hidden">
            <div class="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-500"
                 :style="{ transform: `translateX(${progress - 100}%)` }"
                 style="transition: transform 0.5s ease"></div>
          </div>
        </div>

        <!-- 主要内容区 -->
        <div class="glass-panel p-6 rounded-2xl space-y-6">
          <!-- 单词显示 -->
          <div class="text-center space-y-3">
            <h1 class="text-4xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 text-transparent bg-clip-text">
              {{ currentWord }}
            </h1>
            <p class="text-xl text-white/40">{{ currentPhonetic }}</p>
          </div>

          <!-- AI 分析实时显示 -->
          <div class="relative h-24 bg-gray-900/50 rounded-xl overflow-hidden">
            <div class="absolute inset-0 flex justify-center items-center">
              <div class="flex space-x-1">
                <div v-for="(height, index) in visualizerData"
                     :key="index"
                     class="w-0.5 bg-gradient-to-t from-blue-500 to-purple-500 rounded-full transition-all duration-100"
                     :style="{ height: `${height}%` }"></div>
              </div>
            </div>
            <div v-if="isAnalyzing" class="absolute inset-0 flex items-center justify-center bg-black/30">
              <div class="text-sm text-white/60">AI 分析中...</div>
            </div>
          </div>

          <!-- 录音按钮 -->
          <div class="flex justify-center">
            <button
              class="recording-button group"
              :class="{ 'is-recording': isRecording }"
              @click="toggleRecording"
            >
              <div class="relative z-10 flex items-center space-x-2">
                <span class="recording-icon" :class="{ 'animate-pulse': isRecording }"></span>
                <span class="text-sm">{{ isRecording ? '停止录音' : '开始录音' }}</span>
              </div>
              <div class="button-glow"></div>
            </button>
          </div>
        </div>
      </div>

      <!-- 分析结果对话框 -->
      <TouchDialog v-model="showScoreCard" :loading="isAnalyzing" class="analysis-dialog">
        <div class="p-6 space-y-6">
          <!-- 得分展示 -->
          <div class="text-center space-y-4">
            <div class="relative inline-block">
              <svg class="w-32 h-32">
                <circle
                  class="text-gray-700"
                  stroke-width="8"
                  stroke="currentColor"
                  fill="transparent"
                  r="58"
                  cx="64"
                  cy="64"
                />
                <circle
                  class="text-blue-500"
                  stroke-width="8"
                  :stroke-dasharray="364.4"
                  :stroke-dashoffset="364.4 * (1 - aiAnalysisDetails.accuracy / 100)"
                  stroke="currentColor"
                  fill="transparent"
                  r="58"
                  cx="64"
                  cy="64"
                />
              </svg>
              <span class="absolute inset-0 flex items-center justify-center text-3xl font-bold text-white">
                {{ aiAnalysisDetails.accuracy.toFixed(1) }}%
              </span>
            </div>
            <div class="flex justify-center space-x-2">
              <span class="px-3 py-1 rounded-full text-sm"
                    :class="{
                      'bg-green-500/20 text-green-400': aiAnalysisDetails.accuracy >= 90,
                      'bg-blue-500/20 text-blue-400': aiAnalysisDetails.accuracy >= 70 && aiAnalysisDetails.accuracy < 90,
                      'bg-yellow-500/20 text-yellow-400': aiAnalysisDetails.accuracy >= 50 && aiAnalysisDetails.accuracy < 70,
                      'bg-red-500/20 text-red-400': aiAnalysisDetails.accuracy < 50
                    }">
                {{ aiAnalysisDetails.accuracy >= 90 ? '完美发音' :
                   aiAnalysisDetails.accuracy >= 70 ? '不错' :
                   aiAnalysisDetails.accuracy >= 50 ? '继续努力' : '需要改进' }}
              </span>
            </div>
          </div>

          <!-- 详细分析 -->
          <div class="space-y-4">
            <!-- 音素分析 -->
            <div class="analysis-section">
              <h3 class="text-xl font-semibold text-white mb-3 flex items-center">
                <span class="mr-2">音素分析</span>
                <span class="text-xs px-2 py-1 bg-blue-500/20 rounded-full">AI 分析</span>
              </h3>
              <div class="grid grid-cols-12 gap-2">
                <template v-for="(analysis, index) in aiAnalysisDetails.phonemeAnalysis" :key="index">
                  <div class="phoneme-card" :class="{ correct: analysis.isCorrect }">
                    <span class="text-lg">{{ analysis.phoneme }}</span>
                    <span v-if="!analysis.isCorrect" class="text-sm text-red-400">
                      {{ analysis.suggestion }}
                    </span>
                  </div>
                </template>
              </div>
            </div>

            <!-- 问题分析 -->
            <template v-for="(section, index) in [
              { title: '元音问题', items: aiAnalysisDetails.vowelIssues, icon: '👄' },
              { title: '辅音问题', items: aiAnalysisDetails.consonantIssues, icon: '👅' },
              { title: '节奏问题', items: aiAnalysisDetails.rhythmIssues, icon: '🎵' }
            ]" :key="index">
              <div v-if="section.items.length > 0" class="analysis-section">
                <h3 class="text-xl font-semibold text-white mb-3 flex items-center">
                  <span class="mr-2">{{ section.icon }}</span>
                  <span>{{ section.title }}</span>
                </h3>
                <ul class="space-y-2">
                  <li v-for="(item, itemIndex) in section.items"
                      :key="itemIndex"
                      class="flex items-center space-x-2 text-white/80">
                    <span class="w-2 h-2 rounded-full bg-red-500"></span>
                    <span>{{ item }}</span>
                  </li>
                </ul>
              </div>
            </template>

            <!-- AI 建议 -->
            <div class="analysis-section">
              <h3 class="text-xl font-semibold text-white mb-3 flex items-center">
                <span class="mr-2">🤖</span>
                <span>AI 建议</span>
              </h3>
              <ul class="space-y-2">
                <li v-for="(suggestion, index) in aiAnalysisDetails.suggestions"
                    :key="index"
                    class="flex items-center space-x-2 text-white/80 bg-blue-500/10 p-3 rounded-lg">
                  <span class="w-2 h-2 rounded-full bg-blue-500"></span>
                  <span>{{ suggestion }}</span>
                </li>
              </ul>
            </div>
          </div>

          <!-- 操作按钮 -->
          <div class="flex justify-center space-x-4">
            <button
              class="action-button primary"
              @click="showScoreCard = false"
            >
              继续练习
            </button>
            <button
              v-if="currentIndex < pronounceWords.length - 1"
              class="action-button secondary"
              @click="currentIndex++; showScoreCard = false"
            >
              下一个
            </button>
          </div>
        </div>
      </TouchDialog>
    </div>
  </PageNavHolder>
</template>

<style scoped>
.bg-grid-pattern {
  background-image: radial-gradient(circle, #ffffff 0.5px, transparent 0.5px);
  background-size: 24px 24px;
}

.glass-panel {
  background: rgba(255, 255, 255, 0.03);
  backdrop-filter: blur(12px);
  border: 1px solid rgba(255, 255, 255, 0.05);
  box-shadow: 0 4px 24px rgba(0, 0, 0, 0.1);
}

.recording-button {
  position: relative;
  padding: 0.75rem 2rem;
  font-size: 1rem;
  font-weight: 500;
  color: white;
  background: linear-gradient(45deg, #3b82f6, #8b5cf6);
  border-radius: 9999px;
  border: none;
  cursor: pointer;
  overflow: hidden;
  transition: all 0.3s ease;
}

.recording-button::before {
  content: '';
  position: absolute;
  inset: 1px;
  background: rgba(0, 0, 0, 0.3);
  border-radius: inherit;
  z-index: 0;
}

.recording-icon {
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background: currentColor;
  display: inline-block;
}

.button-glow {
  position: absolute;
  inset: -2px;
  background: linear-gradient(45deg, #3b82f6, #8b5cf6);
  border-radius: inherit;
  filter: blur(20px);
  opacity: 0;
  transition: opacity 0.3s ease;
}

.recording-button:hover .button-glow {
  opacity: 0.5;
}

.is-recording {
  animation: pulse 1.5s infinite;
}

@keyframes pulse {
  0%, 100% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.05);
  }
}

.analysis-dialog :deep(.n-dialog) {
  background: rgba(23, 23, 23, 0.95);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.analysis-section {
  padding: 1rem;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 1rem;
}

.phoneme-card {
  @apply col-span-3 p-3 rounded-lg flex flex-col items-center justify-center;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  transition: all 0.3s ease;
}

.phoneme-card.correct {
  background: rgba(59, 130, 246, 0.1);
  border-color: rgba(59, 130, 246, 0.2);
}

.action-button {
  @apply px-6 py-2 rounded-lg font-semibold transition-all duration-300;
}

.action-button.primary {
  @apply bg-blue-500 text-white hover:bg-blue-600;
}

.action-button.secondary {
  @apply bg-purple-500 text-white hover:bg-purple-600;
}

circle {
  transition: stroke-dashoffset 0.5s ease;
  transform: rotate(-90deg);
  transform-origin: 50% 50%;
}

@keyframes float {
  0%, 100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-10px);
  }
}

@keyframes wave {
  0%, 100% {
    transform: scale(1);
    opacity: 0.5;
  }
  50% {
    transform: scale(1.2);
    opacity: 1;
  }
}

.animate-wave {
  animation: wave 2s infinite;
}
</style>
