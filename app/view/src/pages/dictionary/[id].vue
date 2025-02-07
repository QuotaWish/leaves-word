<script setup lang="ts">
import { ElMessage } from 'element-plus'
import { Tab, Tabs } from 'vant'
import { getEnglishDictionaryVoByIdUsingGet } from '~/composables/api/clients/api/englishDictionaryController'

defineOptions({
  name: 'DictionaryPage',
})

const route = useRoute('/dictionary/[id]')
const loading = ref(false)
const dict = ref<API.EnglishDictionaryVO>()
const router = useRouter()
const active = ref(0)
const showDetailsDialog = ref(false)

const featureCards = [
  {
    title: '单词学习',
    desc: '智能规划学习进度',
    icon: 'i-carbon-3d-print-mesh',
    decorationIcon: 'i-carbon-book-knowledge',
    gradient: 'from-blue-500/20 to-cyan-500/20',
    colors: ['#3B82F6', '#06B6D4'],
    action: '开始学习',
    onClick: (dictId: number | undefined) => dictId && router.push(`/words/dict-select-page?dictId=${dictId}`),
  },
  {
    title: '听力训练',
    desc: '提升听力理解能力',
    icon: 'i-carbon-headphones',
    decorationIcon: 'i-carbon-music',
    gradient: 'from-violet-500/20 to-fuchsia-500/20',
    colors: ['#8B5CF6', '#D946EF'],
    action: '开始练习',
  },
  {
    title: '发音练习',
    desc: 'AI 语音纠正发音',
    icon: 'i-carbon-microphone',
    decorationIcon: 'i-carbon-sound-max',
    gradient: 'from-rose-500/20 to-pink-500/20',
    colors: ['#F43F5E', '#EC4899'],
    action: '开始练习',
  },
  {
    title: '阅读理解',
    desc: '场景化提升应用',
    icon: 'i-carbon-book',
    decorationIcon: 'i-carbon-document-multiple',
    gradient: 'from-teal-500/20 to-emerald-500/20',
    colors: ['#14B8A6', '#10B981'],
    action: '开始阅读',
  },
  {
    title: '词汇测试',
    desc: '全方位测试效果',
    icon: 'i-carbon-exam-mode',
    decorationIcon: 'i-carbon-task',
    gradient: 'from-amber-500/20 to-orange-500/20',
    colors: ['#F59E0B', '#F97316'],
    action: '开始测试',
  },
  {
    title: '学习统计',
    desc: '可视化学习历程',
    icon: 'i-carbon-analytics',
    decorationIcon: 'i-carbon-chart-line',
    gradient: 'from-indigo-500/20 to-purple-500/20',
    colors: ['#6366F1', '#9333EA'],
    action: '查看统计',
  },
]

async function fetchDictionaryData() {
  loading.value = true

  const { code, data } = await getEnglishDictionaryVoByIdUsingGet({
    id: route.params.id,
  })

  if (code !== 0) {
    ElMessage.error('获取字典数据失败')

    router.back()

    return
  }

  dict.value = data

  loading.value = false
}

watch(() => route.params.id, fetchDictionaryData, { immediate: true })
</script>

<template>
  <PageNavHolder :loading="loading" title="词典">
    <div v-if="dict" class="dictionary-container">
      <!-- 顶部信息区域 -->
      <div class="info-section mb-3 rounded-lg bg-white">
        <div class="flex items-center gap-4">
          <div class="relative w-[100px] flex-shrink-0">
            <DictionaryBookDisplay only-image :border="false" :model-value="dict" />
          </div>
          <div class="min-w-0 flex-1">
            <h1 class="mb-2 truncate text-lg text-gray-900 font-bold">
              {{ dict.name }}
            </h1>
            <div class="relative text-sm text-gray-600">
              <MultiTextDisplay :custom-click="() => showDetailsDialog = true">
                {{ dict.description }}
              </MultiTextDisplay>
            </div>
          </div>
        </div>
      </div>

      <!-- 标签页 -->
      <div class="rounded-lg bg-white">
        <Tabs v-model:active="active" sticky>
          <Tab title="学习">
            <div class="p-4">
              <div class="grid grid-cols-1 gap-6 lg:grid-cols-2 sm:grid-cols-2">
                <CardDisplay
                  v-for="card in featureCards" :key="card.title" class="feature-card bg-gradient-to-br"
                  :class="card.gradient" :colors="card.colors" @click="card.onClick?.(dict?.id)"
                >
                  <template #icon>
                    <div :class="card.icon" />
                  </template>
                  <template #header>
                    <div flex items-center>
                      <h3>
                        {{ card.title }}
                      </h3>
                    </div>
                  </template>
                  <div class="card-content">
                    <div class="text-content">
                      <p class="feature-desc line-clamp-2 text-xs text-gray-600">
                        {{ card.desc }}
                      </p>
                    </div>
                    <div class="action-area">
                      <button class="rounded-full px-3 py-1 text-xs text-white" :style="{ background: `linear-gradient(to right, ${card.colors[0]}, ${card.colors[1]})` }">
                        {{ card.action }}
                      </button>
                    </div>
                  </div>
                </CardDisplay>
              </div>
            </div>
          </Tab>

          <Tab title="统计">
            <div class="p-4">
              <div class="border border-gray-100 rounded-lg p-4">
                <p class="text-sm text-gray-500">
                  学习统计信息展示区域
                </p>
              </div>
            </div>
          </Tab>

          <Tab title="词表">
            <div class="p-4">
              <div class="border border-gray-100 rounded-lg p-4">
                <p class="text-sm text-gray-500">
                  词表内容展示区域
                </p>
              </div>
            </div>
          </Tab>

          <Tab title="词典属性">
            <div class="p-4">
              <div class="space-y-3">
                <div v-if="dict.publisher" class="info-item">
                  <span class="info-label">出版社</span>
                  <span class="info-value">{{ dict.publisher }}</span>
                </div>
                <div v-if="dict.publication_date" class="info-item">
                  <span class="info-label">出版日期</span>
                  <span class="info-value">{{ dict.publication_date }}</span>
                </div>
                <div v-if="dict.isbn" class="info-item">
                  <span class="info-label">ISBN</span>
                  <span class="info-value">{{ dict.isbn }}</span>
                </div>
              </div>
            </div>
          </Tab>
        </Tabs>
      </div>
    </div>

    <!-- 详情弹窗 -->
    <el-dialog v-model="showDetailsDialog" title="详细介绍" width="90%" max-width="600px">
      <div class="whitespace-pre-wrap text-sm text-gray-700 leading-relaxed">
        {{ dict?.description }}
      </div>
    </el-dialog>
  </PageNavHolder>
</template>

<style lang="scss" scoped>
.action-area {
  margin-top: 0.5rem;
}

.feature-desc {
  margin-bottom: 0.5rem;
}
</style>
