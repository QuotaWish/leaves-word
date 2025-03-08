<script lang="ts" setup>
import Codemirror from 'codemirror-editor-vue3'
import type { Editor, EditorConfiguration } from 'codemirror'
import type { CmComponentRef } from 'codemirror-editor-vue3'
import 'codemirror/mode/javascript/javascript.js'

const props = defineProps<{
  modelValue: string
}>()

const emits = defineEmits<{
  (e: 'update:modelValue', value: string): void
}>()

const code = useVModel(props, 'modelValue', emits)

const cmRef = ref<CmComponentRef>()
const cmOptions: EditorConfiguration = {
  mode: 'javascript',
  readOnly: true,
}

function onChange(val: string, cm: Editor) {
  console.log(val)
  console.log(cm.getValue())
}

function onInput(val: string) {
  console.log(val)
}

function onReady(cm: Editor) {
  console.log(cm.focus())
}

onMounted(() => {
  setTimeout(() => {
    cmRef.value?.refresh()
  }, 1000)

  setTimeout(() => {
    cmRef.value?.cminstance.isClean()
  }, 3000)
})

onUnmounted(() => {
  cmRef.value?.destroy()
})
</script>

<template>
  <Codemirror
    ref="cmRef" v-model:value="code" :options="cmOptions" @change="onChange"
    @input="onInput" @ready="onReady"
  />
</template>
