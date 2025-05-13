<script setup>
import VersionBar from "~/components/chore/VersionBar.vue";
import { globalAuthStorage } from "~/modules/auth";
import { useDevMode } from "~/modules/develop";
import { calendarManager } from "~/modules/words";
import PersonalHeaderDisplay from "./PersonalHeaderDisplay.vue";
import PersonalLayout from "./PersonalLayout.vue";

const router = useRouter();
const { devModeEnabled, toggleDevMode } = useDevMode();

// 添加用户名计算属性
const userName = computed(
  () =>
    globalAuthStorage.value?.user?.userName ||
    `#${globalAuthStorage.value?.user?.id}`,
);

const clickCount = ref(0);
const lastClickTime = ref(0);

function handleVersionClick() {
  const now = Date.now();

  // 如果两次点击间隔超过1.5秒，重置计数
  if (now - lastClickTime.value > 1500) {
    clickCount.value = 0;
  }

  lastClickTime.value = now;
  clickCount.value++;

  // 连续点击7次后启用开发者模式
  if (clickCount.value === 7) {
    toggleDevMode(true);
    clickCount.value = 0;
    // eslint-disable-next-line no-alert
    alert("开发者模式已启用");
  }
}

async function handleClear() {
  calendarManager.clear();

  await useRequestAnimationFrame();

  // eslint-disable-next-line no-alert
  alert("已清除打卡数据");
}

// 模拟AI分析数据
const aiAnalysisData = ref({
  wordCount: 12453,
  favoriteCategory: "商务英语",
  progress: 76,
  consistencyScore: 92,
  wordFrequency: [
    { word: "Innovation", count: 124 },
    { word: "Development", count: 98 },
    { word: "Strategy", count: 85 },
    { word: "Analysis", count: 71 },
    { word: "Professional", count: 68 },
  ],
  studyTime: {
    morning: 35,
    afternoon: 25,
    evening: 40,
  },
  learningStyle: {
    visual: 85,
    auditory: 45,
    reading: 65,
  },
});

// 模拟学习建议
const studySuggestions = ref([
  "尝试在早晨学习，数据显示您在早晨时段的记忆效果最佳",
  "多进行真实英语对话练习，提高口语能力",
  "使用间隔重复技术复习词汇，增强长期记忆",
]);

// 模拟AI预测
const nextWeekPrediction = ref({
  topicSuggestion: "环境类词汇",
  bestStudyDay: "星期三",
  estimatedWords: 250,
  completion: 85,
});
</script>

