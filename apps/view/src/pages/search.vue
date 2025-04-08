<script setup lang="ts">
import { ref } from 'vue'
// import { Search, VideoPlay } from '@element-plus/icons-vue'
import PageNavHolder from '~/components/page/holder/PageNavHolder.vue'
import { mockSearchResults, type SearchResult } from '~/mock/mock-search'

defineOptions({
  name: 'SearchPage',
})

const searchQuery = ref('')
const searchResults = ref<SearchResult[]>([])
const searchType = ref<'all' | 'word' | 'phrase' | 'sentence' | 'subtitle'>('all')
const isSearching = ref(false)
const showAIAnalysis = ref(true)

const searchTypes = [
  { label: '全部', value: 'all' },
  { label: '单词', value: 'word' },
  { label: '短语', value: 'phrase' },
  { label: '句子', value: 'sentence' },
  { label: '字幕', value: 'subtitle' },
]

function handleSearch() {
  isSearching.value = true
  setTimeout(() => {
    searchResults.value = mockSearchResults.filter(result =>
      searchType.value === 'all' || result.type === searchType.value,
    )
    isSearching.value = false
  }, 500)
}

function getTagColor(tag: string) {
  const colors: Record<string, string> = {
    AI: '#409EFF',
    technology: '#67C23A',
    business: '#E6A23C',
    education: '#F56C6C',
    learning: '#909399',
  }
  return colors[tag] || '#909399'
}
</script>

