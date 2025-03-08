<script setup lang="ts">
import type { WordContent } from '~/composables/api/types'
import { Swipe, SwipeItem } from 'vant'
import { type IWord, useWordSound } from '~/modules/words/core/word'

const props = defineProps<{
  /**
   * 对应查询的单词
   */
  word: string
  /**
   * 对应单词数据 - 如果传入数据则不从服务器获取
   */
  data: WordContent
  button?: string
}>()

const emits = defineEmits<{
  (e: 'close'): void
}>()

const buttonTitle = computed(() => props.button || '已了解')

const analyze = ref(false)
const sdk = ref<any>()

function openChat() {
  sdk.value?.destroy()

  const container = document.getElementById('chat-content')
  if (!container)
    return

  const cozeWebSDK = sdk.value = new CozeWebSDK.WebChatClient({
    config: {
      // 智能体 ID
      botId: '7448405006673412115',
    },
    userInfo: {
      id: 'test',
      url: 'https://files.catbox.moe/wp02xj.png',
      nickname: '爱学习的猫猫',
    },
    ui: {
      footer: {
        isShow: false,
      },
      chatBot: {
        el: container,
        title: 'Lucas Tata',
        onBeforeHide: async () => {
          analyze.value = false

          await sleep(300)

          return false
        },
      },
      asstBtn: {
        isNeed: false,
      },
      base: {
        icon: 'https://ai.quotawish.com/favicon.ico',
      },
    },
  })

  console.log(cozeWebSDK)

  cozeWebSDK.showChatBot()
}

function openAnalyse() {
  openChat()

  analyze.value = true
}

/**
 * 当前是紫色 将24h划分为48个区域
 * 从早上（橙色 120deg） 到晚上（紫色 0deg）
 * 每个区域为 15deg
 */
// function getColor(hour: number) {
//   return (hour * 15) % 360
// }

// const color = computed(() => getColor(new Date().getHours()))
</script>

<template>
  <div class="WordDetailContent fake-background">
    <div class="WordDetailContent-Background" />

    <div class="WordDetailContent-Main p-4">
      <div class="WordDetaiContent-Header">
        <p flex items-end gap-2 class="word">
          {{ word }}
        </p>

        <div class="WordDetaiContent-Pronounce flex items-center gap-2">
          <PronounceDisplay type="british" :pronounce="data.britishPronounce" />
          <PronounceDisplay type="american" :pronounce="data.americanPronounce" />
        </div>
        <!-- <div class="desc-translation">
          {{ word.translation }} <span mx-2 op-50>{{ formateType(word.type) }}.</span>
        </div> -->
      </div>

      <WordSection>
        <template #Tag>
          词巧助记
        </template>
        <p>{{ data.remember }}</p>
        <div class="WordDetailContent-Image">
          <Swipe style="border-radius: 20px" lazy-render overflow-hidden :autoplay="1000" indicator-color="red">
            <SwipeItem v-for="item in data.img" :key="item">
              <el-image style="width: 100%; height: 200px" fit="fill" loading="lazy" :src="item" />
            </SwipeItem>
          </Swipe>
        </div>
      </WordSection>

      <WordSection>
        <template #Tag>
          诠释定义
        </template>
        {{ data.translation }}
      </WordSection>

      <!-- <div class="WordDetailContent-Main">

      <WordSection>
        <template #Tag>
          定义解析
        </template>
        <p>{{ word.definition[0] }}</p>
        <p>{{ word.definition[1] }}</p>
      </WordSection>

      <WordSection>
        <template #Tag>
          诠释助记
        </template>
        {{ word.remember }}
      </WordSection>

      <WordSection v-if="word.prefix || word.suffix">
        <template #Tag>
          词根助记
        </template>
        <p v-if="word.prefix">
          {{ word.prefix }}
        </p>
        <p v-if="word.suffix">
          {{ word.suffix }}
        </p>
      </WordSection>

      <WordSection>
        <template #Tag>
          短语助记
        </template>
        <div v-for="(phrase, ind) in word.phrases" :key="ind" my-2>
          <div my-1 class="phrase-header" flex flex-col font-bold>
            {{ phrase.phrase }}
            <p text-sm font-normal op-75>
              {{ phrase.usage }}
            </p>
          </div>
          <p text-sm v-html="highlightKeywords(phrase.example, phrase.phrase)" />
          <p text-sm>
            {{ phrase.translation }}
          </p>
        </div>
      </WordSection>

      <WordSection>
        <template #Tag>
          故事助记
        </template>
        {{ word.story }}
      </WordSection>
    </div> -->

      <!-- <div v-if="word.backgroundStory" class="WordContent-Story">
        {{ word.backgroundStory }}
      </div> -->

      <!-- <WordExamples v-if="word.examples?.length" style="margin: 0 1rem" :word="word" /> -->

      <!-- <div class="WordContent-Extra">
      <div v-if="word.synonyms?.length" class="block">
        <p class="title">
          同义词
        </p>
        <p class="content">
          <span v-for="subWord in word.synonyms" :key="subWord.word">
            {{ subWord?.word }}
          </span>
        </p>
      </div>
      <div v-if="word.antonyms?.length" class="block">
        <p class="title">
          反义词
        </p>
        <p class="content">
          <span v-for="subWord in word.antonyms" :key="subWord.word">
            {{ subWord?.word }}
          </span>
        </p>
      </div>
      <div v-if="word.transform?.length" class="block">
        <p class="title">
          变形词
        </p>
        <p class="content">
          <span v-for="subWord in word.transform" :key="subWord.word">
            {{ subWord?.word }}
          </span>
        </p>
      </div>
      <div v-if="word.derived?.length" class="block">
        <p class="title">
          派生词
        </p>
        <p class="content">
          <span v-for="subWord in word.derived" :key="subWord.word">
            {{ subWord?.word }}
          </span>
        </p>
      </div>
    </div> -->

      <br>

      <div class="WordContent-Bottom fake-background">
        <el-button plain size="large" type="info" @click="openAnalyse">
          析
        </el-button>
        <el-button plain size="large" w-full type="primary" @click="emits('close')">
          {{ buttonTitle }}
        </el-button>
      </div>
    </div>

    <TouchDialog v-model="analyze">
      <div id="chat-content" class="WordDetailContent-DialogContent" />
    </TouchDialog>
  </div>