<template>
  <PersonalLayout>
    <template #header>
      <PersonalHeaderDisplay>
        <div
          v-if="globalAuthStorage.user"
          h-full
          w-full
          flex
          items-center
          justify-between
          px-2
        >
          <div flex items-center gap-4 class="header-main">
            <div class="header-img">
              <UserAvatar />
            </div>
            <div flex flex-col justify-center class="header-content">
              <p font-size-5 font-bold class="name">
                {{ userName }}
              </p>
              <p class="indent-[2px]" font-size-4 op-60>英语学习，随时随地</p>
            </div>
          </div>

          <div
            flex
            justify-end
            font-size-6
            class="header-line"
            @click="$router.push('/personal/edit')"
          >
            <div i-ri:edit-2-fill class="cursor-pointer" />
          </div>
        </div>
      </PersonalHeaderDisplay>
    </template>
    <template #main>
      <div w-full flex flex-1 flex-col items-center justify-center>
        <!-- <SignCalendar my-1 /> -->
        <SignCalendarMonthly my-4 />

        <!-- AI学习风格分析卡片 -->
        <div class="ai-analysis-card">
          <div class="ai-card-header">
            <div class="ai-icon">
              <div i-carbon:machine-learning-model />
            </div>
            <div class="ai-title">学习风格分析</div>
          </div>
          <div class="ai-card-content">
            <div class="learning-style">
              <div class="style-item">
                <div class="style-label">视觉学习</div>
                <div class="style-bar">
                  <div
                    class="style-fill"
                    :style="`width: ${aiAnalysisData.learningStyle.visual}%`"
                  ></div>
                </div>
                <div class="style-value">
                  {{ aiAnalysisData.learningStyle.visual }}%
                </div>
              </div>
              <div class="style-item">
                <div class="style-label">听觉学习</div>
                <div class="style-bar">
                  <div
                    class="style-fill"
                    :style="`width: ${aiAnalysisData.learningStyle.auditory}%`"
                  ></div>
                </div>
                <div class="style-value">
                  {{ aiAnalysisData.learningStyle.auditory }}%
                </div>
              </div>
              <div class="style-item">
                <div class="style-label">阅读学习</div>
                <div class="style-bar">
                  <div
                    class="style-fill"
                    :style="`width: ${aiAnalysisData.learningStyle.reading}%`"
                  ></div>
                </div>
                <div class="style-value">
                  {{ aiAnalysisData.learningStyle.reading }}%
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- AI数据分析卡片 -->
        <div class="ai-analysis-card">
          <div class="ai-card-header">
            <div class="ai-icon">
              <div i-carbon:chart-evaluation />
            </div>
            <div class="ai-title">学习数据分析</div>
          </div>
          <div class="ai-card-content">
            <div class="ai-stat-row">
              <div class="ai-stat">
                <div class="stat-value">
                  {{ aiAnalysisData.wordCount }}
                </div>
                <div class="stat-label">已学单词</div>
              </div>
              <div class="ai-stat">
                <div class="stat-value">{{ aiAnalysisData.progress }}%</div>
                <div class="stat-label">完成度</div>
              </div>
              <div class="ai-stat">
                <div class="stat-value">
                  {{ aiAnalysisData.consistencyScore }}
                </div>
                <div class="stat-label">连贯性</div>
              </div>
            </div>

            <div class="ai-graph">
              <div class="graph-title">学习时段分布</div>
              <div class="time-distribution">
                <div class="time-bar">
                  <div
                    class="time-segment morning"
                    :style="`width: ${aiAnalysisData.studyTime.morning}%`"
                  ></div>
                  <div
                    class="time-segment afternoon"
                    :style="`width: ${aiAnalysisData.studyTime.afternoon}%`"
                  ></div>
                  <div
                    class="time-segment evening"
                    :style="`width: ${aiAnalysisData.studyTime.evening}%`"
                  ></div>
                </div>
                <div class="time-labels">
                  <span>早晨</span>
                  <span>下午</span>
                  <span>晚上</span>
                </div>
              </div>
            </div>

            <div class="word-frequency">
              <div class="graph-title">常用词汇</div>
              <div class="word-tags">
                <span
                  v-for="item in aiAnalysisData.wordFrequency"
                  :key="item.word"
                  class="word-tag"
                  :style="`font-size: ${Math.max(12, 12 + item.count / 20)}px`"
                >
                  {{ item.word }}
                </span>
              </div>
            </div>
          </div>
        </div>

        <!-- AI学习建议 -->
        <div class="ai-suggestions-card">
          <div class="ai-card-header">
            <div class="ai-icon">
              <div i-carbon:idea />
            </div>
            <div class="ai-title">学习建议</div>
          </div>
          <div class="ai-card-content">
            <ul class="suggestion-list">
              <li v-for="(suggestion, index) in studySuggestions" :key="index">
                {{ suggestion }}
              </li>
            </ul>
          </div>
        </div>

        <!-- 下周预测 -->
        <div class="ai-prediction-card">
          <div class="ai-card-header">
            <div class="ai-icon">
              <div i-carbon:forecast-lightning />
            </div>
            <div class="ai-title">下周预测</div>
          </div>
          <div class="ai-card-content">
            <div class="prediction-item">
              <div class="prediction-label">建议主题:</div>
              <div class="prediction-value">
                {{ nextWeekPrediction.topicSuggestion }}
              </div>
            </div>
            <div class="prediction-item">
              <div class="prediction-label">最佳学习日:</div>
              <div class="prediction-value">
                {{ nextWeekPrediction.bestStudyDay }}
              </div>
            </div>
            <div class="prediction-item">
              <div class="prediction-label">预计词汇量:</div>
              <div class="prediction-value">
                {{ nextWeekPrediction.estimatedWords }}
              </div>
            </div>
            <div class="prediction-item">
              <div class="prediction-label">完成度预测:</div>
              <div class="prediction-value">
                {{ nextWeekPrediction.completion }}%
              </div>
            </div>
          </div>
        </div>

        <div w-full flex flex-col gap-3>
          <LineArrow @click="router.push('/personal/settings')">
            <template #icon>
              <div i-carbon:paint-brush />
            </template>
            个性化设置
          </LineArrow>

          <LineArrow @click="handleClear">
            <template #icon>
              <div i-carbon:help />
            </template>
            帮助与反馈
          </LineArrow>
        </div>
      </div>
    </template>

    <template #footer>
      <p class="select-none" @click="handleVersionClick">
        <VersionBar />
      </p>
      <p font-size-3 class="select-none">Powered by QuotaWish.</p>
    </template>
  </PersonalLayout>
