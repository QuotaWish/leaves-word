<script setup lang="ts">
<<<<<<< HEAD
import { useDark } from '@vueuse/core'
// import NumberFlow from '@number-flow/vue'
=======
import NumberFlow from '@number-flow/vue'
>>>>>>> c690622aed9868d7e15b1acafefee3230924cc74
import { ElMessage } from 'element-plus'
import { computed, onMounted, ref, watch } from 'vue'
import { pronounceWords } from '~/composables/pronounce'
import { usePronunciationAnalysis } from '~/composables/usePronunciationAnalysis'
import { useErrorAudio, useSuccessAudio } from '~/composables/words'

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
<<<<<<< HEAD
  <PageNavHolder :content-padding="false" title="发音训练">
    <div class="PronouncePage-Main" :class="{ listening: isListening, dark: isDark }">
      <div class="ai-blur-circle left" />
      <div class="ai-blur-circle right" />
      <div class="ai-blur-circle center" />
      <div class="bubble" />
      <div class="bubble" />
      <div class="bubble" />
      <div class="bubble" />
      <div class="bubble" />

      <!-- AI通知 -->
      <Transition name="ai-notification">
        <div
          v-if="aiNotification.show"
          class="AINotification"
          :class="aiNotification.type"
        >
          <div class="ai-notification-icon">
            <i v-if="aiNotification.type === 'success'" class="el-icon-check" />
            <i v-else-if="aiNotification.type === 'warning'" class="el-icon-warning" />
            <i v-else class="el-icon-info" />
          </div>
          <span class="ai-notification-message">{{ aiNotification.message }}</span>
          <div class="ai-notification-progress" />
        </div>
      </Transition>

      <!-- AI能量场 -->
      <div class="ai-energy-field" :class="{ active: isListening }">
        <div class="energy-ring" />
        <div class="energy-ring" />
        <div class="energy-ring" />
      </div>

      <div class="PronouncePage-Progress">
        <div class="progress-bar">
          <div class="progress-fill" :style="{ width: `${(pronounceData.index / pronounceWords.length) * 100}%` }" />
        </div>
        <div class="progress-text">
          <span class="current">{{ pronounceData.index + 1 }}</span>
          <span class="total">/50</span>
        </div>
      </div>

      <div class="PronouncePage-AIAssistant fake-background">
        <div class="ai-icon-container">
          <div class="ai-icon" :class="{ pulse: aiAnalysisState === 'analyzing' }">
            <div class="ai-core" />
            <div class="ai-ring" />
            <div v-if="aiAnalysisState === 'analyzing'" class="ai-dots">
              <span /><span /><span />
            </div>
            <i v-else-if="aiAnalysisState === 'complete'" class="el-icon-check" />
            <i v-else class="el-icon-mic" />
          </div>
        </div>
        <div class="ai-tip-container">
          <div class="ai-tip">
            <p class="sound-type">
              {{ pronunciationTips.soundType }}发音技巧
            </p>
            <p class="tip-content">
              {{ pronunciationTips.text }}
            </p>
            <p class="ai-tip-text">
              {{ pronunciationTips.aiTip }}
            </p>
          </div>
        </div>
=======
  <PageNavHolder title="发音训练">
    <div class="PronouncePage-Main">
      <div class="PronouncePage-Instructions">
        <p>点击“开始”按钮，然后大声朗读显示的单词。</p>
        <p>松开按钮后，系统会判断你的发音是否正确。</p>
>>>>>>> c690622aed9868d7e15b1acafefee3230924cc74
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

<<<<<<< HEAD
      <!-- 移动状态提示到按钮上方 -->
      <div v-if="isRecording" class="recognition-status">
        <span v-if="recognitionStatus === 'listening'" class="status-text listening">
          <i class="el-icon-microphone" /> 正在聆听...
=======
      <div class="PronouncePage-Button transition-cubic" @touchstart="handleStart">
        <span v-if="!isListening">
          开 始
>>>>>>> c690622aed9868d7e15b1acafefee3230924cc74
        </span>
        <span v-else-if="recognitionStatus === 'no-speech'" class="status-text warning">
          <i class="el-icon-warning" /> 未检测到语音，请说话...
        </span>
        <span v-else-if="recognitionStatus === 'error'" class="status-text error">
          <i class="el-icon-error" /> 识别出错，请重试
        </span>
      </div>

