<script setup lang="ts">
import { onActivated, onMounted, onUnmounted, ref } from "vue";
import { onBeforeRouteLeave } from "vue-router";
import { ElMessage, ElMessageBox } from "element-plus";
import NumberFlow from "@number-flow/vue";
import AIProcessingMessages from "~/components/chore/AIProcessingMessages.vue";
import ModeSelector from "~/components/words/ModeSelector.vue";
import PlanSelector from "~/components/words/PlanSelector.vue";
import { useTargetData } from "~/modules/words";
import { globalPreference } from "~/modules/words/core/feat/preference";
import type { LeafPrepareSign } from "~/modules/words/mode";

const router = useRouter();
const { targetSignMode } = useTargetData();

/**
 * Enum for page status
 */
enum PreWordsStatus {
  Idle = "idle",
  Prepared = "prepared",
  Started = "started",
}

const loadingOptions = reactive<{
  loading: boolean;
  preProgress: number;
  progress: number;
  start: boolean;
  component: Component | null;
  prepare: LeafPrepareSign<any, any, any> | null;
}>({
  loading: false,
  preProgress: 0,
  progress: -1,
  start: false,
  component: null,
  prepare: null,
});

const dialogOptions = reactive<any>({
  visible: false,
  component: null,
});

const abnormalDialog = reactive({
  visible: false,
  message: "",
});

// 路由离开拦截
onBeforeRouteLeave(async (to, from, next) => {
  if (loadingOptions.start) {
    try {
      await ElMessageBox.confirm(
        "打卡尚未完成，离开页面将导致数据丢失，请确认是否继续？",
        "风险提示",
        {
          confirmButtonText: "确认离开",
          cancelButtonText: "取消",
          type: "warning",
        }
      );
      next(); // 用户确认离开
    } catch {
      next(false); // 用户取消
    }
  } else {
    next();
  }
});

// 浏览器刷新/关闭拦截
onMounted(() => {
  window.addEventListener("beforeunload", handleBeforeUnload);
});

onUnmounted(() => {
  window.removeEventListener("beforeunload", handleBeforeUnload);
});

function handleBeforeUnload(event: BeforeUnloadEvent) {
  if (loadingOptions.start) {
    const message = "打卡尚未完成，离开将导致数据丢失，确定要离开吗？";
    event.preventDefault();
    event.returnValue = message;
    return message;
  }
}

async function handleQuit() {
  try {
    await ElMessageBox.confirm(
      "打卡尚未完成，退出将导致数据丢失，确定要退出吗？",
      "风险提示",
      {
        confirmButtonText: "确认退出",
        cancelButtonText: "取消",
        type: "warning",
      }
    );
    loadingOptions.start = false;
  } catch {
    // 用户取消，不做任何操作
  }
}

function selectDict() {
  router.push({
    path: "/words/dict-select-page",
    query: {
      type: "select",
    },
  });
}

function selectPlan() {
  Object.assign(dialogOptions, {
    visible: true,
    component: PlanSelector,
  });
}

function selectMode() {
  Object.assign(dialogOptions, {
    visible: true,
    component: ModeSelector,
  });
}

function calculateTime(amo: number) {
  const mode = targetSignMode.value!;

  return mode.getEstimateCost(amo);
}

async function handleStart() {
  loadingOptions.loading = true;
  loadingOptions.progress = -1;

  const signMode = targetSignMode.value;

  if (!signMode) {
    ElMessage.error("请先选择词书和模式");

    return;
  }

  router.push({
    query: {
      status: "prepared",
      mode: globalPreference.value.mode,
    },
  });

  const prepared = signMode.prepareWords();

  loadingOptions.prepare = prepared;

  loadingOptions.preProgress = 0;

  const startTime = Date.now();

  while (Date.now() - startTime < 3800 && loadingOptions.preProgress < 100) {
    loadingOptions.preProgress += Math.random() * 5;

    await sleep(Math.random() * 10 + 10);
  }

  await sleep(500);

  loadingOptions.progress = -1;

  const done = await prepared.preload((p: number) => {
    loadingOptions.progress = Math.min(p * 100, 100);
  });

  if (!done) {
    loadingOptions.progress = -1;
    loadingOptions.loading = false;

    // 显示错误信息
    abnormalDialog.message = "单词数据加载失败，请稍后重试";
    abnormalDialog.visible = true;

    return;
  }

  // 确保进度显示为100%
  loadingOptions.progress = 100;

  // 加载组件
  loadingOptions.component = prepared.getTargetComponent();

  await sleep(500);

  // start - 这是关键步骤，设置为true表示开始学习
  loadingOptions.start = true;

  router.push({
    query: {
      status: "started",
      start: Date.now(),
      mode: globalPreference.value.mode,
    },
  });

  loadingOptions.progress = -1;
  loadingOptions.loading = false;
}

async function handleDone() {
  loadingOptions.start = false;
  await router.replace("/words/signed");
}

function handleBack() {
  router.push("/");
}

function resetQuery() {
  router.replace({
    query: {},
  });
}

