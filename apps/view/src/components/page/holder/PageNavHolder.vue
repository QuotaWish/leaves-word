<script setup lang="ts">
import type { IPageNavHolderProps } from "../types";
import HeadNav from "../HeadNav.vue";
import { IPageNavHolderEmits } from "../types";

const props = withDefaults(defineProps<IPageNavHolderProps>(), {
  adapt: true,
  contentPadding: true,
});

// const emits = defineEmits<IPageNavHolderEmits>();

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
  if (!scrollEl)
    return;

  immersiveOptions.enable = scrollEl.scrollTop >= IMMERSIVE_HEIGHT;
}
</script>

<template>
  <RoutePage
    :class="{ immersive: immersiveOptions.enable }"
    v-bind="props"
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
            >{{ title }}</span>
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
        class="PageNavHolder-Content h-full w-full overflow-y-scroll"
        @scroll="handleScroll"
      >
        <h1
          v-if="immersive"
          class="PageNavHolder-ImmersiveMainTitle transition-cubic"
          :class="{ enter: immersiveOptions.enable }"
          mb-4
          text-3xl
        >
          {{ title }}
        </h1>
        <slot />
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

.PageNavHolder-Container {
  height: 100%;
}

.PageNavHolder {
  background-color: var(--el-bg-color-page);
}

.PageNavHolder-Main {
  background-color: var(--el-fill-color);
}
</style>
