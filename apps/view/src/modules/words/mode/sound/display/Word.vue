<script setup lang="ts">
import type { SoundPrepareWord } from "..";
import { type HTMLAudioSoundElement, useErrorAudio, useSuccessAudio, useWordSound } from "~/modules/words";
import { SoundExampleStage, SoundWordType, WordState } from "..";
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
const errorObj = reactive({
  count: 0,
  visible: false,
})

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

const hint = computed(() => {
  if (wordState.value === WordState.CORRECT) {
    return "success:回答正确"
  } else if (wordState.value === WordState.ERROR) {
    return "error:回答错误"
  }

  const word = currentWordItem.value
  if (word?.type === SoundWordType.DICTATION) {
    return '听写模式 - 请输入您听到的单词';
  }

  if (word?.type === SoundWordType.EXAMPLE) {
    if (word.example.stage === SoundExampleStage.PLUS_ONE) {
      return '例句模式 - 第1阶段 (单词前置+目标单词)';
    } else if (word.example.stage === SoundExampleStage.PERCENT_WORD) {
      return '例句模式 - 第2阶段 (部分例句+目标单词)';
    } else if (word.example.stage === SoundExampleStage.FULL_SENTENCE) {
      return '例句模式 - 第3阶段 (完整例句)';
    }
  }

  return ""
})

const correctAnswer = computed(() => {
  if (!prepareData.currentWord) {
    return "";
  }

  if (prepareData.currentWord.type === "dictation") {
    return prepareData.currentWord.word.word;
  }

  return currentWordItem.value?.example.parts[currentWordItem.value.example.stage];
});

async function playAudio(content?: string) {
  if (!prepareData.currentWord || wordState.value === WordState.PLAYING) {
    return;
  }

  wordState.value = WordState.PLAYING;

  if (lastAudio) {
    lastAudio?.pause();
  }

  try {
    lastAudio = await useWordSound(content ?? prepareData.currentWord.word.data!.word_head!);
  } catch (_e) {
    setTimeout(() => playAudio(content), 1200)
    return
  }

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
      currentWord.example.parts[currentWord.example.stage],
    );
  } else {
    isCorrect = inputChecker.checkDictationInput(userInput.value);
  }

  if (isCorrect) {
    wordState.value = WordState.CORRECT;

    errorObj.count = 0;
    errorObj.visible = false;

    (await useSuccessAudio()).play();

    // 成功之后 如果是 dictation 就启动例句模式
    if (currentWord?.type === SoundWordType.EXAMPLE) {
      if (currentWord.example.stage === SoundExampleStage.FULL_SENTENCE) {
        setTimeout(() => {
          nextData(true);
        }, 800);
        return
      }

      setTimeout(() => {
        currentWord.example.stage = (currentWord.example.stage + 1)

        userInput.value = '';
        wordState.value = WordState.WAITING;

        playAudio(currentWord.example.parts[currentWord.example.stage]);
      }, 1000);
      return
    }

    if (!currentWord?.example?.origin) {
      setTimeout(() => {
        nextData(true);
      }, 800);
      return
    }

    setTimeout(() => {
      currentWord.type = SoundWordType.EXAMPLE;
      currentWord.example.stage = SoundExampleStage.PLUS_ONE

      userInput.value = '';
      wordState.value = WordState.WAITING;

      playAudio(currentWord.example.parts[currentWord.example.stage]);
    }, 1000);
  } else {
    // 错误
    wordState.value = WordState.ERROR;
    errorObj.count++;

    (await useErrorAudio()).play();

    if (errorObj.count >= 2) {
      errorObj.visible = true;
    }

    setTimeout(() => {
      errorObj.visible = false;
      userInput.value = '';
      wordState.value = WordState.WAITING;

      playAudio(currentWord?.type === SoundWordType.EXAMPLE ? currentWord.example.parts[currentWord.example.stage] : undefined);
    }, 1000);
  }
}

async function nextData(success: boolean) {
  const result = await prepareData.next(success);

  if (!result) {
    await prepareData.finish();
    emits("done");
    return;
  }

  refreshData();
}

function refreshData() {
  Object.assign(prepareData, props.prepare);
  userInput.value = "";
  wordState.value = WordState.INIT;

  setTimeout(() => {
    playAudio();
  }, 300);
}

function focusInput() {
  setTimeout(() => {
    inputRef.value?.focus();
  }, 100);
}

onMounted(() => {
  if (prepareData.currentWord) {
    wordState.value = WordState.INIT;
    setTimeout(() => {
      playAudio();
    }, 300);
  }
});

watch(
  () => prepareData.currentWord,
  (newWord) => {
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
  <SoundDisplayLayout :hint="hint" v-model:input="userInput" :max="prepare.taskAmount" :left="prepare.getLeftWords()"
    :state="wordState" :loading="currentWordItem === null" @quit="handleQuit"
    @replay="playAudio(currentWordItem?.type === SoundWordType.EXAMPLE ? currentWordItem.example.parts[currentWordItem.example.stage] : undefined);">
    <template #badge>
      {{ wordTypeLabel }}
    </template>

    <div class="SoundWordMode-InputContainer">
      <SoundInput v-model:input="userInput" :origin="inputOrigin" :state="wordState" :type="currentWordItem?.type"
        :example-stage="currentWordItem?.example.stage" @check-input="checkAnswer" />

      <div :class="{ visible: errorObj.visible }" class="result-display transition-cubic">
        <div class="flex flex-col w-full gap-1">
          <p font-bold>正确答案</p>
          <p>{{ correctAnswer }}</p>
        </div>
      </div>
    </div>
  </SoundDisplayLayout>
</template>

<style lang="scss" scoped>
.result-display {
  &.visible {
    opacity: 1;
    transform: scale(1);
  }

  margin-top: 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 20px;
  padding: 16px;
  border-radius: 12px;
  transition: all 0.3s;

  color: #e74c3c;
  background-color: rgba(231, 76, 60, 0.1);
  border: 1px solid rgba(231, 76, 60, 0.3);

  opacity: 0;
  transform: scale(1.05);
}
</style>
