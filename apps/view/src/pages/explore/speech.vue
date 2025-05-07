<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { articles } from '~/composables/speech'

interface ISpeechData {
  index: number
  readParagraphs: Record<number, boolean[]>
  speed: number
}

interface VoiceInfo {
  name: string
  lang: string
}

const speechData = useLocalStorage<ISpeechData>('speech-data', {
  index: 0,
  readParagraphs: {},
  speed: 1.0,
})

// 确保文章数据存在，并提供默认值
const safeArticles = computed(() => Array.isArray(articles) && articles.length > 0 ? articles : [])
const currentData = computed(() => {
  // 提供默认值并确保安全访问
  const index = speechData.value.index || 0
  const article = safeArticles.value[index] || {
    title: { text: '', translation: '' },
    articles: []
  }
  return article
})

const spokenText = ref('')
const currentParagraphIndex = ref(-1)
const isPlaying = ref(false)

// 初始化当前文章的阅读进度记录
onMounted(() => {
  if (currentData.value.articles?.length && !speechData.value.readParagraphs[speechData.value.index]) {
    // 创建指定长度的布尔数组
    const falseArray = Array.from<boolean>({ length: currentData.value.articles.length }).map(() => false)
    speechData.value.readParagraphs[speechData.value.index] = falseArray
  }
})

// 设置语音合成
const {
  isSupported,
  stop,
} = useSpeechSynthesis(spokenText)

// 获取可用的声音
const availableVoices = ref<VoiceInfo[]>([])
const selectedVoice = ref('')

// 尝试获取浏览器支持的语音
onMounted(() => {
  // 检查是否支持语音合成API
  if (typeof window !== 'undefined' && window.speechSynthesis) {
    // 获取声音并过滤出英语声音
    const getVoices = () => {
      const voices = window.speechSynthesis.getVoices()
      availableVoices.value = voices
        .filter(voice => voice.lang.includes('en'))
        .map(voice => ({ name: voice.name, lang: voice.lang }))

      if (availableVoices.value.length > 0 && !selectedVoice.value) {
        selectedVoice.value = availableVoices.value[0].name
      }
    }

    // 有些浏览器需要等待voiceschanged事件
    window.speechSynthesis.addEventListener('voiceschanged', getVoices)
    getVoices() // 初始调用

    return () => {
      window.speechSynthesis.removeEventListener('voiceschanged', getVoices)
    }
  }
})

// 文章导航功能
function handleChangeArticle(direction: 'prev' | 'next'): void {
  const totalArticles = safeArticles.value.length
  if (totalArticles === 0) return

  let newIndex = speechData.value.index

  if (direction === 'prev') {
    newIndex = (newIndex - 1 + totalArticles) % totalArticles
  } else {
    newIndex = (newIndex + 1) % totalArticles
  }

  speechData.value.index = newIndex

  // 初始化新文章的阅读进度
  const articleItems = safeArticles.value[newIndex]?.articles
  if (articleItems?.length && !speechData.value.readParagraphs[newIndex]) {
    // 创建指定长度的布尔数组
    const falseArray = Array.from<boolean>({ length: articleItems.length }).map(() => false)
    speechData.value.readParagraphs[newIndex] = falseArray
  }

  // 停止当前播放
  if (isPlaying.value) {
    stop()
    isPlaying.value = false
  }
}

// 播放段落
function handlePlayParagraph(text: string, index: number): void {
  if (!isSupported.value) {
    return
  }

  // 停止当前播放（如果有）
  if (isPlaying.value) {
    stop()
  }

  spokenText.value = text
  currentParagraphIndex.value = index
  isPlaying.value = true

  // 创建自定义语音合成设置
  const utterance = new SpeechSynthesisUtterance(text)
  utterance.rate = speechData.value.speed

  // 选择声音
  if (selectedVoice.value && typeof window !== 'undefined' && window.speechSynthesis) {
    const voices = window.speechSynthesis.getVoices()
    const voice = voices.find(v => v.name === selectedVoice.value)
    if (voice) {
      utterance.voice = voice
    }
  }

  // 设置播放结束事件
  utterance.onend = () => {
    isPlaying.value = false
    if (currentParagraphIndex.value >= 0) {
      // 确保数组存在
      if (!speechData.value.readParagraphs[speechData.value.index]) {
        speechData.value.readParagraphs[speechData.value.index] = []
      }
      speechData.value.readParagraphs[speechData.value.index][currentParagraphIndex.value] = true
    }
  }

  // 使用原生API播放
  if (typeof window !== 'undefined' && window.speechSynthesis) {
    window.speechSynthesis.speak(utterance)
  }
}

// 播放/暂停当前段落
function togglePlayPause(text: string, index: number): void {
  if (isPlaying.value && currentParagraphIndex.value === index) {
    stop()
    isPlaying.value = false
  } else {
    handlePlayParagraph(text, index)
  }
}

// 调整播放速度
function adjustSpeed(direction: 'up' | 'down'): void {
  if (direction === 'up' && speechData.value.speed < 2.0) {
    speechData.value.speed += 0.1
  } else if (direction === 'down' && speechData.value.speed > 0.5) {
    speechData.value.speed -= 0.1
  }

  // 四舍五入到一位小数
  speechData.value.speed = Math.round(speechData.value.speed * 10) / 10
}

// 计算阅读进度百分比
const progressPercentage = computed(() => {
  const currentProgress = speechData.value.readParagraphs[speechData.value.index] || []
  const readCount = currentProgress.filter(Boolean).length
  return currentProgress.length > 0 ? Math.round((readCount / currentProgress.length) * 100) : 0
})

// 播放整篇文章
function playEntireArticle(): void {
  const articles = currentData.value.articles
  if (!isSupported.value || !articles || articles.length === 0) {
    return
  }

  handlePlayParagraph(articles[0].paragraph, 0)
}

