<script setup lang="ts">
import { useForm } from 'alova/client';
import { DictionaryWordWithWordVO, EnglishDictionaryVO } from '~/composables/api/clients/globals';
import { EnglishWordData, LeafWordData } from '~/modules/words';

const PER_PAGE_AMO = 15

const props = defineProps<{
  dict: EnglishDictionaryVO
}>()

const words = ref<LeafWordData[]>([])
const currentWord = ref<LeafWordData>()

const { send, onSuccess } = useForm(() => Apis.EnglishWords.listEnglishWordByPageUsingPOST({
  data: {
    pageSize: PER_PAGE_AMO,
    dict_id: props.dict.id,
  },
}), {
  immediate: true,
  initialForm: {
    page: 1
  }
})

onSuccess((res) => {
  console.log(res)

  const records = res.data.data.records.map((item: DictionaryWordWithWordVO) => new LeafWordData(item.word?.word_head!).setData(new EnglishWordData(item.word!)))
  words.value = [...words.value, ...records]

  console.log(words.value)
})

</script>

<template>
  <div class="DictionaryWord">
    <ul>
      <li v-for="word in words" :key="word.word" class="transition-cubic">
        <p w-full flex items-center justify-between class="word">
          <span text-lg font-bold>
            {{ word.word }}
            <!-- <span v-show="targetDict.storage.getLearned(word.word)" class="tag">
              已学习
            </span> -->
          </span>
          <span>
            <WordPlayIcon :word="word.word" />
          </span>
        </p>
        <p w-full flex items-center justify-between gap-2 font-size-3.25 op-75 class="content">
          <span flex items-center class="translation">
            <input type="checkbox">
            <span>{{ word.data?.content.translation[0].translation }}</span>
          </span>

          <span flex flex-shrink-0 items-center @click="currentWord = word">
            详情
            <i i-carbon-chevron-right block />
          </span>
        </p>
      </li>
    </ul>

    <teleport to="#rootMain">
      <div :class="{ visible: currentWord }" class="transition-cubic DictionaryWord-DetailContent">
        <WordDetailContent v-if="currentWord" button="关闭" :word="currentWord.data!" @close="currentWord = undefined" />
      </div>
    </teleport>
  </div>
</template>

<style lang="scss" scoped>
.DictionaryWord {
  position: relative;
  display: flex;

  width: 100%;
  height: 100%;

  gap: 0.25rem;
  flex-direction: column;
}

.DictionaryWord-DetailContent {
  &.visible {
    transform: translateX(0%);
  }
  z-index: 1;
  position: absolute;

  width: 100%;
  height: 100%;

  top: 0;
  left: 0;

  overflow-y: scroll;
  transform: translateX(120%);
  background-color: var(--el-bg-color);
}

.DictionaryPage.checkMode ul li {
  &.selected {
    border: 2px solid var(--el-color-primary);
  }

  margin: 0.5rem 0;

  border-radius: 25px;
  border: 2px solid #0000;
  background-color: var(--el-fill-color-lighter);

  animation: shavingCard 0.4s linear infinite;
}

@keyframes shavingCard {
  0% {
    transform: scale(0.85) rotateZ(0);
  }

  30% {
    transform: scale(0.85) rotateZ(1deg);
  }

  70% {
    transform: scale(0.85) rotateZ(-1deg);
  }

  100% {
    transform: scale(0.85) rotateZ(0);
  }
}

.DictionaryWord {
  .translation {

    // 当input选项框选中的时候
    input:checked+span {
      color: unset;
      background-color: transparent;
    }

    input {
      z-index: 1;
      position: absolute;

      opacity: 0;
      width: 90%;
    }

    span {
      position: relative;

      overflow: hidden;
      white-space: nowrap;
      text-overflow: ellipsis;

      max-width: 100%;

      color: #0000;
      background-color: var(--el-fill-color-darker);
    }

    position: relative;

    max-width: 100%;

    overflow: hidden;
  }

  ul {
    li {
      span.tag {
        padding: 0.25rem 0.5rem;

        font-size: 12px;
        font-weight: normal;

        border-radius: 25px;
        background-color: var(--el-fill-color);
      }

      position: relative;
      padding: 0.5rem 1rem;
      display: flex;
      // margin: 0.35rem 0;

      width: 100%;
      height: 70px;

      flex-direction: column;
      justify-content: space-between;

      background-color: var(--el-fill-color-lighter);
      border-bottom: 1px solid var(--el-border-color-lighter);
    }

    position: relative;

    width: 100%;
    height: calc(100% - 2rem);

    overflow-x: hidden;
    overflow-y: scroll;
  }

  position: relative;
  padding-bottom: 1rem;

  height: 100%;
}
</style>