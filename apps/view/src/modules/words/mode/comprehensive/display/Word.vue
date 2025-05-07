<script name="Words" setup lang="ts">
import type { ComprehensivePrepareWord, IComprehensiveWordItem } from '~/modules/words/mode/comprehensive'
import { type EnglishWordData, globalPreference, useWordSound } from '~/modules/words'
import WordCard from './WordCard.vue'

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
async function spokenWord(word: EnglishWordData) {
  if (lastAudio) {
    lastAudio?.pause()
  }

  lastAudio = await useWordSound(word.word_head!)

  lastAudio.play()
}

function refreshData() {
  data.current = prepareData.currentWord
  Object.assign(prepareData, props.prepare)

  if (data.current) {
    spokenWord(data.current.mainWord.data!)
  }
}

/**
 * 执行滑动动画
 * @param direction 滑动方向：'left' - 向左滑动，'right' - 向右滑动
 * @param nextCardData 下一张卡片的数据
 */
async function slideCard(direction: 'left' | 'right', nextCardData: IComprehensiveWordItem) {
  const currentDom = mainCard.value!.$el
  const nextDom = moveCard.value!.$el

  // 准备下一卡片数据（但不更新当前卡片）
  data.next = nextCardData

  // 1. 重置两张卡片的过渡效果
  currentDom.style.transition = 'none'
  nextDom.style.transition = 'none'

  // 2. 设置初始位置
  if (direction === 'left') {
    // 向左滑动：当前卡片在中央，下一张卡片在右边
    currentDom.style.transform = 'translateX(0)'
    nextDom.style.transform = 'translateX(100%)'
  } else {
    // 向右滑动：当前卡片在中央，下一张卡片在左边
    currentDom.style.transform = 'translateX(0)'
    nextDom.style.transform = 'translateX(-100%)'
  }

  // 显示下一张卡片
  nextDom.style.visibility = 'visible'

  // 等待DOM更新
  await sleep(10)

  // 3. 设置过渡动画样式
  const transitionStyle = 'transform 0.2s cubic-bezier(0.33, 1, 0.68, 1)'
  currentDom.style.transition = transitionStyle
  nextDom.style.transition = transitionStyle

  // 4. 执行同步滑动动画
  if (direction === 'left') {
    // 向左滑动：当前卡片滑出左侧，下一张卡片滑入中央
    currentDom.style.transform = 'translateX(-100%)'
    nextDom.style.transform = 'translateX(0)'
  } else {
    // 向右滑动：当前卡片滑出右侧，下一张卡片滑入中央
    currentDom.style.transform = 'translateX(100%)'
    nextDom.style.transform = 'translateX(0)'
  }

  // 5. 等待动画完成
  await sleep(200)

  // 6. 更新当前卡片数据
  data.current = nextCardData

  // 7. 重置当前卡片位置（为下次动画做准备）
  currentDom.style.transition = 'none'
  currentDom.style.transform = 'translateX(0)'
  nextDom.style.visibility = ''

  // 8. 朗读新单词
  if (data.current) {
    spokenWord(data.current.mainWord.data!)
  }
}

async function handlePrevious() {
  // 先获取上一个单词数据，但不立即更新界面
  const result = await prepareData.previous()
  if (!result) {
    return
  }

  // 获取但不立即应用的下一个单词数据
  const nextWordData = prepareData.currentWord
  if (!nextWordData) {
    return
  }

  // 执行滑动动画，动画完成后会自动更新数据
  await slideCard('right', nextWordData)
}

async function nextData(success: boolean) {
  // 先获取下一个单词数据，但不立即更新界面
  const result = await prepareData.next(success)

  if (!result) {
    await prepareData.finish()
    emits('done')
    return
  }

  // 获取但不立即应用的下一个单词数据
  const nextWordData = prepareData.currentWord
  if (!nextWordData) {
    return
  }

  // 执行滑动动画，动画完成后会自动更新数据
  await slideCard('left', nextWordData)
}

async function handleChoose(wrong: boolean) {
  lastAudio?.pause()

  nextData(!wrong)

  // targetDict.value.storage.setLearned(data.current!.mainWord.word)
}

function goDictionary() {
  router.push(`/dictionary/${globalPreference.value.dict.data?.id}`)
}

onMounted(() => {
  refreshData()
})
</script>

<template>
  <WithPage class="WordsPage">
    <div p-4 flex flex-col h-full>
      <div flex items-center justify-between gap-2 class="WordsPage-Header">
        <div flex items-center gap-2 class="WordsPage-Header-Left">
          <div i-carbon:chevron-left @click="emits('quit')" />
          <p class="WordsPage-Header-Title">
            <span>需新学 {{ prepareData.getNewlyWords() }}</span>
            <span>需复习 {{ prepareData.getReviewWords() }}</span>
          </p>
        </div>

        <h1 flex items-center gap-2 text-sm op-75 @click="goDictionary">
          <el-link>{{ globalPreference.dict.data?.name }}</el-link>
        </h1>
      </div>

      <div v-if="data.current" class="WordCard-Container">
        <WordCard
          ref="mainCard"
          :right="data.current"
          class="transition-cubic WordCard WordCard-Main"
          :data="data.current!"
          @choose="handleChoose"
          @previous="handlePrevious"
        />
        <WordCard
          ref="moveCard"
          pointer-events-none
          :right="data.current"
          class="WordCard transition-cubic WordCard-Next"
          :data="data.next!"
        />
      </div>
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
    }

    &-Left {
      align-self: flex-start;
    }
  }
}
</style>
