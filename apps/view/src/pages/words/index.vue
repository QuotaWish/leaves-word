<!-- <script name="Words" setup lang="ts">
import { ElMessage } from 'element-plus'
import WordCard from '~/components/WordCard.vue'
import type { IWord, IWordItem } from '~/composables/words'
import { calendarData, calendarManager, globalData, targetDict, useWordSound } from '~/composables/words'

const mainCard = ref<InstanceType<typeof WordCard>>()
const moveCard = ref<InstanceType<typeof WordCard>>()

const successAudio = ref<HTMLAudioElement>()
const errorAudio = ref<HTMLAudioElement>()

const router = useRouter()

const data = reactive<{
  content: boolean
  current: IWordItem | null
  next: IWordItem | null
  word: {
    current: number
    total: number
    left: number
    history: string[]
    start: number
  }
}>({
  content: false,
  current: null,
  next: null,
  word: {
    current: 0,
    total: globalData.value.amount,
    left: 0,
    history: [],
    start: Date.now(),
  },
})

async function playAudioSound(success: boolean = false) {
  const el = success ? successAudio.value : errorAudio.value

  if (!el)
    return

  el.currentTime = 0
  await el.play()
}

// 随机抽取1个单词以及3个额外单词的选项
function randomWords() {
  return targetDict.value.storage.randomUnlearnedWordsWithOptiohns()
  // const storage = targetDict.value.storage
  // const totalWords = [...storage.getAllWords()]
  // const words = storage.getUnlearnedWords()

  // data.word.total = Math.min(data.word.total, words.length)

  // // 随机抽取
  // const mainWordIndex = Math.floor(Math.random() * words.length)
  // const mainWord = words[mainWordIndex]

  // // 剩余单词数组
  // const remainingWords = totalWords.filter(word => word.word !== mainWord.word)

  // // 从剩余单词中随机选择3个单词
  // const options: any[] = []
  // for (let i = 0; i < 3; i++) {
  //   const randomIndex = Math.floor(Math.random() * remainingWords.length)
  //   options.push(remainingWords[randomIndex])
  //   remainingWords.splice(randomIndex, 1) // 移除已选中的单词
  // }

  // return { mainWord, options }
}

async function spokenWord(word: IWord) {
  const audio = await useWordSound(word.word)

  audio.play()
}

async function next() {
  const moving = data.current !== null

  if (!moving) {
    data.current = randomWords()
    spokenWord(data.current.mainWord)

    return
  }

  const currentDom = mainCard.value!.$el
  const nextDom = moveCard.value!.$el

  data.next = data.current
  data.current = randomWords()
  data.word.history.push(data.next!.mainWord.word)

  currentDom.style.transition = 'none'
  currentDom.style.transform = 'translateX(120%)'

  nextDom.style.transition = 'none'
  nextDom.style.transform = 'translateX(0)'

  await sleep(10)

  nextDom.style.visibility = 'visible'
  nextDom.style.transition = ''
  nextDom.style.transform = 'translateX(0%)'

  await sleep(20)

  nextDom.style.transform = 'translateX(-120%)'

  await sleep(200)

  currentDom.style.transition = ''
  currentDom.style.transform = 'translateX(0)'

  spokenWord(data.current.mainWord)

  await sleep(200)

  currentDom.style.transform = 'translateX(0)'
  nextDom.style.visibility = ''
}

const {
  isSupported,
  isListening,
  // isFinal,
  // error,
  result,
  start,
  stop,
} = useSpeechRecognition()

async function speechRecognition() {
  if (!isSupported.value)
    return next()

  start()

  await sleep(2500)

  stop()

  if (result.value.toLocaleLowerCase() === data.current!.mainWord.word.toLocaleLowerCase()) {
    ElMessage.success('阅读非常完美！')
    useVibrate('light')
  }
  else {
    ElMessage.info(`还需提升${result.value}`)
    useVibrate('heavy')
  }

  result.value = ''

  await sleep(300)

  next()
}

async function handleChoose(word: IWord) {
  if (isListening.value)
    return

  const wrong = word !== data.current!.mainWord

  await playAudioSound(!wrong)

  if (wrong) {
    data.content = true
    useVibrate('heavy')

    // whenever(() => data.content === false, async () => {
    //   await sleep(300)

    //   speechRecognition()
    // })
  }
  else {
    targetDict.value.storage.setLearned(data.current!.mainWord.word)

    useVibrate('bit')

    await speechRecognition()

    data.word.current += 1
  }
}

next()

whenever(() =>
  data.word.current
  > data.word.total, () => {
  calendarManager.createTodayData(data.word.history, Date.now() - data.word.start, true)

  router.push('/words/signed')
})

function goDictionary() {
  router.push(`/dictionary?dict=${targetDict.value.id}`)
}
</script>

