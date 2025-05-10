<script setup lang="ts">
import { WordState } from "~/modules/words/mode/sound";

defineProps<{
  wordState: WordState;
}>();

// 用于动态触发按键反馈
const keyPressCount = ref(0);
// 按键反馈函数
function triggerKeyPress() {
  keyPressCount.value++;
}

// 监听键盘事件
onMounted(() => {
  const handleKeyPress = (e: KeyboardEvent) => {
    // 只响应正常的按键，不包括功能键和修饰键
    if (!e.ctrlKey && !e.altKey && !e.metaKey && !e.shiftKey &&
      e.key.length === 1) {
      triggerKeyPress();
    }
  };

  window.addEventListener('keydown', handleKeyPress);

  // 在组件销毁时解除监听
  onUnmounted(() => {
    window.removeEventListener('keydown', handleKeyPress);
  });
});
</script>

<template>
  <div class="emoji-container">
    <!-- 播放状态：张嘴说话 -->
    <svg v-if="wordState === WordState.PLAYING" class="emoji emoji-speaking" viewBox="0 0 100 100"
      xmlns="http://www.w3.org/2000/svg">
      <circle cx="50" cy="50" r="40" fill="none" stroke="currentColor" stroke-width="2" class="emoji-circle">
        <animate attributeName="r" values="40;42;40" dur="2s" repeatCount="indefinite" />
      </circle>
      <circle cx="35" cy="40" r="5" fill="currentColor" class="emoji-feature" />
      <circle cx="65" cy="40" r="5" fill="currentColor" class="emoji-feature" />
      <ellipse cx="50" cy="65" rx="15" ry="10" fill="currentColor" class="emoji-feature">
        <animate attributeName="ry" values="10;5;10" dur="1s" repeatCount="indefinite" />
      </ellipse>
    </svg>

    <!-- 正确状态：微笑 -->
    <svg v-else-if="wordState === WordState.CORRECT" class="emoji emoji-smile" viewBox="0 0 100 100"
      xmlns="http://www.w3.org/2000/svg">
      <circle cx="50" cy="50" r="40" fill="none" stroke="currentColor" stroke-width="2" class="emoji-circle">
        <animate attributeName="r" values="40;43;40" dur="0.5s" begin="0s" />
      </circle>
      <!-- 眨眼动画 -->
      <g>
        <circle cx="35" cy="40" r="5" fill="currentColor" class="emoji-feature">
          <animate attributeName="ry" values="5;1;5" dur="0.15s" begin="0.5s" />
        </circle>
        <circle cx="65" cy="40" r="5" fill="currentColor" class="emoji-feature">
          <animate attributeName="ry" values="5;1;5" dur="0.15s" begin="0.5s" />
        </circle>
      </g>
      <path d="M 30 60 Q 50 80 70 60" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round"
        class="emoji-feature">
        <animate attributeName="d" values="M 30 60 Q 50 80 70 60;M 30 60 Q 50 85 70 60;M 30 60 Q 50 80 70 60" dur="1s"
          begin="0s" />
      </path>
    </svg>

    <!-- 错误状态：摇头 -->
    <svg v-else-if="wordState === WordState.ERROR" class="emoji emoji-sad" viewBox="0 0 100 100"
      xmlns="http://www.w3.org/2000/svg">
      <circle cx="50" cy="50" r="40" fill="none" stroke="currentColor" stroke-width="2" class="emoji-circle">
        <animateTransform attributeName="transform" type="rotate" from="0 50 50" to="5 50 50" dur="0.3s" begin="0s"
          fill="freeze" />
        <animateTransform attributeName="transform" type="rotate" from="5 50 50" to="-5 50 50" dur="0.3s" begin="0.3s"
          fill="freeze" />
        <animateTransform attributeName="transform" type="rotate" from="-5 50 50" to="0 50 50" dur="0.3s" begin="0.6s"
          fill="freeze" />
      </circle>
      <circle cx="35" cy="40" r="5" fill="currentColor" class="emoji-feature" />
      <circle cx="65" cy="40" r="5" fill="currentColor" class="emoji-feature" />
      <path d="M 30 70 Q 50 50 70 70" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round"
        class="emoji-feature">
        <animate attributeName="d" values="M 30 70 Q 50 50 70 70;M 30 72 Q 50 52 70 72;M 30 70 Q 50 50 70 70" dur="1s"
          repeatCount="indefinite" />
      </path>
    </svg>

    <!-- 默认状态：倾听 (添加待机动画) -->
    <svg v-else class="emoji emoji-listening" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
      <!-- 呼吸效果的圆圈 -->
      <circle cx="50" cy="50" r="40" fill="none" stroke="currentColor" stroke-width="2" class="emoji-circle"
        :class="{ 'key-pressed': keyPressCount > 0 }">
        <animate attributeName="r" values="40;41;40;39;40" dur="3s" repeatCount="indefinite" />
      </circle>

      <!-- 眨眼效果 -->
      <g>
        <circle cx="35" cy="40" r="5" fill="currentColor" class="emoji-feature">
          <animate attributeName="ry" values="5;1;5" dur="0.15s" begin="2s;6s;10s" repeatCount="indefinite" />
        </circle>
        <circle cx="65" cy="40" r="5" fill="currentColor" class="emoji-feature">
          <animate attributeName="ry" values="5;1;5" dur="0.15s" begin="2s;6s;10s" repeatCount="indefinite" />
        </circle>
      </g>

      <!-- 嘴巴，有微微的变化 -->
      <line x1="35" y1="65" x2="65" y2="65" stroke="currentColor" stroke-width="3" stroke-linecap="round"
        class="emoji-feature emoji-mouth" :class="{ 'key-pressed': keyPressCount > 0 }">
        <animate attributeName="y1" values="65;64;65;66;65" dur="4s" repeatCount="indefinite" />
        <animate attributeName="y2" values="65;66;65;64;65" dur="4s" repeatCount="indefinite" />
      </line>

      <!-- 耳朵，有轻微的移动 -->
      <path d="M 75 30 Q 85 40 75 50" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"
        class="emoji-feature">
        <animate attributeName="d" values="M 75 30 Q 85 40 75 50;M 75 32 Q 86 42 75 52;M 75 30 Q 85 40 75 50" dur="2s"
          repeatCount="indefinite" />
      </path>
    </svg>
  </div>
