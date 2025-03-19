<script setup lang="ts">
// import NumberFlow from '@number-flow/vue'
import { ElMessage } from 'element-plus'
import { pronounceWords } from '~/composables/pronounce'
import { ref, computed } from 'vue'
import { useDark } from '@vueuse/core'
import { useSuccessAudio, useErrorAudio } from '~/composables/words'

const router = useRouter()
const isDark = useDark()

interface IPronounceData {
  index: number
  scores: number[]
  mistakes: { [key: string]: string[] }
}

const pronounceData = useLocalStorage<IPronounceData>('pronounceData', {
  index: 0,
  scores: [],
  mistakes: {}
})

const {
  isSupported,
  isListening,
  // isFinal,
  // error,
  result,
  start,
  stop,
} = useSpeechRecognition()
const currentData = computed(() => pronounceWords?.[pronounceData.value.index || 0])

interface IWordAnalysis {
  correct: boolean;
  originalChar: string;
  spokenChar: string;
  type: 'correct' | 'wrong' | 'missing' | 'extra';
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
const audioChunks = ref<Blob[]>([])

// AI分析状态
const aiAnalysisState = ref<'idle' | 'analyzing' | 'complete'>('idle')
const pronunciationScore = ref(0)
const pronunciationFeedback = ref<string>('')
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
    // eslint-disable-next-line no-alert
    alert('浏览器不支持语音识别!')

    router.push('/')
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
  message: ''
})

