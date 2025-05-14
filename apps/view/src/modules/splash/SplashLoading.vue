<script setup lang="ts">
import VersionBar from "~/components/chore/VersionBar.vue";
import { APP_LOGO } from "~/composables/constants";
import { ScreenMode, useGlobalSplashState } from ".";

const globalSplashState = useGlobalSplashState();
const loading = ref(true);

(async () => {
  await sleep(2000);

  loading.value = false;
})();

watch(
  () => globalSplashState.screenMode.value,
  () => {
    if (globalSplashState.screenMode.value === ScreenMode.BUILDER) {
      loading.value = false;
    }
  },
  { immediate: true },
);
</script>

<template>
  <div :class="{ loading }" class="SplashLoading">
    <div class="SplashLoading-Page transition-cubic">
      <div class="SplashLoading-Page-Main">
        <div class="SplashLoading-Logo">
          <img :src="APP_LOGO" alt="Logo" class="logo" />
          <img :src="APP_LOGO" alt="Logo" class="logo-bg" />
        </div>
        <div class="SplashLoading-Page-Text">
          <h1>千叶单词</h1>
          <p>Leave words, Embrace worlds!</p>
        </div>
      </div>
      <div flex flex-col items-center class="powered-by">
        <p><VersionBar /></p>
        <p>Powered by QuotaWish.</p>
      </div>
    </div>
    <div id="rootMain" class="transition-cubic SplashLoading-Content">
      <slot />
    </div>
  </div>
</template>

<style lang="scss" scoped>
.SplashLoading {
  &-Page {
    position: absolute;

    width: 100%;
    height: 100%;

    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;

    opacity: 0;
    pointer-events: none;
    transform: scale(0.9);

    transition-duration: 1s;
  }

  &-Content {
    opacity: 1;
    pointer-events: all;
    transform: scale(1);

    height: 100%;

    transition-duration: 1s;
  }

  z-index: 100;
  position: relative;

  height: 100%;

  background-color: var(--el-bg-color);
}

.loading.SplashLoading {
  .SplashLoading-Page {
    opacity: 1;
    pointer-events: all;
    transform: scale(1);
  }

  .SplashLoading-Content {
    opacity: 0;
    pointer-events: none;
    transform: scale(1.05);
  }
}

@keyframes enterView {
  from {
    opacity: 0;
    transform: translateY(5%) scale(0.85);
  }

  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

.SplashLoading-Logo {
  img {
    position: absolute;

    width: 150px;
    height: 150px;
  }

  .logo-bg {
    z-index: -1;
    filter: blur(15px);
  }

  z-index: 1;
  position: relative;

  width: 150px;
  height: 150px;
}

.SplashLoading-Page-Main {
  display: flex;

  flex-direction: column;

  align-items: center;

  h1 {
    margin-top: -1rem;

    font-size: 2rem;
    font-weight: bold;
    text-align: center;
  }

  p {
    color: var(--el-text-color-secondary);
  }

  animation: enterView 0.5s ease-in-out;
}

.powered-by {
  position: absolute;

  bottom: 1rem;

  opacity: 0.6;
  font-size: 14px;
  color: var(--el-text-color-placeholder);
}
</style>
