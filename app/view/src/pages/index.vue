<script setup lang="ts" generic="T extends any, O extends any">
import { modeManager, ModeType } from '~/composables/words/mode'
import { ComprehensiveMode } from '~/composables/words/mode/comprehensive'
import { DictWordMode } from '~/composables/words/mode/dict-word'
import { PunchMode } from '~/composables/words/mode/punch'
import { SoundMode } from '~/composables/words/mode/sound'
import type { DictStorage } from '~/composables/words/storage'
import Plan from '~/modules/plan/index.vue'
import PlanCover from '~/modules/plan/PlanCover.vue'
import { useGlobalSplashState } from '~/modules/splash'
import prewords from './prewords.vue'

defineOptions({
  name: 'IndexPage',
})

modeManager.set(ModeType.COMPREHENSIVE, (dictionaryStorage: DictStorage) => new ComprehensiveMode(dictionaryStorage))
modeManager.set(ModeType.PUNCH, (dictionaryStorage: DictStorage) => new PunchMode(dictionaryStorage))
modeManager.set(ModeType.LISTENING, (dictionaryStorage: DictStorage) => new SoundMode(dictionaryStorage))
modeManager.set(ModeType.READING, (dictionaryStorage: DictStorage) => new DictWordMode(dictionaryStorage))

const prewordsVisible = ref(false)
const globalSplashState = useGlobalSplashState()
watch(prewordsVisible, visible => globalSplashState.footerVisible.value = !visible)

function handleSign() {
  prewordsVisible.value = true
}

onMounted(() => {
  globalSplashState.footerVisible.value = true
})

useRouter().beforeEach((_to, _from, next) => {
  if (prewordsVisible.value) {
    next(false)

    prewordsVisible.value = false
    return
  }

  next(true)
})
</script>

<template>
  <Plan>
    <template #cover>
      <PlanCover />
    </template>

    <template #main>
      <div id="sign-info" :class="{ expand: prewordsVisible }" mx-auto class="IndexPage-Card z-1">
        <WordSignInfo @sign="handleSign" />

        <teleport to="#rootMain">
          <div :class="{ visible: prewordsVisible }" class="IndexPage-PreWords">
            <prewords @exit="prewordsVisible = false" />
          </div>
        </teleport>
      </div>
    </template>
  </Plan>
</template>

<style lang="scss">
.IndexPage-PreWords {
  &.visible {
    opacity: 1;
    pointer-events: auto;

    transform: scale(1);
    transition: 0.25s 0.1s;
  }

  z-index: 2;
  position: absolute;

  top: 0;
  left: 0;

  width: 100%;
  height: 100%;

  opacity: 0;
  pointer-events: none;
  transform: scale(1.05);
  background-color: var(--el-bg-color);
}

.IndexPage-Card {
  &::before {
    z-index: 1;
    content: '';
    position: absolute;

    top: 0;
    left: 0;

    width: 100%;
    height: 100%;

    opacity: 0;
    pointer-events: none;
    border-radius: 25px;
    background-color: var(--theme-color);
    transform: scale(1);

    transition: 0.25s 0.05s;
  }

  &.expand {
    &::before {
      opacity: 1;
      transform: scale(1);
    }

    z-index: 2;
    transform: scale(1.25);
  }

  p.title {
    margin: 0 0 1rem;

    color: var(--el-text-color-placeholder);
    font-size: 24px;
    font-weight: 600;
  }

  position: relative;
  padding: 0.5rem 0;

  top: 0%;

  transition: 0.25s;
}
</style>

<route lang="yaml">
meta:
  transition: nav
</route>
