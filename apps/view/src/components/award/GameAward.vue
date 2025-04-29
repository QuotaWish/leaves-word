<script setup lang="ts">
import WordAward from './WordAward.vue';
export type AwardType = 'words' | 'questions' | 'time'

const props = defineProps<{
  type: AwardType,
  count: number,
  deduct?: boolean,
  desc: string,
  close: any
}>()

const options = reactive<any>({
  display: false,
  curCnt: 1,
  comp: WordAward,
  ans: []
})

const mainDom = ref()
const awardDom = ref()

function sleep(time: number) {
  return new Promise(resolve => setTimeout(resolve, time))
}

async function animateAward(func: Function): Promise<any> {
  const el = mainDom.value
  if (!el) return nextTick(() => animateAward(func))

  el.style.transform = 'translateX(0) scale(.8)'

  await sleep(250)

  el.style.opacity = '0'
  el.style.transform = 'translateX(-100%) scale(.8)'

  await sleep(200)

  el.style.transform = 'translateX(100%) scale(.8)'

  await sleep(100)

  func(async () => {
    await sleep(200)
    el.style.opacity = '1'
    el.style.transform = 'translateX(0) scale(.8)'

    await sleep(250)

    el.style.transform = 'translateX(0) scale(1)'
  })
}

function handleSuccess(options: {
  done: boolean,
  success: boolean[]
}) {

}

async function handleClick() {
  if (options.display) return

  const res = awardDom.value.handleClick()

  options.ans.push(res)

  if (!res) {
    options.display = true

    await sleep(2200)

    options.display = false
  }

  animateAward(async (func: any) => {
    options.comp = null

    await sleep(50)

    options.comp = WordAward

    await sleep(50)

    options.curCnt += 1
    if (options.curCnt > props.count) {
      // 全部答完 判断是不是都正确
      const allRight = options.ans.every((v: any) => v)

      props.close(allRight)
      return
    }
    func()
  })
}

provide('animateAward', animateAward)
</script>

<template>
  <div class="Award-Container">
    <div class="Award-Head">
      <p class="title">完成 {{ count }} 个挑战可以</p>
      <p>{{ desc }}</p>
    </div>
    <div ref="mainDom" class="Award-Main">
      <component :is="options.comp" ref="awardDom" :display="options.display" :count="count" @success="handleSuccess" />
    </div>
    <div :class="{ disabled: options.display }" class="Award-Button" @click="handleClick">
      <button>{{ options.curCnt < count ? `下一题` : `确认` }}</button>
          <span />
    </div>
  </div>
</template>

<style>
div.Award-Button.disabled {
  opacity: .75;
  cursor: not-allowed;
}

.Award-Container span {
  position: absolute;
  display: block;

  width: 100%;
  height: 100%;

  bottom: 0;
}

@keyframes btn-anim1 {
  0% {
    left: -100%;
  }

  50%,
  100% {
    left: 100%;
  }
}

.Award-Container span {
  bottom: 2px;
  left: -100%;
  width: 100%;
  height: 2px;
  background: linear-gradient(90deg, transparent, red);
  animation: btn-anim1 2s linear infinite;
}

.Award-Button {
  position: relative;
  display: flex;
  padding: .5rem .5rem;

  align-items: center;
  justify-content: center;

  width: 100%;
  border-radius: 8px;
  overflow: hidden;
}

.Award-Head p.title {
  font-weight: 600;
  font-size: 1.25rem;
}

.Award-Head {
  width: 100%;
  text-align: center;
}

.AwardInner {
  display: flex;

  width: 100%;
  flex-direction: column;
  align-items: center;
  justify-content: center;

  gap: 1rem;
}

.Award-Main p.Title {
  margin: 1rem 0;

  font-size: 1rem;
  font-weight: 600;
}

.Award-Main {
  display: flex;

  flex: 1;

  gap: .5rem;
  width: 100%;
  align-items: center;
  justify-content: center;

  transition: .25s;
}

.Award-Container {
  position: absolute;
  padding: 1rem 2rem;
  display: flex;

  align-items: center;
  flex-direction: column;
  justify-content: center;

  top: 20%;
  left: 10%;

  width: 80%;
  height: 60%;

  color: #fff;
  overflow: hidden;
  border-radius: 8px;
  backdrop-filter: blur(18px) saturate(180%);
  background-color: #ffffff50;
}
</style>
