<script setup lang="ts">
import NumberFlow from '@number-flow/vue'
import { dayjs } from 'element-plus'
import { calendarManager } from '~/composables/words'
import { useGlobalSplashState } from '~/modules/splash'
import Astronaut from '/svg/astronaut.svg'
import Mello from '/svg/mello.svg'

const props = defineProps<{
  modelValue: boolean
}>()

const emits = defineEmits<{
  (e: 'update:modelValue', value: boolean): void
}>()

const num = ref(0)
const score = ref(0)
const days = ref(0)
const timeText = ref('')

const router = useRouter()
const route = useRoute()

const visible = useVModel(props, 'modelValue', emits)

watchEffect(() => {
  if (route.query.signed) {
    visible.value = true
  }
})

const globalSplashState = useGlobalSplashState()
watch(visible, visible => globalSplashState.footerVisible.value = !visible)

watch(visible, async (visible) => {
  if (!visible) {
    num.value = score.value = days.value = 0

    router.replace({
      query: {
        ...route.query,
        signed: undefined,
      },
    })
    return
  }

  const todayData = calendarManager.getTodayData()!

  if (!todayData?.signed) {
    router.push('/')

    return
  }

  timeText.value = dayjs(new Date(todayData.data!.date)).format('YYYY-MM-DD')

  await sleep(100)

  days.value = 1

  await sleep(300)

  num.value = todayData.data!.words.length

  await sleep(100)

  score.value = todayData.data!.words.length * 1.5
})
</script>

<template>
  <div :class="{ visible }" class="Signed transition-cubic">
    <div class="Signed-Header">
      <h1>今日已完成!</h1>
      <div class="Signed-Header-Time">
        {{ timeText }}
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
        <span font-bold>
          <NumberFlow :prefix="days < 10 ? '0' : ''" :continuous="true" :will-change="true" :animated="true" :value="days" />
        </span>天
      </h1>

      <div mt-8 w-full flex items-center justify-between>
        挑战 7 天不断电
        <span font-bold op-75>1/7</span>
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
          <NumberFlow :continuous="true" :will-change="true" :animated="true" :value="num" />
        </p>
      </div>

      <div class="Signed-SubCardItem fake-background">
        <p>学分</p>
        <p class="amo">
          <NumberFlow :continuous="true" :will-change="true" :animated="true" :value="score" />
        </p>
      </div>
    </div>

    <div class="fake-background Signed-CheckIn">
      <el-button w-full size="large" type="primary" @click="visible = false">
        关闭
      </el-button>
    </div>

    <div v-if="visible" class="Signed-Particles">
      <vue-particles
        id="tsparticles" :options="{
          background: {
            color: {
              value: '',
            },
          },
          fpsLimit: 120,
          interactivity: {
            events: {
              onClick: {
                enable: true,
                mode: 'push',
              },
              onHover: {
                enable: true,
                mode: 'repulse',
              },
            },
            modes: {
              bubble: {
                distance: 400,
                duration: 2,
                opacity: 0.8,
                size: 40,
              },
              push: {
                quantity: 4,
              },
              repulse: {
                distance: 200,
                duration: 0.4,
              },
            },
          },
          particles: {
            color: {
              value: '#ffffff',
            },
            links: {
              color: '#ffffff',
              distance: 150,
              enable: true,
              opacity: 0.5,
              width: 1,
            },
            move: {
              direction: 'none',
              enable: true,
              outModes: 'bounce',
              random: false,
              speed: 6,
              straight: false,
            },
            number: {
              density: {
                enable: true,
              },
              value: 80,
            },
            opacity: {
              value: 0.5,
            },
            shape: {
              type: 'circle',
            },
            size: {
              value: { min: 1, max: 5 },
            },
          },
          detectRetina: true,
        }"
      />
    </div>
  </div>
</template>

<style lang="scss">
.Signed-Header {
  z-index: 1;
  position: relative;
  padding: 1rem;

  top: 5%;
  left: 5%;

  gap: 1rem;
  width: 90%;

  h1 {
    font-size: 24px;
  }

  .Signed-Header-Time {
    opacity: 0.75;
    font-size: 16px;
    font-weight: 600;
  }
}

