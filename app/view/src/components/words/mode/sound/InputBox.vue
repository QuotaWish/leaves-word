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

// 监听状态变化，延迟处理
watch(() => props.state, (newState, oldState) => {
  console.warn(`%c状态变化: ${oldState} -> ${newState}`, 'color: #4CAF50; font-size: 14px; font-weight: bold;');

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
}, { immediate: true });

async function handleCheckInput() {
  if (props.state !== WordState.WAITING) {
    return
  }

  await sleep(300)

  // 减少日志输出
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
  // 减少日志输出
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

    // 状态正确时使用原始大小写，否则使用用户输入的大小写
    // 错误状态下不显示正确答案，仍然显示用户输入
    let displayChar = '_';

    if (isWaiting) {
      displayChar = inputChar || (isPunctuation || isSpace ? originChar : '_');
    } else if (props.state === WordState.CORRECT) {
      // 正确状态下显示原始字符
      displayChar = originChar;
    } else if (props.state === WordState.ERROR) {
      // 错误状态下只显示用户已输入的内容，不显示正确答案
      displayChar = inputChar || '_';
    } else {
      // 其他状态下显示原始字符
      displayChar = originChar;
    }

    const displayCharObj: IDisplayChar = {
      char: displayChar,
      isInput: !!inputChar,
      isCursor: isWaiting && input.value.length === i,
      isCorrect: !isWaiting && props.state === WordState.CORRECT && originChar.toLowerCase() === inputChar.toLowerCase(),
      isError: !isWaiting && props.state === WordState.ERROR && !!inputChar,
      isEmpty: !inputChar,
      isPunctuation,
      isSpace,
    };

    displayText.displayChars.push(displayCharObj);
  }

  return displayText;
});

async function handleKeyDown(e: KeyboardEvent) {
  if (e.ctrlKey || index.value === -1) {
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
    // 减少日志输出
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
        // 减少日志输出
      }
    }

    // 自动提交完整输入
    if (len >= totalLen || (props.type === 'example' && input.value.length >= props.origin.length * 0.9)) {
      // 减少日志输出
      handleCheckInput();
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
      class="text-3xl font-bold text-center relative transition-all duration-300 min-w-[1em] h-[1.5em] leading-[1.5em]"
      :class="[
        {
          'text-theme-primary': item.isInput || item.isEmpty,
          'animate-blink': item.isCursor,
          'text-theme-error animate-shake error-effect': item.isError,
          'text-theme-success animate-bounce-pop': item.isCorrect,
          'opacity-0': state !== WordState.WAITING && !stateTransitionDelay,
          'text-2xl': props.type === 'example',
        },
      ]"
    >
      <div class="flex items-center justify-center">
        {{ item.char }}
      </div>
      <div class="relative">
        <div class="absolute -translate-x-1/2 top-0 left-1/2 w-0.5 h-4/5 transition-opacity duration-300 opacity-0 bg-theme-color"
             :class="{ 'opacity-100': item.isCursor }" />
      </div>
      <div class="absolute -bottom-1 left-0 w-full h-[2px] transition-all duration-300"
           :class="{
             'bg-theme-primary opacity-100': item.isEmpty || item.isInput,
             'bg-theme-error h-[3px]': item.isError,
             'bg-theme-success h-[3px]': item.isCorrect,
             'opacity-0': state !== WordState.WAITING && !stateTransitionDelay,
           }" />
    </div>

    <!-- 添加状态指示器 -->
    <div v-if="props.state === WordState.CORRECT" class="w-full text-center mt-2 text-lg text-theme-success animate-fadeIn">
      <span class="font-bold">✓ 正确!</span>
    </div>
    <div v-if="props.state === WordState.ERROR" class="w-full text-center mt-2 text-lg text-theme-error animate-fadeIn">
      <span class="font-bold">× 不正确，请重试</span>
    </div>

    <!-- 添加调试信息 -->
    <div v-if="props.type === 'example'" class="w-full text-center mt-4 text-sm text-theme-secondary animate-fadeIn">
      <template v-if="props.exampleStage === 0">
        正在学习：单词前置+目标单词 (阶段1/3)
      </template>
      <template v-else-if="props.exampleStage === 1">
        正在学习：部分例句+目标单词 (阶段2/3)
      </template>
      <template v-else-if="props.exampleStage === 2">
        正在学习：完整例句 (阶段3/3)
      </template>
      <div v-if="state === WordState.CORRECT" class="text-theme-success font-bold mt-1 animate-fadeIn">
        太棒了！正确掌握了这个阶段
      </div>
      <div v-if="state === WordState.ERROR" class="text-theme-error font-bold mt-1 animate-fadeIn">
        再试一次，你能做到的！
      </div>
    </div>

    <!-- 调试信息 -->
    <div class="w-full text-xs text-gray-500 mt-2 text-center">
      类型: {{ props.type || '未设置' }} |
      阶段: {{ props.exampleStage === undefined ? '未设置' : props.exampleStage }} |
      状态: {{ props.state }}
    </div>
  </div>
