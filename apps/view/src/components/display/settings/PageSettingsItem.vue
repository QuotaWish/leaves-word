<script setup lang="ts">
defineProps<{
  title: string
  desc?: string
  showArrow?: boolean
  showSwitch?: boolean
  switchValue?: boolean
}>()

defineEmits<{
  (e: 'click'): void
  (e: 'switchChange', value: boolean): void
}>()
</script>

<template>
  <div class="PageSettingsItem" @click="$emit('click')">
    <div class="PageSettingsItem-content">
      <div class="PageSettingsItem-title">{{ title }}</div>
      <div class="PageSettingsItem-desc" v-if="desc">{{ desc }}</div>
    </div>

    <div v-if="showSwitch" class="switch-container">
      <label class="switch">
        <input
          type="checkbox"
          :checked="switchValue"
          @change="$emit('switchChange', ($event.target as HTMLInputElement).checked)"
        >
        <span class="slider" />
      </label>
    </div>
    <div class="PageSettingsItem-right mx-2" v-else>
      <slot />
    </div>

    <span v-if="showArrow" class="arrow" />
  </div>
</template>

<style lang="scss" scoped>
.PageSettingsItem {
  padding: 13px 16px;
  cursor: pointer;
  display: flex;
  justify-content: space-between;
  align-items: center;
  transition: background-color 0.15s ease;
  background-color: transparent;
  min-height: 44px;

  &:not(:last-child) {
    border-bottom: 1px solid rgba(0, 0, 0, 0.05);
  }

  &:active {
    background-color: rgba(0, 0, 0, 0.05);
  }

  &-content {
    flex-grow: 1;
    padding-right: 10px;
    display: flex;
    flex-direction: column;
    justify-content: center;
  }

  &-title {
    font-size: 16px;
    color: #000;
    line-height: 1.3;
  }

  &-desc {
    font-size: 13px;
    color: #8E8E93;
    margin-top: 4px;
    line-height: 1.2;
  }
}

.arrow {
  display: flex;
  align-items: center;
  margin-right: 5px;

  &::after {
    content: '';
    display: inline-block;
    width: 7px;
    height: 7px;
    border-top: 1px solid #C7C7CC;
    border-right: 1px solid #C7C7CC;
    transform: rotate(45deg);
  }
}

.switch-container {
  display: flex;
  align-items: center;
}

.switch {
  position: relative;
  display: inline-block;
  width: 51px;
  height: 31px;
}

.switch input {
  opacity: 0;
  width: 0;
  height: 0;
}

.slider {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: #E9E9EA;
  border-radius: 31px;
  transition: 0.2s;
}

.slider:before {
  position: absolute;
  content: '';
  height: 27px;
  width: 27px;
  left: 2px;
  bottom: 2px;
  background-color: white;
  border-radius: 50%;
  transition: 0.2s;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.15);
}

input:checked + .slider {
  background-color: #34C759;
}

input:checked + .slider:before {
  transform: translateX(20px);
}

:root.dark {
  .PageSettingsItem {
    &:not(:last-child) {
      border-bottom: 1px solid rgba(255, 255, 255, 0.1);
    }

    &-title {
      color: #FFFFFF;
    }

    &-desc {
      color: #8E8E93;
    }

    &:active {
      background-color: rgba(255, 255, 255, 0.05);
    }
  }

  .slider {
    background-color: #39393D;
  }

  .arrow::after {
    border-color: #636366;
  }
}
</style>