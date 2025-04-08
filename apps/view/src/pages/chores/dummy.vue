<script setup lang="ts">
import PageNavHolder from '~/components/page/holder/PageNavHolder.vue'
import { useRouter } from 'vue-router'
import { globalAuthStorage } from '~/modules/auth'
import { ref, onMounted } from 'vue'

const router = useRouter()

// 页面跳转函数
function navigateTo(path: string) {
  router.push(path)
}

// 打卡与积分数据
const pointsData = ref({
  totalPoints: 3250,
  level: 8,
  levelProgress: 65,
  dailyGoal: 50,
  wordsLearned: 1240,
  taskCompleted: 186,
  recentPoints: [
    { date: '10/01', points: 45 },
    { date: '10/02', points: 50 },
    { date: '10/03', points: 75 },
    { date: '10/04', points: 80 },
    { date: '10/05', points: 60 },
    { date: '10/06', points: 65 },
    { date: '10/07', points: 90 },
  ],
  badges: [
    { name: '连续7天', achieved: true },
    { name: '单词达人', achieved: true },
    { name: '完美周', achieved: false },
    { name: '学霸', achieved: true },
  ]
})

// 动画效果
const pulseEffect = ref(false)
onMounted(() => {
  setInterval(() => {
    pulseEffect.value = !pulseEffect.value
  }, 1500)
})
</script>

<template>
  <PageNavHolder :content-padding="false" class="DummyPage" title="个人积分">
    <div class="points-container">
      <!-- 主要积分卡片 - 带有炫彩效果 -->
      <div class="glass-card main-card">
        <div class="points-header">
          <div class="total-points">
            <span class="total-label">总积分</span>
            <div class="points-value" :class="{ 'pulse': pulseEffect }">
              {{ pointsData.totalPoints }}
            </div>
          </div>

          <div class="user-level">
            <div class="level-badge">
              <span>LV.{{ pointsData.level }}</span>
              <div class="level-glow"></div>
            </div>
          </div>
        </div>

        <div class="level-progress-container">
          <div class="level-progress">
            <div class="progress-fill" :style="{ width: `${pointsData.levelProgress}%` }"></div>
            <div class="progress-particles"></div>
          </div>
          <div class="progress-text">距离下一等级 {{ 100 - pointsData.levelProgress }}%</div>
        </div>
      </div>

      <!-- 数据统计卡片 -->
      <div class="glass-card stats-card">
        <div class="stats-grid">
          <div class="stats-item">
            <div class="stats-icon words">
              <div class="ai-dots">
                <span></span>
                <span></span>
                <span></span>
              </div>
            </div>
            <div class="stats-content">
              <div class="stats-value">{{ pointsData.wordsLearned }}</div>
              <div class="stats-label">单词量</div>
            </div>
          </div>

          <div class="stats-item">
            <div class="stats-icon tasks"></div>
            <div class="stats-content">
              <div class="stats-value">{{ pointsData.taskCompleted }}</div>
              <div class="stats-label">任务完成</div>
            </div>
          </div>

          <div class="stats-item">
            <div class="stats-icon daily"></div>
            <div class="stats-content">
              <div class="stats-value">{{ pointsData.dailyGoal }}</div>
              <div class="stats-label">日常目标</div>
            </div>
          </div>
        </div>
      </div>

      <!-- 积分趋势图表 -->
      <div class="glass-card chart-card">
        <h3>积分趋势</h3>
        <div class="chart-container">
          <div class="chart-bars">
            <div v-for="(item, index) in pointsData.recentPoints" :key="index" class="chart-bar">
              <div class="bar-fill" :style="{ height: `${item.points}%` }"></div>
              <div class="bar-date">{{ item.date }}</div>
            </div>
          </div>
        </div>
      </div>

      <!-- 成就徽章 -->
      <div class="glass-card badges-card">
        <h3>我的成就</h3>
        <div class="badges-grid">
          <div v-for="(badge, index) in pointsData.badges" :key="index" class="badge-item"
            :class="{ 'achieved': badge.achieved }">
            <div class="badge-icon"></div>
            <div class="badge-name">{{ badge.name }}</div>
          </div>
        </div>
      </div>

      <!-- 个人信息卡片 -->
      <div class="glass-card profile-card">
        <div class="profile-header">
          <UserAvatar border-rounded size="64px" />
          <div class="profile-info">
            <div class="profile-name">{{ globalAuthStorage.user.userName || '积分王者' }}</div>
            <div class="profile-bio">{{ globalAuthStorage.user.userProfile || '坚持不懈，收获满满' }}</div>
          </div>
        </div>
      </div>
    </div>
  </PageNavHolder>
