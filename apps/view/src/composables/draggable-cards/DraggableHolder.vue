<script setup lang="ts" generic="T extends Object">
import DraggableItem from "./DraggableItem.vue";

const props = defineProps<{
  list: T[];
}>();

const options = reactive({
  topOrder: 0,
  index: 0,
});

function getDisplayData(order: number) {
  if (!props.list.length) {
    return null;
  }

  return props.list[options.index + order];
}

function handleNext() {
  options.index += 1;
  options.topOrder = (options.topOrder + 1) % 4;
}
</script>

<template>
  <div class="DraggableHolder absolute-layout">
    <div class="DraggableHolder-Inner absolute-layout">
      <DraggableItem
        v-for="i in 4"
        :key="i"
        :active="options.topOrder + 1 === i"
        :order="i"
        :top-order="options.topOrder + 1"
        @next="handleNext"
      >
        {{ i }}
        <slot v-if="getDisplayData(i)" name="item" :data="getDisplayData(i)!" />
      </DraggableItem>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.DraggableHolder {
}
</style>
