<script setup lang="ts">
import LineProgress from '~/components/chore/LineProgress.vue'
import { globalPreference, useTargetData } from '~/modules/words'
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

  // 控制显示
  showModeHint?: boolean;
}>()

const emits = defineEmits<{
  (e: "quit"): void;
}>()

const router = useRouter()
const { targetDict } = useTargetData()

function goDictionary() {
  // 优先使用targetDict，如果不存在则使用globalPreference
  const dictId = (targetDict.value as any)?.id || globalPreference.value.dict.data?.id
  router.push(`/dictionary/${dictId}`)
}

const dictName = computed(() => {
  // 优先使用targetDict，如果不存在则使用globalPreference
  return (targetDict.value as any)?.name || globalPreference.value.dict.data?.name
})

const modeHintText = computed(() => {
  if (!props.showModeHint || !props.wordType) {
    return '';
  }

  if (props.wordType === SoundWordType.DICTATION) {
    return '听写模式 - 请输入您听到的单词';
  }

  if (props.wordType === SoundWordType.EXAMPLE) {
    if (props.exampleStage === SoundExampleStage.PLUS_ONE) {
      return '例句模式 - 第1阶段 (单词前置+目标单词)';
    } else if (props.exampleStage === SoundExampleStage.PERCENT_WORD) {
      return '例句模式 - 第2阶段 (部分例句+目标单词)';
    } else if (props.exampleStage === SoundExampleStage.FULL_SENTENCE) {
      return '例句模式 - 第3阶段 (完整例句)';
    }
  }

  return '';
});

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
          <span v-if="newlyWords !== undefined">需学习 {{ newlyWords }}</span>
          <span v-else>需新学 {{ reviewWords !== undefined ? reviewWords : 0 }}</span>
          <span v-if="left !== undefined">剩余 {{ left }}</span>
          <span v-else>需复习 {{ reviewWords !== undefined ? reviewWords : 0 }}</span>
        </p>
      </div>

      <div class="SoundHeader-Info">
        <slot name="badge" />
      </div>

      <h1 flex items-center gap-2 text-sm op-75 @click="goDictionary">
        <el-link class="dictionary-link">{{ dictName }}</el-link>
      </h1>
    </div>

    <div v-if="showModeHint && modeHintText" class="mode-hint-bar">
      {{ modeHintText }}
    </div>

    <div class="SoundHeader-Progress">
      <LineProgress plain :progress="progressValue" />
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

  &-Info {
    // 徽章区域样式
  }
}

.dictionary-link {
  font-weight: 500;

  &:hover {
    text-decoration: underline;
  }
}

.mode-hint-bar {
  background-color: var(--theme-primary, #4a6fa5);
  padding: 8px 15px;
  font-size: 14px;
  font-weight: 500;
  text-align: center;
  border-radius: 0 0 12px 12px;
  margin: 0 0 10px 0;
  position: relative;
  z-index: 5;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  animation: fadeIn 0.3s ease;
}

.dark .mode-hint-bar {
  color: #121212;
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
