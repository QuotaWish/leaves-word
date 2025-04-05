<script setup lang="ts">
const auth = ref(false)

function handleAuth() {
  setTimeout(() => {
    auth.value = !auth.value
  }, 300)
}
</script>

<template>
  <div :class="{ auth }" class="AuthWrapper absolute-layout">
    <div class="AuthWrapper-Upper">
      <slot name="upper" />
    </div>
    <div class="AuthWrapper-Lower flex justify-center items-center">
      <button @click="handleAuth" v-wave class="AuthWrapper-Lower-Button transition-cubic">
        立即开始
      </button>

      <div class="AuthWrapper-Lower-Brand">
        <Logo />
        <span class="text-sm text-gray-500">Powered by QuotaWish.</span>
      </div>
    </div>
    <div class="AuthWrapper-Auth z-10 absolute-layout transition-cubic">
      <slot name="auth" />
    </div>
  </div>
</template>

<style lang="scss" scoped>
.AuthWrapper {
  display: flex;
  flex-direction: column;
  align-items: center;

  &-Auth {
    transform: translateY(120%);
  }

  &.auth {
    .AuthWrapper-Auth {
      transform: translateY(0);
    }
  }

  &-Lower {
    position: relative;
    display: flex;
    flex-direction: column;
    align-items: center;

    width: 70%;

    &-Button {
      .dark & {
        background-color: #fff;
        color: #000;
      }

      &:active {
        transform: scale(0.95);
      }

      position: relative;

      background-color: #000;
      color: #fff;
      border-radius: 5rem;
      padding: 0.5rem 1rem;

      width: 80%;
      height: 3.5rem;

      bottom: 10%;
      box-shadow: var(--el-box-shadow);
    }

    &-Brand {
      position: relative;
      display: flex;

      align-items: center;
      flex-direction: column;
      justify-content: center;

      bottom: 0;
    }
  }
}
</style>