<template>
  <PageNavHolder :content-padding="false" title="AI智能词典">
    <div class="min-h-screen w-full bg-[#111827] text-white">
      <!-- 顶部AI元素装饰 -->
      <div class="absolute inset-x-0 top-0 h-40 overflow-hidden">
        <div class="absolute inset-0 from-blue-500/20 to-transparent bg-gradient-to-b" />
        <div class="ai-pattern absolute inset-0 opacity-20" />
      </div>

      <div class="relative mx-auto max-w-7xl px-4 py-6 lg:px-8 md:px-6">
        <!-- 搜索区域 -->
        <div class="mb-8 flex flex-col items-center justify-center pt-6">
          <div class="ai-glow mb-6 text-center">
            <h1 class="from-blue-400 via-purple-400 to-indigo-500 bg-gradient-to-r bg-clip-text text-3xl text-transparent font-bold md:text-4xl">
              Words meet AI
            </h1>
            <p class="mt-2 text-sm text-blue-300/80">
              智能解析语言 · 深度理解语境 · AI增强学习
            </p>
          </div>

          <div class="max-w-2xl w-full">
            <div class="search-container group relative overflow-hidden rounded-2xl backdrop-blur-lg transition-all duration-300">
              <!-- 搜索框背景 -->
              <div class="absolute inset-0 from-blue-900/40 to-indigo-900/40 bg-gradient-to-r opacity-80" />
              <div class="search-glow absolute rounded-2xl from-blue-500/30 to-indigo-500/30 bg-gradient-to-r opacity-0 blur transition-opacity duration-500 -inset-1 group-hover:opacity-100" />

              <!-- 搜索框内容 -->
              <div class="relative z-10 p-4">
                <div class="flex items-center gap-2 rounded-xl bg-white/10 p-2 backdrop-blur-md">
                  <span class="ml-2 text-blue-300">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                      <path stroke-linecap="round" stroke-linejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                  </span>
                  <input
                    v-model="searchQuery"
                    type="text"
                    placeholder="搜索单词、短语或语境..."
                    class="flex-1 bg-transparent py-2 text-white outline-none placeholder-blue-300/70"
                    @keyup.enter="handleSearch"
                  >
                  <button
                    class="flex items-center gap-1 rounded-lg from-blue-600 to-indigo-600 bg-gradient-to-r px-4 py-2 text-sm text-white font-medium transition-all hover:from-blue-500 hover:to-indigo-500"
                    :class="{ 'opacity-75': isSearching }"
                    @click="handleSearch"
                  >
                    <span v-if="isSearching" class="loader h-4 w-4" />
                    <span>{{ isSearching ? '搜索中' : '搜索' }}</span>
                  </button>
                </div>

                <div class="mt-3 flex justify-center overflow-x-auto pb-1 space-x-2">
                  <button
                    v-for="type in searchTypes"
                    :key="type.value"
                    class="rounded-full px-3 py-1 text-xs transition-all"
                    :class="searchType === type.value
                      ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white'
                      : 'bg-white/10 text-blue-200 hover:bg-white/20'"
                    @click="searchType = type.value"
                  >
                    {{ type.label }}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- AI助手提示 -->
        <div v-if="!searchResults.length && !searchQuery" class="mx-auto mb-8 max-w-xl rounded-xl from-blue-900/20 to-indigo-900/20 bg-gradient-to-r p-4 backdrop-blur-sm">
          <div class="flex items-start gap-3">
            <div class="h-10 w-10 flex items-center justify-center rounded-full from-blue-500 to-indigo-500 bg-gradient-to-r">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-white" viewBox="0 0 24 24" fill="none">
                <path d="M12 16.01V16M12 8V12M12 21C16.9706 21 21 16.9706 21 12C21 7.02944 16.9706 3 12 3C7.02944 3 3 7.02944 3 12C3 16.9706 7.02944 21 12 21Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
              </svg>
            </div>
            <div>
              <p class="text-sm text-blue-100">
                AI词典能够：
              </p>
              <ul class="mt-1 list-disc pl-5 text-xs text-blue-300/90">
                <li>智能解析单词含义和用法</li>
                <li>分析语境和语法结构</li>
                <li>提供深度的AI语言学分析</li>
                <li>推荐相关词汇和表达方式</li>
              </ul>
            </div>
          </div>
        </div>

        <!-- 搜索结果 -->
        <div class="space-y-4">
          <TransitionGroup
            name="list"
            tag="div"
            class="space-y-4"
          >
            <div
              v-for="(result, index) in searchResults"
              :key="index"
              class="group relative overflow-hidden rounded-xl from-gray-900/90 to-gray-800/90 bg-gradient-to-r p-4 backdrop-blur-lg transition-all duration-300"
            >
              <!-- 结果卡片光晕效果 -->
              <div class="card-glow absolute rounded-xl from-blue-500/10 to-indigo-500/10 bg-gradient-to-r opacity-0 transition-opacity duration-500 -inset-px group-hover:opacity-100" />

              <div class="relative z-10">
                <div class="flex items-start justify-between gap-4">
                  <h2 class="text-xl text-blue-100 font-medium">
                    {{ result.content }}
                  </h2>
                  <div v-if="result.pronunciation" class="flex items-center text-sm text-gray-400 space-x-2">
                    <span>{{ result.pronunciation }}</span>
                    <button class="h-7 w-7 flex items-center justify-center rounded-full bg-blue-900/50 text-blue-300 transition-colors hover:bg-blue-800/60">
                      <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                        <path stroke-linecap="round" stroke-linejoin="round" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </button>
                  </div>
                </div>

                <div class="mt-2 text-lg text-blue-200">
                  {{ result.translation }}
                </div>

                <div v-if="result.examples?.length" class="mt-4 space-y-2">
                  <div class="text-sm text-gray-400 font-medium">
                    例句
                  </div>
                  <div v-for="(example, i) in result.examples" :key="i" class="border-l-2 border-blue-800 pl-4 text-gray-300">
                    {{ example }}
                  </div>
                </div>

                <div v-if="showAIAnalysis && result.aiAnalysis" class="mt-4 rounded-lg from-blue-900/40 to-indigo-900/40 bg-gradient-to-r p-4">
                  <div class="mb-2 flex items-center gap-2">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 text-blue-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                      <path stroke-linecap="round" stroke-linejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                    <div class="text-sm text-blue-400 font-medium">
                      AI 智能分析
                    </div>
                  </div>
                  <p class="text-sm text-blue-100/90">
                    {{ result.aiAnalysis }}
                  </p>
                </div>

                <div v-if="result.tags?.length" class="mt-4 flex flex-wrap gap-2">
                  <span
                    v-for="tag in result.tags"
                    :key="tag"
                    class="rounded-full bg-blue-900/50 px-2 py-0.5 text-xs text-blue-300"
                  >
                    {{ tag }}
                  </span>
                </div>
              </div>
            </div>
          </TransitionGroup>
        </div>

        <div v-if="searchQuery && !isSearching && !searchResults.length" class="mt-12 text-center">
          <div class="mx-auto mb-4 h-16 w-16 flex items-center justify-center rounded-full bg-blue-900/40">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8 text-blue-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <p class="text-blue-300">
            暂无搜索结果
          </p>
          <p class="mt-1 text-sm text-blue-400/70">
            试试其他关键词或不同的搜索类型
          </p>
        </div>
      </div>
    </div>
  </PageNavHolder>
</template>

<style>
/* 自定义动画效果 */
.list-enter-active,
.list-leave-active {
  transition: all 0.4s ease;
}

.list-enter-from {
  opacity: 0;
  transform: translateY(30px);
}

.list-leave-to {
  opacity: 0;
  transform: translateY(-30px);
}

/* AI元素装饰 */
.ai-pattern {
  background-image: url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%234f46e5' fill-opacity='0.2'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E");
}

.ai-glow {
  animation: pulse 3s infinite alternate;
}

@keyframes pulse {
  0% {
    filter: drop-shadow(0 0 1px rgba(96, 165, 250, 0.3));
  }
  100% {
    filter: drop-shadow(0 0 8px rgba(96, 165, 250, 0.6));
  }
}

/* 搜索加载动画 */
.loader {
  border: 2px solid transparent;
  border-top-color: currentColor;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

/* 卡片呼吸效果 */
.card-glow {
  animation: cardPulse 4s infinite alternate;
}

@keyframes cardPulse {
  0% {
    opacity: 0;
  }
  100% {
    opacity: 0.2;
  }
}

/* 搜索栏光晕效果 */
.search-glow {
  animation: searchGlow 2s infinite alternate;
}

@keyframes searchGlow {
  0% {
    opacity: 0;
    filter: blur(10px);
  }
  100% {
    opacity: 0.5;
    filter: blur(20px);
  }
}
</style>
