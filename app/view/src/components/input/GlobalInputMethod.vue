<script setup lang="ts">
import { ref, onMounted, onUnmounted, watch } from 'vue'
import Keyboard from 'simple-keyboard'
import 'simple-keyboard/build/css/index.css'
import { useSound } from '@vueuse/sound'

const props = defineProps({
  visible: {
    type: Boolean,
    default: false
  },
  // 可以指定目标输入元素
  targetInput: {
    type: [String, null],
    default: null
  },
  // 提示词
  prompt: {
    type: String,
    default: ''
  },
  // 声音URL
  soundUrl: {
    type: String,
    default: ''
  }
})

const emit = defineEmits(['update:visible', 'input', 'replaySound'])

const keyboard = ref<Keyboard | null>(null)
const activeInput = ref<HTMLInputElement | null>(null)
const keyboardInput = ref('')
const layoutName = ref('default')

// 初始化声音
const { play: playSound } = useSound(props.soundUrl)

// 重播声音
const replaySound = () => {
  emit('replaySound')
  if (props.soundUrl) {
    playSound()
  }
}

// 当输入的内容变化时，我们需要通知外部
watch(keyboardInput, (value) => {
  emit('input', value)
  
  // 同步到当前激活的输入框
  if (activeInput.value) {
    activeInput.value.value = value
    // 触发input事件以便其他组件知道值已更改
    const event = new Event('input', { bubbles: true })
    activeInput.value.dispatchEvent(event)
  }
})

// 监听提示词变化
watch(() => props.prompt, (newPrompt) => {
  if (newPrompt && props.soundUrl) {
    // 当提示词变化时播放声音
    playSound()
  }
})

// 监听声音URL变化
watch(() => props.soundUrl, (newUrl, oldUrl) => {
  if (newUrl && newUrl !== oldUrl) {
    // 当声音URL变化时播放声音
    playSound()
  }
})

// 当键盘输入改变时的回调
const onChange = (input: string) => {
  keyboardInput.value = input
}

// 当按下键盘按键时的回调
const onKeyPress = (button: string) => {
  // 处理特殊键
  if (button === '{shift}' || button === '{lock}') {
    handleShift()
  } else if (button === '{numbers}' || button === '{abc}') {
    handleNumbers()
  } else if (button === '{ent}') {
    // 按下回车键关闭键盘
    emit('update:visible', false)
  }
}

// 处理shift键
const handleShift = () => {
  const newLayoutName = layoutName.value === 'default' ? 'shift' : 'default'
  layoutName.value = newLayoutName
  
  if (keyboard.value) {
    keyboard.value.setOptions({
      layoutName: newLayoutName
    })
  }
}

// 处理数字切换
const handleNumbers = () => {
  const newLayoutName = layoutName.value !== 'numbers' ? 'numbers' : 'default'
  layoutName.value = newLayoutName
  
  if (keyboard.value) {
    keyboard.value.setOptions({
      layoutName: newLayoutName
    })
  }
}

// 监听所有input元素的焦点事件
const setupGlobalListeners = () => {
  // 获取所有的input元素
  const inputs = document.querySelectorAll('input:not([type="hidden"]), textarea')
  
  // 为每个input添加focus事件监听
  inputs.forEach(input => {
    input.addEventListener('focus', onInputFocus)
    input.addEventListener('input', onInputChange)
  })

  // 添加点击其他区域隐藏键盘的逻辑
  document.addEventListener('click', onDocumentClick)
}

// 移除全局监听器
const removeGlobalListeners = () => {
  const inputs = document.querySelectorAll('input:not([type="hidden"]), textarea')
  
  inputs.forEach(input => {
    input.removeEventListener('focus', onInputFocus)
    input.removeEventListener('input', onInputChange)
  })

  document.removeEventListener('click', onDocumentClick)
}

// 当input获得焦点时
const onInputFocus = (e: Event) => {
  const input = e.target as HTMLInputElement
  activeInput.value = input
  keyboardInput.value = input.value
  
  if (keyboard.value) {
    keyboard.value.setInput(input.value)
  }
  
  // 显示键盘
  emit('update:visible', true)
}

// 当input值直接改变时
const onInputChange = (e: Event) => {
  const input = e.target as HTMLInputElement
  if (input === activeInput.value && keyboard.value) {
    keyboardInput.value = input.value
    keyboard.value.setInput(input.value)
  }
}

// 当点击文档其他区域时
const onDocumentClick = (e: MouseEvent) => {
  const target = e.target as HTMLElement
  const keyboardElement = document.querySelector('.simple-keyboard')
  const isInput = target.tagName === 'INPUT' || target.tagName === 'TEXTAREA'
  
  // 如果点击的不是输入框和键盘，则隐藏键盘
  if (!isInput && keyboardElement && !keyboardElement.contains(target)) {
    emit('update:visible', false)
  }
}

