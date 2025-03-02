<script setup lang="ts">
import type { ISoundWordItem, SoundPrepareWord } from "~/composables/words/mode/sound";
import { useSuccessAudio, useWordSound } from "~/composables/words";
import { ExampleStage, SoundWordType, WordState } from "~/composables/words/mode/sound";
import SoundLayout from "./SoundLayout.vue";

const props = defineProps<{
  prepare: SoundPrepareWord;
}>();

const emits = defineEmits<{
  (e: "quit"): void;
  (e: "done"): void;
}>();

const userInput = ref("");

const wordState = ref<WordState>(WordState.INIT);
const errorCount = ref(0); // 错误计数器
const showHint = ref(false); // 是否显示提示

const audioPosition = computed(() =>
  wordState.value === WordState.PLAYING ? "center" : "top"
);

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

// 添加新的响应式变量
const exampleQueue = ref<ISoundWordItem[]>([]); // 例句队列

// 修改 refreshData 函数
async function refreshData() {
  // 优先从例句队列中获取
  if (exampleQueue.value.length > 0) {
    currentWord.value = exampleQueue.value.shift() || null;
    console.warn(
      `%c切换到例句模式: ${currentWord.value?.type === SoundWordType.EXAMPLE}`,
      "color: #2196F3; font-weight: bold; font-size: 12px;"
    );
    console.warn(
      `%c当前例句内容: ${prepareData.getExampleDisplay()}`,
      "color: #2196F3; font-weight: bold; font-size: 12px;"
    );
  } else {
    currentWord.value = prepareData.currentWord;
    // 如果当前是听写模式且有例句，将例句加入队列
    if (currentWord.value?.type === SoundWordType.DICTATION) {
      const examples = currentWord.value.word.mainWord?.examples || [];
      if (examples.length > 0) {
        const exampleWord: ISoundWordItem = {
          type: SoundWordType.EXAMPLE,
          word: currentWord.value.word,
          exampleStage: ExampleStage.PLUS_ONE,
        };
        exampleQueue.value.push(exampleWord);
        console.warn(
          `%c添加例句到队列，当前队列长度: ${exampleQueue.value.length}`,
          "color: #2196F3; font-weight: bold; font-size: 12px;"
        );
      }
    }
  }

  Object.assign(prepareData, props.prepare);
  userInput.value = "";
  errorCount.value = 0;
  showHint.value = false;
  showInputContainer.value = false;

  wordState.value = WordState.TRANSITIONING;
  await sleep(300);

  wordState.value = WordState.PLAYING;
  await sleep(300);

  wordState.value = WordState.WAITING;
}

watch(currentWord, () => {
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
});

let lastAudio: HTMLAudioElement | null = null;
// 添加音频锁，防止同时播放多个音频
const isPlayingAudio = ref(false);

