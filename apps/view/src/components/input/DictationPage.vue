<script setup lang="ts">
import { ref, inject, onMounted, watch } from 'vue'
import type { GlobalInputMethodAPI } from '../../modules/globalInputMethod'

const inputMethod = inject<GlobalInputMethodAPI>('globalInputMethod')
const userInput = ref('')
const currentWord = ref({
  word: '',
  sound: '',
  meaning: ''
})
const isPlaying = ref(false)
const progressDots = ref([0, 1, 2, 3, 4])
const activeProgressDot = ref(0)
const title = ref('听写模式 - 请输入您听到的单词')

// 模拟词库数据
const words = [
  { word: 'apple', sound: '/sounds/apple.mp3', meaning: '苹果' },
  { word: 'banana', sound: '/sounds/banana.mp3', meaning: '香蕉' },
  { word: 'orange', sound: '/sounds/orange.mp3', meaning: '橙子' },
  { word: 'grape', sound: '/sounds/grape.mp3', meaning: '葡萄' }
]

// 模拟播放声音
const playSound = () => {
  isPlaying.value = true
  activeProgressDot.value = 0
  
  // 模拟进度条动画
  const animateProgress = () => {
    const interval = setInterval(() => {
      activeProgressDot.value += 1
      if (activeProgressDot.value >= progressDots.value.length) {
        clearInterval(interval)
        isPlaying.value = false
        
        // 显示输入法
        showKeyboard()
      }
    }, 500)
  }
  
  animateProgress()
}

// 显示带有声音的键盘
const showKeyboard = () => {
  if (inputMethod) {
    // 输入法显示
    inputMethod.show('#dictation-input', {
      prompt: '',  // 这里不设置提示词，因为页面上已有提示
      soundUrl: currentWord.value.sound
    })
  }
}

// 重听按钮
const replaySound = () => {
  playSound()
}

// 加载新单词
const loadNewWord = () => {
  // 随机选择一个单词
  const randomIndex = Math.floor(Math.random() * words.length)
  currentWord.value = words[randomIndex]
  userInput.value = '' // 清空输入
  
  // 自动播放
  setTimeout(() => {
    playSound()
  }, 500)
}

// 检查答案
const checkAnswer = () => {
  if (userInput.value.toLowerCase() === currentWord.value.word.toLowerCase()) {
    alert('回答正确!')
    loadNewWord()
  } else {
    alert(`回答错误，正确答案是: ${currentWord.value.word}`)
  }
}

// 监听输入变化
watch(userInput, (value) => {
  // 如果输入了回车，检查答案
  if (value.includes('\n')) {
    userInput.value = value.replace('\n', '')
    checkAnswer()
  }
})

// 监听键盘事件
const handleKeyDown = (e: KeyboardEvent) => {
  if (e.key === 'Enter') {
    checkAnswer()
  }
}

// 手动触发输入法
const openKeyboard = () => {
  if (inputMethod) {
    inputMethod.show('#dictation-input', {
      soundUrl: currentWord.value.sound
    })
  }
}

// 组件加载时
onMounted(() => {
  loadNewWord()
  window.addEventListener('keydown', handleKeyDown)
})

// 组件卸载时
const onBeforeUnmount = () => {
  window.removeEventListener('keydown', handleKeyDown)
}
</script>

<template>
  <div class="dictation-page">
    <div class="header">
      <div class="back-button">
        <i class="back-icon">←</i>
      </div>
      <div class="header-title">
        <div class="current-status">需学习 10</div>
        <div class="current-status">剩余 10</div>
      </div>
      <div class="section-title">四级过考词汇</div>
    </div>
    
    <div class="banner">
      {{ title }}
    </div>
    
    <div class="main-content">
      <div class="sound-player" @click="playSound">
        <div class="player-circle" :class="{ 'playing': isPlaying }">
          <i class="play-icon">{{ isPlaying ? '🔊' : '😊' }}</i>
        </div>
        
        <div class="progress-bar">
          <div 
            v-for="(dot, index) in progressDots" 
            :key="index"
            class="progress-dot"
            :class="{ 'active': index <= activeProgressDot }"
          ></div>
        </div>
      </div>
      
      <input
        id="dictation-input"
        ref="dictationInput"
        v-model="userInput"
        type="text"
        class="hidden-input"
        autocomplete="off"
        placeholder="点击播放按钮开始听写"
        @click="openKeyboard"
      />
      
      <button class="replay-button" @click="replaySound">
        重听
      </button>
    </div>
    
    <div class="bottom-prompt" @click="openKeyboard">
      请输入您听到的单词
    </div>
  </div>
</template>

<style scoped>
.dictation-page {
  display: flex;
  flex-direction: column;
  height: 100vh;
  width: 100%;
  background-color: #fff;
  position: relative;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 16px;
  position: relative;
}

.back-button {
  font-size: 24px;
  color: #333;
  cursor: pointer;
}

.header-title {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
}

.current-status {
  font-size: 14px;
  color: #333;
}

.section-title {
  font-size: 16px;
  color: #333;
  font-weight: 500;
}

.banner {
  background-color: #4a69bd;
  color: #fff;
  padding: 12px;
  text-align: center;
  font-size: 16px;
  font-weight: 500;
}

.main-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 20px;
}

.sound-player {
  margin-bottom: 60px;
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
}

.player-circle {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  background-color: #7986cb;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 40px;
  cursor: pointer;
  box-shadow: 0 4px 15px rgba(121, 134, 203, 0.3);
  transition: all 0.3s ease;
}

.player-circle.playing {
  transform: scale(1.05);
  box-shadow: 0 4px 20px rgba(121, 134, 203, 0.5);
}

.play-icon {
  font-size: 32px;
  color: #fff;
  font-style: normal;
}

.progress-bar {
  width: 200px;
  height: 2px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 20px;
  position: relative;
}

.progress-bar::before {
  content: '';
  position: absolute;
  left: 0;
  right: 0;
  height: 2px;
  background-color: #e0e0e0;
  z-index: 0;
}

.progress-dot {
  width: 8px;
  height: 8px;
  background-color: #e0e0e0;
  border-radius: 50%;
  position: relative;
  z-index: 1;
  transition: background-color 0.3s ease;
}

.progress-dot.active {
  background-color: #4a69bd;
}

.hidden-input {
  position: absolute;
  opacity: 0;
  height: 0;
  width: 0;
}

.replay-button {
  margin-top: 40px;
  background-color: #f1f2f6;
  color: #576574;
  border: none;
  border-radius: 20px;
  padding: 8px 28px;
  font-size: 16px;
  cursor: pointer;
  transition: all 0.2s ease;
}

.replay-button:hover {
  background-color: #dfe4ea;
}

.bottom-prompt {
  position: absolute;
  bottom: 40px;
  width: 100%;
  text-align: center;
  color: #333;
  font-size: 16px;
  padding: 15px;
  cursor: pointer;
}

/* 处理iPhone X及以上机型的底部安全区域 */
@supports (padding-bottom: env(safe-area-inset-bottom)) {
  .bottom-prompt {
    padding-bottom: calc(15px + env(safe-area-inset-bottom));
  }
}
</style> 