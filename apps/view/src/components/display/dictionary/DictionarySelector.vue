<script setup lang="ts">
import { Search } from '@element-plus/icons-vue'
import { useDebounceFn } from '@vueuse/core'
import { ElIcon, ElInput, ElTabPane, ElTabs } from 'element-plus'

// interface IBook {
//   id: string
//   name: string
//   category: 'all' | 'textbook' | 'novel' | 'professional'
//   // 其他书籍属性...
// }

// 书籍数据逻辑(需根据实际数据源调整)
// const books = ref<IBook[]>([]) // 从composables获取
const searchQuery = ref('')
const activeCategory = ref<'all' | 'textbook' | 'novel' | 'professional'>('all')

const categories = [
  { label: '全部', value: 'all' },
  { label: '教材', value: 'textbook' },
  { label: '小说', value: 'novel' },
  { label: '专业书籍', value: 'professional' },
] as const

// const filteredBooks = computed(() => {
//   return books.value.filter((book) => {
//     const matchesSearch = book.name.toLowerCase().includes(searchQuery.value.toLowerCase())
//     const matchesCategory = activeCategory.value === 'all' || book.category === activeCategory.value
//     return matchesSearch && matchesCategory
//   })
// })

const handleSearch = useDebounceFn(() => {
  // 搜索逻辑...
}, 300)

function handleCategoryChange() {
  // 分类切换逻辑...
}

// function handleBookSelect(_book: IBook) {
//   // 书籍选择逻辑...
// }
</script>

<template>
  <div class="dictionary-page">
    <!-- 搜索栏 -->
    <div class="search-bar">
      <ElInput
        v-model="searchQuery"
        placeholder="搜索书籍..."
        clearable
        @input="handleSearch"
      >
        <template #prefix>
          <ElIcon><Search /></ElIcon>
        </template>
      </ElInput>
    </div>

    <!-- 分类切换 -->
    <ElTabs v-model="activeCategory" @tab-change="handleCategoryChange">
      <ElTabPane
        v-for="category in categories"
        :key="category.value"
        :label="category.label"
        :name="category.value"
      />
    </ElTabs>

    <!-- 使用自定义书籍选择器组件 -->
    <!-- <BookSelector :books="filteredBooks" :item-size="80">
      <template #default="{ book }">
        <BookItem :book="book" />
      </template>
    </BookSelector> -->
  </div>
</template>

<style scoped>
.dictionary-page {
  padding: 20px;
  height: 100vh;
  display: flex;
  flex-direction: column;
}
.search-bar {
  margin-bottom: 20px;
}
</style>
