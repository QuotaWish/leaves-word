<script setup lang="ts">
import Keyboard from 'simple-keyboard'
import { useCherryTapAudio } from '~/modules/words'
import 'simple-keyboard/build/css/index.css'

const props = defineProps<{
  visible: boolean
  targetInput?: Ref<HTMLInputElement>
}>()

const emit = defineEmits(['update:visible', 'input', 'submit'])

const keyboard = ref<Keyboard | null>(null)
const activeInput = ref<HTMLInputElement | null>(null)
const keyboardInput = ref('')
const layoutName = ref('default')
const isLayoutChanging = ref(false)

const lastInputLength = ref(0)

function handleShift() {
  const newLayoutName = layoutName.value === 'default' ? 'shift' : 'default'
  layoutName.value = newLayoutName

  if (keyboard.value) {
    keyboard.value.setOptions({
      layoutName: newLayoutName,
    })
  }
}

watch(() => keyboardInput.value, (value) => {
  if (activeInput.value) {
    activeInput.value.value = value
    const event = new Event('input', { bubbles: true })
    activeInput.value.dispatchEvent(event)
  }
})

// 当按下键盘按键时的回调
async function onKeyPress(button: string) {
  (await useCherryTapAudio()).play()

  if (button === '{shift}' || button === '{lock}') {
    handleShift()
  } else if (button === '{numbers}' || button === '{abc}') {
    handleLayoutChange()
  } else if (button === '{ent}') {
    emit('submit', {
      value: keyboardInput.value,
      input: activeInput.value,
    })
  } else if (button === '{backspace}') {
    if (keyboardInput.value.length > 0) {
      keyboardInput.value = keyboardInput.value.slice(0, -1)

      emit('input', {
        type: 'backspace',
        value: keyboardInput.value,
      })
    }
  } else if (button === '{space}') {
    keyboardInput.value += ' '

    emit('input', {
      type: 'key',
      key: ' ',
      value: keyboardInput.value,
    })
  } else {
    const newValue = keyboardInput.value = keyboardInput.value + button
    emit('input', {
      type: 'key',
      key: button,
      value: newValue,
    })
  }
}

function handleLayoutChange() {
  isLayoutChanging.value = true

  const newLayoutName = layoutName.value !== 'numbers' ? 'numbers' : 'default'

  setTimeout(() => {
    layoutName.value = newLayoutName

    if (keyboard.value) {
      keyboard.value.setOptions({
        layoutName: newLayoutName,
      })
    }

    setTimeout(() => {
      isLayoutChanging.value = false
    }, 300)
  }, 100)
}

function onInputFocus(e: Event) {
  const input = e.target as HTMLInputElement
  activeInput.value = input
  keyboardInput.value = input.value
  lastInputLength.value = input.value.length

  if (keyboard.value) {
    keyboard.value.setInput(input.value)
  }

  emit('update:visible', true)
}

function setupGlobalListeners() {
  const inputs = document.querySelectorAll('input:not([type="hidden"]), textarea')

  inputs.forEach((input) => {
    input.addEventListener('focus', onInputFocus)
  })

  document.addEventListener('click', onDocumentClick)
}

function removeGlobalListeners() {
  const inputs = document.querySelectorAll('input:not([type="hidden"]), textarea')

  inputs.forEach((input) => {
    input.removeEventListener('focus', onInputFocus)
  })

  document.removeEventListener('click', onDocumentClick)
}

function onDocumentClick(e: MouseEvent) {
  const target = e.target as HTMLElement
  const keyboardElement = document.querySelector('.simple-keyboard')
  const isInput = target.tagName === 'INPUT' || target.tagName === 'TEXTAREA'

  // 如果点击的不是输入框和键盘，则隐藏键盘
  if (!isInput && keyboardElement && !keyboardElement.contains(target)) {
    emit('update:visible', false)
  }
}

onMounted(() => {
  let amo = 0

  function tryInit() {
    if (amo >= 100) {
      throw new Error(`Keyboard element not found more than 100 times, this is a heavy err.`)
    }

    const keyboardElement = document.querySelector('.simple-keyboard')
    if (!keyboardElement) {
      // console.warn('Keyboard element not found, retry in 1000ms')
      // 如果元素还没准备好，设置一个短暂的延迟再尝试
      amo += 1
      setTimeout(tryInit, amo * 100)
    } else {
      initKeyboard()
    }
  }

  nextTick(tryInit)
})