const currentReadParagraphs = computed(() => {
  console.log(speechData)
  let arr = speechData.value.readParagraphs[speechData.value.index];
  if (!Array.isArray(arr)) {
    arr = Array.from({ length: currentData.value.articles.length }).map(() => false);
    speechData.value.readParagraphs[speechData.value.index] = arr;
  }
  return arr;
});
</script>

<template>
  <PageNavHolder title="口语化学习" :class="{ supported: isSupported }" class="SpeechPage">
    <div class="SpeechPage-Controls">
      <el-card class="SpeechPage-ArticleInfo">
        <div class="SpeechPage-ArticleTitle">
          <h2>{{ currentData.title.text }}</h2>
          <p>{{ currentData.title.translation }}</p>
        </div>

        <div class="SpeechPage-NavControls">
          <el-button type="primary" @click="handleChangeArticle('prev')">
            <el-icon><ArrowLeft /></el-icon>上一篇
          </el-button>

          <div class="SpeechPage-Progress">
            <el-progress :percentage="progressPercentage" :stroke-width="12" />
            <span>已学习 {{ progressPercentage }}%</span>
          </div>

          <el-button type="primary" @click="handleChangeArticle('next')">
            下一篇<el-icon><ArrowRight /></el-icon>
          </el-button>
        </div>

        <div class="SpeechPage-AudioControls">
          <el-button-group>
            <el-button :disabled="!isSupported" type="success" @click="playEntireArticle">
              <el-icon><VideoPlay /></el-icon>播放全文
            </el-button>
            <el-button :disabled="isPlaying" @click="adjustSpeed('down')">
              <el-icon><Remove /></el-icon>
            </el-button>
            <el-button disabled>{{ speechData.speed.toFixed(1) }}x</el-button>
            <el-button :disabled="isPlaying" @click="adjustSpeed('up')">
              <el-icon><Plus /></el-icon>
            </el-button>
          </el-button-group>

          <el-select
            v-if="availableVoices.length > 0"
            v-model="selectedVoice"
            placeholder="选择声音"
            class="SpeechPage-VoiceSelect"
          >
            <el-option
              v-for="voice in availableVoices"
              :key="voice.name"
              :label="voice.name"
              :value="voice.name"
            />
          </el-select>
        </div>
      </el-card>
    </div>

    <div class="SpeechPage-Main">
      <div
        v-for="(paragraph, ind) in currentData.articles"
        :key="ind"
        class="SpeechPage-Main-Paragraph"
        :class="{
          'is-playing': isPlaying && currentParagraphIndex === ind,
          'is-read': currentReadParagraphs[ind],
        }"
      >
        <div class="SpeechPage-Main-Text">
          <el-icon
            class="SpeechPage-PlayIcon"
            @click="togglePlayPause(paragraph.paragraph, ind)"
          >
            <component :is="isPlaying && currentParagraphIndex === ind ? 'Pause' : 'VideoPlay'" />
          </el-icon>
          <p>{{ paragraph.paragraph }}</p>
        </div>
        <p class="SpeechPage-Main-Translation">
          {{ paragraph.translation }}
        </p>
      </div>
    </div>
  </PageNavHolder>
</template>

<style lang="scss" scoped>
.SpeechPage {
  display: flex;
  flex-direction: column;
  height: 100%;

  &-Controls {
    margin-bottom: 1rem;
  }

  &-ArticleInfo {
    padding: 1rem;
    margin-bottom: 1rem;
  }

  &-ArticleTitle {
    text-align: center;
    margin-bottom: 1rem;

    h2 {
      font-size: 1.5rem;
      margin: 0 0 0.5rem;
    }

    p {
      color: var(--el-text-color-secondary);
      margin: 0;
    }
  }

  &-NavControls {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin: 1rem 0;
  }

  &-Progress {
    width: 50%;
    text-align: center;

    span {
      font-size: 0.8rem;
      color: var(--el-text-color-secondary);
    }
  }

  &-AudioControls {
    display: flex;
    justify-content: center;
    gap: 1rem;
    margin-top: 1rem;
  }

  &-VoiceSelect {
    width: 150px;
  }

  &-Main {
    flex: 1;
    overflow-y: auto;
    padding: 1rem;
    border-radius: 4px;
    background-color: var(--el-bg-color-page);

    &-Paragraph {
      margin: 0 0 1.5rem;
      padding: 1rem;
      border-radius: 4px;
      background-color: var(--el-bg-color);
      transition: all 0.3s ease;
      border-left: 3px solid transparent;

      &.is-playing {
        background-color: var(--el-color-primary-light-9);
        border-left-color: var(--el-color-primary);
      }

      &.is-read {
        border-left-color: var(--el-color-success);
      }

      .SpeechPage-Main-Text {
        display: flex;
        align-items: flex-start;
        color: var(--el-text-color-primary);
        margin-bottom: 0.5rem;

        p {
          flex: 1;
          margin: 0;
          line-height: 1.6;
        }
      }

      .SpeechPage-Main-Translation {
        color: var(--el-text-color-secondary);
        margin: 0;
        font-size: 0.9rem;
        line-height: 1.5;
        padding-left: 24px;
      }
    }
  }

  &-PlayIcon {
    margin-right: 8px;
    margin-top: 4px;
    cursor: pointer;
    font-size: 1.2rem;
    color: var(--el-color-primary);
    flex-shrink: 0;
  }
}

// 响应式设计
@media (max-width: 768px) {
  .SpeechPage {
    &-NavControls {
      flex-direction: column;
      gap: 1rem;
    }

    &-Progress {
      width: 100%;
    }

    &-AudioControls {
      flex-direction: column;
      align-items: center;
    }
  }
}
</style>
