<script setup lang="ts">
import { globalData, useTargetData } from "~/composables/words";
import type { ModeType } from "~/modules/words/mode";
import { modeManager } from "~/modules/words/mode";

const { targetDict } = useTargetData();
const modes = [...modeManager.keys()];
const activeIndex = ref(modes.indexOf(globalData.value.mode) ?? 0);

// const activeMode = computed(() => modes[activeIndex.value])

function modeIns(modeType: ModeType) {
  const mode = modeManager.get(modeType)!;

  const dict = targetDict.value.storage;
  const modeInstance = mode(dict);

  return modeInstance;
}

function handleSelect(index: number) {
  activeIndex.value = index;

  const mode = modes[index];

  globalData.value.mode = mode;
}
</script>

<template>
  <div class="ModeSelector">
    <div class="ModeSelector-Wrapper">
      <el-carousel
        :initial-index="activeIndex"
        arrow="never"
        :autoplay="false"
        indicator-position="none"
        type="card"
        @change="handleSelect"
      >
        <el-carousel-item v-for="(mode, index) in modes" :key="index">
          <mode-display
            :mode="modeIns(mode)"
            :class="{ select: index === activeIndex }"
          />
        </el-carousel-item>
      </el-carousel>
    </div>
  </div>
</template>

<style lang="scss">
.ModeSelector-Wrapper {
  .el-carousel {
    .el-carousel__mask {
      background-color: transparent;
    }
    &__item {
      display: flex;
    }
    width: 100%;
    &__container {
      height: 300px;
    }
  }
}

.ModeSelector {
  width: 100%;
  max-height: 300px;
  overflow: hidden;
}
</style>
