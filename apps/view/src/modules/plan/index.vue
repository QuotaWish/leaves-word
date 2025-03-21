<script setup lang="ts">
import { useGlobalSplashState } from '~/modules/splash/index'
import PlanLayout from './PlanLayout.vue'

const router = useRouter()
const immersiveMode = ref(false)
const globalSplashState = useGlobalSplashState()
watch(immersiveMode, (val: boolean) => {
  globalSplashState.footerVisible.value = !val
})
</script>

<template>
  <PlanLayout :class="{ immersive: immersiveMode }">
    <template #header>
      <div flex items-center>
        <RoundInfo type="success" flex items-center gap-2 @click="router.push('/search')">
          <img w-6 src="/ai-logo.png">
          搜一搜
        </RoundInfo>
      </div>

      <div flex items-center gap-2>
        <RoundInfo type="danger">
          <div i-carbon-favorite-filled />
          5
        </RoundInfo>

        <RoundInfo type="warning">
          <div i-carbon-star-filled />
          400
        </RoundInfo>
      </div>
    </template>

    <template #main>
      <slot name="main" />

      <!-- <DisplayIndexCourse /> -->
    </template>

    <template #cover>
      <div class="PlanCover-Wrapper absolute-layout" @click="immersiveMode = !immersiveMode">
        <slot name="cover" />

        <div class="Immersive-Wrapper absolute-layout">
          <div class="Immersive-Decoration transition-cubic top-left absolute transition-duration-500" />
          <div class="Immersive-Decoration transition-cubic bottom-right absolute transition-duration-500" />

          <div class="Immersive-Footer transition-cubic absolute transition-duration-500">
            <div class="Immersive-Footer-Inner flex flex-col">
              <Logo />
              <p class="text-white">
                千叶单词 - 每日一言
              </p>
            </div>
          </div>
        </div>
      </div>
    </template>
  </PlanLayout>
</template>

<style lang="scss">
.Immersive-Footer {
  .immersive & {
    bottom: 2rem;
  }

  left: 50%;
  bottom: -10rem;

  transform: translateX(-50%);

  .Immersive-Footer-Inner {
    display: flex;
    align-items: center;
  }
}

.Immersive-Decoration {
  &.top-left {
    top: 0;
    left: -15rem;

    background: linear-gradient(to right, var(--theme-color) 50%, #0000);
  }

  &.bottom-right {
    bottom: 0;
    right: -15rem;

    background: linear-gradient(to left, var(--theme-color) 50%, #0000);
  }

  .immersive & {
    &.top-left {
      left: -10rem;
    }

    &.bottom-right {
      right: -10rem;
    }
  }

  width: 12rem;
  height: 30%;

  transform: skewX(-30deg);
}

.PlanLayout {
  &.immersive {
    .IndexPage-Card {
      transform: scale(0.01);
    }

    .PlanLayout-Header {
      transform: translateY(-5rem) scale(0.01);
    }

    .PlanCover-Bg {
      --fake-opacity: 0;
      filter: saturate(120%) brightness(120%);
      //  filter: blur(18px) saturate(180%);
    }

    .PlanCover-Main-Inner {
      .content-text {
        font-size: 2rem !important;
      }

      .translation-text {
        font-size: 1.5rem !important;
      }

      .author-text {
        font-size: 1.2rem !important;
      }

      bottom: 50%;

      transform: translate(-50%, 50%);
    }
  }

  .IndexPage-Card {
    transform: scale(1);
  }
}
</style>
