<script setup lang="ts">
import type {
  ISoundWordItem,
  SoundPrepareWord,
} from "~/composables/words/mode/sound";
import {
  useSuccessAudio,
  useWordSound,
} from "~/composables/words";
import {
  ExampleStage,
  SoundWordType,
  WordState,
} from "~/composables/words/mode/sound";
import SoundLayout from "./SoundLayout.vue";

const props = defineProps<{
  prepare: SoundPrepareWord;
}>();

const emits = defineEmits<{
  (e: "quit"): void;
  (e: "done"): void;
}>();

const userInput = ref("");
const displayInput = ref("");

const wordState = ref<WordState>(WordState.INIT);
const errorCount = ref(0); // 错误计数器
const showHint = ref(false); // 是否显示提示

const audioPosition = ref("center"); // center, top

const showInputContainer = ref(false);
const prepareData = shallowReactive(props.prepare);

const currentWord = ref<ISoundWordItem | null>(null);

const currentHintText = computed(() => {
  if (!currentWord.value) {
    return "";
  }

  if (currentWord.value.type === SoundWordType.DICTATION) {
    return "请输入您听到的单词";
  }

  const stage = currentWord.value.exampleStage || 0;
  return stage === ExampleStage.FULL_SENTENCE
    ? "请输入完整的例句"
    : "请输入您看到的例句部分";
});

// 修复 refreshData 函数逻辑
async function refreshData() {
  currentWord.value = prepareData.currentWord;
  Object.assign(prepareData, props.prepare);
  userInput.value = "";
  displayInput.value = "";
  errorCount.value = 0;
  showHint.value = false;
  showInputContainer.value = false;

  wordState.value = WordState.TRANSITIONING;
  await sleep(300)

  wordState.value = WordState.PLAYING;
  audioPosition.value = "center";

  await sleep(300)

  wordState.value = WordState.WAITING;
  audioPosition.value = "top";
}

watchEffect(() => {
  if (!currentWord.value) {
    return;
  }

  if (currentWord.value.type === SoundWordType.EXAMPLE) {
    const examples = currentWord.value.word.mainWord?.examples || [];
    if (examples.length === 0) {
      // 没有例句，跳到下一个
      console.warn("没有例句，跳过此单词");
      nextData(true);
      return;
    }
  }

  playAudio();
})

async function nextData(success: boolean) {
  // 如果正在过渡中，不执行
  if (wordState.value === WordState.TRANSITIONING) {
    return;
  }

  // 设置为淡出状态
  wordState.value = WordState.FADE_OUT;

  // 等待过渡动画完成
  await sleep(700);

  // 获取下一个单词数据
  const result = await prepareData.next(success);

  if (!result) {
    await prepareData.finish();
    emits("done");
    return;
  }

  // 重置状态并加载新单词
  refreshData();

  // 设置为淡入状态
  wordState.value = WordState.FADE_IN;

  // 动画完成后移除动画类
  setTimeout(() => {
    wordState.value = WordState.WAITING;
  }, 600);
}

