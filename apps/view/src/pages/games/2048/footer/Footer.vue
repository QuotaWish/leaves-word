<script setup lang="ts">
import GameSvg from '../assets/game.svg?raw'
import RankSvg from '../assets/rank.svg?raw'
import SettingSvg from '../assets/setting.svg?raw'
import FooterButton from './FooterButton.vue'

const props = defineProps<{
  modelValue: string,
}>()
const emits = defineEmits(['update:modelValue', 'settings'])

const active = computed({
  get() {
    return props.modelValue
  },
  set(value) {
    emits('update:modelValue', value)
  },
})
const buttons = [
  {
    icon: RankSvg,
    text: '排行',
    click: () => {
      emits('settings', false)
    },
  },
  {
    icon: GameSvg,
    text: '游戏',
    click: () => {
      emits('settings', false)
    },
  },
  {
    icon: SettingSvg,
    text: '设置',
    click: () => {
      emits('settings', true)
    },
  },
]

function handleActive(e: Event, value: any) {
  e.stopPropagation();
  e.stopImmediatePropagation()
  e.preventDefault()

  active.value = value.text

  value?.click()
}

function handleStop(e: Event) {
  e.stopPropagation();
  e.stopImmediatePropagation()
  e.preventDefault()
}
</script>

<template>
  <div @touchstart="handleStop" class="Footer">
    <FooterButton @touchstart="handleActive($event, item)" @click="handleActive($event, item)"
      :active="active === item.text" v-for="item in buttons" :icon="item.icon">{{ item.text }}
    </FooterButton>
  </div>
</template>

<style>
.Footer {
  z-index: 1000;
  position: absolute;
  padding: .5rem 0;
  display: flex;

  align-items: center;
  justify-content: space-around;

  width: 100%;
  height: 10%;

  bottom: 0;

  box-sizing: border-box;
  background-color: #e6e6e680;
  backdrop-filter: blur(18px) saturate(180%);
}
</style>
