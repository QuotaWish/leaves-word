<script setup lang="ts">
const props = defineProps<{
  show: any,
  data: any,
}>()

</script>

<template>
  <div class="Records" :class="{ show }">
    <div class="Floater" />
    <p>累计计分：{{ data.cumulative_score }}</p>
    <p v-for="(item, index) in data.history">局次({{ index + 1 }})：{{ item.score }}</p>
    <p v-for="(item, index) in data.history">局次({{ index + 1 }})：{{ item.score }}</p>
  </div>
</template>

<style>
.Records.show {
  transform: translateY(0) scaleY(1);
}

.Floater {
  position: sticky;
  margin-bottom: 1rem;

  left: 50%;
  top: 0rem;

  width: 4rem;
  height: .5rem;

  border-radius: 8px;
  background-color: #161616A0;

  transform: translateX(-50%);
}

.Records {
  z-index: 10000;
  position: absolute;
  padding: 1rem;

  width: 100%;
  height: 90%;

  bottom: 0;

  color: #000;
  border-radius: 16px;
  background-color: #fff;

  transition: .25s;
  box-sizing: border-box;
  overflow-y: auto;
  overflow-x: hidden;
  transform: translateY(100%) scaleY(.8);
}
</style>