const showNotification = (message: string, type: 'success' | 'warning' | 'info' = 'info') => {
  aiNotification.value = {
    show: true,
    type,
    message
  }
  setTimeout(() => {
    aiNotification.value.show = false
  }, 3000)
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

    mediaRecorder.value.ondataavailable = (event) => {
      audioChunks.value.push(event.data)
    }

    mediaRecorder.value.onstop = async () => {
      const audioBlob = new Blob(audioChunks.value, { type: 'audio/wav' })
      await analyzePronunciation()
      audioChunks.value = []
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
    audioChunks.value = []

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

async function stopRecording() {
  if (!isRecording.value) {
    return
  }

  try {
    isRecording.value = false
    recordingState.value = 'processing'

    if (mediaRecorder.value && mediaRecorder.value.state === 'recording') {
      mediaRecorder.value.stop()
      stop()
    }

    try {
      const result = await analyzePronunciation()
      if (result.score > 80) {
        showNotification('发音非常棒！', 'success')
      } else if (result.score > 60) {
        showNotification('发音还不错，继续努力！', 'info')
      } else {
        showNotification('需要多加练习哦', 'warning')
      }
    } catch (error) {
      console.error('分析发音失败:', error)
      showNotification('分析发音时出现错误', 'warning')
    }
  } catch (err) {
    console.error('停止录音失败:', err)
    showNotification('停止录音失败', 'warning')
  } finally {
    isRecording.value = false
    recordingState.value = 'idle'
  }
}

// 分析单词
function analyzeWord(spoken: string, correct: string): IWordAnalysis[] {
  const analysis: IWordAnalysis[] = [];
  const maxLen = Math.max(spoken.length, correct.length);

  for (let i = 0; i < maxLen; i++) {
    if (i >= correct.length) {
      analysis.push({
        correct: false,
        originalChar: '',
        spokenChar: spoken[i],
        type: 'extra'
      });
    } else if (i >= spoken.length) {
      analysis.push({
        correct: false,
        originalChar: correct[i],
        spokenChar: '',
        type: 'missing'
      });
    } else {
      analysis.push({
        correct: spoken[i].toLowerCase() === correct[i].toLowerCase(),
        originalChar: correct[i],
        spokenChar: spoken[i],
        type: spoken[i].toLowerCase() === correct[i].toLowerCase() ? 'correct' : 'wrong'
      });
    }
  }

  return analysis;
}

// 分析发音问题
function analyzePronunciationIssues(analysis: IWordAnalysis[]): {
  vowelIssues: string[];
  consonantIssues: string[];
  rhythmIssues: string[];
} {
  const vowels = ['a', 'e', 'i', 'o', 'u'];
  const issues = {
    vowelIssues: [] as string[],
    consonantIssues: [] as string[],
    rhythmIssues: [] as string[]
  };

  analysis.forEach((char, index) => {
    if (char.type === 'wrong') {
      if (vowels.includes(char.originalChar.toLowerCase())) {
        issues.vowelIssues.push(`元音"${char.originalChar}"发音错误，发成了"${char.spokenChar}"`);
      } else {
        issues.consonantIssues.push(`辅音"${char.originalChar}"发音错误，发成了"${char.spokenChar}"`);
      }
    }
  });

  if (analysis.filter(a => a.type === 'extra').length > 0) {
    issues.rhythmIssues.push('发音多出了音节');
  }
  if (analysis.filter(a => a.type === 'missing').length > 0) {
    issues.rhythmIssues.push('发音缺少音节');
  }

  return issues;
}

// 生成建议
function generateSuggestions(analysis: IWordAnalysis[]): string[] {
  const suggestions: string[] = [];
  const accuracy = (analysis.filter(a => a.correct).length / analysis.length) * 100;

  if (accuracy < 60) {
    suggestions.push('建议重点关注每个音节的发音');
    suggestions.push('可以先慢速练习，确保发音准确');
  } else if (accuracy < 85) {
    suggestions.push('整体发音不错，注意个别音节的准确度');
  } else {
    suggestions.push('发音非常准确，继续保持！');
  }

  return suggestions;
}

async function analyzePronunciation() {
  try {
    aiAnalysisState.value = 'analyzing';
    // 确保 result.value 存在且为字符串
    if (!result.value || typeof result.value !== 'string') {
      throw new Error('未能获取到语音识别结果');
    }

    const spokenText = result.value.toLowerCase().trim();
    const correctText = currentData.value.word.toLowerCase().trim();

    // 如果语音识别结果为空，提示用户
    if (!spokenText) {
      showNotification('未能识别到您的发音，请重试', 'warning');
      return { score: 0 };
    }

    // 执行详细分析
    const wordAnalysis = analyzeWord(spokenText, correctText);
    const issues = analyzePronunciationIssues(wordAnalysis);
    const suggestions = generateSuggestions(wordAnalysis);
    const accuracy = (wordAnalysis.filter(a => a.correct).length / wordAnalysis.length) * 100;

    // 更新分析结果
    aiAnalysisDetails.value = {
      wordAnalysis,
      accuracy,
      ...issues,
      suggestions,
    };

    pronunciationScore.value = Math.round(accuracy);
    aiAnalysisState.value = 'complete';
    showScoreCard.value = true;

    if (accuracy >= 80) {
      successAudio.play();
      showNotification('发音非常准确！', 'success');
      useVibrate('light');

      setTimeout(() => {
        pronounceData.value.index += 1;
        showScoreCard.value = false;
      }, 3000);
    } else {
      errorAudio.play();
      showNotification('继续加油，你已经很接近了！', 'info');
      useVibrate('heavy');

      if (!pronounceData.value.mistakes[currentData.value.word]) {
        pronounceData.value.mistakes[currentData.value.word] = [];
      }
      pronounceData.value.mistakes[currentData.value.word].push(spokenText);
    }

    result.value = '';
    mouthAnimation.value = 'closed';
    recordingState.value = 'idle';

    return { score: accuracy };
  } catch (err) {
    console.error('分析发音时出现错误:', err);
    showNotification('分析发音时出现错误', 'warning');
    recordingState.value = 'idle';
    return { score: 0 };
  }
}

// 更新嘴型动画状态
const updateMouthAnimation = (phoneme: string) => {
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
  <PageNavHolder :content-padding="false" title="发音训练">
    <div class="PronouncePage-Main" :class="{ listening: isListening, dark: isDark }">
      <div class="ai-blur-circle left"></div>
      <div class="ai-blur-circle right"></div>
      <div class="ai-blur-circle center"></div>
      <div class="bubble"></div>
      <div class="bubble"></div>
      <div class="bubble"></div>
      <div class="bubble"></div>
      <div class="bubble"></div>

      <!-- AI通知 -->
      <Transition name="ai-notification">
        <div v-if="aiNotification.show"
             class="AINotification"
             :class="aiNotification.type">
          <div class="ai-notification-icon">
            <i v-if="aiNotification.type === 'success'" class="el-icon-check"></i>
            <i v-else-if="aiNotification.type === 'warning'" class="el-icon-warning"></i>
            <i v-else class="el-icon-info"></i>
          </div>
          <span class="ai-notification-message">{{ aiNotification.message }}</span>
          <div class="ai-notification-progress"></div>
        </div>
      </Transition>

      <!-- AI能量场 -->
      <div class="ai-energy-field" :class="{ active: isListening }">
        <div class="energy-ring"></div>
        <div class="energy-ring"></div>
        <div class="energy-ring"></div>
      </div>

      <div class="PronouncePage-Progress">
        <div class="progress-bar">
          <div class="progress-fill" :style="{ width: `${(pronounceData.index / pronounceWords.length) * 100}%` }">
          </div>
        </div>
        <div class="progress-text">
          <span class="current">{{ pronounceData.index + 1 }}</span>
          <span class="total">/50</span>
        </div>
      </div>

      <div class="PronouncePage-AIAssistant">
        <div class="ai-icon-container">
          <div class="ai-icon" :class="{ pulse: aiAnalysisState === 'analyzing' }">
            <div class="ai-core"></div>
            <div class="ai-ring"></div>
            <div class="ai-dots" v-if="aiAnalysisState === 'analyzing'">
              <span></span><span></span><span></span>
            </div>
            <i v-else-if="aiAnalysisState === 'complete'" class="el-icon-check"></i>
            <i v-else class="el-icon-mic"></i>
          </div>
        </div>
        <div class="ai-tip-container">
          <div class="ai-tip">
            <p class="sound-type">{{ pronunciationTips.soundType }}发音技巧</p>
            <p class="tip-content">{{ pronunciationTips.text }}</p>
            <p class="ai-tip-text">{{ pronunciationTips.aiTip }}</p>
          </div>
        </div>
      </div>

      <div class="PronouncePage-Instructions">
        <p>长按"开始朗读"按钮，准确清晰地朗读单词</p>
        <p>AI助手将实时分析您的发音并提供反馈</p>
      </div>

      <div class="PronouncePage-MainCard">
        <div class="pronunciation-animation">
          <div class="mouth" :class="[mouthAnimation, { animated: isListening }]"></div>
          <div class="ai-wave" v-if="isListening">
            <div class="wave-bar" v-for="i in 5" :key="i"></div>
          </div>
        </div>
        <p class="word">
          {{ currentData.word }}
        </p>
        <p class="phonetic">
          {{ currentData.phonetic }}
        </p>
      </div>

      <div class="PronouncePage-Button"
           :class="{ active: isListening }"
           @touchstart.prevent="startRecording"
           @touchend.prevent="stopRecording"
           @mousedown.prevent="startRecording"
           @mouseup.prevent="stopRecording"
           @mouseleave.prevent="handleMouseLeave">
        <span v-if="!isListening">
          按住开始录音
        </span>
        <span v-else>
          松开停止录音
        </span>
      </div>

      <transition name="score-slide">
        <div v-if="showScoreCard" class="ScoreCard fake-background">
          <!-- 滚动内容区域 -->
          <div class="score-content">
            <div class="score-header">AI发音评估</div>
            <div class="score-circle">
              <div class="score-value">{{ pronunciationScore }}</div>
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
                  :style="{ 'stroke-dashoffset': `${(100 - pronunciationScore) * 3.4}` }"
                />
              </svg>
            </div>

            <div class="word-analysis">
              <div class="char-comparison">
                <div v-for="(char, index) in aiAnalysisDetails.wordAnalysis"
                     :key="index"
                     class="char-item"
                     :class="[char.type, { 'has-error': char.type !== 'correct' }]">
                  <div class="char-content">
                    <div class="original" :class="{ empty: !char.originalChar }">
                      {{ char.originalChar || '⚋' }}
                    </div>
                    <div class="comparison-arrow">
                      <span class="arrow-line"></span>
                      <span class="arrow-head">▼</span>
                    </div>
                    <div class="spoken" :class="{ empty: !char.spokenChar }">
                      {{ char.spokenChar || '⚋' }}
                    </div>
                  </div>
                  <div class="status-icon">
                    <i v-if="char.type === 'correct'" class="el-icon-check"></i>
                    <i v-else-if="char.type === 'wrong'" class="el-icon-close"></i>
                    <i v-else-if="char.type === 'missing'" class="el-icon-minus"></i>
                    <i v-else class="el-icon-plus"></i>
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

            <div class="ai-analysis-details">
              <div class="analysis-section" v-if="aiAnalysisDetails.vowelIssues.length">
                <h4>
                  <span class="icon">🔊</span>
                  元音问题
                </h4>
                <ul>
                  <li v-for="issue in aiAnalysisDetails.vowelIssues" :key="issue">{{ issue }}</li>
                </ul>
              </div>
              <div class="analysis-section" v-if="aiAnalysisDetails.consonantIssues.length">
                <h4>
                  <span class="icon">👄</span>
                  辅音问题
                </h4>
                <ul>
                  <li v-for="issue in aiAnalysisDetails.consonantIssues" :key="issue">{{ issue }}</li>
                </ul>
              </div>
              <div class="analysis-section" v-if="aiAnalysisDetails.rhythmIssues.length">
                <h4>
                  <span class="icon">🎵</span>
                  节奏问题
                </h4>
                <ul>
                  <li v-for="issue in aiAnalysisDetails.rhythmIssues" :key="issue">{{ issue }}</li>
                </ul>
              </div>
            </div>

            <div class="score-feedback">
              <p v-for="(suggestion, index) in aiAnalysisDetails.suggestions"
                 :key="index">{{ suggestion }}</p>
            </div>
          </div>

          <!-- 固定在底部的按钮 -->
          <div class="score-actions">
            <button class="action-button retry" @click="startRecording">
              <i class="el-icon-refresh-right"></i>
              重新练习
            </button>
            <button
              v-if="pronunciationScore >= 80"
              class="action-button next"
              @click="pronounceData.index++; showScoreCard = false">
              <i class="el-icon-arrow-right"></i>
              下一题
            </button>
          </div>
        </div>
      </transition>
    </div>
  </PageNavHolder>
</template>

<style lang="scss">
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
  background: rgba(255, 255, 255, 0.8);
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

.PronouncePage-Instructions {
  text-align: center;
  margin: 1rem 0;
  position: relative;
  z-index: 2;

  p {
    font-size: 16px;
    color: var(--el-text-color-secondary);
    margin: 4px 0;
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
      background: linear-gradient(to bottom, rgba(0, 0, 0, 0.7), rgba(0, 0, 0, 0.5));
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
        background: rgba(0, 0, 0, 0.5);
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
  background: rgba(255, 255, 255, 0.9);
  backdrop-filter: blur(12px);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  z-index: 2;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 12px 32px rgba(0, 0, 0, 0.15);
  }

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

  // 添加霓虹光效果
  &::after {
    content: '';
    position: absolute;
    inset: -1px;
    background: linear-gradient(90deg, #4096ff, #1677ff, #4096ff);
    filter: blur(12px);
    mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
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

  .score-circle {
    position: relative;
    width: 120px;
    height: 120px;
    margin: 20px auto;
    display: flex;
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

    svg {
      position: absolute;
      top: 0;
      left: 0;
      transform: rotate(-90deg);

      circle {
        fill: none;
        stroke-width: 8;
        stroke-linecap: round;

        &.score-ring-bg {
          stroke: rgba(22, 119, 255, 0.1);
        }

        &.score-ring-progress {
          stroke: url(#score-gradient);
          stroke-dasharray: 339.292;
          transition: stroke-dashoffset 1s ease;
          filter: drop-shadow(0 0 4px rgba(22, 119, 255, 0.5));
        }
      }

      defs {
        linearGradient {
          stop:first-child {
            stop-color: #1677ff;
          }
          stop:last-child {
            stop-color: #4096ff;
          }
        }
      }
    }

    &::before {
      content: '';
      position: absolute;
      inset: -4px;
      border-radius: 50%;
      background: linear-gradient(135deg, rgba(22, 119, 255, 0.2), rgba(64, 150, 255, 0.2));
      filter: blur(8px);
      z-index: -1;
    }
  }

  // 内容容器
  .score-content {
    flex: 1;
    overflow-y: auto;
    padding: 0 20px 80px;
    -webkit-overflow-scrolling: touch;

    // 自定义滚动条样式
    &::-webkit-scrollbar {
      width: 6px;
    }

    &::-webkit-scrollbar-track {
      background: transparent;
    }

    &::-webkit-scrollbar-thumb {
      background: rgba(22, 119, 255, 0.2);
      border-radius: 3px;
    }
  }

  // 固定在底部的按钮容器
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
  gap: 1.5rem;
  align-items: center;
  flex-direction: column;
  overflow: hidden;
  min-height: 100vh;
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

.PronouncePage-Instructions {
  text-align: center;
  margin-bottom: 0.5rem;

  p {
    font-size: 16px;
    color: var(--el-text-color-secondary);
  }
}

.PronouncePage {
  position: relative;
  display: flex;
  width: 100%;
  height: 100%;
  align-items: center;
  flex-direction: column;
}

@keyframes buttonShaving {
  0%,
  100% {
    transform: scale(1.15);
  }
  50% {
    transform: scale(1);
  }
}

@keyframes wavingButton {
  to {
    opacity: 0;
    transform: scale(1.8);
  }
}

@keyframes wordFadeIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }

  to {
    opacity: 1;
    transform: translateY(0);
  }
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
    transform: scaleY(0.8);
  }
  100% {
    transform: scaleY(1.2);
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
  transition:
    transform 0.4s cubic-bezier(0.34, 1.56, 0.64, 1),
    opacity 0.3s ease;
}

.score-slide-enter-from,
.score-slide-leave-to {
  transform: translateY(100%);
  opacity: 0;
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

@keyframes centerPulse {
  0% {
    transform: translate(-50%, -50%) scale(1);
    filter: blur(60px);
  }
  50% {
    transform: translate(-50%, -50%) scale(1.2);
    filter: blur(100px);
  }
  100% {
    transform: translate(-50%, -50%) scale(1);
    filter: blur(60px);
  }
}

.ai-notification-enter-active,
.ai-notification-leave-active {
  transition: all 0.3s ease;
}

.ai-notification-enter-from,
.ai-notification-leave-to {
  transform: translate(-50%, -20px);
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

      .original, .spoken {
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

        .original, .spoken {
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
    transform: translateY(20px) scale(0.8);
  }
  60% {
    transform: translateY(-5px) scale(1.05);
  }
  100% {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

@keyframes shake {
  10%, 90% {
    transform: translate3d(-1px, 0, 0);
  }
  20%, 80% {
    transform: translate3d(2px, 0, 0);
  }
  30%, 50%, 70% {
    transform: translate3d(-2px, 0, 0);
  }
  40%, 60% {
    transform: translate3d(2px, 0, 0);
  }
}

.char-item {
  animation: charItemAppear 0.5s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
  @for $i from 1 through 10 {
    &:nth-child(#{$i}) {
      animation-delay: #{$i * 0.08}s;
    }
  }
}

// 添加光晕效果
@keyframes glowPulse {
  0%, 100% {
    filter: drop-shadow(0 0 5px rgba(var(--el-color-primary-rgb), 0.3));
  }
  50% {
    filter: drop-shadow(0 0 10px rgba(var(--el-color-primary-rgb), 0.5));
  }
}

.char-item.correct {
  animation: charItemAppear 0.5s cubic-bezier(0.34, 1.56, 0.64, 1) forwards,
             glowPulse 2s ease-in-out infinite;
}
</style>

