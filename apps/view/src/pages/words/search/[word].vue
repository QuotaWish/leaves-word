<script setup lang="ts">
import type { WordContent } from '~/composables/api/types'
import { getEnglishWordDetailUsingGet } from '~/composables/api/clients/api/englishWords'

const route = useRoute('/words/search/[word]')

const empty = ref(false)
const word = computed(() => route.params.word)
const wordData = ref<API.EnglishWord>()
const wordContent = computed(() => {
  if (!wordData.value)
    return null

  const info = wordData.value.info

  try {
    const content = JSON.parse(info || '{}')
    return content as WordContent
  }
  catch (_) {
    return null
  }
})

// const searchQuery = ref('')

// function handleSearch(value: string) {
//   console.log(value)
// }

async function fetchWordData() {
  const { code, data } = await getEnglishWordDetailUsingGet({
    word: word.value,
  })

  if (code !== 0 || !data) {
    empty.value = true
    return
  }

  wordData.value = data
}

onMounted(fetchWordData)
</script>

<template>
  <PageNavHolder :content-padding="false" title="单词详情">
    <!-- <template #header>
      <div class="search-bar">
        <SearchBar
          v-model="searchQuery"
          placeholder="搜索单词"
          class="search-bar__input"
          @input="handleSearch"
        />
      </div>
    </template> -->
    <WordContentDisplay v-if="wordContent" :data="wordContent" :word="word" />
  </PageNavHolder>
</template>