</template>

<style lang="scss" scoped>
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
  0%,
  10%,
  90%,
  100% {
    transform: translateY(0) scale(1);
  }
  30% {
    transform: translateY(-15px) scale(1.2); /* 增大弹跳高度和缩放 */
  }
  60% {
    transform: translateY(-8px) scale(1.1);
  }
  75% {
    transform: translateY(-3px) scale(1.05);
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

/* 添加发光效果 */
.text-theme-success {
  text-shadow: 0 0 12px rgba(72, 187, 120, 0.7); /* 增强发光效果 */
  transition: all 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275); /* 延长过渡时间 */
}

/* 错误状态的发光效果 */
.text-theme-error {
  text-shadow: 0 0 12px rgba(220, 53, 69, 0.7); /* 红色发光效果 */
  transition: all 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275);
}

/* 给正确时的下划线添加动画效果 */
.bg-theme-success {
  animation: glow 1.5s ease-in-out infinite alternate;
}

/* 给错误时的下划线添加动画效果 */
.bg-theme-error {
  animation: glow-error 1.5s ease-in-out infinite alternate;
}

@keyframes glow {
  from {
    box-shadow: 0 0 5px rgba(72, 187, 120, 0.5);
  }
  to {
    box-shadow:
      0 0 10px rgba(72, 187, 120, 0.8),
      0 0 15px rgba(72, 187, 120, 0.3);
  }
}

@keyframes glow-error {
  from {
    box-shadow: 0 0 5px rgba(220, 53, 69, 0.5);
  }
  to {
    box-shadow:
      0 0 10px rgba(220, 53, 69, 0.8),
      0 0 15px rgba(220, 53, 69, 0.3);
  }
}

/* 增强正确状态的动效 */
.animate-bounce-pop {
  animation: bounce-pop 1.2s ease-in-out; /* 增加动画时长 */
  transform-origin: center;
  animation-fill-mode: both;
}

/* 错误效果 */
.error-effect {
  animation: shake 0.8s ease-in-out;
  transform-origin: center;
  animation-fill-mode: both;
  text-shadow: 0 0 12px rgba(220, 53, 69, 0.7);
}

.text-theme-success {
  transition: all 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275); /* 延长过渡时间 */
  text-shadow: 0 0 12px rgba(72, 187, 120, 0.7); /* 增强发光效果 */
}

/* 添加成功的粒子效果 */
@keyframes particles-left {
  0% {
    transform: translateY(0) translateX(0);
    opacity: 1;
  }
  100% {
    transform: translateY(-30px) translateX(-12px); /* 增大粒子移动范围 */
    opacity: 0;
  }
}

@keyframes particles-center {
  0% {
    transform: translateY(0) translateX(0);
    opacity: 1;
  }
  100% {
    transform: translateY(-30px) translateX(0);
    opacity: 0;
  }
}

@keyframes particles-right {
  0% {
    transform: translateY(0) translateX(0);
    opacity: 1;
  }
  100% {
    transform: translateY(-30px) translateX(12px);
    opacity: 0;
  }
}

/* 错误粒子效果动画 */
@keyframes error-particles-left {
  0% {
    transform: translateY(0) translateX(0);
    opacity: 1;
  }
  100% {
    transform: translateY(-20px) translateX(-15px);
    opacity: 0;
  }
}

@keyframes error-particles-right {
  0% {
    transform: translateY(0) translateX(0);
    opacity: 1;
  }
  100% {
    transform: translateY(-20px) translateX(15px);
    opacity: 0;
  }
}

.text-theme-success::before,
.text-theme-success::after {
  content: '';
  position: absolute;
  bottom: -5px;
  width: 6px; /* 增大粒子尺寸 */
  height: 6px;
  border-radius: 50%;
  background-color: rgba(72, 187, 120, 0.9); /* 增强粒子亮度 */
  z-index: -1;
  pointer-events: none;
}

.text-theme-error::before,
.text-theme-error::after {
  content: '';
  position: absolute;
  bottom: -5px;
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background-color: rgba(220, 53, 69, 0.9); /* 红色粒子 */
  z-index: -1;
  pointer-events: none;
}

.text-theme-success::before {
  left: 40%;
  animation: particles-left 0.8s ease-out forwards;
}

.text-theme-success::after {
  left: 60%;
  animation: particles-right 0.8s ease-out forwards;
  animation-delay: 0.1s;
}

.text-theme-error::before {
  left: 40%;
  animation: error-particles-left 0.8s ease-out forwards;
}

.text-theme-error::after {
  left: 60%;
  animation: error-particles-right 0.8s ease-out forwards;
  animation-delay: 0.1s;
}

.text-theme-success:nth-child(odd)::before {
  animation-delay: 0.2s;
}

.text-theme-success:nth-child(even)::after {
  animation-delay: 0.3s;
}

.text-theme-error:nth-child(odd)::before {
  animation-delay: 0.2s;
}

.text-theme-error:nth-child(even)::after {
  animation-delay: 0.3s;
}
</style>
