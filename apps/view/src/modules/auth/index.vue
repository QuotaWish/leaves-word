<script setup lang="ts">
import AuthBackground from './AuthBackground.vue'
import AuthHolder from './AuthHolder.vue'
import AuthMain from './AuthMain.vue'

const step = ref(0)
</script>

<template>
  <AuthHolder>
    <AuthBackground />

    <div :class="{ auth: step === 1 }"
      class="AuthHolder-Welcome transition-cubic absolute h-full w-full flex flex-col justify-start px-8 py-[35%]">
      <div class="AuthHolder-Welcome-Action flex flex-col items-center justify-center gap-4">
        <GlassShineButton v-wave @click="step = 1">登录</GlassShineButton>
        <GlassShineButton v-wave @click="step = 1">注册</GlassShineButton>
      </div>
    </div>
    <div :class="{ auth: step === 1 }"
      class="AuthHolder-Content transition-cubic absolute h-full w-full flex justify-center">
      <div v-wave @click="step = 0" class="AuthHolder-Content-Back fake-background">
        <div i-carbon-chevron-left />
      </div>

      <AuthMain />
    </div>

    <div class="AuthHolder-Copyright">
      <Logo />
      <span class="text-sm text-shadow-lg">Powered by QuotaWish.</span>
    </div>
  </AuthHolder>
</template>

<style lang="scss" scoped>
.AuthHolder {
  .auth.AuthHolder-Welcome {
    transform: translateY(-100%);
  }

  .auth.AuthHolder-Content {
    transform: translateY(0%);
  }

  .AuthHolder-Welcome {
    &-Action {
      position: absolute;
      padding: 10%;

      width: 100%;

      left: 0;
      bottom: 5%;
    }
  }

  .AuthHolder-Content {
    z-index: 10;

    transform: translateY(100%);
  }

  .AuthHolder-Content-Back {
    position: absolute;
    display: flex;

    top: 4rem;
    left: 2rem;

    width: 48px;
    height: 48px;

    align-items: center;
    justify-content: center;

    font-size: 24px;
    cursor: pointer;
    border-radius: 50%;
    --fake-opacity: 0.75;
    transform: rotate(-90deg);
    color: var(--el-text-color-primary);
    backdrop-filter: blur(18px) saturate(180%);
  }
}

.AuthHolder-Copyright {
  position: absolute;
  display: flex;
  flex-direction: column;
  align-items: center;

  left: 50%;
  width: 70%;

  bottom: 1rem;

  transform: translateX(-50%);

  &-Brand {
    position: relative;
    display: flex;

    align-items: center;
    flex-direction: column;
    justify-content: center;

    bottom: 0;
  }

  span {
    color: #fff;
  }
}
</style>