</template>

<style lang="scss" scoped>
.points-container {
  width: 100%;
  height: 100%;
  overflow-y: auto;
  padding: 16px;
  background: linear-gradient(135deg, #f4f8fb 0%, #e2ecf7 100%);
  display: flex;
  flex-direction: column;
  gap: 16px;

  .dark & {
    background: linear-gradient(135deg, #1a202c 0%, #2d3748 100%);
  }
}

.glass-card {
  background: rgba(255, 255, 255, 0.7);
  backdrop-filter: blur(10px);
  border-radius: 16px;
  border: 1px solid rgba(255, 255, 255, 0.6);
  box-shadow: 0 8px 32px rgba(31, 38, 135, 0.1);
  padding: 20px;
  transition: all 0.3s ease;

  .dark & {
    background: rgba(255, 255, 255, 0.1);
    border: 1px solid rgba(255, 255, 255, 0.2);
  }
}

.main-card {
  position: relative;
}

.points-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.total-points {
  display: flex;
  flex-direction: column;
}

.total-label {
  font-size: 1rem;
  color: var(--el-text-color-secondary);
  margin-bottom: 4px;
}

.points-value {
  font-size: 3.5rem;
  font-weight: 700;
  background: linear-gradient(135deg, #9c27b0 0%, #3f51b5 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  line-height: 1;
  transition: all 0.3s ease;

  &.pulse {
    transform: scale(1.05);
    filter: brightness(1.2);
  }
}

.user-level {
  display: flex;
  align-items: center;
}

.level-badge {
  position: relative;
  background: linear-gradient(135deg, #6a11cb 0%, #2575fc 100%);
  color: white;
  font-weight: 600;
  padding: 8px 16px;
  border-radius: 20px;
  font-size: 1.1rem;

  .level-glow {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: inherit;
    border-radius: 20px;
    filter: blur(8px);
    opacity: 0.4;
    z-index: -1;
  }
}

.level-progress-container {
  width: 100%;
}

.level-progress {
  height: 12px;
  background: rgba(0, 0, 0, 0.05);
  border-radius: 6px;
  overflow: hidden;
  position: relative;
  margin-bottom: 8px;
}

.progress-fill {
  height: 100%;
  background: linear-gradient(to right, #6a11cb, #2575fc);
  border-radius: 6px;
  position: relative;

  &::after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 30px;
    height: 100%;
    background: rgba(255, 255, 255, 0.3);
    filter: blur(5px);
    animation: shine 3s infinite linear;
  }
}

.progress-particles {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
}

.progress-text {
  font-size: 0.85rem;
  color: var(--el-text-color-secondary);
  text-align: right;
}

.stats-card {
  .stats-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 20px;
  }

  .stats-item {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 10px;
  }

  .stats-icon {
    width: 50px;
    height: 50px;
    border-radius: 12px;
    display: flex;
    align-items: center;
    justify-content: center;
    position: relative;

    &.words {
      background: linear-gradient(135deg, #43cea2 0%, #185a9d 100%);
    }

    &.tasks {
      background: linear-gradient(135deg, #ff9a9e 0%, #fad0c4 100%);
    }

    &.daily {
      background: linear-gradient(135deg, #a18cd1 0%, #fbc2eb 100%);
    }

    &::after {
      content: '';
      position: absolute;
      width: 100%;
      height: 100%;
      border-radius: 12px;
      background: inherit;
      filter: blur(10px);
      opacity: 0.3;
      z-index: -1;
    }
  }

  .ai-dots {
    display: flex;
    gap: 4px;
    align-items: center;

    span {
      width: 6px;
      height: 6px;
      background: white;
      border-radius: 50%;
      opacity: 0.8;
      animation: dot-pulse 1.5s infinite;

      &:nth-child(2) {
        animation-delay: 0.5s;
      }

      &:nth-child(3) {
        animation-delay: 1s;
      }
    }
  }

  .stats-content {
    display: flex;
    flex-direction: column;
    align-items: center;
  }

  .stats-value {
    font-size: 1.4rem;
    font-weight: 600;
    color: var(--el-text-color-regular);
  }

  .stats-label {
    font-size: 0.85rem;
    color: var(--el-text-color-secondary);
  }
}

.chart-card {
  h3 {
    font-size: 1.1rem;
    font-weight: 600;
    color: var(--el-text-color-regular);
    margin-top: 0;
    margin-bottom: 16px;
  }

  .chart-container {
    height: 180px;
    display: flex;
    flex-direction: column;
    justify-content: flex-end;
  }

  .chart-bars {
    display: flex;
    justify-content: space-between;
    align-items: flex-end;
    height: 80%;
  }

  .chart-bar {
    flex: 1;
    display: flex;
    flex-direction: column;
    align-items: center;
    height: 100%;
    padding: 0 6px;
  }

  .bar-fill {
    width: 100%;
    background: linear-gradient(to top, #6a11cb, #2575fc);
    border-radius: 4px;
    transition: height 1s ease;
    max-height: 100%;
    min-height: 10%;
  }

  .bar-date {
    font-size: 0.75rem;
    color: var(--el-text-color-secondary);
    margin-top: 8px;
  }
}

.badges-card {
  h3 {
    font-size: 1.1rem;
    font-weight: 600;
    color: var(--el-text-color-regular);
    margin-top: 0;
    margin-bottom: 16px;
  }

  .badges-grid {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 16px;
  }

  .badge-item {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 8px;
    opacity: 0.5;
    transition: all 0.3s ease;

    &.achieved {
      opacity: 1;
    }
  }

  .badge-icon {
    width: 48px;
    height: 48px;
    border-radius: 50%;
    background: linear-gradient(135deg, #cfd9df 0%, #e2ebf0 100%);
    display: flex;
    align-items: center;
    justify-content: center;
    position: relative;

    .achieved & {
      background: linear-gradient(135deg, #f6d365 0%, #fda085 100%);

      &::after {
        content: '';
        position: absolute;
        width: 100%;
        height: 100%;
        border-radius: 50%;
        background: inherit;
        filter: blur(8px);
        opacity: 0.4;
        z-index: -1;
      }
    }
  }

  .badge-name {
    font-size: 0.8rem;
    color: var(--el-text-color-regular);
    text-align: center;
  }
}

.profile-card {
  .profile-header {
    display: flex;
    gap: 16px;
  }

  .profile-info {
    display: flex;
    flex-direction: column;
    justify-content: center;
  }

  .profile-name {
    font-size: 1.2rem;
    font-weight: 600;
    color: var(--el-text-color-regular);
    margin-bottom: 4px;
  }

  .profile-bio {
    font-size: 0.9rem;
    color: var(--el-text-color-secondary);
  }
}

@keyframes rotate {
  0% {
    transform: rotate(0deg);
  }

  100% {
    transform: rotate(360deg);
  }
}

@keyframes shine {
  0% {
    left: -100px;
  }

  100% {
    left: 100%;
  }
}

@keyframes dot-pulse {
  0% {
    opacity: 0.4;
    transform: scale(0.8);
  }

  50% {
    opacity: 1;
    transform: scale(1.2);
  }

  100% {
    opacity: 0.4;
    transform: scale(0.8);
  }
}
</style>
