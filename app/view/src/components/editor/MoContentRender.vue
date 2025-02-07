<script setup lang="ts">
import markdownit from 'markdown-it'
import '~/styles/markdown-style.css'

const props = defineProps<{
  modelValue: string
}>()

const md = markdownit({
  html: true,
  linkify: true,
  typographer: true,
})

const result = ref('')

watchEffect(() => {
  result.value = md.render(props.modelValue)
})
</script>

<template>
  <div class="MoContentRender">
    <div class="MoContentRender-Inner markdown-body" v-html="result" />
  </div>
</template>
