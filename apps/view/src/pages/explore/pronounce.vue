<script setup lang="ts">
import NumberFlow from '@number-flow/vue'
import { ElMessage } from 'element-plus'
import { computed, onMounted, ref, watch } from 'vue'
import { pronounceWords } from '~/composables/pronounce'
import { usePronunciationAnalysis } from '~/composables/usePronunciationAnalysis'
import { useErrorAudio, useSuccessAudio } from '~/modules/words'

const router = useRouter()
const isDark = useDark()

interface IPronounceData {
  index: number
  scores: number[]
  mistakes: { [key: string]: string[] }
  wordTimes: { [key: string]: number }
}

const pronounceData = useLocalStorage<IPronounceData>('pronounceData', {
  index: 0,
  scores: [],
  mistakes: {},
  wordTimes: {},
})

const {
  isSupported,
  isListening,
  result: speechResult,
  start,
  stop,
} = useSpeechRecognition({
  continuous: true,
  interimResults: true,
})

// 添加识别状态
const recognitionStatus = ref<'idle' | 'listening' | 'no-speech' | 'error'>('idle')

// 监听识别结果
watch(speechResult, (newResult) => {
  if (newResult && newResult.length > 0) {
    recognitionStatus.value = 'listening'
  } else {
    recognitionStatus.value = 'no-speech'
  }
})

const currentData = computed(() => {
  if (!pronounceWords || !pronounceWords.length) {
    return {
      word: '',
      phonetic: '',
    }
  }
  return pronounceWords[pronounceData.value.index || 0] || {
    word: '',
    phonetic: '',
  }
})

// 当前单词开始练习的时间
const wordStartTime = ref<number>(0)

interface IWordAnalysis {
  correct: boolean
  originalChar: string
  spokenChar: string
  type: 'correct' | 'wrong' | 'missing' | 'extra'
}

interface IAIAnalysisDetails {
  wordAnalysis: IWordAnalysis[];
  accuracy: number;
  vowelIssues: string[];
  consonantIssues: string[];
  rhythmIssues: string[];
  suggestions: string[];
}

// 录音状态管理
const recordingState = ref<'idle' | 'recording' | 'processing'>('idle')
const audioContext = ref<AudioContext | null>(null)
const mediaRecorder = ref<MediaRecorder | null>(null)

// AI分析状态
const {
  aiAnalysisState,
  pronunciationScore,
  showScoreCard,
  aiAnalysisDetails,
  analyzePronunciation,
  mouthAnimation,
} = usePronunciationAnalysis()

interface IPronunciationTip {
  text: string,
  animation: 'closed' | 'slightly-open' | 'wide-open',
  soundType: string,
  aiTip: string,
}

// 发音技巧
const pronunciationTips = computed<IPronunciationTip>(() => {
  const word = currentData.value.word.toLowerCase()

  if (word.startsWith('a')) {
    return {
      text: '元音"a"发音时需要张大嘴巴，保持口腔空间充足',
      animation: 'wide-open',
      soundType: '元音',
      aiTip: 'AI检测到元音"a"的发音需要特别注意口腔开度',
    }
  }

  if (word.startsWith('e')) {
    return {
      text: '元音"e"发音时嘴角略微向两侧拉伸，保持微笑状',
      animation: 'slightly-open',
      soundType: '元音',
      aiTip: 'AI建议保持微笑状发音，有助于准确发出"e"音',
    }
  }

  if (word.startsWith('o')) {
    return {
      text: '元音"o"发音时嘴唇呈圆形，保持圆形口型',
      animation: 'slightly-open',
      soundType: '元音',
      aiTip: 'AI提示圆形口型对"o"音发音至关重要',
    }
  }

  if (word.startsWith('t') || word.startsWith('d')) {
    return {
      text: '舌尖抵住上齿龈发音，注意爆破音',
      animation: 'slightly-open',
      soundType: '辅音',
      aiTip: 'AI检测到爆破音需要特别注意舌尖位置',
    }
  }

  if (word.startsWith('p') || word.startsWith('b')) {
    return {
      text: '双唇闭合然后突然张开，注意气流',
      animation: 'closed',
      soundType: '辅音',
      aiTip: 'AI建议注意气流控制，确保爆破音清晰',
    }
  }

  return {
    text: '清晰发音每个音节，注意重音位置',
    animation: 'slightly-open',
    soundType: '混合',
    aiTip: 'AI将实时分析您的发音准确度',
  }
})

onMounted(() => {
  if (!isSupported.value) {
    ElMessage.error('浏览器不支持语音识别!')
    router.push('/')
    return
  }

  if (!pronounceWords || !pronounceWords.length) {
    ElMessage.error('未找到发音数据!')
    router.push('/')
    return
  }

  // 检测暗色模式
  const htmlElement = document.documentElement
  if (isDark.value) {
    htmlElement.classList.add('dark')
  }
})

