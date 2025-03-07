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

modeManager.set(ModeType.COMPREHENSIVE, (dictionaryStorage: DictStorage) => new ComprehensiveMode(dictionaryStorage))
modeManager.set(ModeType.PUNCH, (dictionaryStorage: DictStorage) => new PunchMode(dictionaryStorage))
modeManager.set(ModeType.LISTENING, (dictionaryStorage: DictStorage) => new SoundMode(dictionaryStorage))
modeManager.set(ModeType.READING, (dictionaryStorage: DictStorage) => new DictWordMode(dictionaryStorage))
</script>

<template>
  <el-config-provider :z-index="10000000">
    <Splash>
      <template #main>
        <router-view v-slot="{ Component }">
          <TransitionPage>
            <keep-alive :exclude="['DictionaryPage', 'SignedPage']">
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
  </el-config-provider>
</template>
