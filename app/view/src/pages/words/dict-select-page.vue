<script setup lang="ts">
// import WordSelector from '@/components/words/WordSelector.vue'
import { useDebounceFn } from '@vueuse/core'
import { ElMessage } from 'element-plus'
import { listEnglishDictionaryUsingGet } from '~/composables/api/clients/api/englishDictionaryController'
import type { Book, Category } from '~/modules/core/dictionary'
import { useCategoryTree } from '~/modules/core/dictionary'
import DictionaryHolder from '~/modules/core/dictionary/DictionaryHolder.vue'
// import BookItem from './BookItem.vue'
import 'wc-waterfall'

const loading = ref(false)
const router = useRouter()
const bookData = ref<Category[]>([])
const selectCategory = ref<Category>()
// const selectBook = ref<Book>()

async function fetchBookData() {
  loading.value = true

  const { code, data } = await listEnglishDictionaryUsingGet()

  loading.value = false

  if (code === 0) {
    const result = data || []

    bookData.value = useCategoryTree(result).value

    if (!selectCategory.value) {
      selectCategory.value = bookData.value[0]
    }
  }
  else {
    ElMessage.error('获取书籍数据失败')
  }
}

onMounted(() => {
  fetchBookData()
})

const searchQuery = ref('')

const handleSearch = useDebounceFn(() => {
  // 搜索逻辑...
}, 300)

function handleSelectCategory(category: Category) {
  selectCategory.value = category
}

function handleBookClick(book: Book) {
  // selectBook.value = book
  router.push({
    path: `/dictionary/${book.id}`,
  })
}
</script>

<template>
  <DictionaryHolder :empty="!loading && !bookData.length" class="DictionarySelectPage">
    <template #header>
      <div class="search-bar">
        <SearchBar
          v-model="searchQuery"
          placeholder="搜索词典/书籍/教材"
          class="search-bar__input"
          @input="handleSearch"
        />
      </div>
    </template>

    <template #nav>
      <el-skeleton :loading="loading" animated>
        <template #template>
          <el-skeleton-item v-for="i in 10" :key="i" variant="p" class="relative left-20% my-2 !w-60%" />
        </template>
        <ul h-full class="DictionarySelectPage-Nav">
          <li v-for="nav in bookData" :key="nav.id" :class="{ active: nav.id === selectCategory?.id }" text-center @click="handleSelectCategory(nav)">
            {{ nav.name }}
          </li>
        </ul>
      </el-skeleton>
    </template>

    <el-skeleton :loading="loading" animated>
      <template #template>
        <div h-full w-full flex flex-wrap items-center justify-between>
          <div v-for="i in 4" :key="i">
            <el-skeleton-item variant="image" style="width: 120px; height: 120px" />
            <div style="padding: 14px">
              <el-skeleton-item variant="h3" style="width: 50%" />
              <div
                style="
              display: flex;
              align-items: center;
              justify-items: space-between;
              margin-top: 16px;
              height: 16px;
            "
              >
                <el-skeleton-item variant="text" style="margin-right: 16px" />
                <el-skeleton-item variant="text" style="width: 30%" />
              </div>
            </div>
          </div>
        </div>
      </template>
      <wc-waterfall
        :gap="12"
        :cols="2"
      >
        <DictionaryBookDisplay v-for="book in (selectCategory?.books || [])" :key="book.id" :model-value="book" @click="handleBookClick(book)" />
      </wc-waterfall>
    </el-skeleton>
  </DictionaryHolder>
</template>

<style lang="scss" scoped>
.DictionarySelectPage {
  background-color: var(--el-bg-color);
}
</style>