// 监听暗色模式变化
watch(isDark, (newValue) => {
  const htmlElement = document.documentElement
  if (newValue) {
    htmlElement.classList.add('dark')
  } else {
    htmlElement.classList.remove('dark')
  }
})

interface AINotification {
  show: boolean
  type: 'success' | 'warning' | 'info'
  message: string
}

const aiNotification = ref<AINotification>({
  show: false,
  type: 'info',
  message: '',
})

function showNotification(message: string, type: 'success' | 'warning' | 'info' = 'info', duration = 3000) {
  aiNotification.value = {
    show: true,
    type,
    message,
  }
  setTimeout(() => {
    aiNotification.value.show = false
  }, duration)
}

// 音频实例
const successAudio = useSuccessAudio()
const errorAudio = useErrorAudio()

// 录音状态管理
const isRecording = ref(false)

// 处理鼠标移出按钮的情况
function handleMouseLeave() {
  if (isRecording.value) {
    stopRecording()
  }
}

// 初始化录音功能
async function initRecording() {
  try {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
    audioContext.value = new AudioContext()
    mediaRecorder.value = new MediaRecorder(stream)

    mediaRecorder.value.ondataavailable = () => {
      // 不再需要存储音频数据
    }

    mediaRecorder.value.onstop = async () => {
      // 直接使用语音识别结果
      const spokenText = speechResult.value?.[0] || ''
      if (spokenText) {
        await analyzePronunciation(currentData.value.word, spokenText)
      }
    }
  } catch (err) {
    console.error('录音初始化失败:', err)
    showNotification('无法访问麦克风', 'warning')
  }
}

async function startRecording() {
  if (isRecording.value) {
    return
  }

  try {
    if (!mediaRecorder.value) {
      await initRecording()
    }

    isRecording.value = true
    showScoreCard.value = false
    aiAnalysisState.value = 'idle'
    mouthAnimation.value = pronunciationTips.value.animation
    recordingState.value = 'recording'
    wordStartTime.value = Date.now()

    if (mediaRecorder.value && mediaRecorder.value.state === 'inactive') {
      mediaRecorder.value.start()
      start()
      showNotification('AI助手正在聆听...', 'info')
    }
  } catch (err) {
    console.error('开始录音失败:', err)
    showNotification('录音初始化失败，请检查麦克风权限', 'warning')
    isRecording.value = false
  }
}

// 模拟数据生成器
const mockDataGenerator = {
  // 生成分析结果
  generateAnalysisResult(word: string) {
    const score = Math.floor(Math.random() * 40) + 60 // 60-100之间的分数
    const timeSpent = Math.floor(Math.random() * 5000) + 2000 // 2-7秒

    // 生成每个字母的分析结果
    const wordAnalysis = word.split('').map((char, index) => {
      const randomValue = Math.random()
      let type: 'correct' | 'wrong' | 'missing' | 'extra'
      let spokenChar: string

      if (randomValue > 0.8) { // 20% 概率发音错误
        type = 'wrong'
        // 根据常见的发音错误模式生成错误的发音
        const commonMistakes: { [key: string]: string[] } = {
          'a': ['e', 'ə'],
          'e': ['i', 'ɪ'],
          'i': ['ɪ', 'e'],
          'o': ['ɔ', 'ə'],
          'u': ['ʊ', 'ə'],
          't': ['d'],
          'd': ['t'],
          'p': ['b'],
          'b': ['p'],
          's': ['z'],
          'z': ['s'],
        }
        spokenChar = commonMistakes[char.toLowerCase()]
          ? commonMistakes[char.toLowerCase()][Math.floor(Math.random() * commonMistakes[char.toLowerCase()].length)]
          : char
      } else if (randomValue > 0.95) { // 5% 概率漏读
        type = 'missing'
        spokenChar = ''
      } else if (randomValue > 0.9 && index > 0) { // 5% 概率多读（不在第一个字母）
        type = 'extra'
        spokenChar = char + char // 重复发音
      } else { // 70% 概率正确
        type = 'correct'
        spokenChar = char
      }

      return {
        correct: type === 'correct',
        originalChar: char,
        spokenChar: spokenChar,
        type: type,
      }
    })

    // 计算准确率
    const accuracy = (wordAnalysis.filter(char => char.type === 'correct').length / word.length) * 100

    // 根据分析结果生成具体的发音问题
    const vowelIssues: string[] = []
    const consonantIssues: string[] = []
    const rhythmIssues: string[] = []

    // 检查元音问题
    if (wordAnalysis.some(char => 'aeiou'.includes(char.originalChar.toLowerCase()) && char.type !== 'correct')) {
      vowelIssues.push('元音发音不够准确')
    }

    // 检查辅音问题
    if (wordAnalysis.some(char => !'aeiou'.includes(char.originalChar.toLowerCase()) && char.type !== 'correct')) {
      consonantIssues.push('辅音发音需要加强')
    }

    // 检查节奏问题
    if (wordAnalysis.some(char => char.type === 'missing')) {
      rhythmIssues.push('存在漏读音节')
    } else if (wordAnalysis.some(char => char.type === 'extra')) {
      rhythmIssues.push('存在重复发音')
    }

    // 生成建议
    const suggestions = []
    if (vowelIssues.length > 0) {
      suggestions.push('注意元音发音的准确度，保持口型到位')
    }
    if (consonantIssues.length > 0) {
      suggestions.push('加强辅音发音的清晰度，注意气流控制')
    }
    if (rhythmIssues.length > 0) {
      suggestions.push('保持发音节奏的稳定，避免漏读或重复')
    }
    if (suggestions.length === 0) {
      suggestions.push('继续保持良好的发音习惯')
    }

    return {
      score,
      timeSpent,
      wordAnalysis,
      accuracy,
      vowelIssues,
      consonantIssues,
      rhythmIssues,
      suggestions: suggestions.slice(0, 2), // 最多显示两条建议
    }
  },

  // 生成练习数据
  generatePracticeData() {
    return {
      scores: Array.from({ length: 10 }, () => Math.floor(Math.random() * 40) + 60),
      mistakes: Array.from({ length: 3 }, () => ({
        word: 'test',
        count: Math.floor(Math.random() * 5) + 1,
      })),
      wordTimes: Array.from({ length: 10 }, () => Math.floor(Math.random() * 5000) + 2000),
    }
  },
}

