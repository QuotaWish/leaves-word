<script setup lang="ts">
import PlanSelector from '~/components/words/PlanSelector.vue'
import { calendarManager, globalData, useTargetData } from '~/composables/words'

import WordSignInfoCard from './card/WordSignInfoCard.vue'
import Cat from '/svg/cat.svg'
import Checked from '/svg/complete.svg'

const emits = defineEmits(['sign'])

const router = useRouter()

const { targetDict, targetSignMode } = useTargetData()
const data = computed<any>(() => targetDict.value)

const storage = computed(() => data.value.storage)
const learnedAmo = computed(() => storage.value.getLearnedWords().length)
const totalAmo = computed(() => data.value.words.length)

const progress = computed(() => learnedAmo.value / totalAmo.value)
const todayData = computed(() => calendarManager.getTodayData())

function calculateTime(amo: number) {
  const mode = targetSignMode.value
  if (!mode) {
    return 0
  }

  return mode.getEstimateCost(amo)
}

const dialogOptions = reactive<any>({
  visible: false,
  component: null,
})

function selectDict() {
  router.push('/words/dict-select-page')
  // Object.assign(dialogOptions, {
  //   visible: true,
  //   component: DictSelector,
  // })
}

function selectPlan() {
  Object.assign(dialogOptions, {
    visible: true,
    component: PlanSelector,
  })
}
</script>

<template>
  <WordSignInfoCard :class="{ signed: todayData?.signed }" text-black class="transition-cubic WordSignInfo-Wrapper">
    <div class="leaf-decoration top-left" />
    <div class="leaf-decoration bottom-right" />

    <template #upper>
      <div class="WordSignInfo-Svg">
        <img :src="Cat">
      </div>

      <div class="WordSignInfo-Dictionary" @click="router.push(`/dictionary/${targetDict.id}`)">
        <DictionaryDisplay :dict="data" />
      </div>

      <div class="WordSignInfo-Content">
        <p w-full flex justify-between class="WordSignInfo-Content-Title">
          <span>{{ data.name }}</span>
          <span mr-4 flex items-center text-sm font-normal op-75 active:op-100 @click="selectDict">
            调整词书
            <i i-carbon-chevron-right block />
          </span>
        </p>
        <p w-full flex items-center justify-between class="WordSignInfo-Content-Desc">
          <span>{{ learnedAmo }} /{{ totalAmo }} 已学习</span>
          <span mr-4 text-sm op-75>剩余 {{ Math.ceil((totalAmo - learnedAmo) / globalData.amount) }} 天</span>
        </p>
        <div :style="`--p: ${progress * 100}%`" class="WordSignInfo-Content-Progress">
          <div class="WordSignInfo-Content-Progress-Bg" />
          <div v-if="progress" class="transition-cubic WordSignInfo-Content-Progress-Inner" />
        </div>
      </div>
    </template>

    <template #lower>
      <p w-full flex items-center justify-between>
        <span font-bold class="title">今日计划</span>
        <!-- <span text-sm>随时随地，单词好记</span> -->
        <span flex items-center text-sm font-normal op-75 active:op-100 @click="selectPlan">
          调整计划
          <i i-carbon-chevron-right block />
        </span>
      </p>

      <div my-4 flex items-center justify-between class="WordSignInfo-DetailBlockWrapper">
        <template v-if="todayData?.signed">
          <div class="WordSignInfo-DetailBlock coffee-font">
            <p text-sm font-bold op-75>
              已学习
            </p>

            <p>
              <span mr-3 text-3xl font-bold>
                {{ todayData.data?.words.length }}
              </span> 词
            </p>
          </div>
        </template>
        <template v-else>
          <div class="WordSignInfo-DetailBlock">
            <p text-sm op-75>
              需新学
            </p>

            <p>
              <span mr-3 text-3xl font-bold>
                {{ globalData.amount }}
              </span> 词
            </p>
          </div>
          <div class="WordSignInfo-DetailBlock">
            <p text-sm op-75>
              需复习
            </p>

            <p>
              <span mr-3 text-3xl font-bold>
                {{ globalData.amount }}
              </span>词
            </p>
          </div>
        </template>
      </div>

      <template v-if="!todayData?.signed">
        <LeafButton animated w-full @click="emits('sign')">
          <span>开始背单词吧</span>
        </LeafButton>

        <div my-2 flex items-center justify-center gap-1 text-sm op-75>
          <div i-carbon-time />预计用时 {{ calculateTime(globalData.amount) }} 分钟
        </div>
      </template>

      <template v-else>
        <el-button w="30%" size="large" type="primary" @click="router.replace({ query: { signed: 'true' } })">
          <span>打卡</span>
        </el-button>

        <div my-2 ml-1 flex items-center gap-1 text-sm op-75>
          随时随地，单词好记。
        </div>

        <div class="WordSignInfo-Checked">
          <img :src="Checked">
        </div>
      </template>
    </template>

    <TouchDialog v-model="dialogOptions.visible">
      <template #Main>
        <component :is="dialogOptions.component" v-if="dialogOptions.component" />
      </template>
    </TouchDialog>
  </WordSignInfoCard>
