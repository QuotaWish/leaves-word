<script setup lang="ts">
import { useTargetData } from "~/composables/words";

defineProps<{
  newlyWords: number;
  totalWords: number;
  leftWords: number;
  hintText: string;
  contentHidden: boolean;
}>();

const emits = defineEmits<{
  (e: "quit"): void;
  (e: "playAudio"): void;
}>();

const router = useRouter();
const { targetDict } = useTargetData();

function goDictionary() {
  router.push(`/dictionary/${targetDict.value.id}`);
}
</script>

<template>
  <WithPage
    class="SoundWordPage flex flex-col"
    style="overflow-y: auto; -webkit-overflow-scrolling: touch"
  >
    <div
      px-4
      py-2
      flex
      items-center
      justify-between
      gap-2
      class="SoundWordPage-Header"
    >
      <div flex items-center gap-2 class="SoundWordPage-Header-Left">
        <div i-carbon:chevron-left @click="emits('quit')" class="back-btn" />
        <p class="flex flex-col gap-1">
          <span>需学习 {{ newlyWords }}</span>
          <span>剩余 {{ leftWords }}</span>
        </p>
      </div>

      <h1 flex items-center gap-2 text-sm op-75 @click="goDictionary">
        <el-link class="dictionary-link">{{ targetDict.name }}</el-link>
      </h1>
    </div>

    <div class="progress-container">
      <div class="progress-bar">
        <div
          class="progress-fill"
          :style="{
            width: `${(1 - leftWords / totalWords) * 100}%`,
          }"
        ></div>
      </div>
    </div>

    <div class="SoundInner relative flex flex-col h-full w-full">
      <div class="SoundWordCard-Container">
        <slot />

        <div class="action-area" :class="{ 'content-hidden': contentHidden }">
          <div @click="emits('playAudio')" class="action-btn replay-btn">
            <i class="el-icon-headset"></i>
            <span>重听</span>
          </div>
        </div>
      </div>

      <div class="bottom-hint-container">
        <p class="main-hint-text">{{ hintText }}</p>
        <p class="sub-hint-text">按下键盘输入，内容完整时自动提交</p>
      </div>
    </div>
  </WithPage>
</template>

<style lang="scss">
:root {
  --theme-primary: #ffcb6b;
  --theme-secondary: #ffffff;
  --theme-accent: #7986cb;
  --theme-text: #333333;
  --theme-border: rgba(255, 203, 107, 0.3);
  --theme-card-bg: rgba(255, 255, 255, 0.9);
  --theme-glass: rgba(255, 255, 255, 0.8);
  --theme-shadow: 0 8px 32px rgba(0, 0, 0, 0.15);
  --theme-success: #4caf50;
  --theme-error: #f56c6c;
}

.dark {
  --theme-primary: #ffcb6b;
  --theme-secondary: #121212;
  --theme-accent: #7986cb;
  --theme-text: #f5f5f5;
  --theme-border: rgba(255, 203, 107, 0.3);
  --theme-card-bg: rgba(33, 33, 33, 0.75);
  --theme-glass: rgba(18, 18, 18, 0.65);
  --theme-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
  --theme-success: #4caf50;
  --theme-error: #f56c6c;
}

.SoundWordCard-Container {
  margin: 0.5rem 1rem 1rem;

  width: calc(100% - 2rem);
  height: calc(100% - 1.5rem);

  border-radius: 16px;
  border: 1px solid var(--theme-border);
}

// 播放状态时隐藏内容
.content-hidden {
  opacity: 0;
  pointer-events: none;
  transition: opacity 0.3s ease;
}

.progress-container {
  width: 100%;
  display: block;
  z-index: 10;
  position: relative;
}

.progress-bar {
  height: 8px;
  background-color: rgba(255, 203, 107, 0.2);
  border-radius: 4px;
  overflow: hidden;
  position: relative;
}

.progress-fill {
  height: 100%;
  background-color: var(--theme-primary);
  border-radius: 4px;
  transition: width 0.3s ease;
}

.progress-text {
  text-align: right;
  font-size: 12px;
  color: var(--theme-text);
  opacity: 0.7;
  margin-top: 5px;
}

