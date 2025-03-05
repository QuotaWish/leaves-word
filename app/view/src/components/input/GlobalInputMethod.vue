<script setup lang="ts">
import { ref, onMounted, onUnmounted, watch, nextTick } from 'vue'
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

const emit = defineEmits(['update:visible', 'input', 'replaySound', 'submit', 'verify'])

const keyboard = ref<Keyboard | null>(null)
const activeInput = ref<HTMLInputElement | null>(null)
const keyboardInput = ref('')
const layoutName = ref('default')
const isLayoutChanging = ref(false)

// 添加一个变量来跟踪上一次输入的长度
const lastInputLength = ref(0)

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
  // 此处不再主动emit，改为在具体的操作中触发
  // emit('input', value)

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

// 监听输入长度变化
watch(() => keyboardInput.value.length, (newLength, oldLength) => {
  if (newLength !== oldLength && activeInput.value) {
    // 当输入长度变化时也触发验证
    emit('verify', {
      value: keyboardInput.value,
      input: activeInput.value,
      lengthChanged: true,
      previousLength: oldLength,
      currentLength: newLength
    })
  }
})

// 当键盘输入改变时的回调
const onChange = (input: string) => {
  keyboardInput.value = input
  
  // 同步到当前激活的输入框
  if (activeInput.value) {
    activeInput.value.value = input
    // 触发input事件以便其他组件知道值已更改
    const event = new Event('input', { bubbles: true })
    activeInput.value.dispatchEvent(event)
    
    // 在任何输入变化时触发验证
    emit('verify', {
      value: input,
      input: activeInput.value
    })
  }
}