// 修改 stopRecording 函数
async function stopRecording() {
  if (!isRecording.value) return

  try {
    isRecording.value = false
    recordingState.value = 'processing'

    if (mediaRecorder.value && mediaRecorder.value.state === 'recording') {
      mediaRecorder.value.stop()
      stop()
    }

    const spokenText = speechResult.value?.[0] || ''

    if (!spokenText) {
      showNotification('未能识别到语音内容，请重新尝试', 'warning')
      recordingState.value = 'idle'
      showScoreCard.value = true
      return
    }

    try {
      // 使用模拟数据
      const mockResult = mockDataGenerator.generateAnalysisResult(currentData.value.word)

      // 更新状态
      pronunciationScore.value = mockResult.score
      aiAnalysisDetails.value = mockResult

      showScoreCard.value = true
      isRecording.value = false
      recordingState.value = 'idle'
      recognitionStatus.value = 'idle'

      if (mockResult.score > 80) {
        showNotification('发音非常棒！继续保持', 'success')
        successAudio?.play()
      } else if (mockResult.score > 60) {
        showNotification('发音还不错，继续努力！', 'info')
      } else {
        showNotification('需要多加练习哦，再试一次', 'warning')
        errorAudio?.play()
      }
    } catch (error) {
      console.error('分析发音失败:', error)
      showNotification('分析发音时出现错误，请重试', 'warning')
      showScoreCard.value = true
    }
  } catch (err) {
    console.error('停止录音失败:', err)
    showNotification('停止录音失败，请检查麦克风权限', 'warning')
  }
}

// 修改统计数据的计算属性
const practiceStats = computed(() => {
  const mockData = mockDataGenerator.generatePracticeData()
  return {
    totalPracticed: mockData.scores.length,
    averageScore: Math.floor(mockData.scores.reduce((a, b) => a + b, 0) / mockData.scores.length),
    needReview: mockData.mistakes.length,
    currentWordTime: mockData.wordTimes[0],
  }
})

// 更新嘴型动画状态
function updateMouthAnimation(phoneme: string) {
  const mouth = document.querySelector('.mouth') as HTMLElement
  if (mouth) {
    mouth.classList.add('animated')
    // 根据音素调整嘴型
    switch (phoneme.toLowerCase()) {
      case 'a':
        mouth.style.height = '40px'
        mouth.style.width = '30px'
        break
      case 'e':
        mouth.style.height = '20px'
        mouth.style.width = '40px'
        break
      case 'i':
        mouth.style.height = '15px'
        mouth.style.width = '45px'
        break
      case 'o':
        mouth.style.height = '35px'
        mouth.style.width = '35px'
        break
      case 'u':
        mouth.style.height = '20px'
        mouth.style.width = '25px'
        break
      default:
        mouth.style.height = '25px'
        mouth.style.width = '35px'
    }
    setTimeout(() => {
      mouth.classList.remove('animated')
    }, 300)
  }
}
</script>