// 音频按钮样式优化
.word-audio {
  position: absolute;
  z-index: 999; // 增加z-index确保在最上层
  font-size: 24px;
  cursor: pointer;
  width: 60px;
  height: 60px;
  border-radius: 50%;
  background: linear-gradient(
    135deg,
    rgba(255, 203, 107, 0.9) 0%,
    rgba(255, 180, 78, 0.9) 100%
  );
  color: var(--theme-secondary);
  display: flex;
  align-items: center;
  justify-content: center;
  border: 2px solid rgba(255, 255, 255, 0.2);
  box-shadow: 0 4px 20px rgba(255, 203, 107, 0.4),
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
    top: 15%;
    transform: translate(-50%, -50%);
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

.word-info {
  display: flex;
  flex-direction: column;
  align-items: center;
  flex: 1;
  padding: 1rem 0;
  position: relative;

  top: 180px;
}

.word-char {
  font-size: 32px;
  font-weight: bold;
  color: var(--theme-text);
  min-width: 20px;
  min-height: 50px;
  text-align: center;
  margin: 0 2px;
  position: relative;
  transition: all 0.3s ease;

  &::after {
    content: "";
    position: absolute;
    bottom: -5px;
    left: 0;
    width: 100%;
    height: 3px;
    background: var(--theme-primary);
    transition: all 0.3s ease;
  }

  &.char-empty {
    color: transparent;

    &::after {
      background: var(--theme-primary);
      opacity: 0.7;
      height: 3px;
    }
  }

  &.char-input {
    color: var(--theme-primary);

    &::after {
      background: var(--theme-primary);
      height: 3px;
    }
  }

  &.char-cursor {
    animation: blink 1s infinite;

    &::after {
      background: var(--theme-primary);
      height: 3px;
    }
  }

  &.char-error {
    color: var(--theme-error);
    animation: shake 0.5s;

    &::after {
      background: var(--theme-error);
    }
  }

  &.char-correct {
    color: var(--theme-success);
    animation: popIn 0.5s;

    &::after {
      background: var(--theme-success);
      height: 3px;
    }
  }

  &.char-hidden {
    opacity: 0;

    &::after {
      opacity: 0;
    }
  }
}

@keyframes popIn {
  0% {
    transform: scale(1);
  }

  50% {
    transform: scale(1.2);
  }

  100% {
    transform: scale(1);
  }
}

.word-text {
  font-size: 36px;
  font-weight: bold;
  margin-bottom: 15px;
  letter-spacing: 3px;
  color: var(--theme-primary);
  text-shadow: 0 2px 10px rgba(255, 203, 107, 0.3);
  transition: opacity 0.5s ease;

  &.example-mode {
    font-size: 28px;
    margin-bottom: 10px;
    opacity: 0.8;
  }
}

.example-container {
  margin-top: 1.5rem;
  width: 100%;
  display: flex;
  justify-content: center;
  transition: opacity 0.3s ease;
}

.example-text {
  font-size: 24px;
  color: var(--theme-text);
  line-height: 1.6;
  text-align: center;
  max-width: 100%;
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  padding: 0 15px;
  word-break: break-word;
  overflow-wrap: break-word;
}

.example-char {
  position: relative;
  margin: 0 2px;
  min-width: 8px;
  transition: all 0.3s ease;

  &.char-space {
    margin: 0 6px;
  }

  &.char-input {
    color: var(--theme-primary);
  }

  &.char-punctuation {
    color: var(--theme-accent);
    opacity: 0.9;
    font-weight: 500;

    // 确保标点符号不需要用户输入
    &::after {
      display: none;
    }
  }

  &.char-cursor {
    &::after {
      content: "";
      position: absolute;
      bottom: 0;
      right: -2px;
      height: 70%;
      width: 2px;
      background: var(--theme-primary);
      animation: blink 1s infinite;
    }
  }

  &.char-error {
    color: var(--theme-error);
  }

  &.char-correct {
    color: var(--theme-success);
    animation: popIn 0.5s;
  }
}

.action-area {
  display: flex;
  justify-content: center;
  gap: 15px;
  margin-top: 10px;
  margin-bottom: 0.5rem;
  flex-wrap: wrap;
}

.action-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 12px;
  padding: 0.5rem 1.5rem;
  background: var(--theme-glass);
  backdrop-filter: blur(10px);
  border: 1px solid var(--theme-border);
  color: var(--theme-primary);
  font-size: 16px;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 15px rgba(255, 203, 107, 0.2);
  }

  &:active {
    transform: translateY(1px);
  }

  i {
    margin-right: 5px;
    font-size: 18px;
  }
}

.replay-btn {
  background: rgba(255, 203, 107, 0.1);
}

