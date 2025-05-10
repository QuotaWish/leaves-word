<script setup lang="ts">
import type { SoundPrepareWord } from "..";
import { type HTMLAudioSoundElement, useErrorAudio, useSuccessAudio, useWordSound } from "~/modules/words";
import { SoundWordType, WordState } from "..";
import { useLogger } from '../../../util';
import SoundInput from './addon/SoundInput.vue';
import SoundDisplayLayout from "./SoundDisplayLayout.vue";

const props = defineProps<{
  prepare: SoundPrepareWord;
}>();

const emits = defineEmits<{
  (e: "quit"): void;
  (e: "done"): void;
}>();

const wordState = ref<WordState>(WordState.INIT);
const userInput = ref("");
const inputRef = ref<HTMLInputElement | null>(null);
const prepareData = reactive(props.prepare);
const showResult = ref(false); // 控制结果显示的动画

let lastAudio: HTMLAudioSoundElement | null = null;

const currentWordItem = computed(() => {
  console.log("Current word computed:", prepareData.currentWord);
  return prepareData.currentWord;
});

const inputOrigin = computed(() => {
  const word = currentWordItem.value
  if (!word) {
    return "";
  }

  if (word.type === SoundWordType.DICTATION) {
    return word.word.word;
  }

  if (word.type === SoundWordType.EXAMPLE) {
    const stage = word.example.stage;

    return word.example.parts[stage]
  }

  return "";
})

const wordTypeLabel = computed(() => {
  if (!prepareData.currentWord) {
    return "";
  }

  if (prepareData.currentWord.type === "dictation") {
    return "听写模式";
  }

  if (prepareData.currentWord.type === "example") {
    const stage = prepareData.currentWord.example.stage;
    if (stage === 0) {
      return "例句学习 (阶段1)";
    }

    if (stage === 1) {
      return "例句学习 (阶段2)";
    }

    if (stage === 2) {
      return "例句学习 (阶段3)";
    }

    return "例句学习";
  }

  return "";
});

const correctAnswer = computed(() => {
  if (!prepareData.currentWord) {
    return "";
  }

  if (prepareData.currentWord.type === "dictation") {
    return prepareData.currentWord.word.word;
  }

  // 简化的例句答案显示逻辑
  return prepareData.currentWord.word.word;
});

async function playAudio() {
  if (!prepareData.currentWord || wordState.value === WordState.PLAYING) {
    return;
  }

  wordState.value = WordState.PLAYING;

  if (lastAudio) {
    lastAudio?.pause();
  }

  lastAudio = await useWordSound(prepareData.currentWord.word.data!.word_head!);

  await lastAudio.waitForPlay();

  wordState.value = WordState.WAITING;
  focusInput()
}