.Signed-CheckIn {
  z-index: 1;
  position: sticky;
  padding: 1rem;

  top: 100%;
  left: 0;

  width: 100%;

  border-radius: 25px 25px 0 0;
  color: var(--el-text-color-regular);
  box-shadow: var(--el-box-shadow);

  backdrop-filter: blur(18px) saturate(180%);
}

.Signed-Particles {
  z-index: 0;
  position: absolute;

  top: 0;
  left: 0;

  width: 100%;
  height: 100%;

  // background-color: #00000050;
}

.Signed-MainCard-Progress {
  .Signed-MainCard-Progress-Bar {
    position: absolute;

    top: 0;
    left: 0;

    width: var(--p);
    height: 100%;

    background-color: var(--theme-color);
  }
  position: relative;
  margin: 1rem 0;

  height: 20px;
  width: 100%;

  overflow: hidden;
  border-radius: 8px;
  background-color: var(--el-fill-color-darker);
}

.Signed-SubCard {
  &Item {
    .amo {
      font-weight: 600;
      font-size: 28px;
    }
    position: relative;
    padding: 1rem;

    width: 50%;

    border-radius: 25px;
    color: var(--el-text-color-regular);
    box-shadow: var(--el-box-shadow);
    backdrop-filter: blur(18px) saturate(180%);
  }
  z-index: 1;
  position: relative;
  margin: 1rem 0;
  display: flex;

  top: 10%;
  left: 5%;

  gap: 1rem;
  width: 90%;

  justify-content: space-between;
}

.Signed-MainCard {
  &-Svg {
    position: absolute;

    top: 0;
    width: 40%;

    right: 10%;

    transform: translateY(-100%);

    img {
      width: 100%;
    }
  }

  &-SuccessSvg {
    position: absolute;

    top: 0;
    width: 40%;

    right: 0.5rem;

    img {
      width: 100%;
    }
  }

  h1 {
    margin: 1rem 0;
    span {
      margin-right: 0.25rem;
      font-size: 36px;
    }
  }
  z-index: 1;
  position: relative;
  padding: 1rem;

  top: 10%;
  left: 5%;

  width: 90%;
  height: 220px;

  border-radius: 25px;
  box-shadow: var(--el-box-shadow);
  color: var(--el-text-color-regular);
  backdrop-filter: blur(18px) saturate(180%);
}

.Signed {
  &.visible {
    transform: translateX(0);
    pointer-events: all;
  }

  .dark &::before {
    opacity: 0.5;
  }

  &::before {
    content: '';
    position: absolute;

    top: 0;
    left: 0;

    width: 100%;
    height: 100%;

    transform: scale(1.25);
    filter: hue-rotate(180deg) brightness(80%) blur(2px) saturate(180%);
    background:
      radial-gradient(circle farthest-side at 0% 50%, #fb1 23.5%, rgba(240, 166, 17, 0) 0) 21px 30px,
      radial-gradient(circle farthest-side at 0% 50%, #b71 24%, rgba(240, 166, 17, 0) 0) 19px 30px,
      linear-gradient(#fb1 14%, rgba(240, 166, 17, 0) 0, rgba(240, 166, 17, 0) 85%, #fb1 0) 0 0,
      linear-gradient(
          150deg,
          #fb1 24%,
          #b71 0,
          #b71 26%,
          rgba(240, 166, 17, 0) 0,
          rgba(240, 166, 17, 0) 74%,
          #b71 0,
          #b71 76%,
          #fb1 0
        )
        0 0,
      linear-gradient(
          30deg,
          #fb1 24%,
          #b71 0,
          #b71 26%,
          rgba(240, 166, 17, 0) 0,
          rgba(240, 166, 17, 0) 74%,
          #b71 0,
          #b71 76%,
          #fb1 0
        )
        0 0,
      linear-gradient(90deg, #b71 2%, #fb1 0, #fb1 98%, #b71 0%) 0 0 #fb1;
    background-size: 40px 60px;
  }
  z-index: 100;
  position: absolute;
  // padding: 1rem;

  top: 0;
  left: 0;

  width: 100%;
  height: 100%;

  pointer-events: none;
  transform: translateX(120%);
  --fake-opacity: 0.85;
  --fake-color: var(--el-fill-color-dark);

  backdrop-filter: blur(18px) saturate(180%);
}
</style>
