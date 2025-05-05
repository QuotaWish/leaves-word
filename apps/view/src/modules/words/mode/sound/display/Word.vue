<template>
  <div class="sound-word-container">
    <div class="word-content">
      <div v-if="currentWordItem" class="sound-word-wrapper">
        <div class="sound-word-type">
          {{ wordTypeLabel }}
        </div>

        <div class="sound-word-main">
          <!-- 音频播放按钮 -->
          <div class="sound-audio-controls">
            <button @click="playAudio" class="play-audio-btn">
              <span v-if="isPlayingAudio">🔊</span>
              <span v-else>🔈</span>
            </button>
          </div>

          <!-- 输入区域 -->
          <div class="sound-input-area">
            <input
              v-model="userInput"
              :disabled="wordState !== 'waiting'"
              @keyup.enter="checkAnswer"
              ref="inputRef"
              class="sound-input"
              :class="{ 'correct': wordState === 'correct', 'error': wordState === 'error' }"
              autocomplete="off"
              placeholder="请输入听到的单词..."
            />

            <button @click="checkAnswer" class="check-btn">
              确认
            </button>
          </div>

          <!-- 结果显示区域 -->
          <div v-if="wordState === 'correct' || wordState === 'error'" class="result-display">
            <div v-if="wordState === 'correct'" class="correct-result">
              正确! 👍
            </div>
            <div v-if="wordState === 'error'" class="error-result">
              <span>正确答案: {{ correctAnswer }}</span>
            </div>

            <button @click="handleNext" class="next-btn">
              下一个
            </button>
          </div>
        </div>
      </div>

      <div v-else class="no-word">
        <div class="loading">加载中...</div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, onMounted, watch } from 'vue'
import type { ISoundWordItem, SoundWordType, ExampleStage } from '..'
import { WordState } from '..'

const props = defineProps<{
  currentWord: ISoundWordItem | null
  onCorrect: () => void
  onError: () => void
  onNext: () => void
}>()

// 状态变量
const wordState = ref<WordState>(WordState.INIT)
const userInput = ref('')
const isPlayingAudio = ref(false)
const inputRef = ref<HTMLInputElement | null>(null)

// 计算属性
const currentWordItem = computed(() => props.currentWord)

const wordTypeLabel = computed(() => {
  if (!props.currentWord) return ''

  if (props.currentWord.type === 'dictation') {
    return '听写模式'
  } else if (props.currentWord.type === 'example') {
    const stage = props.currentWord.exampleStage
    if (stage === 0) return '例句学习 (阶段1)'
    if (stage === 1) return '例句学习 (阶段2)'
    if (stage === 2) return '例句学习 (阶段3)'
    return '例句学习'
  }
  return ''
})

const correctAnswer = computed(() => {
  if (!props.currentWord) return ''
  if (props.currentWord.type === 'dictation') {
    return props.currentWord.word.word
  } else {
    // 简化的例句答案显示逻辑
    return props.currentWord.word.word
  }
})

// 方法
function playAudio() {
  if (!props.currentWord || isPlayingAudio.value) return

  isPlayingAudio.value = true
  wordState.value = WordState.PLAYING

  // 模拟音频播放
  setTimeout(() => {
    isPlayingAudio.value = false
    wordState.value = WordState.WAITING
    focusInput()
  }, 1500)
}

function checkAnswer() {
  if (wordState.value !== WordState.WAITING || !props.currentWord) return

  const input = userInput.value.trim().toLowerCase()
  const expected = correctAnswer.value.trim().toLowerCase()

  if (input === expected) {
    wordState.value = WordState.CORRECT
    props.onCorrect()
  } else {
    wordState.value = WordState.ERROR
    props.onError()
  }
}

function handleNext() {
  userInput.value = ''
  wordState.value = WordState.INIT
  props.onNext()
}

function focusInput() {
  setTimeout(() => {
    inputRef.value?.focus()
  }, 100)
}

// 生命周期钩子
onMounted(() => {
  if (props.currentWord) {
    wordState.value = WordState.INIT
    playAudio()
  }
})

watch(() => props.currentWord, (newWord) => {
  if (newWord) {
    userInput.value = ''
    wordState.value = WordState.INIT
    setTimeout(() => {
      playAudio()
    }, 300)
  }
})
</script>

<style scoped>
.sound-word-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  max-width: 600px;
  margin: 0 auto;
  padding: 20px;
}

.word-content {
  width: 100%;
  background-color: #ffffff;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  padding: 24px;
}

.sound-word-wrapper {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.sound-word-type {
  font-size: 16px;
  color: #666;
  font-weight: 500;
}

.sound-word-main {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.sound-audio-controls {
  display: flex;
  justify-content: center;
  margin-bottom: 10px;
}

.play-audio-btn {
  background-color: #3498db;
  color: white;
  border: none;
  border-radius: 50%;
  width: 60px;
  height: 60px;
  font-size: 24px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s;
}

.play-audio-btn:hover {
  background-color: #2980b9;
  transform: scale(1.05);
}

.sound-input-area {
  display: flex;
  gap: 10px;
}

.sound-input {
  flex: 1;
  padding: 12px 16px;
  border: 2px solid #e0e0e0;
  border-radius: 8px;
  font-size: 16px;
  transition: all 0.2s;
}

.sound-input:focus {
  border-color: #3498db;
  outline: none;
}

.sound-input.correct {
  border-color: #2ecc71;
  background-color: rgba(46, 204, 113, 0.1);
}

.sound-input.error {
  border-color: #e74c3c;
  background-color: rgba(231, 76, 60, 0.1);
}

.check-btn {
  background-color: #3498db;
  color: white;
  border: none;
  border-radius: 8px;
  padding: 0 20px;
  font-size: 16px;
  cursor: pointer;
  transition: all 0.2s;
}

.check-btn:hover {
  background-color: #2980b9;
}

.result-display {
  margin-top: 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
}

.correct-result {
  color: #2ecc71;
  font-size: 18px;
  font-weight: bold;
}

.error-result {
  color: #e74c3c;
  font-size: 18px;
}

.next-btn {
  background-color: #2ecc71;
  color: white;
  border: none;
  border-radius: 8px;
  padding: 12px 24px;
  font-size: 16px;
  cursor: pointer;
  transition: all 0.2s;
}

.next-btn:hover {
  background-color: #27ae60;
}

.no-word {
  height: 300px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.loading {
  font-size: 18px;
  color: #666;
}
</style>
