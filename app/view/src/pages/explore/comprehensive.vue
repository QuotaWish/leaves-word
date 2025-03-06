<script setup lang="ts">
import { Card } from 'vant'
import ComprehensiveHolder from '~/modules/explore/comprehensive/ComprehensiveHolder.vue'

const searchQuery = ref('')

function handleSearch() {}

const selectCategoryId = ref(0)
const category = ['全部', '高考词汇', '大学精选', '四级核心', '六级核心', '雅思', 'BEC']
// const bookData = ref(category.map(item => ({ id: Math.random(), name: item })))
</script>

<template>
  <ComprehensiveHolder class="ComprehensivePage">
    <template #header>
      <SearchBar
        v-model="searchQuery"
        placeholder="搜索词典/书籍/教材"
        class="search-bar__input"
        @input="handleSearch"
      />
    </template>

    <template #nav>
      <ul h-full class="ComprehensiveSelectPage-Nav">
        <li v-for="(nav, index) in category" :key="index" :class="{ active: index === selectCategoryId }" text-center @click="selectCategoryId = index">
          {{ nav }}
        </li>
      </ul>
    </template>

    <div class="ComprehensivePage-Content">
      <Card v-for="i in 10" :key="i" num="1" price="0.00" desc="英语真题试卷" title="英语真题" thumb="/pdf/BEC.png" />
    </div>
  </ComprehensiveHolder>
</template>

<style lang="scss">
.ComprehensivePage-Content {
  .van-card {
    border-radius: 18px;
  }

  flex: 1;

  --van-card-text-color: var(--el-text-color-primary);
  --van-card-price-color: var(--el-text-color-secondary);
  --van-card-background: var(--el-fill-color-light);
}

// .ComprehensivePage-Main {
//   div.van-sidebar {
//     div {
//       color: var(--el-text-color-primary) !important;
//     }
//     position: sticky;

//     top: 46px;

//     width: 100px;
//     // height: 100%;

//     --van-sidebar-selected-background: var(--el-bg-color) !important;
//     --van-sidebar-background: var(--el-bg-color) !important;
//   }
//   position: relative;
//   display: flex;

//   min-height: 100%;
// }
</style>