// 检查用户输入是否正确
function checkInput() {
  if (!currentWord.value || wordState.value !== WordState.WAITING) {
    return;
  }

  let isCorrect;

  if (currentWord.value.type === SoundWordType.EXAMPLE) {
    // 例句模式：只比较字母和数字部分，忽略所有标点和空格
    const cleanUserInput = userInput.value
      .replace(/[.,!?;:'"–—()[\]{} ]/g, "")
      .toLowerCase()
      .trim();
    const cleanExpectedText = prepareData
      .getExampleDisplay()
      .replace(/[.,!?;:'"–—()[\]{} ]/g, "")
      .toLowerCase()
      .trim();
    isCorrect = cleanUserInput === cleanExpectedText;
  } else {
    // 听写模式保持原有逻辑
    isCorrect = prepareData.checkUserInput(userInput.value);
  }

  if (isCorrect) {
    // 标记为正确状态
    wordState.value = WordState.CORRECT;
    errorCount.value = 0;
    showHint.value = false;

    // 播放成功音效
    useSuccessAudio().play();

    // 等待一会儿让用户看到正确反馈
    setTimeout(() => {
      // 进入下一个单词
      nextData(true);
    }, 1000);
  } else {
    // 标记为错误状态
    wordState.value = WordState.ERROR;
    errorCount.value++;

    // 连续错误2次以上显示提示
    if (errorCount.value >= 2) {
      showHint.value = true;
    }

    // 清空输入，让用户重新输入
    setTimeout(() => {
      displayInput.value = "";
      userInput.value = "";
      wordState.value = WordState.WAITING;
    }, 1000);

    // 重新播放音频
    if (currentWord.value.type === SoundWordType.DICTATION) {
      setTimeout(() => {
        playAudio();
      }, 1200);
    }
  }
}

let lastAudio: HTMLAudioElement | null = null;
// 播放音频
async function playAudio() {
  if (lastAudio) {
    lastAudio.pause();
  }

  const word = currentWord.value?.word.mainWord;
  if (!word) {
    return;
  }

  // 清晰区分不同模式的音频播放
  if (currentWord.value?.type === SoundWordType.EXAMPLE) {
    // 例句模式，优先使用当前需要输入的部分
    const exampleDisplay = prepareData.getExampleDisplay();
    if (exampleDisplay) {
      lastAudio = await useWordSound(exampleDisplay);
      lastAudio.play();
      return;
    }

    // 如果没有获取到当前需要输入的部分，尝试使用完整例句
    const examples = word.examples || [];
    if (examples.length > 0) {
      const example = examples[0].sentence || "";
      if (example) {
        lastAudio = await useWordSound(example);
        lastAudio.play();
        return;
      }
    }
    // 都没有则降级到单词音频
    lastAudio = await useWordSound(word.word);
  } else {
    // 听写模式，使用单词音频
    lastAudio = await useWordSound(word.word);
  }

  lastAudio.play();
}

// 确保taskAmount属性存在
const taskAmount = computed(() => {
  return (
    prepareData.taskAmount ||
    prepareData.getNewlyWords() + prepareData.getLeftWords()
  );
});

onMounted(refreshData);
</script>

<template>
  <SoundLayout
    :newly-words="prepareData.getNewlyWords()"
    :total-words="taskAmount"
    :left-words="prepareData.getLeftWords()"
    :hint-text="currentHintText"
    :content-hidden="wordState === WordState.PLAYING"
    @play-audio="playAudio"
    @quit="emits('quit')"
    :class="[wordState]"
  >
    <div
      class="transition-cubic SoundWordCard-Main learning-card"
      :class="wordState"
    >

      <div
        class="word-audio"
        :class="[
          { playing: wordState === WordState.PLAYING },
          { 'position-center': audioPosition === 'center' },
          { 'position-top': audioPosition === 'top' },
        ]"
        @click="playAudio"
      >
        <i v-if="wordState === WordState.PLAYING" block i-carbon-play-filled-alt />
        <i v-else block i-carbon-pause-filled />
        <div class="sound-wave" />
      </div>

      <div
        class="relative w-full h-full"
        :class="{ 'content-hidden': wordState === WordState.PLAYING }"
      >
        <!-- 单词信息区域 -->
        <div class="word-info h-full flex flex-col justify-between">
          <!-- 听写模式输入容器 -->
          <InputBox
            v-model:input="userInput"
            :origin="currentWord?.word.mainWord.word || ''"
            :state="wordState"
            @check-input="checkInput"
          />

          <SoundHintDisplay
            :word="prepareData"
            :display="showHint"
            @update:display="showHint = $event"
          />
        </div>
      </div>
    </div>
  </SoundLayout>
</template>

<style lang="scss">
.learning-card {
  display: flex;
  flex-direction: column;
  padding: 20px;
  min-height: 50vh;
  max-height: 70vh;
  width: 95%;
  height: auto;
  overflow: visible;
  margin: 0 auto;
  position: relative;
}
</style>