</template>

<style lang="scss" scoped>
.emoji-container {
  position: relative;
  width: 70%;
  height: 70%;
  z-index: 3;
  overflow: visible;
  /* 允许动画超出容器 */
  color: white;
  /* 默认颜色，使用currentColor可以继承这个颜色 */
}

.emoji {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  transition: all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
  /* 更Q弹的动画曲线 */
  will-change: transform, opacity;
  /* 优化性能 */

  &.emoji-speaking {
    animation: pulse 2s infinite alternate;
  }

  &.emoji-smile {
    animation: bounce 0.5s;
  }

  &.emoji-sad {
    animation: shake 0.8s;
  }

  &.emoji-listening {
    animation: float 3s infinite alternate;
  }
}

@keyframes pulse {
  0% {
    transform: scale(1);
  }

  100% {
    transform: scale(1.05);
  }
}

@keyframes bounce {
  0% {
    transform: scale(0.8);
  }

  50% {
    transform: scale(1.1);
  }

  75% {
    transform: scale(0.95);
  }

  100% {
    transform: scale(1);
  }
}

@keyframes shake {

  0%,
  100% {
    transform: translateX(0);
  }

  20%,
  60% {
    transform: translateX(-5px);
  }

  40%,
  80% {
    transform: translateX(5px);
  }
}

@keyframes float {
  0% {
    transform: translateY(0);
  }

  100% {
    transform: translateY(-3px);
  }
}

.emoji-feature {
  transition: all 0.2s ease;
}

.emoji-mouth.key-pressed {
  stroke-width: 4;
  animation: mouth-reaction 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
}

.emoji-circle.key-pressed {
  stroke-width: 3;
  animation: circle-pulse 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
}

@keyframes mouth-reaction {
  0% {
    transform: scaleX(1);
  }

  40% {
    transform: scaleX(0.8);
  }

  70% {
    transform: scaleX(1.1);
  }

  100% {
    transform: scaleX(1);
  }
}

@keyframes circle-pulse {
  0% {
    transform: scale(1);
  }

  40% {
    transform: scale(1.08);
  }

  70% {
    transform: scale(0.98);
  }

  100% {
    transform: scale(1);
  }
}
</style>