</template>

<style lang="scss" scoped>
.personal-header {
  min-height: 80px;
}
</style>

<style lang="scss">
.header-img {
  img {
    width: 48px;
    height: 48px;

    border-radius: 50%;
  }

  display: flex;

  width: 52px;
  height: 52px;

  align-items: center;
  justify-content: center;

  border-radius: 50%;
  box-shadow: var(--el-box-shadow);
  background-color: var(--el-text-color-primary);

  .light & {
    background-color: #fff;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.08);
  }
}

// AI分析卡片样式
.ai-analysis-card,
.ai-suggestions-card,
.ai-prediction-card {
  border-radius: 16px;
  background: var(--el-bg-color);
  // border: 1px solid var(--el-border-color);
  margin-bottom: 1rem;
  overflow: hidden;

  width: 100%;
}

.ai-card-header {
  display: flex;
  align-items: center;
  padding: 12px 16px;
  background: rgba(var(--theme-color-rgb), 0.15);
  border-bottom: 1px solid rgba(255, 255, 255, 0.08);

  .light & {
    background: rgba(var(--theme-color-rgb), 0.03);
    border-bottom: 1px solid rgba(0, 0, 0, 0.03);
  }

  .ai-icon {
    width: 20px;
    height: 20px;
    margin-right: 10px;
    color: var(--theme-color-primary);
  }

  .ai-title {
    font-size: 16px;
    font-weight: 500;

    .light & {
      color: var(--el-text-color-primary);
    }
  }
}

.ai-card-content {
  padding: 16px;

  .light & {
    color: var(--el-text-color-primary);
  }
}

// 学习风格分析
.learning-style {
  .style-item {
    display: flex;
    align-items: center;
    margin-bottom: 12px;

    .style-label {
      width: 70px;
      font-size: 14px;
      opacity: 0.8;

      .light & {
        color: var(--el-text-color-primary);
        opacity: 0.9;
      }
    }

    .style-bar {
      flex: 1;
      height: 8px;
      background: rgba(255, 255, 255, 0.1);
      border-radius: 4px;
      overflow: hidden;
      margin: 0 10px;

      .light & {
        background: rgba(0, 0, 0, 0.05);
      }

      .style-fill {
        height: 100%;
        background: linear-gradient(
          to right,
          var(--theme-color-primary),
          var(--theme-color-light)
        );
        border-radius: 4px;

        .light & {
          background: var(--theme-color);
        }
      }
    }

    .style-value {
      width: 40px;
      font-size: 14px;
      font-weight: 500;
      text-align: right;

      .light & {
        color: var(--el-text-color-primary);
      }
    }

    &:last-child {
      margin-bottom: 0;
    }
  }
}

