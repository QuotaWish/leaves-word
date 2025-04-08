<script setup lang="ts">
import { Calendar } from 'vant'
import { calendarManager } from '~/modules/words'
import LeafCard from './display/LeafCard.vue'

function calcAccumuData(signData: string): number {
  let num = (signData) || ''
  let amo = 0

  while (num.length) {
    if (((+num.at(-1)! || 0) & 1) === 0)
      break

    num = num.slice(0, -1)
    amo++
  }

  return amo
}

// 获取近7天的日期
function getDates() {
  const dates = []
  for (let i = -3; i < 4; i++) {
    const date = new Date()
    date.setDate(date.getDate() + i)
    dates.push(date)
  }
  return dates
}

const date = new Date()
const firstDay = new Date(date.getFullYear(), date.getMonth(), 1)
const lastDay = new Date(date.getFullYear(), date.getMonth() + 1, 0)
const dates = getDates()

const todayData = calendarManager.getTodayData()
const signedDays = computed(() => (todayData?.origin.day || ''))
const signedDayMap = computed(() => signedDays.value.split(''))
const accumulateSigned = computed(() => calcAccumuData(signedDays.value))

// 计算连续打卡天数占比
const completionPercentage = computed(() => Math.min(100, Math.round((accumulateSigned.value / 30) * 100)))

// 模拟每日学习主题
const dailyTopics: Record<number, string> = {
  3: '词汇',
  7: '语法',
  12: '听力',
  14: '口语',
  18: '阅读',
  21: '写作',
  25: '习语'
}

// 获取当日学习主题
function getDailyTopic(day: number): string {
  return dailyTopics[day] || ''
}

// AI推荐学习内容
const aiRecommendations: Record<string, string[]> = {
  '词汇': ['根据你的学习记录，建议今天学习10个新单词', '重点复习昨天遗忘的单词', '尝试使用新词造句'],
  '语法': ['今天重点学习时态用法', '练习句型转换', '复习被动语态'],
  '听力': ['建议练习VOA慢速英语', '尝试不看字幕听一段TED演讲', '听写BBC新闻'],
  '口语': ['使用新学单词进行口语练习', '录制自我介绍并分析发音', '模仿电影对白练习'],
  '阅读': ['阅读一篇经济学人文章', '尝试速读技巧', '做阅读理解练习'],
  '写作': ['练习写一篇论点论据型essay', '改写今天阅读的文章', '练习总结文章主旨'],
  '习语': ['学习5个日常习语', '用习语造句', '了解习语的文化背景']
}

// 获取当日AI推荐
const todayTopic = computed(() => getDailyTopic(new Date().getDate()))
const aiTips = computed(() => {
  if (!todayTopic.value) return []
  return aiRecommendations[todayTopic.value] || []
})

// AI学习助手信息
const aiAssistantMessage = computed(() => {
  if (accumulateSigned.value === 0) {
    return '今天是学习的好日子，开始你的英语学习之旅吧！'
  } else if (accumulateSigned.value < 5) {
    return `已经连续学习${accumulateSigned.value}天了，继续保持！`
  } else if (accumulateSigned.value < 10) {
    return `${accumulateSigned.value}天的坚持很了不起！你的词汇量正在稳步提升。`
  } else {
    return `惊人的${accumulateSigned.value}天连续学习！你的努力正在转化为真实的能力提升。`
  }
})

// 控制月历展开/收缩状态
const isCalendarExpanded = ref(false)
function toggleCalendar() {
  isCalendarExpanded.value = !isCalendarExpanded.value
}
</script>

