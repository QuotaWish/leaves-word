<script setup lang="ts">
import {
  type ExampleStage,
  type IDisplayChar,
  type IDisplayText,
  type SoundWordType,
  WordState,
} from "~/composables/words/mode/sound";

const props = defineProps<{
  input: string;
  origin: string;
  state: WordState;
  type?: SoundWordType;
  exampleStage?: ExampleStage;
}>();

const emits = defineEmits<{
  (e: "update:input", value: string): void;
  (e: "checkInput"): void;
}>();

const index = ref(0);
const { input } = useVModels(props, emits);

// 添加状态延迟变量，用于控制显示状态的延迟
const display = ref(true);
const actualState = ref(WordState.WAITING);
const stateTransitionDelay = ref(false);

// 添加新的状态变量，用于跟踪验证前的输入和正确部分
const previousCorrectPart = ref('');
const isFirstTyping = ref(true);

// 监听状态变化，延迟处理
watch(() => props.state, (newState, oldState) => {
  console.warn(`%c状态变化: ${oldState} -> ${newState}`, 'color: #4CAF50; font-size: 14px; font-weight: bold;');

  // 当状态从等待变为错误时，保存当前正确部分
  if (oldState === WordState.WAITING && newState === WordState.ERROR) {
    // 找出正确的部分
    const correctPart = findCorrectPart(input.value, props.origin);
    previousCorrectPart.value = correctPart;
    console.warn(`%c保存正确部分: "${correctPart}"`, 'color: #FF9800; font-size: 14px; font-weight: bold;');
  }
  
  // 如果是从错误状态变回等待状态，保留之前正确的部分
  if (oldState === WordState.ERROR && newState === WordState.WAITING) {
    isFirstTyping.value = false;
    // 延迟100ms让DOM更新完成，然后填充之前的正确部分
    setTimeout(() => {
      input.value = previousCorrectPart.value;
      console.warn(`%c自动填充正确部分: "${previousCorrectPart.value}"`, 'color: #4CAF50; font-size: 14px; font-weight: bold;');
    }, 100);
  }

  // 如果是正确或错误状态，启用延迟过渡
  if (newState === WordState.CORRECT || newState === WordState.ERROR) {
    actualState.value = newState;
    stateTransitionDelay.value = true;

    // 延迟恢复透明度，让用户能看到正确/错误状态
    setTimeout(() => {
      stateTransitionDelay.value = false;
    }, 1500); // 1.5秒延迟
  } else {
    // 其他状态直接更新
    actualState.value = newState;
    stateTransitionDelay.value = false;
  }

  // 当从PLAYING状态变化时滚动到顶部
  if (oldState === WordState.PLAYING && newState !== WordState.PLAYING) {
    // 当音频播放完毕后，滚动到顶部
    setTimeout(() => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }, 300);
  }
  
  // 如果状态重置为WAITING，重新设置首次输入标志
  if (newState === WordState.WAITING && oldState !== WordState.ERROR) {
    input.value = '';
    isFirstTyping.value = true;
  }
}, { immediate: true });

