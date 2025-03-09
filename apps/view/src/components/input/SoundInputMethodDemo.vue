<script setup lang="ts">
import { ref, inject, onMounted } from 'vue'
import type { GlobalInputMethodAPI } from '../../modules/globalInputMethod'

const inputMethod = inject<GlobalInputMethodAPI>('globalInputMethod')
const textInput = ref('')
const soundWordInput = ref('')
const soundUrl = ref('')
const currentPrompt = ref('')

// 单词列表示例（实际应用中可能从API获取）
const wordExamples = [
  { word: 'apple', sound: '/sounds/apple.mp3', meaning: '苹果' },
  { word: 'banana', sound: '/sounds/banana.mp3', meaning: '香蕉' },
  { word: 'orange', sound: '/sounds/orange.mp3', meaning: '橙子' },
  { word: 'grape', sound: '/sounds/grape.mp3', meaning: '葡萄' }
]

// 显示带有声音的键盘
const showKeyboardWithSound = (word: string, sound: string, meaning: string) => {
  if (inputMethod) {
    currentPrompt.value = `${word}（${meaning}）`
    soundUrl.value = sound
    inputMethod.show('#sound-word-input', {
      prompt: currentPrompt.value,
      soundUrl: soundUrl.value
    })
  }
}

// 显示普通键盘
const showNormalKeyboard = () => {
  if (inputMethod) {
    inputMethod.show('#text-input')
  }
}

// 更新提示词
const updatePrompt = (newPrompt: string) => {
  if (inputMethod) {
    currentPrompt.value = newPrompt
    inputMethod.updatePrompt(newPrompt)
  }
}

// 更新声音URL
const updateSoundUrl = (newSoundUrl: string) => {
  if (inputMethod) {
    soundUrl.value = newSoundUrl
    inputMethod.updateSoundUrl(newSoundUrl)
  }
}

onMounted(() => {
  console.log('声音输入法演示组件已加载')
})
</script>

<template>
  <div class="sound-input-method-demo">
    <h2>带声音功能的输入法演示</h2>
    
    <div class="input-group">
      <label for="text-input">普通文本输入</label>
      <input 
        id="text-input"
        v-model="textInput"
        type="text"
        placeholder="点击此处输入普通文本"
      />
      <button @click="showNormalKeyboard" class="action-button">
        打开普通键盘
      </button>
    </div>
    
    <div class="input-group">
      <label for="sound-word-input">单词听写</label>
      <input 
        id="sound-word-input"
        v-model="soundWordInput"
        type="text"
        placeholder="点击单词按钮开始听写"
      />
    </div>
    
    <div class="word-buttons">
      <h3>点击单词进行听写练习：</h3>
      <div class="word-button-list">
        <button 
          v-for="word in wordExamples" 
          :key="word.word"
          @click="showKeyboardWithSound(word.word, word.sound, word.meaning)"
          class="word-button"
        >
          {{ word.word }}
        </button>
      </div>
    </div>
    
    <div class="custom-section">
      <h3>自定义提示与声音：</h3>
      <div class="custom-inputs">
        <div class="custom-input-group">
          <label for="custom-prompt">自定义提示词</label>
          <input 
            id="custom-prompt"
            v-model="currentPrompt"
            type="text"
            placeholder="输入提示词"
          />
          <button @click="updatePrompt(currentPrompt)" class="action-button">
            更新提示词
          </button>
        </div>
        
        <div class="custom-input-group">
          <label for="custom-sound">自定义声音URL</label>
          <input 
            id="custom-sound"
            v-model="soundUrl"
            type="text"
            placeholder="输入声音URL"
          />
          <button @click="updateSoundUrl(soundUrl)" class="action-button">
            更新声音
          </button>
        </div>
      </div>
    </div>
    
    <div class="instructions">
      <h3>使用说明：</h3>
      <ol>
        <li>点击单词按钮，将显示带有提示词和声音的输入法</li>
        <li>声音会自动播放，也可以点击🔊按钮重新播放</li>
        <li>完成输入后按回车键关闭输入法</li>
        <li>也可以自定义提示词和声音URL</li>
      </ol>
    </div>
  </div>
</template>

<style scoped>
.sound-input-method-demo {
  padding: 20px;
  max-width: 600px;
  margin: 0 auto;
}

h2, h3 {
  color: #333;
}

h2 {
  text-align: center;
  margin-bottom: 20px;
}

h3 {
  margin-top: 0;
  margin-bottom: 15px;
}

.input-group {
  margin-bottom: 20px;
  display: flex;
  flex-direction: column;
}

.input-group button {
  margin-top: 8px;
  align-self: flex-start;
}

label {
  display: block;
  margin-bottom: 8px;
  font-weight: bold;
  color: #555;
}

input {
  width: 100%;
  padding: 12px;
  border: 1px solid #ddd;
  border-radius: 8px;
  font-size: 16px;
  transition: border-color 0.3s;
}

input:focus {
  border-color: #409eff;
  outline: none;
}

.word-buttons {
  margin-bottom: 20px;
  background-color: #f8f9fa;
  padding: 15px;
  border-radius: 8px;
}

.word-button-list {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}

.word-button {
  padding: 10px 16px;
  background-color: #67c23a;
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-size: 14px;
  transition: background-color 0.3s;
}

.word-button:hover {
  background-color: #85ce61;
}

.action-button {
  padding: 10px 16px;
  background-color: #409eff;
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-size: 14px;
  transition: background-color 0.3s;
}

.action-button:hover {
  background-color: #66b1ff;
}

.instructions {
  background-color: #f8f9fa;
  padding: 15px;
  border-radius: 8px;
  border-left: 4px solid #409eff;
  margin-top: 20px;
}

.instructions ol {
  margin: 0;
  padding-left: 20px;
}

.instructions li {
  margin-bottom: 8px;
  color: #555;
}

.custom-section {
  margin-bottom: 20px;
  background-color: #f8f9fa;
  padding: 15px;
  border-radius: 8px;
}

.custom-inputs {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.custom-input-group {
  display: flex;
  flex-direction: column;
}

.custom-input-group button {
  margin-top: 8px;
  align-self: flex-start;
}

@media (max-width: 600px) {
  .sound-input-method-demo {
    padding: 15px;
  }
  
  .action-button, .word-button {
    padding: 8px 12px;
    font-size: 13px;
  }
  
  .word-button-list {
    gap: 8px;
  }
}
</style> 