<template>
  <PageNavHolder title="发音训练">
    <div class="PronouncePage-Main">
      <div class="PronouncePage-Instructions">
        <p>点击“开始”按钮，然后大声朗读显示的单词。</p>
        <p>松开按钮后，系统会判断你的发音是否正确。</p>
      </div>

      <div class="PronouncePage-MainCard fake-background">
        <div class="pronunciation-animation">
          <div class="mouth" :class="[mouthAnimation, { animated: isListening }]" />
          <div v-if="isListening" class="ai-wave">
            <div v-for="i in 5" :key="i" class="wave-bar" />
          </div>
        </div>
        <p class="word">
          {{ currentData.word }}
        </p>
        <p class="phonetic">
          {{ currentData.phonetic }}
        </p>
      </div>

      <div class="PronouncePage-Button transition-cubic" @touchstart="handleStart">
        <span v-if="!isListening">
          开 始
        </span>
        <span v-else-if="recognitionStatus === 'no-speech'" class="status-text warning">
          <i class="el-icon-warning" /> 未检测到语音，请说话...
        </span>
        <span v-else-if="recognitionStatus === 'error'" class="status-text error">
          <i class="el-icon-error" /> 识别出错，请重试
        </span>
      </div>

      <div font-bold class="PronouncePage-StatusBar">
        <NumberFlow suffix="/50" :continuous="true" :will-change="true" :animated="true" :value="pronounceData.index + 1" />
      </div>
    </div>
  </PageNavHolder>
</template>

<style lang="scss">
.PronouncePage-Instructions {
  text-align: center;
  margin-bottom: 1rem;
  p {
    font-size: 16px;
    color: var(--el-text-color-secondary);
  }
}

.PronouncePage-Button {
  .listening & {
    &::before {
      animation: wavingButton 1s infinite;
    }
    animation: buttonShaving 2s infinite;
    box-shadow: 0 0 16px 4px var(--el-color-primary);
  }

  &::before {
    z-index: -1;
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    border-radius: 50%;
    background-color: var(--el-color-primary);
  }
  z-index: 1;
  position: relative;
  margin: 1rem auto;
  display: flex;
  width: 96px;
  height: 96px;
  user-select: none;
  align-items: center;
  justify-content: center;
  box-shadow: 0 0 10px 0 var(--el-color-primary);
  border-radius: 50%;
  background-color: var(--el-color-primary);
  transition: transform 0.3s ease;
  &:active {
    transform: scale(0.95);
  }
}

@keyframes buttonShaving {
  0%,
  100% {
    transform: scale(1.25);
  }
  50% {
    transform: scale(1);
  }
}

@keyframes wavingButton {
  to {
    opacity: 0;
    transform: scale(1.5);
  }
}

.PronouncePage-MainCard {
  .word {
    font-size: 22px;
    font-weight: 600;
  }
  .phonetic {
    font-size: 18px;
    margin: 0.5rem 0;
    color: var(--el-text-color-primary);
  }
  position: relative;
  display: flex;
  padding: 1rem;
  margin: 0 auto;
  height: 200px;
  width: 90%;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  border-radius: 25px;
  background-color: var(--el-bg-color-page);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.PronouncePage-Main {
  position: relative;
  display: flex;
  margin: auto;
  width: 100%;
  gap: 3rem;
  align-items: center;
  flex-direction: column;
}

.PronouncePage {
  position: relative;
  display: flex;
  width: 100%;
  height: 100%;
  align-items: center;
  flex-direction: column;
  // background-color: var(--el-bg-color-page);
}

@keyframes ai-pulse {
  0% {
    box-shadow: 0 0 0 0 rgba(22, 119, 255, 0.6);
  }
  70% {
    box-shadow: 0 0 0 10px rgba(22, 119, 255, 0);
  }
  100% {
    box-shadow: 0 0 0 0 rgba(22, 119, 255, 0);
  }
}

@keyframes ai-dots {
  0%,
  100% {
    opacity: 0.4;
    transform: scale(0.8);
  }
  50% {
    opacity: 1;
    transform: scale(1.2);
  }
}

@keyframes mouthAnimation {
  0% {
    transform: scaleY(0.95);
  }
  50% {
    transform: scaleY(1.05);
  }
  100% {
    transform: scaleY(0.95);
  }
}

@keyframes floatCircle {
  0% {
    transform: translate(0, 0);
  }
  100% {
    transform: translate(30px, 30px);
  }
}

.score-slide-enter-active,
.score-slide-leave-active {
  transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
}

.score-slide-enter-from,
.score-slide-leave-to {
  transform: translateY(20px);
  opacity: 0;
}
</style>
