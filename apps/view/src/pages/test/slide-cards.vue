<script setup lang="ts">
import DraggableHolder from "~/components/draggable-cards/DraggableHolder.vue";

const cards = reactive([
  {
    title: "hello",
    desc: "A word to express greetings.",
  },
  {
    title: "bye",
    desc: "A word to express good bye.",
  },
  {
    title: "thank you",
    desc: "A word to express thanks.",
  },
  {
    title: "sorry",
    desc: "A word to express sorry.",
  },
  {
    title: "leaf",
    desc: "A word to express leaf.",
  },
]);
</script>

<template>
  <RoutePage inner-class="flex items-center justify-center">
    <DraggableHolder :list="cards">
      <template #item="{ data }">
        <h1>{{ data.title }}</h1>
        <p>{{ data.desc }}</p>
      </template>
    </DraggableHolder>
  </RoutePage>
</template>
