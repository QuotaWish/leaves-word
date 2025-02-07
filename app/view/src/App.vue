<script setup lang="ts">
import Auth from '~/modules/auth/index.vue'
import Core from '~/modules/core/index.vue'
import Splash from '~/modules/splash/index.vue'

// const router = useRouter()
</script>

<template>
  <Splash>
    <template #main>
      <router-view v-slot="{ Component }">
        <TransitionPage>
          <keep-alive :exclude="['DictionaryPage']">
            <component :is="Component" />
          </keep-alive>
        </TransitionPage>
        <!-- <transition mode="out-in" :name="router.transition.name">

        </transition> -->
      </router-view>
      <!-- <RouterView /> -->

      <Auth />
      <Core />
    </template>
  </Splash>
</template>