function useInputChecker(prepareData: SoundPrepareWord) {
  const logger = useLogger('InputChecker');

  function checkExampleInput(userInput: string, exampleDisplay: string): boolean {
    // 如果任一输入为空，直接返回false
    if (!userInput.trim() || !exampleDisplay.trim()) {
      logger.error('输入或期望例句为空');
      return false;
    }

    // 增强的清理函数，更好地处理各种标点和空格
    const cleanText = (text: string): string => {
      return text
        .toLowerCase() // 转小写
        .replace(/\s+/g, '') // 移除所有空白字符
        .replace(/[.,!?;:'"–—()[\]{}<>]/g, '') // 移除所有标点符号
        .trim(); // 去除首尾空格
    };

    // 清理用户输入和期望文本
    const cleanUserInput = cleanText(userInput);
    const cleanExpectedText = cleanText(exampleDisplay);

    // 记录日志以便调试
    logger.log(`原始用户输入: "${userInput}"`);
    logger.log(`原始期望文本: "${exampleDisplay}"`);
    logger.log(`清理后用户输入: "${cleanUserInput}"`);
    logger.log(`清理后期望文本: "${cleanExpectedText}"`);
    logger.log(`对比结果: ${cleanUserInput === cleanExpectedText ? '匹配' : '不匹配'}`);

    // 添加模糊匹配逻辑：如果用户输入包含期望文本的90%以上的字符
    if (cleanUserInput.length > 0 && cleanExpectedText.length > 0) {
      // 当两个文本接近但不完全相同时，计算相似度
      if (cleanUserInput !== cleanExpectedText &&
        (cleanUserInput.includes(cleanExpectedText) ||
          cleanExpectedText.includes(cleanUserInput))) {
        // 计算Levenshtein距离（编辑距离）
        const maxLength = Math.max(cleanUserInput.length, cleanExpectedText.length);
        const similarityThreshold = 0.9; // 90%相似度阈值

        // 如果较长文本包含较短文本，且长度差距不超过总长度的10%，认为是匹配的
        const lengthDiff = Math.abs(cleanUserInput.length - cleanExpectedText.length);
        const similarityRatio = 1 - (lengthDiff / maxLength);

        if (similarityRatio >= similarityThreshold) {
          logger.log(`模糊匹配成功，相似度: ${similarityRatio}`);
          return true;
        }
      }
    }

    // 精确匹配
    return cleanUserInput === cleanExpectedText;
  }

  function checkDictationInput(userInput: string): boolean {
    return prepareData.checkUserInput(userInput);
  }

  return {
    checkExampleInput,
    checkDictationInput,
  };
}

const inputChecker = useInputChecker(props.prepare)

async function checkAnswer() {
  if (wordState.value !== WordState.WAITING || !prepareData.currentWord) {
    return;
  }

  let isCorrect = false;
  const currentWord = currentWordItem.value

  if (currentWord?.type === SoundWordType.EXAMPLE) {
    // 例句模式
    isCorrect = inputChecker.checkExampleInput(
      userInput.value,
      "", // TODO
    );
  } else {
    isCorrect = inputChecker.checkDictationInput(userInput.value);
  }

  if (isCorrect) {
    wordState.value = WordState.CORRECT;

    (await useSuccessAudio()).play();

    // 延迟进入下一个
    setTimeout(() => {
      nextData(true);
    }, 800);
  } else {
    // 错误
    wordState.value = WordState.ERROR;
    // errorCount.value++;

    (await useErrorAudio()).play();

    // if (errorCount.value >= 2) {
    //   showHint.value = true;
    // }

    setTimeout(() => {
      userInput.value = '';
      wordState.value = WordState.WAITING;

      if (currentWord?.type === SoundWordType.DICTATION) {
        playAudio();
      }
    }, 1000);
  }
}

async function nextData(success: boolean) {
  // 获取下一个单词数据
  const result = await prepareData.next(success);

  if (!result) {
    await prepareData.finish();
    emits("done");
    return;
  }

  refreshData();
}

function refreshData() {
  // 更新当前单词数据
  Object.assign(prepareData, props.prepare);
  userInput.value = "";
  wordState.value = WordState.INIT;

  setTimeout(() => {
    playAudio();
  }, 300);
}

function handleNext() {
  showResult.value = false;
  userInput.value = "";
  wordState.value = WordState.INIT;
  refreshData();
}

function focusInput() {
  setTimeout(() => {
    inputRef.value?.focus();
  }, 100);
}

// 生命周期钩子
onMounted(() => {
  console.log("Word component mounted, currentWord:", prepareData.currentWord);
  if (prepareData.currentWord) {
    wordState.value = WordState.INIT;
    console.log("Initial state set to INIT");
    setTimeout(() => {
      playAudio();
    }, 300);
  }
});

watch(
  () => prepareData.currentWord,
  (newWord, oldWord) => {
    console.log("Watch triggered - New word:", newWord, "Old word:", oldWord);
    if (newWord) {
      userInput.value = "";
      wordState.value = WordState.INIT;
      setTimeout(() => {
        playAudio();
      }, 300);
    }
  },
  { immediate: true },
);

function handleQuit() {
  emits('quit')
}
</script>

<template>
  <SoundDisplayLayout v-model:input="userInput" :max="prepare.taskAmount" :left="prepare.getLeftWords()"
    :state="wordState" :loading="currentWordItem === null" @quit="handleQuit" @replay="playAudio">
    <template #badge>
      {{ wordTypeLabel }}
    </template>

    <div class="SoundWordMode-InputContainer">
      <SoundInput v-model:input="userInput" :origin="inputOrigin" :state="wordState" :type="currentWordItem?.type"
        :example-stage="currentWordItem?.example.stage" @check-input="checkAnswer" />

      <!-- 结果显示区域 -->
      <transition name="fade">
        <div v-if="(wordState === 'correct' || wordState === 'error') && showResult" class="result-display" :class="{
          'correct-display': wordState === 'correct',
          'error-display': wordState === 'error',
        }">
          <div v-if="wordState === 'correct'" class="correct-result">
            <span class="result-icon">✓</span>
            <span class="result-text">正确!</span>
          </div>
          <div v-if="wordState === 'error'" class="error-result">
            <span class="result-icon">✗</span>
            <span class="result-text">正确答案: {{ correctAnswer }}</span>
          </div>

          <button class="next-btn" @click="handleNext">
            <span class="next-icon">→</span>
            <span>下一个</span>
          </button>
        </div>
      </transition>
    </div>
  </SoundDisplayLayout>
</template>

<style scoped>
.result-display {
  margin-top: 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 20px;
  padding: 16px;
  border-radius: 12px;
  transition: all 0.3s;
}

.correct-display {
  background-color: rgba(46, 204, 113, 0.1);
  border: 1px solid rgba(46, 204, 113, 0.3);
}

.error-display {
  background-color: rgba(231, 76, 60, 0.1);
  border: 1px solid rgba(231, 76, 60, 0.3);
}

.correct-result,
.error-result {
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 18px;
  font-weight: 500;
}

.correct-result {
  color: #2ecc71;
}

.error-result {
  color: #e74c3c;
}

.result-icon {
  font-size: 24px;
  font-weight: bold;
}

.next-btn {
  background-color: #2ecc71;
  color: white;
  border: none;
  border-radius: 12px;
  padding: 12px 24px;
  font-size: 16px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s;
  display: flex;
  align-items: center;
  gap: 8px;
  box-shadow: 0 4px 8px rgba(46, 204, 113, 0.2);
}

.next-btn:hover {
  background-color: #27ae60;
  transform: translateY(-2px);
  box-shadow: 0 6px 12px rgba(46, 204, 113, 0.3);
}

.next-icon {
  font-size: 18px;
}

/* 过渡动画 */
.fade-enter-active,
.fade-leave-active {
  transition:
    opacity 0.3s,
    transform 0.3s;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
  transform: translateY(10px);
}

.fade-enter-to,
.fade-leave-from {
  opacity: 1;
  transform: translateY(0);
}
</style>
