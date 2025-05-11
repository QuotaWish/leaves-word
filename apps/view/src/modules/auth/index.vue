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
      <h1>
        从种子开始萌发
        <p>英语之旅</p>
      </h1>

      <div class="AuthHolder-Welcome-Action">
        <GlassShineButton v-wave @click="step = 1">登录</GlassShineButton>
      </div>
    </div>
    <div :class="{ auth: step === 1 }"
      class="AuthHolder-Content transition-cubic absolute h-full w-full flex justify-center">
      <div v-wave @click="step = 0" class="AuthHolder-Content-Back fake-background ">
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
    transform: translateX(-100%);
  }

  .auth.AuthHolder-Content {
    transform: translateX(0%);
  }

  .AuthHolder-Welcome {
    &-Action {
      margin: 50% 0;
    }

    p {
      margin: 1rem 0;
      font-size: 34px;
    }

    h1 {
      font-size: 38px;
    }

    font-weight: 600;
    color: #ffffff;
    margin-bottom: 0.5rem;
    text-shadow: 0 2px 4px rgba(0, 0, 0, 0.5);
  }

  .AuthHolder-Content {
    transform: translateX(100%);
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
    color: var(--el-fill-color);
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