// 播放音频
async function playAudio() {
  // 如果已经在播放音频，则忽略此次请求
  if (isPlayingAudio.value) {
    console.warn(`%c已有音频正在播放，忽略此次播放请求`, 'color: #FF9800; font-weight: bold; font-size: 14px;');
    return;
  }

  // 设置正在播放标志
  isPlayingAudio.value = true;
  wordState.value = WordState.PLAYING;

  try {
    // 确保暂停任何正在播放的音频
    if (lastAudio) {
      console.warn(`%c停止之前的音频`, 'color: #607D8B; font-weight: bold; font-size: 12px;');
      lastAudio.pause();
      lastAudio.currentTime = 0;
    }

    const word = currentWord.value?.word.mainWord;
    if (!word) {
      isPlayingAudio.value = false;
      return;
    }

    // 清晰区分不同模式的音频播放
    if (currentWord.value?.type === SoundWordType.EXAMPLE) {
      // 例句模式，优先使用当前需要输入的部分
      const exampleDisplay = prepareData.getExampleDisplay();
      console.warn(`%c播放例句音频: "${exampleDisplay}"`, 'color: #2196F3; font-weight: bold; font-size: 12px;');

      // 确保在播放前获取到有效的例句文本
      if (exampleDisplay && exampleDisplay.trim()) {
        try {
          // 尝试播放例句片段
          lastAudio = await useWordSound(exampleDisplay);
          if (lastAudio) {
            await new Promise<void>((resolve) => {
              if (lastAudio) {
                lastAudio.onended = () => resolve();
                lastAudio.onerror = () => {
                  console.error(`%c例句片段音频播放失败，尝试播放完整例句`, 'color: #F44336; font-weight: bold; font-size: 12px;');
                  resolve();
                };
                lastAudio.play().catch((err) => {
                  console.error(`%c例句音频播放错误:`, 'color: #F44336; font-weight: bold; font-size: 12px;', err);
                  resolve();
                });
              } else {
                resolve();
              }
            });
            return;
          }
        } catch (err) {
          console.error(`%c获取例句片段音频失败:`, 'color: #F44336; font-weight: bold; font-size: 12px;', err);
        }
      }

      // 如果没有获取到当前需要输入的部分，尝试使用完整例句
      const examples = word.examples || [];
      if (examples.length > 0) {
        const example = examples[0].sentence || "";
        if (example && example.trim()) {
          console.warn(`%c播放完整例句: "${example}"`, 'color: #9C27B0; font-weight: bold; font-size: 12px;');
          try {
            lastAudio = await useWordSound(example);
            if (lastAudio) {
              await new Promise<void>((resolve) => {
                if (lastAudio) {
                  lastAudio.onended = () => resolve();
                  lastAudio.onerror = () => {
                    console.error(`%c完整例句音频播放失败，降级到单词音频`, 'color: #F44336; font-weight: bold; font-size: 12px;');
                    resolve();
                  };
                  lastAudio.play().catch((err) => {
                    console.error(`%c完整例句音频播放错误:`, 'color: #F44336; font-weight: bold; font-size: 12px;', err);
                    resolve();
                  });
                } else {
                  resolve();
                }
              });
              return;
            }
          } catch (err) {
            console.error(`%c获取完整例句音频失败:`, 'color: #F44336; font-weight: bold; font-size: 12px;', err);
          }
        }
      }
      // 都没有则降级到单词音频
      console.warn(`%c降级为单词音频: "${word.word}"`, 'color: #F44336; font-weight: bold; font-size: 12px;');
      lastAudio = await useWordSound(word.word);
    } else {
      // 听写模式，使用单词音频
      console.warn(`%c播放单词音频: "${word.word}"`, 'color: #4CAF50; font-weight: bold; font-size: 12px;');
      lastAudio = await useWordSound(word.word);
    }

    if (lastAudio) {
      // 使用Promise等待音频播放完成
      await new Promise<void>((resolve) => {
        if (lastAudio) {
          lastAudio.onended = () => resolve();
          lastAudio.onerror = () => resolve();
          lastAudio.play().catch(() => resolve());
        } else {
          resolve();
        }
      });
    }
  } catch (error) {
    console.error('音频播放失败:', error);
  } finally {
    // 重置播放状态
    isPlayingAudio.value = false;
    wordState.value = WordState.WAITING;
    // 短暂延迟后触发重新播放，如果当前是例句模式
    if (currentWord.value?.type === SoundWordType.EXAMPLE && !lastAudio) {
      setTimeout(() => {
        console.warn(`%c例句音频播放失败，尝试重新播放单词音频`, 'color: #FF9800; font-weight: bold; font-size: 12px;');
        playAudio();
      }, 500);
    }
  }
}

