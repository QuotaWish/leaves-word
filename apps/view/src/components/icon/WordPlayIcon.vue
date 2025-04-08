<script setup lang="ts">
import { useWordSound } from '~/modules/words'

const props = defineProps<{
  word: string
}>()

const active = ref(false)
const sound = ref<HTMLAudioElement>()
async function handlePlay() {
  active.value = true

  sound.value?.pause()

  sound.value = await useWordSound(props.word)

  await sound.value.play()

  const duration = sound.value.duration * 1000

  await sleep(duration + 200)

  active.value = false
}

watchEffect(() => {
  const _ = props.word

  setTimeout(() => {
    sound.value?.pause()
  })
})
</script>

<template>
  <PlayIcon :active="active" @click="handlePlay" />
</template>

<style lang="scss">
</style>
