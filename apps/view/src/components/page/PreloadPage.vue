<script lang="ts" setup>
const props = defineProps<{
  components: Component[];
}>();

const component = shallowRef<Component>();

/**
 * Preload 时机
 * 当前页面 mounted 的时候依次加载
 */
onMounted(async () => {
  for (const comp of props.components) {
    console.warn(`[PrelaodPage] Starting to preload page ${comp?.name}`);

    component.value = comp;

    await sleep(1667);
  }
});
</script>

<template>
  <div class="PreloadPage hidden">
    <component :is="component" />
  </div>
</template>