// 组件挂载后初始化键盘
onMounted(() => {
  keyboard.value = new Keyboard({
    onChange: input => onChange(input),
    onKeyPress: button => onKeyPress(button),
    mergeDisplay: true,
    layoutName: 'default',
    layout: {
      default: [
        "q w e r t y u i o p",
        "a s d f g h j k l",
        "{shift} z x c v b n m {backspace}",
        "{numbers} {space} {ent}"
      ],
      shift: [
        "Q W E R T Y U I O P",
        "A S D F G H J K L",
        "{shift} Z X C V B N M {backspace}",
        "{numbers} {space} {ent}"
      ],
      numbers: ["1 2 3", "4 5 6", "7 8 9", "{abc} 0 {backspace}"]
    },
    display: {
      "{numbers}": "123",
      "{ent}": "return",
      "{escape}": "esc ⎋",
      "{tab}": "tab ⇥",
      "{backspace}": "⌫",
      "{capslock}": "caps lock ⇪",
      "{shift}": "⇧",
      "{controlleft}": "ctrl ⌃",
      "{controlright}": "ctrl ⌃",
      "{altleft}": "alt ⌥",
      "{altright}": "alt ⌥",
      "{metaleft}": "cmd ⌘",
      "{metaright}": "cmd ⌘",
      "{abc}": "ABC"
    }
  })
  
  // 设置全局监听器
  setupGlobalListeners()
  
  // 如果有指定目标输入元素，则直接关联
  if (props.targetInput) {
    const targetEl = document.querySelector(props.targetInput) as HTMLInputElement
    if (targetEl) {
      activeInput.value = targetEl
      keyboardInput.value = targetEl.value
      
      if (keyboard.value) {
        keyboard.value.setInput(targetEl.value)
      }
    }
  }
  
  // 如果有声音URL，初始加载时播放声音
  if (props.soundUrl) {
    playSound()
  }
})

// 组件卸载前清理
onUnmounted(() => {
  if (keyboard.value) {
    keyboard.value = null
  }
  removeGlobalListeners()
})
</script>

<template>
  <div class="global-input-method" v-show="visible">
    <!-- 提示词区域 -->
    <div v-if="prompt" class="prompt-container">
      <div class="prompt-text">{{ prompt }}</div>
      <button v-if="soundUrl" class="replay-button" @click="replaySound" title="重新播放">
        <i class="replay-icon">🔊</i>
      </button>
    </div>
    
    <div class="keyboard-header">
      <div class="keyboard-close" @click="$emit('update:visible', false)">
        <i class="close-icon">✕</i>
      </div>
    </div>
    
    <div class="keyboard-container">
      <div class="simple-keyboard"></div>
    </div>
  </div>
</template>

<style scoped>
.global-input-method {
  position: fixed;
  bottom: 0;
  left: 0;
  width: 100%;
  z-index: 1000;
  background: rgba(240, 240, 240, 0.98);
  box-shadow: 0px -2px 10px rgba(0, 0, 0, 0.1);
  border-top-left-radius: 12px;
  border-top-right-radius: 12px;
  padding: 8px 0;
  transition: all 0.3s ease;
  max-height: 50vh;
  display: flex;
  flex-direction: column;
}

.prompt-container {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 8px 15px 12px;
  background-color: #f9f9f9;
  border-radius: 8px;
  margin: 0 10px 8px;
  position: relative;
}

.prompt-text {
  font-size: 18px;
  font-weight: 500;
  color: #333;
  text-align: center;
  max-width: 90%;
}

.replay-button {
  position: absolute;
  right: 10px;
  top: 50%;
  transform: translateY(-50%);
  background-color: #409eff;
  color: white;
  border: none;
  width: 32px;
  height: 32px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s ease;
}

.replay-button:hover {
  background-color: #66b1ff;
}

.replay-button:active {
  transform: translateY(-50%) scale(0.95);
}

.replay-icon {
  font-style: normal;
  font-size: 16px;
}

.keyboard-header {
  display: flex;
  justify-content: flex-end;
  padding: 0 15px 5px;
}

.keyboard-close {
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  background-color: #e0e0e0;
  cursor: pointer;
}

.close-icon {
  font-size: 14px;
  color: #666;
  font-style: normal;
}

.keyboard-container {
  width: 100%;
  padding: 0 10px;
  overflow-x: hidden;
}

.simple-keyboard {
  font-family: 'Arial', sans-serif;
}

/* 自定义键盘按钮样式 */
:deep(.hg-button) {
  box-shadow: 0 0 3px rgba(0, 0, 0, 0.1);
  border-radius: 8px;
  font-weight: bold;
  height: 45px;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: white;
}

:deep(.hg-button:active) {
  background: #f0f0f0;
  transform: scale(0.98);
}

/* 特殊按键样式 */
:deep(.hg-button[data-skbtn="{shift}"],
.hg-button[data-skbtn="{numbers}"],
.hg-button[data-skbtn="{abc}"],
.hg-button[data-skbtn="{space}"],
.hg-button[data-skbtn="{backspace}"],
.hg-button[data-skbtn="{ent}"]) {
  background-color: #f5f5f5;
}

:deep(.hg-button[data-skbtn="{space}"]) {
  min-width: 120px;
}

:deep(.keyboard-hidden) {
  transform: translateY(100%);
}

/* 移动端适配 */
@media (max-width: 767px) {
  :deep(.hg-button) {
    height: 40px;
    font-size: 16px;
  }
  
  .global-input-method {
    max-height: 45vh;
  }
  
  .prompt-text {
    font-size: 16px;
  }
  
  .replay-button {
    width: 28px;
    height: 28px;
  }
  
  .replay-icon {
    font-size: 14px;
  }
}

/* 处理iPhone X及以上机型的底部安全区域 */
@supports (padding-bottom: env(safe-area-inset-bottom)) {
  .global-input-method {
    padding-bottom: env(safe-area-inset-bottom);
  }
}
</style> 