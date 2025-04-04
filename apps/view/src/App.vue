<script setup lang="ts">
// import type { DictStorage } from '~/composables/words/storage'
// import { modeManager, ModeType } from '~/modules/words/mode'
// import { ComprehensiveMode } from '~/composables/words/mode/comprehensive'
// import { DictWordMode } from '~/composables/words/mode/dict-word'
// import { PunchMode } from '~/composables/words/mode/punch'
// import { SoundMode } from '~/composables/words/mode/sound'

import { toast, Toaster } from 'vue-sonner'
import Auth from '~/modules/auth/index.vue'
import Core from '~/modules/core/index.vue'
import DeveloperFloatingBall from '~/modules/develop/index.vue'
import Splash from '~/modules/splash/index.vue'
import { $endApi, initApi } from './composables/api'
import { useLeafEventBus } from './composables/event'
import { ToastEvent } from './composables/event/toast-event'
import { useBaseRouteStore } from './composables/store/useRouteStore'
import { useRequest } from 'alova/client'
import { AuthSuccessEvent } from './composables/event/auth'
import { globalAuthStorage } from './modules/auth'

// modeManager.set(ModeType.COMPREHENSIVE, (dictionaryStorage: DictStorage) => new ComprehensiveMode(dictionaryStorage))
// modeManager.set(ModeType.PUNCH, (dictionaryStorage: DictStorage) => new PunchMode(dictionaryStorage))
// modeManager.set(ModeType.LISTENING, (dictionaryStorage: DictStorage) => new SoundMode(dictionaryStorage))
// modeManager.set(ModeType.READING, (dictionaryStorage: DictStorage) => new DictWordMode(dictionaryStorage))

initApi()

const eventBus = useLeafEventBus()
const router = useRouter()
const routes = router.getRoutes()
const baseRouteStore = useBaseRouteStore()

const theme = computed(() => {
  return useDark().value ? 'dark' : 'light'
})

eventBus.registerListener(ToastEvent, {
  handleEvent(event) {
    const { message, type } = event as ToastEvent

    switch (type) {
      case 'success':
        toast.success(message)
        break
      case 'warning':
        toast.warning(message)
        break
      case 'info':
        toast.info(message)
        break
      case 'error':
        toast.error(message)
        break
    }
  },
})

const { send: refreshUserData } = useRequest(() => Apis.userController.getLoginUserUsingGET(), {
  immediate: false,
})

eventBus.registerListener(AuthSuccessEvent, {
  async handleEvent() {
    const res = await refreshUserData()

    globalAuthStorage.value.user = res.data
  },
})

router.beforeEach((to, from) => {
  const toDepth = routes.findIndex(v => v.path === to.path)
  const fromDepth = routes.findIndex(v => v.path === from.path)
  if (toDepth > fromDepth) {
    if (to.matched?.length) {
      // 过滤没有 components 的
      const filterMatched = to.matched.filter(item => item.components)
      const toComponentName = filterMatched?.[0]?.components?.default.name
      if (toComponentName) {
        baseRouteStore.updateExcludeRoutes({ type: 'remove', value: toComponentName })
      }
    }
  } else {
    if (from.matched?.length) {
      const filterMatched = from.matched.filter(item => item.components)
      const fromComponentName = filterMatched?.[0]?.components?.default.name
      if (fromComponentName) {
        baseRouteStore.updateExcludeRoutes({ type: 'add', value: fromComponentName })
        baseRouteStore.updateExcludeRoutes({ type: 'add', value: fromComponentName })
      }
    }
  }

  return true
})
</script>

<template>
  <el-config-provider :z-index="10000000">
    <Splash>
      <template #main>
        <router-view v-slot="{ Component }">
          <TransitionPage>
            <!-- ['DictionaryPage', 'SignedPage'] -->
            <keep-alive :exclude="baseRouteStore.excludeNames">
              <component :is="Component" />
            </keep-alive>
          </TransitionPage>
          <!-- <transition mode="out-in" :name="router.transition.name">

        </transition> -->
        </router-view>
        <!-- <RouterView /> -->

        <Auth />
        <Core />
        <DeveloperFloatingBall />
        <Toaster mt-8 :theme="theme" richColors position="top-center" />
      </template>
    </Splash>
  </el-config-provider>
</template>