<<<<<<< HEAD
      <div
        class="PronouncePage-Button"
        :class="{ active: isListening }"
        @touchstart.prevent="startRecording"
        @touchend.prevent="stopRecording"
        @mousedown.prevent="startRecording"
        @mouseup.prevent="stopRecording"
        @mouseleave.prevent="handleMouseLeave"
      >
        <span v-if="!isListening">
          开始录音
        </span>
        <span v-else>
          停止录音
        </span>
      </div>

      <transition name="score-slide">
        <div v-if="showScoreCard" class="ScoreCard fake-background">
          <div class="score-content">
            <div class="score-header">
              AI发音评估
            </div>
            <div class="score-stats">
              <div class="score-circle">
                <div class="score-value">
                  {{ pronunciationScore || '0' }}
                </div>
                <div class="score-label">
                  分
                </div>
                <svg class="score-ring" width="120" height="120" viewBox="0 0 120 120">
                  <defs>
                    <linearGradient id="score-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                      <stop offset="0%" stop-color="#1677ff" />
                      <stop offset="100%" stop-color="#4096ff" />
                    </linearGradient>
                  </defs>
                  <circle class="score-ring-bg" cx="60" cy="60" r="54" />
                  <circle
                    class="score-ring-progress"
                    cx="60"
                    cy="60"
                    r="54"
                    :style="{ 'stroke-dashoffset': `${(100 - (pronunciationScore || 0)) * 3.4}` }"
                  />
                </svg>
              </div>

              <!-- 统计数据 -->
              <div class="stats-grid">
                <div class="stat-item">
                  <div class="stat-value">
                    {{ pronounceData.index + 1 }}/{{ pronounceWords.length }}
                  </div>
                  <div class="stat-label">
                    进度
                  </div>
                </div>
                <div class="stat-item">
                  <div class="stat-value">
                    {{ Math.floor(practiceStats.currentWordTime / 1000) }}s
                  </div>
                  <div class="stat-label">
                    本次用时
                  </div>
                </div>
                <div class="stat-item">
                  <div class="stat-value">
                    {{ practiceStats.totalPracticed }}
                  </div>
                  <div class="stat-label">
                    已练习
                  </div>
                </div>
                <div class="stat-item">
                  <div class="stat-value">
                    {{ practiceStats.needReview }}
                  </div>
                  <div class="stat-label">
                    需复习
                  </div>
                </div>
              </div>
            </div>

            <!-- 单词分析 -->
            <div class="word-analysis-section">
              <h3 class="section-title">
                <span class="icon">📝</span>
                单词分析
              </h3>
              <div class="word-analysis">
                <div class="char-comparison">
                  <div
                    v-for="(char, index) in aiAnalysisDetails.wordAnalysis"
                    :key="index"
                    class="char-item"
                    :class="[char.type, { 'has-error': char.type !== 'correct' }]"
                  >
                    <div class="char-content">
                      <div class="original" :class="{ empty: !char.originalChar }">
                        {{ char.originalChar || '⚋' }}
                      </div>
                      <div class="comparison-arrow">
                        <span class="arrow-line" />
                        <span class="arrow-head">▼</span>
                      </div>
                      <div class="spoken" :class="{ empty: !char.spokenChar }">
                        {{ char.spokenChar || '⚋' }}
                      </div>
                    </div>
                    <div class="status-icon">
                      <i v-if="char.type === 'correct'" class="el-icon-check" />
                      <i v-else-if="char.type === 'wrong'" class="el-icon-close" />
                      <i v-else-if="char.type === 'missing'" class="el-icon-minus" />
                      <i v-else class="el-icon-plus" />
                    </div>
                    <div class="char-type-label">
                      <span v-if="char.type === 'correct'">正确</span>
                      <span v-else-if="char.type === 'wrong'">错误</span>
                      <span v-else-if="char.type === 'missing'">缺失</span>
                      <span v-else>多余</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- 问题分析 -->
            <div class="ai-analysis-details">
              <div v-if="aiAnalysisDetails.vowelIssues.length" class="analysis-section">
                <h4>
                  <span class="icon">🔊</span>
                  元音问题
                </h4>
                <ul>
                  <li v-for="issue in aiAnalysisDetails.vowelIssues" :key="issue">
                    {{ issue }}
                  </li>
                </ul>
              </div>
              <div v-if="aiAnalysisDetails.consonantIssues.length" class="analysis-section">
                <h4>
                  <span class="icon">👄</span>
                  辅音问题
                </h4>
                <ul>
                  <li v-for="issue in aiAnalysisDetails.consonantIssues" :key="issue">
                    {{ issue }}
                  </li>
                </ul>
              </div>
              <div v-if="aiAnalysisDetails.rhythmIssues.length" class="analysis-section">
                <h4>
                  <span class="icon">🎵</span>
                  节奏问题
                </h4>
                <ul>
                  <li v-for="issue in aiAnalysisDetails.rhythmIssues" :key="issue">
                    {{ issue }}
                  </li>
                </ul>
              </div>
            </div>

            <!-- AI建议 -->
            <div class="score-feedback">
              <h3 class="section-title">
                <span class="icon">💡</span>
                AI建议
              </h3>
              <div class="feedback-list">
                <template v-if="!(pronunciationScore ?? 0)">
                  <div
                    class="feedback-item">无法识别到音频，请重新朗读。</div>
                </template>
                <template v-else>
                  <div
                    v-for="(suggestion, index) in aiAnalysisDetails.suggestions"
                    :key="index"
                    class="feedback-item"
                  >
                    {{ suggestion }}
                  </div>
                </template>
              </div>
            </div>
          </div>

          <!-- 固定在底部的按钮 -->
          <div class="score-actions">
            <button class="action-button retry" @click="showScoreCard = false">
              <i class="el-icon-refresh-right" />
              重新练习
            </button>
            <button
              v-if="pronunciationScore >= 80"
              class="action-button next"
              @click="pronounceData.index++; showScoreCard = false"
            >
              <i class="el-icon-arrow-right" />
              下一题
            </button>
          </div>
        </div>
      </transition>
