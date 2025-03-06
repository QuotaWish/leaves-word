<script setup lang="ts">
import { ActionSheet, NavBar } from 'vant'

// import type { IWord } from '~/composables/words'
import { dictionaries, useTargetData } from '~/composables/words'

const route = useRoute()
const router = useRouter()

const dictionary = computed(() => dictionaries.find(item => item.id === route.query?.dict))
const currentWord = ref<any>()

const selectOptions = reactive<{
  actionSheet: boolean
  check: boolean
  list: string[]
}>({
  actionSheet: false,
  check: false,
  list: [],
})
function handleClickRight() {
  if (selectOptions.check) {
    selectOptions.actionSheet = true

    return
  }

  selectOptions.list = []
  selectOptions.check = !selectOptions.check
}

function handleSelectWord(word: string) {
  if (selectOptions.check) {
    if (selectOptions.list.includes(word)) {
      selectOptions.list = selectOptions.list.filter(item => item !== word)
    }
    else {
      selectOptions.list.push(word)
    }
  }
}

const { targetDict } = useTargetData()
const actions = [
  {
    name: '重新学习',
    color: '#ee0a24',
    callback: () => {
      selectOptions.list.forEach((word) => {
        targetDict.value.storage.setUnlearned(word)
      })

      selectOptions.check = false
    },
  },
  {
    name: '全部选择',
    callback: () => {
      selectOptions.list = targetDict.value.storage.getAllWords().map(item => item.word)
    },
  },
  {
    name: '取消所有选择',
    callback: () => {
      selectOptions.list = []
    },
  },
]
</script>

<template>
  <div :class="{ checkMode: selectOptions.check }" class="DictionaryPage">
    <NavBar
      :right-text="selectOptions.check ? '操作' : '选择'" :title="selectOptions.check ? `已选择 ${selectOptions.list.length} 项` : `${dictionary?.name} - 词典`" left-text="返回" left-arrow w-full @click-right="handleClickRight"
      @click-left="router.back()"
    />

    <ActionSheet
      v-model:show="selectOptions.actionSheet" cancel-text="取消" :actions="actions" :close-on-click-action="true" @cancel=" selectOptions.check = false"
    />

    <ul>
      <li v-for="word in dictionary?.storage.getAllWords()" :key="word.word" :class="{ selected: selectOptions.list.includes(word.word) }" class="transition-cubic" @click="handleSelectWord(word.word)">
        <p w-full flex items-center justify-between class="word">
          <span text-lg font-bold>
            {{ word.word }}
            <span v-show="targetDict.storage.getLearned(word.word)" class="tag">
              已学习
            </span>
          </span>
          <span>
            <WordPlayIcon :word="word.word" />
          </span>
        </p>
        <p w-full flex items-center justify-between gap-2 font-size-3.25 op-75 class="content">
          <span flex items-center class="translation">
            <input type="checkbox">
            <span>{{ word.translation }}</span>
          </span>

          <span flex flex-shrink-0 items-center @click="currentWord = word">
            详情
            <i i-carbon-chevron-right block />
          </span>
        </p>
      </li>
    </ul>

    <div :class="{ visible: currentWord }" class="transition-cubic DictionaryPage-Word">
      <WordDetailContent v-if="currentWord" button="关闭" :word="currentWord" @close="currentWord = false" />
    </div>
  </div>
</template>

<style lang="scss">
.DictionaryPage-Word {
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

.DictionaryPage {
  .translation {
    // 当input选项框选中的时候
    input:checked + span {
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
