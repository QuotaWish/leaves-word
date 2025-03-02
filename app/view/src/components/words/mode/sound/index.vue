<script setup lang="ts">
import type { ISoundWordItem, SoundPrepareWord } from "~/composables/words/mode/sound";
import { useSuccessAudio, useErrorAudio, useWordSound } from "~/composables/words";
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

// 添加音频完成标志，控制圆球位置
const audioFinished = ref(true);

// 修改audioPosition计算属性，增加对audioFinished的判断
const audioPosition = computed(() =>
  wordState.value === WordState.PLAYING || !audioFinished.value ? "center" : "top"
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

// 保留这些变量声明
let lastAudio: HTMLAudioElement | null = null;
// 添加音频锁，防止同时播放多个音频
const isPlayingAudio = ref(false);
// 添加节流计时器引用
let audioThrottleTimer: number | null = null;
// 添加待执行的音频源
let pendingAudioSource: string | null = null;

// 封装后的音频播放核心函数
async function playAudioCore(audioSource: string) {
  // 停止之前的音频（彻底清理）
  if (lastAudio) {
    lastAudio.pause();
    lastAudio.currentTime = 0;
    lastAudio.onended = null;
    lastAudio.onerror = null;
    lastAudio.onabort = null;
    lastAudio.oncanplay = null;
    lastAudio.onplaying = null;
    lastAudio = null;
  }

  // 重置音频状态
  isPlayingAudio.value = true;
  wordState.value = WordState.PLAYING;
  audioFinished.value = false;
  showInputContainer.value = false;

  try {
    // 使用封装好的函数获取音频
    lastAudio = await useWordSound(audioSource);
    
    if (!lastAudio) return false;
    
    // 播放音频完成后的处理
    lastAudio.onended = () => {
      if (lastAudio) {  // 安全检查
        isPlayingAudio.value = false;
        wordState.value = WordState.WAITING;
        
        // 播放结束后设置状态
        setTimeout(() => {
          audioFinished.value = true;
          showInputContainer.value = true;
        }, 300);
      }
    };
    
    // 错误处理
    lastAudio.onerror = () => {
      isPlayingAudio.value = false;
      wordState.value = WordState.WAITING;
      audioFinished.value = true;
      showInputContainer.value = true;
    };
    
    // 确保音频加载完成再播放
    try {
      // 直接播放
      const playPromise = lastAudio.play();
      
      if (playPromise !== undefined) {
        await playPromise.catch(() => {
          // 播放失败时重置状态
          isPlayingAudio.value = false;
          wordState.value = WordState.WAITING;
          audioFinished.value = true;
          showInputContainer.value = true;
          return false;
        });
      }
    } catch (playError) {
      // 出错时重置状态
      isPlayingAudio.value = false;
      wordState.value = WordState.WAITING;
      audioFinished.value = true;
      showInputContainer.value = true;
      return false;
    }
    
    return true;
  } catch (error) {
    // 出错时重置状态
    isPlayingAudio.value = false;
    wordState.value = WordState.WAITING;
    audioFinished.value = true;
    showInputContainer.value = true;
    return false;
  }
}

// 带节流的音频播放函数
function playAudio() {
  // 获取音频源
  const word = currentWord.value?.word.mainWord;
  if (!word) return;

  // 根据不同模式决定播放内容
  let audioSource = '';
  
  if (currentWord.value?.type === SoundWordType.EXAMPLE) {
    // 例句模式
    const exampleDisplay = prepareData.getExampleDisplay();
    if (exampleDisplay && exampleDisplay.trim()) {
      audioSource = exampleDisplay;
    } else {
      const examples = word.examples || [];
      if (examples.length > 0 && examples[0].sentence) {
        audioSource = examples[0].sentence;
      } else {
        audioSource = word.word;
      }
    }
  } else {
    // 听写模式
    audioSource = word.word;
  }
  
  // 更新待执行的音频源
  pendingAudioSource = audioSource;
  
  // 如果已经有计时器在运行，则不再设置新计时器
  if (audioThrottleTimer !== null) {
    return;
  }
  
  // 设置节流计时器
  audioThrottleTimer = window.setTimeout(() => {
    // 计时器到期，执行最后一次待执行的音频播放
    if (pendingAudioSource) {
      playAudioCore(pendingAudioSource);
      pendingAudioSource = null;
    }
    // 清除计时器引用
    audioThrottleTimer = null;
  }, 300);
}

// 修改 refreshData 函数，确保每次都播放音频
async function refreshData() {
  // 优先从例句队列中获取
  if (exampleQueue.value.length > 0) {
    currentWord.value = exampleQueue.value.shift() || null;
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

  // 确保切换到WordState.WAITING状态的逻辑在playAudio内部处理
  if (currentWord.value) {
    const wordType = currentWord.value.type;
    if (wordType === SoundWordType.EXAMPLE) {
      const examples = currentWord.value.word.mainWord?.examples || [];
      if (examples.length === 0) {
        // 没有例句，跳到下一个
        nextData(true);
        return;
      }
    }
    
    // 始终播放音频
    playAudio();
  } else {
    wordState.value = WordState.WAITING;
  }
}

// 彻底重写nextData函数，确保阶段进度不会丢失
async function nextData(success: boolean) {
  if (wordState.value === WordState.TRANSITIONING) {
    return;
  }
  
  // 保存当前状态详情
  const prevWordType = currentWord.value?.type;
  const prevStage = currentWord.value?.exampleStage;
  let targetWordType = prevWordType; // 默认保持当前类型
  let targetStage = prevStage; // 默认保持当前阶段
  
  // 详细记录转换前后的状态
  console.warn(`%c状态转换开始 - 当前类型:${prevWordType}, 阶段:${prevStage}, 成功:${success}`, "color: #FF9800; font-weight: bold; font-size: 14px;");
  
  // 标记过渡状态
  wordState.value = WordState.FADE_OUT;
  audioFinished.value = true;
  await sleep(600);
  
  // 根据当前模式和答案正确性确定后续行为
  if (prevWordType === SoundWordType.DICTATION && success) {
    // 单词听写正确，需要切换到例句模式
    console.warn(`%c单词回答正确，准备切换到例句模式`, "color: #9C27B0; font-weight: bold; font-size: 14px;");
    
    // 确保队列中有例句
    if (exampleQueue.value.length === 0 && currentWord.value) {
      const examples = currentWord.value.word.mainWord?.examples || [];
      if (examples.length > 0) {
        // 创建一个新的例句项目
        const exampleItem: ISoundWordItem = {
          type: SoundWordType.EXAMPLE,
          word: currentWord.value.word,
          exampleStage: ExampleStage.PLUS_ONE, // 明确设置为第一阶段
        };
        
        // 加入队列
        exampleQueue.value.push(exampleItem);
        console.warn(`%c强制添加例句到队列`, "color: #4CAF50; font-weight: bold; font-size: 14px;");
        
        // 明确设置目标类型为例句模式
        targetWordType = SoundWordType.EXAMPLE;
        targetStage = ExampleStage.PLUS_ONE;
        
        // 同时强制设置prepareData的模式（双保险）
        prepareData.debugForceSetWordType(SoundWordType.EXAMPLE);
        
        // 确保例句已被处理
        prepareData.processExampleSentence();
      } else {
        console.warn(`%c该单词没有例句，继续下一个单词`, "color: #FF9800; font-weight: bold; font-size: 14px;");
      }
    } else if (exampleQueue.value.length > 0) {
      // 队列中已有例句，保持不变
      console.warn(`%c例句队列已有内容: ${exampleQueue.value.length}个`, "color: #4CAF50; font-weight: bold; font-size: 14px;");
      targetWordType = SoundWordType.EXAMPLE;
      targetStage = ExampleStage.PLUS_ONE;
    }
  } else if (prevWordType === SoundWordType.EXAMPLE && success) {
    // 例句回答正确，可能需要进阶到下一阶段
    console.warn(`%c例句回答正确，尝试进阶到下一个阶段`, "color: #4CAF50; font-weight: bold; font-size: 14px;");
    
    // 保持例句模式不变，但阶段可能需要推进
    targetWordType = SoundWordType.EXAMPLE;
    
    // 例句有可能结束，需要从prepareData.next的结果判断
  } else if (!success) {
    // 答案错误，一般保持当前状态，重试
    console.warn(`%c回答错误，状态不变`, "color: #F44336; font-weight: bold; font-size: 14px;");
  }
  
  // 详细记录预期状态
  console.warn(`%c预期状态 - 类型:${targetWordType}, 阶段:${targetStage}`, "color: #03A9F4; font-weight: bold; font-size: 14px;");
  
  // 处理特殊情况：如果预期是例句模式且当前例句队列有内容
  if (targetWordType === SoundWordType.EXAMPLE && exampleQueue.value.length > 0) {
    console.warn(`%c从例句队列获取例句`, "color: #9C27B0; font-weight: bold; font-size: 14px;");
    refreshData(); // 这将从队列取出例句
    wordState.value = WordState.FADE_IN;
    
    // 设置短延迟，确保过渡效果和状态更新
    setTimeout(() => {
      wordState.value = WordState.WAITING;
      
      // 检查实际状态是否符合预期
      setTimeout(() => {
        const actualType = currentWord.value?.type;
        const actualStage = currentWord.value?.exampleStage;
        
        console.warn(`%c实际状态 - 类型:${actualType}, 阶段:${actualStage}`, "color: #607D8B; font-weight: bold; font-size: 14px;");
        
        // 如果不符合预期，尝试修复
        if (actualType !== targetWordType || (targetStage !== undefined && actualStage !== targetStage)) {
          console.error(`%c状态不符合预期，尝试修复`, "color: #F44336; font-weight: bold; font-size: 14px;");
          
          // 确认是例句模式
          if (targetWordType === SoundWordType.EXAMPLE) {
            prepareData.debugForceSetWordType(SoundWordType.EXAMPLE);
            prepareData.processExampleSentence();
            refreshData();
          }
        }
      }, 100);
    }, 600);
    
    return;
  }
  
  // 调用next进行常规处理
  console.warn(`%c调用 prepareData.next: ${success}`, "color: #2196F3; font-weight: bold; font-size: 14px;");
  const result = await prepareData.next(success);
  
  if (!result) {
    // 没有更多内容了
    console.warn(`%c没有更多内容，结束学习`, "color: #E91E63; font-weight: bold; font-size: 14px;");
    
    // 检查例句队列是否有剩余内容
    if (exampleQueue.value.length > 0) {
      console.warn(`%c但例句队列中还有内容，继续处理`, "color: #4CAF50; font-weight: bold; font-size: 14px;");
      refreshData();
      wordState.value = WordState.FADE_IN;
      setTimeout(() => { wordState.value = WordState.WAITING; }, 600);
      return;
    }
    
    // 真正结束
    await prepareData.finish();
    emits("done");
    return;
  }
  
  // 常规刷新
  refreshData();
  wordState.value = WordState.FADE_IN;
  
  // 设置短延迟，确保过渡效果
  setTimeout(() => {
    wordState.value = WordState.WAITING;
    
    // 检查刷新后的状态是否符合预期
    setTimeout(() => {
      const actualType = currentWord.value?.type;
      const actualStage = currentWord.value?.exampleStage;
      
      console.warn(`%c刷新后状态 - 类型:${actualType}, 阶段:${actualStage}`, "color: #607D8B; font-weight: bold; font-size: 14px;");
      
      // 如果预期是例句模式但实际不是，尝试修复
      if (targetWordType === SoundWordType.EXAMPLE && actualType !== SoundWordType.EXAMPLE) {
        console.error(`%c类型不符合预期，尝试修复为例句模式`, "color: #F44336; font-weight: bold; font-size: 14px;");
        prepareData.debugForceSetWordType(SoundWordType.EXAMPLE);
        prepareData.processExampleSentence();
        refreshData();
      }
      // 如果是例句模式但阶段不对，也修复
      else if (targetWordType === SoundWordType.EXAMPLE && 
               actualType === SoundWordType.EXAMPLE && 
               targetStage !== undefined && 
               actualStage !== targetStage) {
        console.error(`%c例句阶段不符合预期，尝试修复`, "color: #F44336; font-weight: bold; font-size: 14px;");
        prepareData.processExampleSentence();
        refreshData();
      }
    }, 100);
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

    // 在进入下一阶段前，确保例句队列准备好
    if (currentWord.value.type === SoundWordType.DICTATION && currentWord.value) {
      console.warn(`%c单词回答正确，提前准备例句队列`, "color: #673AB7; font-weight: bold; font-size: 14px;");
      
      const examples = currentWord.value.word.mainWord?.examples || [];
      if (examples.length > 0 && exampleQueue.value.length === 0) {
        const exampleWord: ISoundWordItem = {
          type: SoundWordType.EXAMPLE,
          word: currentWord.value.word,
          exampleStage: ExampleStage.PLUS_ONE,
        };
        exampleQueue.value.push(exampleWord);
        console.warn(`%c提前添加例句到队列完成`, "color: #4CAF50; font-weight: bold; font-size: 14px;");
      }
    }

    // 等待一会儿让用户看到正确反馈
    setTimeout(() => {
      nextData(true);
    }, 800);
  } else {
    // 标记为错误状态
    wordState.value = WordState.ERROR;
    errorCount.value++;

    useErrorAudio().play();

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
          v-if="wordState !== WordState.PLAYING && audioFinished"
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
          v-if="wordState !== WordState.PLAYING"
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

// 添加确保内容在播放时完全隐藏的样式
.content-hidden {
  opacity: 0 !important;
  pointer-events: none !important;
  transition: opacity 0.3s ease;
}
</style>
