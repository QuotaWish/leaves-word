<script setup lang="ts">
import NumberFlow from '@number-flow/vue'
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
      <div class="PronouncePage-Instructions">
        <p>点击“开始”按钮，然后大声朗读显示的单词。</p>
        <p>松开按钮后，系统会判断你的发音是否正确。</p>
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
          开 始
        </span>
        <span v-else>
          松手停止
        </span>
      </div>

      <div font-bold class="PronouncePage-StatusBar">
        <NumberFlow suffix="/50" :continuous="true" :will-change="true" :animated="true" :value="pronounceData.index + 1" />
      </div>
    </div>
  </PageNavHolder>
</template>

<style lang="scss">
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
      animation: wavingButton 1s infinite;
    }
    animation: buttonShaving 2s infinite;
    box-shadow: 0 0 16px 4px var(--el-color-primary);
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
    background-color: var(--el-color-primary);
  }
  z-index: 1;
  position: relative;
  margin: 1rem auto;
  display: flex;
  width: 96px;
  height: 96px;
  user-select: none;
  align-items: center;
  justify-content: center;
  box-shadow: 0 0 10px 0 var(--el-color-primary);
  border-radius: 50%;
  background-color: var(--el-color-primary);
  transition: transform 0.3s ease;
  &:active {
    transform: scale(0.95);
  }
}

@keyframes buttonShaving {
  0%,
  100% {
    transform: scale(1.25);
  }

  50% {
    transform: scale(1);
  }
}

@keyframes wavingButton {
  to {
    opacity: 0;
    transform: scale(1.5);
  }
}

.PronouncePage-MainCard {
  .word {
    font-size: 22px;
    font-weight: 600;
  }
  .phonetic {
    font-size: 18px;
    margin: 0.5rem 0;
    color: var(--el-text-color-primary);
  }
  position: relative;
  display: flex;
  padding: 1rem;
  margin: 0 auto;
  height: 200px;
  width: 90%;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  border-radius: 25px;
  background-color: var(--el-bg-color-page);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.PronouncePage-Main {
  position: relative;
  display: flex;
  margin: auto;
  width: 100%;
  gap: 3rem;
  align-items: center;
  flex-direction: column;
}

.PronouncePage {
  position: relative;
  display: flex;
  width: 100%;
  height: 100%;
  align-items: center;
  flex-direction: column;
  // background-color: var(--el-bg-color-page);
}
</style>
