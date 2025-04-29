<script setup lang="ts">
import { watchEffect, ref, watch } from 'vue'

const props = defineProps<{
  val: number,
  x: number,
  y: number,
  angle: any,
  tracks: Array<Object>,
}>();

const dom = ref()
watchEffect(() => {
  const el = dom.value
  if (!el) return

  const { x, y, tracks, angle } = props

  el.style.setProperty('--r', `${angle || 0}deg`)
  el.style.transform = 'rotate(var(--r, 0)) scale(1)'

  el.style.color = colors[props.val!]
  el.style.fontSize = `${fontSizes[props.val === 0 ? 0 : Math.log2(props.val!)] * 2}rem`
  el.style.background = `${backColors[props.val!]}A0`

  if (tracks?.length) {
    const res: any = [...tracks].filter((track: any) => track.to[0] === x && track.to[1] === y)
    if (!res.length) return

    const { from, to } = res[0]
    // if (to[0] !== x || to[1] !== y) return

    el.style.transition = '0s'
    el.style.left = `${(from[0]!) * 25 + 1}%`
    el.style.top = `${(from[1]!) * 25 + 1}%`

    el.style.transform = 'rotate(var(--r, 0)) scale(0.8)'

    setTimeout(() => {
      el.style.transform = 'rotate(var(--r, 0)) scale(1)'
    }, 100)

    setTimeout(() => {

      el.style.transition = '.125s'
      el.style.left = `${(to[0]!) * 25 + 1}%`
      el.style.top = `${(to[1]!) * 25 + 1}%`
    }, 50)

    // console.log("track", res, JSON.stringify(props), el.style)
  } else {
    el.style.left = `${x! * 25 + 1}%`
    el.style.top = `${y! * 25 + 1}%`
  }

})

//                 0 2 4 8     16   32    64   128   256  512  1024 2048  4096
const fontSizes = [1, 1, 0.95, 0.9, 0.9, 0.8, 0.75, 0.7, 0.65, 0.6, 0.55, 0.55, 0.55]

const backColors: Array<string> = []
backColors[0] = '#f6f6f6'
backColors[2] = '#87E293'
backColors[4] = '#87E273'
backColors[8] = '#eecf40'
backColors[16] = '#ffaa4f'
backColors[64] = '#9ebbee'
backColors[32] = '#6bcae2'
backColors[128] = '#9ebbee'
backColors[256] = '#8bc002'
backColors[512] = '#fb0ae2'
backColors[1024] = '#5b5aAF'
backColors[2048] = '#8bF082'
backColors[4096] = '#8bFaF2'

const colors: Array<string> = []
colors[0] = '#000'
colors[2] = 'white'
colors[4] = 'white'
colors[8] = 'white'
colors[16] = 'white'
colors[32] = 'white'
colors[64] = 'white'
colors[128] = '#2c3e50'
colors[256] = '#fff'
colors[512] = '#fff'
colors[1024] = '#eee'
colors[2048] = '#212121'
colors[4096] = '#000'

</script>

<template>
  <div ref="dom" class="Block" :class="`Block-${val}`">
    {{ val || '' }}
    <!-- <span class="pos">
      {{ x }}{{ y }}
    </span> -->
  </div>
</template>

<style>
.pos {
  position: absolute;

  right: 0;
  bottom: 0;

  opacity: .75;
  font-size: .75rem;
}

.Block {
  position: absolute;

  left: 0;
  top: 0;

  display: flex;

  align-items: center;
  justify-content: center;

  width: 23%;
  height: 23%;

  opacity: .75;
  transition: ease-in .125s;
  border-radius: 8px;
  background-color: #f6f6f6;
}

/* .Block-2 {
  background: rgb(238, 228, 218);
}

.Block-4 {
  background: rgb(237, 224, 200);
}

.Block-8 {
  background: rgb(242, 177, 121);
}

.Block-16 {
  background: rgb(245, 149, 99);
}

.Block-32 {
  background: rgb(245, 121, 66);
}

.Block-64 {
  background: rgb(245, 77, 16);
}

.Block-128 {
  background: rgb(250, 52, 42)
}

.Block-256 {
  background: rgb(250, 42, 62)
}

.Block-512 {
  background: rgb(250, 32, 52);
}

.Block-1024 {
  background: rgb(250, 18, 32);
}

.Block-2048 {
  background: rgb(250, 8, 12);
}

.Block-4096 {
  background: rgb(250, 0, 0);
} */
</style>

<route lang="yaml">
meta:
  layout: game
</route>
