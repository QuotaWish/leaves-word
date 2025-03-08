<script setup lang="ts">
import { articles } from '~/composables/speech'

interface ISpeechData {
  index: number
}

const speechData = useLocalStorage<ISpeechData>('speechData', {
  index: 0,
})
const currentData = computed(() => articles?.[speechData.value.index || 0])

const spokenText = ref('')
const {
  isSupported,
  // isPlaying,
  // status,
  // voiceInfo,
  // utterance,
  // stop: spokenStop,
  speak,
} = useSpeechSynthesis(spokenText)

async function handlePlayParagraph(text: string) {
  spokenText.value = text

  speak()
}
</script>

<template>
  <PageNavHolder title="口语化学习" :class="{ supported: isSupported }" class="SpeechPage">
    <div class="SpeechPage-Main">
      <div v-for="(paragraph, ind) in currentData.articles" :key="ind" class="SpeechPage-Main-Paragraph">
        <p class="SpeechPage-Main-Text">
          {{ paragraph.paragraph }}
          <PlayIcon :active="false" inline @click="handlePlayParagraph(paragraph.paragraph)" />
        </p>
        <p class="SpeechPage-Main-Translation">
          {{ paragraph.translation }}
        </p>
      </div>
    </div>
  </PageNavHolder>
</template>

<style lang="scss" scoped>
.SpeechPage-Main {
  &-Paragraph {
    .SpeechPage-Main-Text {
      color: var(--el-text-color-regular);
    }

    .SpeechPage-Main-Translation {
      color: var(--el-text-color-secondary);
    }

    p {
      text-indent: 1em;
    }

    margin: 0 0 1rem;
  }
  padding-bottom: 2rem;

  overflow-y: auto;
}
</style>