.bottom-hint-container {
  width: 100%;
  text-align: center;
  padding: 0 20px;
  bottom: 25px;
  left: 0;
  z-index: 50;

  .hint-background {
    position: absolute;
    top: -8px;
    left: 50%;
    transform: translateX(-50%);
    width: 90%;
    height: 100%;
    background: var(--theme-glass);
    backdrop-filter: blur(5px);
    border-radius: 12px;
    z-index: -1;
    padding: 15px;
    border: none; // 移除边框
    box-shadow: 0 4px 15px rgba(0, 0, 0, 0.15);
  }

  .main-hint-text {
    font-size: 16px;
    font-weight: 500;
    color: var(--theme-text);
    margin-bottom: 5px;
    text-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
  }

  .sub-hint-text {
    font-size: 14px;
    color: var(--theme-text);
    opacity: 0.7;
  }
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s, transform 0.3s;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
  transform: translateY(-10px);
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

@keyframes blink {
  0%,
  100% {
    opacity: 1;
  }

  50% {
    opacity: 0;
  }
}

@keyframes pulse {
  0% {
    transform: scale(1);
  }

  50% {
    transform: scale(1.1);
  }

  100% {
    transform: scale(1);
  }
}

@keyframes fadeIn {
  0% {
    opacity: 0;
    transform: translateY(10px);
  }

  100% {
    opacity: 1;
    transform: translateY(0);
  }
}

// @media (max-height: 700px) {
//   .word-info {
//     padding: 0.5rem 0;
//   }

//   .word-audio.position-center {
//     top: 30%;
//   }

//   .word-text {
//     font-size: 30px;

//     &.example-mode {
//       font-size: 24px;
//     }
//   }

//   .bottom-hint-container {
//     padding: 0.5rem;
//   }
// }

// @media (max-height: 640px) {
//   .word-info {
//     padding: 0.3rem 0;
//   }

//   .word-audio.position-center {
//     top: 25%;
//     width: 80px;
//     height: 80px;
//     font-size: 28px;
//   }

//   .hint-container {
//     max-width: 280px;
//     margin-top: 10px;
//   }

//   .action-area {
//     margin-bottom: 0.5rem;
//   }

//   .action-btn {
//     padding: 0.3rem 1rem;
//     font-size: 14px;
//   }

//   .bottom-hint-container {
//     padding: 0.2rem 0.3rem;
//     line-height: 1.2;

//     .main-hint-text {
//       font-size: 13px;
//       margin-bottom: 1px;
//     }

//     .sub-hint-text {
//       font-size: 11px;
//     }
//   }
// }

// @media (max-height: 600px) {
//   .word-info {
//     padding: 0.25rem 0;
//   }

//   .word-audio.position-center {
//     top: 20%;
//     width: 70px;
//     height: 70px;
//     font-size: 24px;
//   }

//   .word-char {
//     font-size: 28px;
//     min-height: 40px;
//   }

//   .bottom-hint-container {
//     display: none;
//   }
// }

// @media (max-height: 580px) {
//   .word-input-container {
//     margin: 0.8rem 0;
//   }

//   .word-char {
//     font-size: 24px;
//     min-height: 36px;
//   }

//   .word-audio.position-center {
//     top: 18%;
//     width: 60px;
//     height: 60px;
//   }

//   .word-audio.position-top {
//     width: 45px;
//     height: 45px;
//     font-size: 18px;
//     margin-bottom: 15px;
//   }

//   .action-btn {
//     padding: 0.25rem 0.8rem;
//     font-size: 12px;
//   }

//   .bottom-hint-container {
//     padding: 0.1rem;

//     .main-hint-text {
//       font-size: 12px;
//       margin-bottom: 0;
//     }

//     .sub-hint-text {
//       display: none;
//     }
//   }

//   .action-area {
//     margin-top: 5px;
//     margin-bottom: 0.3rem;
//   }
// }

// @media (max-height: 560px) {
//   .SoundWordPage-Header {
//     margin: 0.3rem 0;
//   }

//   .progress-container {
//     margin: 0.2rem 0 0.5rem;
//   }

//   .word-audio.position-center {
//     top: 15%;
//     width: 50px;
//     height: 50px;
//     font-size: 20px;
//   }

//   .word-audio.position-top {
//     width: 40px;
//     height: 40px;
//     font-size: 16px;
//     margin-bottom: 10px;
//   }

//   .action-btn {
//     padding: 0.2rem 0.6rem;
//     font-size: 11px;
//     border-radius: 8px;
//   }
// }
</style>
