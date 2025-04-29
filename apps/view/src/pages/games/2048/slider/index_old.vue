<script setup lang="ts">
import RestartSvg from './../assets/restart.svg?raw'

const props = defineProps<{
  modelValue: string,
  time: number
}>()

const slideOptions = reactive({
  ind: 0,
  touched: false,
  lastX: -1,
  startX: -1
})
const dom = ref()
const emit = defineEmits<{
  (e: 'update:modelValue', value: string): void
}>()

const modes = [
  {
    name: "经典排行模式",
    mode: "rank"
  },
  {
    name: "娱乐竞速模式",
    mode: "speed"
  },
  {
    name: "双人交换模式",
    mode: "mul-swap"
  },
  {
    name: "残局解法模式",
    mode: "solve"
  }
]

const timeFormat = computed(() => {
  // 将数字转换成 xx:xx
  const minutes = Math.floor(props.time / 60)
  const seconds = props.time % 60

  return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`
})

onMounted(() => {
  dom.value.addEventListener('touchstart', (e: TouchEvent) => {
    e.stopImmediatePropagation()
    e.preventDefault()

    console.log('touch')
    slideOptions.touched = true

    slideOptions.startX = e.touches[0].clientX
  })

  document.addEventListener('touchmove', (e: TouchEvent) => {
    if (!slideOptions.touched) return

    e.stopImmediatePropagation()
    e.preventDefault()

    // 判断向左还是向右滑动 （力度达到一定值）
    if (e.touches.length !== 1) return

    const touch = e.touches[0]
    console.log('e', e, touch)

    const totalDiff = touch.clientX - slideOptions.startX
    const el = dom.value.querySelector('.GameSlider-Main')

    el.style.transform = `translateX(${totalDiff}px)`

    console.log('e', slideOptions)

  })

  document.addEventListener('touchcancel', (e: Event) => {
    if (!slideOptions.touched) return

    e.stopImmediatePropagation()
    e.preventDefault()

    console.log('touchend')
    slideOptions.touched = false
  })

  document.addEventListener('touchend', (e: Event) => {
    if (!slideOptions.touched) return

    e.stopImmediatePropagation()
    e.preventDefault()

    console.log('touchend')
    slideOptions.touched = false
  })
})

watch(() => props.modelValue, (value) => {
  const index = modes.findIndex(item => item.mode === value)

  if (index === -1) return

  slideOptions.ind = index
}, { immediate: true })

watch(() => slideOptions.ind, (value) => {
  if (!dom.value) return

  const el = dom.value.querySelector('.GameSlider-Main')
  if (!el) return

  el.style.transform = `translateX(-${value * 100}%)`
}, { immediate: true })
</script>

<template>
  <div ref="dom" class="GameSlider" :class="{ touched: slideOptions.touched }">
    <div class="GameSlider-Main">
      <div class="GameMode" :class="{ active: item.mode === props.modelValue }" v-for="item in modes">
        {{ item.name }}
      </div>
    </div>
    <div class="GameSlider-Off">
      <span v-if="time">{{ timeFormat }}</span>
      <div class="restart-button" v-html="RestartSvg" />
    </div>
  </div>
</template>

<style>
.GameSlider.touched .GameMode {
  transform: scale(.8)
}

.GameSlider.touched {
  background-color: #e6e6e690;
}

.GameSlider-Main {
  display: flex;

  width: calc(100% - 100px);
  flex-basis: calc(100% - 100px);
  height: 100%;

  overflow: hidden;
}

.GameMode {
  position: relative;

  flex-shrink: 0;

  width: 100%;
  height: 100%;
  line-height: 50px;

  opacity: 0;
  transition: .25s;

  background-color: blue;
}

.GameMode.active {
  opacity: 1;

  background-color: red;
}

.GameSlider {
  position: absolute;
  padding: 0 .5rem;
  /* display: flex; */

  /* align-items: center; */

  /* justify-content: space-between; */

  bottom: 10%;

  height: 50px;

  width: 100%;

  background-color: #e6e6e685;
  backdrop-filter: blur(18px) saturate(180%);
}

.GameSlider-Off {
  position: absolute;

  top: 0;
  right: 0;

  gap: .25rem;
  display: flex;

  width: 100px;
  justify-content: center;
  align-items: center;

  /* background-color: #e6e6e685;
  backdrop-filter: blur(18px) saturate(180%); */
}

.GameSlider-Off span {
  display: block;

  line-height: 50px;
}

.restart-button svg {
  width: 24px;
  height: 24px
}

.restart-button {
  display: flex;
  justify-content: center;
  align-items: center;

  width: 40px;
  height: 40px;

  cursor: pointer;
  border-radius: 8px;
}

.restart-button:hover {
  background-color: #e6e6e685;
}
</style>
