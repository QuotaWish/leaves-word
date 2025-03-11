<script setup lang="ts">
import type { DictStorage } from '~/composables/words/storage'
import { modeManager, ModeType } from '~/composables/words/mode'
import { ComprehensiveMode } from '~/composables/words/mode/comprehensive'
import { DictWordMode } from '~/composables/words/mode/dict-word'
import { PunchMode } from '~/composables/words/mode/punch'
import { SoundMode } from '~/composables/words/mode/sound'

import Auth from '~/modules/auth/index.vue'
import Core from '~/modules/core/index.vue'
import Splash from '~/modules/splash/index.vue'
import DeveloperFloatingBall from '~/modules/develop/index.vue'
import { useBaseRouteStore } from './composables/store/useRouteStore'

modeManager.set(ModeType.COMPREHENSIVE, (dictionaryStorage: DictStorage) => new ComprehensiveMode(dictionaryStorage))
modeManager.set(ModeType.PUNCH, (dictionaryStorage: DictStorage) => new PunchMode(dictionaryStorage))
modeManager.set(ModeType.LISTENING, (dictionaryStorage: DictStorage) => new SoundMode(dictionaryStorage))
modeManager.set(ModeType.READING, (dictionaryStorage: DictStorage) => new DictWordMode(dictionaryStorage))

const router = useRouter()
const routes = router.getRoutes()
const baseRouteStore = useBaseRouteStore()

router.beforeEach((to, from) => {
  const toDepth = routes.findIndex((v) => v.path === to.path)
  const fromDepth = routes.findIndex((v) => v.path === from.path)
  if (toDepth > fromDepth) {
    if (to.matched && to.matched.length) {
      const toComponentName = to.matched[0].components?.default.name
      if (toComponentName) {
        baseRouteStore.updateExcludeRoutes({ type: 'remove', value: toComponentName })
      }
    }
  } else {
    if (from.matched && from.matched.length) {
      const fromComponentName = from.matched[0].components?.default.name
      if (fromComponentName) {
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
      </template>
    </Splash>
  </el-config-provider>
</template>
