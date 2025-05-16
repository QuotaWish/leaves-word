<script setup lang="ts">
import type { IRoutePageEmits, IRoutePageProps } from "./types";
import { PullRefresh } from "vant";

const props = withDefaults(defineProps<IRoutePageProps>(), {
  adapt: true,
  loading: false,
  enablePullRefresh: false,
});

const emits = defineEmits<IRoutePageEmits>();

const router = useRouter();

router.beforeEach(async (to, from, next) => {
  if (!props.loading)
    next();
});

const innerRefresh = ref(false);
async function handleRefresh() {
  await sleep(500);

  props.onrefresh?.(() => {
    innerRefresh.value = false;
  });
}
</script>

<template>
  <!-- :class="{ visible }" -->
  <WithPage
    v-bind="props"
    :class="{ empty, pageLoading: loading, loadingMask }"
    class="RoutePage transition-cubic absolute-layout flex flex-col"
  >
    <div class="RoutePage-Header">
      <slot name="header" />
    </div>

    <div
      :class="innerClass"
      class="RoutePage-Main relative w-full flex-1 overflow-hidden"
    >
      <PullRefresh
        v-model="innerRefresh"

        h-full w-full
        :disabled="!enablePullRefresh"
        @refresh="handleRefresh"
      >
        <slot />

        <div
          class="transition-cubic fake-background RoutePage-Loading absolute-layout z-1 h-full w-full flex flex-col items-center justify-center gap-4 p-4"
        >
          <Loading />
        </div>

        <!-- 加载提示 -->
        <template #loading>
          <div h-full w-full flex items-center justify-center>
            <Loading class="h-[24px] w-[24px]" />
          </div>
        </template>
      </PullRefresh>
    </div>

    <template #bg>
      <slot name="bg" />
    </template>

    <div
      class="RoutePage-Empty transition-cubic absolute-layout z-1 h-full w-full flex flex-col items-center justify-center gap-4 p-4"
    >
      <div class="RoutePage-Empty-Illusion">
        <div class="RoutePage-Empty-Illusion-Image">
          <img src="/svg/empty.svg" alt="empty" />
        </div>
        <div class="RoutePage-Empty-Illusion-Text">
          <slot name="empty">
            <div>
              <span>数据踏空而去...</span>
            </div>
          </slot>
        </div>
      </div>
    </div>
  </WithPage>
</template>

<style lang="scss" scoped>
.RoutePage-Loading {
  .RoutePage.pageLoading & {
    opacity: 1;
    pointer-events: all;
  }

  .RoutePage.loadingMask & {
    --fake-opacity: 1;
    --fake-color: var(--el-mask-color);
    background-color: transparent;
    // backdrop-filter: blur(18px) saturate(180%);
  }

  opacity: 0;
  pointer-events: none;
  background-color: var(--el-fill-color);
}

.RoutePage-Empty {
  &-Illusion {
    &-Image {
      width: 120px;
      height: 120px;
    }
  }

  .RoutePage.empty & {
    transform: scale(1) translateY(0);
  }

  background-color: var(--el-fill-color);

  transform: scale(0.8) translateY(300%);
}

.RoutePage {
  z-index: 1;

  user-select: none;
  // border-radius: 18px;
  // transform: translateX(120%);
  background-color: var(--el-fill-color);

  &-Header {
    :deep(.van-nav-bar) {
      .van-icon,
      .van-nav-bar__text {
        color: var(--theme-color-primary, var(--theme-color));
      }

      &::after {
        border-bottom: none !important;
      }

      // padding-top: 0.5rem;
    }
  }

  // &.visible {
  //   border-radius: 0;
  //   transform: translateX(0);
  // }
}
</style>
