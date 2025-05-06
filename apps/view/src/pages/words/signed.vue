<script setup lang="ts">
import NumberFlow from '@number-flow/vue'
import { dayjs } from 'element-plus'
import CoffettiParticle from '~/components/chore/CoffettiParticle.vue'
import DrawerPage from '~/components/page/DrawerPage.vue'
import { calendarManager, type Statistics, useVictoryAudio } from '~/modules/words'
import ComprehensiveStat from '~/modules/words/mode/comprehensive/display/stats/index.vue'
import Astronaut from '/svg/astronaut.svg'
import Mello from '/svg/mello.svg'

defineOptions({
  name: 'SignedPage',
})

const num = ref(0)
const score = ref(0)
const days = ref(0)
const timeText = ref('')
const data = ref<Statistics<any>>()
const displayComponent = ref<Component>()
const drawerPage = useInstanceRef(DrawerPage)

const router = useRouter()
// const globalSplashState = useGlobalSplashState()

const victoryAudio = useVictoryAudio()

const statCompMapper = {
  COMPREHENSIVE: ComprehensiveStat,
}

setTimeout(() => {
  drawerPage.value?.drawerControl.show()
}, 1800)

setTimeout(() => {
  drawerPage.value?.drawerControl.expand()
}, 3800)

onMounted(async () => {
  (await victoryAudio).play()

  // 其他逻辑...
  setTimeout(async () => {
    const todayData = calendarManager.getTodayData()!

    if (!todayData?.signed) {
      router.push('/')
      return
    }

    // process todayData
    const originDataList = todayData.origin.data
    const todaySubData = originDataList.at(-1)

    if (!todaySubData) {
      router.push('/')
      return
    }

    const statistics = todaySubData.statistics
    const targetComponent = statistics?.type.toUpperCase() as keyof typeof statCompMapper

    displayComponent.value = statCompMapper[targetComponent]
    data.value = statistics

    timeText.value = dayjs(new Date(todayData.data!.date)).format('YYYY-MM-DD')

    await sleep(100)

    days.value = 1

    await sleep(300)

    num.value = todaySubData.words.length

    await sleep(100)

    score.value = todaySubData.words.length * 1.5
  }, 800)
})
</script>

<template>
  <DrawerPage ref="drawerPage" class="Signed transition-cubic" @close="router.push('/')">
    <template #main>
      <div class="Signed-Header">
        <h1>今日已完成!</h1>
        <div class="Signed-Header-Time">
          <!-- {{ timeText }} -->
        </div>
      </div>

      <div class="Signed-MainCard fake-background">
        <div class="Signed-MainCard-Svg">
          <img :src="Astronaut">
        </div>
        <div class="Signed-MainCard-SuccessSvg">
          <img :src="Mello">
        </div>
        <p>你已连续学习</p>

        <h1>
          <div class="number-flow-container">
            <NumberFlow :prefix="days < 10 ? '0' : ''" :continuous="true" :will-change="true" :animated="true" :value="days" />
          </div>
          <span>天</span>
        </h1>

        <div mt-8 w-full flex items-center justify-between>
          挑战 7 天不断电
          <span class="challenge-count" font-bold>1/7</span>
        </div>

        <div style="--p: 14.2%" class="Signed-MainCard-Progress">
          <div class="Signed-MainCard-Progress-Bar" />
          <div class="Signed-MainCard-Progress-Inner" />
        </div>
      </div>

      <div class="Signed-SubCard">
        <div class="fake-background Signed-SubCardItem">
          <p>过招单词</p>
          <p class="amo">
          <div class="number-flow-container">
            <NumberFlow :continuous="true" :will-change="true" :animated="true" :value="num" />
          </div>
          </p>
        </div>

        <div class="Signed-SubCardItem fake-background">
          <p>学分</p>
          <p class="amo">
          <div class="number-flow-container">
            <NumberFlow :continuous="true" :will-change="true" :animated="true" :value="score" />
          </div>
          </p>
        </div>
      </div>
    </template>

    <template #drawer>
      <div class="drawer-content">
        <component :is="displayComponent" :data="data" />
      </div>
    </template>

    <template #bg>
      <div class="Signed-Particles">
        <CoffettiParticle />
      </div>
    </template>
  </DrawerPage>
</template>

<style lang="scss">
.Signed {
  z-index: 100;
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.1), rgba(255, 255, 255, 0.05));
  display: flex;
  flex-direction: column;

  &::before {
    content: '';
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: linear-gradient(45deg, #1a1f3b, #2d4b8e);
    opacity: 0.3;
    z-index: -1;
  }
}