<template>
  <div :class="{ listenning: isListening }" class="WordsPage">
    <div class="WordsPage-Decoration">
      <div class="WordsPage-Decoration-EarLeft" />
      <div class="WordsPage-Decoration-EarRight" />
    </div>

    <div flex items-center justify-between gap-2 text-black class="WordsPage-Header">
      <div flex items-center gap-2 font-bold class="WordsPage-Header-Left">
        <ExitButton @click="router.push('/')">
          <div i-carbon:arrow-left />
        </ExitButton>
        <p underline @click="goDictionary">
          {{ targetDict.name }}
        </p>
      </div>

      <h1 flex items-center gap-2 text-sm op-75>
        剩余 {{ data.word.total - data.word.current }} 个
      </h1>
    </div>

    <div class="WordCard-Container">
      <WordCard
        ref="mainCard" :right="data.current!.mainWord" class="WordCard WordCard-Main transition-cubic"
        :data="data.current!" @choose="handleChoose"
      />
      <WordCard
        ref="moveCard" :right="data.current!.mainWord" class="WordCard WordCard-Next transition-cubic"
        :data="data.next!"
      />
    </div>

    <audio ref="successAudio" src="/sound/success.wav" />
    <audio ref="errorAudio" src="/sound/error.wav" />

    <div v-if="data.current" :class="{ visible: data.content }" class="WordContent transition-cubic">
      <WordDetailContent :word="data.current.mainWord" @close="data.content = false" />
    </div>

    <teleport to="body">
      <div v-if="isListening" class="Word-Recognition">
        <div i-carbon:voice-activate />
        <p>念出这个单词</p>
      </div>
    </teleport>
  </div>
</template>

<style lang="scss">
.Word-Recognition {
  p {
    font-size: 16px;
  }

  z-index: 10;
  position: absolute;
  display: flex;

  top: 50%;
  left: 50%;

  width: 128px;
  height: 128px;

  gap: 0.5rem;
  font-size: 32px;
  align-items: center;
  flex-direction: column;
  justify-content: center;
  background-color: var(--el-mask-color-extra-light);

  border-radius: 16px;
  backdrop-filter: blur(18px) saturate(180%);
  transform: translate(-50%, -50%);
}

.WordContent {
  &.visible {
    transform: translateY(0);
  }

  z-index: 10;
  position: absolute;
  // padding: 1rem;

  top: 0;
  left: 0;

  width: 100%;
  height: 100%;
  min-height: 100%;

  overflow: scroll;
  transform: translateY(-120%);
  background-color: var(--el-bg-color);
}

.WordCard {
  &.WordCard-Next {
    visibility: hidden;
  }

  position: absolute;

  top: 0;
  left: 0;

  width: 100%;
  height: 100%;
}

.WordCard-Container {
  position: absolute;
  margin: 1rem;

  top: 50px;
  left: 0;

  width: calc(100% - 2rem);
  height: calc(100% - 2rem);

  overflow: hidden;
}

.WordCard-Next {
  position: absolute;
}

.WordsPage-Decoration {
  .WordsPage-Decoration-EarLeft {
    position: absolute;

    top: 15%;
    left: 0%;

    width: 50vw;
    height: 40vw;

    border-radius: 45%;
    background-color: var(--theme-color);
    // box-shadow: 0 0 0.5rem 2rem var(--theme-color);
  }

  .WordsPage-Decoration-EarRight {
    position: absolute;

    top: 15%;
    right: 0%;

    width: 50vw;
    height: 40vw;

    border-radius: 45%;
    background-color: var(--theme-color);
    // box-shadow: 0 0 0.5rem 2rem var(--theme-color);
  }

  display: none;
  z-index: -1;
  position: absolute;

  top: 50vmin;
  left: 0;

  width: 100%;
  height: 50vw;

  filter: drop-shadow(0 0 4px var(--theme-color));
  // ;
  // box-shadow: 0 0 2rem 8rem var(--theme-color);
}

.WordsPage {
  &::before {
    z-index: -1;
    content: '';
    position: absolute;

    top: -1rem;
    left: -10vmin;

    width: 120vmin;
    height: 60vmin;

    // opacity: 0.75;
    // filter: drop-shadow(0 0 16px var(--theme-color));
    border-radius: 0 0 200px 200px;
    background-color: var(--theme-color);
    box-shadow:
      0 0 0rem 5rem #eea850e0,
      0 0 0.5rem 8rem #ed935780,
      0 0 1rem 10rem #eb726350;
  }

  &.listenning {
    filter: blur(2px);
  }

  h1.title {
    font-size: 24px;
    font-weight: 600;
  }

  z-index: 1;
  position: relative;
  padding: 1rem;

  width: 100%;
  height: 100%;
}
</style> -->

<script setup lang="ts">
</script>

<template>
  Out dated!
</template>
