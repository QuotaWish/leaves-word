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
  }, 500);
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
        <template #action>
          <slot name="action" />
        </template>
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
      @touchmove="handleScroll"
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
