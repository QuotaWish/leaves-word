<script setup lang="ts">
import { UniEventAtBackButton, uniEventBus } from '~/composables/adapter/uniapp';
import WithPage from './WithPage.vue';

withDefaults(defineProps<{
  adapt?: boolean
}>(), {
  adapt: true
})

const percent = ref(0)
const headerRef = ref<HTMLElement>()
const containerRef = ref<HTMLElement>()

const headerSize = useElementSize(headerRef)

const handleScroll = () => {
  const container = containerRef.value
  if ( !container ) return

  const headerHeight = headerSize.height.value || 88
  const scrollTop = container.scrollTop

  percent.value = Math.min((scrollTop / headerHeight) * 100, 100)

  console.log(percent.value, headerHeight, scrollTop)
}

nextTick(() => {
  const container = containerRef.value
  if (!container) return

  container.addEventListener('scroll', handleScroll)
})

onBeforeUnmount(() => {
  const container = containerRef.value
  if (!container) return

  container.removeEventListener('scroll', handleScroll)
})

const router = useRouter()
const handleBackButton = (event: any) => {
  if (event !== UniEventAtBackButton) return

  router.back()
}

onMounted(() => {
  uniEventBus.on(handleBackButton)
})

onBeforeUnmount(() => {
  uniEventBus.off(handleBackButton)
})
</script>

<template>
  <WithPage :adapt="adapt" class="WithHeadPage">
    <div ref="containerRef" class="w-full h-full overflow-y-scroll overflow-x-hidden">
      <div ref="headerRef" class="WithHeadPage-Header">
        <slot name="header" />
      </div>
      <slot />

    </div>
    <div :style="{ transform: `translateY(${percent - 100}%)` }" class="WithHeadPage-HeaderShrink fake-background transition-cubic">
      <slot name="shrinkHeader">
        <slot name="header">
          DefaultPage
        </slot>
      </slot>
    </div>

    <template #bg>
      <slot name="bg" />
    </template>
  </WithPage>
</template>

<style lang="scss" scoped>
.WithHeadPage-HeaderShrink {
  .statusbar & {
    padding-top: 54px;
    height: 88px;
  }

  position: fixed;
  display: flex;

  justify-content: center;

  top: 0;
  left: 0;

  width: 100%;
  height: 35px;

  font-size: 20px;
  font-weight: 500;

  --fake-opacity: 0.75;
  transition-duration: 0;
  color: var(--el-text-color-primary);
  backdrop-filter: blur(18px) saturate(180%);
  // background-color: var(--el-fill-color-light);
}

.WithHeadPage-Header {
  font-size: 24px;
  font-weight: 600;

  color: var(--el-text-color-primary);
}

.WithHeadPage {
  position: relative;

  width: 100%;
  height: 100%;

  overflow: hidden;
}
</style>
