<script setup lang="ts">
import SpalshContainer from '~/modules/splash/SplashContainer.vue'
import SplashLoading from '~/modules/splash/SplashLoading.vue'
import { ScreenMode, useGlobalSplashState, useBuilder } from '.'
import TheFooter from './footer/TheFooter.vue'
import SplashLayout from './SplashLayout.vue'
import SplashMenu from './SplashMenu.vue'
import { useDeviceUaParser } from './ua-parser'

const { isBuilder, check } = useBuilder()
const spalshState = useGlobalSplashState()

function checkScreenSize() {
  const { isBrowser } = useDeviceUaParser()

  check()

  if (window.innerWidth > 768) {
    spalshState.screenMode.value = ScreenMode.WRAPPED
    document.body.classList.add('large-screen')
  }
  else {
    document.body.classList.remove('large-screen')

    if ( isBuilder.value ) {
      spalshState.screenMode.value = ScreenMode.BUILDER
    }
    else {
      spalshState.screenMode.value = ScreenMode.MOBILE
    }
  }

  spalshState.mockStatusbar.value = isBrowser && spalshState.screenMode.value === ScreenMode.WRAPPED
}

const { width, height } = useWindowSize()

watch([width, height], () => {
  nextTick(checkScreenSize)
})

onMounted(() => {
  checkScreenSize()

  document.body.classList.add('mobile')
})
</script>

<template>
  <SpalshContainer>
    <template #menu>
      <SplashMenu />
    </template>

    <SplashLoading>
      <SplashLayout>
        <template #content>
          <slot name="main" />
        </template>
        <template #footer>
          <TheFooter />
        </template>
      </SplashLayout>
    </SplashLoading>
  </SpalshContainer>
</template>

<style>

</style>
