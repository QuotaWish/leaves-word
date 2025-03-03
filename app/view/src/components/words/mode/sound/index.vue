<script setup lang="ts">
import type { SoundPrepareWord } from "~/composables/words/mode/sound";
import { SoundWordType, WordState } from "~/composables/words/mode/sound";
import { useSoundWordManager } from "~/composables/words/mode/soundHooks";
import SoundLayout from "./SoundLayout.vue";
import SoundEmoji from "./SoundEmoji.vue";
import InputBox from "./InputBox.vue";
import SoundHintDisplay from "./SoundHintDisplay.vue";

const props = defineProps<{
  prepare: SoundPrepareWord;
}>();

const emits = defineEmits<{
  (e: "quit"): void;
  (e: "done"): void;
}>();

const prepareData = props.prepare;

// 使用封装好的钩子函数
const {
  wordState,
  userInput,
  errorCount,
  showHint,
  showInputContainer,
  audioFinished,
  audioPosition,
  currentWord,
  currentHintText,
  taskAmount,
  playWord,
  refreshData,
  checkInput
} = useSoundWordManager(prepareData, emits);

// 组件挂载时初始化
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
    @play-audio="playWord"
  >
    <div class="transition-cubic SoundWordCard-Main learning-card">
      <div
        class="word-audio"
        :class="[
          { playing: wordState === WordState.PLAYING },
          { 'position-center': audioPosition === 'center' },
          { 'position-top': audioPosition === 'top' },
          { 'state-correct': wordState === WordState.CORRECT },
          { 'state-error': wordState === WordState.ERROR },
        ]"
        @click="playWord"
      >
        <!-- 使用 SoundEmoji 组件 -->
        <SoundEmoji :word-state="wordState" />
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
  min-height: 40vh;
  max-height: 60vh;
  width: 95%;
  height: auto;
  overflow: auto;
  margin: 0 auto;
  position: relative;
  
  &::-webkit-scrollbar {
    width: 4px;
  }
  
  &::-webkit-scrollbar-track {
    background: rgba(0, 0, 0, 0.05);
    border-radius: 4px;
  }
  
  &::-webkit-scrollbar-thumb {
    background: rgba(74, 111, 165, 0.5);
    border-radius: 4px;
  }
  
  &::-webkit-scrollbar-thumb:hover {
    background: rgba(74, 111, 165, 0.7);
  }
}

.word-info {
  min-height: 35vh;
  padding-bottom: 10px;
  overflow-y: auto;
  overscroll-behavior: contain;
}

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

:deep(.example-stage-title) {
  background: linear-gradient(135deg, #4a6fa5 0%, #6c8db7 100%);
  color: #fff;
  padding: 4px 12px;
  border-radius: 16px;
  font-size: 14px;
  font-weight: 500;
  display: inline-block;
  margin: 6px 0;
  box-shadow: 0 2px 8px rgba(74, 111, 165, 0.3);
  letter-spacing: 0.5px;
  transition: all 0.3s ease;
  
  &:hover {
    box-shadow: 0 4px 12px rgba(74, 111, 165, 0.5);
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
  background: linear-gradient(135deg, rgba(74, 111, 165, 0.9) 0%, rgba(91, 141, 214, 0.9) 100%);
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 2px solid rgba(255, 255, 255, 0.2);
  box-shadow:
    0 4px 20px rgba(74, 111, 165, 0.4),
    0 0 15px rgba(74, 111, 165, 0.3);
  transition: all 0.25s cubic-bezier(0.25, 0.46, 0.45, 0.94);

  top: 50%;
  left: 50%;
  overflow: hidden;

  &.position-center {
    transform: translate(-50%, -50%);
    width: 100px;
    height: 100px;
    font-size: 38px;
    box-shadow: 0 0 40px rgba(74, 111, 165, 0.6);
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

  &.state-correct {
    background: linear-gradient(135deg, rgba(76, 175, 80, 0.9) 0%, rgba(56, 142, 60, 0.9) 100%);
    box-shadow:
      0 4px 20px rgba(76, 175, 80, 0.4),
      0 0 15px rgba(76, 175, 80, 0.3);
  }

  &.state-error {
    background: linear-gradient(135deg, rgba(244, 67, 54, 0.9) 0%, rgba(211, 47, 47, 0.9) 100%);
    box-shadow:
      0 4px 20px rgba(244, 67, 54, 0.4),
      0 0 15px rgba(244, 67, 54, 0.3);
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
    box-shadow: 0 0 20px rgba(74, 111, 165, 0.5);
  }

  100% {
    box-shadow: 0 0 50px rgba(74, 111, 165, 0.8);
  }
}

.content-hidden {
  opacity: 0 !important;
  pointer-events: none !important;
  transition: opacity 0.3s ease;
}
</style>