=======
      <div font-bold class="PronouncePage-StatusBar">
        <NumberFlow suffix="/50" :continuous="true" :will-change="true" :animated="true" :value="pronounceData.index + 1" />
      </div>
>>>>>>> c690622aed9868d7e15b1acafefee3230924cc74
    </div>
  </PageNavHolder>
</template>

<style lang="scss">
<<<<<<< HEAD
.PronouncePage-Progress {
  width: 100%;
  padding: 1rem 1.5rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
  position: relative;
  z-index: 2;

  .progress-bar {
    width: 100%;
    height: 8px;
    background: rgba(22, 119, 255, 0.1);
    border-radius: 4px;
    overflow: hidden;
    backdrop-filter: blur(4px);

    .progress-fill {
      height: 100%;
      background: linear-gradient(90deg, #1677ff 0%, #4096ff 100%);
      transition: width 0.5s cubic-bezier(0.34, 1.56, 0.64, 1);
    }
  }

  .progress-text {
    display: flex;
    align-items: baseline;
    gap: 0.25rem;

    .current {
      font-size: 24px;
      font-weight: 600;
      color: #1677ff;
      text-shadow: 0 2px 8px rgba(22, 119, 255, 0.2);
    }

    .total {
      font-size: 16px;
      color: var(--el-text-color-secondary);
    }
  }
}

.PronouncePage-AIAssistant {
  display: flex;
  width: 90%;
  max-width: 400px;
  margin: 0 auto;
  padding: 12px;
  backdrop-filter: blur(8px);
  border-radius: 16px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  position: relative;
  z-index: 2;

  .ai-icon-container {
    flex-shrink: 0;

    .ai-icon {
      position: relative;
      width: 48px;
      height: 48px;
      border-radius: 50%;
      background: transparent;
      display: flex;
      align-items: center;
      justify-content: center;
      color: white;

      .ai-core {
        position: absolute;
        width: 32px;
        height: 32px;
        background: linear-gradient(135deg, #1677ff, #4096ff);
        border-radius: 50%;
        z-index: 1;
      }

      .ai-ring {
        position: absolute;
        width: 100%;
        height: 100%;
        border: 2px solid rgba(22, 119, 255, 0.3);
        border-radius: 50%;
        animation: ai-ring-rotate 4s linear infinite;

        &::before {
          content: '';
          position: absolute;
          top: -2px;
          left: -2px;
          width: calc(100% + 4px);
          height: calc(100% + 4px);
          border-radius: 50%;
          border: 2px solid transparent;
          border-top-color: #1677ff;
          animation: ai-ring-rotate 2s linear infinite;
        }
      }

      i {
        position: relative;
        z-index: 2;
        font-size: 20px;
      }

      &.pulse {
        .ai-core {
          animation: ai-core-pulse 1.5s ease-in-out infinite;
        }
      }
    }
  }

  .ai-tip-container {
    flex-grow: 1;
    padding-left: 12px;

    .ai-tip {
      .sound-type {
        font-size: 14px;
        font-weight: 600;
        color: #1677ff;
        margin-bottom: 4px;
      }

      .tip-content {
        font-size: 14px;
        color: var(--el-text-color-regular);
      }
    }
  }
}

.PronouncePage-MainCard {
  .word {
    font-size: 32px;
    font-weight: 700;
    margin-bottom: 0.5rem;
    background: linear-gradient(135deg, var(--el-color-primary) 0%, var(--el-color-primary-light-3) 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    animation: wordFadeIn 0.5s ease-out;
  }

  .phonetic {
    font-size: 20px;
    margin: 0.5rem 0;
    color: var(--el-text-color-secondary);
    opacity: 0.8;
  }

  .pronunciation-animation {
    margin-bottom: 16px;

    .mouth {
      width: 60px;
      height: 30px;
      background: var(--el-text-color-primary);
      border-radius: 0 0 30px 30px;
      margin: 0 auto;
      position: relative;
      transform-origin: top;
      transition: all 0.3s ease;

      &.closed {
        height: 5px;
        border-radius: 5px;
      }

      &.slightly-open {
        height: 15px;
      }

      &.wide-open {
        height: 30px;
      }

      &.animated {
        animation: mouthAnimation 1s infinite alternate;
      }

      &::before,
      &::after {
        content: '';
        position: absolute;
        top: -10px;
        width: 8px;
        height: 8px;
        background: var(--el-text-color-secondary);
        border-radius: 50%;
        transition: all 0.3s ease;
      }

      &::before {
        left: 15px;
      }

      &::after {
        right: 15px;
      }

      &.animated::before,
      &.animated::after {
        transform: scaleY(0.8);
      }
    }
  }

  position: relative;
  display: flex;
  padding: 2rem;
  margin: 1rem auto;
  height: 250px;
  width: 90%;
  max-width: 400px;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  border-radius: 25px;
  backdrop-filter: blur(12px);
  transition:
    transform 0.3s ease,
    box-shadow 0.3s ease;
  z-index: 2;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    border-radius: 25px;
    background: linear-gradient(135deg, rgba(255, 255, 255, 0.5), rgba(255, 255, 255, 0.2));
    z-index: -1;
  }

  .dark &::before {
    background: linear-gradient(135deg, rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.2));
  }

  // 添加霓虹光效果
  &::after {
    content: '';
    position: absolute;
    inset: -1px;
    background: linear-gradient(90deg, #4096ff, #1677ff, #4096ff);
    filter: blur(12px);
    mask:
      linear-gradient(#fff 0 0) content-box,
      linear-gradient(#fff 0 0);
    mask-composite: exclude;
    opacity: 0;
    transition: opacity 0.3s ease;
  }

  &:hover::after {
    opacity: 0.5;
  }
}

.ScoreCard {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  backdrop-filter: blur(18px) saturate(180%);
  border-radius: 24px 24px 0 0;
  z-index: 10;
  display: flex;
  flex-direction: column;
  height: 92%;
  max-height: 92%;
  background: rgba(255, 255, 255, 0.95);

  .score-header {
    font-size: 24px;
    font-weight: 600;
    color: transparent;
    background: linear-gradient(135deg, #1677ff, #4096ff, #1677ff);
    background-size: 200% auto;
    -webkit-background-clip: text;
    animation: shine 2s linear infinite;
    text-align: center;
    padding: 20px;
    position: relative;
    border-bottom: 1px solid rgba(0, 0, 0, 0.05);
    margin-bottom: 0;

    &::after {
      content: '';
      position: absolute;
      bottom: -1px;
      left: 50%;
      transform: translateX(-50%);
      width: 40px;
      height: 3px;
      background: linear-gradient(90deg, #1677ff, #4096ff);
      border-radius: 2px;
    }
  }

  .score-stats {
    padding: 20px;
    display: flex;
    flex-direction: column;
    gap: 24px;
  }

  .stats-grid {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 16px;
    padding: 16px;
    background: rgba(255, 255, 255, 0.05);
    border-radius: 16px;
    border: 1px solid rgba(255, 255, 255, 0.1);
  }

  .stat-item {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 4px;
    padding: 12px;
    background: rgba(255, 255, 255, 0.05);
    border-radius: 12px;
    transition: all 0.3s ease;

    &:hover {
      transform: translateY(-2px);
      background: rgba(255, 255, 255, 0.1);
    }

    .stat-value {
      font-size: 20px;
      font-weight: 600;
      background: linear-gradient(135deg, #1677ff, #4096ff);
      -webkit-background-clip: text;
      color: transparent;
    }

    .stat-label {
      font-size: 14px;
      color: rgba(255, 255, 255, 0.6);
    }
  }

  .score-circle {
    position: relative;
    width: 120px;
    height: 120px;
    margin: 0 auto;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;

    .score-value {
      font-size: 48px;
      font-weight: 700;
      background: linear-gradient(135deg, #1677ff, #4096ff);
      -webkit-background-clip: text;
      color: transparent;
      position: relative;
      z-index: 1;
    }

    .score-label {
      font-size: 16px;
      color: rgba(255, 255, 255, 0.6);
      margin-top: -8px;
    }
  }

  .word-analysis-section {
    margin: 24px 0;
    padding: 0 20px;
  }

  .section-title {
    font-size: 18px;
    font-weight: 600;
    color: white;
    margin-bottom: 16px;
    display: flex;
    align-items: center;
    gap: 8px;

    .icon {
      font-size: 20px;
    }
  }

  .feedback-list {
    display: flex;
    flex-direction: column;
    gap: 12px;
    padding: 16px;
    background: rgba(255, 255, 255, 0.05);
    border-radius: 16px;
    border: 1px solid rgba(255, 255, 255, 0.1);
  }

  .feedback-item {
    padding: 12px 16px;
    background: rgba(22, 119, 255, 0.1);
    border-radius: 8px;
    color: white;
    font-size: 14px;
    line-height: 1.5;
    border-left: 3px solid #1677ff;
    transition: all 0.3s ease;

    &:hover {
      transform: translateX(4px);
      background: rgba(22, 119, 255, 0.15);
    }
  }

  .score-actions {
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    display: flex;
    gap: 12px;
    padding: 16px 20px;
    background: inherit;
    backdrop-filter: blur(18px) saturate(180%);
    border-top: 1px solid rgba(255, 255, 255, 0.1);
    box-shadow: 0 -4px 16px rgba(0, 0, 0, 0.05);

    .action-button {
      flex: 1;
      padding: 12px;
      border: none;
      border-radius: 12px;
      font-size: 16px;
      font-weight: 500;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 8px;
      cursor: pointer;
      transition: all 0.3s ease;

      i {
        font-size: 20px;
      }

      &.retry {
        background: rgba(0, 0, 0, 0.05);
        color: var(--el-text-color-regular);

        &:hover {
          background: rgba(0, 0, 0, 0.1);
        }
      }

      &.next {
        background: linear-gradient(135deg, #1677ff, #4096ff);
        color: white;

        &:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(22, 119, 255, 0.3);
        }
      }
    }
  }

  // 暗色模式适配
  .dark & {
    background: rgba(26, 26, 46, 0.95);

    .score-header {
      background: linear-gradient(135deg, #64b5f6, #2196f3, #64b5f6);
      -webkit-background-clip: text;
      border-bottom-color: rgba(255, 255, 255, 0.1);
    }

    .score-circle {
      .score-value {
        background: linear-gradient(135deg, #64b5f6, #2196f3);
        -webkit-background-clip: text;
      }

      &::before {
        background: linear-gradient(135deg, rgba(100, 181, 246, 0.2), rgba(33, 150, 243, 0.2));
      }
    }

    .score-actions {
      border-top-color: rgba(255, 255, 255, 0.05);
      box-shadow: 0 -4px 16px rgba(0, 0, 0, 0.2);

      .action-button.retry {
        background: rgba(255, 255, 255, 0.1);
        color: rgba(255, 255, 255, 0.8);

        &:hover {
          background: rgba(255, 255, 255, 0.15);
        }
      }
    }
  }
}

@keyframes shine {
  to {
    background-position: 200% center;
  }
}

.PronouncePage-Main {
  position: relative;
  display: flex;
  margin: auto;
  width: 100%;
  height: 100%;
  gap: 1.5rem;
  align-items: center;
  flex-direction: column;
  overflow: hidden;
  padding: 1rem 0;
  background: linear-gradient(135deg, #f5f8ff, #edf3ff);

  &.dark {
    background: linear-gradient(135deg, #1a1a2e, #16213e);
  }
}

.ai-blur-circle {
  position: fixed;
  width: 300px;
  height: 300px;
  border-radius: 50%;
  filter: blur(80px);
  opacity: 0.6;
  z-index: 1;

  &.left {
    top: 10%;
    left: -100px;
    background: rgba(22, 119, 255, 0.15);
    animation: floatCircle 15s infinite alternate;
  }

  &.right {
    bottom: 10%;
    right: -100px;
    background: rgba(64, 150, 255, 0.15);
    animation: floatCircle 18s infinite alternate-reverse;
  }

  &.center {
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    background: rgba(147, 197, 253, 0.15);
    animation: centerPulse 8s infinite alternate;
  }
}

.PronouncePage-Main::before,
.PronouncePage-Main::after {
  content: '';
  position: fixed;
  bottom: -50px;
  width: 150px;
  height: 150px;
  border-radius: 50%;
  background: rgba(22, 119, 255, 0.1);
  filter: blur(5px);
  animation: bubbleFloat 8s infinite ease-in-out;
  z-index: 1;
}

.PronouncePage-Main::before {
  left: -50px;
  animation-delay: -4s;
}

.PronouncePage-Main::after {
  right: -50px;
}

@keyframes bubbleFloat {
  0%,
  100% {
    transform: translateY(0) scale(1);
  }
  50% {
    transform: translateY(-20px) scale(1.1);
  }
}

.bubble {
  position: fixed;
  bottom: -20px;
  width: 80px;
  height: 80px;
  border-radius: 50%;
  background: rgba(22, 119, 255, 0.08);
  animation: smallBubbleFloat 6s infinite ease-in-out;
  filter: blur(2px);
  z-index: 1;
}

.bubble:nth-child(1) {
  left: 10%;
  animation-delay: -2s;
}

.bubble:nth-child(2) {
  left: 30%;
  animation-delay: -1s;
}

.bubble:nth-child(3) {
  left: 50%;
  animation-delay: -3s;
}

.bubble:nth-child(4) {
  left: 70%;
  animation-delay: -4s;
}

.bubble:nth-child(5) {
  left: 90%;
  animation-delay: -2.5s;
}

@keyframes smallBubbleFloat {
  0%,
  100% {
    transform: translateY(0) scale(1);
  }
  50% {
    transform: translateY(-30px) scale(1.2);
  }
}

.PronouncePage-Button {
  .listening & {
    &::before {
      animation: wavingButton 1.2s infinite;
    }

    animation: buttonShaving 2s infinite;
    box-shadow: 0 0 24px 8px var(--el-color-primary);
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
    background: linear-gradient(135deg, var(--el-color-primary) 0%, var(--el-color-primary-light-3) 100%);
  }

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
  font-size: 16px;
  font-weight: 600;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);

  &:active,
  &.active {
    transform: scale(0.92);
  }
}

.ai-wave {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 4px;
  margin-top: 16px;

  .wave-bar {
    width: 4px;
    height: 20px;
    background: var(--el-color-primary);
    border-radius: 2px;
    animation: wave 1s infinite ease-in-out;

    @for $i from 1 through 5 {
      &:nth-child(#{$i}) {
        animation-delay: $i * 0.1s;
      }
    }
  }
}

.ai-analysis-details {
  width: 100%;
  margin: 16px 0;

  .analysis-section {
    background: rgba(22, 119, 255, 0.05);
    border-radius: 12px;
    padding: 12px;
    margin-bottom: 12px;

    h4 {
      color: var(--el-color-primary);
      margin: 0 0 8px;
      font-size: 16px;
    }

    ul {
      margin: 0;
      padding-left: 20px;

      li {
        color: var(--el-text-color-regular);
        margin: 4px 0;
        font-size: 14px;
      }
    }
  }
}

@keyframes wave {
  0%,
  100% {
    height: 20px;
  }
  50% {
    height: 40px;
  }
}

.AINotification {
  position: fixed;
  top: 20px;
  left: 50%;
  transform: translateX(-50%);
  padding: 12px 24px;
  border-radius: 12px;
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(12px);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.12);
  display: flex;
  align-items: center;
  gap: 12px;
  z-index: 100;
  overflow: hidden;

  &.success {
    background: rgba(82, 196, 26, 0.95);
    color: white;
  }

  &.warning {
    background: rgba(250, 173, 20, 0.95);
    color: white;
  }

  &.info {
    background: rgba(22, 119, 255, 0.95);
    color: white;
  }

  .ai-notification-icon {
    font-size: 20px;
  }

  .ai-notification-message {
    font-size: 15px;
    font-weight: 500;
  }

  .ai-notification-progress {
    position: absolute;
    bottom: 0;
    left: 0;
    height: 3px;
    background: rgba(255, 255, 255, 0.3);
    animation: notification-progress 3s linear;
  }
}

.ai-energy-field {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 100%;
  height: 100%;
  pointer-events: none;
  z-index: 1;
  opacity: 0;
  transition: opacity 0.3s ease;

  &.active {
    opacity: 1;
  }

  .energy-ring {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    border: 2px solid rgba(22, 119, 255, 0.1);
    border-radius: 50%;
    animation: energy-pulse 3s infinite;

    &:nth-child(1) {
      width: 200px;
      height: 200px;
      animation-delay: 0s;
    }

    &:nth-child(2) {
      width: 300px;
      height: 300px;
      animation-delay: 1s;
    }

    &:nth-child(3) {
      width: 400px;
      height: 400px;
      animation-delay: 2s;
    }
  }
}

@keyframes notification-progress {
  from {
    width: 100%;
  }
  to {
    width: 0;
  }
}

@keyframes energy-pulse {
  0% {
    transform: translate(-50%, -50%) scale(0.8);
    opacity: 0.6;
  }
  50% {
    transform: translate(-50%, -50%) scale(1);
    opacity: 0.3;
  }
  100% {
    transform: translate(-50%, -50%) scale(1.2);
    opacity: 0;
  }
}

.ai-notification-enter-active,
.ai-notification-leave-active {
  transition: all 0.2s cubic-bezier(0.34, 1.56, 0.64, 1);
}

.ai-notification-enter-from,
.ai-notification-leave-to {
  transform: translate(-50%, -10px);
  opacity: 0;
}

// 暗色模式增强
.PronouncePage-Main.dark {
  .AINotification {
    background: rgba(0, 0, 0, 0.8);

    &.success {
      background: rgba(82, 196, 26, 0.8);
    }

    &.warning {
      background: rgba(250, 173, 20, 0.8);
    }

    &.info {
      background: rgba(22, 119, 255, 0.8);
    }
  }

  .ai-energy-field .energy-ring {
    border-color: rgba(64, 150, 255, 0.1);
  }

  .PronouncePage-MainCard {
    // 暗色模式下的霓虹效果
    &::after {
      background: linear-gradient(90deg, #64b5f6, #2196f3, #64b5f6);
    }
  }
}

.score-actions {
  display: flex;
  gap: 12px;
  margin-top: 20px;
  padding: 0 20px;
  width: 100%;

  .action-button {
    flex: 1;
    padding: 12px;
    border: none;
    border-radius: 12px;
    font-size: 16px;
    font-weight: 500;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    cursor: pointer;
    transition: all 0.3s ease;

    i {
      font-size: 20px;
    }

    &.retry {
      background: rgba(0, 0, 0, 0.05);
      color: var(--el-text-color-regular);

      &:hover {
        background: rgba(0, 0, 0, 0.1);
      }
    }

    &.next {
      background: linear-gradient(135deg, #1677ff, #4096ff);
      color: white;

      &:hover {
        transform: translateY(-2px);
        box-shadow: 0 4px 12px rgba(22, 119, 255, 0.3);
      }
    }
  }
}

@keyframes ai-ring-rotate {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

@keyframes ai-core-pulse {
  0% {
    transform: scale(0.95);
    box-shadow: 0 0 0 0 rgba(22, 119, 255, 0.4);
  }
  70% {
    transform: scale(1);
    box-shadow: 0 0 0 10px rgba(22, 119, 255, 0);
  }
  100% {
    transform: scale(0.95);
    box-shadow: 0 0 0 0 rgba(22, 119, 255, 0);
  }
}

.word-analysis {
  width: 100%;
  margin: 20px 0;
  padding: 0 16px;

  .char-comparison {
    display: flex;
    flex-wrap: nowrap;
    gap: 12px;
    padding: 20px;
    background: rgba(255, 255, 255, 0.05);
    border-radius: 24px;
    backdrop-filter: blur(10px);
    border: 1px solid rgba(255, 255, 255, 0.1);
    position: relative;
    overflow-x: auto;
    overflow-y: hidden;
    -webkit-overflow-scrolling: touch;
    scrollbar-width: thin;
    scrollbar-color: rgba(22, 119, 255, 0.3) transparent;

    &::-webkit-scrollbar {
      height: 6px;
    }

    &::-webkit-scrollbar-track {
      background: transparent;
    }

    &::-webkit-scrollbar-thumb {
      background-color: rgba(22, 119, 255, 0.3);
      border-radius: 3px;
    }

    .char-item {
      flex: 0 0 auto;
      display: flex;
      flex-direction: column;
      align-items: center;
      padding: 12px;
      border-radius: 12px;
      background: rgba(255, 255, 255, 0.1);
      position: relative;
      min-width: 60px;
      z-index: 1;
      transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);

      .char-content {
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 8px;
        width: 100%;
      }

      .original,
      .spoken {
        font-size: 20px;
        font-weight: 600;
        height: 36px;
        width: 36px;
        display: flex;
        align-items: center;
        justify-content: center;
        border-radius: 8px;
        background: rgba(255, 255, 255, 0.1);
        transition: all 0.3s ease;

        &.empty {
          color: var(--el-text-color-secondary);
          opacity: 0.5;
        }
      }

      .comparison-arrow {
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 2px;
        height: 24px;
        padding: 2px 0;

        .arrow-line {
          width: 2px;
          height: 12px;
          background: currentColor;
          transition: height 0.3s ease;
        }

        .arrow-head {
          font-size: 12px;
          line-height: 1;
        }
      }

      .status-icon {
        position: absolute;
        top: -8px;
        right: -8px;
        width: 20px;
        height: 20px;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 12px;
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
        border: 1px solid white;
        transition: all 0.3s ease;
        z-index: 2;

        i {
          transform: scale(0.7);
        }
      }

      .char-type-label {
        position: absolute;
        top: -24px;
        left: 50%;
        transform: translateX(-50%) translateY(10px);
        background: white;
        padding: 2px 6px;
        border-radius: 8px;
        font-size: 10px;
        font-weight: 500;
        color: var(--el-text-color-primary);
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
        opacity: 0;
        transition: all 0.3s ease;
        white-space: nowrap;
      }
    }
  }
}

// 暗色模式适配
.dark {
  .word-analysis {
    .char-comparison {
      background: rgba(0, 0, 0, 0.2);
      border-color: rgba(255, 255, 255, 0.1);
      scrollbar-color: rgba(64, 150, 255, 0.3) transparent;

      &::-webkit-scrollbar-thumb {
        background-color: rgba(64, 150, 255, 0.3);
      }

      .char-item {
        background: rgba(255, 255, 255, 0.05);

        .original,
        .spoken {
          background: rgba(0, 0, 0, 0.2);
        }

        .char-type-label {
          background: rgba(0, 0, 0, 0.8);
          color: white;
        }
      }
    }
  }
}

// 优化动画效果
@keyframes charItemAppear {
  0% {
    opacity: 0;
    transform: translateY(10px) scale(0.95);
  }
  60% {
    transform: translateY(-2px) scale(1.02);
  }
  100% {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

@keyframes shake {
  10%,
  90% {
    transform: translate3d(-1px, 0, 0);
  }
  20%,
  80% {
    transform: translate3d(2px, 0, 0);
  }
  30%,
  50%,
  70% {
    transform: translate3d(-2px, 0, 0);
  }
  40%,
  60% {
    transform: translate3d(2px, 0, 0);
  }
}

.char-item {
  animation: charItemAppear 0.4s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
  @for $i from 1 through 10 {
    &:nth-child(#{$i}) {
      animation-delay: #{$i * 0.05}s;
    }
  }
}

// 添加光晕效果
@keyframes glowPulse {
  0%,
  100% {
    filter: drop-shadow(0 0 3px rgba(var(--el-color-primary-rgb), 0.2));
  }
  50% {
    filter: drop-shadow(0 0 6px rgba(var(--el-color-primary-rgb), 0.4));
  }
}

.char-item.correct {
  animation:
    charItemAppear 0.5s cubic-bezier(0.34, 1.56, 0.64, 1) forwards,
    glowPulse 2s ease-in-out infinite;
}

.recognition-status {
  margin: 16px auto;
  text-align: center;
  width: 90%;
  max-width: 400px;

  .status-text {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    padding: 12px 24px;
    border-radius: 16px;
    font-size: 15px;
    font-weight: 500;
    width: 100%;
    backdrop-filter: blur(8px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
    transition: all 0.3s ease;

    i {
      font-size: 18px;
    }

    &.listening {
      background: rgba(22, 119, 255, 0.15);
      color: var(--el-color-primary);
      border: 1px solid rgba(22, 119, 255, 0.2);

      i {
        animation: pulse 1.5s infinite;
      }
    }

    &.warning {
      background: rgba(250, 173, 20, 0.15);
      color: #faad14;
      border: 1px solid rgba(250, 173, 20, 0.2);
    }

    &.error {
      background: rgba(255, 77, 79, 0.15);
      color: #ff4d4f;
      border: 1px solid rgba(255, 77, 79, 0.2);
    }
  }

  // 暗色模式适配
  .dark & {
    .status-text {
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);

      &.listening {
        background: rgba(22, 119, 255, 0.25);
      }

      &.warning {
        background: rgba(250, 173, 20, 0.25);
      }

      &.error {
        background: rgba(255, 77, 79, 0.25);
      }
    }
  }
}

@keyframes pulse {
  0% {
    opacity: 1;
    transform: scale(1);
  }
  50% {
    opacity: 0.5;
    transform: scale(0.95);
  }
  100% {
    opacity: 1;
    transform: scale(1);
  }
}

=======
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

>>>>>>> c690622aed9868d7e15b1acafefee3230924cc74
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
