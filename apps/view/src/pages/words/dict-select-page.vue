<script setup lang="ts">
// import WordSelector from '@/components/words/WordSelector.vue'
import { useDebounceFn } from "@vueuse/core";
import { Book, useCategoryTree } from "~/components/display/dictionary";
import DictionaryHolder from "~/components/display/dictionary/DictionaryHolder.vue";
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
const dictMap = ref(new Map<number, Book>());

const type = computed(() => route.query.type);

const { loading, send, onSuccess } = useRequest(() =>
  Apis.englishDictionaryController.listEnglishDictionaryUsingGET(),
);

onSuccess((res) => {
  const result = res.data.data || [];

  const { categoryTree, dictionaryMap } = useCategoryTree(result);

  bookData.value = categoryTree.value;
  dictMap.value = dictionaryMap.value;

  nextTick(indexNav);
});

function indexNav() {
  const targetDict = dictMap.value.get(+(globalPreference.value.dict.id || 0));
  const firstCategory = targetDict?.categoryList?.[0];
  if (!targetDict || !firstCategory) {
    selectCategory.value = bookData.value[0];
    return;
  }

  const category = bookData.value.find((item) => item.id === firstCategory.id);

  selectCategory.value = category;

  const targetId = `nav-${selectCategory.value?.id}`;
  const target = document.getElementById(targetId);

  if (target) {
    target.scrollIntoView({
      behavior: "smooth",
      block: "nearest",
    });
  }
}

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

async function handleRefresh(callback: Function) {
  /* const res =  */ await send(true);

  callback();
}
</script>

<template>
  <DictionaryHolder
    :empty="!loading && !bookData.length"
    class="DictionarySelectPage"
    @refresh="handleRefresh"
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
          <template v-for="navTag in bookData" :key="navTag.id">
            <li
              v-if="navTag.children?.length"
              :class="{ active: navTag.id === selectCategory?.id }"
              class="DictionarySelectPage-NavTag"
              flex
              items-center
              gap-1
              :id="`nav-${navTag.id!}`"
              @click="handleSelectCategory(navTag)"
            >
              <!-- <div i-carbon-tag /> -->
              <span>{{ navTag.name }}</span>
            </li>
            <!-- <li
              v-for="nav in navTag.children"
              :key="nav.id"
              :id="`nav-${nav.id!}`"
              :class="{ active: nav.id === selectCategory?.id }"
              text-center
              @click="handleSelectCategory(nav)"
            >
              {{ nav.name }}
            </li> -->
          </template>
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
      <template v-if="selectCategory?.children?.length">
        <template
          :key="category.id"
          v-for="category in selectCategory.children"
        >
          <div class="DictionarySelectPage-NavCategoryTag">
            {{ category.name }}
          </div>
          <wc-waterfall :gap="12" :cols="2">
            <DictionaryBookDisplay
              :active="String(book.id) === globalPreference.dict.id"
              v-for="book in category.books"
              :key="book.id"
              :model-value="book"
              @click="handleBookClick(book)"
            />
          </wc-waterfall>

          <br />
        </template>
      </template>
      <template v-else-if="!loading">
        <div class="empty-tip">暂无词典</div>
      </template>
    </el-skeleton>
  </DictionaryHolder>
</template>

<style lang="scss" scoped>
.DictionarySelectPage-NavTag {
}

.DictionarySelectPage-NavCategoryTag {
  &::before {
    content: "";
    position: absolute;

    top: 15%;
    left: 0;

    width: 5px;
    height: 70%;

    transition: 0.25s;
    transform: scale(1);
    border-radius: 10px 10px;
    background-color: var(--theme-color-primary);
  }
  position: relative;
  margin: 0.5rem 0;
  padding-left: 0.5rem;
}
</style>
