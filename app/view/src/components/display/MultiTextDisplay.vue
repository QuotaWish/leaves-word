<script setup lang="ts">
const props = defineProps<{
  customClick?: () => void
}>()

function handleClick(e: MouseEvent) {
  e.stopPropagation()
  e.preventDefault()

  props.customClick?.()
}
</script>

<template>
  <div class="wrapper">
    <input id="exp1" class="exp" type="checkbox">
    <div class="text">
      <label class="btn" for="exp1" @click="handleClick" />
      <slot />
    </div>
  </div>
</template>

<style lang="scss" scoped>
.wrapper {
  display: flex;
  width: 100%;
  overflow: hidden;
}

.text {
  font-size: 1em;
  overflow: hidden;
  text-overflow: ellipsis;
  text-align: justify;
  /* display: flex; */
  /*   display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical; */
  position: relative;
  line-height: 1.5;
  max-height: 4.5em;
  transition: 0.3s max-height;
}

.text::before {
  content: '';
  height: calc(100% - 26px);
  float: right;
}

.text::after {
  content: '';
  width: 999vw;
  height: 999vw;
  position: absolute;
  box-shadow: inset calc(100px - 999vw) calc(30px - 999vw) 0 0 #fff;
  margin-left: -100px;
}

.btn {
  position: relative;
  float: right;
  clear: both;
  margin-left: 20px;
  font-size: 14px;
  padding: 0 8px;
  background: var(--theme-color);
  line-height: 24px;
  border-radius: 4px;
  color: #fff;
  cursor: pointer;
  /* margin-top: -30px; */
}

.btn::after {
  content: '展开';
}

.exp {
  display: none;
}

.exp:checked + .text {
  max-height: none;
}

.exp:checked + .text::after {
  visibility: hidden;
}

.exp:checked + .text .btn::before {
  visibility: hidden;
}

.exp:checked + .text .btn::after {
  content: '收起';
}

.btn::before {
  content: '...';
  position: absolute;
  left: -5px;
  color: #333;
  transform: translateX(-100%);
}
</style>
