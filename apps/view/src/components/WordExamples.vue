<script setup lang="ts">
import type { EnglishWordData } from '~/modules/words'

const props = defineProps<{
  word: EnglishWordData
}>()

const select = ref(0)

const content = computed(() => props.word?.content)
const cur = computed(() => content.value?.examplePhrases?.[select.value])

function formateSentence(sentence: string) {
  if (!props.word)
    return

  return sentence.replaceAll(props.word.word_head!, `<span class="highlight">${props.word.word_head}</span>`)
}
</script>

<template>
  <div v-if="word" class="WordExamples">
    <div class="WordExamples-Header">
      <span v-for="(_example, ind) in content?.examplePhrases" :key="ind" :class="{ active: ind === select }" @click="select = ind">{{ ind + 1 }}</span>
    </div>
    <div v-if="content?.examplePhrases" class="WordExample-Content">
      <div v-if="cur" class="WordContent-ExampleItem">
        <p class="example-origin" v-html="formateSentence(cur.sentence)" />
        <p class="example-translation">
          {{ cur.translation }}
        </p>
      </div>
    </div>
  </div>
</template>

<style lang="scss">
.WordExamples {
  &-Header {
    span {
      &.active {
        background-color: var(--theme-color-primary);
      }
      display: flex;
      padding: 0.5rem;

      width: 1.5rem;
      height: 1.5rem;

      align-items: center;
      justify-content: center;

      color: #fff;
      border-radius: 4px;
      background-color: var(--el-fill-color);
    }
    display: flex;

    gap: 0.25rem;
  }
  padding: 1rem;
  margin: 1rem 0;
  display: flex;

  flex-direction: column;

  border-radius: 16px;
  color: var(--el-text-color-secondary);
}

.WordExample-Content {
  .WordContent-ExampleItem {
    p {
      margin: 0.5rem 0;
    }
  }
}
</style>
