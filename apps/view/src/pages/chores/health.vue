<script setup lang="ts">
import PageNavHolder from '~/components/page/holder/PageNavHolder.vue'
import PageSettingsItem from '~/components/display/settings/PageSettingsItem.vue'
import { useRouter } from 'vue-router'
import { globalAuthStorage } from '~/modules/auth'
import { ref, onMounted } from 'vue'

const router = useRouter()

// 页面跳转函数
function navigateTo(path: string) {
  router.push(path)
}

// 打卡数据
const streakData = ref({
  currentStreak: 7,
  longestStreak: 15,
  totalDays: 42,
  monthlyProgress: 76,
  recentActivity: [
    { day: '周一', completed: true },
    { day: '周二', completed: true },
    { day: '周三', completed: true },
    { day: '周四', completed: true },
    { day: '周五', completed: true },
    { day: '周六', completed: true },
    { day: '周日', completed: true },
  ]
})

// 动画效果
const glowingEffect = ref(false)
onMounted(() => {
  setInterval(() => {
    glowingEffect.value = !glowingEffect.value
  }, 2000)
})
</script>

<template>
  <PageNavHolder :content-padding="false" class="HealthPage" title="连续打卡">
    <div class="health-container">
      <!-- 主要数据卡片 - 玻璃拟态效果 -->
      <div class="glass-card streak-card">
        <div class="streak-header">
          <div class="ai-icon">
            <div class="ai-circle" :class="{ 'glow': glowingEffect }"></div>
          </div>
          <h2>连续打卡</h2>
        </div>

        <div class="streak-number">
          <div class="number">{{ streakData.currentStreak }}</div>
          <div class="label">天</div>
        </div>

        <div class="streak-progress">
          <div class="progress-bar">
            <div class="progress-fill" :style="{ width: `${streakData.monthlyProgress}%` }"></div>
          </div>
          <div class="progress-text">本月完成度 {{ streakData.monthlyProgress }}%</div>
        </div>
      </div>

      <!-- 打卡日历 - 圆形指示器 -->
      <div class="glass-card calendar-card">
        <h3>最近打卡</h3>
        <div class="day-indicators">
          <div v-for="(day, index) in streakData.recentActivity" :key="index" class="day-item">
            <div class="day-circle" :class="{ 'completed': day.completed }">
              <div class="day-glow" v-if="day.completed"></div>
            </div>
            <div class="day-text">{{ day.day }}</div>
          </div>
        </div>
      </div>

      <!-- 数据展示卡片 -->
      <div class="stats-container">
        <div class="glass-card stat-card">
          <div class="stat-icon longest"></div>
          <div class="stat-content">
            <div class="stat-value">{{ streakData.longestStreak }}</div>
            <div class="stat-label">最长连续</div>
          </div>
        </div>

        <div class="glass-card stat-card">
          <div class="stat-icon total"></div>
          <div class="stat-content">
            <div class="stat-value">{{ streakData.totalDays }}</div>
            <div class="stat-label">累计打卡</div>
          </div>
        </div>
      </div>

      <!-- 个人信息卡片 -->
      <div class="glass-card profile-card">
        <div class="profile-header">
          <UserAvatar border-rounded size="64px" />
          <div class="profile-info">
            <div class="profile-name">{{ globalAuthStorage.user.userName || '学习达人' }}</div>
            <div class="profile-bio">{{ globalAuthStorage.user.userProfile || '坚持学习，持之以恒' }}</div>
          </div>
        </div>

        <div class="profile-details">
          <div class="profile-item">
            <div class="item-label">UnionID</div>
            <div class="item-value">{{ globalAuthStorage.user.unionId || '-' }}</div>
          </div>

          <div class="profile-item">
            <div class="item-label">IdentifyID</div>
            <div class="item-value">#{{ globalAuthStorage.user.id || '-' }}</div>
          </div>
        </div>
      </div>
    </div>
  </PageNavHolder>
</template>

<style lang="scss" scoped>
.health-container {
  width: 100%;
  height: 100%;
  overflow-y: auto;
  padding: 16px;
  background: linear-gradient(135deg, #f5f7fa 0%, #e4e8f0 100%);
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
  transition: transform 0.3s ease, box-shadow 0.3s ease;

  .dark & {
    background: rgba(255, 255, 255, 0.1);
    border: 1px solid rgba(255, 255, 255, 0.2);
  }
}

.streak-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  position: relative;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    top: -50%;
    left: -50%;
    width: 200%;
    height: 200%;
    background: linear-gradient(135deg,
        rgba(255, 0, 128, 0.1) 0%,
        rgba(0, 128, 255, 0.1) 50%,
        rgba(128, 255, 0, 0.1) 100%);
    animation: rotate 10s linear infinite;
    z-index: -1;
  }
}

