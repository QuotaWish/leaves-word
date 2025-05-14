<script setup lang="ts">
import { PullRefresh } from "vant";
import {
  UniEventAtBackButton,
  uniEventBus,
} from "~/composables/adapter/uniapp";
import { IRoutePageEmits, IRoutePageProps } from "./types";

const props = withDefaults(defineProps<IRoutePageProps>(), {
  adapt: true,
  loading: false,
  enablePullRefresh: false,
});

const emits = defineEmits<IRoutePageEmits>();

const router = useRouter();
function handleBackButton(event: any) {
  if (event !== UniEventAtBackButton) return;

  if (props.loading) return;

  router.back();
}

onMounted(() => {
  uniEventBus.on(handleBackButton);
});

onBeforeUnmount(() => {
  uniEventBus.off(handleBackButton);
});

onDeactivated(() => {
  uniEventBus.off(handleBackButton);
});

onUnmounted(() => {
  uniEventBus.off(handleBackButton);
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
    :adapt="adapt"
    :class="{ pageLoading: loading, loadingMask }"
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
        :disabled="!enablePullRefresh"
        h-full
        @refresh="handleRefresh"
        v-model="innerRefresh"
      >
        <!-- 加载提示 -->
        <template #loading>
          <div flex justify-center items-center w-full h-full>
            <Loading class="w-[24px] h-[24px]" />
          </div>
        </template>
        <slot />
      </PullRefresh>

      <div
        class="transition-cubic fake-background RoutePage-Loading absolute-layout z-1 h-full w-full flex flex-col items-center justify-center gap-4 p-4"
      >
        <Loading />
      </div>
    </div>

    <template #bg>
      <slot name="bg" />
    </template>
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
