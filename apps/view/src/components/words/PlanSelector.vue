<script setup lang="ts">
import { Picker } from 'vant'
import { globalPreference } from '~/modules/words/core/feat/preference'

// TODO: 暂时做成单词总数量
const max = computed(() => globalPreference.value.dict.data?.approved_words ?? 0) // targetDict.value.storage.getUnlearnedWords().length)
const amount = computed(() => globalPreference.value.amount || 10)
const options = computed(() => Array.from({ length: max.value / 5 }, (_, i) => (i + 1) * 5))

// 根据每个选项算出天数 然后倒叙
const days = computed(() => options.value.map(option => Math.ceil(max.value / +option)))

const amountColumns = computed(() => options.value.map(item => ({
  text: `${item}个`,
  value: item,
})))

const dayColumns = computed(() => [...new Set(days.value)].map(item => ({
  text: `${item}天`,
  value: item,
})))

const model = ref<number[]>([amount.value, max.value / amount.value])
const columns = computed(() => [amountColumns.value, dayColumns.value])

const picker1 = ref()
const picker2 = ref()

function handleChange({ columnIndex, selectedValues }: any) {
  // 修改数量
  if (columnIndex === 0) {
    // 影响天数
    const day = Math.ceil(max.value / selectedValues[0])

    model.value = [selectedValues[0], day]
  }
  else {
    // 影响数量
    const num = Math.ceil(max.value / selectedValues[1])

    model.value = [num, selectedValues[1]]
  }

  globalPreference.value.amount = model.value[0]
}
</script>

<template>
  <div class="PlanPicker">
    <Picker
      ref="picker1" v-model="model" :visible-item-count="3" title="每日打卡数量" :columns="columns"
      @change="handleChange"
    >
      <template #toolbar>
        <div w-full flex items-center justify-around>
          <p>每日打卡数量</p>
          <p>累计完成天数</p>
        </div>
      </template>
    </Picker>

    <div v-if="false" class="PlanPicker-Column">
      <div class="PlanPicker-Header-Title">
        每日打卡数量
      </div>
      <ul class="PlanPicker-Main">
        <!-- @confirm="onConfirm" @cancel="onCancel" @change="onChange" -->
      </ul>
    </div>
    <div v-if="false" class="PlanPicker-Column">
      <div class="PlanPicker-Header-Title">
        累计完成天数
      </div>
      <ul class="PlanPicker-Main">
        <Picker ref="picker2" :show-toolbar="false" :visible-item-count="3" title="每日打卡数量" :columns="dayColumns" />
      </ul>
    </div>

    <div class="PlanPicker-Selection">
      <div class="checkmark">
        <div i-carbon:checkmark />
      </div>
    </div>
  </div>
</template>

<style lang="scss">
.PlanPicker-Selection {
  &::before {
    content: '';
    position: absolute;

    top: 0;
    left: 0;

    width: 100%;
    height: 100%;

    z-index: -1;

    opacity: 0.25;
    background-color: var(--theme-color-light);
  }
  .checkmark {
    position: absolute;
    display: flex;

    top: 50%;
    right: 0.5rem;

    width: 24px;
    height: 24px;

    color: #000;
    align-items: center;
    justify-content: center;

    border-radius: 50%;
    background-color: var(--theme-color-light);

    transform: translateY(-50%);
  }
  position: absolute;
  padding: 0.75rem 0;

  top: 50%;

  width: 100%;
  height: 40px;

  pointer-events: none;
  transform: translateY(-50%) translateY(1rem) translateY(14px);
}

.PlanPicker-Column {
  .PlanPicker-Header-Title {
    padding: 1rem 0;

    color: var(--el-text-color-secondary);

    border-bottom: 1px solid var(--el-border-color);
  }

  .PlanPicker-Main {
    li {
      margin: 1rem 0;

      text-align: center;
    }
    height: 200px;

    width: 100%;

    justify-content: center;
  }
  z-index: 1;
  display: flex;

  align-items: center;
  flex-direction: column;
  justify-content: center;
}

.PlanPicker {
  --van-picker-background: var(--bg-color);
  --van-picker-option-text-color: var(--el-text-color-primary);

  .van-picker {
    width: 100%;
  }

  .van-picker__mask {
    display: none;
  }
  padding: 1rem;
  display: flex;

  width: 100%;

  justify-content: space-around;
}
</style>
