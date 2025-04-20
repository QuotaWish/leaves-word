<script setup lang="ts">
import RestartSvg from './../assets/restart.svg?raw'

const props = defineProps<{
  modelValue: string,
  time: number,
  gameSettings: any
}>()

const slideOptions = reactive<any>({
  slide: null,
  ind: 0,
  touched: false,
  lastX: -1,
  startX: -1,
  lastY: -1,
  startY: -1
})

const dom = ref()
const emit = defineEmits<{
  (e: 'update:modelValue', value: string): void
  (e: 'restart', ignoreState: boolean): void
}>()

const modes = [
  {
    name: "经典排行模式",
    mode: "rank",
    toggled: () => {

    }
  },
  {
    name: "娱乐竞速模式",
    mode: "speed",
    toggled: () => {
      const { speed } = props.gameSettings

      if (!speed.tip) {
        alert('娱乐竞速模式将会每隔一段时间自动生成一个方块，你可以通过观察背景移动察觉生成时间！')

        speed.tip = true
      }
    }
  },
  // {
  //   name: "双人交换模式",
  //   mode: "mul-swap"
  // },
  // {
  //   name: "残局解法模式",
  //   mode: "solve"
  // }
]

const timeFormat = computed(() => {
  // 将数字转换成 xx:xx
  const minutes = Math.floor(props.time / 60)
  const seconds = props.time % 60

  return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`
})

watch(() => slideOptions.ind, (value, oldVal) => {
  emit('update:modelValue', modes[value].mode)

  nextTick(() => {
    const oldMode = modes[oldVal]

    oldMode && document.body.classList.remove(oldMode.mode)
    if (oldMode) emit('restart', true)
    document.body.classList.add(modes[value].mode)

    const el = dom.value.querySelector('.GameSlider-Container')

    el.style.transform = `translateX(${value * -100}%) translateX(0)`

    modes[value].toggled?.()
  })
}, { immediate: true })

onMounted(() => {
  const gameWrapper = document.querySelector('.GameWrapper')!

  const gwRect = gameWrapper.getBoundingClientRect()

  const _H = gwRect.top

  dom.value.addEventListener('touchstart', (e: TouchEvent) => {
    e.stopImmediatePropagation()
    e.preventDefault()

    const { target } = e
    if (target instanceof Element && !target.classList.contains('GameMode')) return

    const { modeTip } = props.gameSettings
    if (!modeTip) {
      alert('切换模式会导致游戏强制重新开局，并且非新手模式仅在经典排行模式下有效。')

      props.gameSettings.modeTip = true
      return
    }

    slideOptions.touched = true

    if (_restart.value) {
      slideOptions.startY = slideOptions.lastY = e.touches[0].clientY
    } else slideOptions.startX = slideOptions.lastX = e.touches[0].clientX
  })

  document.addEventListener('touchmove', (e: TouchEvent) => {
    if (!slideOptions.touched) return

    e.preventDefault()
    e.stopImmediatePropagation()

    // 判断向左还是向右滑动 （力度达到一定值）
    if (e.touches.length !== 1) return

    const touch = e.touches[0]

    if (_restart.value) {
      const totalDiff = touch.clientY - slideOptions.startY
      if (totalDiff >= 0) return

      const el = dom.value

      const rect = el.getBoundingClientRect()

      const _B = rect.top + totalDiff

      if (_B <= _H) {
        el.style.width = '50px'
        el.style.borderRadius = '50%'
      } else {
        el.style.width = ''
        el.style.borderRadius = ''
      }

      el.style.transform = `translateX(-50%) translateY(${totalDiff}px)`

      slideOptions.lastY = touch.clientY
      return
    }

    const totalDiff = touch.clientX - slideOptions.startX
    const el = dom.value.querySelector('.GameSlider-Container')

    el.style.transform = `translateX(${slideOptions.ind * -100}%) translateX(${totalDiff}px)`

    slideOptions.lastX = touch.clientX

  })

  document.addEventListener('touchcancel', (e: Event) => {
    if (!slideOptions.touched) return

    e.stopImmediatePropagation()
    e.preventDefault()

    slideOptions.touched = false
  })

  document.addEventListener('touchend', (e: Event) => {
    if (!slideOptions.touched) return

    e.stopImmediatePropagation()
    e.preventDefault()

    slideOptions.touched = false

    if (_restart.value) {
      const el = dom.value
      const rect = el.getBoundingClientRect()
      const totalDiff = slideOptions.lastY - slideOptions.startY

      const _B = rect.top + totalDiff

      if (_B <= _H) {
        _restart.value = false

        setTimeout(() => {
          emit('restart', true)
        }, 200)
      }

      const elasticDistance = totalDiff * 0.15

      el.style.width = ''
      el.style.borderRadius = ''
      el.style.transform = `translateX(-50%) translateY(${elasticDistance}px)`
      setTimeout(() => {
        el.style.transform = 'translateX(-50%) translateY(0px)'
      }, 200)

      return
    }

    const totalDiff = slideOptions.lastX - slideOptions.startX

    slideOptions.lastX = -1
    slideOptions.startX = -1

    let _ = false
    // 循环这个ind
    if (totalDiff < 0) {
      if (slideOptions.ind === modes.length - 1) _ = true
      else slideOptions.ind = (slideOptions.ind + 1) % modes.length
    } else {
      if (slideOptions.ind === 0) _ = true
      else slideOptions.ind = (slideOptions.ind - 1 + modes.length) % modes.length
    }

    // 判断向左还是向右滑动 （力度达到一定值）
    if (_ || Math.abs(totalDiff) < 50) {
      const el = dom.value.querySelector('.GameSlider-Container')

      // 计算回弹距离
      const elasticDistance = totalDiff * 0.15

      el.style.transform = `translateX(${slideOptions.ind * -100}%) translateX(${(totalDiff < 0 ? 1 : -2) * elasticDistance}px)`

      setTimeout(() => {
        el.style.transform = `translateX(${slideOptions.ind * -100}%) translateX(0px)`
      }, 200)
      return
    }

  })
})

const _restart = ref(false)

function restart(e: Event) {
  e.stopImmediatePropagation()
  e.preventDefault()

  _restart.value = !_restart.value
}

function handleTouchProcess(e: TouchEvent) {
  // e.stopImmediatePropagation()
  e.preventDefault()

  restart(e)
}
</script>

<template>
  <div ref="dom" class="GameSlider" :class="{ restart: _restart, touched: slideOptions.touched }">
    <div class="GameSlider-Main">
      <div class="GameSlider-Container">
        <div class="GameMode" :class="{ active: item.mode === props.modelValue }" v-for="item in modes">
          {{ item.name }}
        </div>
      </div>
      <div v-if="_restart" class="GameSlider-Restart">
        向上滑动以完成重启游戏...
      </div>
    </div>
    <div @touchstart="handleTouchProcess" class="GameSlider-Off">
      <span>{{ timeFormat }}</span>
      <div @click="restart" class="restart-button" v-html="RestartSvg" />
    </div>
    <div class="GameSlider-FloatRestart" />
  </div>
</template>

<style>
.GameSlider-FloatRestart,
div.GameSlider.touched .GameSlider-FloatRestart {
  position: absolute;

  left: 50%;
  bottom: calc(10% + 50px);

  width: 30%;
  height: 5px;

  border-radius: 8px;
  background-color: #21212100;
  transform: translateX(-50%);

  animation: sliding 1.5s infinite ease-out;
}

.GameSlider.restart .GameSlider-FloatRestart {
  background-color: #212121A0;
}

@keyframes sliding {

  0% {
    width: 25%;
    opacity: 1;
    transform: translateX(-50%) translateY(0);
  }

  50% {
    width: 30%;
    opacity: 0.85;
    transform: translateX(-50%) translateY(-15px);
  }

  60% {
    width: 30%;
    opacity: 0;
    transform: translateX(-50%) translateY(-15px);
  }

  100% {
    width: 25%;
    opacity: 0;
    transform: translateX(-50%) translateY(0);
  }
}

div.GameSlider.touched .GameSlider-Restart,
div.GameSlider.touched.restart .GameSlider-Off span {
  opacity: 0;
  filter: blur(5px);
}

.GameSlider.restart .GameSlider-Restart {
  opacity: 1;
  filter: blur(0);
}

.GameSlider-Restart {
  position: absolute;
  display: flex;

  align-items: center;

  left: 0;
  top: 0;

  height: 100%;

  opacity: 0;
  filter: blur(5px);
  transition: .25s;
}

.GameSlider.restart .GameSlider-Container,
.GameSlider.restart .GameSlider-Off span {
  opacity: 0;
  filter: blur(5px);
}

.GameSlider-Main {
  transition: .25s;
}

.GameSlider.touched .GameMode {
  transform: scale(.8)
}

.GameSlider.touched {
  background-color: #e6e6e690;
}

.GameSlider-Main {
  position: relative;

  width: calc(100% - 100px);
  height: 100%;

  overflow: hidden;
}

.GameSlider-Container {
  display: flex;

  align-items: center;

  width: 100%;

  transition: .25s;
}

.GameMode {
  position: relative;
  display: flex;

  align-items: center;

  flex-shrink: 0;

  width: 100%;
  height: 100%;
  line-height: 50px;

  /* opacity: 0; */
  transition: .25s;
}

.GameMode.active {
  opacity: 1;

}

.GameSlider {
  position: absolute;
  padding: 0 .5rem;
  /* display: flex; */

  /* align-items: center; */

  /* justify-content: space-between; */

  left: 50%;
  bottom: 10%;

  height: 50px;

  width: 100%;

  color: #000;
  transition: .25s;
  transform: translateX(-50%);
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

  transition: .25s;
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
