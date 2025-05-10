<script setup lang="ts">
import IconButton from '~/components/button/IconButton.vue';
import { WordState } from '..';
import SoundEmoji from './addon/SoundEmoji.vue'
import SoundHeader from './SoundHeader.vue'

const props = defineProps<{
  state: WordState
  loading: boolean
  max: number
  left: number
  input: string
  hint: string
}>()

const emits = defineEmits<{
  (e: "quit"): void;
  (e: "replay"): void;
  (e: "update:input", value: string): void;
}>()

const userInput = useVModel(props, 'input', emits)
const inputMethod = useTemplateRef('inputMethod')

function handleReplay() {
  emits("replay")
}

watch(() => props.state, (value) => {
  if (value === WordState.INIT) {
    inputMethod.value?.clearInnerInput()
  }
}, { immediate: true })

function handleKeydown(event: any) {
  // 如果是对象格式，说明是来自键盘组件
  if (typeof event === 'object' && event !== null) {
    if (event.type === 'backspace') {
      // 处理回退键
      if (userInput.value.length > 0) {
        userInput.value = userInput.value.slice(0, -1);
      }
    } else if (event.type === 'key') {
      // 处理普通按键
      userInput.value += event.key;
    }
  } else if (typeof event === 'string') {
    // 兼容旧格式（直接传递字符串）
    userInput.value = event;
  }
  // 处理键盘事件对象（来自原生键盘）
  else if (event instanceof KeyboardEvent) {
    if (event.key === 'Backspace') {
      if (userInput.value.length > 0) {
        userInput.value = userInput.value.slice(0, -1);
      }
    } else if (event.key.length === 1) {
      userInput.value += event.key;
    }
  }
}
</script>

<template>
  <RoutePage :class="[state]" :loading="loading" class="SoundWordModePage h-full">
    <template #header>
      <SoundHeader :hint="hint" :max="max" :left="left" @quit="emits('quit')">
        <template #badge>
          <slot name="badge" />
        </template>
      </SoundHeader>
    </template>
    <div class="SoundWordModePage-Container absolute h-full w-full flex flex-col items-center p-4">
      <div class="SoundWordModePage-Shadow transition-cubic" />

      <div class="SoundWordModePage-Emoji transition-cubic">
        <SoundEmoji :word-state="state" />
      </div>

      <div class="SoundWordModePage-Content transition-cubic">
        <slot />
      </div>

      <!-- <div class="SoundWordModePage-FakeInput"> -->
      <GlobalInputMethod ref="inputMethod" @input="handleKeydown" :visible="state === WordState.WAITING">
        <template #toolbar>
          <div class="tool-bar w-full px-4 flex justify-end">
            <IconButton @click="handleReplay" round :disabled="state === WordState.PLAYING">
              重新播放
              <div i-carbon:play-filled />
            </IconButton>
          </div>
        </template>
      </GlobalInputMethod>
      <!-- </div> -->
    </div>
  </RoutePage>
</template>

<style lang="scss" scoped>
.SoundWordModePage-Shadow {
  .SoundWordModePage.error & {
    opacity: 1;
    transform: translateY(0%);
    background-color: var(--el-color-danger);
  }

  .SoundWordModePage.playing & {
    opacity: 0.5;
    transform: translateY(0%);
    background-color: var(--theme-color-primary);
  }

  z-index: -1;
  position: absolute;

  top: 0;
  left: 0;

  width: 100%;
  height: 10%;

  opacity: 0;
  filter: blur(100px);
  pointer-events: none;
  transform: translateY(-10%);
}

.SoundWordModePage-Content {
  margin-top: calc(64px + 1rem);
}

.SoundWordModePage-Emoji {
  .SoundWordModePage.playing & {
    top: 50%;

    transform: translate(-50%, -50%) scale(2);
  }

  z-index: 1000;
  position: absolute;
  display: flex;

  width: 64px;
  height: 64px;

  top: 1rem;
  left: 50%;

  align-items: center;
  justify-content: center;

  border-radius: 50%;
  transform: translate(-50%, 0);
  background-color: var(--theme-color-primary);
}
</style>
