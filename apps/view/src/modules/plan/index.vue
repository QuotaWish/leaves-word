<script setup lang="ts">
import { useGlobalSplashState } from "~/modules/splash/index";
import PlanLayout from "./PlanLayout.vue";

const router = useRouter();
const immersiveMode = ref(false);
const globalSplashState = useGlobalSplashState();
watch(immersiveMode, (val: boolean) => {
  globalSplashState.footerVisible.value = !val;
});
</script>

<template>
  <PlanLayout :class="{ immersive: immersiveMode }">
    <template #header>
      <div flex items-center>
        <RoundInfo
          type="success"
          flex
          items-center
          gap-2
          @click="router.push('/search')"
        >
          <img w-6 src="/ai-logo.png" />
          搜一搜
        </RoundInfo>
      </div>

      <div flex items-center gap-2>
        <RoundInfo @click="router.push('/chores/health')" type="danger">
          <div i-carbon-favorite-filled />
          5
        </RoundInfo>

        <RoundInfo @click="router.push('/chores/dummy')" type="warning">
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
      <div
        class="PlanCover-Wrapper absolute-layout"
        @click="immersiveMode = !immersiveMode"
      >
        <slot name="cover" />

        <div class="Immersive-Wrapper absolute-layout">
          <div
            class="Immersive-Decoration transition-cubic absolute transition-duration-500"
          ></div>

          <div
            class="Immersive-Footer transition-cubic absolute transition-duration-500"
          >
            <div class="Immersive-Footer-Inner flex flex-col">
              <Logo />
              <p class="text-white">千叶单词 - 每日一言</p>
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

@keyframes decoration-rotate {
  0% {
    transform: translate(-50%, -50%) rotate(0);
  }

  100% {
    transform: translate(-50%, -50%) rotate(360deg);
  }
}

@keyframes flow {
  0% {
    background-position: 0% 50%;
  }

  50% {
    background-position: 100% 50%;
  }

  100% {
    background-position: 0% 50%;
  }
}

.Immersive-Decoration {
  .immersive & {
    opacity: 1;
  }

  z-index: 100;
  position: absolute;
  top: 50%;
  left: 50%;
  width: 100%;
  height: 100%;
  // height: calc(100% - var(--footer-height));
  transform: translate(-50%, -50%);
  // translateY(calc(-0.5 * var(--footer-height)))
  border-radius: 20px;
  pointer-events: none;
  overflow: hidden;

  opacity: 0;
  filter: blur(10px) saturate(180%) brightness(120%);

  &::before {
    content: "";
    position: absolute;
    inset: 0;
    padding: 8px;
    background: linear-gradient(
      90deg,
      #00f5a0,
      #00d9f5,
      #00a1ff,
      #a100ff,
      #f400a1,
      #f5a000,
      #00f5a0,
      #00d9f5,
      #00a1ff
    );
    background-size: 400% 100%;
    animation: flow 10s ease-in-out infinite;
    border-radius: inherit;
    mask:
      linear-gradient(#fff 0 0) content-box,
      linear-gradient(#fff 0 0);
    -webkit-mask:
      linear-gradient(#fff 0 0) content-box,
      linear-gradient(#fff 0 0);
    mask-composite: exclude;
    -webkit-mask-composite: xor;
  }
}

.PlanLayout {
  &.immersive {
    .IndexPage-Card {
      transform: scale(0.0001);
    }

    .PlanLayout-Header {
      transform: translateY(-5rem) scale(0.01);
    }

    .PlanCover-Bg {
      --fake-opacity: 0;
      filter: saturate(120%) brightness(120%);
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