.streak-header {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 16px;
  width: 100%;

  h2 {
    font-size: 1.4rem;
    font-weight: 600;
    color: var(--el-text-color-regular);
    margin: 0;
  }
}

.ai-icon {
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.ai-circle {
  width: 20px;
  height: 20px;
  border-radius: 50%;
  background: linear-gradient(135deg, #00c6fb 0%, #005bea 100%);
  transition: all 0.5s ease;
  position: relative;

  &.glow {
    box-shadow: 0 0 15px #005bea;
  }

  &::before,
  &::after {
    content: '';
    position: absolute;
    border-radius: 50%;
    background: linear-gradient(135deg, #00c6fb 0%, #005bea 100%);
    opacity: 0.6;
  }

  &::before {
    width: 10px;
    height: 10px;
    top: -15px;
    left: 50%;
    transform: translateX(-50%);
  }

  &::after {
    width: 8px;
    height: 8px;
    bottom: -12px;
    left: 25%;
  }
}

.streak-number {
  display: flex;
  align-items: flex-end;
  margin: 20px 0;

  .number {
    font-size: 4rem;
    font-weight: 700;
    color: var(--el-text-color-regular);
    line-height: 1;
    background: linear-gradient(135deg, #5e35b1 0%, #3949ab 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
  }

  .label {
    font-size: 1.5rem;
    margin-left: 8px;
    margin-bottom: 8px;
    color: var(--el-text-color-regular);
  }
}

.streak-progress {
  width: 100%;
  margin-top: 10px;

  .progress-bar {
    height: 10px;
    background: rgba(0, 0, 0, 0.05);
    border-radius: 5px;
    overflow: hidden;
    margin-bottom: 8px;
  }

  .progress-fill {
    height: 100%;
    background: linear-gradient(to right, #36d1dc, #5b86e5);
    border-radius: 5px;
    transition: width 1s ease;
  }

  .progress-text {
    font-size: 0.85rem;
    color: var(--el-text-color-secondary);
    text-align: right;
  }
}

.calendar-card {
  h3 {
    font-size: 1.1rem;
    font-weight: 600;
    color: var(--el-text-color-regular);
    margin-top: 0;
    margin-bottom: 16px;
  }

  .day-indicators {
    display: flex;
    justify-content: space-between;
  }

  .day-item {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 5px;
  }

  .day-circle {
    width: 32px;
    height: 32px;
    border-radius: 50%;
    background: rgba(0, 0, 0, 0.05);
    display: flex;
    align-items: center;
    justify-content: center;
    position: relative;

    &.completed {
      background: linear-gradient(135deg, #5e35b1 0%, #3949ab 100%);
    }
  }

  .day-glow {
    position: absolute;
    width: 100%;
    height: 100%;
    border-radius: 50%;
    background: linear-gradient(135deg, #5e35b1 0%, #3949ab 100%);
    filter: blur(8px);
    opacity: 0.4;
    z-index: -1;
  }

  .day-text {
    font-size: 0.8rem;
    color: var(--el-text-color-secondary);
  }
}

.stats-container {
  display: flex;
  gap: 16px;

  .stat-card {
    flex: 1;
    display: flex;
    align-items: center;
    gap: 16px;
  }

  .stat-icon {
    width: 40px;
    height: 40px;
    border-radius: 8px;
    display: flex;
    align-items: center;
    justify-content: center;

    &.longest {
      background: linear-gradient(135deg, #fa709a 0%, #fee140 100%);
    }

    &.total {
      background: linear-gradient(135deg, #43e97b 0%, #38f9d7 100%);
    }
  }

  .stat-content {
    display: flex;
    flex-direction: column;
  }

  .stat-value {
    font-size: 1.5rem;
    font-weight: 600;
    color: var(--el-text-color-regular);
  }

  .stat-label {
    font-size: 0.85rem;
    color: var(--el-text-color-secondary);
  }
}

.profile-card {
  .profile-header {
    display: flex;
    gap: 16px;
    margin-bottom: 20px;
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

  .profile-details {
    display: flex;
    flex-direction: column;
    gap: 10px;
  }

  .profile-item {
    display: flex;
    justify-content: space-between;
    padding: 10px 0;
    border-top: 1px solid rgba(0, 0, 0, 0.05);

    &:first-child {
      border-top: none;
    }
  }

  .item-label {
    font-size: 0.9rem;
    color: var(--el-text-color-secondary);
  }

  .item-value {
    font-size: 0.9rem;
    color: var(--el-text-color-regular);
    font-weight: 500;
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
</style>
