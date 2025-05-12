<script setup lang="ts">
import PageNavHolder from "./holder/PageNavHolder.vue";

withDefaults(
  defineProps<{
    title: string;
    empty?: boolean;
    header?: boolean;
    loading?: boolean;
    contentPadding?: boolean;
  }>(),
  {
    contentPadding: true,
  },
);

const router = useRouter();

const scroller = useTemplateRef("scroll");
const scrollOptions = reactive({
  lastY: 0,
  stepY: 0,
  next: false,
  animating: false,
});

const touchState = reactive({
  startY: 0,
  endY: 0,
  isTouching: false,
});

function handleTouchStart(event: TouchEvent) {
  touchState.isTouching = true;
  touchState.startY = event.touches[0].clientY;
}

function handleTouchMove(event: TouchEvent) {
  if (!touchState.isTouching) {
    return;
  }
  touchState.endY = event.touches[0].clientY;
}

function handleTouchEnd() {
  if (!touchState.isTouching) {
    return;
  }

  const deltaY = touchState.startY - touchState.endY;
  const threshold = (scroller.value?.clientHeight ?? 0) * 0.2;

  if (Math.abs(deltaY) > threshold || Math.abs(deltaY) > 100) {
    scrollOptions.animating = true;
    scrollOptions.next = deltaY > 0;

    setTimeout(() => {
      if (scrollOptions.next) {
        scrollOptions.lastY = 10000;
      } else {
        scrollOptions.lastY = 0;
      }
      scrollOptions.animating = false;
    }, 500);
  }

  touchState.isTouching = false;
}

function slide() {
  const slideTo = scrollOptions.next;
  const height = scroller.value?.clientHeight ?? 0;
  // const height = document.querySelector("#rootMain")?.clientHeight ?? 0;

  if (slideTo) {
    scroller.value?.scrollTo({
      top: height,
      behavior: "smooth",
    });
  } else {
    scroller.value?.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }
}

watch(() => scrollOptions.next, slide, { immediate: true });

/**
 * 判断滚动
 * 滚动之后整个页面自动切换
 */
function handleScroll() {
  if (scrollOptions.animating) {
    return;
  }
  const el = scroller.value;

  const currentTop = el?.scrollTop ?? 0;
  const lastTop = scrollOptions.lastY;
  scrollOptions.lastY = currentTop;
  scrollOptions.stepY = currentTop - lastTop;

  scrollOptions.animating = true;
  scrollOptions.next = scrollOptions.stepY > 0;

  setTimeout(() => {
    scrollOptions.animating = false;
  }, 200);
}
</script>

<template>
  <PageNavHolder
    class="FullScrollPage"
    :contentPadding="contentPadding"
    :empty="empty"
    :header="header"
    :title="title"
    :loading="loading"
  >
    <template #bg>
      <div
        class="FullScrollPage-Background fake-background absolute h-full w-full"
      ></div>
    </template>

    <template #header>
      <slot name="header" />
    </template>

    <template #topHeader>
      <HeadNav
        :is-transparent="!scrollOptions.next"
        :is-blur="scrollOptions.next"
        @back="router.back()"
        :title="title"
        expand
      >
      </HeadNav>
    </template>

    <template #empty>
      <slot name="empty">
        <div>
          <span>数据踏空而去...</span>
        </div>
      </slot>
    </template>

    <div
      @scroll="handleScroll"
      @touchstart="handleTouchStart"
      @touchmove="handleTouchMove"
      @touchend="handleTouchEnd"
      ref="scroll"
      class="FullScrollPage-Content select-none overflow-y-scroll absolute-layout"
    >
      <slot />
    </div>
  </PageNavHolder>
</template>

<style lang="scss" scoped>
.FullScrollPage {
  &-Background {
    &::after {
      z-index: 1;
    }

    --fake-opacity: 0.75;

    background-size: cover;
    background-image: url("/images/flower-bg.png");
  }
}
</style>
