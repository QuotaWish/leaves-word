<script name="Words" setup lang="ts">
import type { IReadingWordItem } from '~/modules/words/mode/reading'
import { Swipe, SwipeItem } from 'vant'
import { LeafWordData, useErrorAudio, useSuccessAudio, formatDisplayType } from '~/modules/words'

const props = defineProps<{
  data: IReadingWordItem
  right: IReadingWordItem
}>()

const emits = defineEmits<{
  (e: 'choose', wrong: boolean): void
  (e: 'previous'): void
}>()
const options = reactive({
  content: false,
  display: false,
  wrongAmo: 0,
  showExample: false, // 新增：控制是否显示例句
  showContext: false, // 新增：控制是否显示上下文
})

const finalOptions = computed(() => {
  if (!props.data?.mainWord)
    return null

  const res = [props.data.mainWord, ...props.data.options]

  // shuffle
  for (let i = res.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
      ;[res[i], res[j]] = [res[j], res[i]]
  }

  return res
})

function handleEmit() {
  const wrong = options.wrongAmo !== 0

  options.wrongAmo = 0
  options.display = false
  options.showExample = false
  options.showContext = false

  emits('choose', wrong)
}

async function handleChooseWord(word: LeafWordData) {
  const right = props.right.mainWord.word === word.word

  if (right) {
    useVibrate('bit')
      ; (await useSuccessAudio()).play()

    options.display = true

    // 对于阅读模式，正确后显示例句
    options.showExample = true

    await sleep(800)

    options.display = false

    await sleep(100)

    if (props.data.type === 'new' || !!options.wrongAmo) {
      options.content = true

      whenever(() => options.content === false, handleEmit, { once: true })
    }
    else {
      handleEmit()
    }
  }
  else {
    useVibrate('heavy')
      ; (await useErrorAudio()).play()

    if (options.wrongAmo > 1) {
      options.display = true

      // 对于阅读模式，多次错误后显示上下文
      options.showContext = true

      await sleep(800)

      options.display = false

      await sleep(100)
      options.content = true

      whenever(() => options.content === false, handleEmit, { once: true })
    }

    options.wrongAmo++
  }
}

const wordContent = computed(() => {
  return props.data.mainWord.data?.content
})

// 获取单词例句
const wordExamples = computed(() => {
  return props.data.mainWord.data?.content.sentences || []
})

// 提供单词的上下文（模拟数据，实际项目中应该从后端获取）
const wordContext = computed(() => {
  const examples = wordExamples.value
  if (examples && examples.length > 0) {
    // 使用第一个例句作为上下文
    return examples[0].sentence
  }
  return `This is a context paragraph containing the word "${props.data.mainWord.word}" in a natural reading environment.`
})

// 切换显示例句
function toggleExamples() {
  options.showExample = !options.showExample
}

// 切换显示上下文
function toggleContext() {
  options.showContext = !options.showContext
}
</script>

<template>
  <div :class="{ imagable: !!options.wrongAmo, review: data?.type === 'review' }" class="WordCard">
    <div v-if="data" class="WordsCard">
      <!-- 阅读模式特有：单词在上下文中的展示 -->
      <div v-if="options.showContext" class="WordsCard-Context transition-cubic">
        <div class="context-container">
          <h3>Context</h3>
          <p v-html="wordContext.replace(data.mainWord.word, `<span class='highlight'>${data.mainWord.word}</span>`)"></p>
        </div>
      </div>

      <div class="WordsCard-Image transition-cubic">
        <Swipe v-if="!!options.wrongAmo" lazy-render h-full :autoplay="3000" indicator-color="red">
          <SwipeItem v-for="item in wordContent?.img" :key="item">
            <el-image fit="fill" loading="lazy" :src="item" />
            <el-image fit="fill" loading="lazy" :src="item" />
          </SwipeItem>
        </Swipe>
      </div>

      <p class="transition-cubic word">
        <span class="transition-cubic word-inner">{{ data.mainWord.word }}<span class="transition-cubic word-type">{{
          formatDisplayType(wordContent!)
            }}.</span></span>
        <span class="phonetic" flex items-center gap-2>{{ data.mainWord.data?.content.britishPronounce.content }}
        </span>
      </p>

      <!-- 阅读模式特有：例句展示 -->
      <div v-if="options.showExample && wordExamples.length > 0" class="WordsCard-Examples transition-cubic">
        <h3>Examples</h3>
        <ul>
          <li v-for="(example, index) in wordExamples.slice(0, 2)" :key="index"
              v-html="example.sentence.replace(data.mainWord.word, `<span class='highlight'>${data.mainWord.word}</span>`)">
          </li>
        </ul>
      </div>
    </div>

    <ul v-if="finalOptions" class="WordsOptions">
      <!-- {{ formateType(word.type, 1) }}.  -->
      <li v-for="word in finalOptions" :key="word.word"
        :class="{ right: options.display && word.word === right.mainWord.word }" class="transition-cubic WordOption"
        @click="handleChooseWord(word)">
        <p>
          <span text-sm>{{ formatDisplayType(word.data?.content!) }}</span>
          {{ word.data?.content.translation[0].translation }}
        </p>
      </li>
    </ul>

    <div class="WordCard-Footer">
      <div mr-auto flex items-center gap-1 class="WordCard-Footer-Button" @click="emits('previous')">
        <div i-carbon-arrow-left />
        上一个
      </div>

      <div v-if="data?.mainWord" flex items-center gap-1 class="WordCard-Footer-Button" @click="toggleExamples">
        <div i-carbon-document-add />
        例句
      </div>

      <div v-if="data?.mainWord" flex items-center gap-1 class="WordCard-Footer-Button" @click="toggleContext">
        <div i-carbon-text-link />
        语境
      </div>

      <div ml-auto flex items-center gap-1 class="WordCard-Footer-Button">
        <WordPlayIcon :word="data?.mainWord?.word" />
      </div>
    </div>

    <teleport to="#rootMain">
      <div v-if="data?.mainWord.data" :class="{ visible: options.content }" class="transition-cubic WordContent">
        <WordDetailContent :key="data.mainWord.word" :word="data.mainWord.data" @close="options.content = false" />
      </div>
    </teleport>
  </div>