// 辅助函数：查找两个字符串的最长公共部分（从开始位置）
function findCorrectPart(inputStr: string, originStr: string): string {
  // 规范化文本处理
  const normalizeText = (text: string): string => {
    return text
      .toLowerCase()  // 转为小写
      .replace(/\s+/g, '') // 移除所有空白字符
      .replace(/[.,!?;:'"–—()[\]{}<>""'']/g, '') // 移除所有标点符号
      .trim();
  };
  
  const normalizedInput = normalizeText(inputStr);
  const normalizedOrigin = normalizeText(originStr);
  
  let correctLength = 0;
  // 查找从开头开始匹配的最长部分
  for (let i = 0; i < Math.min(normalizedInput.length, normalizedOrigin.length); i++) {
    if (normalizedInput[i] === normalizedOrigin[i]) {
      correctLength++;
    } else {
      break;
    }
  }
  
  // 返回原始输入中对应长度的部分（保留原始大小写和标点）
  return inputStr.substring(0, correctLength);
}

async function handleCheckInput() {
  if (props.state !== WordState.WAITING) {
    return
  }

  await sleep(300)
  emits("checkInput");
}

// 监听props变化，记录当前状态和类型
watch(() => props.type, (_newType) => {
  // 减少日志输出
}, { immediate: true });

watch(() => props.exampleStage, (_newStage) => {
  // 减少日志输出
}, { immediate: true });

// 初始化加载时记录信息
onMounted(() => {
  document.addEventListener('keydown', handleKeyDown)
})

onUnmounted(() => {
  document.removeEventListener('keydown', handleKeyDown)
})

const displayText = computed(() => {
  const displayText: IDisplayText = {
    displayChars: [],
  };

  if (!props.origin) {
    return displayText;
  }

  // 根据 input 和 origin 生成 displayText
  for (let i = 0; i < props.origin.length; i++) {
    const originChar = props.origin.charAt(i);
    const inputChar = input.value.charAt(i);

    // 如果是 waiting 则用 input 的char
    const isWaiting = WordState.WAITING === props.state;
    const isPunctuation = /[.,!?;:'"–—()[\]{}，。！？；：「」『』]/.test(originChar);
    const isSpace = originChar === " ";

    // 修改显示逻辑，字符和下划线需要同时显示
    let displayChar = '';

    if (isWaiting) {
      // 等待状态：显示用户输入或标点/空格
      displayChar = inputChar || (isPunctuation || isSpace ? originChar : '');
    } else if (props.state === WordState.CORRECT) {
      // 正确状态：显示原始字符
      displayChar = originChar;
    } else if (props.state === WordState.ERROR) {
      // 错误状态：显示用户输入
      displayChar = inputChar || '';
    } else {
      // 其他状态：显示原始字符
      displayChar = originChar;
    }

    // 确定字符是否正确匹配
    const isCorrectMatch = originChar.toLowerCase() === (inputChar || '').toLowerCase();
    const isInCorrectPart = i < previousCorrectPart.value.length;

    // 只在当前输入位置显示光标，确保只有一个光标
    const showCursor = isWaiting && i === input.value.length;

    // 确定是否需要显示下划线（非标点和空格）
    const showUnderline = !isPunctuation && !isSpace;

    const displayCharObj: IDisplayChar = {
      char: displayChar,
      isInput: !!inputChar,
      isCursor: showCursor,
      isCorrect: !isWaiting && (props.state === WordState.CORRECT || (props.state === WordState.ERROR && isInCorrectPart && isCorrectMatch)),
      isError: !isWaiting && props.state === WordState.ERROR && !!inputChar && !isInCorrectPart,
      isEmpty: !inputChar,
      isPunctuation,
      isSpace,
      // 添加原始字符属性，用于显示在下划线上方
      originalChar: originChar,
      showOriginal: props.state === WordState.CORRECT || (props.state === WordState.ERROR && isInCorrectPart && isCorrectMatch),
      // 添加下划线显示标记
      showUnderline: showUnderline,
    };

    displayText.displayChars.push(displayCharObj);
  }

  return displayText;
});

async function handleKeyDown(e: KeyboardEvent) {
  // 扩展修饰键检查，如果有修饰键按下则返回
  if (e.ctrlKey || e.altKey || e.metaKey || e.shiftKey || index.value === -1) {
    return;
  }

  e.preventDefault();

  // 扩展允许输入的字符范围
  const allowedKeys = /^[a-z0-9\u4E00-\u9FA5]$/i;
  const key = e.key;

  if (key === "Backspace") {
    // 如果最后一个字符是标点或空格，就要删除两个
    const lastChar = input.value.charAt(input.value.length - 1);
    if (lastChar === " " || /[.,!?;:'"–—()[\]{}，。！？；：「」『』]/.test(lastChar)) {
      input.value = input.value.slice(0, -2);
    } else {
      input.value = input.value.slice(0, -1);
    }
  } else if (key === "Enter") {
    handleCheckInput();
  } else if (allowedKeys.test(key)) {
    input.value += key;

    await sleep(1);

    // 如果下一个位置存在空格/标点 自动添加
    const len = input.value.length;
    const totalLen = props.origin.length;

    // 增强自动添加标点和空格的逻辑
    if (len < totalLen && props.origin) {
      // 检查下一个和之后的几个字符
      let nextPosition = len;
      let autoAdded = '';

      // 连续添加标点和空格
      while (nextPosition < totalLen) {
        const nextChar = props.origin.charAt(nextPosition);
        if (nextChar === " " || /[.,!?;:'"–—()[\]{}，。！？；：「」『』]/.test(nextChar)) {
          autoAdded += nextChar;
          nextPosition++;
        } else {
          break; // 遇到非标点和空格时停止
        }
      }

      if (autoAdded) {
        input.value += autoAdded;
      }
    }

    // 自动提交完整输入
    if (len >= totalLen || (props.type === 'example' && input.value.length >= props.origin.length * 0.9)) {
      // 使用规范化后的文本比较长度，避免因空格和标点导致提前提交
      const normalizedInput = input.value.toLowerCase().replace(/\s+/g, '').replace(/[.,!?;:'"–—()[\]{}，。！？；：「」『』]/g, '');
      const normalizedOrigin = props.origin.toLowerCase().replace(/\s+/g, '').replace(/[.,!?;:'"–—()[\]{}，。！？；：「」『』]/g, '');
      
      // 只有当有效内容达到原始文本的90%以上时才自动提交
      const threshold = props.type === 'example' ? 0.9 : 1.0;
      if (normalizedInput.length >= normalizedOrigin.length * threshold) {
        console.log(`自动提交检查: 输入长度=${normalizedInput.length}, 原始长度=${normalizedOrigin.length}, 阈值=${threshold}`);
        handleCheckInput();
      }
    }
  }
}
</script>

<template>
  <div class="my-4 flex flex-row flex-wrap justify-center items-center relative transition-opacity duration-300 min-h-[60px]"
       :style="{ opacity: stateTransitionDelay || display ? '1' : '0' }">
    <div
      v-for="(item, ind) in displayText.displayChars"
      :key="ind"
      class="text-3xl font-bold text-center relative transition-all duration-300 min-w-[0.75em] h-[1.5em] leading-[1.5em]"
      :class="[
        {
          'text-theme-primary': item.isInput || item.isEmpty,
          'animate-blink': item.isCursor,
          'text-theme-error animate-shake error-effect': item.isError,
          'text-theme-success': item.isCorrect,
          'animate-bounce-pop': item.isCorrect && props.state === WordState.CORRECT,
          'opacity-0': state !== WordState.WAITING && !stateTransitionDelay,
          'text-2xl': props.type === 'example',
        },
      ]"
    >
      <!-- 主要字符显示区域 -->
      <div class="flex items-center justify-center relative character-wrapper">
        <!-- 显示字符 -->
        <span class="character-display" :class="{ 'invisible': !item.char }">{{ item.char }}</span>
        
        <!-- 下划线元素 - 用div模拟而不是用字符 -->
        <div v-if="item.showUnderline" class="character-underline"
             :class="{
               'underline-primary': (item.isEmpty || item.isInput) && !item.isCorrect && !item.isError,
               'underline-error': item.isError,
               'underline-success': item.isCorrect
             }"></div>
        
        <!-- 在上方显示原始字符 - 只在正确状态或部分正确时显示 -->
        <div v-if="item.showOriginal && !item.char" 
             class="absolute top-[-20px] left-0 w-full text-base text-theme-success character-float-in">
          {{ item.originalChar }}
        </div>
      </div>
      
      <!-- 改进的光标显示 - 使用更现代的设计 -->
      <div v-if="item.isCursor" class="modern-cursor">
        <div class="cursor-pulse"></div>
      </div>
      
      <!-- 移除波浪式波动效果，因为现在由下划线元素实现 -->
    </div>

    <!-- 状态指示器 - 使用更简洁的设计 -->
    <div v-if="props.state === WordState.CORRECT" class="w-full text-center mt-4 text-lg text-theme-success animate-fadeIn">
      <span class="font-bold status-badge correct">✓ 正确!</span>
    </div>
    <div v-if="props.state === WordState.ERROR" class="w-full text-center mt-4 text-lg text-theme-error animate-fadeIn">
      <span class="font-bold status-badge error">× 不正确，请重试</span>
    </div>
  </div>
</template>

<style lang="scss" scoped>
/* 字符包装器样式 */
.character-wrapper {
  position: relative;
  min-width: 0.75em;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding-bottom: 5px; /* 为下划线留出空间 */
}

/* 字符显示样式 */
.character-display {
  position: relative;
  z-index: 2;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  text-shadow: 0 0 3px rgba(0, 0, 0, 0.1);
}

/* 下划线样式 */
.character-underline {
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 3px;
  border-radius: 3px;
  z-index: 1;
  transition: all 0.3s cubic-bezier(0.18, 0.89, 0.32, 1.28);
}

.underline-primary {
  background-color: var(--theme-primary, #3b82f6);
  animation: wave-motion 2s infinite cubic-bezier(0.42, 0, 0.58, 1);
  height: 3px;
}

.underline-error {
  background-color: var(--theme-error, #dc3545);
  animation: wave-error 1.2s ease-in-out;
  box-shadow: 0 0 8px rgba(220, 53, 69, 0.5);
  height: 3px;
}

.underline-success {
  background-color: var(--theme-success, #48bb78);
  animation: correct-q-bounce 0.8s cubic-bezier(0.18, 0.89, 0.32, 1.28);
  height: 4px !important;
  box-shadow: 0 0 8px rgba(72, 187, 120, 0.6);
}

/* 其他样式保持不变 */
@keyframes blink {
  0%,
  100% {
    opacity: 1;
  }
  50% {
    opacity: 0;
  }
}

@keyframes shake {
  0%,
  100% {
    transform: translateX(0);
  }
  10%,
  30%,
  50%,
  70%,
  90% {
    transform: translateX(-5px);
  }
  20%,
  40%,
  60%,
  80% {
    transform: translateX(5px);
  }
}

@keyframes popIn {
  0% {
    transform: scale(0.8);
    opacity: 0;
  }
  100% {
    transform: scale(1);
    opacity: 1;
  }
}

@keyframes bounce-pop {
  0% {
    transform: translateY(0) scale(1);
  }
  20% {
    transform: translateY(-25px) scale(1.3);
  }
  40% {
    transform: translateY(-15px) scale(1.15);
  }
  60% {
    transform: translateY(-8px) scale(1.08);
  }
  80% {
    transform: translateY(-3px) scale(1.03);
  }
  100% {
    transform: translateY(0) scale(1);
  }
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* 添加波浪动画效果 */
@keyframes wave-motion {
  0%, 100% {
    transform: scaleY(1);
  }
  25% {
    transform: scaleY(1.2);
  }
  50% {
    transform: scaleY(0.8);
  }
  75% {
    transform: scaleY(1.1);
  }
}

@keyframes wave-error {
  0%, 100% {
    transform: scaleY(1);
    background-color: var(--theme-error, #dc3545);
  }
  25% {
    transform: scaleY(1.3);
    background-color: rgba(220, 53, 69, 0.8);
  }
  50% {
    transform: scaleY(0.9);
    background-color: var(--theme-error, #dc3545);
  }
  75% {
    transform: scaleY(1.2);
    background-color: rgba(220, 53, 69, 0.9);
  }
}

@keyframes correct-q-bounce {
  0% {
    transform: scaleX(0.5) scaleY(0.5);
    opacity: 0.5;
  }
  50% {
    transform: scaleX(1.1) scaleY(1.5);
  }
  100% {
    transform: scaleX(1) scaleY(1);
    opacity: 1;
  }
}

/* 改进的光标样式 */
.modern-cursor {
  position: absolute;
  right: -4px;
  top: 50%;
  transform: translateY(-50%);
  height: 70%;
  width: 3px;
  border-radius: 2px;
  z-index: 5;
}

.cursor-pulse {
  height: 100%;
  width: 100%;
  background-color: var(--theme-primary, #3b82f6);
  animation: cursor-pulse 1.5s infinite cubic-bezier(0.86, 0, 0.07, 1);
  border-radius: 2px;
  box-shadow: 0 0 8px 1px rgba(59, 130, 246, 0.5);
}

@keyframes cursor-pulse {
  0%, 100% {
    opacity: 1;
    transform: scaleY(1);
  }
  50% {
    opacity: 0.6;
    transform: scaleY(0.7);
  }
}

/* 字符浮动动画 */
.character-float-in {
  animation: float-in 0.5s cubic-bezier(0.18, 0.89, 0.32, 1.28);
  text-shadow: 0 0 8px rgba(72, 187, 120, 0.5);
  font-weight: bold;
  font-size: 0.75em;
  letter-spacing: 0.02em;
}

@keyframes float-in {
  0% {
    opacity: 0;
    transform: translateY(10px);
  }
  100% {
    opacity: 1;
    transform: translateY(0);
  }
}

/* 美化状态标志 */
.status-badge {
  display: inline-block;
  padding: 6px 16px;
  border-radius: 20px;
  font-size: 16px;
  animation: badge-pop 0.5s cubic-bezier(0.18, 0.89, 0.32, 1.28);
}

.status-badge.correct {
  background-color: rgba(72, 187, 120, 0.15);
  color: var(--theme-success);
  box-shadow: 0 0 10px rgba(72, 187, 120, 0.3);
}

.status-badge.error {
  background-color: rgba(220, 53, 69, 0.15);
  color: var(--theme-error);
  box-shadow: 0 0 10px rgba(220, 53, 69, 0.3);
}

@keyframes badge-pop {
  0% {
    opacity: 0;
    transform: scale(0.8);
  }
  100% {
    opacity: 1;
    transform: scale(1);
  }
}

/* 增强正确状态的动效 */
.animate-bounce-pop {
  animation: bounce-pop 1.5s cubic-bezier(0.25, 0.46, 0.45, 0.94); /* 更流畅的动画 */
  transform-origin: center;
  animation-fill-mode: both;
}

/* 错误效果 */
.error-effect {
  animation: shake 0.8s ease-in-out;
  transform-origin: center;
  animation-fill-mode: both;
}

/* 添加输入字符的微小动效 */
.text-theme-primary {
  animation: type-pop 0.2s cubic-bezier(0.34, 1.56, 0.64, 1);
  transform-origin: center;
}

@keyframes type-pop {
  0% { transform: scale(0.90); }
  40% { transform: scale(1.12); }
  70% { transform: scale(0.96); }
  100% { transform: scale(1); }
}

.animate-blink {
  animation: blink 1s ease-in-out infinite;
}

.animate-fadeIn {
  animation: fadeIn 0.5s ease;
}
</style>


