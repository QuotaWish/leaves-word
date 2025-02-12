<script setup lang="ts">
import type { PrepareWord } from '~/composables/words/mode'
import NumberFlow from '@number-flow/vue'
import DictSelector from '~/components/words/DictSelector.vue'
import ModeSelector from '~/components/words/ModeSelector.vue'
import PlanSelector from '~/components/words/PlanSelector.vue'
import { globalData, useTargetData } from '~/composables/words'

const router = useRouter()
const { targetDict, targetSignMode } = useTargetData()

const loadingOptions = reactive<{
  loading: boolean
  progress: number
  start: boolean
  component: Component | null
  prepare: PrepareWord<any, any> | null
}>({
  loading: false,
  progress: -1,
  start: false,
  component: null,
  prepare: null,
})

const dialogOptions = reactive<any>({
  visible: false,
  component: null,
})

function selectDict() {
  Object.assign(dialogOptions, {
    visible: true,
    component: DictSelector,
  })
}

function selectPlan() {
  Object.assign(dialogOptions, {
    visible: true,
    component: PlanSelector,
  })
}

function selectMode() {
  Object.assign(dialogOptions, {
    visible: true,
    component: ModeSelector,
  })
}

function calculateTime(amo: number) {
  const mode = targetSignMode.value

  return mode.getEstimateCost(amo)
}

async function handleStart() {
  loadingOptions.loading = true
  loadingOptions.progress = -1

  const signMode = targetSignMode.value

  const prepared = signMode.prepareWords()

  loadingOptions.prepare = prepared

  await sleep(1200)

  loadingOptions.progress = 0

  await sleep(500)

  const done = await prepared.preload((p: number) => {
    loadingOptions.progress = Math.min(p * 100, 100)
  })

  if (!done) {
    loadingOptions.progress = -1
    loadingOptions.loading = false

    return
  }

  loadingOptions.component = prepared.getTargetComponent()

  await sleep(500)

  // start
  loadingOptions.start = true

  await sleep(500)

  loadingOptions.loading = false
  loadingOptions.progress = -1
}

useRouter().beforeEach((_to, _from, next) => {
  if (loadingOptions.loading) {
    next(false)

    return
  }

  if (loadingOptions.start) {
    loadingOptions.start = false

    next(false)

    return
  }

  next(true)
})

async function handleDone() {
  router.push('/words/signed')
}

function handleBack() {
  router.push('/')
}
</script>

<template>
  <RoutePage :class="{ wordVisible: loadingOptions.start, loading: loadingOptions.loading }" class="PreWordsPage">
    <template #bg>
      <LeafBackground />
    </template>
    <div class="PreWordsPage-Main">
      <div class="coffee-font PreWordsPage-Head">
        <span class="item-1 prewords-headword-item">W</span>
        <span class="prewords-headword-item item-2">O</span>
        <span class="prewords-headword-item item-3">R</span>
        <span class="prewords-headword-item item-4">D</span>
        <span class="prewords-headword-item item-5">S</span>
      </div>

      <p text-white class="transition-cubic head-title">
        准备打卡
      </p>
      <p text-white class="transition-cubic head-title next">
        稍等片刻
      </p>

      <div mt-8 class="transition-cubic PreWordsPage-Section flex flex-col gap-3">
        <LineArrow @click="selectDict">
          <template #icon>
            <div i-carbon:book />
          </template>
          <template #end>
            {{ targetDict.name }}
          </template>
          选择词书
        </LineArrow>

        <LineArrow @click="selectPlan">
          <template #icon>
            <div i-carbon:plan />
          </template>
          <template #end>
            {{ globalData.amount }}个/组
          </template>
          制定计划
        </LineArrow>

        <LineArrow @click="selectMode">
          <template #icon>
            <div i-carbon:apps />
          </template>
          <template #end>
            {{ targetSignMode.getModeName() }}
          </template>
          实操模式
        </LineArrow>
      </div>
    </div>
    <div class="transition-cubic PreWordsPage-Supper">
      <div my-2 flex items-center justify-center gap-2 op-75>
        <div i-carbon-time />预计用时 {{ calculateTime(globalData.amount) }} 分钟
      </div>
      <LeafButton v-wave animated w-full @click="handleStart">
        开始打卡
      </LeafButton>
      <!-- <el-button class="large-button" size="large" w-full type="primary" @click="handleStart">
        开始打卡
      </el-button> -->

      <p mt-6 cursor-pointer text-center @click="handleBack">
        <el-text active:op-50>
          退出
        </el-text>
      </p>
    </div>

    <div class="transition-cubic PreWordsPage-Progress">
      <p mb-1 flex items-center justify-between>
        <span>正在为您定制学习计划</span>
        <span v-if="loadingOptions.progress !== -1">
          <NumberFlow
            suffix="%" :continuous="true" :will-change="true" :animated="true"
            :value="loadingOptions.progress"
          />

        </span>
      </p>

      <LineLoading :progress="loadingOptions.progress" />
    </div>

    <div class="transition-cubic PreWordPage-Loading">
      <BookLoading />
    </div>

    <teleport to="#rootMain">
      <div :class="{ wordVisible: loadingOptions.start }" class="transition-cubic PreWordsPage-Word">
        <component
          :is="loadingOptions.component" v-if="loadingOptions.component" :prepare="loadingOptions.prepare"
          @quit="loadingOptions.start = false" @done="handleDone"
        />
      </div>
    </teleport>

    <TouchDialog v-model="dialogOptions.visible">
      <template #Main>
        <component :is="dialogOptions.component" v-if="dialogOptions.component" />
      </template>
    </TouchDialog>
  </RoutePage>
