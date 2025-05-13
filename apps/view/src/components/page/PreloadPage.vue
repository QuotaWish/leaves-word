<script lang="ts" setup>
const props = defineProps<{
  components: Component[];
}>();

const component = ref<Component>();

/**
 * Preload 时机
 * 当前页面 mounted 的时候依次加载
 */
onMounted(async () => {
  for (const comp of props.components) {
    console.warn(`[PrelaodPage] Starting to preload page ${comp?.name}`);

    component.value = comp;

    await sleep(16.67);
  }
});
</script>

<template>
  <div class="PreloadPage display-none">
    <component :is="component" />
  </div>
</template>
