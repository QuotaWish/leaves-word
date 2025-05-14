<script setup lang="ts">
import HeadNav from "../HeadNav.vue";

withDefaults(
  defineProps<{
    title: string;
    empty?: boolean;
    header?: boolean;
    loading?: boolean;
    loadingMask?: boolean;
    contentPadding?: boolean;
    /**
     * 沉浸模式
     * 启用之后，会加入自定义标题，整体会更加沉浸
     */
    immersive?: boolean;
  }>(),
  {
    contentPadding: true,
  },
);

const router = useRouter();

// 获取插槽
const ins = ref(getCurrentInstance());

const immersiveOptions = reactive({
  enable: false,
});
const scroller = useTemplateRef("scroll");
const IMMERSIVE_HEIGHT = 20;

function handleScroll() {
  const scrollEl = scroller.value;
  if (!scrollEl) return;

  immersiveOptions.enable = scrollEl.scrollTop >= IMMERSIVE_HEIGHT;
}
</script>

<template>
  <RoutePage
    :class="{ empty, immersive: immersiveOptions.enable }"
    :loading-mask="loadingMask"
    :loading="loading"
    class="PageNavHolder"
  >
    <template #header>
      <slot name="topHeader">
        <HeadNav :title="title" :disabled="loading" @back="router.back">
          <template #action>
            <slot name="action" />
          </template>

          <template v-if="immersive" #title>
            <span
              class="PageNavHolder-ImmersiveTitle transition-cubic"
              :class="{ enter: immersiveOptions.enable }"
              >{{ title }}</span
            >
          </template>
        </HeadNav>
      </slot>
    </template>

    <template #bg>
      <slot name="bg" />
    </template>

    <div relative h-full flex flex-col class="PageNavHolder-Container">
      <div v-if="ins?.slots.header" px-4 py-2 class="DictionaryHolder-Header">
        <slot name="header" />
      </div>

      <div
        ref="scroll"
        :class="{ 'px-4': contentPadding }"
        class="PageNavHolder-Content h-full w-full"
        @scroll="handleScroll"
      >
        <h1
          class="PageNavHolder-ImmersiveMainTitle transition-cubic"
          v-if="immersive"
          :class="{ enter: immersiveOptions.enable }"
          mb-4
          text-3xl
        >
          {{ title }}
        </h1>
        <slot />

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
      </div>
    </div>
  </RoutePage>
</template>

<style lang="scss" scoped>
.PageNavHolder-ImmersiveTitle {
  &.enter {
    opacity: 1;
    transform: translateY(0);
  }
  display: block;

  opacity: 0;
  transform: translateY(100%);
}

.PageNavHolder-ImmersiveMainTitle {
  &.enter {
    opacity: 0;
    transform: translateY(-100%);
  }
  display: block;

  opacity: 1;
  transform: translateY(0);
}

.RoutePage-Empty {
  &-Illusion {
    &-Image {
      width: 120px;
      height: 120px;
    }
  }

  .PageNavHolder.empty & {
    transform: scale(1) translateY(0);
  }

  background-color: var(--el-fill-color);

  transform: scale(0.8) translateY(300%);
}

.PageNavHolder-Container {
  height: 100%;
}

.PageNavHolder-Content {
  height: 100%;

  overflow-y: auto;
}

.PageNavHolder {
  background-color: var(--el-bg-color-page);
}

.PageNavHolder-Main {
  background-color: var(--el-fill-color);
}
</style>
