<script setup lang="ts">
import {
  type IDisplayChar,
  type IDisplayText,
  WordState,
} from "~/composables/words/mode/sound";

const props = defineProps<{
  input: string;
  origin: string;
  state: WordState;
}>();

const emits = defineEmits<{
  (e: "update:input", value: string): void;
  (e: "checkInput"): void;
}>();

async function handleCheckInput() {
  await sleep(300)

  emits("checkInput");
}

const index = ref(0);
const { input } = useVModels(props, emits);

const display = ref(true);

const displayText = computed(() => {
  const displayText: IDisplayText = {
    displayChars: [],
  };

  if (!props.origin) {
    return displayText;
  }

  // 根据 input 和 origin 生成 displayText
  for (let i = 0; i < props.origin.length; i++) {
    const originPart = props.origin?.[i];
    const inputPart = input.value?.[i];

    const displayChar: IDisplayChar = {
      char: originPart,
      isInput: !!inputPart,
      isCursor: input.value.length === i,
      isCorrect: originPart === inputPart,
      isError: originPart !== inputPart,
      isEmpty: inputPart === undefined,
      isPunctuation: /[.,!?;:'"–—()[\]{}]/.test(originPart),
      isSpace: originPart === " ",
    };

    displayText.displayChars.push(displayChar);
  }

  return displayText;
});

function handleKeyDown(e: KeyboardEvent) {
  if (index.value === -1) {
    return;
  }

  e.preventDefault();

  const allowedKeys = /^[a-z0-9]$/i;
  const key = e.key;

  if (key === "Backspace") {
    // 如果最后一个字符是 空格 就要删除两个
    if (input.value.at(-1) === " ") {
      input.value = input.value.slice(0, -2);
    } else {
      input.value = input.value.slice(0, -1);
    }
  } else if (key === "Enter") {
    handleCheckInput();
  } else if (allowedKeys.test(key)) {
    input.value += key;

    // 如果下一个位置存在空格/标点 自动添加
    const len = input.value.length;
    const totalLen = props.origin.length;

    if (len < totalLen) {
      const nextChar = props.origin?.[len];
      if (nextChar === " " || /[.,!?;:'"–—()[\]{}]/.test(nextChar)) {
        input.value += nextChar;
      }
    }

    if (len >= totalLen) {
      handleCheckInput();
    }

  }
}

onMounted(() => {
  document.addEventListener('keydown', handleKeyDown)
})

onUnmounted(() => {
  document.removeEventListener('keydown', handleKeyDown)
})
</script>

<template>
  <div :style="{ opacity: display ? '1' : '0' }" class="InputBox">
    <div v-for="(item, ind) in displayText.displayChars" :key="ind" class="word-char" :class="{
      'char-input': item.isInput,
      'char-cursor': item.isCursor,
      'char-error': item.isError,
      'char-correct': item.isCorrect,
      'char-empty': item.isEmpty,
      'char-hidden': state !== WordState.WAITING,
    }">
      <div class="char-container">{{ item.char }}</div>
      <div class="char-cursor"></div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.InputBox {
  display: flex;
  justify-content: center;
  margin: 1rem 0;
  gap: 10px;
  transition: opacity 0.3s ease;
  position: relative;

  color: var(--el-text-color-regular);
}

.InputBox .char-container {

  display: flex;
  align-items: center;
  justify-content: center;
}

.waiting .InputBox .word-char.char-empty {
  opacity: 0;
}

.InputBox .word-char .char-cursor {
  &::before {
    content: "";
    position: absolute;
    transform: translate(-50%, 0%);
    top: 0%;
    left: 50%;

    width: 2px;
    height: 80%;

    transition: opacity 0.3s ease;
    background-color: var(--theme-color);
    opacity: 0;
  }
}

.InputBox .word-char.char-cursor .char-cursor {
  &::before {
    opacity: 1;
  }
}
</style>
