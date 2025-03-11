<script setup>
import {onMounted, reactive, ref, watch} from 'vue'
import GM from '../utils/util'
import {
  getSlideOffset,
  slideInit,
  slideReset,
  slidePointerUp,
  slidePointerMove,
  slidePointerDown,
  SlideType
} from '../utils/slide'

const props = defineProps({
  index: {
    type: Number,
    default: () => {
      return 0
    }
  },
  name: {
    type: String,
    default: () => 'SlideHorizontal'
  },
  autoplay: {
    type: Boolean,
    default: () => false
  },
  indicator: {
    type: Boolean,
    default: () => false
  },
  //改变index，是否使用动画
  changeActiveIndexUseAnim: {
    type: Boolean,
    default: true
  }
})
const emit = defineEmits(['update:index'])

//slide-list的ref引用
const wrapperEl = ref(null)

const state = reactive({
  judgeValue: 20,//一个用于判断滑动朝向的固定值
  type: SlideType.HORIZONTAL,//组件类型
  name: props.name,
  localIndex: props.index,//当前下标
  needCheck: true,//是否需要检测，每次按下都需要检测，up事件会重置为true
  next: false,//能否滑动
  isDown: false,//是否按下，用于move事件判断
  start: {x: 0, y: 0, time: 0},//按下时的起点坐标
  move: {x: 0, y: 0},//移动时的坐标
  wrapper: {width: 0, height: 0, childrenLength: 0}//slide-list的宽度和子元素数量
})

watch(
    () => props.index,
    (newVal) => {
      if (state.localIndex !== newVal) {
        state.localIndex = newVal
        if (props.changeActiveIndexUseAnim) {
          GM.$setCss(wrapperEl.value, 'transition-duration', `300ms`)
        }
        GM.$setCss(
            wrapperEl.value,
            'transform',
            `translate3d(${getSlideOffset(state, wrapperEl.value)}px, 0, 0)`
        )
      }
    }
)

onMounted(() => {
  slideInit(wrapperEl.value, state)

  if (props.autoplay) {
    setInterval(() => {
      if (state.localIndex === state.wrapper.childrenLength - 1) {
        emit('update:index', 0)
      } else {
        emit('update:index', state.localIndex + 1)
      }
    }, 3000)
  }
})

function onPointerDown(e) {
  slidePointerDown(e, wrapperEl.value, state)
}

function onPointerMove(e) {
  slidePointerMove(e, wrapperEl.value, state)
}

function onPointerUp(e) {
  slidePointerUp(e, state)
  slideReset(e, wrapperEl.value, state, emit)
}
</script>

<template>
  <div class="slide horizontal">
    <div class="indicator-bullets" v-if="indicator && state.wrapper.childrenLength">
      <div
          class="bullet"
          :class="{ active: state.localIndex === item - 1 }"
          :key="i"
          v-for="(item, i) in state.wrapper.childrenLength"
      ></div>
    </div>
    <div
        class="slide-list"
        ref="wrapperEl"
        @pointerdown="onPointerDown"
        @pointermove="onPointerMove"
        @pointerup="onPointerUp"
    >
      <slot></slot>
    </div>
  </div>
</template>

<style scoped>
.indicator-bullets {
  position: absolute;
  bottom: 10px;
  z-index: 2;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  justify-content: center;
  gap: 10px;
}

.bullet {
  width: 7px;
  height: 7px;
  border-radius: 50%;
  background: rgb(58, 58, 70);

  &.active {
    background: white;
  }
}
</style>