<template>
  <LeafCard class="SignCalendarMonthly">
    <!-- 添加卡片装饰元素 -->
    <div class="card-decoration"></div>

    <!-- 顶部的7天签到记录 -->
    <div class="week-calendar">
      <ul class="SignCalendar-Head">
        <li v-for="date in dates" :key="date.getDate()"
          :class="{ checked: signedDayMap[date.getDate() - 1] === '1', today: date.getDate() === new Date().getDate() }">
          {{ date.getDate() }}
          <div v-if="date.getDate() === new Date().getDate()" class="today-indicator"></div>
        </li>
      </ul>
    </div>

    <!-- 优化标题区域 -->
    <div class="calendar-header">
      <div class="header-glow"></div>
      <div class="calendar-title">
        <div class="ai-assistant">
          <div i-carbon:calendar class="ai-icon"></div>
          <div class="pulse-effect"></div>
        </div>
        <div class="title-container">
          <div class="title-main">学习助手</div>
          <div class="signed-info">
            <span class="normal">本月已打卡:</span>
            <span class="count-value">{{ accumulateSigned }}</span><span class="count-total">/30</span>
            <div class="mini-progress">
              <div class="mini-progress-fill" :style="`width: ${completionPercentage}%`"></div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 展开/收缩按钮 - 放在日历内容外面 -->
    <div class="toggle-button" @click="toggleCalendar">
      <div class="button-content" :class="{ expanded: isCalendarExpanded }">
        <span>{{ isCalendarExpanded ? '收起' : '展开月历' }}</span>
        <div class="arrow-icon" :class="{ expanded: isCalendarExpanded }"></div>
      </div>
    </div>

    <!-- 日历和底部按钮容器 - 根据展开状态显示/隐藏 -->
    <div class="expandable-content" v-show="isCalendarExpanded">
      <!-- 月历 -->
      <div class="calendar-wrapper">
        <Calendar :show-confirm="false" :show-mark="false" :show-title="false" :poppable="false" :min-date="firstDay"
          :max-date="lastDay">
          <template #text="{ text }">
            <span :class="{ active: signedDayMap[text - 1] === '1' }" class="sign-day">
              <span>{{ text }}</span>
              <div v-if="getDailyTopic(text)" class="topic-indicator" :title="getDailyTopic(text)"></div>
            </span>
          </template>
        </Calendar>
      </div>

      <!-- 底部按钮 -->
      <div class="calendar-footer">
        <div class="footer-glow"></div>
        <div class="footer-button completed">已完成</div>
        <div class="footer-button today">今天</div>
        <div class="footer-button topic">学习主题</div>
      </div>
    </div>
  </LeafCard>
</template>

