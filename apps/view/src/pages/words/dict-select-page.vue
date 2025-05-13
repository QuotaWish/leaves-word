<script setup lang="ts">
// import WordSelector from '@/components/words/WordSelector.vue'
import { useDebounceFn } from "@vueuse/core";
import { useCategoryTree } from "~/modules/core/dictionary";
import DictionaryHolder from "~/modules/core/dictionary/DictionaryHolder.vue";
// import BookItem from './BookItem.vue'
import { globalPreference } from "~/modules/words/core/feat/preference";
import "wc-waterfall";
import { useRequest } from "alova/client";
import type {
  Category,
  EnglishDictionary,
} from "~/composables/api/clients/globals";

/**
 * Category with books for display.
 */
export interface DisplayCategory extends Category {
  books: EnglishDictionary[];
  children?: DisplayCategory[];
}

defineOptions({
  name: "DictSelect",
});

const route = useRoute();
const router = useRouter();
const bookData = ref<DisplayCategory[]>([]);
const selectCategory = ref<DisplayCategory>();

const type = computed(() => route.query.type);

const { loading, send, onSuccess } = useRequest(() =>
  Apis.englishDictionaryController.listEnglishDictionaryUsingGET(),
);

onSuccess((res) => {
  const result = res.data.data || [];

  bookData.value = useCategoryTree(result).value;

  if (!selectCategory.value) {
    selectCategory.value = bookData.value[0];
  }
});

const searchQuery = ref("");

const handleSearch = useDebounceFn(() => {
  // 搜索逻辑...
}, 300);

function handleSelectCategory(category: DisplayCategory) {
  selectCategory.value = category;
}

function handleBookClick(book: EnglishDictionary) {
  if (type.value === "select") {
    globalPreference.value.dict.id = `${book.id}`;

    router.back();
  } else {
    router.push({
      path: `/dictionary/${book.id}`,
    });
  }
}

onMounted(() => {
  send();
});
</script>

<template>
  <DictionaryHolder
    :empty="!loading && !bookData.length"
    class="DictionarySelectPage"
  >
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
          <el-skeleton-item
            v-for="i in 10"
            :key="i"
            variant="p"
            class="relative left-20% my-2 !w-60%"
          />
        </template>
        <ul h-full class="DictionarySelectPage-Nav">
          <li
            v-for="nav in bookData"
            :key="nav.id"
            :class="{ active: nav.id === selectCategory?.id }"
            text-center
            @click="handleSelectCategory(nav)"
          >
            {{ nav.name }}
          </li>
        </ul>
      </el-skeleton>
    </template>

    <el-skeleton :loading="loading" animated>
      <template #template>
        <div h-full w-full flex flex-wrap items-center justify-between>
          <div v-for="i in 4" :key="i">
            <el-skeleton-item
              variant="image"
              style="width: 120px; height: 120px"
            />
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
      <template v-if="selectCategory?.books?.length">
        <wc-waterfall :gap="12" :cols="2" :key="selectCategory?.id">
          <DictionaryBookDisplay
            :active="String(book.id) === globalPreference.dict.id"
            v-for="book in selectCategory.books"
            :key="book.id"
            :model-value="book"
            @click="handleBookClick(book)"
          />
        </wc-waterfall>
      </template>
      <template v-else-if="!loading">
        <div class="empty-tip">暂无词典</div>
      </template>
    </el-skeleton>
  </DictionaryHolder>
</template>

<style lang="scss" scoped>
.DictionarySelectPage {
  background-color: var(--el-bg-color);
}
</style>
