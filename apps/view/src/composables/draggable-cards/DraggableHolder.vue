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

  const { index, topOrder } = options;
  const subOrder = Math.abs(topOrder - order + 1);

  return props.list[index + subOrder];
}

function handleNext() {
  options.index += 1;
  options.topOrder = (options.topOrder + 1) % 4;
}

function handlePrev() {
  options.index -= 1;
  options.topOrder = (options.topOrder - 1) % 4;
}

function handleReset() {
  options.index = 0;
  options.topOrder = 0;
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
        :has-next="list.length > options.index + 1"
        :display="!!getDisplayData(i)"
        @next="handleNext"
      >
        <slot v-if="getDisplayData(i)" name="item" :data="getDisplayData(i)!" />
      </DraggableItem>

      <button @click="handlePrev">Prev</button>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.DraggableHolder {
}
</style>
