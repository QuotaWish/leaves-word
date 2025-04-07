<script setup lang="ts">
import type { EnglishWordData, WordContent } from '~/modules/words'
import { Swipe, SwipeItem } from 'vant'
import { useWordSound } from '~/modules/words'
import WithPage from '../page/WithPage.vue';

const props = defineProps<{
  word: EnglishWordData
  button?: string
}>()

const emits = defineEmits<(e: 'close') => void>()

const duration = ref()
const content = computed(() => props.word?.content)
const buttonTitle = computed(() => props.button || '已了解')

async function spokenWord(word: EnglishWordData) {
  const audio = await useWordSound(word.word_head!)

  await audio.play()

  duration.value = audio.duration * 1000

  setTimeout(() => {
    duration.value = 0
  }, duration.value)
}

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

  cozeWebSDK.showChatBot()
}

function openAnalyse() {
  openChat()

  analyze.value = true
}
</script>

<template>
  <WithHeadPage class="WordDetailContent transition-cubic">
    <div class="WordDetaiContent-Header">
      <div :style="duration > 0 ? `--a: growth ${duration}ms` : ''" flex items-center gap-2 class="word">
        <p>
          {{ word.word_head }}
        </p>
        <p text-xl>
          <PlayIcon :active="duration > 0" @click="spokenWord(word)" />
        </p>
      </div>

      <div class="desc">
        <div flex items-center class="desc-phonetic">
          <span text-sm class="phonetic">
            {{ content.britishPronounce.content }}
          </span>

        </div>
      </div>

      <WordSection>
        <template #Tag>
          释义
        </template>
        <WordTranslationDisplayer :word="word" />
      </WordSection>
    </div>

    <div class="WordDetailContent-Main">
      <Swipe style="border-radius: 20px" lazy-render overflow-hidden :autoplay="3000" indicator-color="red">
        <SwipeItem v-for="item in content?.img" :key="item">
          <el-image style="width: 100%;height: 240px" fit="contain" loading="lazy" :src="item" />
        </SwipeItem>
      </Swipe>

      <!-- <WordSection v-if="content?.prefix || content?.suffix">
        <template #Tag>
          词根助记
        </template>
        <p v-if="word.prefix">
          {{ word.prefix }}
        </p>
        <p v-if="word.suffix">
          {{ word.suffix }}
        </p>
      </WordSection> -->
    </div>

    <WordSection>
      <template #Tag>
        诠释助记
      </template>
      {{ content?.remember }}
    </WordSection>

    <WordSection v-if="content.backgroundStory" class="WordContent-Story">
      <template #Tag>
        故事助记
      </template>
      {{ content.backgroundStory }}
    </WordSection>

    <WordExamples v-if="content?.examplePhrases?.length" style="margin: 0 1rem" :word="word" />

    <WordSection>
      <template #Tag>
        衍生词
      </template>
      <WordDerivedDisplayer :word="word" />
    </WordSection>

    <WordSection>
      <template #Tag>
        词形变换
      </template>
      <WordTransformDisplayer :word="word" />
    </WordSection>

    <WordSection>
      <template #Tag>
        词缀助记
      </template>
      <WordAffixDisplayer :word="word" />
    </WordSection>

    <!-- <div class="WordContent-Extra">
      <div v-if="content?.synonyms?.length" class="block">
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

    <TouchDialog v-model="analyze">
      <div id="chat-content" class="WordDetailContent-DialogContent" />
    </TouchDialog>

    <template #shrinkHeader>
      {{ word.word_head }}
    </template>
  </WithHeadPage>
</template>

<style lang="scss" scoped>
.WordDetailContent-DialogContent {
  padding-bottom: 0.5rem;

  height: 85vh;
}

.WordDetaiContent-Header {
  .phonetic {
    margin: 0 0.25rem;
    padding: 0.25rem 0.5rem;

    font-size: 16px;
    border-radius: 8px;
    color: var(--el-text-color-secondary);
    background-color: var(--el-fill-color);
  }

  div.word {
    p::before {
      content: '';
      position: absolute;

      left: 0;
      bottom: 0;

      width: 0;
      height: 5px;

      transition: 0.25s;
      border-radius: 2px;
      animation: var(--a);
      background-color: var(--el-color-primary);
    }
    position: relative;

    font-size: 32px;
    font-weight: 600;
  }

  .desc {
    display: flex;

    gap: 0.5rem;
    flex-direction: column;
    align-items: flex-start;
  }

  position: relative;
  padding: 1rem 1.25rem;
  display: flex;

  flex-direction: column;

  align-items: flex-start;
  justify-content: center;
}

@keyframes growth {
  from {
    opacity: 0;
  }

  80% {
    opacity: 1;
  }

  to {
    opacity: 0;
    width: 100%;
  }
}

.WordContent-Bottom {
  position: sticky;
  padding: 1rem 2rem;
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

div.WithPage.WordDetailContent {
  position: relative;

  width: 100%;
  min-height: 100%;

  overflow-y: auto;
}
</style>
