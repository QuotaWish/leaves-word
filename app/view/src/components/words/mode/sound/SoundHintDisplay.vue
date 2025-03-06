<script setup lang="ts">
import { SoundPrepareWord } from '~/composables/words/mode/sound';

const props = defineProps<{
  word: SoundPrepareWord
  display: boolean
}>()

const emits = defineEmits<{
  (e: "update:display", value: boolean): void
}>()

const display = useVModel(props, "display", emits)

const mainWord = computed(() => {
  return props.word.currentWord?.word.mainWord;
})

// 获取提示内容（单词意思和例句）
const hintContent = computed(() => {
  if (!mainWord.value) {
    return { meaning: "", example: "" };
  }

  const meaning = mainWord.value?.translation || mainWord.value?.definition || "";
  const examples = mainWord.value?.examples || [];
  const example = examples.length > 0 ? examples[0].sentence : "";

  return { meaning, example };
});
</script>

<template>
  <!-- 提示区域 -->
  <transition name="fade">
    <div v-if="display" class="hint-container">
      <div class="hint-box">
        <div class="hint-word">
          {{ mainWord?.word }}
        </div>
        <div class="hint-meaning">{{ hintContent.meaning }}</div>
        <div v-if="hintContent.example" class="hint-example">
          {{ hintContent.example }}
        </div>
      </div>
    </div>
  </transition>
</template>

<style lang="scss" scoped>
.hint-container {
  position: relative;

  width: 100%;
  max-width: 320px;

  left: 50%;
  transform: translateX(-50%);
}

.hint-box {
  background: var(--theme-glass);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border-radius: 16px;
  border: none;
  padding: 20px;
  box-shadow: none;
  text-align: center;
  animation: fadeIn 0.3s ease-in-out;
}

.hint-word {
  font-size: 26px;
  font-weight: bold;
  color: var(--theme-primary);
  margin-bottom: 15px;
  letter-spacing: 1px;
  text-shadow: none;
}

.hint-meaning {
  font-size: 18px;
  color: var(--theme-text);
  margin-bottom: 15px;
  line-height: 1.5;
}

.hint-example {
  font-size: 16px;
  color: var(--theme-text);
  opacity: 0.9;
  font-style: italic;
  line-height: 1.5;
  padding: 10px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 8px;
  margin-top: 10px;
}
</style>