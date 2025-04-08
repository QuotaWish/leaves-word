<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref, watch } from 'vue'
import { useDark } from '@vueuse/core'
import * as echarts from 'echarts'
import { useErrorAudio, useSuccessAudio } from '~/composables/words'
import { pronounceWords } from '~/composables/pronounce'
import TouchDialog from '~/components/dialog/TouchDialog.vue'

const router = useRouter()
const isDark = useDark()

interface IPronounceData {
  index: number,
  scores: number[],
  mistakes: { [key: string]: string[] },
}

const pronounceData = useLocalStorage<IPronounceData>('pronounceData', {
  index: 0,
  scores: [],
  mistakes: {},
})

const {
  isSupported,
  isListening,
  result,
  start,
  stop,
} = useSpeechRecognition()

const currentData = computed(() => pronounceWords?.[pronounceData.value.index || 0])

interface IWordAnalysis {
  correct: boolean,
  originalChar: string,
  spokenChar: string,
  type: 'correct' | 'wrong' | 'missing' | 'extra',
}

interface IAIAnalysisDetails {
  wordAnalysis: IWordAnalysis[],
  accuracy: number,
  vowelIssues: string[],
  consonantIssues: string[],
  rhythmIssues: string[],
  suggestions: string[],
}

// 录音状态管理
const recordingState = ref<'idle' | 'recording' | 'processing'>('idle')
const audioContext = ref<AudioContext | null>(null)
const mediaRecorder = ref<MediaRecorder | null>(null)
const audioChunks = ref<Blob[]>([])

// AI分析状态
const aiAnalysisState = ref<'idle' | 'analyzing' | 'complete'>('idle')
const pronunciationScore = ref(0)
const showScoreCard = ref(false)
const mouthAnimation = ref<'closed' | 'slightly-open' | 'wide-open'>('closed')
const aiAnalysisDetails = ref<IAIAnalysisDetails>({
  wordAnalysis: [],
  accuracy: 0,
  vowelIssues: [],
  consonantIssues: [],
  rhythmIssues: [],
  suggestions: [],
})

// 切换录音状态
async function toggleRecording() {
  if (isListening) {
    await stopRecording()
  } else {
    await startRecording()
  }
}

// 初始化录音功能
async function initRecording() {
  try {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
    audioContext.value = new AudioContext()
    mediaRecorder.value = new MediaRecorder(stream)

    mediaRecorder.value.ondataavailable = (event) => {
      audioChunks.value.push(event.data)
    }

    mediaRecorder.value.onstop = async () => {
      await analyzePronunciation()
      audioChunks.value = []
    }
  } catch (err) {
    console.error('录音初始化失败:', err)
    showNotification('无法访问麦克风', 'warning')
  }
}

// 开始录音
async function startRecording() {
  if (!mediaRecorder.value) {
    await initRecording()
    return
  }

  showScoreCard.value = false
  aiAnalysisState.value = 'idle'
  mouthAnimation.value = pronunciationTips.value.animation
  recordingState.value = 'recording'
  audioChunks.value = []
  mediaRecorder.value.start()
  start()
  showNotification('AI助手正在聆听...', 'info')
}

// 停止录音
async function stopRecording() {
  if (!mediaRecorder.value || !isListening) {
    return
  }

  recordingState.value = 'processing'
  mediaRecorder.value.stop()
  stop()

  try {
    const result = await analyzePronunciation()
    if (result.score > 80) {
      showNotification('发音非常棒！', 'success')
    } else if (result.score > 60) {
      showNotification('发音还不错，继续努力！', 'info')
    } else {
      showNotification('需要多加练习哦', 'warning')
    }
  } catch {
    showNotification('分析发音时出现错误', 'warning')
  }
}

// ... 其他现有代码 ...

</script>

<template>
  <PageNavHolder :content-padding="false" title="发音训练">
    <div class="PronouncePage-Main" :class="{ listening: isListening, dark: isDark }">
      <!-- ... 其他UI元素 ... -->

      <div class="PronouncePage-Button"
           :class="{ active: isListening }"
           @click="toggleRecording">
        <span>
          {{ isListening ? '停止录音' : '开始录音' }}
        </span>
      </div>

      <!-- ... 其他UI元素 ... -->
    </div>
  </PageNavHolder>
</template>

<style lang="scss">
// ... 现有样式 ...

.PronouncePage-Button {
  z-index: 2;
  position: relative;
  margin: 1.5rem auto;
  display: flex;
  width: 120px;
  height: 120px;
  user-select: none;
  align-items: center;
  justify-content: center;
  box-shadow: 0 4px 16px rgba(var(--el-color-primary-rgb), 0.3);
  border-radius: 50%;
  background: var(--el-color-primary);
  color: white;
  font-size: 18px;
  font-weight: 600;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  cursor: pointer;

  &:hover {
    transform: scale(1.05);
  }

  &:active,
  &.active {
    transform: scale(0.95);
  }

  &.active {
    animation: recordingPulse 2s infinite;
  }
}

@keyframes recordingPulse {
  0% {
    box-shadow: 0 0 0 0 rgba(var(--el-color-primary-rgb), 0.4);
  }
  70% {
    box-shadow: 0 0 0 20px rgba(var(--el-color-primary-rgb), 0);
  }
  100% {
    box-shadow: 0 0 0 0 rgba(var(--el-color-primary-rgb), 0);
  }
}
</style>