.Signed-Header {
  z-index: 1;
  position: relative;
  padding: 1.5rem;
  margin-top: 5%;
  margin-left: 5%;
  gap: 1rem;
  width: 90%;
  animation: fadeInDown 0.6s ease-out;
  flex-shrink: 0;

  h1 {
    display: flex;

    gap: 1rem;
    align-items: flex-end;

    font-size: 32px;
    font-weight: 700;
    background-image: linear-gradient(45deg, #00c6ff, #0072ff);
    background-clip: text;
    -webkit-background-clip: text;
    color: transparent;
    -webkit-text-fill-color: transparent;
  }

  .Signed-Header-Time {
    opacity: 0.9;
    font-size: 16px;
    font-weight: 500;
    background-image: linear-gradient(45deg, #ffffff, #e0e0e0);
    background-clip: text;
    -webkit-background-clip: text;
    color: transparent;
    -webkit-text-fill-color: transparent;
  }
}

.Signed-MainCard {
  z-index: 1;
  position: relative;
  padding: 1.5rem;
  margin: 2% 5%;
  width: 90%;
  min-height: 220px;
  flex-shrink: 0;
  border-radius: 28px;
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.18), rgba(255, 255, 255, 0.08));
  backdrop-filter: blur(20px);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  transform: translateY(20px);
  opacity: 0;
  animation: slideUp 0.6s ease-out forwards;
  animation-delay: 0.3s;

  p {
    font-size: 18px;
    font-weight: 500;
    background-image: linear-gradient(45deg, #ffffff, #e0e0e0);
    background-clip: text;
    -webkit-background-clip: text;
    color: transparent;
    -webkit-text-fill-color: transparent;
  }

  h1 {
    margin: 1.5rem 0;
    display: flex;
    align-items: center;
    gap: 0.5rem;

    .number-flow-container {
      display: block;
      font-size: 72px;
      font-weight: 800;
      color: var(--el-text-color-regular);
    }

    &>span {
      font-size: 24px;
      font-weight: 600;
      background-image: linear-gradient(45deg, #ffffff, #e0e0e0);
      background-clip: text;
      -webkit-background-clip: text;
      color: transparent;
      -webkit-text-fill-color: transparent;
    }
  }

  div[mt-8] {
    font-size: 16px;
    font-weight: 500;
    color: rgba(255, 255, 255, 0.9);
  }

  &-Progress {
    position: relative;
    margin: 1.5rem 0;
    height: 12px;
    width: 100%;
    overflow: hidden;
    border-radius: 6px;
    background: rgba(0, 0, 0, 0.1);

    &-Bar {
      position: absolute;
      top: 0;
      left: 0;
      width: var(--p);
      height: 100%;
      background: linear-gradient(90deg, #3498db, #2ecc71);
      transform: translateX(-100%);
      animation: progressSlide 1s ease-out forwards;
      animation-delay: 1s;
      box-shadow: 0 0 15px rgba(46, 204, 113, 0.4);
    }
  }
}

.Signed-SubCard {
  z-index: 1;
  position: relative;
  margin: 1.5rem 5%;
  display: flex;
  gap: 1rem;
  width: 90%;
  justify-content: space-between;
  flex-shrink: 0;

  &Item {
    position: relative;
    padding: 1.5rem;
    width: 48%;
    border-radius: 24px;
    background: linear-gradient(135deg, rgba(255, 255, 255, 0.15), rgba(255, 255, 255, 0.05));
    backdrop-filter: blur(20px);
    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
    border: 1px solid rgba(255, 255, 255, 0.1);
    transform: translateY(20px);
    opacity: 0;
    animation: slideUp 0.6s ease-out forwards;
    transition: transform 0.3s ease;

    &:nth-child(1) {
      animation-delay: 0.6s;
    }

    &:nth-child(2) {
      animation-delay: 0.8s;
    }

    &:hover {
      transform: translateY(-5px);
    }

    p:first-child {
      font-size: 16px;
      font-weight: 500;
      color: rgba(255, 255, 255, 0.9);
    }

    .amo {
      margin-top: 1rem;

      .number-flow-container {
        font-size: 48px;
        font-weight: 700;
        color: var(--el-color-primary);
      }
    }
  }
}

.Signed-Drawer {
  position: relative;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 520px;
  z-index: 100;
  transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);

  &.is-expanded {
    transform: translateY(0);
  }

  &-Handle {
    height: 80px;
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 12px 20px;
    cursor: pointer;
    position: relative;

    .handle-line {
      width: 36px;
      height: 4px;
      background: rgba(255, 255, 255, 0.3);
      border-radius: 2px;
      margin-bottom: 16px;
    }

    .close-button {
      position: absolute;
      top: 12px;
      right: 16px;
      padding: 8px 16px;
      border-radius: 20px;
      font-size: 14px;
      background: rgba(255, 255, 255, 0.1);
      color: rgba(255, 255, 255, 0.9);
      border: 1px solid rgba(255, 255, 255, 0.2);
      cursor: pointer;
      transition: all 0.3s ease;

      &:hover {
        background: rgba(255, 255, 255, 0.2);
      }
    }
  }

  &-Preview {
    width: 100%;

    &>span {
      display: block;
      font-size: 16px;
      font-weight: 500;
      color: rgba(255, 255, 255, 0.9);
      margin-bottom: 12px;
    }

    .preview-stats {
      display: flex;
      gap: 20px;
    }

    .preview-stat-item {
      display: flex;
      flex-direction: column;
      gap: 4px;

      .label {
        font-size: 12px;
        color: rgba(255, 255, 255, 0.6);
      }

      .value {
        font-size: 16px;
        font-weight: 600;
        background: linear-gradient(45deg, #00c6ff, #0072ff);
        -webkit-background-clip: text;
        background-clip: text;
        color: transparent;
      }
    }
  }

  &-Content {
    padding: 0 20px;
    margin-bottom: 100px;
  }
}

.Signed-CheckIn {
  display: none;
}

@keyframes fadeInDown {
  from {
    opacity: 0;
    transform: translateY(-20px);
  }

  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes slideUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }

  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes progressSlide {
  from {
    transform: translateX(-100%);
  }

  to {
    transform: translateX(0);
  }
}

// 为新的组件卡片预留的样式
.Component-Card {
  z-index: 1;
  position: relative;
  margin: 1.5rem 0;
  padding: 1.5rem;
  top: 8%;
  left: 5%;
  width: 90%;
  border-radius: 28px;
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(20px);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.1);
  transform: translateY(20px);
  opacity: 0;
  animation: slideUp 0.6s ease-out forwards;
  animation-delay: 1.2s;
}

.Signed-MainCard-Svg {
  position: absolute;
  top: 0;
  width: 40%;
  right: 10%;
  transform: translateY(-100%);

  img {
    width: 100%;
  }
}

.Signed-MainCard-SuccessSvg {
  position: absolute;
  top: 0;
  width: 40%;
  right: 0.5rem;

  img {
    width: 100%;
  }
}

.Signed-Particles {
  z-index: 0;
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
}

.number-flow-container {
  display: inline-flex;
  font-weight: 700;
  color: var(--el-color-primary);
}

.challenge-count {
  font-size: 20px !important;
  font-weight: 700;
  color: var(--el-color-primary) !important;
}

.preview-content {
  width: 100%;

  &>span {
    display: block;
    font-size: 16px;
    font-weight: 500;
    color: rgba(255, 255, 255, 0.9);
    margin-bottom: 12px;
  }

  .preview-stats {
    display: flex;
    gap: 20px;
  }

  .preview-stat-item {
    display: flex;
    flex-direction: column;
    gap: 4px;

    .label {
      font-size: 12px;
      color: rgba(255, 255, 255, 0.6);
    }

    .value {
      font-size: 16px;
      font-weight: 600;
      background: linear-gradient(45deg, #00c6ff, #0072ff);
      -webkit-background-clip: text;
      background-clip: text;
      color: transparent;
    }
  }
}

.drawer-header {
  padding: 0 20px;
  margin-bottom: 20px;

  &>span {
    display: block;
    font-size: 16px;
    font-weight: 500;
    color: rgba(255, 255, 255, 0.9);
    margin-bottom: 12px;
  }

  .preview-stats {
    display: flex;
    gap: 20px;
  }

  .preview-stat-item {
    display: flex;
    flex-direction: column;
    gap: 4px;

    .label {
      font-size: 12px;
      color: rgba(255, 255, 255, 0.6);
    }

    .value {
      font-size: 16px;
      font-weight: 600;
      background: linear-gradient(45deg, #00c6ff, #0072ff);
      -webkit-background-clip: text;
      background-clip: text;
      color: transparent;
    }
  }
}

.drawer-content {
  padding: 0 20px;
  margin-bottom: 100px;
}
</style>
