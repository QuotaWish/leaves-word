<script name="Words" setup lang="ts">
import WordCard from '~/components/WordCard.vue'
import type { IWord } from '~/composables/words'
import { useTargetData, useWordSound } from '~/composables/words'
import type { ComprehensivePrepareWord, IComprehensiveWordItem } from '~/composables/words/mode/comprehensive'

const props = defineProps<{
  prepare: ComprehensivePrepareWord
}>()

const emits = defineEmits<{
  (e: 'quit'): void
  (e: 'done'): void
}>()

const mainCard = ref<InstanceType<typeof WordCard>>()
const moveCard = ref<InstanceType<typeof WordCard>>()

const router = useRouter()
const prepareData = reactive(props.prepare)

const data = reactive<{
  current: IComprehensiveWordItem | null
  next: IComprehensiveWordItem | null
}>({
  current: null,
  next: null,
})

let lastAudio: HTMLAudioElement | null = null
async function spokenWord(word: IWord) {
  if (lastAudio) {
    lastAudio?.pause()
  }

  lastAudio = await useWordSound(word.word)

  lastAudio.play()
}

function refreshData() {
  data.current = prepareData.currentWord
  Object.assign(prepareData, props.prepare)

  spokenWord(data.current!.word.mainWord)
}

async function handlePrevious() {
  const currentDom = mainCard.value!.$el
  const nextDom = moveCard.value!.$el

  data.next = data.current

  const result = await prepareData.previous()
  if (!result) {
    return
  }

  refreshData()

  currentDom.style.transition = 'none'
  currentDom.style.transform = 'translateX(-120%)'

  nextDom.style.transition = 'none'
  nextDom.style.transform = 'translateX(0)'

  await sleep(10)

  nextDom.style.visibility = 'visible'
  nextDom.style.transition = ''
  nextDom.style.transform = 'translateX(0%)'

  await sleep(20)

  nextDom.style.transform = 'translateX(120%)'

  await sleep(200)

  currentDom.style.transition = ''
  currentDom.style.transform = 'translateX(0)'

  await sleep(200)

  currentDom.style.transform = 'translateX(0)'
  nextDom.style.visibility = ''
}

async function nextData(success: boolean) {
  const currentDom = mainCard.value!.$el
  const nextDom = moveCard.value!.$el

  data.next = data.current

  const result = await prepareData.next(success)

  if (!result) {
    await prepareData.finish()

    emits('done')

    return
  }

  refreshData()

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

  await sleep(200)

  currentDom.style.transform = 'translateX(0)'
  nextDom.style.visibility = ''
}

const { targetDict } = useTargetData()

async function handleChoose(wrong: boolean) {
  lastAudio?.pause()

  nextData(!wrong)

  // targetDict.value.storage.setLearned(data.current!.mainWord.word)
}

function goDictionary() {
  router.push(`/dictionary/${targetDict.value.id}`)
}

onMounted(() => {
  refreshData()
})
</script>

<template>
  <WithPage class="WordsPage">
    <div flex items-center justify-between gap-2 class="WordsPage-Header">
      <div flex items-center gap-2 class="WordsPage-Header-Left">
        <div i-carbon:chevron-left @click="emits('quit')" />
        <p class="WordsPage-Header-Title">
          <span>需新学 {{ prepareData.getNewlyWords() }}</span>
          <span>需复习 {{ prepareData.getReviewWords() }}</span>
        </p>
      </div>

      <h1 flex items-center gap-2 text-sm op-75 @click="goDictionary">
        <el-link>{{ targetDict.name }}</el-link>
      </h1>
    </div>

    <div v-if="data.current" class="WordCard-Container">
      <WordCard
        ref="mainCard" :right="data.current" class="transition-cubic WordCard WordCard-Main"
        :data="data.current!" @choose="handleChoose" @previous="handlePrevious"
      />
      <WordCard
        ref="moveCard" pointer-events-none :right="data.current"
        class="WordCard transition-cubic WordCard-Next" :data="data.next!"
      />
    </div>
  </WithPage>
</template>

<style lang="scss">
.WordCard-Container {
  position: relative;

  height: 100%;

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
  &.WordCard-Next {
    visibility: hidden;
  }

  &-Header {
    &-Title {
      display: flex;
      padding-right: 1rem;

      font-size: 12px;
      flex-direction: column;
      color: var(--el-text-color-secondary);
      border-right: 1px solid var(--el-border-color);
    }
    margin: 1rem 0;
  }

  h1.title {
    font-size: 24px;
    font-weight: 600;
  }

  z-index: 1;
  position: relative;
  display: flex;
  padding: 1rem;

  width: 100%;
  height: 100%;

  flex-direction: column;

  background-color: var(--el-fill-color);
}
</style>
