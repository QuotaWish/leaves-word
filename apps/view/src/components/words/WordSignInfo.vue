<script setup lang="ts">
import PlanSelector from "~/components/words/PlanSelector.vue";
import {
  calendarData,
  calendarManager,
  globalPreference,
  useTargetData,
} from "~/modules/words";

import LeafSpeedButton from "../button/LeafSpeedButton.vue";
import WordSignInfoCard from "./card/WordSignInfoCard.vue";
import ModeSelector from "./ModeSelector.vue";
import Cat from "/svg/cat.svg";
import Checked from "/svg/complete.svg";

const router = useRouter();

const { targetSignMode } = useTargetData();
const dictionary = computed(() => globalPreference.value.dict);

// const storage = computed(() => dictionary.value?.storage);
const learnedAmo = computed(() => 5); // storage.value?.getLearnedWords().length ?? 0);
const totalAmo = computed(() => dictionary.value.data?.published_words ?? 0);

const progress = computed(() => learnedAmo.value / totalAmo.value);
const todayData = ref()

onMounted(() => {
  todayData.value = calendarManager.getTodayData()

  console.log("todayData", todayData)
})

function calculateTime(amo: number) {
  const mode = targetSignMode.value;
  if (!mode) {
    return 0;
  }

  return mode.getEstimateCost(amo);
}

const dialogOptions = reactive({
  visible: false,
  component: null,
});

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

async function handleCheckSign() {
  await sleep(300);

  router.push("/words/prewords");
}
</script>

<template>
  <WordSignInfoCard
    :class="{ signed: todayData?.signed }"
    text-black
    class="transition-cubic WordSignInfo-Wrapper transition-duration-500"
  >
    <div class="leaf-decoration top-left" />
    <div class="leaf-decoration bottom-right" />

    <template v-if="dictionary?.data" #upper>
      <div class="WordSignInfo-Svg">
        <img :src="Cat" />
      </div>

      <div
        class="WordSignInfo-Dictionary"
        @click="router.push(`/dictionary/${dictionary.id}`)"
      >
        <DictionaryBookDisplay only-image :model-value="dictionary.data" />
      </div>

      <div class="WordSignInfo-Content">
        <p w-full flex justify-between class="WordSignInfo-Content-Title">
          <span>{{ dictionary.data?.name }}</span>
          <span
            mr-4
            flex
            items-center
            text-sm
            font-normal
            op-75
            active:op-100
            @click="selectDict"
          >
            调整词书
            <i i-carbon-chevron-right block />
          </span>
        </p>
        <p
          w-full
          flex
          items-center
          justify-between
          class="WordSignInfo-Content-Desc"
        >
          <span>{{ learnedAmo }}/{{ totalAmo }} 已学习</span>
          <span mr-4 text-sm op-75>剩余
            {{ Math.ceil((totalAmo - learnedAmo) / globalPreference.amount) }}
            天</span>
        </p>
        <LineProgress :progress="progress" />
      </div>
    </template>

    <template #lower>
      <p w-full flex items-center justify-between>
        <span font-bold class="title">今日计划</span>
        <span
          v-if="!todayData?.signed && targetSignMode"
          flex
          items-center
          gap-1
          text-sm
          op-50
          @click="selectMode"
        >
          {{ targetSignMode.getModeName() }}
          <i i-carbon:chevron-sort block />
        </span>
        <span
          flex
          items-center
          text-sm
          font-normal
          op-75
          active:op-100
          @click="selectPlan"
        >
          调整计划
          <i i-carbon-chevron-right block />
        </span>
      </p>

      <div
        my-4
        flex
        items-center
        justify-between
        class="WordSignInfo-DetailBlockWrapper"
      >
        <template v-if="todayData?.signed">
          <div class="WordSignInfo-DetailBlock">
            <p text-sm font-bold op-75>
              已学习
            </p>

            <p>
              <span mr-3 text-3xl font-bold>
                {{ todayData.data?.words.length }}
              </span>
              词
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
                {{ globalPreference.amount }}
              </span>
              词
            </p>
          </div>
          <div class="WordSignInfo-DetailBlock">
            <p text-sm op-75>
              需复习
            </p>

            <p>
              <span mr-3 text-3xl font-bold>
                {{ globalPreference.amount }} </span>词
            </p>
          </div>
        </template>
      </div>

      <template v-if="!todayData?.signed">
        <LeafSpeedButton w-full @click="handleCheckSign">
          <span>开始背单词吧</span>
        </LeafSpeedButton>
        <!-- <LeafButton animated w-full @click="emits('sign')">
          <span>开始背单词吧</span>
        </LeafButton> -->

        <div my-4 flex items-center justify-center gap-1 text-sm op-75>
          <div i-carbon-time />
          预计用时 {{ calculateTime(globalPreference.amount) }} 分钟
        </div>
      </template>

      <template v-else>
        <LeafButton class="w-[30%]" plain @click="router.push('/words/signed')">
          打卡
        </LeafButton>

        <div my-4 ml-1 flex items-center gap-1 text-sm op-75>
          随时随地，单词好记。
        </div>

        <div class="WordSignInfo-Checked">
          <img :src="Checked" />
        </div>
      </template>
    </template>

    <template #loading>
      <div flex flex-col items-center justify-center gap-2>
        <Loading />
        <span text-sm op-75>获取数据中...</span>
      </div>
    </template>

    <template #empty>
      <div class="WordSignInfo-Empty">
        <div class="WordSignInfo-Empty-Icon">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            class="empty-book-svg"
          >
            <path
              d="M21,4H3C1.9,4,1,4.9,1,6v13c0,1.1,0.9,2,2,2h18c1.1,0,2-0.9,2-2V6C23,4.9,22.1,4,21,4z M21,19H3V6h18V19z M10,14h8v2h-8V14z M10,10h8v2h-8V10z M5,10h3v2H5V10z M5,14h3v2H5V14z"
            />
          </svg>
        </div>
        <div class="WordSignInfo-Empty-Title">
          暂未选择词书
        </div>
        <div class="WordSignInfo-Empty-Desc">
          选择词书以立即开始
        </div>
        <LeafButton plain class="WordSignInfo-Empty-Button" @click="selectDict">
          选择词书
        </LeafButton>
      </div>
    </template>

    <TouchDialog v-model="dialogOptions.visible">
      <template #Main>
        <component
          :is="dialogOptions.component"
          v-if="dialogOptions.component"
        />
      </template>
    </TouchDialog>
  </WordSignInfoCard>
</template>

<style lang="scss">
.WordSignInfo-Empty-Button {
  width: 80%;
  margin: 0 auto;
}

.WordSignInfo-Checked {
  position: absolute;

  top: 50%;
  right: 0;

  width: 50%;
  height: 50%;

  transform: translate(0, -50%);
}

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

.WordSignInfo-Empty {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 2.5rem 2rem;
  text-align: center;

  .WordSignInfo-Empty-Icon {
    width: 80px;
    height: 80px;
    margin-bottom: 1.5rem;

    .empty-book-svg {
      width: 100%;
      height: 100%;
      fill: var(--theme-color-primary);
      opacity: 0.8;
    }
  }

  .WordSignInfo-Empty-Title {
    font-size: 1.2rem;
    font-weight: 500;
    color: var(--el-text-color-primary);
    margin-bottom: 0.5rem;
  }

  .WordSignInfo-Empty-Desc {
    opacity: 0.75;
    font-size: 0.95rem;
    color: var(--el-text-color-primary);
    margin-bottom: 1.5rem;
  }

  .WordSignInfo-Empty-Button {
    min-width: 120px;
    font-weight: normal;
  }
}
</style>