onActivated(() => {
  const status = router.currentRoute.value.query.status as string | undefined;
  if (!status) {
    resetQuery();
    return;
  }
  switch (status) {
    case PreWordsStatus.Prepared:
      handleStart();
      break;
    case PreWordsStatus.Started:
      abnormalDialog.visible = true;
      abnormalDialog.message = "上次打卡未正常完成，数据已丢失，请重新开始。";
      resetQuery();
      break;
    default:
      resetQuery();
      break;
  }
});
</script>

<template>
  <RoutePage
    :class="{ wordVisible: loadingOptions.start, loading: loadingOptions.loading }"
    class="PreWordsPage"
  >
    <template #bg>
      <LeafBackground />
    </template>
    <div v-if="globalPreference.dict.data" class="PreWordsPage-Main">
      <div class="coffee-font PreWordsPage-Head">
        <span class="item-1 prewords-headword-item">W</span>
        <span class="prewords-headword-item item-2">O</span>
        <span class="prewords-headword-item item-3">R</span>
        <span class="prewords-headword-item item-4">D</span>
        <span class="prewords-headword-item item-5">S</span>
      </div>

      <p text-white class="transition-cubic head-title">准备打卡</p>
      <p text-white class="transition-cubic head-title next">稍等片刻</p>

      <div mt-8 class="transition-cubic PreWordsPage-Section flex flex-col gap-3">
        <LineArrow @click="selectDict">
          <template #icon>
            <div i-carbon:book />
          </template>
          <template #end>
            {{ globalPreference.dict.data?.name }}
          </template>
          选择词书
        </LineArrow>

        <LineArrow @click="selectPlan">
          <template #icon>
            <div i-carbon:plan />
          </template>
          <template #end> {{ globalPreference.amount }}个/组 </template>
          制定计划
        </LineArrow>

        <LineArrow @click="selectMode">
          <template #icon>
            <div i-carbon:apps />
          </template>
          <template #end>
            {{ targetSignMode!.getModeName() }}
          </template>
          实操模式
        </LineArrow>
      </div>
    </div>
    <div class="transition-cubic PreWordsPage-Supper">
      <div my-2 flex items-center justify-center gap-2 op-75>
        <div i-carbon-time />
        预计用时 {{ calculateTime(globalPreference.amount) }} 分钟
      </div>
      <LeafButton v-wave animated w-full @click="handleStart"> 开始打卡 </LeafButton>
      <!-- <el-button class="large-button" size="large" w-full type="primary" @click="handleStart">
        开始打卡
      </el-button> -->

      <p mt-6 cursor-pointer text-center @click="handleBack">
        <el-text type="danger" active:op-50> 退出 </el-text>
      </p>
    </div>

    <div class="transition-cubic PreWordsPage-Progress">
      <div class="progress-info-row" mb-1 flex items-center justify-between>
        <div class="ai-message-wrapper">
          <AIProcessingMessages :percentage="loadingOptions.preProgress / 100" />
        </div>
        <div v-if="loadingOptions.progress !== -1" class="progress-value">
          <NumberFlow
            suffix="%"
            :continuous="true"
            :will-change="true"
            :animated="true"
            :value="loadingOptions.progress"
          />
        </div>
      </div>

      <LineLoading :progress="loadingOptions.progress" />
    </div>

    <div class="transition-cubic PreWordPage-Loading">
      <BookLoading />
    </div>

    <teleport to="#rootMain">
      <div
        :class="{ wordVisible: loadingOptions.start }"
        class="transition-cubic PreWordsPage-Word"
      >
        <component
          :is="loadingOptions.component"
          v-if="loadingOptions.component"
          :prepare="loadingOptions.prepare"
          @quit="handleQuit"
          @done="handleDone"
        />
      </div>
    </teleport>

    <TouchDialog v-model="dialogOptions.visible">
      <template #Main>
        <component :is="dialogOptions.component" v-if="dialogOptions.component" />
      </template>
    </TouchDialog>

    <TouchDialog v-model="abnormalDialog.visible">
      <template #Main>
        <div style="padding: 24px; text-align: center">
          <p>{{ abnormalDialog.message }}</p>
          <el-button
            type="primary"
            style="margin-top: 16px"
            @click="abnormalDialog.visible = false"
            >确定</el-button
          >
        </div>
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
  bottom: 6%;

  opacity: 0;
  pointer-events: none;
  color: var(--el-text-color-secondary);

  p {
    margin-bottom: 4px;
  }

  .progress-info-row {
    margin-bottom: 4px;
  }

  .ai-message-wrapper {
    max-width: 70%;
    overflow: hidden;
  }

  .progress-value {
    font-weight: 500;
    min-width: 45px;
    text-align: right;
    padding-left: 10px;
  }
}

.PreWordsPage-Supper {
  .loading & {
    opacity: 0;
    pointer-events: none;
    transform: translateY(10%);
  }

  position: relative;
  margin: auto;

  top: 20%;

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
    content: "";
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