function initKeyboard() {
  keyboard.value = new Keyboard({
    // onChange: input => onChange(input),
    onKeyPress: button => onKeyPress(button),
    mergeDisplay: true,
    layoutName: 'default',
    layout: {
      default: [
        "q w e r t y u i o p",
        "a s d f g h j k l",
        "{shift} z x c v b n m {backspace}",
        "{numbers} {space}", // {ent}
      ],
      shift: [
        "Q W E R T Y U I O P",
        "A S D F G H J K L",
        "{shift} Z X C V B N M {backspace}",
        "{numbers} {space}",
      ],
      numbers: ["1 2 3", "4 5 6", "7 8 9", "{abc} 0 {backspace}"],
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
      "{abc}": "ABC",
      "{space}": "空格",
    },
  })

  // 设置全局监听器
  setupGlobalListeners()

  // 如果有指定目标输入元素，则直接关联
  if (props.targetInput) {
    const targetEl = props.targetInput.value
    if (targetEl) {
      activeInput.value = targetEl
      keyboardInput.value = targetEl.value

      if (keyboard.value) {
        keyboard.value.setInput(targetEl.value)
      }
    }
  }
}

onUnmounted(() => {
  if (keyboard.value) {
    keyboard.value = null
  }
  removeGlobalListeners()
})

defineExpose({
  clearInnerInput() {
    keyboardInput.value = ''
  },
})
</script>

<template>
  <teleport defer to="#rootMain">
    <div class="GlobalInputMethod transition-cubic" :class="{ visible }">
      <div class="GlobalInputMethod-Toolbar">
        <div class="title-text">
          千叶单词 LeavesWord
        </div>
        <div v-if="false" class="keyboard-close" @click="$emit('update:visible', false)">
          <div class="i-uil-angle-down text-base" />
        </div>

        <slot name="toolbar" />
      </div>

      <div class="keyboard-container" :class="{ 'layout-changing': isLayoutChanging }">
        <div class="simple-keyboard" />
      </div>
    </div>
  </teleport>
</template>

<style lang="scss" scoped>
.GlobalInputMethod {
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

.GlobalInputMethod-Toolbar {
  height: 40px;

  display: flex;
  align-items: center;
  justify-content: space-between;
  border-bottom: 1px solid rgba(125, 125, 125, 0.2);
  border-top-left-radius: 16px;
  border-top-right-radius: 16px;
  position: relative;
}

.title-text {
  position: absolute;

  opacity: 0.125;
  font-size: 12px;
  font-weight: 600;
  color: var(--el-text-color-primary);

  top: 50%;
  left: 50%;

  transform: translate(-50%, -50%);
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

.keyboard-close:active {
  transform: scale(0.92);
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
:deep(.hg-button[data-skbtn='{shift}'], .hg-button[data-skbtn='{backspace}'], .hg-button[data-skbtn='{abc}']) {
  flex: 1.3;
}

:deep(.hg-button:active) {
  transform: translateY(2px) scale(0.95);
  box-shadow: 0 0 3px rgba(0, 0, 0, 0.1);
}

/* 特殊按键样式 */
:deep(.hg-button[data-skbtn='{shift}'],
  .hg-button[data-skbtn='{numbers}'],
  .hg-button[data-skbtn='{abc}'],
  .hg-button[data-skbtn='{backspace}']) {
  background-color: var(--el-fill-color);
  color: var(--el-text-color-primary);
}

:deep(.hg-button[data-skbtn='{space}']) {
  min-width: 120px;
  background-color: var(--el-fill-color);
  flex: 3;
  aspect-ratio: auto;
}

:deep(.hg-button[data-skbtn='{ent}']) {
  background-color: var(--el-color-primary);
  color: var(--el-text-color-primary);
  font-weight: 600;
  flex: 1.5;
}

:deep(.hg-button[data-skbtn='{numbers}']) {
  background-color: var(--el-fill-color);
  color: var(--el-text-color-primary);
  font-weight: 600;
}

:deep(.hg-row:last-child) {
  margin-top: 2px;
}

/* 键盘动画 */
.keyboard-slide-enter-active,
.keyboard-slide-leave-active {
  transition:
    transform 0.3s ease,
    opacity 0.2s ease;
}

.keyboard-slide-enter-from,
.keyboard-slide-leave-to {
  transform: translateY(100%);
  opacity: 0;
}

/* 处理iPhone X及以上机型的底部安全区域 */
@supports (padding-bottom: env(safe-area-inset-bottom)) {
  .global-input-method {
    padding-bottom: calc(env(safe-area-inset-bottom) + 5px);
  }
}
</style>