</template>

<style lang="scss">
.WordSignInfo-Content {
  .WordSignInfo-Content-Title {
    color: var(--theme-color-dark);
    font-weight: 600;
    font-size: 1.1em;
    letter-spacing: 0.01em;

    span[mr-4] {
      font-size: 0.9em;
      opacity: 0.75;
      transition: all 0.3s ease;

      &:hover {
        opacity: 1;
      }
    }
  }

  .WordSignInfo-Content-Desc {
    margin: 0.75em 0;
    color: var(--theme-color);
    opacity: 0.85;
    font-size: 0.95em;
  }

  position: relative;
  padding: 1.25rem 0;
  display: flex;
  margin-left: 10%;
  flex: 1;
  flex-direction: column;
  justify-content: space-between;

  .dark & {
    .WordSignInfo-Content-Title {
      color: rgba(255, 255, 255, 0.95);
    }

    .WordSignInfo-Content-Desc {
      color: rgba(255, 255, 255, 0.7);
    }
  }
}

.WordSignInfo-Content-Progress {
  position: relative;
  width: 90%;
  height: 8px;
  // margin: 8px 0;

  .WordSignInfo-Content-Progress-Bg {
    position: absolute;
    inset: 0;
    opacity: 0.2;
    border-radius: 12px;
    background-color: var(--theme-color);
    overflow: hidden;

    &::after {
      content: '';
      position: absolute;
      inset: 0;
      background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
    }
  }

  .WordSignInfo-Content-Progress-Inner {
    position: absolute;
    width: var(--p);
    height: 100%;
    border-radius: 12px;
    background: linear-gradient(90deg, var(--theme-color), var(--theme-color-dark));
    box-shadow: 0 0 10px var(--theme-color);
    transition: width 0.8s cubic-bezier(0.4, 0, 0.2, 1);
    overflow: hidden;

    &::before {
      content: '';
      position: absolute;
      inset: 0;
      background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.3), transparent);
      animation: shimmer 2s linear infinite;
    }

    &::after {
      content: '';
      position: absolute;
      top: 0;
      right: 0;
      width: 3px;
      height: 100%;
      background: #fff;
      opacity: 0.8;
      filter: blur(1px);
    }
  }
}

.WordSignInfo-DetailBlockWrapper {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1rem;
  margin: 1.25rem 0;
}

.WordSignInfo-DetailBlock {
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(8px);
  border-radius: 16px;
  padding: 1rem;
  border: 1px solid rgba(255, 255, 255, 0.15);
  transition: all 0.3s ease;

  // &:hover {
  //   background: rgba(255, 255, 255, 0.15);
  //   transform: translateY(-1px);
  // }

  p {
    &:first-child {
      font-size: 0.9em;
      margin-bottom: 0.5rem;
    }

    &:last-child {
      font-size: 1.1em;
      font-weight: 500;
    }
  }
}

.large-button {
  background: rgba(255, 255, 255, 0.15) !important;
  border: 1px solid rgba(255, 255, 255, 0.2) !important;
  backdrop-filter: blur(8px);
  height: 48px !important;
  font-size: 1.1em !important;
  letter-spacing: 0.02em;
  transition: all 0.3s ease !important;

  // &:hover {
  //   background: rgba(255, 255, 255, 0.2) !important;
  //   transform: translateY(-1px);
  // }

  &:active {
    transform: translateY(0);
  }
}

.WordSignInfo-Svg {
  z-index: 1;
  position: absolute;
  bottom: 0;
  width: 40%;

  right: 5%;
  transform: translate(0, 10%);
  // background-image: linear-gradient(to right, var(--theme-color), var(--theme-color-dark));
}