</template>

<style lang="scss">
.WordCard.review {
  span.word-type {
    position: relative;
    margin: 0;
    padding: 0;

    width: 0;

    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
}

.WordCard.review.imagable span.word-type {
  margin: 0 0.25rem;
  padding: 0.25rem 0.5rem;

  width: max-content;
}

// 阅读模式特定样式
.WordsCard-Context, .WordsCard-Examples {
  padding: 1rem;
  margin: 0.5rem 0;
  border-radius: 8px;
  background-color: var(--el-fill-color-light);

  h3 {
    font-size: 16px;
    font-weight: bold;
    margin-bottom: 0.5rem;
    color: var(--el-color-primary);
  }

  p, li {
    font-size: 14px;
    line-height: 1.6;
    color: var(--el-text-color-primary);
  }

  .highlight {
    font-weight: bold;
    color: var(--el-color-primary);
    text-decoration: underline;
  }
}

.WordsCard-Examples {
  ul {
    list-style: disc;
    padding-left: 1.5rem;
  }
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

.WordCard-Footer {
  &-Button {
    &:active {
      color: var(--el-text-color-regular);
      background-color: var(--el-fill-color-darker);
    }

    padding: 0.35rem 0.5rem;

    width: max-content;

    font-size: 14px;
    border-radius: 12px;
    color: var(--el-text-color-secondary);
    background-color: var(--el-fill-color-lighter);
  }

  position: sticky;
  padding: 0 0.5rem;
  margin: 1rem 0;
  display: grid;

  top: calc(100% - 94px);

  bottom: 0.5rem;

  justify-items: center;
  grid-template-columns: repeat(4, 1fr);
}

.WordsOptions {
  .WordOption {
    &:active {
      background-color: var(--el-fill-color);
      border: 1px solid var(--el-color-primary);
    }

    p {
      position: relative;

      text-overflow: ellipsis;
      overflow: hidden;
      white-space: wrap;

      width: 100%;
      max-height: 90%;
    }

    display: flex;
    padding: 1rem 1rem;

    align-items: center;
    justify-content: flex-start;

    height: 85px;

    max-width: 100%;

    border: 1px solid var(--el-border-color);
    border-radius: 1rem;

    background-color: var(--el-fill-color-light);
  }

  &.disabled .WordOption {
    pointer-events: none;
  }

  list-style-type: none;
  padding: 0;
  padding: 0 1rem;

  display: grid;
  grid-gap: 0.5rem;
  grid-template-columns: repeat(2, 1fr);
  grid-template-rows: repeat(2, 1fr);
}

.WordsCard {
  .word {
    // font-family: serif;
    font-weight: bold;
    text-align: center;
    padding-bottom: 1rem;

    font-size: 28px;

    .word-inner {
      position: relative;
      margin: 0;
      width: max-content;
    }

    span.word-type {
      margin: 0 0.25rem;
      padding: 0.25rem 0.5rem;

      width: max-content;

      vertical-align: sub;

      font-size: 13px;
      // border: 1px solid var(--el-border-color);
      border-radius: 6px;
      color: var(--el-text-color-disabled);
      text-align: center;
      background-color: var(--el-fill-color);
    }

    .phonetic {
      margin-top: 0.75rem;

      font-size: 12px;
      font-weight: normal;
    }
  }

  .WordsCard-Image {
    margin: auto;
    margin-bottom: 1rem;

    width: 0%;
    height: 0px;

    overflow: hidden;
  }

  .imagable & {
    padding-top: 100px;

    .WordsCard-Image {
      width: 60%;
      height: 160px;
    }
  }

  padding: 1rem;
}
</style>
