<script setup lang="ts">
import { UseImage } from '@vueuse/components'
import { globalAuthStorage } from '~/modules/auth';

const props = defineProps<{
  src?: string
}>()

const avatar = computed(() => {
  return props.src || (globalAuthStorage.value.user.userAvatar) || '/avatar.jpg'
})
</script>

<template>
  <UseImage :src="avatar" class="UserAvatar">
    <template #placeholder>
      <Loading />
    </template>

    <template #error>
      <img src="/avatar.jpg" />
    </template>
  </UseImage>
</template>

<style lang="scss" scoped>
</style>