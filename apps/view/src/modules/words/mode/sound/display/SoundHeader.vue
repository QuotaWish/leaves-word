<script setup lang="ts">
import LineProgress from '~/components/chore/LineProgress.vue'
import { globalPreference } from '~/modules/words/core';
import { SoundExampleStage, SoundWordType } from '~/modules/words/mode/sound'

const props = defineProps<{
  // 共享的属性
  newlyWords?: number;
  reviewWords?: number;
  max?: number;
  left?: number;
  progress?: number;

  // 模式相关
  wordType?: SoundWordType;
  exampleStage?: SoundExampleStage;
  hint: string;
}>()

const emits = defineEmits<{
  (e: "quit"): void;
}>()

const router = useRouter()

function goDictionary() {
  router.push(`/dictionary/${globalPreference.value.dict.data?.id}`)
}

// 计算进度
const progressValue = computed(() => {
  // 如果直接提供了progress属性，则使用它
  if (props.progress !== undefined) {
    return props.progress;
  }

  if (props.max && props.left !== undefined) {
    return 1 - (props.left / props.max);
  }

  return 0;
})
</script>

<template>
  <div>
    <div flex items-center justify-between gap-2 class="SoundHeader p-4">
      <div flex items-center gap-2 class="SoundHeader-Left">
        <div cursor-pointer i-carbon:chevron-left class="back-btn" @click="emits('quit')" />
        <p class="SoundHeader-Title">
          <span v-if="max !== undefined">总量 {{ max }}</span>
          <span v-if="left !== undefined">剩余 {{ left }}</span>
        </p>
      </div>

      <h1 flex items-center gap-2 text-sm op-75 @click="goDictionary">
        <el-link>{{ globalPreference.dict.data?.name }}</el-link>
      </h1>
    </div>

    <div class="SoundHeader-Progress">
      <LineProgress :min="0.035" plain :progress="progressValue" />
    </div>

    <div v-if="hint" class="mode-hint-bar">
      {{ hint }}
    </div>
  </div>
</template>

<style lang="scss" scoped>
.SoundHeader {
  &-Title {
    display: flex;
    padding-right: 1rem;
    font-size: 12px;
    flex-direction: column;
    color: var(--el-text-color-secondary);
  }

  &-Left {
    align-self: flex-start;

    .back-btn {
      font-size: 1.2rem;
      transition: transform 0.2s ease;

      &:hover {
        transform: translateX(-2px);
      }
    }
  }
}

.mode-hint-bar {
  background-color: var(--theme-primary, #4a6fa5);
  padding: 8px 15px;
  font-size: 14px;
  font-weight: 500;
  text-align: center;
  position: relative;
  z-index: 5;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  animation: fadeIn 0.3s ease;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }

  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>