// 当按下键盘按键时的回调
const onKeyPress = (button: string) => {
  // 处理特殊键
  if (button === '{shift}' || button === '{lock}') {
    handleShift()
  } else if (button === '{numbers}' || button === '{abc}') {
    handleLayoutChange()
  } else if (button === '{ent}') {
    // 按下回车键触发提交事件
    emit('submit', {
      value: keyboardInput.value,
      input: activeInput.value
    })
    // 可选关闭键盘
    // emit('update:visible', false)
  } else if (button === '{backspace}') {
    // 处理回退键
    if (keyboardInput.value.length > 0) {
      // 删除最后一个字符
      keyboardInput.value = keyboardInput.value.slice(0, -1)
      
      // 直接修改输入框的值
      if (activeInput.value) {
        activeInput.value.value = keyboardInput.value
        // 触发input事件以便其他组件知道值已更改
        const event = new Event('input', { bubbles: true })
        activeInput.value.dispatchEvent(event)
      }
      
      // 通知父组件输入变化（传递按键信息）
      emit('input', {
        type: 'backspace', 
        value: keyboardInput.value
      })
      
      // 退格后也触发验证事件
      emit('verify', {
        value: keyboardInput.value,
        input: activeInput.value
      })
    }
  } else if (button === '{space}') {
    // 处理空格键
    keyboardInput.value += ' '
    
    // 直接修改输入框的值
    if (activeInput.value) {
      activeInput.value.value = keyboardInput.value
      // 触发input事件以便其他组件知道值已更改
      const event = new Event('input', { bubbles: true })
      activeInput.value.dispatchEvent(event)
    }
    
    // 通知父组件输入变化（传递按键信息）
    emit('input', {
      type: 'key',
      key: ' ', 
      value: keyboardInput.value
    })
    
    // 添加空格后也触发验证事件
    emit('verify', {
      value: keyboardInput.value,
      input: activeInput.value
    })
  } else {
    // 处理普通按键输入
    // 常规按键不需要做特殊处理，simple-keyboard会自动更新input值
    // 但我们需要手动触发父组件的通知
    const newValue = keyboardInput.value + button
    emit('input', {
      type: 'key',
      key: button, 
      value: newValue
    })
    
    // 输入后触发验证事件
    emit('verify', {
      value: newValue,
      input: activeInput.value
    })
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

// 处理布局切换并添加动画效果
const handleLayoutChange = () => {
  // 设置动画标志
  isLayoutChanging.value = true

  // 设置新布局
  const newLayoutName = layoutName.value !== 'numbers' ? 'numbers' : 'default'

  // 延迟切换布局以允许动画效果
  setTimeout(() => {
    layoutName.value = newLayoutName

    if (keyboard.value) {
      keyboard.value.setOptions({
        layoutName: newLayoutName
      })
    }

    // 短暂延迟后移除动画标志
    setTimeout(() => {
      isLayoutChanging.value = false
    }, 300)
  }, 100)
}

// 当input获得焦点时
const onInputFocus = (e: Event) => {
  const input = e.target as HTMLInputElement
  activeInput.value = input
  keyboardInput.value = input.value
  // 记录初始长度
  lastInputLength.value = input.value.length

  if (keyboard.value) {
    keyboard.value.setInput(input.value)
  }

  // 显示键盘
  emit('update:visible', true)
  
  // 初始焦点时也触发一次验证
  emit('verify', {
    value: input.value,
    input: input,
    lengthChanged: false,
    currentLength: input.value.length
  })
}

// 当input值直接改变时
const onInputChange = (e: Event) => {
  const input = e.target as HTMLInputElement
  if (input === activeInput.value && keyboard.value) {
    const newValue = input.value
    const newLength = newValue.length
    const hasLengthChanged = newLength !== lastInputLength.value
    
    keyboardInput.value = newValue
    keyboard.value.setInput(newValue)
    
    // 更新长度记录
    lastInputLength.value = newLength
    
    // 当输入变化时触发验证事件
    emit('verify', {
      value: newValue,
      input: activeInput.value,
      lengthChanged: hasLengthChanged,
      previousLength: hasLengthChanged ? lastInputLength.value : newLength,
      currentLength: newLength
    })
  }
}

// // 使用MutationObserver监控输入框的值变化
// const setupInputValueObserver = (input: HTMLInputElement) => {
//   if (!input) return
  
//   // 创建一个观察器实例
//   const observer = new MutationObserver((mutations) => {
//     mutations.forEach((mutation) => {
//       if (mutation.type === 'attributes' && mutation.attributeName === 'value') {
//         const newValue = input.value
//         const newLength = newValue.length
        
//         if (newLength !== lastInputLength.value) {
//           lastInputLength.value = newLength
          
//           emit('verify', {
//             value: newValue,
//             input: input,
//             lengthChanged: true,
//             previousLength: lastInputLength.value,
//             currentLength: newLength
//           })
//         }
//       }
//     })
//   })
  
//   // 配置观察选项
//   const config = { attributes: true, attributeFilter: ['value'] }
  
//   // 开始观察目标节点
//   observer.observe(input, config)
  
//   return observer
// }

// 扩展setupGlobalListeners以添加输入长度监听
const setupGlobalListeners = () => {
  // 获取所有的input元素
  const inputs = document.querySelectorAll('input:not([type="hidden"]), textarea')

  // 为每个input添加focus事件监听
  inputs.forEach(input => {
    input.addEventListener('focus', onInputFocus)
    input.addEventListener('input', onInputChange)
    // 添加keydown监听，用于即时检测长度变化
    input.addEventListener('keydown', onInputKeyDown as EventListener)
  })

  // 添加点击其他区域隐藏键盘的逻辑
  document.addEventListener('click', onDocumentClick)
}

// 移除全局监听器时也要移除keydown监听
const removeGlobalListeners = () => {
  const inputs = document.querySelectorAll('input:not([type="hidden"]), textarea')

  inputs.forEach(input => {
    input.removeEventListener('focus', onInputFocus)
    input.removeEventListener('input', onInputChange)
    input.removeEventListener('keydown', onInputKeyDown as EventListener)
  })

  document.removeEventListener('click', onDocumentClick)
}

// 添加keydown事件监听
const onInputKeyDown = (e: Event) => {
  const input = e.target as HTMLInputElement
  
  // 使用setTimeout来在按键处理后检测长度变化
  setTimeout(() => {
    if (input === activeInput.value) {
      const newLength = input.value.length
      
      if (newLength !== lastInputLength.value) {
        const previousLength = lastInputLength.value
        lastInputLength.value = newLength
        
        emit('verify', {
          value: input.value,
          input: input,
          lengthChanged: true,
          previousLength: previousLength,
          currentLength: newLength,
          fromKeyDown: true
        })
      }
    }
  }, 0)
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
  let amo = 0

  function tryInit() {
    if ( amo >= 100 ) {
      throw new Error(`Keyboard element not found more than 100 times, this is a heavy err.`)
    }

    const keyboardElement = document.querySelector('.simple-keyboard')
    if (!keyboardElement) {
      console.warn('Keyboard element not found, retry in 1000ms')
      // 如果元素还没准备好，设置一个短暂的延迟再尝试
      amo += 1
      setTimeout(tryInit, amo * 100)
    } else {
      initKeyboard()
    }
  }

  nextTick(tryInit)
})

// 分离键盘初始化逻辑到一个独立函数
const initKeyboard = () => {
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
        "{numbers} {space}" // {ent}
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
      "{ent}": "提交",
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
}

// 组件卸载前清理
onUnmounted(() => {
  if (keyboard.value) {
    keyboard.value = null
  }
  removeGlobalListeners()
})
</script>

<template>
  <teleport to="#rootMain">
    <div class="global-input-method" :class="{ visible }">
      <!-- 标题条 -->
      <div class="keyboard-title">
        <div class="title-text">千叶单词 LeavesWord</div>
        <div v-if="false" class="keyboard-close" @click="$emit('update:visible', false)">
          <div class="i-uil-angle-down text-base"></div>
        </div>
      </div>

      <!-- 提示词区域 -->
      <div v-if="prompt" class="prompt-container">
        <div class="prompt-text">{{ prompt }}</div>
        <button v-if="soundUrl" class="replay-button" @click="replaySound" title="重新播放">
          <i class="replay-icon">🔊</i>
        </button>
      </div>

      <div class="keyboard-container" :class="{ 'layout-changing': isLayoutChanging }">
        <div class="simple-keyboard"></div>
      </div>
    </div>
  </teleport>
</template>

<style lang="scss" scoped>
.global-input-method {
  transition: transform 0.3s ease;
  transform: translateY(100%);
  &.visible {
    transform: translateY(0);
  }
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  z-index: 1000;
  background: var(--el-bg-color);
  box-shadow: 0px -2px 15px rgba(0, 0, 0, 0.1);
  border-top-left-radius: 16px;
  border-top-right-radius: 16px;
  padding: 0 0 8px;
  max-height: 50%;
  display: flex;
  flex-direction: column;
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
}

.keyboard-title {
  padding: 12px 15px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-bottom: 1px solid rgba(125, 125, 125, 0.2);
  border-top-left-radius: 16px;
  border-top-right-radius: 16px;
  position: relative;
}

.title-text {
  font-size: 16px;
  font-weight: 600;
  color: var(--el-text-color-primary);
  flex: 1;
  text-align: center;
}

.keyboard-close {
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  background-color: rgba(125, 125, 125, 0.1);
  cursor: pointer;
  transition: all 0.2s ease;
}

.keyboard-close:hover {
  background-color: rgba(125, 125, 125, 0.2);
}

.keyboard-close:active {
  transform: scale(0.92);
}

.prompt-container {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 12px 15px;
  background-color: var(--el-bg-color-overlay);
  border-radius: 12px;
  margin: 8px 10px 5px;
  position: relative;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}

.prompt-text {
  font-size: 16px;
  font-weight: 500;
  color: var(--el-text-color-primary);
  text-align: center;
  max-width: 90%;
}

.replay-button {
  position: absolute;
  right: 10px;
  top: 50%;
  transform: translateY(-50%);
  background-color: var(--el-color-primary);
  color: var(--el-color-white);
  border: none;
  width: 30px;
  height: 30px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s ease;
}

.replay-button:hover {
  background-color: var(--el-color-primary-light-3);
}

.replay-button:active {
  transform: translateY(-50%) scale(0.92);
}

.replay-icon {
  font-style: normal;
  font-size: 14px;
}

.keyboard-container {
  width: 100%;
  padding: 0 6px;
  overflow-x: hidden;
  transition: opacity 0.3s ease;
}

.keyboard-container.layout-changing {
  opacity: 0.7;
  transform: scale(0.98);
}

.simple-keyboard {
  font-family: 'Arial', sans-serif;
}

/* 设置键盘容器样式 */
.hg-theme-default {
  padding: 0.5rem;
  background-color: var(--el-fill-color-lighter);
  border-radius: 10px;
  transition: all 0.3s ease;
}

/* 自定义键盘按钮样式 */
:deep(.hg-button) {
  &:active {
    background-color: var(--el-bg-color-overlay);
  }
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.08);
  border-radius: 8px;
  font-weight: bold;
  height: 45px;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: var(--el-bg-color);
  color: var(--el-text-color-primary);
  border: none;
  margin: 4px;
  transition: all 0.2s cubic-bezier(0.175, 0.885, 0.32, 1.275);
  flex: 1;
  aspect-ratio: 1 / 1;
}

