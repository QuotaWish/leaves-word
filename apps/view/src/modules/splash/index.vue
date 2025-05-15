<script setup lang="ts">
import SpalshContainer from "~/modules/splash/SplashContainer.vue";
import SplashLoading from "~/modules/splash/SplashLoading.vue";
import { ScreenMode, useGlobalSplashState, useBuilder } from ".";
import TheFooter from "./footer/TheFooter.vue";
import SplashLayout from "./SplashLayout.vue";
import SplashMenu from "./SplashMenu.vue";
import { useDeviceUaParser } from "./ua-parser";
import { useUniApp } from "~/composables/adapter/uniapp";
import { useWebSizeAdapter } from "~/composables/adapter/web";

const { isBuilder, check } = useBuilder();
const { init, destroy } = useUniApp();
const spalshState = useGlobalSplashState();

function checkScreenSize() {
  const { isBrowser } = useDeviceUaParser();

  check();
  init(() => {
    console.log("init");
  });
  onBeforeUnmount(() => {
    destroy();
  });

  if (window.innerWidth > 768) {
    spalshState.screenMode.value = ScreenMode.WRAPPED;
    document.body.classList.add("large-screen");
  } else {
    document.body.classList.remove("large-screen");

    if (isBuilder.value) {
      spalshState.screenMode.value = ScreenMode.BUILDER;
    } else {
      spalshState.screenMode.value = ScreenMode.MOBILE;
    }

    useWebSizeAdapter();
  }

  spalshState.mockStatusbar.value =
    isBrowser && spalshState.screenMode.value === ScreenMode.WRAPPED;
}

const { width, height } = useWindowSize();

watch([width, height], () => {
  nextTick(checkScreenSize);
});

setTimeout(() => {
  checkScreenSize();

  document.body.classList.add("mobile");
}, 300);
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

<style></style>
