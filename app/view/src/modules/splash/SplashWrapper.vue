<script setup lang="ts">
import { MOCK_DEVICES, ScreenMode, useGlobalSplashState } from '.'

const dom = ref<HTMLDivElement>()
const splashState = useGlobalSplashState()

const currentMock = computed(() => {
  const mock = MOCK_DEVICES[splashState.mockDevice.value]
  return mock
})

watch(currentMock, nextTick.bind(null, handleMockChange), { immediate: true })

function handleMockChange() {
  const el = dom.value
  if (!el || !currentMock.value) {
    return
  }

  if (splashState.screenMode.value === ScreenMode.MOBILE) {
    Object.assign(el.style, {
      width: '100%',
      height: '100%',
    })
    return
  }

  const { size, mask } = currentMock.value
  const [width, height] = size.split(':').map(Number)

  Object.assign(el.style, {
    width: `${width}px`,
    height: `${height}px`,
  })

  if (!mask) {
    el.style.setProperty('--mask-image', ``)
    return
  }

  // set image url (css var)
  el.style.setProperty('--mask-image', `url(${mask})`)
}
</script>

<template>
  <!-- 根据传入的素材进行裁切视图 - 如果没有素材传入用代码裁切 -->
  <div ref="dom" :class="{ empty: !currentMock?.mask }" class="SplashWrapper">
    <div :class="[currentMock.value]" class="SplashWrapper-Clip absolute-layout">
      <slot />
    </div>
  </div>
</template>

<style lang="scss" scoped>
.SplashContainer.wrapped-box .SplashWrapper.empty {
  // iPhone 12 Pro
  width: 390px;
  height: 844px;

  box-shadow: var(--el-box-shadow);
  border-radius: 55px !important;
  border: 5px solid var(--el-text-color-primary);
}

.SplashWrapper {
  &::before {
    z-index: 1000000;
    content: '';
    position: absolute;

    inset: 0;

    background-image: var(--mask-image);
    background-size: cover;
    background-position: center;

    pointer-events: none;
    transform: scale(1.05);
  }

  &-Clip {
    padding-bottom: 1rem;

    border-radius: 48px !important;
    overflow: hidden !important;
  }
}

.SplashContainer.fullscreen {
  .SplashWrapper {
    &::before {
      display: none;
    }
    border-radius: 0 !important;

    &-Clip {
      padding-bottom: 0;
      border-radius: 0 !important;
    }
  }
}
</style>
