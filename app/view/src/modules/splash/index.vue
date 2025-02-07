<script setup lang="ts">
import SpalshContainer from '~/modules/splash/SplashContainer.vue'
import SplashLoading from '~/modules/splash/SplashLoading.vue'
import { ScreenMode, useGlobalSplashState } from '.'
import TheFooter from './footer/TheFooter.vue'
import SplashLayout from './SplashLayout.vue'
import { useDeviceUaParser } from './ua-parser'

const spalshState = useGlobalSplashState()

function checkScreenSize() {
  const { isBrowser } = useDeviceUaParser()

  if (window.innerWidth > 768) {
    spalshState.screenMode.value = ScreenMode.WRAPPED
    document.body.classList.add('large-screen')
  }
  else {
    spalshState.screenMode.value = ScreenMode.MOBILE
    document.body.classList.remove('large-screen')
  }

  spalshState.mockStatusbar.value = isBrowser && spalshState.screenMode.value !== ScreenMode.MOBILE
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
