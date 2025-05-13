<script setup lang="ts">
// import { getEnglishDictionaryVoByIdUsingGet } from '~/composables/api/clients/api/englishDictionaryController'
import type { EnglishDictionaryVO } from "~/composables/api/clients/globals";
import { useRequest } from "alova/client";
import { Tab, Tabs } from "vant";

import { Book, BookCover } from "~/components/inspira/book";

defineOptions({
  name: "DictionaryPage",
});

const route = useRoute("/dictionary/[id]");
const dict = ref<EnglishDictionaryVO>();
const router = useRouter();
const active = ref(+(route.query.tab as string));
const showDetailsDialog = ref(false);

const { loading, send, onSuccess, onError } = useRequest(() =>
  Apis.englishDictionaryController.getEnglishDictionaryVOByIdUsingGET({
    params: { id: route.params.id },
  }),
);

onSuccess((res) => {
  if (res?.data?.data) dict.value = res.data.data;
});

onError(() => {
  router.back();
});

const featureCards = [
  {
    title: "单词学习",
    desc: "智能规划学习进度",
    icon: "i-carbon-3d-print-mesh",
    decorationIcon: "i-carbon-book-knowledge",
    gradient: "from-blue-500/20 to-cyan-500/20",
    colors: ["#3B82F6", "#06B6D4"],
    action: "开始学习",
    onClick: (dictId: number | undefined) =>
      dictId && router.push(`/words/dict-select-page?dictId=${dictId}`),
  },
  {
    title: "听力训练",
    desc: "提升听力理解能力",
    icon: "i-carbon-headphones",
    decorationIcon: "i-carbon-music",
    gradient: "from-violet-500/20 to-fuchsia-500/20",
    colors: ["#8B5CF6", "#D946EF"],
    action: "开始练习",
  },
  {
    title: "发音练习",
    desc: "AI 语音纠正发音",
    icon: "i-carbon-microphone",
    decorationIcon: "i-carbon-sound-max",
    gradient: "from-rose-500/20 to-pink-500/20",
    colors: ["#F43F5E", "#EC4899"],
    action: "开始练习",
  },
  {
    title: "阅读理解",
    desc: "场景化提升应用",
    icon: "i-carbon-book",
    decorationIcon: "i-carbon-document-multiple",
    gradient: "from-teal-500/20 to-emerald-500/20",
    colors: ["#14B8A6", "#10B981"],
    action: "开始阅读",
  },
  {
    title: "词汇测试",
    desc: "全方位测试效果",
    icon: "i-carbon-exam-mode",
    decorationIcon: "i-carbon-task",
    gradient: "from-amber-500/20 to-orange-500/20",
    colors: ["#F59E0B", "#F97316"],
    action: "开始测试",
  },
  {
    title: "学习统计",
    desc: "可视化学习历程",
    icon: "i-carbon-analytics",
    decorationIcon: "i-carbon-chart-line",
    gradient: "from-indigo-500/20 to-purple-500/20",
    colors: ["#6366F1", "#9333EA"],
    action: "查看统计",
  },
];

watch(
  () => route.params.id,
  (id) => {
    if (id) send();
  },
  { immediate: true },
);

watch(active, () => {
  router.replace({
    query: {
      tab: active.value,
    },
  });
});
</script>

<template>
  <FullScrollPage :content-padding="false" :loading="loading" title="词典">
    <template #action>
      <el-button type="info" link>反馈</el-button>
    </template>

    <div v-if="dict" class="DictionaryInfo-Cover py-4">
      <Book autoAnimate size="mini">
        <BookCover>
          <img
            class="w-full h-full object-cover"
            :alt="dict.name"
            :src="dict?.image_url"
          />
        </BookCover>
      </Book>

      <p>{{ dict.name }}</p>

      <div
        w-full
        flex
        justify-between
        gap-2
        px-4
        class="DictionaryInfo-Cover-Info"
      >
        <div>
          <p><span text-lg>5.0</span> 热度</p>
          <div flex items-center gap-1 text-sm op-75>
            <span>排行榜前10</span>
            <div i-carbon-chevron-right />
          </div>
        </div>
        <div>
          <p><span text-lg>1,198</span> 万人</p>
          <div flex items-center gap-1 text-sm op-75>
            <span>正在使用</span>
            <div i-carbon-chevron-right />
          </div>
        </div>
        <div>
          <p>
            <span text-lg>{{ dict.approved_words }}</span> 单词
          </p>
          <div flex items-center gap-1 text-sm op-75>
            <span>{{ formatTimeAgo(dict.update_time!) }}前更新</span>
            <div i-carbon-chevron-right />
          </div>
        </div>
      </div>

      <div class="DictionaryInfo-Desc px-4">
        <div text-lg font-bold>简介</div>
        <p line-clamp-3 @click="showDetailsDialog = true">
          <MultiTextDisplay :custom-click="() => (showDetailsDialog = true)">
            {{ dict.description }}
          </MultiTextDisplay>
        </p>
      </div>

      <div class="DictionaryInfo-Comment w-full px-4">
        <div text-lg font-bold>专家点评</div>
        <p>暂无</p>
      </div>

      <div
        class="DictionaryInfo-Slider text-sm op-50 flex items-center gap-2 absolute bottom-4"
      >
        <div i-carbon-chevron-right class="rotate-[-90deg]" />
        向上滑动继续查看词典信息
      </div>
    </div>

    <div v-if="dict" class="DictionaryInfo-Container fake-background">
      <div class="rounded-lg">
        <Tabs v-model:active="active" sticky>
          <Tab title="学习">
            <div class="p-4">
              <div class="grid grid-cols-1 gap-6 lg:grid-cols-2 sm:grid-cols-2">
                <CardDisplay
                  v-for="card in featureCards"
                  :key="card.title"
                  class="feature-card bg-gradient-to-br"
                  :class="card.gradient"
                  :colors="card.colors"
                  @click="card.onClick?.(dict?.id)"
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
                      <p
                        class="feature-desc line-clamp-2 text-xs text-[color:var(--el-text-color-secondary)]"
                      >
                        {{ card.desc }}
                      </p>
                    </div>
                    <div class="action-area">
                      <button
                        class="rounded-full px-3 py-2 text-xs text-white font-medium"
                        :style="{
                          background: `linear-gradient(to right, ${card.colors[0]}, ${card.colors[1]})`,
                        }"
                      >
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
                <p class="text-sm text-gray-500">学习统计信息展示区域</p>
              </div>
            </div>
          </Tab>

          <Tab title="词表">
            <DictionaryWord :dict="dict" />
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
    <el-dialog
      v-model="showDetailsDialog"
      title="详细介绍"
      width="90%"
      max-width="600px"
    >
      <div class="whitespace-pre-wrap text-sm text-gray-700 leading-relaxed">
        {{ dict?.description }}
      </div>
    </el-dialog>
  </FullScrollPage>
</template>

<style lang="scss" scoped>
.DictionaryInfo-Cover {
  > p {
    font-size: 22px;
    font-weight: 500;
  }

  position: relative;
  display: flex;

  width: 100%;
  height: 100%;

  top: 0;
  left: 0;

  gap: 2rem;
  align-items: center;
  flex-direction: column;
  // justify-content: center;
}

.DictionaryInfo-Container {
  :deep(.van-tabs__nav) {
    span {
      color: var(--el-text-color-primary) !important;
    }

    background-color: var(--el-fill-color) !important;
  }

  position: relative;

  height: 100%;

  backdrop-filter: blur(18px) saturate(180%);
}
</style>