</template>

<style lang="scss">
.PreWordPage-Loading {
  .loading & {
    opacity: 1;
  }

  position: absolute;

  top: 50%;
  left: 50%;

  opacity: 0;
  pointer-events: none;
  transform: translate(-50%, 0);
}

.PreWordsPage-Word {
  &.wordVisible {
    opacity: 1;
    pointer-events: auto;

    border-radius: 0;
    transform: translateX(0);
  }

  z-index: 10;
  position: absolute;

  top: 0;
  left: 0;

  width: 100%;
  height: 100%;

  opacity: 0;
  overflow: hidden;
  border-radius: 25px;
  pointer-events: none;
  transform: translateX(100%);
  box-shadow: var(--el-box-shadow);
  background-color: var(--el-bg-color);
}

.PreWordsPage-Section {
  .loading & {
    opacity: 0;
    pointer-events: none;
    transform: translateY(-10%);
  }

  padding: 0 7.5%;
}

.PreWordsPage-Progress {
  .loading & {
    opacity: 1;
    pointer-events: auto;
    transform: translateY(0);
  }

  z-index: 1;
  position: absolute;

  margin: 0 auto;
  left: 7.5%;

  width: 85%;
  bottom: 5%;

  opacity: 0;
  pointer-events: none;
  color: var(--el-text-color-secondary);
}

.PreWordsPage-Supper {
  .loading & {
    opacity: 0;
    pointer-events: none;
    transform: translateY(10%);
  }

  position: relative;
  margin: auto;

  top: 10%;

  width: 85%;
}

.PreWordsPage-Head {
  .prewords-headword-item {
    &.item-1 {
      z-index: 5;
      transform: translateX(16px) rotateZ(-12deg);
    }

    &.item-2 {
      z-index: 4;
      transform: translateX(8px) rotateZ(12deg);
      background-color: #81b9b9;
    }

    &.item-3 {
      z-index: 3;
      transform: translateX(0px) rotateZ(-4deg);
    }

    &.item-4 {
      z-index: 2;
      transform: translateX(-8px) rotateZ(4deg);
      background-color: #f83d09;
    }

    &.item-5 {
      z-index: 1;
      transform: translateX(-16px) rotateZ(8deg);
    }

    position: relative;
    display: flex;

    width: 48px;
    height: 48px;

    align-items: center;
    justify-content: center;

    border-radius: 18px;
    background-color: var(--el-fill-color);
  }

  display: flex;
  padding: 2.5rem;

  justify-content: center;
}

.PreWordsPage-Main {
  .head-title {
    &.next {
      .loading & {
        opacity: 1;
        filter: blur(0);

        transform: translateY(0%);
      }

      opacity: 0;
      filter: blur(2px);

      transform: translateY(0);
    }

    position: relative;
    margin: 0 auto;

    font-size: 20px;
    font-weight: 600;

    opacity: 1;
    filter: blur(0);

    .loading & {
      opacity: 0;
      filter: blur(2px);

      pointer-events: none;
      transform: translateY(-100%);
    }
  }

  width: 100%;

  text-align: center;
}

.PreWordsPage {
  &::before {
    z-index: 0;
    content: '';
    position: absolute;

    left: 0;

    width: 100%;
    height: 60%;

    transition: 0.5s;
    opacity: 0.5;
    // border-radius: 0 0 200px 200px;
    background-color: var(--theme-color);

    transform: translateY(-54px);
  }

  // &::after {
  //   z-index: -1;
  //   content: '';
  //   position: absolute;

  //   top: 60%;
  //   left: 50%;

  //   width: 10%;
  //   height: 5%;

  //   // border-radius: 15px;
  //   transition: 0.5s;
  //   opacity: 0.75;
  //   transform: translate(-50%, -100%) scale(5);
  //   // clip-path: polygon(0% 0%, 0% 50%, 100% 50%, 100% 0%);
  //   // border-radius: 0 0 200px 200px;
  //   // background-color: var(--theme-color-light);
  //   // filter: blur(1px) brightness(80%) opacity(0.8);
  //   background: radial-gradient(var(--theme-color-light), var(--theme-color-dark));
  //   filter: blur(8px) brightness(80%); // drop-shadow(0 -10px 5px var(--theme-color-light));
  // }

  &.loading::before {
    transform: translateY(-50%);
  }

  &.wordVisible {
    transform: scale(0.95);
  }

  z-index: 1;
  display: flex;

  gap: 2rem;
  flex-direction: column;
  justify-content: space-between;
}
</style>