<style lang="scss">
.SignCalendarMonthly {
  padding: 0 !important;
  --van-calendar-day-height: 50px;
  --van-calendar-selected-day-size: 36px;
  --van-calendar-selected-day-background: transparent;
  --van-text-color: var(--el-text-color-regular);
  --van-calendar-background: transparent;

  /* 添加整体卡片效果 */
  position: relative;
  border-radius: 20px;
  overflow: hidden;
  /* 移除多余的margin */
  isolation: isolate;

  background-color: var(--el-fill-color);

  &.LeafCard {
    background: #ffffff;
    /* 默认light模式背景 */
    border: 1px solid rgba(0, 0, 0, 0.05);

    /* 卡片顶部渐变装饰 */
    &::before {
      content: '';
      position: absolute;
      inset: 0;
      background: linear-gradient(180deg,
          rgba(var(--theme-color-rgb), 0.03) 0%,
          rgba(255, 255, 255, 0) 20%);
      z-index: -1;
    }

    /* 右上角装饰性光晕 */
    &::after {
      content: '';
      position: absolute;
      width: 200px;
      height: 200px;
      right: -80px;
      top: -80px;
      background: radial-gradient(circle,
          rgba(var(--theme-color-rgb), 0.1) 0%,
          rgba(var(--theme-color-rgb), 0.02) 60%,
          transparent 100%);
      z-index: -1;
      opacity: 0.4;
      filter: blur(20px);
    }

    html.dark & {
      background: #121212;
      /* 深色背景 */
      border: 1px solid rgba(var(--theme-color-rgb), 0.15);

      &::before {
        background: linear-gradient(180deg,
            rgba(var(--theme-color-rgb), 0.15) 0%,
            rgba(0, 0, 0, 0) 30%);
      }

      &::after {
        background: radial-gradient(circle,
            rgba(var(--theme-color-rgb), 0.3) 0%,
            rgba(var(--theme-color-rgb), 0.05) 60%,
            transparent 100%);
        opacity: 0.3;
      }
    }
  }

  /* 额外添加一个底部装饰效果 */
  .card-decoration {
    position: absolute;
    bottom: -100px;
    left: -80px;
    width: 200px;
    height: 200px;
    background: radial-gradient(circle,
        rgba(var(--theme-color-rgb), 0.1) 0%,
        rgba(var(--theme-color-rgb), 0.02) 50%,
        transparent 80%);
    z-index: -1;
    opacity: 0.4;
    filter: blur(25px);
    pointer-events: none;

    html.dark & {
      background: radial-gradient(circle,
          rgba(var(--theme-color-rgb), 0.2) 0%,
          rgba(var(--theme-color-rgb), 0.05) 50%,
          transparent 80%);
    }
  }

  .week-calendar {
    margin-bottom: 0;
    position: relative;
    z-index: 1;

    .SignCalendar-Head {
      position: relative;
      padding: 0.8rem 1rem 0.8rem 1rem;
      display: flex;
      justify-content: space-between;

      &::before {
        content: '';
        position: absolute;
        width: calc(100% - 2rem);
        height: 1px;
        left: 1rem;
        bottom: 0;
        opacity: 0.2;
        background: rgba(0, 0, 0, 0.1);

        html.dark & {
          background: rgba(255, 255, 255, 0.1);
        }
      }

      li {
        position: relative;
        display: flex;
        border-radius: 50%;
        align-items: center;
        justify-content: center;
        width: 36px;
        height: 36px;
        font-size: 15px;
        font-weight: 500;
        color: var(--el-text-color-regular);
        transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);

        html.dark & {
          color: rgba(255, 255, 255, 0.7);
        }

        &.checked {
          color: #fff;
          background: linear-gradient(135deg, var(--theme-color-primary) 0%, var(--theme-color-light) 100%);
          font-weight: 600;
          transform: translateY(-2px);
        }

        &.today {
          border: 2px solid var(--theme-color-primary);
          color: var(--theme-color-primary);
          font-weight: 600;

          .today-indicator {
            position: absolute;
            bottom: -2px;
            width: 4px;
            height: 4px;
            background-color: var(--theme-color-primary);
            border-radius: 50%;
          }

          &.checked {
            color: #fff;
            border: none;

            .today-indicator {
              background-color: #fff;
              bottom: 2px;
            }
          }
        }

        &:hover:not(.checked) {
          background-color: rgba(var(--theme-color-rgb), 0.1);
          transform: translateY(-1px);

          html.dark & {
            background-color: rgba(var(--theme-color-rgb), 0.2);
          }
        }
      }
    }
  }

  .sign-day {
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;
    color: var(--el-text-color-primary);
    width: var(--van-calendar-selected-day-size);
    height: var(--van-calendar-selected-day-size);
    border-radius: 50%;
    transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);

    html.dark & {
      color: rgba(255, 255, 255, 0.8);
    }

    &.active {
      background: linear-gradient(135deg, var(--theme-color-primary) 0%, var(--theme-color-light) 100%);
      transform: translateY(-2px);
      color: #fff;
      font-weight: 600;
      box-shadow: 0 3px 8px rgba(var(--theme-color-primary), 0.3);
    }

    .topic-indicator {
      position: absolute;
      width: 6px;
      height: 6px;
      background: linear-gradient(135deg, var(--theme-color-light) 0%, var(--theme-color-primary) 100%);
      border-radius: 50%;
      bottom: 2px;
    }

    &:hover:not(.active) {
      background-color: rgba(var(--theme-color-primary), 0.1);
      transform: translateY(-1px);

      html.dark & {
        background-color: rgba(var(--theme-color-primary), 0.2);
      }
    }
  }

  /* 展开/收缩按钮 */
  .toggle-button {
    display: flex;
    justify-content: center;
    padding: 10px 0;
    cursor: pointer;

    .button-content {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 8px;
      padding: 6px 16px;
      border: 1px solid var(--theme-color-primary);
      background: linear-gradient(135deg, var(--theme-color-primary) 0%, var(--theme-color-dark) 100%);
      color: white;
      font-weight: 500;
      font-size: 13px;
      border-radius: 20px;
      box-shadow: 0 3px 10px rgba(var(--theme-color-rgb), 0.3);
      transition: all 0.3s ease;
      min-width: 100px;

      &:hover {
        transform: translateY(-2px);
        box-shadow: 0 5px 15px rgba(var(--theme-color-rgb), 0.4);
      }

      &.expanded {
        color: #fff;

        html.dark & {
          background: rgba(var(--theme-color-rgb), 0.2);
        }

        .arrow-icon {
          border-color: #fff;
        }
      }

      .arrow-icon {
        width: 8px;
        height: 8px;
        border-right: 2px solid white;
        border-bottom: 2px solid white;
        transform: rotate(45deg);
        transition: transform 0.3s ease;

        &.expanded {
          transform: rotate(-135deg);
        }
      }
    }
  }

  /* 可展开内容区域 */
  .expandable-content {
    animation: slideDown 0.3s ease-out;

    @keyframes slideDown {
      from {
        opacity: 0;
        transform: translateY(-10px);
      }

      to {
        opacity: 1;
        transform: translateY(0);
      }
    }
  }

  /* 日历容器 */
  .calendar-wrapper {
    padding: 0 0.5rem;
  }

  .van-calendar {
    border-radius: 16px;
    position: relative;
    overflow: hidden;
    padding: 0;
    margin: 0.5rem;
    background: transparent;
    border: none;
    backdrop-filter: blur(4px);
    -webkit-backdrop-filter: blur(4px);

    html.dark & {
      color: rgba(255, 255, 255, 0.9);
      background: rgba(255, 255, 255, 0.01);
      border: none;
    }

    .van-calendar__day {
      cursor: pointer;

      html.dark & {
        color: rgba(255, 255, 255, 0.9);
      }
    }

    .van-calendar__header {
      box-shadow: none;
      border-bottom: 1px solid rgba(0, 0, 0, 0.05);

      html.dark & {
        border-bottom: 1px solid rgba(255, 255, 255, 0.08);
      }

      .van-calendar__weekday {
        color: var(--el-text-color-secondary);

        html.dark & {
          color: rgba(255, 255, 255, 0.5);
        }
      }
    }

    .van-calendar__month-title {
      color: var(--el-text-color-primary);
      font-weight: 600;

      html.dark & {
        color: rgba(255, 255, 255, 0.9);
      }
    }
  }

  .calendar-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 16px;
    background: rgba(var(--theme-color-rgb), 0.03);
    border-bottom: 1px solid rgba(0, 0, 0, 0.05);
    position: relative;
    backdrop-filter: blur(5px);
    transition: all 0.3s ease;

    /* 添加顶部光晕效果 */
    .header-glow {
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      height: 1px;
      background: linear-gradient(90deg,
          transparent 0%,
          rgba(var(--theme-color-rgb), 0.3) 50%,
          transparent 100%);

      html.dark & {
        background: linear-gradient(90deg,
            transparent 0%,
            rgba(var(--theme-color-rgb), 0.6) 50%,
            transparent 100%);
      }
    }

    html.dark & {
      background: rgba(0, 0, 0, 0.3);
      border-bottom: 1px solid rgba(255, 255, 255, 0.05);
    }

    .calendar-title {
      display: flex;
      align-items: center;
      gap: 12px;
      width: 100%;

      .ai-assistant {
        position: relative;
        display: flex;
        width: 36px;
        height: 36px;
        align-items: center;
        justify-content: center;
        color: #fff;
        font-size: 18px;
        font-weight: 600;
        border-radius: 10px;
        background: linear-gradient(135deg, var(--theme-color-primary) 0%, var(--theme-color-light) 100%);
        cursor: pointer;
        transition: all 0.3s ease;
        box-shadow: 0 2px 6px rgba(var(--theme-color-rgb), 0.2);
        flex-shrink: 0;

        &:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 8px rgba(var(--theme-color-rgb), 0.3);
        }

        .pulse-effect {
          position: absolute;
          width: 100%;
          height: 100%;
          border-radius: 10px;
          background: inherit;
          opacity: 0.6;
          z-index: -1;
          animation: pulse-anim 2.5s infinite cubic-bezier(0.215, 0.61, 0.355, 1);

          html.dark & {
            opacity: 0.4;
          }
        }

        @keyframes pulse-anim {
          0% {
            transform: scale(1);
            opacity: 0.6;
          }

          50% {
            transform: scale(1.5);
            opacity: 0;
          }

          100% {
            transform: scale(1);
            opacity: 0;
          }
        }
      }

      .title-container {
        display: flex;
        flex-direction: column;
        flex-grow: 1;

        .title-main {
          font-size: 16px;
          font-weight: 600;
          color: var(--el-text-color-primary);
          margin-bottom: 4px;

          html.dark & {
            color: rgba(255, 255, 255, 0.95);
          }
        }

        /* 优化打卡信息样式 */
        .signed-info {
          display: flex;
          align-items: center;

          .normal {
            color: var(--el-text-color-secondary);
            font-size: 12px;
            margin-right: 4px;

            html.dark & {
              color: rgba(255, 255, 255, 0.7);
            }
          }

          .count-value {
            color: var(--theme-color-primary);
            font-weight: bold;
            font-size: 12px;

            html.dark & {
              color: var(--theme-color-light);
            }
          }

          .count-total {
            color: var(--el-text-color-secondary);
            font-size: 12px;
            margin-right: 6px;

            html.dark & {
              color: rgba(255, 255, 255, 0.5);
            }
          }

          /* 优化迷你进度条 */
          .mini-progress {
            position: relative;
            width: 50px;
            height: 4px;
            background: rgba(0, 0, 0, 0.05);
            border-radius: 2px;
            overflow: hidden;

            html.dark & {
              background: rgba(255, 255, 255, 0.1);
            }

            .mini-progress-fill {
              position: absolute;
              height: 100%;
              background: linear-gradient(to right, var(--theme-color-primary), var(--theme-color-light));
              border-radius: 2px;
              transition: width 0.8s cubic-bezier(0.34, 1.56, 0.64, 1);
            }
          }
        }
      }
    }
  }

  /* 底部按钮样式 */
  .calendar-footer {
    display: flex;
    justify-content: center;
    gap: 16px;
    padding: 12px 0;
    margin-top: 10px;
    background: rgba(var(--theme-color-rgb), 0.02);
    border-top: 1px solid rgba(0, 0, 0, 0.05);
    position: relative;
    z-index: 5;
    border-radius: 0 0 16px 16px;

    /* 添加底部光晕效果 */
    .footer-glow {
      position: absolute;
      bottom: 0;
      left: 0;
      right: 0;
      height: 1px;
      background: linear-gradient(90deg,
          transparent 0%,
          rgba(var(--theme-color-primary), 0.3) 50%,
          transparent 100%);

      html.dark & {
        background: linear-gradient(90deg,
            transparent 0%,
            rgba(var(--theme-color-primary), 0.6) 50%,
            transparent 100%);
      }
    }

    html.dark & {
      background: rgba(0, 0, 0, 0.1);
      border-top: 1px solid rgba(255, 255, 255, 0.05);
    }

    .footer-button {
      padding: 6px 12px;
      border-radius: 20px;
      font-size: 12px;
      font-weight: 500;
      display: flex;
      align-items: center;

      &.completed {
        background: linear-gradient(135deg, var(--theme-color-primary) 0%, var(--theme-color-light) 100%);
        color: #fff;

        &::before {
          content: '';
          display: inline-block;
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background-color: #fff;
          margin-right: 6px;
        }
      }

      &.today {
        background: rgba(var(--theme-color-primary), 0.08);
        color: var(--theme-color-primary);
        border: 1px solid var(--theme-color-primary);

        &::before {
          content: '';
          display: inline-block;
          width: 8px;
          height: 8px;
          border-radius: 50%;
          border: 1px solid var(--theme-color-primary);
          margin-right: 6px;
        }
      }

      &.topic {
        background: rgba(var(--theme-color-primary), 0.05);
        color: var(--el-text-color-secondary);

        html.dark & {
          color: rgba(255, 255, 255, 0.7);
          background: rgba(var(--theme-color-primary), 0.1);
        }

        &::before {
          content: '';
          display: inline-block;
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background-color: var(--theme-color-light);
          margin-right: 6px;
        }
      }
    }
  }
}
</style>
