<script setup lang="ts">
import type { IDict } from '~/composables/words'
import { dictionaries, globalData } from '~/composables/words'

const active = computed({
  get() {
    return globalData.value.dict
  },
  set(val) {
    globalData.value.dict = val
  },
})
const el = ref<HTMLElement>()
const { isSwiping, direction } = useSwipe(el)

async function fixActive() {
  const id = `selector-item-${active.value}`
  const dom = document.querySelector(`#${id}`)

  if (!dom)
    return

  dom.scrollIntoView({ behavior: 'smooth', block: 'nearest' })
}

watch(active, () => nextTick(() => fixActive()), { immediate: true })

function generateStyles(dict: IDict) {
  const obj: Record<string, string> = {
    '--color': dict.style.color,
    '--color-light': dict.style.colorLight,
  }

  const style = Object.keys(obj).reduce((acc, cur) => {
    acc += `${cur}: ${obj[cur]};`
    return acc
  }, '')

  return style
}
</script>

<template>
  <div ref="el" :class="{ swiping: isSwiping }" class="DictSelector">
    <el-scrollbar>
      <div class="DictSelector-Wrapper">
        <div
          v-for="(dict, ind) in dictionaries" :id="`selector-item-${ind}`"
          :key="dict.id" :style="generateStyles(dict)" :class="{ active: dict.id === active }"
          class="DictSelector-Item" @click="active = dict.id"
        >
          <p class="title">
            {{ dict.name }}
          </p>

          <div class="icon">
            <div v-html="dict.style.icon" />
          </div>

          <div class="checkmark">
            <div i-carbon-checkmark />
          </div>
        </div>
      </div>
    </el-scrollbar>

    <!-- <el-button style="width: 85%;left: 7.5%" relative my-6 type="primary" size="large">
      确定
    </el-button> -->
  </div>
</template>

<style lang="scss">
.DictSelector-Item {
  .icon {
    & > div svg {
      width: 32px;
      height: 32px;

      opacity: 0.125;
      transform: translate(8px, 20px) scale(2);
    }
    z-index: 1;
    position: relative;

    width: 24px;
    height: 24px;

    mix-blend-mode: difference;
    color: var(--el-text-color-secondary);
  }

  .checkmark {
    position: absolute;
    display: flex;

    width: 32px;
    height: 32px;

    right: 0.5rem;
    bottom: 0.5rem;

    align-items: center;
    justify-content: center;

    border-radius: 50%;
    background-color: var(--el-fill-color);

    transition: 0.25s;
    transform: scale(0);
  }

  &::before {
    content: '';
    position: absolute;

    bottom: 0px;
    right: -2px;

    width: 98%;
    height: 3px;

    border-radius: 16px 0 16px 16px;
    background-color: var(--el-fill-color);
  }

  &.active {
    .checkmark {
      transform: scale(1);
    }

    border: 2px solid var(--color-light);
  }

  .title {
    font-size: 18px;
    font-weight: 600;

    color: #000;
  }
  position: relative;
  padding: 1rem;

  width: 120px;
  height: 150px;

  flex: 1 0 120px;
  border-radius: 6px 2px 4px 8px;
  background-image: linear-gradient(to right, var(--color), var(--color-light)),
    linear-gradient(120deg, #a6c0fe 0%, #f68084 100%);
  border: 2px solid #0000;
}

.DictSelector-Wrapper {
  padding: 3rem 1rem 2rem 1rem;
  display: flex;

  gap: 0.5rem;
  // width: 100%;
}

.DictSelector {
  position: relative;

  width: 100%;

  overflow: hidden;
}
</style>