// 修改nextData函数，确保阶段推进
async function nextData(success: boolean) {
  if (wordState.value === WordState.TRANSITIONING) {
    return;
  }

  console.warn(`%c执行 nextData: success=${success}, 当前单词类型=${currentWord.value?.type}, 阶段=${currentWord.value?.exampleStage}`, "color: #FF9800; font-weight: bold; font-size: 14px;");

  wordState.value = WordState.FADE_OUT;
  await sleep(700);

  // 如果还有例句在队列中，直接刷新数据
  if (exampleQueue.value.length > 0) {
    console.warn(`%c使用队列中的例句: 数量=${exampleQueue.value.length}, 类型=${exampleQueue.value[0]?.type}, 阶段=${exampleQueue.value[0]?.exampleStage}`, "color: #9C27B0; font-weight: bold; font-size: 14px;");
    refreshData();
    wordState.value = WordState.FADE_IN;
    setTimeout(() => {
      wordState.value = WordState.WAITING;
    }, 600);
    return;
  }

  // 检查当前单词类型和阶段
  const currentType = currentWord.value?.type;
  const currentStage = currentWord.value?.exampleStage;

  // 如果是例句模式并且答案正确，调用next推进阶段
  if (currentType === SoundWordType.EXAMPLE && success) {
    console.warn(`%c例句回答正确，尝试推进阶段: ${currentStage}`, "color: #4CAF50; font-weight: bold; font-size: 14px;");

    // 明确调用next进入下一个阶段
    const result = await prepareData.next(success);

    if (result) {
      console.warn(`%c阶段推进成功`, "color: #2196F3; font-weight: bold; font-size: 14px;");
      refreshData();
      wordState.value = WordState.FADE_IN;
      setTimeout(() => {
        wordState.value = WordState.WAITING;
      }, 600);
      return;
    } else {
      console.warn(`%c没有更多阶段或单词，完成学习`, "color: #E91E63; font-weight: bold; font-size: 14px;");
      await prepareData.finish();
      emits("done");
      return;
    }
  }

  // 听写模式或例句模式答错
  console.warn(`%c调用 prepareData.next: success=${success}`, "color: #2196F3; font-weight: bold; font-size: 14px;");
  const result = await prepareData.next(success);

  if (!result) {
    // 如果还有剩余的例句，继续处理
    if (exampleQueue.value.length > 0) {
      refreshData();
      wordState.value = WordState.FADE_IN;
      setTimeout(() => {
        wordState.value = WordState.WAITING;
      }, 600);
      return;
    }

    await prepareData.finish();
    emits("done");
    return;
  }

  refreshData();
  wordState.value = WordState.FADE_IN;
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

  // 获取当前类型（添加下划线表示未使用）
  const _currentType = currentWord.value.type;
  // 减少日志输出

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

    // 减少日志输出
  } else {
    // 听写模式保持原有逻辑
    isCorrect = prepareData.checkUserInput(userInput.value);
    // 减少日志输出
  }

  if (isCorrect) {
    // 标记为正确状态
    wordState.value = WordState.CORRECT;
    errorCount.value = 0;
    showHint.value = false;

    // 播放成功音效
    useSuccessAudio().play();

    // 减少日志输出

    // 等待一会儿让用户看到正确反馈
    setTimeout(() => {
      // 重要：在调用nextData前记录类型，以便后续检查
      const prevType = currentWord.value?.type;
      const prevStage = currentWord.value?.exampleStage;
      // 保留关键调试信息
      console.warn(`%c准备切换到下一阶段，当前模式: ${prevType}, 当前阶段: ${prevStage}`, "color: #FF9800; font-weight: bold; font-size: 14px;");

      // 如果是听写模式且回答正确，则强制设置类型为例句模式
      if (prevType === SoundWordType.DICTATION) {
        console.warn(`%c单词回答正确，准备切换到例句模式`, "color: #673AB7; font-weight: bold; font-size: 14px;");
      }

      nextData(true);

      // 在下一个tick验证类型是否改变
      setTimeout(() => {
        // 获取当前模式和阶段
        const currentMode = prepareData.getCurrentWordMode();
        const currentStage = currentWord.value?.exampleStage;
        console.warn(`%c类型转换检查: 之前[${prevType}:${prevStage}] 之后[${currentMode}:${currentStage}]`, "color: #607D8B; font-weight: bold; font-size: 14px;");

        // 检查转换是否成功
        if (prevType === SoundWordType.DICTATION && currentMode === SoundWordType.DICTATION) {
          console.warn(`%c检测到类型未变化，尝试强制设置为例句模式`, "color: #F44336; font-weight: bold; font-size: 14px;");

          // 使用新增的调试方法强制设置类型
          prepareData.debugForceSetWordType(SoundWordType.EXAMPLE);

          // 强制刷新界面
          refreshData();
        } else if (prevType === SoundWordType.DICTATION && currentMode === SoundWordType.EXAMPLE && currentStage !== ExampleStage.PLUS_ONE) {
          // 检测到类型已变为例句但阶段不是第一阶段
          console.warn(`%c例句阶段不正确，应为第一阶段(${ExampleStage.PLUS_ONE})，当前为(${currentStage})`, "color: #F44336; font-weight: bold; font-size: 14px;");

          // 重新处理例句分段
          prepareData.processExampleSentence();

          // 刷新界面
          refreshData();
        }
      }, 500);
    }, 800); // 将延迟时间从默认改为800毫秒
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

// 确保taskAmount属性存在
const taskAmount = computed(() => {
  const baseAmount =
    prepareData.taskAmount || prepareData.getNewlyWords() + prepareData.getLeftWords();
  return baseAmount + exampleQueue.value.length;
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
    :word-type="currentWord?.type"
    :example-stage="currentWord?.exampleStage"
    @quit="emits('quit')"
    @play-audio="playAudio"
  >
    <div class="transition-cubic SoundWordCard-Main learning-card">
      <div
        class="word-audio"
        :class="[
          { playing: wordState === WordState.PLAYING },
          { 'position-center': audioPosition === 'center' },
          { 'position-top': audioPosition === 'top' },
        ]"
      >
        <!-- <i v-if="wordState === WordState.PLAYING" i-carbon-play-filled-alt block />
        <i v-else i-carbon-pause-filled block /> -->
        <div class="sound-wave" />
      </div>

      <div
        :class="{ 'content-hidden': wordState === WordState.PLAYING }"
        class="word-info h-full flex flex-col justify-between"
      >
        <InputBox
          v-model:input="userInput"
          :origin="currentWord?.type === SoundWordType.DICTATION
            ? prepareData.getOriginalCase()
            : prepareData.getExampleDisplay()"
          :state="wordState"
          :type="currentWord?.type"
          :example-stage="currentWord?.exampleStage"
          @check-input="checkInput"
        />

        <SoundHintDisplay
          :word="prepareData"
          :display="showHint"
          @update:display="showHint = $event"
        />
      </div>
    </div>
  </SoundLayout>
</template>

<style lang="scss">
.learning-card {
  display: flex;
  flex-direction: column;
  padding: 20px;
  min-height: 40vh; /* 减小最小高度 */
  max-height: 60vh; /* 减小最大高度 */
  width: 95%;
  height: auto;
  overflow: auto; /* 改回auto，让整个卡片可滚动 */
  margin: 0 auto;
  position: relative;
  
  /* 自定义滚动条样式 */
  &::-webkit-scrollbar {
    width: 4px;
  }
  
  &::-webkit-scrollbar-track {
    background: rgba(0, 0, 0, 0.05);
    border-radius: 4px;
  }
  
  &::-webkit-scrollbar-thumb {
    background: rgba(255, 203, 107, 0.5);
    border-radius: 4px;
  }
  
  &::-webkit-scrollbar-thumb:hover {
    background: rgba(255, 180, 78, 0.7);
  }
}

// 确保word-info占据足够的空间
.word-info {
  min-height: 35vh;
  padding-bottom: 10px;
  overflow-y: auto;
  overscroll-behavior: contain;
}

// 添加缩小下划线间距的样式
:deep(.letter-indicator) {
  letter-spacing: -1px !important;
  margin: 0 -1px !important;
  
  &.underscore {
    letter-spacing: -3px !important;
    margin: 0 -2px !important;
  }
}

:deep(.input-letter) {
  letter-spacing: -1px !important;
  padding: 0 1px !important;
  margin: 0 -1px !important;
}

// 优化例句模式标题样式
:deep(.example-stage-title) {
  background: linear-gradient(135deg, #ffcb6b 0%, #ffa726 100%);
  color: #fff;
  padding: 4px 12px;
  border-radius: 16px;
  font-size: 14px;
  font-weight: 500;
  display: inline-block;
  margin: 6px 0;
  box-shadow: 0 2px 8px rgba(255, 167, 38, 0.3);
  letter-spacing: 0.5px;
  transition: all 0.3s ease;
  
  &:hover {
    box-shadow: 0 4px 12px rgba(255, 167, 38, 0.5);
    transform: translateY(-1px);
  }
}

.word-audio {
  position: relative;
  font-size: 24px;
  cursor: pointer;
  width: 60px;
  height: 60px;
  border-radius: 50%;
  background: linear-gradient(135deg, rgba(255, 203, 107, 0.9) 0%, rgba(255, 180, 78, 0.9) 100%);
  color: var(--theme-secondary);
  display: flex;
  align-items: center;
  justify-content: center;
  border: 2px solid rgba(255, 255, 255, 0.2);
  box-shadow:
    0 4px 20px rgba(255, 203, 107, 0.4),
    0 0 15px rgba(255, 203, 107, 0.3);
  transition: all 0.25s cubic-bezier(0.25, 0.46, 0.45, 0.94);

  top: 50%;
  left: 50%;

  &.position-center {
    transform: translate(-50%, -50%);
    width: 100px;
    height: 100px;
    font-size: 38px;
    box-shadow: 0 0 40px rgba(255, 203, 107, 0.6);
    border: 3px solid rgba(255, 255, 255, 0.3);
    animation: audioGlow 2s infinite alternate;
  }

  &.position-top {
    top: 0;
    transform: translate(-50%, 0);
  }

  &.playing .sound-wave {
    opacity: 1;
    animation: soundWave 2s infinite;
  }
}

@keyframes soundWave {
  0% {
    transform: scale(1);
    opacity: 0.8;
  }

  100% {
    transform: scale(1.5);
    opacity: 0;
  }
}

@keyframes audioGlow {
  0% {
    box-shadow: 0 0 20px rgba(255, 203, 107, 0.5);
  }

  100% {
    box-shadow: 0 0 50px rgba(255, 203, 107, 0.8);
  }
}
</style>
