<script setup lang="ts">
// import NumberFlow from '@number-flow/vue'
import { ElMessage } from 'element-plus'
import { pronounceWords } from '~/composables/pronounce'

const router = useRouter()

interface IPronounceData {
  index: number
}

const pronounceData = useLocalStorage<IPronounceData>('pronounceData', {
  index: 0,
})

const {
  isSupported,
  isListening,
  // isFinal,
  // error,
  result,
  start,
  stop,
} = useSpeechRecognition()
const currentData = computed(() => pronounceWords?.[pronounceData.value.index || 0])

onMounted(() => {
  if (!isSupported.value) {
    // eslint-disable-next-line no-alert
    alert('浏览器不支持语音识别!')

    router.push('/')
  }
})

function handleStart() {
  if (isListening.value) {
    stop()
  }

  start()
}

async function handleEnd() {
  stop()

  await sleep(100)

  stop()

  if (result.value.toLocaleLowerCase() === currentData.value.word.toLocaleLowerCase()) {
    ElMessage.success('阅读非常完美！')
    useVibrate('light')

    pronounceData.value.index += 1
  }
  else {
    ElMessage.info(`还需提升${result.value}`)
    useVibrate('heavy')
  }

  result.value = ''
}

useEventListener('touchend', handleEnd)
</script>

<template>
  <PageNavHolder title="发音训练">
    <div class="PronouncePage-Main">
      <div class="bubble"></div>
      <div class="bubble"></div>
      <div class="bubble"></div>
      <div class="bubble"></div>
      <div class="bubble"></div>
      <div class="PronouncePage-Progress">
        <div class="progress-bar">
          <div class="progress-fill" :style="{ width: `${(pronounceData.index / pronounceWords.length) * 100}%` }">
          </div>
        </div>
        <div class="progress-text">
          <span class="current">{{ pronounceData.index + 1 }}</span>
          <span class="total">/50</span>
        </div>
      </div>
      <div class="PronouncePage-Instructions">
        <p>长按“开始朗读”按钮，准确清晰地朗读单词</p>
        <p>松开按钮后，系统将为您评估发音水平</p>
      </div>
      <div class="PronouncePage-MainCard">
        <p class="word">
          {{ currentData.word }}
        </p>
        <p class="phonetic">
          {{ currentData.phonetic }}
        </p>
      </div>

      <div class="PronouncePage-Button transition-cubic" @touchstart="handleStart">
        <span v-if="!isListening">
          开始朗读
        </span>
        <span v-else>
          松手停止
        </span>
      </div>
    </div>
  </PageNavHolder>
</template>

<style lang="scss">
.PronouncePage-Progress {
  width: 100%;
  padding: 1rem 1.5rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;

  .progress-bar {
    width: 100%;
    height: 8px;
    background: rgba(22, 119, 255, 0.1);
    border-radius: 4px;
    overflow: hidden;

    .progress-fill {
      height: 100%;
      background: linear-gradient(90deg, #1677ff 0%, #4096ff 100%);
      transition: width 0.3s ease;
    }
  }

  .progress-text {
    display: flex;
    align-items: baseline;
    gap: 0.25rem;

    .current {
      font-size: 24px;
      font-weight: 600;
      color: #1677ff;
    }

    .total {
      font-size: 16px;
      color: var(--el-text-color-secondary);
    }
  }
}

.PronouncePage-Instructions {
  text-align: center;
  margin-bottom: 1rem;

  p {
    font-size: 16px;
    color: var(--el-text-color-secondary);
  }
}

.PronouncePage-Button {
  .listening & {
    &::before {
      animation: wavingButton 1.2s infinite;
    }

    animation: buttonShaving 2s infinite;
    box-shadow: 0 0 24px 8px var(--el-color-primary);
  }

  &::before {
    z-index: -1;
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    border-radius: 50%;
    background: linear-gradient(135deg, var(--el-color-primary) 0%, var(--el-color-primary-light-3) 100%);
  }

  z-index: 1;
  position: relative;
  margin: 1.5rem auto;
  display: flex;
  width: 120px;
  height: 120px;
  user-select: none;
  align-items: center;
  justify-content: center;
  box-shadow: 0 4px 16px rgba(var(--el-color-primary-rgb), 0.3);
  border-radius: 50%;
  background: var(--el-color-primary);
  color: white;
  font-size: 18px;
  font-weight: 600;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);

  &:active {
    transform: scale(0.92);
  }
}

.PronouncePage-MainCard {
  .word {
    font-size: 32px;
    font-weight: 700;
    margin-bottom: 0.5rem;
    background: linear-gradient(135deg, var(--el-color-primary) 0%, var(--el-color-primary-light-3) 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    animation: wordFadeIn 0.5s ease-out;
  }

  .phonetic {
    font-size: 20px;
    margin: 0.5rem 0;
    color: var(--el-text-color-secondary);
    opacity: 0.8;
  }

  position: relative;
  display: flex;
  padding: 2rem;
  margin: 1rem auto;
  height: 220px;
  width: 90%;
  max-width: 400px;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  border-radius: 25px;
  background: var(--el-bg-color-page);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);
  transition: transform 0.3s ease,
  box-shadow 0.3s ease;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 12px 32px rgba(0, 0, 0, 0.15);
  }
}

.PronouncePage-Main {
  position: relative;
  display: flex;
  margin: auto;
  width: 100%;
  gap: 1.5rem;
  align-items: center;
  flex-direction: column;
  overflow: hidden;
}

.PronouncePage-Main::before,
.PronouncePage-Main::after {
  content: '';
  position: fixed;
  bottom: -50px;
  width: 150px;
  height: 150px;
  border-radius: 50%;
  background: rgba(22, 119, 255, 0.1);
  animation: bubbleFloat 8s infinite ease-in-out;
}

.PronouncePage-Main::before {
  left: -50px;
  animation-delay: -4s;
}

.PronouncePage-Main::after {
  right: -50px;
}

@keyframes bubbleFloat {

  0%,
  100% {
    transform: translateY(0) scale(1);
  }

  50% {
    transform: translateY(-20px) scale(1.1);
  }
}

.bubble {
  position: fixed;
  bottom: -20px;
  width: 80px;
  height: 80px;
  border-radius: 50%;
  background: rgba(22, 119, 255, 0.08);
  animation: smallBubbleFloat 6s infinite ease-in-out;
}

.bubble:nth-child(1) {
  left: 10%;
  animation-delay: -2s;
}

.bubble:nth-child(2) {
  left: 30%;
  animation-delay: -1s;
}

.bubble:nth-child(3) {
  left: 50%;
  animation-delay: -3s;
}

.bubble:nth-child(4) {
  left: 70%;
  animation-delay: -4s;
}

.bubble:nth-child(5) {
  left: 90%;
  animation-delay: -2.5s;
}

@keyframes smallBubbleFloat {

  0%,
  100% {
    transform: translateY(0) scale(1);
  }

  50% {
    transform: translateY(-30px) scale(1.2);
  }
}

.PronouncePage-Instructions {
  text-align: center;
  margin-bottom: 0.5rem;

  p {
    font-size: 16px;
    color: var(--el-text-color-secondary);
  }
}

.PronouncePage {
  position: relative;
  display: flex;
  width: 100%;
  height: 100%;
  align-items: center;
  flex-direction: column;
}

@keyframes buttonShaving {

  0%,
  100% {
    transform: scale(1.15);
  }

  50% {
    transform: scale(1);
  }
}

@keyframes wavingButton {
  to {
    opacity: 0;
    transform: scale(1.8);
  }
}

@keyframes wordFadeIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }

  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>