</template>

<style lang="scss">
.WordDetailContent-DialogContent {
  padding-bottom: 0.5rem;

  height: 85vh;
}

.WordDetaiContent-Header {
  p.word {
    position: relative;

    font-size: 32px;
    font-weight: 600;
  }

  position: relative;
  padding: 1rem;
  display: flex;

  flex-direction: column;

  align-items: flex-start;
  justify-content: center;
}

.WordContent-Bottom {
  position: sticky;
  padding: 1rem;
  display: flex;

  top: calc(100% - 72px);
  bottom: 0;

  width: 100%;
  height: 72px;

  align-items: center;
  justify-content: center;

  // --fake-color: var(--theme-color);
  backdrop-filter: blur(18px) saturate(180%);
  // background-color: var(--el-bg-color);
  border-top: 1px solid var(--el-border-color);
}

.WordContent-Definition {
  padding: 1rem;
  margin: 1rem 1rem;

  border-radius: 16px;
  color: var(--el-text-color-secondary);
  background-color: var(--el-bg-color-page);
}

.WordContent-Story {
  margin: 1rem 1rem 2rem;

  font-size: 18px;
}

.WordContent-Extra {
  .block {
    p.content {
      display: flex;

      width: 100%;
      gap: 0.25rem;

      flex-wrap: wrap;
    }

    p.title {
      width: max-content;
      padding: 0.25rem;

      border-radius: 8px;
      background-color: var(--el-fill-color);
    }

    margin: 0.5rem 0;
    padding: 1rem;

    border-radius: 16px;
    color: var(--el-text-color-secondary);
    background-color: var(--el-bg-color-page);
  }

  margin: 0.5rem 1rem;
}

.WordDetailContent {
  .highlight {
    color: var(--el-color-primary);
  }

  position: relative;

  width: 100%;
  min-height: 100%;
  overflow-x: hidden;

  --fake-opacity: 0.5;
  backdrop-filter: blur(18px) saturate(180%);
}

.WordDetailContent-Background {
  z-index: -1;
  position: absolute;

  top: 0;
  left: 0;

  width: 100%;
  height: 100%;
  opacity: 0.25;
  filter: hue-rotate(210deg);

  background-image: url('/glass-bg.png');
  background-size: 100% 100%;
}
</style>