.WordSignInfo-Wrapper {
  position: relative;
  display: flex;
  left: 5%;
  width: 90%;
  // height: 325px;
  flex-direction: column;
  justify-content: center;
  // overflow: hidden;
  user-select: none;
  border-radius: 25px;
  filter: drop-shadow(0 0 12px rgba(0, 0, 0, 0.15));
  // background: rgba(255, 255, 255, 0.85);
  backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);

  .leaf-decoration {
    position: absolute;
    width: 40px;
    height: 40px;
    opacity: 0.08;
    background-image: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path fill="%2390EE90" d="M17,8C8,10 5.9,16.17 3.82,21.34L5.71,22L6.66,19.7C7.14,19.87 7.64,20 8,20C19,20 22,3 22,3C21,5 14,5.25 9,6.25C4,7.25 2,11.5 2,13.5C2,15.5 3.75,17.25 3.75,17.25C7,8 17,8 17,8Z"/></svg>');
    background-size: contain;
    background-repeat: no-repeat;
    pointer-events: none;
    transition: all 0.3s ease;
  }

  .top-left {
    top: 20px;
    left: 20px;
    transform: rotate(-45deg);
  }

  .bottom-right {
    bottom: 20px;
    right: 20px;
    transform: rotate(135deg);
  }

  // &:hover {
  //   transform: translateY(-2px);
  //   filter: drop-shadow(0 0 16px rgba(0, 0, 0, 0.2));
  //   // background: rgba(255, 255, 255, 0.95);

  //   .leaf-decoration {
  //     opacity: 0.12;
  //     transform: scale(1.1) rotate(var(--rotation));
  //   }

  //   .top-left {
  //     --rotation: -45deg;
  //   }

  //   .bottom-right {
  //     --rotation: 135deg;
  //   }
  // }

  &:active {
    transform: translateY(0);
    filter: drop-shadow(0 0 8px rgba(0, 0, 0, 0.1));
  }

  // .dark & {
  //   background: rgba(18, 18, 18, 0.85);
  //   border-color: rgba(255, 255, 255, 0.1);

  //   &:hover {
  //     background: rgba(28, 28, 28, 0.95);
  //   }
  // }
}

@keyframes progressGrowth {
  from {
    width: 0;
  }

  to {
    width: var(--p, 0);
  }
}

.WordSignInfo-Content {
  .WordSignInfo-Content-Title {
    color: var(--theme-color-dark);
    font-weight: 600;
  }

  .WordSignInfo-Content-Desc {
    margin-bottom: 0.5em;
    color: var(--theme-color);
    opacity: 0.85;
  }

  position: relative;
  padding: 1.25rem 0;
  display: flex;
  margin-left: 10%;
  flex: 1;
  flex-direction: column;
  justify-content: space-between;

  .dark & {
    .WordSignInfo-Content-Title {
      color: rgba(255, 255, 255, 0.95);
    }

    .WordSignInfo-Content-Desc {
      color: rgba(255, 255, 255, 0.7);
    }
  }
}

// .WordSignInfo-Content-Progress {
//   position: relative;
//   width: 90%;
//   height: 8px;
//   margin: 8px 0;

//   .WordSignInfo-Content-Progress-Bg {
//     position: absolute;
//     inset: 0;
//     opacity: 0.15;
//     border-radius: 16px;
//     background-color: var(--theme-color);
//   }

//   .WordSignInfo-Content-Progress-Inner {
//     position: absolute;
//     width: var(--p);
//     height: 100%;
//     border-radius: 16px;
//     background: linear-gradient(90deg, var(--theme-color), var(--theme-color-dark));
//     box-shadow: 0 0 10px var(--theme-color);
//     transition: width 0.8s cubic-bezier(0.4, 0, 0.2, 1);

//     overflow: hidden;

//     &::before {
//       content: '';
//       position: absolute;

//       top: 0;
//       left: 0;

//       width: 100%;
//       height: 100%;

//       border-radius: inherit;
//       background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.3), transparent);
//       animation: shimmer 2s linear infinite;
//     }

//     &::after {
//       content: '';
//       position: absolute;
//       top: 0;
//       right: 0;
//       width: 4px;
//       height: 100%;
//       border-radius: 2px;
//       background: #fff;
//       opacity: 0.8;
//       filter: blur(1px);
//     }
//   }
// }

.WordSignInfo-Detail {
  .title {
    font-size: 1.1em;
    font-weight: 600;
    color: var(--el-text-color-primary);
  }
}

@keyframes shimmer {
  0% {
    transform: translateX(-100%);
  }
  100% {
    transform: translateX(100%);
  }
}

.WordSignInfo-Svg {
  z-index: 1;
  position: absolute;
  display: flex;

  width: 30%;

  left: -0.5rem;
  bottom: 0;

  align-items: flex-end;

  transform: scaleX(-1);
}

.signed .WordSignInfo-Svg {
  left: unset;
  right: -0.5rem;

  transform: scale(1);
}

.WordSignInfo-Dictionary {
  position: relative;

  top: 10%;
  left: 5%;

  width: 80px;
  height: 80%;
}
</style>