/* 确保行内按钮大小一致 */
:deep(.hg-row) {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

:deep(.hg-row > div) {
  flex: 1;
  min-width: 0;
}

/* 特殊按钮宽度调整 */
:deep(.hg-button[data-skbtn="{shift}"],
  .hg-button[data-skbtn="{backspace}"],
  .hg-button[data-skbtn="{abc}"]) {
  flex: 1.3;
}

:deep(.hg-button:active) {
  transform: translateY(2px) scale(0.95);
  box-shadow: 0 0 3px rgba(0, 0, 0, 0.1);
}

/* 特殊按键样式 */
:deep(.hg-button[data-skbtn="{shift}"],
  .hg-button[data-skbtn="{numbers}"],
  .hg-button[data-skbtn="{abc}"],
  .hg-button[data-skbtn="{backspace}"]) {
  background-color: var(--el-fill-color);
  color: var(--el-text-color-primary);
}

:deep(.hg-button[data-skbtn="{space}"]) {
  min-width: 120px;
  background-color: var(--el-fill-color);
  flex: 3;
  aspect-ratio: auto;
}

:deep(.hg-button[data-skbtn="{ent}"]) {
  background-color: var(--el-color-primary);
  color: white;
  font-weight: 600;
  flex: 1.5;
}

:deep(.hg-button[data-skbtn="{numbers}"]) {
  background-color: var(--el-fill-color);
  color: white;
  font-weight: 600;
}

:deep(.hg-row:last-child) {
  margin-top: 2px;
}

/* 键盘动画 */
.keyboard-slide-enter-active,
.keyboard-slide-leave-active {
  transition: transform 0.3s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.2s ease;
}

.keyboard-slide-enter-from,
.keyboard-slide-leave-to {
  transform: translateY(100%);
  opacity: 0;
}

/* 移动端适配 */
@media (max-width: 767px) {
  :deep(.hg-button) {
    height: 42px;
    font-size: 16px;
    margin: 3px;
  }

  .global-input-method {
    max-height: 40vh;
  }

  .prompt-text {
    font-size: 15px;
  }

  .replay-button {
    width: 28px;
    height: 28px;
  }

  .replay-icon {
    font-size: 13px;
  }
}

/* 处理iPhone X及以上机型的底部安全区域 */
@supports (padding-bottom: env(safe-area-inset-bottom)) {
  .global-input-method {
    padding-bottom: calc(env(safe-area-inset-bottom) + 5px);
  }
}
</style>