// 数据统计行
.ai-stat-row {
  display: flex;
  justify-content: space-between;
  margin-bottom: 20px;
}

.ai-stat {
  text-align: center;
  flex: 1;

  .stat-value {
    font-size: 20px;
    font-weight: 600;
    background: linear-gradient(
      to right,
      var(--theme-color-primary),
      var(--theme-color-light)
    );
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    margin-bottom: 4px;

    .light & {
      background: none;
      -webkit-background-clip: initial;
      -webkit-text-fill-color: initial;
      color: var(--theme-color);
    }
  }

  .stat-label {
    font-size: 12px;
    opacity: 0.7;

    .light & {
      color: var(--el-text-color-primary);
      opacity: 0.8;
    }
  }
}

// 图表样式
.ai-graph {
  margin-bottom: 16px;
}

.graph-title {
  font-size: 14px;
  margin-bottom: 8px;
  opacity: 0.8;

  .light & {
    color: var(--el-text-color-primary);
    opacity: 0.9;
  }
}

.time-distribution {
  .time-bar {
    height: 8px;
    display: flex;
    border-radius: 4px;
    overflow: hidden;
    margin-bottom: 4px;
    background: rgba(255, 255, 255, 0.1);

    .light & {
      background: rgba(0, 0, 0, 0.05);
    }

    .time-segment {
      height: 100%;

      &.morning {
        background: linear-gradient(to right, #ff9966, #ff5e62);
      }

      &.afternoon {
        background: linear-gradient(to right, #36d1dc, #5b86e5);
      }

      &.evening {
        background: linear-gradient(to right, #834d9b, #d04ed6);
      }
    }
  }

  .time-labels {
    display: flex;
    justify-content: space-between;
    font-size: 11px;
    opacity: 0.7;

    .light & {
      color: var(--el-text-color-primary);
      opacity: 0.8;
    }
  }
}

// 词频标签
.word-frequency {
  margin-bottom: 16px;

  .word-tags {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;

    .word-tag {
      background: rgba(var(--theme-color-rgb), 0.2);
      padding: 4px 10px;
      border-radius: 30px;
      font-weight: 500;

      .light & {
        background: rgba(var(--theme-color-rgb), 0.1);
        color: var(--theme-color-primary);
      }
    }
  }
}

// 建议列表
.suggestion-list {
  padding-left: 20px;

  li {
    margin-bottom: 10px;
    position: relative;
    padding-left: 5px;
    font-size: 14px;
    line-height: 1.5;

    .light & {
      color: var(--el-text-color-primary);
    }

    &::before {
      content: "•";
      position: absolute;
      left: -15px;
      color: var(--theme-color-primary);
    }
  }
}

// 预测卡片
.prediction-item {
  display: flex;
  margin-bottom: 10px;

  .prediction-label {
    width: 90px;
    font-size: 14px;
    opacity: 0.7;

    .light & {
      color: var(--el-text-color-primary);
      opacity: 0.8;
    }
  }

  .prediction-value {
    flex: 1;
    font-size: 14px;
    font-weight: 500;

    .light & {
      color: var(--el-text-color-primary);
    }
  }
}

.PersonalModule {
  .options-list {
    padding: 16px;
    display: flex;
    flex-direction: column;
    gap: 12px;
  }

  .option-item {
    display: flex;
    align-items: center;
    padding: 16px;
    background: rgba(var(--theme-color-rgb), 0.1);
    border: 1px solid rgba(var(--theme-color-rgb), 0.15);
    border-radius: 12px;
    transition: all 0.3s ease;
    cursor: pointer;

    &:hover {
      background: rgba(var(--theme-color-rgb), 0.15);
      border-color: rgba(var(--theme-color-rgb), 0.2);
      transform: translateY(-2px);
    }

    &:active {
      transform: translateY(0);
    }

    .icon {
      margin-right: 12px;
      color: var(--theme-color);
    }

    .arrow {
      margin-left: auto;
      color: var(--el-text-color-secondary);
    }
  }
}
</style>
