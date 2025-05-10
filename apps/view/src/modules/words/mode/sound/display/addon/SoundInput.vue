<script setup lang="ts">
import {
  type IDisplayChar,
  type IDisplayText,
  type SoundExampleStage,
  type SoundWordType,
  WordState,
} from "~/modules/words/mode/sound";

const props = defineProps<{
  input: string;
  origin: string;
  state: WordState;
  type?: SoundWordType;
  exampleStage?: SoundExampleStage;
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

// 添加震动反馈函数
function vibrateDevice(duration: number) {
  if ('vibrate' in navigator) {
    navigator.vibrate(duration);
  }
}

// 监听状态变化，延迟处理
watch(() => props.state, (newState, oldState) => {
  if (oldState === WordState.WAITING && newState === WordState.ERROR) {
    // 找出正确的部分
    const correctPart = findCorrectPart(input.value, props.origin);
    previousCorrectPart.value = correctPart;
    console.warn(`%c保存正确部分: "${correctPart}"`, 'color: #FF9800; font-size: 14px; font-weight: bold;');

    // 错误状态时添加较强震动反馈
    vibrateDevice(200);
  }

  // 如果是从错误状态变回等待状态，保留之前正确的部分
  if (oldState === WordState.ERROR && newState === WordState.WAITING) {
    isFirstTyping.value = false;

    setTimeout(() => {
      input.value = previousCorrectPart.value;
      console.warn(`%c自动填充正确部分: "${previousCorrectPart.value}"`, 'color: #4CAF50; font-size: 14px; font-weight: bold;');
    }, 100);
  }

  if (newState === WordState.CORRECT) {
    vibrateDevice(50);
  }

  // 如果是正确或错误状态，启用延迟过渡
  if (newState === WordState.CORRECT || newState === WordState.ERROR) {
    actualState.value = newState;
    stateTransitionDelay.value = true;

    // 延迟恢复透明度，让用户能看到正确/错误状态
    setTimeout(() => {
      stateTransitionDelay.value = false;
    }, 1000)
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
      .toLowerCase() // 转为小写
      .replace(/\s+/g, '') // 移除所有空白字符
      .replace(/[.,!?;:'"–—()[\]{}<>]/g, '') // 移除所有标点符号
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

  // 规范化处理：确保input不会超过origin长度
  if (input.value.length > props.origin.length) {
    // 如果发现输入长度超过原始文本长度，自动截断
    // 注意：这个操作不会触发视图更新，只是内部计算
    const validInput = input.value.substring(0, props.origin.length);
    console.warn(`输入超出长度，自动截断: "${input.value}" -> "${validInput}"`);

    // 使用nextTick确保视图和数据同步
    nextTick(() => {
      input.value = validInput;
    });
  }

  // 根据 input 和 origin 生成 displayText
  for (let i = 0; i < props.origin.length; i++) {
    const originChar = props.origin.charAt(i);
    const inputChar = i < input.value.length ? input.value.charAt(i) : '';

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
      // 其他状态：显示用户输入或标点/空格
      displayChar = inputChar || (isPunctuation || isSpace ? originChar : '');
    }

    // 确定字符是否正确匹配
    const isCorrectMatch = originChar.toLowerCase() === (inputChar || '').toLowerCase();
    const isInCorrectPart = i < previousCorrectPart.value.length;

    // 只在当前输入位置显示光标，确保只有一个光标
    // 修正：确保光标位置正确，不超过文本长度
    const showCursor = isWaiting && i === input.value.length && i < props.origin.length;

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
      showUnderline,
    };

    displayText.displayChars.push(displayCharObj);
  }

  return displayText;
});

// 添加一个函数来处理输入文本的自动处理和长度检查
async function processInputAndCheck(newValue: string): Promise<void> {
  // 如果不在等待状态，不处理输入
  if (props.state !== WordState.WAITING) {
    return;
  }

  // 检查当前输入长度
  let currentValue = newValue;
  const totalLen = props.origin.length;

  // 确保输入不超过原始长度
  if (currentValue.length > totalLen) {
    currentValue = currentValue.substring(0, totalLen);
    input.value = currentValue;
  }

  // 处理自动添加标点和空格
  if (currentValue.length < totalLen) {
    let nextPosition = currentValue.length;
    let autoAdded = '';

    // 查找接下来的标点和空格
    while (nextPosition < totalLen) {
      const nextChar = props.origin.charAt(nextPosition);
      if (nextChar === " " || /[.,!?;:'"–—()[\]{}，。！？；：「」『』]/.test(nextChar)) {
        autoAdded += nextChar;
        nextPosition++;
      } else {
        break; // 遇到非标点和空格时停止
      }
    }

    // 安全地添加自动内容
    if (autoAdded && (currentValue.length + autoAdded.length) <= totalLen) {
      currentValue += autoAdded;
      input.value = currentValue;
    }
  }

  // 再次检查并处理超长输入
  if (currentValue.length > totalLen) {
    currentValue = currentValue.substring(0, totalLen);
    input.value = currentValue;
  }

  // 自动提交条件检查
  if (currentValue.length >= totalLen) {
    // 输入已完成，直接提交
    await handleCheckInput();
  } else if (props.type === 'example' && currentValue.length >= props.origin.length * 0.9) {
    // 对于示例模式，提前提交条件检查
    const normalizedInput = currentValue.toLowerCase().replace(/\s+/g, '').replace(/[.,!?;:'"–—()[\]{}，。！？；：「」『』]/g, '');
    const normalizedOrigin = props.origin.toLowerCase().replace(/\s+/g, '').replace(/[.,!?;:'"–—()[\]{}，。！？；：「」『』]/g, '');

    // 只有当有效内容达到原始文本的90%以上时才自动提交
    const threshold = 0.9;
    if (normalizedInput.length >= normalizedOrigin.length * threshold) {
      console.log(`自动提交检查: 输入长度=${normalizedInput.length}, 原始长度=${normalizedOrigin.length}, 阈值=${threshold}`);
      await handleCheckInput();
    }
  }
}

async function handleKeyDown(e: KeyboardEvent) {
  // 如果不在等待状态，不处理输入
  if (props.state !== WordState.WAITING) {
    return;
  }

  // 扩展修饰键检查，如果有修饰键按下则返回
  if (e.ctrlKey || e.altKey || e.metaKey || e.shiftKey || index.value === -1) {
    return;
  }

  // 确保不影响其他输入区域
  if (document.activeElement?.tagName === 'INPUT' ||
    document.activeElement?.tagName === 'TEXTAREA') {
    return;
  }

  // 阻止默认行为，防止与其他输入冲突
  e.preventDefault();
  e.stopPropagation();

  // 扩展允许输入的字符范围
  const allowedKeys = /^[a-z0-9\u4E00-\u9FA5]$/i;
  const key = e.key;

  // 重新检查输入是否有效及输入空间
  if (input.value.length >= props.origin.length && key !== "Backspace" && key !== "Enter") {
    // 已经达到最大长度，不再接受输入
    return;
  }

  // 处理退格键
  if (key === "Backspace") {
    // 如果最后一个字符是标点或空格，就要删除两个
    const lastChar = input.value.charAt(input.value.length - 1);
    if (lastChar === " " || /[.,!?;:'"–—()[\]{}，。！？；：「」『』]/.test(lastChar)) {
      input.value = input.value.slice(0, -2);
    } else {
      input.value = input.value.slice(0, -1);
    }
    // 删除时添加微小振动反馈
    vibrateDevice(10);
  }
  // 处理回车键
  else if (key === "Enter") {
    await handleCheckInput();
  }
  // 处理有效字符键
  else if (allowedKeys.test(key)) {
    // 添加前确保输入长度合法
    if (input.value.length >= props.origin.length) {
      return;
    }

    // 添加字符
    input.value += key;

    // 每次键入时添加振动反馈
    vibrateDevice(15);

    await sleep(1);

    // 处理和检查输入
    await processInputAndCheck(input.value);
  }
}

// 监听输入框内容变化，进行处理
watch(input, async (newValue) => {
  // 调用统一的处理函数
  if (props.state === WordState.WAITING) {
    await processInputAndCheck(newValue);
  }
})
</script>

<template>
  <div
    class="relative my-3 min-h-[50px] flex flex-row flex-wrap items-center justify-center transition-opacity duration-300"
    :style="{ opacity: stateTransitionDelay || display ? '1' : '0' }">
    <div v-for="(item, ind) in displayText.displayChars" :key="ind"
      class="relative h-[1.4em] min-w-[0.65em] text-center text-3xl font-bold leading-[1.4em] transition-all duration-300"
      :class="[
        {
          'text-theme-primary': item.isInput || item.isEmpty,
          'animate-blink': item.isCursor,
          'text-theme-error animate-shake error-effect': item.isError,
          'text-theme-success': item.isCorrect,
          'animate-elastic-pop': item.isCorrect && props.state === WordState.CORRECT,
          'opacity-0': state !== WordState.WAITING && !stateTransitionDelay,
          'text-2xl': props.type === 'example',
          'emoji-pop': item.isInput && props.state === WordState.WAITING,
        },
      ]">
      <!-- 主要字符显示区域 -->
      <div class="character-wrapper relative flex items-center justify-center">
        <!-- 显示字符 - 使用固定宽度容器，防止窄字符问题 -->
        <span class="character-display" :class="{
          'invisible': !item.char,
          'key-feedback': item.isInput && item.char === input.charAt(input.length - 1),
          'monospace': item.char && item.char.toLowerCase() === 'l', // 为l字符应用等宽字体
        }">{{ item.char }}</span>

        <!-- 下划线元素 - 用div模拟而不是用字符 -->
        <div v-if="item.showUnderline" class="character-underline" :class="{
          'underline-primary': (item.isEmpty || item.isInput) && !item.isCorrect && !item.isError,
          'underline-error': item.isError,
          'underline-success': item.isCorrect,
        }" />

        <!-- 在上方显示原始字符 - 只在正确状态或部分正确时显示 -->
        <div v-if="item.showOriginal && !item.char"
          class="text-theme-success character-float-in absolute left-0 top-[-18px] w-full text-base">
          {{ item.originalChar }}
        </div>

        <!-- 将光标放在下划线上方 -->
        <div v-if="item.isCursor" class="cursor-container">
          <div class="cursor-indicator" />
        </div>
      </div>
    </div>

    <!-- 状态指示器 - 使用更简洁的设计 -->
    <div v-if="props.state === WordState.CORRECT"
      class="text-theme-success animate-fadeIn mt-3 w-full text-center text-lg">
      <span class="status-badge correct font-bold">✓ 正确!</span>
    </div>
    <div v-if="props.state === WordState.ERROR" class="text-theme-error animate-fadeIn mt-3 w-full text-center text-lg">
      <span class="status-badge error font-bold">× 不正确，请重试</span>
    </div>
  </div>
</template>

<style lang="scss" scoped>
/* 字符包装器样式 */
.character-wrapper {
  position: relative;
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
}

/* 字符显示样式 */
.character-display {
  display: inline-block;
  width: 1em;
  /* 固定宽度，防止字母l等窄字符的布局问题 */
  text-align: center;
  z-index: 2;
  font-variant-numeric: normal;
  /* 确保数字显示正常 */
  font-feature-settings: normal;
  /* 禁用可能导致字形变化的特性 */
  letter-spacing: normal;
  /* 修正可能的字符间距问题 */
  text-transform: none;
  /* 防止自动大写变换 */
  font-variant-ligatures: none;
  /* 禁用连字 */
}

/* 防止特殊字符特别是字母l被错误放大 */
.text-3xl .character-display {
  transform: none !important;
  /* 防止意外变换 */
}

/* 为l字符设置等宽字体，确保宽度一致 */
.monospace {
  font-family: 'Courier New', monospace !important;
  font-size: 0.95em;
  /* 稍微调整大小 */
  display: inline-block;
  text-align: center;
  width: 1em !important;
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
  animation: wave-motion 2s infinite cubic-bezier(0.34, 1.56, 0.64, 1);
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
  animation: correct-q-bounce 0.8s cubic-bezier(0.34, 1.56, 0.64, 1);
  height: 4px !important;
  box-shadow: 0 0 8px rgba(72, 187, 120, 0.6);
}

/* 光标容器 */
.cursor-container {
  position: absolute;
  bottom: 0;
  left: 50%;
  transform: translateX(-50%);
  z-index: 10;
  pointer-events: none;
}

/* 光标指示器 - 放在下划线上方 */
.cursor-indicator {
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background-color: var(--theme-primary, #3b82f6);
  opacity: 0.8;
  box-shadow: 0 0 12px rgba(59, 130, 246, 0.9);
  animation: cursor-bounce 1.2s infinite cubic-bezier(0.34, 1.56, 0.64, 1);
  transform: translateY(-8px);
  /* 将光标向上移动 */
}

@keyframes cursor-bounce {

  0%,
  100% {
    transform: translateY(-8px) scale(1);
    opacity: 0.8;
  }

  50% {
    transform: translateY(-11px) scale(1.3);
    opacity: 1;
  }
}

/* 其他动画效果 */
@keyframes blink {

  0%,
  100% {
    opacity: 1;
  }

  50% {
    opacity: 0.3;
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

/* 更Q弹的动画效果 */
@keyframes elastic-pop {
  0% {
    transform: scale(1);
  }

  30% {
    transform: scale(1.35);
  }

  50% {
    transform: scale(0.9);
  }

  70% {
    transform: scale(1.15);
  }

  85% {
    transform: scale(0.95);
  }

  100% {
    transform: scale(1);
  }
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(5px);
  }

  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* 增强波浪动画效果 */
@keyframes wave-motion {

  0%,
  100% {
    transform: scaleY(1) scaleX(0.98);
  }

  25% {
    transform: scaleY(1.3) scaleX(1.03);
  }

  50% {
    transform: scaleY(0.8) scaleX(0.96);
  }

  75% {
    transform: scaleY(1.2) scaleX(1.01);
  }
}

@keyframes wave-error {

  0%,
  100% {
    transform: scaleY(1);
    background-color: var(--theme-error, #dc3545);
  }

  25% {
    transform: scaleY(1.4);
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

  70% {
    transform: scaleX(0.95) scaleY(0.9);
  }

  100% {
    transform: scaleX(1) scaleY(1);
    opacity: 1;
  }
}

/* 键入时的弹跳效果 */
.emoji-pop {
  animation: emoji-pop 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
}

@keyframes emoji-pop {
  0% {
    transform: scale(1);
  }

  40% {
    transform: scale(1.35);
  }

  70% {
    transform: scale(0.95);
  }

  100% {
    transform: scale(1);
  }
}

/* 字符浮动动画 */
.character-float-in {
  animation: float-in 0.5s cubic-bezier(0.34, 1.56, 0.64, 1);
  text-shadow: 0 0 8px rgba(72, 187, 120, 0.5);
  font-weight: bold;
  font-size: 0.75em;
  letter-spacing: 0.02em;
}

@keyframes float-in {
  0% {
    opacity: 0;
    transform: translateY(5px);
  }

  70% {
    transform: translateY(-2px);
  }

  100% {
    opacity: 1;
    transform: translateY(0);
  }
}

/* 美化状态标志 */
.status-badge {
  display: inline-block;
  padding: 5px 14px;
  border-radius: 18px;
  font-size: 15px;
  animation: badge-pop 0.5s cubic-bezier(0.34, 1.56, 0.64, 1);
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

  70% {
    transform: scale(1.1);
  }

  100% {
    opacity: 1;
    transform: scale(1);
  }
}

/* 增强正确状态的动效 */
.animate-elastic-pop {
  animation: elastic-pop 1.2s cubic-bezier(0.34, 1.56, 0.64, 1);
  /* 更Q弹的动画曲线 */
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
  0% {
    transform: scale(0.9);
  }

  50% {
    transform: scale(1.15);
  }

  70% {
    transform: scale(0.95);
  }

  100% {
    transform: scale(1);
  }
}

.animate-blink {
  animation: blink 1s ease-in-out infinite;
}

.animate-fadeIn {
  animation: fadeIn 0.5s ease;
}

/* 输入字符的增强反馈 */
.key-feedback {
  animation: key-feedback 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
  text-shadow: 0 0 10px var(--theme-primary, rgba(59, 130, 246, 0.8));
}

@keyframes key-feedback {
  0% {
    transform: scale(1);
    text-shadow: 0 0 0px var(--theme-primary, rgba(59, 130, 246, 0));
  }

  30% {
    transform: scale(1.3);
    text-shadow: 0 0 15px var(--theme-primary, rgba(59, 130, 246, 1));
  }

  70% {
    transform: scale(0.95);
    text-shadow: 0 0 8px var(--theme-primary, rgba(59, 130, 246, 0.6));
  }

  100% {
    transform: scale(1);
    text-shadow: 0 0 5px var(--theme-primary, rgba(59, 130, 246, 0.3));
  }
}
</style>
